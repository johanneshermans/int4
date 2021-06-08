import path from 'path'
import * as url from 'url'

// see https://github.com/electron-userland/electron-webpack/issues/99#issuecomment-459251702
export function getStatic(val) {
    if (process.env.NODE_ENV !== 'production') {
        return url.resolve(window.location.origin, val)
    }
    return path.resolve(__static, val)
}