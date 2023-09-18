import TarotController from "./TarotController.js";

export default class TarotCard {

  /**
   * @type {TarotController}
   */
  controller;

  /**
   * @type {HTMLElement}
   */
  element;

  title = '';
  img = '';

  isFadeIn = false;
  isFadeOut = false;
  isHovered = false;
  isRevealed = false;

  rotate = {
    x: 0, 
    y: 0,
  };

  pos = {
    x: 0,
    y: 0,
    z: 0,
  };

  targetRotate = {
    x: 0,
    y: 0,
  };

  targetPos = {
    x: 0,
    y: 0,
    z: 0,
  };

  mousePos = {
    x: 0,
    y: 0,
  };

  /**
   * 
   * @param {*} data 
   * @param {number} index 
   * @param {number} amount 
   * @param {TarotController} controller 
   */
  constructor(data, index, amount, controller) {
    this.controller = controller;

    this.title = data?.title;
    this.img = data?.img;

    this.fadeIn();
    this.calculateProps(index, amount);
    this.createElement();
    this.addListeners();
  }

  /**
   * 
   * @param {number} index 
   * @param {number} amount 
   */
  calculateProps(index, amount) {
    const basicCoeff = this.interpolation(
      index, 
      0, 
      amount - 1, 
      -1, 
      1
    );

    const cosCoeff = -(Math.cos(basicCoeff * Math.PI * 0.5) - 1).toFixed(2);

    // Calculate rotation on Y-axis
    this.rotate.y = -(basicCoeff * 30).toFixed(2);
    // Calculate position on Z-axis
    this.pos.z = cosCoeff * 8;

    if (this.isFadeIn) {
      this.pos.y = -50;
      this.targetPos.y = -50;
    }
  }

  calculateTargetPosition() {
    const output = { ...this.pos };

    if (this.isFadeIn) {
      output.y = -50;
      output.z = 0;
    }

    if (this.isFadeOut) {
      output.y = 50;
      output.z = 0;
    }

    if (this.isHovered) {
      output.z = 10;
    }

    return output;
  }

  calculateTargetRotate() {
    const output = { ...this.rotate };

    if (this.isHovered && !this.isRevealed) {
      output.y = this.mousePos.x * 10;
      output.x = -this.mousePos.y * 10;
    }

    if (this.isRevealed && this.isHovered) {
      output.y = this.mousePos.x * 10 + 180;
      output.x = -this.mousePos.y * 10;
    }

    if (this.isRevealed && !this.isHovered) {
      output.y = this.rotate.y + 180;
    }

    if (this.isFadeIn || this.isFadeOut) {
      output.y = 0;
      output.x = this.isFadeIn ? 15 : -15;
    }

    return output;
  }

  addListeners() {
    this.element.addEventListener('mousemove', (e) => {
      this.isHovered = true;
      
      const rect = this.element.getBoundingClientRect();
      this.mousePos.x = this.interpolation(e.clientX - rect.left, 0, rect.width, -1, 1);
      this.mousePos.y = this.interpolation(e.clientY - rect.top, 0, rect.height, -1, 1);
    });

    this.element.addEventListener('mouseleave', () => {
      this.isHovered = false;
    });

    this.element.addEventListener('click', () => {
      this.isRevealed = !this.isRevealed;
    });
  }

  fadeOut() {
    this.isFadeIn = false;
    this.isFadeOut = true;
  }

  fadeIn() {
    this.isFadeIn = true;
    this.isFadeOut = false;

    setTimeout(() => {
      this.isFadeIn = false;
      this.pos.y = 0;
    }, 50);
  }

  update() {
    const rotate = this.calculateTargetRotate();
    const pos = this.calculateTargetPosition();

    Object.keys(pos).forEach(key => {
      this.targetPos[key] += (pos[key] - this.targetPos[key]) * 0.1;
      this.targetPos[key] = +(this.targetPos[key].toFixed(2));
    });

    Object.keys(rotate).forEach(key => {
      this.targetRotate[key] += (rotate[key] - this.targetRotate[key]) * 0.1;
      this.targetRotate[key] = +(this.targetRotate[key].toFixed(2));
    });

    this.setStyles();
  }

  setStyles() {
    if (!this.element) {
      return;
    }
    this.element.style.transform = `translate3d(${this.targetPos.x}rem, ${this.targetPos.y}rem, ${this.targetPos.z}rem)
      rotateX(${this.targetRotate.x}deg) rotateY(${this.targetRotate.y}deg)`;
  }

  interpolation(value, min, max, newMin, newMax) {
		let newValue = ( (value-min) / (max-min) ) * (newMax-newMin) + newMin;
		return newValue;
  }

  createElement() {
    const clone = document.querySelector('#card').content.cloneNode(true);
    this.element = clone.querySelector('.card');
    this.controller.container.appendChild(this.element);

    const cardFront = this.element.querySelector('.card__front');
    cardFront.style.backgroundImage = `url(${this.img})`;
  }
}
