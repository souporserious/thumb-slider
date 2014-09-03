'use strict';

// TODO:
//   fix weird IE9 issue
//   add touch/swipe support
//   buggy z-index, check it out

(function($) {
  
  var // initial objects
      $slider  = $('.slider'),
      $wrapper = $slider.children('ul'),
      $slides  = $wrapper.children('li'),
      $pages   = $('.slider-nav li'),
      
      // slide attributes
      slideCount  = $slides.length,
      slideWidth  = Math.round((100 / slideCount) * 100) / 100,
      slideHeight = $slides.height(),

      // store indexes
      currIndex   = 0,
      prevIndex   = 0,

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

        currIndex = $(this).index();

        var currPage = $pages.eq(currIndex);

        if( $(this).hasClass('slide-active') ) {
          
          var $this = $(this);

          self.destroySlider();
          
          // add z-index for Firefox issue
          $this.css({
            zIndex: 999
          });

          // apply the original transition back
          setTimeout(function() {
            $slides.css({
              transition: ''
            });
            $this.add(currPage).removeClass('slide-active').one(transEndEvent, function(e) {
              
              // remove z-index fix for Firefox
              $this.css({
                zIndex: ''
              });
            });
          }, 100);
        }
        else {

          $(this).add(currPage).addClass('slide-active').one(transEndEvent, function(e) {

            self.buildSlider();
          });
        }
      });

      $('.slide-next').on('click', $.proxy(function(e) {
        
        e.preventDefault();
        this.nextSlide();
      }, this));

      $('.slide-prev').on('click', $.proxy(function(e) {
        
        e.preventDefault();
        this.prevSlide();
      }, this));

      $pages.on('click', function() {

        prevIndex = currIndex;
        currIndex = $(this).index();

        self.moveSlide();
      });
    },

    buildSlider: function() {
      // myCSSObj[myTransition] = 'opacity 1s ease-in-out';
      // crosstransform = Modernizr.prefixed('transform')

      $wrapper

      .css({
        width: slideCount * 100 + '%',
        transform: 'translateX(' + currIndex * -slideWidth + '%)',
        transition: 'none'
      })

      .addClass(
        'slider-active'
      );
    },

    destroySlider: function() {

      $wrapper

      .css({
        width: '',
        transform: ''
      })

      .removeClass(
        'slider-active'
      );

      // remove the transition on slides to animate back
      $slides.css({
        transition: 'none'
      });
    },

    moveSlide: function() {
      
      var oldSlide = $slides.eq(prevIndex),
          newSlide = $slides.eq(currIndex),
          oldPage  = $pages.eq(prevIndex),
          newPage  = $pages.eq(currIndex);

      // remove active state & add new one
      oldSlide.add(oldPage).removeClass('slide-active');
      newSlide.add(newPage).addClass('slide-active');

      $wrapper.css({
        transform: 'translateX(' + currIndex * -slideWidth + '%)',
        transition: ''
      });
    },

    nextSlide: function() {

      // store previous index
      prevIndex = currIndex;

      if( currIndex >= slideCount-1 ) {

        currIndex = 0;
      } else {

        currIndex++;
      }
      this.moveSlide();
    },

    prevSlide: function() {
      
      // store previous index
      prevIndex = currIndex;

      if( currIndex === 0 ) {

        currIndex = slideCount-1;
      } else {

        currIndex--;
      }
      this.moveSlide();
    },

  };

  Slider.init();
  
})(jQuery);