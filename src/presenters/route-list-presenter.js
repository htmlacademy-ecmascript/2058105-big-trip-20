import {formatDate, formatDuration, formatTime} from '../utils.js';
import Presenter from './presenter.js';


/**
 * @extends {Presenter<RouteListView, AppModel>}
 */
class RouteListPresenter extends Presenter {
  /**
   * @override
   * @return {RouteListViewState}
   */
  createViewState() {
    /**
     * @type {UrlParams}
     */
    const urlParams = this.getUrlParams();
    const points = this.model.getPoints(urlParams);
    const items = points.map(this.createPointViewState, this);

    if(urlParams.edit === 'draft') {
      /**точка маршрута с неполными полями
       * @type {Partial<Point>}
       */
      const draftPoint = {
        type: 'taxi',
        offerIds: [],
        isFavorite: false,
      };

      items.unshift(this.createPointViewState(draftPoint));
    }
    return {items};
  }

  /**
   * @param {Partial<Point>} point
   * @return {PointViewState}
   */
  createPointViewState(point) {
    const offerGroups = this.model.getOffersGroups();
    const types = offerGroups.map((it) => ({
      value: it.type,
      isSelected: it.type === point.type
    }));

    const destinations = this.model.getDestinations().map((it) => ({
      ...it,//копирует
      isSelected: it.id === point.destinationId//добавляет свойство
    }));

    const group = offerGroups.find((it) => it.type === point.type);
    const offers = group.offers.map((it) => ({
      ...it,
      isSelected: point.offerIds.includes(it.id)
    }));

    /**
     * @type {UrlParams}
     */
    const urlParams = this.getUrlParams();
    const isDraft = point.id === undefined;
    const isEditable = isDraft || point.id === urlParams.edit;

    return {
      id: point.id,
      types,
      destinations,
      startDateTime: point.startDateTime,
      endDateTime: point.endDateTime,
      startDate: formatDate(point.startDateTime),
      startTime: formatTime(point.startDateTime),
      endTime: formatTime(point.endDateTime),
      duration: formatDuration(point.startDateTime, point.endDateTime),
      basePrice: point.basePrice,
      offers,
      isFavorite: point.isFavorite,
      isEditable,
      isDraft
    };
  }

  /**
   * @param {PointViewState} point
   * @return {Point}
   */
  serializePointViewState(point) {
    return {
      id: point.id,
      type: point.types.find((it) => it.isSelected).value,//find вернет один элемент
      destinationId: point.destinations.find((it) => it.isSelected)?.id,
      startDateTime: point.startDateTime,
      endDateTime: point.endDateTime,
      basePrice: point.basePrice,
      offerIds: point.offers.filter((it) => it.isSelected).map((it) => it.id),//filter вернет все элементы
      isFavorite: point.isFavorite
    };
  }

  /**
   * @override
   */
  addEventListeners() {
    this.view.addEventListener('open', this.handleOpenView.bind(this));
    this.view.addEventListener('close', this.handleCloseView.bind(this));
    this.view.addEventListener('favorite', this.handleFavoriteView.bind(this));
    this.view.addEventListener('edit', this.handleEditView.bind(this));
    this.view.addEventListener('save', this.handleSaveView.bind(this));
    this.view.addEventListener('delete', this.handleDeleteView.bind(this));
  }

  /**
   * @param {CustomEvent & {target: CardView}} event
   */
  handleOpenView(event) {
    /**
     * @type {UrlParams}
     */
    const urlParams = this.getUrlParams();
    urlParams.edit = event.target.state.id;
    this.setUrlParams(urlParams);
  }

  handleCloseView() {
    /**
     * @type {UrlParams}
     */
    const urlParams = this.getUrlParams();
    delete urlParams.edit;
    this.setUrlParams(urlParams);
  }

  /**
   * @param {CustomEvent & {target: CardView}} event
   */
  async handleFavoriteView(event) {
    const card = event.target;
    const point = card.state;
    try {
      point.isFavorite = !point.isFavorite;//инверсия
      await this.model.updatePoint(this.serializePointViewState(point));
      card.render();

    } catch {
      card.shake();
    }
  }

  /**
   *
   * @param {CustomEvent<HTMLInputElement> & {target: EditorView}} event
   */
  handleEditView(event) {
    const editor = event.target;
    const field = event.detail;
    const point = editor.state;

    switch(field.name) {
      case 'event-type' : {
        const offerGroups = this.model.getOffersGroups();
        const {offers} = offerGroups.find((it) => it.type === field.value);

        point.offers = offers;
        point.types.forEach((it) => {
          it.isSelected = it.value === field.value;
        });
        editor.renderTypeAndRelatedFields();
        break;
      }
      case 'event-destination': {
        const name = field.value.trim();

        point.destinations.forEach((it) => {
          it.isSelected = it.name === name;
        });
        editor.renderDestination();
        break;
      }
      case 'event-start-time': {
        point.startDateTime = field.value;
        break;
      }
      case 'event-end-time': {
        point.endDateTime = field.value;
        break;
      }
      case 'event-price': {
        point.basePrice = Number(field.value);
        break;
      }
      case 'event-offer': {
        const offer = point.offers.find((it) => it.id === field.value);
        offer.isSelected = !offer.isSelected;
        break;
      }
    }
  }

  /**
   * @param {CustomEvent & {target: EditorView}} event
   */
  async handleSaveView(event) {
    const editor = event.target;
    const point = editor.state;
    try {
      event.preventDefault();
      point.isSaving = true;
      editor.renderSaveButton();

      if(point.isDraft) {
        await this.model.addPoint(this.serializePointViewState(point));
      } else {
        await this.model.updatePoint(this.serializePointViewState(point));
      }
      this.handleCloseView();
    } catch {
      point.isSaving = false;
      editor.renderSaveButton();
      editor.shake();
    }
  }

  /**
   * @param {CustomEvent & {target: EditorView}} event
   */
  async handleDeleteView(event) {
    const editor = event.target;
    const point = editor.state;

    try {
      event.preventDefault();
      point.isDeleting = true;
      editor.renderResetButton();
      await this.model.deletePoint(point.id);
      this.handleCloseView();
    } catch {
      point.isDeleting = false;
      editor.renderResetButton();
      editor.shake();
    }
  }
}

export default RouteListPresenter;

