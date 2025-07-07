interface SubjectItem {
  id: number;
  name: string;
  enable: boolean;
}
interface SubjectPage {
  count: number;
  subjects: SubjectItem[];
}

export type { SubjectItem, SubjectPage };
