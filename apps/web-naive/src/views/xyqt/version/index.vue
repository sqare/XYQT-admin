<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { NButton, NCard, NFlex, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSubjects, getVersionRaw } from '#/api/core/xyqt';

const message = useMessage();
const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'ApiSelect',
      fieldName: 'subject',
      label: '学科',
      rules: 'required',
      componentProps: {
        placeholder: '请输入学科',
        api: getSubjects,
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        immediate: true,
        lazy: true,
        visibleEvent: 'onFocus',
        onChange() {
          gridApi.grid?.remove();
        },
      },
    },
  ],
};

const gridOptions: VxeGridProps = {
  minHeight: 300,
  columns: [
    { type: 'checkbox', width: 60, maxWidth: 120 },
    { field: 'id', title: 'ID', width: 100, maxWidth: 120 },
    {
      title: '版本名称',
      field: 'name',
      editRender: { name: 'VxeInput' },
    },
    { slots: { default: 'action' }, title: '操作', width: 120, maxWidth: 120 },
  ],
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  proxyConfig: {
    showResponseMsg: true,
    ajax: {
      query: async () => {
        const form = await gridApi.formApi.getValues();
        if (!form.subject) {
          message.error('请先选择学科');
          return [];
        }
        return await getVersionRaw({ subject_id: form.subject });
      },
    },
    autoLoad: false,
    seq: true,
    response: {
      list: ({ data }) => data.data.data,
      message: ({ data }) => {
        return data.data.message;
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, formOptions });
function hasEditStatus(row: any) {
  return gridApi.grid?.isEditByRow(row);
}

function editRowEvent(row: any) {
  gridApi.grid?.setEditRow(row);
}
const cancelRowEvent = (_row: any) => {
  gridApi.grid?.clearEdit();
};

async function saveRowEvent(row: any) {
  await gridApi.grid?.clearEdit();

  gridApi.setLoading(true);
  setTimeout(() => {
    gridApi.setLoading(false);
    message.success(`保存成功！category=${row.category}`);
  }, 600);
}
</script>

<template>
  <Page title="版本列表">
    <NCard title="编辑版本">
      <Grid>
        <template #action="{ row }">
          <template v-if="hasEditStatus(row)">
            <NFlex justify="center">
              <NButton text type="success" @click="saveRowEvent(row)">
                保存
              </NButton>
              <NButton text type="warning" @click="cancelRowEvent(row)">
                取消
              </NButton>
            </NFlex>
          </template>
          <template v-else>
            <NButton text type="primary" @click="editRowEvent(row)">
              编辑
            </NButton>
          </template>
        </template>
      </Grid>
    </NCard>
  </Page>
</template>

<style scoped></style>
