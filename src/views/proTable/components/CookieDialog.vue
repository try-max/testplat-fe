<template>
  <el-dialog v-model="dialogVisible" title="Cookie 管理" :destroy-on-close="true" width="900px" draggable>
    <!-- 工具栏 -->
    <div style="margin-bottom: 12px">
      <el-button type="primary" :icon="Plus" @click="openAddDialog">添加 Cookie</el-button>
    </div>

    <el-table v-loading="loading" :data="cookieList" border stripe max-height="500">
      <el-table-column prop="cookie" label="Cookie" min-width="180" show-overflow-tooltip />
      <el-table-column prop="env" label="测试环境" width="100" />
      <el-table-column prop="module" label="所属业务模块" width="120" />
      <el-table-column prop="creator" label="创建人" width="100" />
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column prop="modifier" label="最新编辑人" width="100" />
      <el-table-column prop="updated_at" label="修改时间" width="170" />
      <el-table-column label="操作" width="80" fixed="right">
        <template #default="scope">
          <el-button type="danger" link :icon="Delete" @click="deleteCookie(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" :loading="saving" @click="handleSaveAll">保存</el-button>
    </template>
  </el-dialog>

  <!-- 添加 Cookie 子弹窗 -->
  <el-dialog v-model="addDialogVisible" title="添加 Cookie" :destroy-on-close="true" width="500px">
    <el-form ref="addFormRef" :model="addForm" label-width="100px" label-suffix=" :" :rules="addRules">
      <el-form-item label="Cookie" prop="cookie">
        <el-input
          v-model="addForm.cookie"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8 }"
          placeholder="请输入 Cookie 内容"
          clearable
        />
      </el-form-item>
      <el-form-item label="业务模块" prop="module">
        <el-select v-model="addForm.module" placeholder="请选择业务模块" clearable style="width: 100%">
          <el-option v-for="item in moduleType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="测试环境" prop="env">
        <el-select v-model="addForm.env" placeholder="请选择测试环境" clearable style="width: 100%">
          <el-option v-for="item in caseType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="adding" @click="submitAddCookie">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="CookieDialog">
import { ref, reactive } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { caseType, moduleType } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";
import { addCookie, deleteCookieApi, batchSaveCookie, getCookieList } from "@/api/modules/user";
import { User } from "@/api/interface";

export interface CookieItem {
  id?: string;
  cookie: string;
  module: string;
  env: string;
  creator: string;
  created_at: string;
  modifier: string;
  updated_at: string;
}

// ---------- 主弹窗 ----------
const dialogVisible = ref(false);
const cookieList = ref<CookieItem[]>([]);
const loading = ref(false);
const saving = ref(false);

// 接收父组件传过来的 cookie 数据
const acceptParams = (list: CookieItem[]) => {
  cookieList.value = list;
  dialogVisible.value = true;
};

// 删除单条 cookie
const deleteCookie = async (index: number) => {
  const item = cookieList.value[index];
  if (item.id) {
    try {
      await deleteCookieApi({ id: item.id });
    } catch {
      ElMessage.warning("删除后端记录失败，前端列表已移除");
    }
  }
  cookieList.value.splice(index, 1);
  ElMessage.success("已删除");
};

// 保存全部
const handleSaveAll = async () => {
  saving.value = true;
  try {
    await batchSaveCookie(cookieList.value as User.ResCookie[]);
    ElMessage.success("保存成功");
    dialogVisible.value = false;
  } catch (error) {
    console.error("批量保存失败：", error);
    ElMessage.error("保存失败，请稍后重试");
  } finally {
    saving.value = false;
  }
};

// ---------- 添加子弹窗 ----------
const addDialogVisible = ref(false);
const addFormRef = ref<FormInstance>();
const adding = ref(false);

const addForm = reactive({
  cookie: "",
  module: "",
  env: ""
});

const addRules: any = {
  cookie: [{ required: true, message: "请输入 Cookie 内容", trigger: "blur" }],
  module: [{ required: true, message: "请选择所属业务模块", trigger: "change" }],
  env: [{ required: true, message: "请选择测试环境", trigger: "change" }]
};

const openAddDialog = () => {
  addForm.cookie = "";
  addForm.module = "";
  addForm.env = "";
  addDialogVisible.value = true;
};

const submitAddCookie = async () => {
  const valid = await addFormRef.value!.validate().catch(() => false);
  if (!valid) return;

  adding.value = true;
  try {
    await addCookie({
      cookie: addForm.cookie,
      module: addForm.module,
      env: addForm.env
    });

    ElMessage.success("添加成功");
    addDialogVisible.value = false;

    // 重新拉取列表
    const res = await getCookieList();
    cookieList.value = res as unknown as CookieItem[];
  } catch (error) {
    console.error("添加失败：", error);
    ElMessage.error("添加失败，请稍后重试");
  } finally {
    adding.value = false;
  }
};

defineExpose({
  acceptParams
});
</script>
