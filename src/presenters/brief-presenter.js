import {formatDateRange} from '../utils.js';
import Presenter from './presenter.js';

/**
 * @extends {Presenter<BriefView, AppModel>}
 */
class BriefPresenter extends Presenter {
  /**
   * @override
   * @return {BriefViewState};
   */
  createViewState() {
    return {
      places: this.getPlaces(),
      dates: this.getDates(),
      cost: this.getCost()
    };
  }

  /**
   * @return {string}
   */
  getPlaces() {
    const points = this.model.getPoints();
    const destinations = this.model.getDestinations();

    //находим название направления, которое соответствует точке маршрута
    const names = points.map((point) => {
      const destination = destinations.find((it) => it.id === point.destinationId);
      return destination.name;
    });

    //оставляем только первый и последний город
    if(names.length > 3) {
      names.splice(1, names.length - 2, '...');
    }
    return names.join(' — ');
  }

  /**
   * @return {string}
   */
  getDates() {
    const points = this.model.getPoints();

    if(points.length) {
      const firstPoint = points.at(0);
      const lastPoint = points.at(-1);

      return formatDateRange(firstPoint.startDateTime, lastPoint.endDateTime);
    }
    return '';
  }

  /**находим все офферы, выбираем отмеченные, и суммируем прайс методом reduce
   * @return {number}
   */
  getCost() {
    const points = this.model.getPoints();
    const OfferGroups = this.model.getOffersGroups();

    return points.reduce((totalCost, point) => {
      const {offers} = OfferGroups.find((it) => it.type === point.type);
      const pointCost = offers.reduce((cost, offer) => {
        if(point.offerIds.includes(offer.id)) {
          return cost + offer.price;
        }
        return cost;
      }, point.basePrice);

      return totalCost + pointCost;
    }, 0);
  }
}

export default BriefPresenter;

