import imagegrid from './subcomponents/imageGrid.js';
import testimonials from './subcomponents/testimonials.js';
export default async function () {
  const originData = await fetch('data/data.json');
  const data = await originData.json();
  imagegrid(data);
  testimonials(data);
}