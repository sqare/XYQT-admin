interface SubjectItem {
  id: number;
  name: string;
}
interface SubjectPage {
  count: number;
  subjects: SubjectItem[];
}

export type { SubjectItem, SubjectPage };
