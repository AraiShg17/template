'use strict';

var tap = 'ontouchstart' in window ? 'touchstart' : 'click';

$(function () {

  //スムーズスクロール
  smoothScroll();
});

/* スムーズスクロール */
function smoothScroll() {
  $('a[href^="#"]').on('click', function (e) {
    var speed = 400;
    var href = e.currentTarget.attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $('body,html').animate({ scrollTop: position }, speed);
    return false;
  });
};