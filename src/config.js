/**
 * Настройки сервисов
 */
const config ={
  store: {
    log: false,

    modules: {
      session: {
        tokenHeader: 'X-Token'
      }
    }
  },

  api: {
    baseUrl: ''
  },

  chatService: {
    baseUrl: 'ws://example.front.ylab.io/chat'
  },
}

export default config;
