interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

interface SubjectItem {
  id: number;
  name: string;
  enable: boolean;
}
interface SubjectPage {
  count: number;
  subjects: SubjectItem[];
}
interface VersionItem {
  id: number;
  name: string;
  pulisher: string;
  active: boolean;
}
interface BookItem {
  id: number;
  title: string;
  semester: string;
  image: string;
  active: boolean;
  grade_id: number;
  subject_id: number;
  version_id: number;
}

interface BookResponse extends BaseResponse {
  data: BookItem[];
}
export type {
  BaseResponse,
  BookItem,
  BookResponse,
  SubjectItem,
  SubjectPage,
  VersionItem,
};
