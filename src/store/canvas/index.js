import StateModule from "@src/store/module";
import randomInt from "@src/utils/random-int";
import { v4 as uuidv4 } from 'uuid';

/**
 * Состояние корзины
 */
class CanvasState extends StateModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      currentItem: {},
      objectPrimitive: null,
      items: [],
      zoom: 1,
      baisX: 0,
      baisY: 0
    };
  }

  saveItems(items) {
    this.setState({
      ...this.getState(),
      items
    });
  }

  //Метод очистки канваса
  clearCanvas() {
    this.setState({
      ...this.getState(),
      items: [],
      zoom: 1,
      baisX: 0,
      baisY: 0
    });
  }

  changeMetrics(zoom, baisX, baisY) {
    this.setState({
      ...this.getState(),
      zoom,
      baisX,
      baisY
    });
  }

  changeCurrentItem(currentItem = {}) {
    this.setState({
      ...this.getState(),
      currentItem
    });
  }
}

export default CanvasState;
