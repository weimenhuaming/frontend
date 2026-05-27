/** 发送验证码 */
export interface EmailReq {
  email: string
}

export interface EmailResp {
  code: number
  msg: string
}

/** 邮箱登录 */
export interface LoginEmailReq {
  email: string
  captcha: string
}

export interface LoginData {
  id: number
  name: string
  phone: string
  email: string
  uuid: string
  avatar: string
  role: 'admin' | 'user' | 'guest' | string
  sex: string
  age: number
  access_token: string
  refresh_token: string
}

export interface LoginResp {
  code: number
  msg: string
  data: LoginData
}

export interface LogoutResp {
  code: number
  msg: string
}

/** 持久化到前端的用户信息（不含 token） */
export interface AuthUser {
  id: number
  name: string
  phone: string
  email: string
  uuid: string
  avatar: string
  role: 'admin' | 'user' | 'guest' | string
  sex: string
  age: number
}
