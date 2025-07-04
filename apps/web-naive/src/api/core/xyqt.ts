import type { SubjectPage } from '@vben/types';

import { requestClient } from '../request';

export async function getAllSubjects({ page = 1, pageSize = 10 }) {
  return await requestClient.get<SubjectPage>(
    `/textbook/subjects?page=${page}&pageSize=${pageSize}`,
  );
}

export async function deleteSubject(id: number) {
  return await requestClient.delete('/textbook/subjects', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id,
    },
  });
}
