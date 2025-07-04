import type { EcdictPage, EcdictWord } from '@vben/types';

import { requestClient } from '#/api/request';

export async function ecdictWordsApi(words: string[]) {
  return requestClient.get<EcdictWord[]>('/ecdict', {
    params: { word: words },
    paramsSerializer: {
      serialize: (params) => {
        const searchParams = new URLSearchParams();
        params.word.forEach((word: string) => {
          searchParams.append('word', word);
        });
        return searchParams.toString();
      },
    },
  });
}

export async function ecdictWordsByPage(page: number, pageSize: number) {
  return await requestClient.get<EcdictPage>(
    `/ecdict/page?page=${page}&pageSize=${pageSize}`,
  );
}
