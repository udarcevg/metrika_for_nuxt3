import { fileURLToPath } from 'url'
import { resolve } from 'pathe'
import { defineNuxtModule, addPlugin, addTemplate, useLogger } from '@nuxt/kit'
import { ModuleOptions } from '@nuxt/schema'
import defu from 'defu'

export interface YandexMetrikaModuleOptions extends ModuleOptions {
  id?: string,
  hostToId?: string,
  metrikaUrl?: string,
  accurateTrackBounce?: boolean | number,
  childIframe?: boolean,
  clickmap?: boolean,
  defer?: boolean,
  ecommerce?: boolean | string | [],
  params?: object | [],
  useRuntimeConfig?: boolean,
  useCDN?: boolean,
  userParams?: object,
  trackHash?: boolean,
  trackLinks?: boolean,
  trustedDomains?: [],
  type?: number,
  webvisor?: boolean,
  triggerEvent?: boolean,
  consoleLog?: boolean,
  partytown?: boolean,
}

const logger = useLogger('nuxt:yandex-metrika')
const CONFIG_KEY = 'yandexMetrika'

export default defineNuxtModule<YandexMetrikaModuleOptions>({
  meta: {
    name: 'metrika',
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: '>= 3.6.5'
    }
  },
  defaults: {
    id: process.env.YANDEX_METRIKA_ID,
    hostToId: process.env.YANDEX_METRIKA_HOST_TO_ID,
    metrikaUrl: 'https://mc.yandex.ru/metrika',
    accurateTrackBounce: true,
    childIframe: false,
    clickmap: true,
    defer: false,
    useRuntimeConfig: true,
    trackHash: false,
    trackLinks: true,
    type: 0,
    webvisor: false,
    triggerEvent: false,
    consoleLog: true,
    partytown: false
  },
  setup (options: YandexMetrikaModuleOptions, nuxt) {
    const isDev = (nuxt.options.dev && process.env.NODE_ENV !== 'production')
    options.isDev = isDev

    logger.info(`Initializing Yandex Metrika in ${isDev ? 'development' : 'production'} mode`)

    if (!options.id) {
      logger.error('No id provided.')
    }

    // Adds https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js
    options.metrikaUrl = (options.useCDN ? 'https://cdn.jsdelivr.net/npm/yandex-metrica-watch' : options.metrikaUrl) + '/tag.js'

    if (options.useRuntimeConfig) {
      nuxt.options.runtimeConfig.public[CONFIG_KEY] = defu(nuxt.options.runtimeConfig.public[CONFIG_KEY], options)
    }

    addTemplate({
      filename: 'yandex-metrika.options.mjs',
      getContents: () => {
        return `export default () => Promise.resolve(${JSON.stringify(
          options.useRuntimeConfig ? nuxt.options.runtimeConfig.public[CONFIG_KEY] : options || {}
        )})`
      }
    })

    // Script preload
    const head = nuxt.options.app.head
    head.script = head.script || []

    logger.debug(`Yandex Metrika script URL: ${options.metrikaUrl}`)
    if (!isDev) {
      const scriptObj: Parameters<typeof head.script.push>[number] = {
        src: options.metrikaUrl,
        async: true,
        tagPosition: 'head'
      }
      if (options.partytown) {
        scriptObj.type = 'text/partytown'
      }
      head.script.push(scriptObj)
    }

    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Register plugin
    addPlugin({
      src: resolve(runtimeDir, 'plugin'),
      mode: 'client'
    })
  }
})
