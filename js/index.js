import TarotController from "./modules/TarotController.js";

const initTarot = () => {
  
  const tarot = new TarotController();
  const btn = document.querySelector('.reset');

  btn.addEventListener('click', () => {
    tarot.setCards();
  });
};

initTarot();
