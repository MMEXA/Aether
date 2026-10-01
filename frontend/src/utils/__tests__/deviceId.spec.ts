import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('getClientDeviceId', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  it('returns an existing iridescent device id', async () => {
    localStorage.setItem('iridescent_client_device_id', 'iridescent-device')

    const { getClientDeviceId } = await import('../deviceId')

    expect(getClientDeviceId()).toBe('iridescent-device')
    expect(localStorage.getItem('aether_client_device_id')).toBeNull()
  })

  it('migrates the legacy aether device id to the iridescent key', async () => {
    localStorage.setItem('aether_client_device_id', 'legacy-device')

    const { getClientDeviceId } = await import('../deviceId')

    expect(getClientDeviceId()).toBe('legacy-device')
    expect(localStorage.getItem('iridescent_client_device_id')).toBe('legacy-device')
    expect(localStorage.getItem('aether_client_device_id')).toBeNull()
  })
})
