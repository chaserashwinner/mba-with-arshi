// Interface for statusHistory entries
interface StatusHistoryEntry {
  user: string; // Replace with appropriate ID type
  status: string;
  created: string; // Or string if you prefer a string representation
}

// Interfaces for internalComments and updates entries
interface InternalComment {
  user: string; // Replace with appropriate ID type
  comment: string;
  created: Date; // Or string if you prefer a string representation
}

interface UpdateEntry {
  user: string; // Replace with appropriate ID type
  comment: string;
  created: Date; // Or string if you prefer a string representation
}

// Main interface for the Mentordata document
interface MentordataSchema {
  _id: string;
  paid: boolean;
  data: formDataSchema[];
  name: string;
  phone: string;
  user: string; // Replace with appropriate ID type
  counseller?: any; // Optional, replace with appropriate ID type
  mentorship: string; // Replace with appropriate ID type
  status: string;
  statusHistory: StatusHistoryEntry[];
  internalComments: InternalComment[];
  updates: UpdateEntry[];
  bookmark: boolean;
  note?: string; // Optional
  created: Date; // Or string if you prefer a string representation
  updated: Date; // Or string if you prefer a string representation
  archive: boolean;
}
