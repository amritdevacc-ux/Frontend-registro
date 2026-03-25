export interface Grade {
  subjectId: number;
  subjectDesc: string;
  displayValue: string;
  decimalValue: number;
  evtDate: string;
  notesForFamily: string;
  color: string;
  componentDesc: string;
  periodPos: number;
  periodDesc: string;
}

export interface Lesson {
  lessonId: number;
  subjectDesc: string;
  teacherDesc: string;
  lessonType: string;
  lessonArg: string;
  evtDatetimeBegin: string;
  evtDatetimeEnd: string;
}

export interface Absence {
  evtId: number;
  evtDate: string;
  evtCode: string;
  evtDesc: string;
  isJustified: boolean;
}

export interface Period {
  periodPos: number;
  periodDesc: string;
  beginAt: string;
  endAt: string;
}

export interface LoginResponse {
  token: string;
  ident: string;
  firstName: string;
  lastName: string;
  release: string;
  expire: string;
  loginType?: string;
}

export interface SubjectAverage {
  subject: string;
  average: number;
  grades: Grade[];
}
