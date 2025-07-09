import type { SubjectItem, SubjectPage } from '@vben/types';

import { requestClient } from '../request';

export async function getAllSubjects({ page = 1, pageSize = 10 }) {
  return await requestClient.get<SubjectPage>(
    `/textbook/subjects/page?page=${page}&pageSize=${pageSize}`,
  );
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
