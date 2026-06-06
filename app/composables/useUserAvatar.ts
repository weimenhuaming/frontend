import { formatUserRole, getUserInitial, resolveUserAvatar } from '~/utils/user'

/** 当前登录用户的头像与展示名（未登录时使用 fallbackName 或「访客」） */
export function useUserAvatar(fallbackName?: MaybeRef<string | undefined>) {
  const auth = useAuth()
  const config = useRuntimeConfig()

  const displayName = computed(() =>
    unref(fallbackName) || auth.user.value?.name || '访客',
  )

  const avatarUrl = computed(() =>
    resolveUserAvatar(auth.user.value?.avatar, displayName.value, config.public.apiBase),
  )

  const hasCustomAvatar = computed(() => !!avatarUrl.value)

  const avatarInitial = computed(() => getUserInitial(displayName.value))

  const roleLabel = computed(() =>
    formatUserRole(auth.user.value?.role),
  )

  return {
    displayName,
    avatarUrl,
    hasCustomAvatar,
    avatarInitial,
    roleLabel,
  }
}
