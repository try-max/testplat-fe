// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  [x: string]: any;
  success: any;
  data: T;
  username: string;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}

// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    pwd: string;
  }
  export interface ResLogin {
    access_token: string;
    username: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
}

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: string;
    username: string;
    gender: number;
    user: { detail: { age: number } };
    idCard: string;
    email: string;
    address: string;
    createTime: string;
    status: number;
    avatar: string;
    photo: any[];
    children?: ResUserList[];
  }

  export interface ResCaseList {
    id: string;
    env: string;
    module: number;
    creator: string;
    created_at: string;
    modifier: string;
    updated_at: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: number;
    headers: Record<string, string>;
    params: Record<string, string>;
    expected: Record<string, string>;
    ignored_fields: string;
    is_deleted: string;
    skip_execution: string;
    desc: string;
    children?: ResUserList[];
  }

  export interface executeCase {
    // env: string;
    // gender: number;
    // creator: string;
    // created_at: string;
    // modifier: string;
    // updated_at: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    url: number;
    headers: Record<string, string>;
    params: Record<string, any>;
    expected: Record<string, string>;
    ignored_fields: string;
    // is_deleted: string;
    // skip_execution: string;
    // children?: ResUserList[];
  }

  //接口用例对比情况
  export interface CaseRes {
    success: string;
  }
  export interface ResStatus {
    userLabel: string;
    userValue: number;
  }
  export interface ResGender {
    genderLabel: string;
    genderValue: number;
  }
  export interface ResDepartment {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
}
