export const PREFERRED_AUTH_TYPE_KEY = 'iridescent_preferred_auth_type'
export const LEGACY_PREFERRED_AUTH_TYPE_KEY = 'aether_preferred_auth_type'

export type PreferredAuthType = 'local' | 'ldap'

function isPreferredAuthType(value: string | null): value is PreferredAuthType {
  return value === 'local' || value === 'ldap'
}

export function getStoredPreferredAuthType(storage: Storage = localStorage): PreferredAuthType {
  const nextValue = storage.getItem(PREFERRED_AUTH_TYPE_KEY)
  if (isPreferredAuthType(nextValue)) {
    return nextValue
  }

  const legacyValue = storage.getItem(LEGACY_PREFERRED_AUTH_TYPE_KEY)
  if (isPreferredAuthType(legacyValue)) {
    storage.setItem(PREFERRED_AUTH_TYPE_KEY, legacyValue)
    storage.removeItem(LEGACY_PREFERRED_AUTH_TYPE_KEY)
    return legacyValue
  }

  return 'local'
}

export function setStoredPreferredAuthType(
  authType: PreferredAuthType,
  storage: Storage = localStorage,
): void {
  storage.setItem(PREFERRED_AUTH_TYPE_KEY, authType)
  storage.removeItem(LEGACY_PREFERRED_AUTH_TYPE_KEY)
}
