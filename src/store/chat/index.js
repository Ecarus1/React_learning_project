import StateModule from "@src/store/module";
import { v4 as uuidv4 } from 'uuid';

/**
 * Состояние товара
 */
class ChatState extends StateModule{

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      messages: [],
      lastMessageId: '',
      waiting: true,
      maxMessages: false,
      firstInit: false
    };
  }

  /**
   * Метод обработки приходящих событий
   * @param data - ответ приходящий от сервера
   */
  async actionsChat (data) {
    console.log(data)
    switch (data.method) {
      // Самые новые 10 собщений (Выпонляется после авторизации)
      case 'last':
        this.actionLast(data);
        break;

      // Старые сообщения
      case 'old':
        this.actionOld(data);
        break;

      // Отправка или принятие сообщения
      case 'post':
        console.log('Отправка сообщений', {data})
        this.actionPost(data);
        break;
      
      // Авторизация на отправку сообщений в чат
      case 'auth':
        this.actionAuth();
        break;
    
      default:
        break;
    }
  }

  /**
   * Метод установки состояния, когда приходят первые 10 сообщений (При авторизации)
   * @param {Object} data - хранит в себе ответ от сервера
   */
  async actionLast(data) {
    if(!this.getState().messages[0]){
      this.setState({
        ...this.getState(),
        messages: [...data.payload.items.reverse()],
        waiting: false
      });
    }

    this.setState({
      ...this.getState(),
      waiting: false
    });

    // Даннаый кусок кода отвечает за повторную отправку сообщений, когда интернет был отключён, и сообщения будут доставлены при перезагрузке страницы
    if(window.sessionStorage.getItem('messages') && navigator.onLine) {
      const result = JSON.parse(window.sessionStorage.getItem('messages')).reverse();
      for(const item of result) {
        console.log(item._key)
        await this.services.chat.submitMessage(item.text, item._key);
      }
      window.sessionStorage.removeItem('messages')
    }
  }

  /**
   * Метод установик состояния когда запрашиваем более старые сообщения
   * @param {Object} data  - ответ от сервера
   */
  actionOld(data) {
    if (data.payload.items.length !== 1) {
      this.setState({
        ...this.getState(),
        messages: [ ...this.getState().messages, ...data.payload.items.slice(0, -1).reverse()],
        waiting: false
      });
    } else {
      this.setState({
        ...this.getState(),
        maxMessages: true
      });
      console.error("Захожу")
    }
  }

  /**
   * Местод на отправку сообщений или принятия от другого клиента
   * @param {Object} data - ответ от сервера 
   */
  actionPost(data) {
    this.setState({
      ...this.getState(),
      messages: [
        data.payload,
        ...this.getState().messages.filter(item => item._key !== this.getState().lastMessageId)
      ],
      lastMessageId: data.payload._id
    });
  }

  /**
   * Метод работы с состоянием, когда прошла атентификация
   */
  async actionAuth() {
    if(!this.getState().firstInit) {
      this.setState({
        ...this.getState(),
        waiting: true,
        firstInit: true
      })

      // Запрос на получение свежих сообщений
      await this.services.chat.queryFreshMessages();
    }
  }

  // Слушатель ответов от сервера
  async listner(token) {
    const ws = await this.services.chat.connectionStart();
    ws.onmessage = (e) => {
      // Если пришшло какое то событие - вызывится метод для опредления действия
      this.actionsChat(JSON.parse(e.data));
    }

    ws.onclose = async (e) => {
      // Если произошло закрытие соединения по истечению некоторого времени
      if(!e.wasClean) {
        console.log('Восстановление');
        // Заного вызываем метод инициализации
        this.init(token);
      } else {
        // Событие произойдёт если была закрыта сессия методом close
        console.log('Закрыто');
      }
    }
    return
  }

  /**
   * Метод отправки сообщения
   * @param text - текст пользователя
   * @param user - объект пользователя
   */
  async postMessage(text, user) {
    const key = uuidv4();
    const date = new Date();
    this.setState({
      ...this.getState(),
      messages: [
        {
          _id: key,
          _key: key,
          text: text,
          author: {
            _id: user._id,
            username: user.username,
            profile: {
              name: user.profile.name
            },
          },
          dateCreate: date,
          submiting: true
        },
        ...this.getState().messages,
      ],
      lastMessageId: key
    });

    this.postMessageLogicOnline(text, user, key, date);
    // await this.services.chat.submitMessage(text, key);
  }

  /**
   * 
   * @param {string} text - Текст сообщения
   * @param {object} user - объект пользователя
   * @param {string} key - сгенерированный ключ
   * @param {date} date - дата отправки
   */
  async postMessageLogicOnline(text, user, key, date) {
    const falseRequest = await this.services.chat.submitMessage(text, key);
    if(!navigator.onLine || falseRequest){
      let oldMes = JSON.parse(window.sessionStorage.getItem('messages'));
      let teampArr = [];
      if(oldMes) {
        teampArr = [
          {
            _id: key,
            _key: key,
            text: text,
            author: {
              _id: user._id,
              username: user.username,
              profile: {
                name: user.profile.name
              },
            },
            dateCreate: date,
            submiting: true
          },
          ...oldMes
        ]
      } else {
        teampArr = [
          {
            _id: key,
            _key: key,
            text: text,
            author: {
              _id: user._id,
              username: user.username,
              profile: {
                name: user.profile.name
              },
            },
            dateCreate: date,
            submiting: true
          }
        ]
      }
      teampArr = JSON.stringify(teampArr);
      window.sessionStorage.setItem('messages', teampArr);
    }
  }

  /**
   * Метод на получения старых сообщений
   */
  async oldMessage() {
    this.setState({
      ...this.getState(),
      waiting: true
    });
    // Отправляем в сервис _id последнего элемента массива
    await this.services.chat.queryOldMessages(this.getState().messages.at(-1)._id);
  }
  
  /**
   * Метод закрытия соединения
   */
  async shutdown() {
    await this.services.chat.shutdown();
  }

  /**
   * Метод инициализации чата
   * @param token - токен пользователя 
   */
  async init(token) {
    await this.listner(token);
    await this.services.chat.authOnSystem(token);
  }
}

export default ChatState;
