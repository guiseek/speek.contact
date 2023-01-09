export const PLATFORM_BROWSER_ID = 'browser'
export const PLATFORM_SERVER_ID = 'server'
export const PLATFORM_WORKER_APP_ID = 'browserWorkerApp'
export const PLATFORM_WORKER_UI_ID = 'browserWorkerUi'

export function isPlatformBrowser(platformId: string): boolean {
  return platformId === PLATFORM_BROWSER_ID
}

export function isPlatformServer(platformId: string): boolean {
  return platformId === PLATFORM_SERVER_ID
}

export function isPlatformWorkerApp(platformId: string): boolean {
  return platformId === PLATFORM_WORKER_APP_ID
}

export function isPlatformWorkerUi(platformId: string): boolean {
  return platformId === PLATFORM_WORKER_UI_ID
}
