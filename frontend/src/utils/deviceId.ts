const IRIDESCENT_DEVICE_ID_KEY = 'iridescent_client_device_id'
const LEGACY_DEVICE_ID_KEY = 'aether_client_device_id'

function generateDeviceId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `device-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`
}

export function getClientDeviceId(): string {
  const existing = localStorage.getItem(IRIDESCENT_DEVICE_ID_KEY)
  if (existing) {
    return existing
  }

  const legacy = localStorage.getItem(LEGACY_DEVICE_ID_KEY)
  if (legacy) {
    localStorage.setItem(IRIDESCENT_DEVICE_ID_KEY, legacy)
    localStorage.removeItem(LEGACY_DEVICE_ID_KEY)
    return legacy
  }

  const created = generateDeviceId()
  localStorage.setItem(IRIDESCENT_DEVICE_ID_KEY, created)
  return created
}
