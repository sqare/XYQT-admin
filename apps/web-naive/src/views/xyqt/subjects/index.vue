<script setup lang="ts">
import type { SubjectItem } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { confirm, Page } from '@vben/common-ui';
import { MingAdd, MingDelete, MingSave, MingWarning } from '@vben/icons';
import { $t } from '@vben/locales';

import { NButton, NCard, NFlex, NMessageProvider, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createSubjects,
  deleteSubjects,
  getSubjectsByPage,
  updateSubjects,
} from '#/api/core/xyqt';

const gridOptions: VxeGridProps<SubjectItem> = {
  columns: [
    { field: 'checkbox', type: 'checkbox', fixed: 'left', width: 60 },
    { type: 'seq', maxWidth: 80, width: 60 },
    {
      field: 'name',
      title: $t('page.subject.name'),
      maxWidth: 350,
      minWidth: 150,
      editRender: { name: 'VxeInput' },
    },
    {
      field: 'enable',
      title: $t('page.subject.status'),
      maxWidth: 100,
      width: 80,
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
        return await getSubjectsByPage({
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
      save: async ({ body }) => {
        const tasks: Promise<any>[] = [];
        if (body.insertRecords.length > 0) {
          tasks.push(createSubjects(body.insertRecords));
        }
        if (body.updateRecords.length > 0) {
          tasks.push(updateSubjects(body.updateRecords));
        }
        if (body.removeRecords.length > 0) {
          tasks.push(deleteSubjects(body.removeRecords.map((item) => item.id)));
        }
        return Promise.all(tasks);
      },
      saveSuccess: async () => {
        message.success('保存成功');
      },
      saveError: async () => {
        // TODO 错误处理
        message.error('保存错误');
      },
    },
  },
  editRules: {
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
    ],
    enable: [
      {
        required: true,
        content: '必须填写',
        message: '请选择是否启用',
        trigger: 'change',
      },
      {
        validator({ cellValue }) {
          if (cellValue === null) {
            return new Error('请选择是否启用');
          }
        },
      },
    ],
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
  const created_number = gridApi.grid?.getInsertRecords().length;
  const created = created_number > 0 ? `新增${created_number}条` : '';
  const updated_number = gridApi.grid?.getUpdateRecords().length;
  const updated = updated_number > 0 ? `更新${updated_number}条` : '';
  const deleted_number = gridApi.grid?.getRemoveRecords().length;
  const deleted = deleted_number > 0 ? `删除${deleted_number}条` : '';
  if (created_number === 0 && updated_number === 0 && deleted_number === 0) {
    message.info($t('page.subject.noChange'));
    return;
  }
  const content = `${created + updated + deleted}数据，是否保存？`;
  confirm({
    title: $t('page.confirm.saveTitle'),
    content,
  })
    .then(() => {
      gridApi.grid?.commitProxy('save');
    })
    .catch(() => message.info($t('page.confirm.cancel')));
};
</script>

<template>
  <Page title="学科列表" description="编辑表格后保存">
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
