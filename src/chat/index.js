class ChatService{

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config = {}) {
    this.services = services;
    this.config = {
      ...config
    }
  }

  /**
   * Метод создаёт соединение 
   * @returns Promise
   */
  async newConnectionStart() {
    return new Promise((resolve, reject) => {
      let ws = new WebSocket(this.config.baseUrl);
      ws.onopen = () => {
        console.log("Подключено");
        resolve(ws)
      };
      ws.onerror = (error) => {
        console.log("Подключение невозможно");
        alert('Соединение было разрушено. Все отправленные сообщения будут сохранены!');
        reject(error)
      };
    })
  }

  /**
   * Метод проверяет существует ли соединение и готово ли оно к работе
   * @returns соединение
   */
  async connectionStart() {
    if(!this.ws || this.ws.readyState !== 1) {
      this.ws = await this.newConnectionStart();
      console.log('Зашёл')
    }
    return this.ws;
  }

  /**
   * 
   * @param {object} ws  - объект соединения WebSocket
   * @returns boolean
   */
  isOpen(ws) {
    return ws.readyState === ws.OPEN;
  }

  /**
   * Метод самых свежих 10 сообщений (Выполняется один раз при авторизации)
   */
  async queryFreshMessages() {
    const ws = await this.connectionStart();
    ws.send(JSON.stringify({
      method: 'last',
      payload: {}
    }))
  }

  /**
   * Метод на отправка сообщений
   * @param text - текст сообщения
   * @param key - ключ сообщения (генерится через uuid)
   */
  async submitMessage(text, key) {
    const ws = await this.connectionStart();
    if (!this.isOpen(ws)) return true;
    ws.send(JSON.stringify({
      method: 'post',
      payload: {
        _key: key,
        text: text
      }
    }));
  }

  /**
   * Метод закрытия соединения
   */
  async shutdown() {
    const ws = await this.connectionStart();
    ws.close();
  }

  /**
   * Метод на получение старых сообщений
   * @param _id - идентификатор последнего сообщения
   */
  async queryOldMessages(_id) {
    const ws = await this.connectionStart();
    ws.send(JSON.stringify({
      method: 'old',
      payload: {
        fromId: _id
      }
    }))
  }

  /**
   * Метод авторизации
   * @param token - токен пользователя
   */
  async authOnSystem(token) {
    const ws = await this.connectionStart();
    ws.send(JSON.stringify({
      method: 'auth',
      payload: {
        token: token
      }
    }));
  }
}

export default ChatService;
  