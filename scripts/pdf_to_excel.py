#!/usr/bin/env python3
"""Extract the Maharashtra NEET-UG candidate list PDF into Excel-ready data.

The PDF is treated only as source data. Workbook authoring is delegated to
build_candidate_workbook.mjs so the final .xlsx is created with the bundled
spreadsheet artifact tool.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import shutil
import subprocess
import sys
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any

import pdfplumber


COLUMNS = [
    "Sr. No.",
    "NEET All India Rank",
    "NEET Roll No.",
    "CET Cell Online Form No.",
    "Name of the Candidate",
    "Gender",
    "Category",
    "NRI",
    "Specified Reservation",
    "Candidate Type",
    "Remark",
]

VALIDATION_COLUMNS = [
    "Page Number",
    "Sr. No.",
    "Extracted Data / Problem",
    "Reason for Flagging",
    "Suggested Manual Review",
]

# Fixed table geometry observed across the PDF. Boundaries use word center-x.
COLUMN_RANGES = [
    ("Sr. No.", 0.0, 50.0),
    ("NEET All India Rank", 50.0, 100.0),
    ("NEET Roll No.", 100.0, 155.0),
    ("CET Cell Online Form No.", 155.0, 215.0),
    ("Name of the Candidate", 215.0, 340.0),
    ("Gender", 340.0, 370.0),
    ("Category", 370.0, 410.0),
    ("NRI", 410.0, 450.0),
    ("Specified Reservation", 450.0, 500.0),
    ("Candidate Type", 500.0, 545.0),
    ("Remark", 545.0, 610.0),
]

BODY_TOP = 95.0
BODY_BOTTOM = 745.0
ROW_TOP_PAD = 2.4
ROW_BOTTOM_PAD = ROW_TOP_PAD
WORD_LINE_TOLERANCE = 2.5

HEADER_FOOTER_TERMS = re.compile(
    r"Sr\.?No|Government|Maharashtra|STATE COMMON|Registered Candidate|"
    r"Page\s+\d+\s+of|Disclaimer|Coursewise|Information Broucher|"
    r"Admission Subject|Original Certificates",
    re.IGNORECASE,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract all records from the MBBS/BDS registered candidate list PDF."
    )
    parser.add_argument("pdf_path", type=Path, help="Path to the source PDF")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("outputs") / "reg_grpa_r1_candidate_list",
        help="Directory for workbook and intermediate validation files",
    )
    parser.add_argument(
        "--output-name",
        default="NEET_UG_2026_Maharashtra_Candidate_List.xlsx",
        help="Final Excel workbook file name",
    )
    parser.add_argument(
        "--expected-pages",
        type=int,
        default=848,
        help="Expected PDF page count for validation",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Reuse completed page checkpoints in the output directory",
    )
    parser.add_argument(
        "--no-workbook",
        action="store_true",
        help="Extract and validate only; do not build the .xlsx workbook",
    )
    parser.add_argument(
        "--node",
        type=Path,
        default=None,
        help="Node.js executable to use for workbook generation",
    )
    return parser.parse_args()


def word_center_x(word: dict[str, Any]) -> float:
    return (float(word["x0"]) + float(word["x1"])) / 2.0


def append_jsonl(path: Path, obj: dict[str, Any]) -> None:
    with path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + "\n")


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    rows: list[dict[str, Any]] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def group_cell_text(words: list[dict[str, Any]]) -> str:
    if not words:
        return ""
    ordered = sorted(words, key=lambda w: (float(w["top"]), float(w["x0"])))
    lines: list[list[dict[str, Any]]] = []
    for word in ordered:
        if not lines or abs(float(word["top"]) - float(lines[-1][0]["top"])) > WORD_LINE_TOLERANCE:
            lines.append([word])
        else:
            lines[-1].append(word)

    line_texts: list[str] = []
    for line in lines:
        line_texts.append(" ".join(str(w["text"]) for w in sorted(line, key=lambda w: float(w["x0"]))))
    return " ".join(part for part in line_texts if part).strip()


def column_for_word(word: dict[str, Any]) -> str | None:
    center = word_center_x(word)
    for column, left, right in COLUMN_RANGES:
        if left <= center < right:
            return column
    return None


def is_record_start(word: dict[str, Any]) -> bool:
    text = str(word["text"])
    return (
        BODY_TOP <= float(word["top"]) <= BODY_BOTTOM
        and float(word["x0"]) < 45.0
        and float(word["x1"]) < 50.0
        and re.fullmatch(r"\d{1,6}", text) is not None
    )


def extract_page(page: Any, page_number: int) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    words = page.extract_words(
        x_tolerance=1,
        y_tolerance=3,
        keep_blank_chars=False,
        use_text_flow=False,
    )
    words = [w for w in words if str(w.get("text", "")).strip()]
    starts = sorted((w for w in words if is_record_start(w)), key=lambda w: float(w["top"]))

    records: list[dict[str, Any]] = []
    orphan_text = ""
    if starts:
        first_top = float(starts[0]["top"])
        orphan_words = [
            w
            for w in words
            if BODY_TOP <= float(w["top"]) < first_top - ROW_TOP_PAD
            and word_center_x(w) >= 215.0
            and not HEADER_FOOTER_TERMS.search(str(w["text"]))
        ]
        orphan_text = group_cell_text(orphan_words)

    for index, start in enumerate(starts):
        row_top = float(start["top"])
        next_top = float(starts[index + 1]["top"]) if index + 1 < len(starts) else BODY_BOTTOM
        row_words = [
            w
            for w in words
            if row_top - ROW_TOP_PAD <= float(w["top"]) < next_top - ROW_BOTTOM_PAD
            and 0.0 <= float(w["x0"]) < 610.0
        ]

        buckets: dict[str, list[dict[str, Any]]] = {column: [] for column in COLUMNS}
        for word in row_words:
            column = column_for_word(word)
            if column:
                buckets[column].append(word)

        record = {column: group_cell_text(buckets[column]) for column in COLUMNS}
        record["_page"] = page_number
        record["_source_top"] = round(row_top, 2)
        records.append(record)

    status = {
        "page": page_number,
        "char_count": len(page.chars),
        "selectable_text": len(page.chars) > 0,
        "record_count": len(records),
        "first_sr": records[0]["Sr. No."] if records else "",
        "last_sr": records[-1]["Sr. No."] if records else "",
        "orphan_text_before_first_record": orphan_text,
        "error": "",
    }
    return records, status


def sorted_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    def key(record: dict[str, Any]) -> tuple[int, int, float]:
        sr_text = str(record.get("Sr. No.", ""))
        sr = int(sr_text) if sr_text.isdigit() else 10**9
        return (int(record.get("_page", 10**9)), sr, float(record.get("_source_top", 10**9)))

    return sorted(records, key=key)


def add_flag(
    flags: list[dict[str, Any]],
    page: int | str,
    sr_no: str,
    problem: str,
    reason: str,
    review: str,
) -> None:
    flags.append(
        {
            "Page Number": page,
            "Sr. No.": sr_no,
            "Extracted Data / Problem": problem,
            "Reason for Flagging": reason,
            "Suggested Manual Review": review,
        }
    )


def validate_records(
    records: list[dict[str, Any]],
    page_statuses: list[dict[str, Any]],
    total_pages: int,
    expected_pages: int,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    flags: list[dict[str, Any]] = []
    records = sorted_records(records)

    if total_pages != expected_pages:
        add_flag(
            flags,
            "",
            "",
            f"PDF page count is {total_pages}; expected {expected_pages}",
            "The source page count does not match the requested page count.",
            "Confirm the correct PDF was supplied before using the workbook.",
        )

    status_by_page = {int(status["page"]): status for status in page_statuses}
    for page_number in range(1, total_pages + 1):
        status = status_by_page.get(page_number)
        if not status:
            add_flag(
                flags,
                page_number,
                "",
                "Page was not processed",
                "No page checkpoint exists for this page.",
                "Rerun extraction for this page and compare against the PDF.",
            )
            continue
        if status.get("error"):
            add_flag(
                flags,
                page_number,
                "",
                status["error"],
                "Extraction raised an exception for this page.",
                "Inspect the page manually and rerun extraction after fixing the parser.",
            )
        if not status.get("selectable_text"):
            add_flag(
                flags,
                page_number,
                "",
                "Page has no selectable text",
                "Direct text extraction found no text layer.",
                "Use OCR for this page and compare the OCR result against the image.",
            )
        if int(status.get("record_count") or 0) == 0:
            add_flag(
                flags,
                page_number,
                "",
                "Page produced zero candidate records",
                "A candidate-list page is expected to contain records.",
                "Inspect the page image and extraction text for this page.",
            )
        orphan_text = str(status.get("orphan_text_before_first_record") or "").strip()
        if orphan_text:
            add_flag(
                flags,
                page_number,
                "",
                orphan_text[:250],
                "Body text appears before the first detected Sr. No.; this may be a cross-page continuation.",
                "Check the page boundary and decide whether the text belongs to the previous record.",
            )

    mandatory_columns = [
        "Sr. No.",
        "NEET All India Rank",
        "NEET Roll No.",
        "CET Cell Online Form No.",
        "Name of the Candidate",
        "Gender",
        "Category",
        "Candidate Type",
    ]
    valid_candidate_types = {
        "State",
        "OMS",
        "Both",
        "State (converted)",
        "OMS (converted)",
        "Both (converted)",
    }

    sr_counter: Counter[str] = Counter()
    roll_counter: Counter[str] = Counter()
    form_counter: Counter[str] = Counter()
    record_counter: Counter[tuple[str, ...]] = Counter()

    for record in records:
        page = int(record.get("_page", 0) or 0)
        sr_no = str(record.get("Sr. No.", "")).strip()
        sr_counter[sr_no] += 1
        roll = str(record.get("NEET Roll No.", "")).strip()
        form = str(record.get("CET Cell Online Form No.", "")).strip()
        if roll:
            roll_counter[roll] += 1
        if form:
            form_counter[form] += 1

        record_key = tuple(str(record.get(column, "")) for column in COLUMNS[1:])
        record_counter[record_key] += 1

        missing = [column for column in mandatory_columns if not str(record.get(column, "")).strip()]
        if missing:
            add_flag(
                flags,
                page,
                sr_no,
                f"Missing mandatory field(s): {', '.join(missing)}",
                "Required candidate fields were blank after extraction.",
                "Compare this row against the PDF and repair the missing field if needed.",
            )

        if not re.fullmatch(r"\d+", sr_no):
            add_flag(flags, page, sr_no, "Invalid Sr. No.", "Sr. No. is not all digits.", "Compare this row against the PDF.")
        if not re.fullmatch(r"\d+", str(record.get("NEET All India Rank", ""))):
            add_flag(flags, page, sr_no, "Invalid NEET All India Rank", "Rank is not all digits.", "Compare this row against the PDF.")
        if roll and not re.fullmatch(r"\d{10}", roll):
            add_flag(flags, page, sr_no, roll, "NEET Roll No. is not exactly 10 digits.", "Compare this identifier against the PDF.")
        if form and not re.fullmatch(r"\d{9}", form):
            add_flag(flags, page, sr_no, form, "CET Cell Online Form No. is not exactly 9 digits.", "Compare this identifier against the PDF.")
        if str(record.get("Gender", "")).strip() not in {"M", "F"}:
            add_flag(flags, page, sr_no, str(record.get("Gender", "")), "Gender is not M or F.", "Compare this row against the PDF.")

        candidate_type = str(record.get("Candidate Type", "")).strip()
        if candidate_type and candidate_type not in valid_candidate_types:
            add_flag(
                flags,
                page,
                sr_no,
                candidate_type,
                "Candidate Type is outside the values observed in the table structure.",
                "Compare this value against the PDF.",
            )

        name = str(record.get("Name of the Candidate", "")).strip()
        if name and (len(name) < 3 or len(name) > 100):
            add_flag(
                flags,
                page,
                sr_no,
                name,
                "Candidate name length is unusually short or long.",
                "Compare the full wrapped name against the PDF.",
            )

        combined_text = " | ".join(str(record.get(column, "")) for column in COLUMNS)
        if HEADER_FOOTER_TERMS.search(combined_text):
            add_flag(
                flags,
                page,
                sr_no,
                combined_text[:250],
                "Header/footer text appears in a candidate row.",
                "Remove the non-record text or repair the row split.",
            )

    previous = 0
    for record in records:
        sr_text = str(record.get("Sr. No.", "")).strip()
        if not sr_text.isdigit():
            continue
        sr = int(sr_text)
        if previous and sr != previous + 1:
            if sr > previous + 1:
                missing_range = f"{previous + 1}" if sr == previous + 2 else f"{previous + 1}-{sr - 1}"
                add_flag(
                    flags,
                    int(record.get("_page", 0) or 0),
                    sr_text,
                    f"Missing Sr. No. range before this row: {missing_range}",
                    "Sr. No. sequence has a gap.",
                    "Inspect the page boundary and adjacent rows in the PDF.",
                )
            else:
                add_flag(
                    flags,
                    int(record.get("_page", 0) or 0),
                    sr_text,
                    f"Out-of-order Sr. No.; previous value was {previous}",
                    "Sr. No. sequence decreased or repeated.",
                    "Inspect the extraction order and duplicate rows.",
                )
        previous = max(previous, sr)

    for sr_no, count in sr_counter.items():
        if sr_no and count > 1:
            page_list = sorted({int(r.get("_page", 0) or 0) for r in records if str(r.get("Sr. No.", "")) == sr_no})
            add_flag(
                flags,
                ",".join(map(str, page_list)),
                sr_no,
                f"Duplicate Sr. No. appears {count} times",
                "Sr. No. should be unique in the registered candidate list.",
                "Compare each duplicate row against the PDF and keep one row only if appropriate.",
            )

    for field_name, counter in [("NEET Roll No.", roll_counter), ("CET Cell Online Form No.", form_counter)]:
        for value, count in counter.items():
            if value and count > 1:
                matches = [r for r in records if str(r.get(field_name, "")) == value]
                add_flag(
                    flags,
                    ",".join(str(int(r.get("_page", 0) or 0)) for r in matches[:5]),
                    ",".join(str(r.get("Sr. No.", "")) for r in matches[:5]),
                    f"Duplicate {field_name}: {value}",
                    f"{field_name} appears {count} times.",
                    "Compare duplicate identifiers against the PDF.",
                )

    for key, count in record_counter.items():
        if count > 1:
            matches = [r for r in records if tuple(str(r.get(column, "")) for column in COLUMNS[1:]) == key]
            add_flag(
                flags,
                ",".join(str(int(r.get("_page", 0) or 0)) for r in matches[:5]),
                ",".join(str(r.get("Sr. No.", "")) for r in matches[:5]),
                "Duplicate candidate record",
                "All non-Sr. No. candidate fields are identical in multiple rows.",
                "Compare duplicate rows against the PDF.",
            )

    issue_srs = {
        str(flag["Sr. No."])
        for flag in flags
        if str(flag.get("Sr. No.", "")).strip() and re.fullmatch(r"\d+", str(flag.get("Sr. No.", "")))
    }
    failed_pages = [int(status["page"]) for status in page_statuses if status.get("error")]
    zero_record_pages = [int(status["page"]) for status in page_statuses if int(status.get("record_count") or 0) == 0]
    ocr_pages = [int(status["page"]) for status in page_statuses if not status.get("selectable_text")]
    duplicate_issue_count = sum(
        1
        for flag in flags
        if "Duplicate" in str(flag.get("Extracted Data / Problem", ""))
        or "duplicate" in str(flag.get("Reason for Flagging", ""))
    )
    missing_invalid_issue_count = sum(
        1
        for flag in flags
        if re.search(r"Missing|Invalid|not exactly|not all digits|zero candidate", str(flag), re.IGNORECASE)
    )

    summary = {
        "Source PDF": "",
        "Extraction Method": "Selectable text coordinate extraction with pdfplumber; OCR not required for text-layer pages.",
        "Total PDF Pages": total_pages,
        "Expected PDF Pages": expected_pages,
        "Pages Successfully Processed": len(page_statuses) - len(failed_pages),
        "Pages Requiring OCR": len(ocr_pages),
        "Total Candidate Records Extracted": len(records),
        "First Sr. No.": records[0]["Sr. No."] if records else "",
        "Last Sr. No.": records[-1]["Sr. No."] if records else "",
        "Duplicate Records Detected": duplicate_issue_count,
        "Suspicious Records Detected": len(issue_srs),
        "Missing/Invalid Records": missing_invalid_issue_count,
        "Validation Issues": len(flags),
        "Flagged Pages Requiring Manual Review": len({str(f["Page Number"]) for f in flags if str(f["Page Number"]).strip()}),
        "Pages With Zero Records": len(zero_record_pages),
        "Failed Pages": len(failed_pages),
        "Extraction Timestamp": datetime.now().astimezone().isoformat(timespec="seconds"),
    }
    return flags, summary


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in fieldnames})


def find_node(node_arg: Path | None) -> str:
    if node_arg:
        return str(node_arg)
    bundled = Path(
        r"C:\Users\office\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
    )
    if bundled.exists():
        return str(bundled)
    node = shutil.which("node")
    if node:
        return node
    raise RuntimeError("Node.js was not found; pass --node to generate the workbook.")


def ensure_artifact_tool_resolution(script_dir: Path) -> None:
    link_path = script_dir / "node_modules"
    if link_path.exists():
        return
    target = Path(
        r"C:\Users\office\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules"
    )
    if not target.exists():
        return
    if os.name == "nt":
        completed = subprocess.run(
            ["cmd", "/c", "mklink", "/J", str(link_path), str(target)],
            text=True,
            capture_output=True,
        )
        if completed.returncode != 0 and not link_path.exists():
            raise RuntimeError(completed.stderr.strip() or completed.stdout.strip())
    else:
        link_path.symlink_to(target, target_is_directory=True)


def build_workbook(data_json: Path, output_xlsx: Path, output_dir: Path, node_path: str) -> None:
    script_dir = Path(__file__).resolve().parent
    ensure_artifact_tool_resolution(script_dir)
    builder = script_dir / "build_candidate_workbook.mjs"
    if not builder.exists():
        raise RuntimeError(f"Workbook builder not found: {builder}")
    cmd = [node_path, str(builder), str(data_json), str(output_xlsx), str(output_dir)]
    subprocess.run(cmd, check=True)


def run() -> int:
    args = parse_args()
    pdf_path = args.pdf_path.resolve()
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        return 2

    output_dir = args.output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    records_path = output_dir / "candidate_records.jsonl"
    page_status_path = output_dir / "page_status.jsonl"
    validation_csv_path = output_dir / "validation_report.csv"
    extraction_json_path = output_dir / "extraction_payload.json"
    summary_json_path = output_dir / "extraction_summary.json"
    output_xlsx = output_dir / args.output_name

    if not args.resume:
        for path in [records_path, page_status_path, validation_csv_path, extraction_json_path, summary_json_path]:
            if path.exists():
                path.unlink()

    completed_statuses = read_jsonl(page_status_path) if args.resume else []
    completed_pages = {int(status["page"]) for status in completed_statuses if not status.get("error")}
    completed_records = [
        record for record in read_jsonl(records_path) if int(record.get("_page", 0) or 0) in completed_pages
    ]

    if args.resume and completed_pages:
        print(f"Resuming from checkpoints for {len(completed_pages)} page(s).")

    page_statuses_by_page = {int(status["page"]): status for status in completed_statuses}
    records_by_page: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for record in completed_records:
        records_by_page[int(record.get("_page", 0) or 0)].append(record)

    with pdfplumber.open(str(pdf_path)) as pdf:
        total_pages = len(pdf.pages)
        for page_index, page in enumerate(pdf.pages, start=1):
            if page_index in completed_pages:
                print(f"Processing page {page_index}/{total_pages} - checkpoint reused", flush=True)
                continue

            print(f"Processing page {page_index}/{total_pages}", flush=True)
            try:
                page_records, status = extract_page(page, page_index)
                for record in page_records:
                    append_jsonl(records_path, record)
                append_jsonl(page_status_path, status)
                page_statuses_by_page[page_index] = status
                records_by_page[page_index] = page_records
            except Exception as exc:  # Keep the full run alive for manual review.
                status = {
                    "page": page_index,
                    "char_count": 0,
                    "selectable_text": False,
                    "record_count": 0,
                    "first_sr": "",
                    "last_sr": "",
                    "orphan_text_before_first_record": "",
                    "error": f"{type(exc).__name__}: {exc}",
                }
                append_jsonl(page_status_path, status)
                page_statuses_by_page[page_index] = status
                print(f"ERROR page {page_index}: {status['error']}", file=sys.stderr)

    page_statuses = [page_statuses_by_page[p] for p in sorted(page_statuses_by_page)]
    records = []
    for page in sorted(records_by_page):
        records.extend(records_by_page[page])
    records = sorted_records(records)

    flags, summary = validate_records(records, page_statuses, total_pages, args.expected_pages)
    summary["Source PDF"] = str(pdf_path)
    summary["Output Workbook"] = str(output_xlsx)
    summary["Validation Report CSV"] = str(validation_csv_path)

    write_csv(validation_csv_path, VALIDATION_COLUMNS, flags)
    with summary_json_path.open("w", encoding="utf-8") as fh:
        json.dump(summary, fh, indent=2, ensure_ascii=False)

    payload = {
        "columns": COLUMNS,
        "records": [{column: record.get(column, "") for column in COLUMNS} for record in records],
        "validationColumns": VALIDATION_COLUMNS,
        "validationRows": flags,
        "summary": summary,
    }
    with extraction_json_path.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False)

    print(f"Extracted records: {len(records)}")
    print(f"Validation issues: {len(flags)}")
    print(f"Validation report: {validation_csv_path}")

    if not args.no_workbook:
        node_path = find_node(args.node)
        build_workbook(extraction_json_path, output_xlsx, output_dir, node_path)
        print(f"Workbook: {output_xlsx}")

    return 0


if __name__ == "__main__":
    raise SystemExit(run())
