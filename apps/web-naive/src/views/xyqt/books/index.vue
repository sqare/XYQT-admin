<script setup lang="ts">
import type { BookItem } from '@vben/types';

import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { nextTick } from 'vue';

import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { NButton, NCard, NFlex, useMessage } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createBooks,
  deleteBooks,
  getBooks,
  getGrade,
  getLevel,
  getSubjects,
  getVersion,
  updateBooks,
} from '#/api/core/xyqt';

const message = useMessage();

const gridOptions: VxeGridProps<BookItem> = {
  minHeight: 400,
  rowConfig: {
    keyField: 'id',
    useKey: true,
  },
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { type: 'checkbox', title: '全选', width: 70, maxWidth: 120 },
    { field: 'id', title: 'id', width: 50, maxWidth: 150, sortable: true },
    {
      editRender: { name: 'VxeInput' },
      field: 'title',
      title: '课本名称',
      minWidth: 250,
    },
    {
      field: 'semester',
      title: '学期',
      formatter: (row) => {
        return row.row.semester === 'first' ? '上册' : '下册';
      },
      minWidth: 50,
      maxWidth: 100,
      width: 100,
      editRender: {
        name: 'VxeSelect',
        options: [
          { label: '上册', value: 'first' },
          { label: '下册', value: 'second' },
        ],
      },
    },
    {
      field: 'image',
      title: '课本封面',
      width: 150,
      maxWidth: 150,
      minWidth: 50,
      editRender: { name: 'VxeUpload' },
    },
    {
      field: 'active',
      title: '状态',
      formatter: (row) => {
        return row.row.active === true ? '启用' : '停用';
      },
      width: 80,
      maxWidth: 80,
      minWidth: 50,
      editRender: {
        name: 'VxeSelect',
        options: [
          { label: '启用', value: true },
          { label: '停用', value: false },
        ],
      },
    },
    {
      slots: { default: 'action' },
      title: '操作',
      width: 120,
      maxWidth: 150,
      minWidth: 50,
    },
  ],
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  border: true,
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        return await getBooks({
          version_id: formValues.version,
          grade_id: formValues.grade,
          subject_id: formValues.subject,
        });
      },
      querySuccess(params) {
        message.success(`共查询到${params.response.length}条数据`);
      },
    },
    response: {
      list: ({ data }) => {
        gridApi.grid?.sort('id', 'asc');
        return data;
      },
    },
    autoLoad: false,
  },
};

const formOptions: VbenFormProps = {
  collapsed: false,
  showCollapseButton: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  schema: [
    {
      component: 'ApiSelect',
      fieldName: 'type',
      label: $t('page.xyqt.schoolType'),
      rules: 'required',
      componentProps: {
        immediate: false,
        api: getLevel,
        resultField: 'data',
        labelField: 'name',
        valueField: 'id',
        placeholder: $t('page.xyqt.schoolTypePlaceholder'),
        lazy: true,
        visibleEvent: 'onFocus',
        onChange() {
          gridApi.grid?.remove();
        },
      },
    },
    {
      component: 'ApiSelect',
      label: $t('page.xyqt.grade'),
      fieldName: 'grade',
      rules: 'required',
      componentProps(value) {
        if (!value.type) {
          return {};
        }
        return {
          immediate: false,
          lazy: true,
          api: getGrade,
          resultField: 'data',
          valueField: 'id',
          labelField: 'name',
          params: {
            type: value.type,
          },
          onChange() {
            gridApi.grid?.remove();
          },
        };
      },
      dependencies: {
        triggerFields: ['type'],
        trigger(value) {
          value.grade = undefined;
        },
        disabled(value) {
          return !value.type;
        },
      },
    },
    {
      component: 'ApiSelect',
      label: $t('page.xyqt.subjects'),
      fieldName: 'subject',
      rules: 'required',
      componentProps: {
        immediate: false,
        lazy: true,
        api: getSubjects,
        resultField: 'data',
        valueField: 'id',
        labelField: 'name',
        visibleEvent: 'onFocus',
        loadingSlot: 'loading',
        onChange() {
          gridApi.grid?.remove();
        },
      },
    },
    {
      component: 'ApiSelect',
      label: $t('page.xyqt.version'),
      fieldName: 'version',
      rules: 'required',
      componentProps: (value) => {
        if (!value.subject) {
          return {};
        }
        return {
          immediate: false,
          api: getVersion,
          resultField: 'data',
          valueField: 'id',
          labelField: 'name',
          visibleEvent: 'onFocus',
          loadingSlot: 'loading',
          params: {
            subject_id: value.subject,
          },
          onUpdate() {
            gridApi.grid?.remove();
          },
        };
      },
      dependencies: {
        triggerFields: ['subject'],
        trigger(value) {
          value.version = undefined;
        },
        disabled(value) {
          return !value.subject;
        },
      },
    },
  ],
  handleReset: () => {
    gridApi.formApi.form.resetForm();
    gridApi.grid?.remove();
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  separator: false,
});
async function addEvent() {
  if (gridApi.grid.getData().length === 0) {
    message.warning('请先搜索数据');
    return;
  }
  const row = { title: '' };
  const newRow = await gridApi.grid?.insertAt(row, -1);
  await nextTick();
  gridApi.grid.setEditRow(newRow);
}

async function deleteEvent() {
  try {
    const checkedRows = gridApi.grid?.getCheckboxRecords();
    await confirm({
      title: $t('page.confirm.deleteTitle'),
      content: `${checkedRows.map((item) => item.title).join('\n')}`,
    });
    // 先执行删除接口再移除表格行
    gridApi.setLoading(true);
    const ids = checkedRows.map((item) => item.id);
    await deleteBooks(ids)
      .then((res) => {
        message.success(res.data.message);
      })
      .catch((error) => message.error(error))
      .finally(() => {
        gridApi.setLoading(false);
        gridApi.reload();
      });
  } catch {
    message.info($t('page.confirm.cancel'));
  }
}

async function editEvent(row: BookItem) {
  await gridApi.grid?.setEditRow(row, true);
}

function hasEditStatus(row: BookItem) {
  const isEdit = gridApi.grid?.isEditByRow(row);
  console.warn('🚀 ~ hasEditStatus ~ row:', row.id, isEdit);
  return isEdit;
}
const cancelRowEvent = (_row: BookItem) => {
  gridApi.grid?.clearEdit();
};
async function saveRowEvent(row: BookItem) {
  await gridApi.grid?.clearEdit();
  gridApi.setLoading(true);
  row.grade_id = gridApi.formApi.form.values.grade;
  row.subject_id = gridApi.formApi.form.values.subject;
  row.version_id = gridApi.formApi.form.values.version;

  if (gridApi.grid?.isInsertByRow(row)) {
    row.id = 0;
    await createBooks([row])
      .then(() => {
        message.success(`保存成功！${row.title}`);
      })
      .catch(() => {
        message.error(`保存失败！${row.title}`);
      })
      .finally(() => {
        gridApi.reload();
        gridApi.setLoading(false);
      });
  }
  if (gridApi.grid?.isUpdateByRow(row)) {
    await updateBooks([row])
      .then(() => {
        message.success(`保存成功！${row.title}`);
      })
      .catch(() => {
        message.error(`保存失败！${row.title}`);
      })
      .finally(() => {
        gridApi.reload();
        gridApi.setLoading(false);
      });
  }
}
</script>
<template>
  <Page title="课本编辑" description="编辑表格后保存">
    <NCard title="课本详情">
      <Grid>
        <template #toolbar-actions>
          <NFlex>
            <NButton @click="addEvent" type="primary">新增</NButton>
            <NButton @click="deleteEvent" type="error">删除勾选</NButton>
          </NFlex>
        </template>
        <template #action="{ row }">
          <NFlex justify="center">
            <template v-if="hasEditStatus(row)">
              <NButton
                size="small"
                tertiary
                text
                @click="saveRowEvent(row)"
                type="success"
              >
                保存
              </NButton>
              <NButton
                size="small"
                text
                @click="cancelRowEvent(row)"
                type="warning"
              >
                取消
              </NButton>
            </template>
            <template v-else>
              <NButton size="small" text @click="editEvent(row)" type="warning">
                编辑
              </NButton>
            </template>
          </NFlex>
        </template>
      </Grid>
    </NCard>
  </Page>
</template>
