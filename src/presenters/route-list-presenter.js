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
    console.log(items[0]);
    return {items};
  }

  /**
   * @param {Point} point
   * @return {PointViewState}
   */
  createPointViewState(point, index) {
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
      isEditable: index === 0
    };
  }
}

export default RouteListPresenter;

