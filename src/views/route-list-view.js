import View from './view.js';
import CardView from './card-view.js';
import EditorView from './editor-view.js';

/**
 * @extends {View<RouteListViewState>}
 */
class RouteListView extends View {
  constructor() {
    super();

    this.classList.add('trip-list');
    this.setAttribute('role', 'list');
  }

  /**
   * @override
   */
  render() {
    const views = this.state.items.map(this.createItemView);
    this.replaceChildren(...views);
  }

  /**
   * @param {PointViewState} state
   * @return {CardView | EditorView}
   */
  createItemView(state) {
    const view = state.isEditable ? new EditorView() : new CardView();
    view.classList.add('trip-list__item');
    view.setAttribute('role', 'listitem');
    view.state = state;
    view.render();

    return view;
  }
}

customElements.define('route-list-view', RouteListView);

export default RouteListView;

