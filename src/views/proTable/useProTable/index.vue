<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用例</el-button>
        <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加用例</el-button>
        <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">导出用例数据</el-button>
        <el-button type="primary" plain @click="toDetail">To 执行详情页面</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除用例
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="caseExecute(scope.row)">执行</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import {
  getCaseList,
  deleteUser,
  editCase,
  addCase,
  changeUserStatus,
  exportUserInfo,
  BatchAddUser,
  // getUserStatus,
  execute
  // getUserGender
} from "@/api/modules/user";

const router = useRouter();

// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
};

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getCaseList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  console.log(12321);
  return getCaseList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns = reactive<ColumnProps<User.ResCaseList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "expand", label: "Expand", width: 85 },
  //接口自动化信息
  {
    prop: "id",
    label: "用例ID",
    width: 80,
    search: {
      el: "select",
      props: { placeholder: "请输入id查询", filterable: true, remote: true, reserveKeyword: true }
    }
  },
  { prop: "module", label: "模块", width: 80 },
  { prop: "env", label: "环境", width: 80 },
  { prop: "desc", label: "说明", width: 230 },

  { prop: "method", label: "请求方式", width: 100 },
  { prop: "url", label: "URL", width: 400 },
  { prop: "expected", label: "expected", width: 400 },

  { prop: "creator", label: "创建人", width: 80 },
  { prop: "created_at", label: "创建时间", width: 180 },
  { prop: "modifier", label: "最近一次修改人", width: 130 },
  { prop: "updated_at", label: "更新时间", width: 180 },

  {
    prop: "is_deleted",
    label: "用例状态",
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.is_deleted}
              active-text={scope.row.is_deleted ? "启用" : "禁用"}
              active-value={1}
              inactive-value={-1}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.is_deleted ? "success" : "danger"}>{scope.row.is_deleted ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
// const resetPass = async (params: User.ResUserList) => {
//   await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
//   proTable.value?.getTableList();
// };
const caseExecute = async (params: User.ResCaseList) => {
  try {
    // 1. 显示确认弹窗
    await ElMessageBox.confirm(`是否执行【${params.id}】的用例?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      draggable: true
    });

    // 2. 用户确认后执行请求
    const response = await execute({
      url: params.url,
      params: ensureDict(params.params, {}),
      method: params.method,
      headers: ensureDict(params.headers, {}),
      ignored_fields: params.ignored_fields,
      expected: ensureDict(params.expected)
    });

    // 3. 处理业务逻辑错误
    if (!response.success) {
      // console.log(response);
      // throw new Error(response.message || "执行失败，未返回具体原因");
      // 展示详细错误信息弹窗
      await ElMessageBox.alert(
        `<pre>错误详情：${JSON.stringify(response, null, 2)}</pre>`, // 使用 pre 标签保持格式
        "执行成功，接口对比不一致",
        {
          dangerouslyUseHTMLString: true, // 允许 HTML 内容
          type: "error",
          confirmButtonText: "确定",
          customClass: "error-detail-dialog" // 可添加自定义样式类
        }
      );

      // 抛出错误终止流程
      throw new Error(response.message || "执行结果不符合预期");
    }

    // 4. 显示成功提示
    ElMessage.success("执行成功！接口对比一致");

    // 5. 执行成功后刷新表格
    proTable.value?.getTableList();
  } catch (error) {
    // 6. 错误分类处理
    if (error === "cancel") {
      // 用户主动取消操作
      ElMessage.info("操作已取消");
    } else if (error instanceof Error) {
      // 业务逻辑错误或网络错误
      ElMessage.error(error.message || "执行结果不符合预期，请检查！");
    } else {
      // 未知错误类型
      ElMessage.error("发生未知错误，请查看控制台");
      console.error("未知错误详情:", error);
    }
  }
};

//不用useHandleData执行用例

// 关键参数转换函数
const ensureDict = (value: any, defaultValue: Record<string, any> = {}): Record<string, any> => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value); // 尝试解析字符串为对象
    } catch (error) {
      console.error("参数解析失败，使用默认值:", error);
      return defaultValue;
    }
  }
  return value || defaultValue; // 如果是对象直接返回，否则返回默认值
};

// 切换用户状态
const changeStatus = async (row: User.ResCaseList) => {
  await useHandleData(changeUserStatus, { id: row.id, status: -row.is_deleted }, `切换【${row.id}】用户状态`);
  console.log({ id: row.id, status: -row.is_deleted });
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResCaseList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addCase : title === "编辑" ? editCase : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
