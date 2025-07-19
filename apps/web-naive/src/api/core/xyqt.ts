import type {
  BaseResponse,
  BookItem,
  SubjectItem,
  SubjectPage,
  VersionItem,
} from '@vben/types';

import { requestClient } from '../request';

export async function getSubjectsByPage({ page = 1, pageSize = 10 }) {
  return await requestClient.get<SubjectPage>(
    `/textbook/subjects/page?page=${page}&pageSize=${pageSize}`,
  );
}
export async function getSubjects() {
  return await requestClient.get<SubjectItem[]>('/textbook/subjects');
}

export async function deleteSubjects(ids: number[]) {
  return await requestClient.delete('/textbook/subjects', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids,
    },
  });
}

export async function createSubjects(subject: SubjectItem[]) {
  return await requestClient.post('/textbook/subjects', subject);
}

export async function updateSubjects(subject: SubjectItem[]) {
  return await requestClient.put('/textbook/subjects', subject);
}

export async function getLevel() {
  return await requestClient.get('/textbook/levels');
}

export async function getGrade(parmas: any) {
  return await requestClient.get('/textbook/grades', {
    params: {
      level_id: parmas.type,
    },
  });
}

export async function getBooks(params: {
  grade_id: number;
  subject_id: number;
  version_id: number;
}) {
  return await requestClient.get('/textbook/books', {
    params: {
      version_id: params.version_id,
      grade_id: params.grade_id,
      subject_id: params.subject_id,
    },
  });
}

export async function createBooks(params: BookItem[]) {
  const res = await requestClient.post('/textbook/books', params, {
    responseReturn: 'raw',
  });
  return res;
}

export async function deleteBooks(ids: number[]) {
  return await requestClient.delete<BaseResponse>('/textbook/books', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ids },
    responseReturn: 'raw',
  });
}

export async function updateBooks(params: BookItem[]) {
  return await requestClient.put('/textbook/books', params, {
    responseReturn: 'raw',
  });
}

export async function getVersion(params: { subject_id: number }) {
  return await requestClient.get<VersionItem[]>('/textbook/versions', {
    params: { subject_id: params.subject_id },
  });
}

export async function getVersionRaw(params: { subject_id: number }) {
  return await requestClient.get<BaseResponse>('/textbook/versions', {
    params: { subject_id: params.subject_id },
    responseReturn: 'raw',
  });
}
