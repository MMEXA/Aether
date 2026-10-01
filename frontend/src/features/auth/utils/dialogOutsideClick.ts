export const LOGIN_DIALOG_SURFACE_ATTR = 'data-login-dialog-surface'

export function isOutsideMarkedSurfaceClick(event: MouseEvent, surfaceAttr: string): boolean {
  const path = typeof event.composedPath === 'function' ? event.composedPath() : []
  if (path.length > 0) {
    return !path.some((target) => target instanceof HTMLElement && target.hasAttribute(surfaceAttr))
  }

  const target = event.target
  if (target instanceof Element) {
    return target.closest(`[${surfaceAttr}]`) === null
  }

  return true
}
