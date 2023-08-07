import YandexMetrikaModule from '..'

export default defineNuxtConfig({
  modules: [
    YandexMetrikaModule
  ],
  yandexMetrika: {
    id: 'XXXXXX',
    useRuntimeConfig: true,
    consoleLog: true,
    hostToId: {
      'localhost': '111',
      'test.com': '222'
    }
  }
})
