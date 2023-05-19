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
    const points = this.model.getPoints();
    const items = points.map(this.createPointViewState, this);
    return {items};
  }

  /**
   * @param {Point} point
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
      isEditable: point.id === urlParams.edit
    };
  }

  /**
   * @override
   */
  addEventListeners() {
    /**
     * @param {CustomEvent & {target: CardView}} event
     */
    const handleOpenView = (event) => {
      /**
       * @type {UrlParams}
       */
      const urlParams = this.getUrlParams();
      urlParams.edit = event.target.state.id;
      this.setUrlParams(urlParams);
    };

    const handleCloseView = () => {
      /**
       * @type {UrlParams}
       */
      const urlParams = this.getUrlParams();
      delete urlParams.edit;
      this.setUrlParams(urlParams);
    };

    /**
     * @param {CustomEvent & {target: CardView}} event
     */
    const handleFavoriteView = (event) => {
      const card = event.target;
      const point = card.state;
      point.isFavorite = !point.isFavorite;//инверсия, поменяет булево значение на противоположное
      card.render();
    };

    this.view.addEventListener('open', handleOpenView);
    this.view.addEventListener('close', handleCloseView);
    this.view.addEventListener('favorite', handleFavoriteView);
  }
}

export default RouteListPresenter;

