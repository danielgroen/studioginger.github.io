import * as owlCarousel from '../vendor/owl.carousel/dist/owl.carousel.min.js';

export default async function() {
  let originData = await fetch('data/data.json');
  await originData.json();

  setTimeout(() => {
    var owl = $('.owl-carousel');
    owl.owlCarousel({
      items: 1,
      autoplay:true,
      loop: true,
      autoplayTimeout:5000,
      autoplayHoverPause:true
    });
  }, 300);
}