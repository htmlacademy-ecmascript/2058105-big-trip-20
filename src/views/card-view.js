import View from './view.js';
import {html} from '../utils.js';

class CardView extends View {
  constructor() {
    super();

    this.classList.add('card-view');
  }

  /**
   * @override
   */
  createHtml() {
    return html`

    `;
  }
}

customElements.define('card-view', CardView);

export default CardView;
