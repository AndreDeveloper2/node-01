export function buildRoutePath(url) {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    const urlWithParams = url.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

    const urlRegex = new RegExp(`^${urlWithParams}(?<query>\\?(.*))?$`)

    return urlRegex
}