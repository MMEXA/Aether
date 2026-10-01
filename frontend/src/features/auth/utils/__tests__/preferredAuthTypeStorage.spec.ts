import { beforeEach, describe, expect, it } from 'vitest'

import {
  LEGACY_PREFERRED_AUTH_TYPE_KEY,
  PREFERRED_AUTH_TYPE_KEY,
  getStoredPreferredAuthType,
  setStoredPreferredAuthType,
} from '../preferredAuthTypeStorage'

describe('preferredAuthTypeStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('prefers the iridescent key when it already exists', () => {
    localStorage.setItem(PREFERRED_AUTH_TYPE_KEY, 'ldap')
    localStorage.setItem(LEGACY_PREFERRED_AUTH_TYPE_KEY, 'local')

    expect(getStoredPreferredAuthType()).toBe('ldap')
    expect(localStorage.getItem(PREFERRED_AUTH_TYPE_KEY)).toBe('ldap')
    expect(localStorage.getItem(LEGACY_PREFERRED_AUTH_TYPE_KEY)).toBe('local')
  })

  it('migrates the legacy aether key into the iridescent key', () => {
    localStorage.setItem(LEGACY_PREFERRED_AUTH_TYPE_KEY, 'ldap')

    expect(getStoredPreferredAuthType()).toBe('ldap')
    expect(localStorage.getItem(PREFERRED_AUTH_TYPE_KEY)).toBe('ldap')
    expect(localStorage.getItem(LEGACY_PREFERRED_AUTH_TYPE_KEY)).toBeNull()
  })

  it('falls back to local when no valid stored auth type exists', () => {
    localStorage.setItem(LEGACY_PREFERRED_AUTH_TYPE_KEY, 'invalid')

    expect(getStoredPreferredAuthType()).toBe('local')
    expect(localStorage.getItem(PREFERRED_AUTH_TYPE_KEY)).toBeNull()
  })

  it('writes only the iridescent key and clears the legacy aether key when saving', () => {
    localStorage.setItem(LEGACY_PREFERRED_AUTH_TYPE_KEY, 'ldap')

    setStoredPreferredAuthType('local')

    expect(localStorage.getItem(PREFERRED_AUTH_TYPE_KEY)).toBe('local')
    expect(localStorage.getItem(LEGACY_PREFERRED_AUTH_TYPE_KEY)).toBeNull()
  })
})
