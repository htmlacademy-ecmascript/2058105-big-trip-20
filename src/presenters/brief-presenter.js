import Presenter from './presenter.js';

/**
 * @extends {Presenter<BriefView>}
 */
class BriefPresenter extends Presenter {
  /**
   * @override
   * @return {BriefViewState};
   */
  createViewState() {
    return {
      places: 'Amsterdam — Chamonix — Geneva',
      dates: 'Mar 18—20',
      cost: '1230'
    };
  }
}

export default BriefPresenter;

