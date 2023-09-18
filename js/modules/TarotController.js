import TarotCard from "./TarotCard.js";
import cardsData from '../data.js';

export default class TarotController {

  /**
   * @type {HTMLElement}
   */
  container;

  /**
   * @type {TarotCard[]}
   */
  cards = [];

  constructor() {
    this.container = document.querySelector('.cards-container');
    this.setCards();
    this.loop();
  }

  /**
   * 
   * @param {number} amount 
   */
  async setCards(amount = 5) {
    this.reset().then(() => {
      const shuffledCards = this.getShuffledCards();
      console.log(shuffledCards);
      for (let i = 0; i < amount; i ++) {
        if (!shuffledCards[i]) {
          return;
        }
        this.cards.push(new TarotCard(shuffledCards[i], i, amount, this));
      }
    });
  }

  loop() {
    this.cards.forEach(card => card.update());
    requestAnimationFrame(this.loop.bind(this));
  }

  reset() {
    return new Promise((resolve) => {
      if (!this.cards.length) {
        resolve(true);
        return;
      }

      this.cards.forEach(card => card.fadeOut());

      setTimeout(() => {
        this.cards = [];
        this.container.innerHTML = '';
        resolve(true);
      }, 800);
    });
  }
  
  getShuffledCards() {
    return cardsData
      .map(val => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort > b.sort ? 1 : -1)
      .map(({ val }) => val);
  }
}
