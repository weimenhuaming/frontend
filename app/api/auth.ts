import { postLogin, request } from './http'

/** 邮箱登录请求 */
export interface EmailLoginRequest {
  email: string
  captcha: string
}

/** 登录成功返回的用户数据（含 token） */
export interface LoginData {
  id: number
  name: string
  phone: string
  email: string
  uuid: string
  access_token: string
  refresh_token: string
  avatar: string
  role: string
  sex: string
  age: number
}

/** 持久化到前端的用户信息（不含 token） */
export interface AuthUser {
  id: number
  name: string
  phone: string
  email: string
  uuid: string
  avatar: string
  role: string
  sex: string
  age: number
}

/** 图片验证码 */
export interface CaptchaResponse {
  captcha_id: string
  pic_base64: string
}

/** 账号密码登录 */
export interface UsernameLoginRequest {
  captcha_id: string
  username: string
  password: string
  verificationCode: string
}

export interface RegisterRequest {
  name: string
  password: string
  confirm: string
  email: string
  captcha: string
}

export interface ResetPasswordRequest {
  email: string
  captcha: string
  password: string
  confirm: string
}

//======================================================================================================================

/**
 * 发送邮箱验证码
 */
export function sendVerificationCode(email: string): Promise<void> {
  return request<void>('/sendemail', {
    method: 'POST',
    body: { email },
  })
}

/**
 * 邮箱验证码登录
 */
export function emailLogin(params: EmailLoginRequest): Promise<LoginData> {
  return postLogin('/emaillogin', {
    email: params.email,
    captcha: params.captcha,
  })
}

/**
 * 退出登录
 */
export function logout(): Promise<void> {
  return request<void>('/logout', { method: 'GET' })
}


/**
 * 账号密码登录
 */
export function usernameLogin(params: UsernameLoginRequest): Promise<LoginData> {
  return postLogin('/login', {
    name: params.username,
    password: params.password,
    code: params.verificationCode,
    captcha_id: params.captcha_id,
  })
}

/**
 * 获取图片验证码
 */
export function getCaptcha(): Promise<CaptchaResponse> {
  return request<CaptchaResponse>('/captcha', { method: 'GET' })
}

/**
 * 注册
 */
export function register(req: RegisterRequest): Promise<void> {
  return request<void>('/register', {
    method: 'POST',
    body: {
      name: req.name,
      password: req.password,
      email: req.email,
      captcha: req.captcha,
    },
  })
}

/**
 * 邮箱重置密码
 */
export function resetPassword(req: ResetPasswordRequest): Promise<void> {
  return request<void>('/reset_password_by_email', {
    method: 'POST',
    body: {
      email: req.email,
      captcha: req.captcha,
      newpassword: req.password,
      confirmpassword: req.confirm,
    },
  })
}
