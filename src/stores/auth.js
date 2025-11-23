import { useStorage } from '@vueuse/core'
export const _token = useStorage('token', '')
export const _roles = useStorage('roles', '')