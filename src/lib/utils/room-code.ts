const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateRoomCode(length = 6): string {
  return Array.from(
    { length },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('')
}

export function validateRoomCode(code: string): boolean {
  return /^[A-Z0-9]{4,8}$/.test(code.toUpperCase())
}
