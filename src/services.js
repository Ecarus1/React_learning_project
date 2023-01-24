import Store from "./store";
import APIService from "./api";
import createStoreRedux from "./store-redux";
import ChatService from "./chat";

class Services {

  constructor(config) {
    this.config = config;
  }

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store(){
    if (!this._store) {
      this._store = new Store(this, this.config.store);
    }
    return this._store;
  }

  /**
   * Сервис АПИ
   * @returns {APIService}
   */
  get api(){
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

/**
 * Сервис Chat
 * @returns {APIService}
 */
  get chat(){
    if (!this._chatService) {
      this._chatService = new ChatService(this, this.config.chatService);
    }
    return this._chatService;
  }

  /**
   * Redux store
   */
  get storeRedux(){
    if (!this._storeRedux) {
      this._storeRedux = createStoreRedux(this, this.config.storeRedux);
    }
    return this._storeRedux;
  }
}

export default Services;
