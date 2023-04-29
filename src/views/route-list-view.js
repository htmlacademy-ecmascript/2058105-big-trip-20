import View from './view.js';
import {html} from '../utils.js';

class RouteListView extends View {
  constructor() {
    super();

    this.classList.add('route-list-view');
  }

  /**
   * @override
   */
  createHtml() {
    return html`

    `;
  }
}

customElements.define('list-view', RouteListView);

export default RouteListView;

