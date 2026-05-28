export function isValidQqEmail(value: string) {
  return /^[^\s@]+@qq\.com$/i.test(value.trim())
}

export function isSixDigitCode(value: string) {
  return /^\d{6}$/.test(value.trim())
}
