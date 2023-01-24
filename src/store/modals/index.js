import StateModule from "@src/store/module";

/**
 * Управление модальными окнами
 */
class ModalsState extends StateModule{

  initState() {
    return {
      // name: null
      nameModals: []
    };
  }

  /**
   * Открытие модального окна по названию. Возвращаем Promise для дальнейшего ожидания действия от модалки
   * @param name {String} Название модалки
   */
  open(name, _id = null){
    return new Promise((resolve) => {
      this.setState({
        // name
        ...this.getState(),
        nameModals: [...this.getState().nameModals, {resolve, name, _id}]
      }, `Открытие модалки ${name}`);
    })
  }

  /**
   * Закрытие модального окна
   */
  close(result = null){
    //Возвращаем все элементы кроме последнего по имени модалки
    if(result) {
      this.getState().nameModals.at(-1).resolve(result);
    }
    const newNameModals = this.getState().nameModals.filter((element) => element.name !== this.getState().nameModals.at(-1).name);
    this.setState({
      ...this.getState(),
      nameModals: [...newNameModals]
    }, `Закрытие модалки`);
  }
}

export default ModalsState;
