/** 客户端与 server/types/auth.ts 保持一致 */

export interface EmailReq {
  email: string
}

export interface EmailResp {
  code: number
  msg: string
}

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
