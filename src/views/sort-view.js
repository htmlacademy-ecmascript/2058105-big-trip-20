import View from './view.js';
import {html} from '../utils.js';

class SortView extends View {
  constructor() {
    super();

    this.classList.add('trip-sort');
  }

  /**
   * @override
   */
  createHtml() {
    return html`
    <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked="">
    <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled="">
    <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

   <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
    <label class="trip-sort__btn" for="sort-time">Time</label>
   </div>

   <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
    <label class="trip-sort__btn" for="sort-price">Price</label>
   </div>

   <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled="">
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
   </div>
    `;
  }
}

customElements.define('sort-view', SortView);

export default SortView;
