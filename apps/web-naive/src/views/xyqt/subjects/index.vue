<script setup lang="ts">
import type { SubjectItem } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { alert, confirm, Page } from '@vben/common-ui';
import { MingAdd, MingDelete, MingSave, MingWarning } from '@vben/icons';
import { $t } from '@vben/locales';

import { NButton, NCard, NFlex, NMessageProvider, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAllSubjects } from '#/api/core/xyqt';

const gridOptions: VxeGridProps<SubjectItem> = {
  columns: [
    { field: 'checkbox', type: 'checkbox', fixed: 'left', width: 60 },
    { type: 'seq', maxWidth: 80, width: 60 },
    {
      field: 'name',
      title: $t('page.subject.name'),
      maxWidth: 350,
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'enable',
      title: $t('page.subject.status'),
      maxWidth: 200,
      width: 120,
      editRender: {
        name: 'VxeSelect',
        options: [
          { value: true, label: $t('page.subject.enable') },
          { value: false, label: $t('page.subject.disable') },
        ],
      },
    },
  ],
  minHeight: 300,
  id: 'id',
  toolbarConfig: {
    refresh: true,
    id: 'id',
    slots: {
      buttons: 'toolbarButtons',
    },
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  border: true,
  size: 'large',
  keepSource: true,
  proxyConfig: {
    seq: true,
    ajax: {
      query: async ({ page }) => {
        return await getAllSubjects({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
      delete: async ({ body }) => {
        return new Promise((resolve) => {
          message.warning(`删除功能未实现: ${JSON.stringify(body)}`);
          resolve({ code: 200 });
        });
      },
      save: async ({ body }) => {
        const tasks: Promise<any>[] = [];
        body.insertRecords?.map(async (record: SubjectItem) => {
          tasks.push(
            new Promise<any>((resolve) => {
              resolve({ id: record.id, method: 'insert' });
            }),
          );
        });
        return Promise.all(tasks);
      },
      saveSuccess: async ({ response }) => {
        alert({
          title: '提示',
          content: `保存成功${response.data}`,
        });
      },
      saveError: async () => {
        // TODO 错误处理
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const message = useMessage();
function hasPendingStatus(row: SubjectItem) {
  return gridApi.grid?.isPendingByRow(row);
}

async function deleteRowEvent() {
  const rows = gridApi.grid?.getCheckboxRecords();
  if (!rows || rows.length === 0) {
    message.error($t('page.subject.noSelected'));
    return;
  }
  confirm({
    title: `删除确认`,
    content: `您正在删除选中的 ${rows.length} 条数据，请确认是否删除？`,
    icon: MingWarning,
  })
    .then(async () => {
      await gridApi.grid
        ?.removeCheckboxRow()
        .then(async () => {
          message.success($t('page.subject.deleteInfo'));
        })
        .catch((error) => {
          message.error(error.message);
        });
    })
    .catch(() => {
      message.info('取消删除');
    });
}

const cancelPendingEvent = (row: SubjectItem) => {
  gridApi.grid?.setPendingRow(row, false);
};

const addRowEvent = () => {
  gridApi.grid?.insertAt({}, -1);
};

const saveEvent = () => {
  let insert = '新增的数据:';
  gridApi.grid?.getInsertRecords().forEach((item, index) => {
    insert += `${index + 1} : ${item.name} `;
  });
  confirm({
    title: $t('page.confirm.saveTitle'),
    content: `${$t('page.confirm.saveContent')}\n ${insert}`,
  })
    .then(() => {
      gridApi.grid?.commitProxy('save');
    })
    .catch(() => message.info($t('page.confirm.cancel')));
};
</script>

<template>
  <Page>
    <NMessageProvider>
      <!-- <template #title>科目列表</template> -->
      <template #default>
        <NCard>
          <Grid>
            <template #toolbarButtons>
              <NFlex>
                <NButton type="primary" @click="addRowEvent">
                  <template #icon>
                    <MingAdd />
                  </template>
                  {{ $t('common.create') }}
                </NButton>
                <NButton type="warning" @click="deleteRowEvent">
                  <template #icon>
                    <MingDelete />
                  </template>
                  {{ $t('common.delete') }}
                </NButton>
                <NButton type="success" @click="saveEvent">
                  <template #icon>
                    <MingSave />
                  </template>
                  {{ $t('page.button.save') }}
                </NButton>
              </NFlex>
            </template>
            <template #action="{ row }">
              <NButton
                v-if="!hasPendingStatus(row)"
                text
                type="primary"
                @click="deleteRowEvent()"
              >
                {{ $t('common.delete') }}
              </NButton>
              <NButton
                v-else
                text
                type="primary"
                @click="cancelPendingEvent(row)"
              >
                {{ $t('common.cancel') }}
              </NButton>
            </template>
          </Grid>
        </NCard>
      </template>
    </NMessageProvider>
  </Page>
</template>

<style scoped></style>
