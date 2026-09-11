interface OutputType {
  label: string;
  value: string | string[];
  type: string;
  options?: string[];
}

interface Updates {
  user: string;
  comment: string;
  created: string;
}

interface ProfileSchema {
  data?: OutputType[];
  name?: string;
  phone?: string;
  user: string;
  status?: string;
  updates?: Updates[];
  bookmark?: boolean;
  note?: string;
}
