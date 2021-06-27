// Seems to be interactions with the chrome API to watch and install the hotloaded chrome extension
// https://github.com/ceoimon/react-parcel-ts-extension-boilerplate/blob/master/src/extensionAPIs.ts

const apis = [
  'alarms',
  'bookmarks',
  'browserAction',
  'commands',
  'contextMenus',
  'cookies',
  'downloads',
  'events',
  'extension',
  'extensionTypes',
  'history',
  'i18n',
  'idle',
  'notifications',
  'pageAction',
  'runtime',
  'storage',
  'tabs',
  'webNavigation',
  'webRequest',
  'windows',
]

class Extension {
  constructor() {
    for (const api of apis) {
      this[api] = null

      try {
        if (chrome[api]) {
          this[api] = chrome[api]
          continue
        }
      } catch (_) {
        //
      }

      try {
        if (window[api]) {
          this[api] = window[api]
          continue
        }
      } catch (_) {
        //
      }

      try {
        if (browser[api]) {
          this[api] = browser[api]
          continue
        }
      } catch (_) {
        //
      }

      try {
        this[api] = browser.extension[api]
      } catch (_) {
        //
      }
    }
  }
}

const extension = new Extension()

export default extension
