function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}
export default async function() {
  await waitForElm('img[data-src]');
  console.log($('img[data-src]').length)
  await $('img[data-src]').each(function(index) {
          var that = $(this);
          var src = that.attr('data-src');
          that.removeAttr('data-src');
          that.attr('src', src);
        })

  $('.figure').each(function(index) {
    var that = $(this);
    setTimeout(function() {
      that.addClass('visible');
    }, 50 * index);
  })
}