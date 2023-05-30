import Model from './model.js';
import points from '../data/points.json';
import offerGroups from '../data/offers.json';
import destinations from '../data/destinations.json';

class AppModel extends Model {
  #points = points;
  #offerGroups = offerGroups;
  #destinations = destinations;

  /**
   * @type {Record<FilterType, (it: Point) => boolean>}
   */
  #filterCallbackMap = {
    everything: () => true,
    future: (it) => Date.now() < Date.parse(it.startDateTime),
    present: (it) => !this.#filterCallbackMap.past(it) && !this.#filterCallbackMap.future(it),
    past: (it) => Date.now() > Date.parse(it.endDateTime)
  };

  /**
   * @type {Record<SortType, (a : Point, b : Point) => number>}
   */
  #sortCallbackMap = {
    //Date.parse переводит строку в формате изл в мс
    day: (a, b) => Date.parse(a.startDateTime) - Date.parse(b.startDateTime),
    event: () => 0,
    time: (a, b) => AppModel.calcPointDuration(b) - AppModel.calcPointDuration(a),
    price: (a, b) => a.basePrice - b.basePrice,
    offers: () => 0
  };

  /**
   * @param {{filter?: FilterType, sort?: SortType}} [criteria]
   * @return {Array<Point>}
   */
  getPoints (criteria = {}) {
    const adaptedPoints = this.#points.map(AppModel.adaptPointForUser);
    const filterCallback = this.#filterCallbackMap[criteria.filter] ?? this.#filterCallbackMap.everything;
    const sortCallback = this.#sortCallbackMap[criteria.sort] ?? this.#sortCallbackMap.day;
    return adaptedPoints.filter(filterCallback).sort(sortCallback);
  }

  /**
   * @return {Array<Destination>}
   */
  getDestinations () {
    return structuredClone(this.#destinations);
  }

  /**
   * @return {Array<OfferGroup>}
   */
  getOffersGroups () {
    // @ts-ignore
    return structuredClone(this.#offerGroups);
  }

  /**
   * @param {Point} point
   * @return {number}
   */
  static calcPointDuration (point) {
    return Date.parse(point.endDateTime) - Date.parse(point.startDateTime);
  }

  /**
   * @param {PointInSnakeCase} point
   * @return {Point}
   */
  static adaptPointForUser(point) {
    return {
      id: point.id,
      type: point.type,
      destinationId: point.destination,
      startDateTime: point.date_from,
      endDateTime: point.date_to,
      basePrice: point.base_price,
      offerIds: point.offers,
      isFavorite: point.is_favorite
    };
  }
}

export default AppModel;