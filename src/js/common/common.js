'use strict';
const tap = 'ontouchstart' in window ? 'touchstart' : 'click';

$(() => {

  //スムーズスクロール
  smoothScroll();

});


/* スムーズスクロール */
function smoothScroll() {
  $('a[href^="#"]').on('click',(e) => {
    const speed = 400;
    const href= e.currentTarget.attr("href");
    const target = $(href == "#" || href == "" ? 'html' : href);
    const position = target.offset().top;
    $('body,html').animate({scrollTop:position}, speed);
    return false;
  });

};
