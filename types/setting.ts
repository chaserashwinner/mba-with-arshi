interface inputData {
  label: string;
  type: string;
  accept: any;
  required: boolean;
  options: string[];
}

interface tagData {
  icon: string;
  name: string;
}

interface collegeDataSchema {
  ownership: string[];
  facilities: tagData[];
  ratingTags: tagData[];
  ratingAgencies: tagData[];
}

interface SettingSchema {
  _id: string;
  ownership: string[];
  profileAnalysisForm: {
    data: inputData[];
    files: inputData[];
    status: string[];
  };
  collegeData: collegeDataSchema;
  streams: object[];
  data: object;
  keys: object;
  version: number;
  forcedUpdate: boolean;
  created: Date;
}
