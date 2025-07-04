<script setup lang="ts">
import type { SubjectItem } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { alert, confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { NButton, NCard, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteSubject, getAllSubjects } from '#/api/core/xyqt';

const gridOptions: VxeGridProps<SubjectItem> = {
  columns: [
    { type: 'seq', width: 80 },
    {
      field: 'name',
      title: $t('page.subject.name'),
      editRender: { name: 'input' },
    },
    {
      slots: { default: 'action' },
      title: $t('page.button.action'),
      width: 'auto',
    },
  ],
  minHeight: 300,
  keepSource: true,
  id: 'id',
  toolbarConfig: {
    refresh: true,
    id: 'id',
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  border: true,
  proxyConfig: {
    seq: true,
    response: {
      result: ({ data }) => data.subjects,
      total: ({ data }) => data.count,
    },
    ajax: {
      query: async ({ page }) => {
        return await getAllSubjects({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const message = useMessage();
function hasEditStatus(row: SubjectItem) {
  return gridApi.grid?.isEditByRow(row);
}

function editRowEvent(row: SubjectItem) {
  gridApi.grid?.setEditRow(row);
}

async function saveRowEvent(row: SubjectItem) {
  await gridApi.grid?.clearEdit();

  gridApi.setLoading(true);
  setTimeout(() => {
    gridApi.setLoading(false);
    message.success(`${row.name} 保存成功`, {
      duration: 2000,
    });
  }, 600);
}
async function deleteRowEvent(row: SubjectItem) {
  confirm({
    content: `${$t('page.grid.removeRow')} : ${row.name}`,
    icon: 'warning',
  })
    .then(() => {
      confirm('删除后数据无法恢复，请谨慎操作！')
        .then(async () => {
          await deleteSubject(row.id)
            .then(() => gridApi.grid.remove(row))
            .catch((error) => message.error(error.message));
        })
        .catch(() => message.info('取消操作'));
    })
    .catch(() => {
      alert('您已取消');
    });
}

const cancelRowEvent = (_row: SubjectItem) => {
  gridApi.grid?.clearEdit();
};
</script>

<template>
  <Page>
    <!-- <template #title>科目列表</template> -->
    <template #default>
      <NCard class="mb-4">
        <NButton type="primary">{{ $t('common.create') }}</NButton>
      </NCard>
      <NCard>
        <Grid>
          <template #action="{ row }">
            <template v-if="hasEditStatus(row)">
              <NButton quaternary type="success" @click="saveRowEvent(row)">
                {{ $t('common.confirm') }}
              </NButton>
              <NButton quaternary type="error" @click="cancelRowEvent(row)">
                {{ $t('common.cancel') }}
              </NButton>
            </template>
            <template v-else>
              <NButton quaternary type="primary" @click="editRowEvent(row)">
                {{ $t('common.modify') }}
              </NButton>
              <NButton quaternary type="primary" @click="deleteRowEvent(row)">
                {{ $t('common.delete') }}
              </NButton>
            </template>
          </template>
        </Grid>
      </NCard>
    </template>
  </Page>
</template>

<style scoped></style>
