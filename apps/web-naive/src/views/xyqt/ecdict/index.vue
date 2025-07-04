<script setup lang="ts">
import type { EcdictWord } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { NButton, NCard, NSpace } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { ecdictWordsByPage } from '#/api/core/ecdict';

const gridOptions: VxeGridProps<EcdictWord> = {
  columns: [
    { field: 'id', type: 'seq', title: $t('page.ecdict.id'), colId: 'id' },
    { field: 'word', title: $t('page.ecdict.word') },
    { field: 'translation', title: $t('page.ecdict.translation') },
    { field: 'phonetic', title: $t('page.ecdict.phonetic') },
    { field: 'tag', title: $t('page.ecdict.tag') },
    { field: 'definition', title: $t('page.ecdict.definition') },
    { field: 'pos', title: $t('page.ecdict.pos') },
    { field: 'bnc', title: $t('page.ecdict.bnc') },
    { field: 'frq', title: $t('page.ecdict.frq') },
    { field: 'oxford', title: $t('page.ecdict.oxford') },
    { field: 'collins', title: $t('page.ecdict.collins') },
    { field: 'exchange', title: $t('page.ecdict.exchange') },
    { field: 'detail', title: $t('page.ecdict.detail') },
    {
      field: 'audio',
      title: $t('page.ecdict.audio'),
      editRender: { name: 'audio' },
    },
  ],
  pagerConfig: {
    enabled: true,
    pageSizes: [10, 20, 50, 100],
    pageSize: 10,
  },
  sortConfig: {
    multiple: true,
  },
  id: 'id',
  round: true,
  keepSource: true,
  proxyConfig: {
    response: {
      result: ({ data }) => data.words,
      total: ({ data }) => data.total,
    },
    ajax: {
      query: async ({ page }) => {
        return await ecdictWordsByPage(page.currentPage, page.pageSize);
      },
    },
  },
  editConfig: {
    mode: 'row',
    showUpdateStatus: true,
    trigger: 'click',
  },
  minHeight: 600,
  toolbarConfig: {
    refresh: true,
  },
  showOverflow: true,
};

// const gridEvents: VxeGridListeners<EcdictWord> = {
//   cellClick: ({ row }) => {
//     console.warn(row);
//   },
// };
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>
<template>
  <Page>
    <NCard class="mb-4">
      <NSpace> Ecdict </NSpace>
    </NCard>
    <NCard>
      <Grid>
        <template #toolbar-tools>
          <NButton type="primary" @click="gridApi.reload">
            {{ $t('common.refresh') }}
          </NButton>
        </template>
      </Grid>
    </NCard>
  </Page>
</template>

<style scoped></style>
