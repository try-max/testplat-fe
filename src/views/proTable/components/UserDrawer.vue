<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用例`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="用例id" prop="id">
        <el-input v-model="drawerProps.row!.id" :disabled="true" clearable></el-input>
      </el-form-item>
      <el-form-item label="模块" prop="module">
        <el-select v-model="drawerProps.row!.module" placeholder="所属模块" clearable>
          <el-option v-for="item in moduleType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="环境" prop="env">
        <el-select v-model="drawerProps.row!.env" placeholder="所属环境" clearable>
          <el-option v-for="item in caseType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="desc">
        <el-input v-model="drawerProps.row!.desc" placeholder="用例说明" clearable></el-input>
      </el-form-item>
      <el-form-item label="请求方式" prop="method">
        <el-select v-model="drawerProps.row!.method" placeholder="请求方式" clearable>
          <el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input
          v-model="drawerProps.row!.url"
          placeholder="URL"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="预期结果" prop="creator">
        <el-input
          v-model="drawerProps.row!.expected"
          placeholder="预期结果"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10 }"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input v-model="drawerProps.row!.creator" placeholder="创建人" :disabled="true" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="created_at">
        <el-input v-model="drawerProps.row!.created_at" placeholder="创建时间" :disabled="true" clearable></el-input>
      </el-form-item>
      <el-form-item label="修改人" prop="modifier">
        <el-input v-model="drawerProps.row!.modifier" placeholder="修改人" :disabled="true" clearable></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updated_at">
        <el-input v-model="drawerProps.row!.updated_at" placeholder="更新时间" :disabled="true" clearable></el-input>
      </el-form-item>
      <el-form-item label="用例状态" prop="is_deleted">
        <el-select v-model="drawerProps.row!.is_deleted" placeholder="请求方式" clearable>
          <el-option v-for="item in caseStatues" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <!-- <el-input v-model="drawerProps.row!.is_deleted" placeholder="用例状态" clearable></el-input> -->
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { genderType, caseType, moduleType, caseStatues } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";
import { User } from "@/api/interface";

const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  photo: [{ required: true, message: "请上传用户照片" }],
  username: [{ required: true, message: "请填写用户姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  idCard: [{ required: true, message: "请填写身份证号" }],
  email: [{ required: true, message: "请填写邮箱" }],
  address: [{ required: true, message: "请填写居住地址" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<User.ResCaseList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}用例成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
