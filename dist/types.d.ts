
import { ModuleOptions, ModuleHooks, ModuleRuntimeConfig, ModulePublicRuntimeConfig } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['yandexMetrika']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['yandexMetrika']?: ModuleOptions }
  interface NuxtHooks extends ModuleHooks {}
  interface RuntimeConfig extends ModuleRuntimeConfig {}
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['yandexMetrika']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['yandexMetrika']?: ModuleOptions }
  interface NuxtHooks extends ModuleHooks {}
  interface RuntimeConfig extends ModuleRuntimeConfig {}
  interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
}


export { default } from './module'
