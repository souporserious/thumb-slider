'use strict';

(function($) {
  
  var // initial objects
      $slider  = $('.slider'),
      $wrapper = $slider.children('ul'),
      $slides  = $wrapper.children('li'),
      
      // slide attributes
      slideCount  = $slides.length,
      slideWidth  = Math.round((100 / slideCount) * 100) / 100,
      slideHeight = $slides.height(),
      slideIndex  = 0,

      // transition end events
      transEndEvent = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd otransitionend',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
      }[Modernizr.prefixed('transition')],

      // support for css transitions
      support = Modernizr.csstransitions;

  var Slider = {

    init: function() {

      this.initEvents();
    },

    initEvents: function() {

      var self = this;

      $slides

      .each(function() {

        var $this = $(this),
            index = $this.index();

        $this.css({
          left: (100/slideCount) * index + '%'
        });
      })

      .on('click', function(e) {

        e.preventDefault();

        if( $(this).hasClass('slide-active') ) {
          $(this).removeClass('slide-active').one(transEndEvent, function(e) {
            self.destroySlider();
          });
        }
        else {
          $(this).addClass('slide-active').one(transEndEvent, function(e) {
            self.buildSlider();
          });
        }
      });

      $('.slide-next').on('click', $.proxy(function() {
  
        this.nextSlide();
      }, this));

      $('.slide-prev').on('click', $.proxy(function() {
        
        this.prevSlide();
      }, this));
    },

    buildSlider: function() {

      // set wrapper & slide widths
      $wrapper.css({
        width: slideCount * 100 + '%'
      });

      $slides.css({
        width: slideWidth + '%'
      });
    },

    destroySlider: function() {

      // set wrapper & slide widths
      $wrapper.css({
        width: ''
      });

      $slides.css({
        width: ''
      });
    },

    showControls: function() {

    },

    moveSlide: function(index) {

      $wrapper.css({ transform: 'translateX(' + slideIndex * -slideWidth + '%)' });
    },

    nextSlide: function() {
      
      if( slideIndex >= slideCount-1 ) {

        slideIndex = 0;
        $wrapper.css({ transform: 'translateX(0)' });
      } else {

        slideIndex++;
        this.moveSlide(slideIndex);
      }
    },

    prevSlide: function() {
      
      if( slideIndex === 0 ) {

        slideIndex = slideCount-1;
      } else {

        slideIndex--;
      }
      this.moveSlide(slideIndex);
    },

  };

  Slider.init();
  
})(jQuery);