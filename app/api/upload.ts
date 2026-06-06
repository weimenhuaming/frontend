const TOKEN_KEY = 'chenaqi_access_token'

interface UploadImageResponse {
  code: number
  msg: string
  data?: {
    url: string
  }
}

export async function uploadAvatar(file: File): Promise<string> {
  return uploadImage('/upload/avatar', file)
}

export async function uploadBlogImage(file: File): Promise<string> {
  return uploadImage('/upload/blog', file)
}

async function uploadImage(path: string, file: File): Promise<string> {
  const config = useRuntimeConfig()
  const formData = new FormData()
  formData.append('file', file)

  const headers: Record<string, string> = {}
  if (import.meta.client) {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token)
      headers.Authorization = token
  }

  // 使用原生 fetch，避免 ofetch 处理 FormData 时破坏 multipart boundary
  const res = await fetch(`${config.public.apiBase}${path}`, {
    method: 'POST',
    body: formData,
    headers,
    credentials: 'include',
  })

  const json = await res.json() as UploadImageResponse
  if (!res.ok || json.code !== 200 || !json.data?.url)
    throw new Error(json.msg || '上传失败')

  return json.data.url
}
