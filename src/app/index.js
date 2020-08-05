import Cutit from '../package';
import './styles.scss';
window.addEventListener('load', () => {
  let collection = document.querySelectorAll('.cutit');
  collection.forEach((elem) => {
    let canvas = elem.querySelector('canvas'),
      file = elem.querySelector('input[type="file"]');
    if (!canvas) return;
    let cutit = new Cutit({
      canvas,
    });
    file &&
      file.addEventListener('change', (event) => {
        cutit.setImage(event);
      });
  });
});
