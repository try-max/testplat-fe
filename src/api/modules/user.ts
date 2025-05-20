import { ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getCaseList = (params: User.ResCaseList) => {
  return http.post<ResPage<User.ResCaseList>>(PORT1 + `/case/getAllCase`, params);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const addCase = (params: User.ResCaseList) => {
  // console.log(localStorage.getItem("user"));

  params.creator = localStorage.getItem("user") + "";
  // console.log(params.creator);
  return http.post(PORT1 + `/case/addCase`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};

// 编辑用例
export const editCase = (params: User.ResCaseList) => {
  params.modifier = localStorage.getItem("user") + "";
  return http.post(PORT1 + `/case/caseEdit`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.post(PORT1 + `/user/delete`, params);
};

// 切换用户状态
export const changeUserStatus = (params: User.ResCaseList) => {
  params.modifier = localStorage.getItem("user") + "";
  return http.post(PORT1 + `/case/changeCaseStatus`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/rest_password`, params);
};

//执行用例
export const execute = (params: User.executeCase) => {
  return http.post<User.CaseRes[]>(PORT1 + `/interfaces/execute`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`, {}, { cancel: false });
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};

// // 获取用户列表
// export const getCaseList = () => {
//   return http.get<User.ResCaseList[]>(PORT1 + `/case/get_all_cases`);
// };

