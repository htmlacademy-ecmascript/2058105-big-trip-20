import Model from './model.js';
import points from '../data/points.json';
import offerGroups from '../data/offers.json';
import destinations from '../data/destinations.json';

class AppModel extends Model {
  #points;
  #offerGroups;
  #destinations;

  constructor() {
    super();

    this.#points = points;
    this.#offerGroups = offerGroups;
    this.#destinations = destinations;
  }

  /**
   * return {Array<Point>}
   */
  getPoints () {
    return this.#points.map(AppModel.adaptPointForUser);
  }

  /**
   * return {Array<Destination>}
   */
  getDestinations () {
    return structuredClone(this.#destinations);
  }

  /**
   * return {Array<OfferGroup>}
   */
  getOffersGroup () {
    return structuredClone(this.#offerGroups);
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
