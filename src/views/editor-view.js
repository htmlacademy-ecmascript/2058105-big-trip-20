import View from './view.js';
import {html} from '../utils.js';

class EditorView extends View {

  /**
   * @override
   */
  createHtml() {
    return html`
      <form class="event event--edit" action="#" method="post">
        <header class="event__header"></header>
        <section class="event__details"></section>
      </form>
    `;
  }
}

customElements.define('editor-view', EditorView);

export default EditorView;
