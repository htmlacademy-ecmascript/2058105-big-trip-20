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
    return 'Amsterdam — Chamonix — Geneva';
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

  /**
   * @return {string}
   */
  getCost() {
    return '1230';
  }
}

export default BriefPresenter;

