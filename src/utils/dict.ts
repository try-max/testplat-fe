// ? 系统全局字典

/**
 * @description：请求方式
 */
export const genderType = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" }
];

/**
 *
 *   用例执行环境
 */

export const caseType = [
  { label: "测试环境", value: "rc" },
  { label: "stage环境", value: "stage" },
  { label: "生产环境", value: "prod" }
];

/**
 *
 *   用例模块
 */

export const moduleType = [
  { label: "数据中心", value: "数据中心" },
  { label: "BI", value: "BI" },
  { label: "CRM", value: "CRM" },
  { label: "CSDN", value: "CSDN" }
];
/**
 * @description：用户状态
 */
export const userStatus = [
  { label: "启用", value: 1, tagType: "success" },
  { label: "禁用", value: 0, tagType: "danger" }
];

/**
 *
 *   用例状态
 */

export const caseStatues = [
  { label: "启用", value: 1 },
  { label: "废弃", value: -1 }
];
