import bodyClass from './source/bodyclass.js';
import breadcrumbs from './source/breadcrumb.js';
import formvalidator from './source/formvalidator.js';
import fullscreen from './source/fullscreen.js';
import gridVisualizer from './source/grid-visualizer.js';
import jsonloader from './source/jsonloader.js';
import lazyload from './source/lazyload.js';
import owlcarousel from './source/owlcarousel.js';
import prices from './source/prices.js';
import spamspan from './source/spamspan.js';

window.addEventListener('load', async () => {
  bodyClass();
  breadcrumbs();
  formvalidator();
  gridVisualizer();
  jsonloader();
  await lazyload();
  owlcarousel();
  prices();
  spamspan();
  fullscreen();
});