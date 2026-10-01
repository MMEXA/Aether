import { describe, expect, it } from 'vitest'
import { isOutsideMarkedSurfaceClick } from '@/features/auth/utils/dialogOutsideClick'

describe('isOutsideMarkedSurfaceClick', () => {
  it('点击路径包含标记面板时，不应判定为外部点击', () => {
    const surface = document.createElement('div')
    surface.setAttribute('data-login-dialog-surface', 'true')
    const child = document.createElement('button')
    surface.appendChild(child)

    const event = {
      composedPath: () => [child, surface, document.body, document, window],
      target: child,
    } as unknown as MouseEvent

    expect(isOutsideMarkedSurfaceClick(event, 'data-login-dialog-surface')).toBe(false)
  })

  it('点击路径不包含标记面板时，应判定为外部点击', () => {
    const outside = document.createElement('div')

    const event = {
      composedPath: () => [outside, document.body, document, window],
      target: outside,
    } as unknown as MouseEvent

    expect(isOutsideMarkedSurfaceClick(event, 'data-login-dialog-surface')).toBe(true)
  })
})
