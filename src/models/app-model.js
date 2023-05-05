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
   * return (Array<Point>)
   */
  getPoints () {
    return this.#points;
  }
}

export default AppModel;
