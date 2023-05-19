/**
 * @abstract
 * @template S
 */
class View extends HTMLElement {
  constructor() {
    super();

    /**
     * @type {S}
     */
    this.state = null;
  }

  render() {
    this.innerHTML = String(this.createHtml());
  }

  /**
   * @return {SafeHtml}
   */
  createHtml() {
    return null;
  }

  /** dispatchEvent возвращает булево значение, в зависимости от того был ли передан evt.preventDefault или нет,т.е. был ли вызван каким то обработчиком этот метод. И мы передаем ему аргументом событие.  Это паттерн наблюдатель
   * @param {string} type
   * @param {any} [detail]
   * @return {boolean}
   */
  notify(type, detail = null) {
    const cancelable = true;
    const bubbles = true;
    const event = new CustomEvent(type, {detail, cancelable, bubbles});

    return this.dispatchEvent(event);
  }
}

export default View;
