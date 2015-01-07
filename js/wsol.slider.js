/**
 * wsol.slider.js 2.0.0
 * http://github.com/websolutions/slider
 */

;(function ($, window, document, undefined) {
  if (!$.wsol) {
    $.wsol = {};
  }

  $.wsol.slider = function(el, options) {
    var base = this;

    base.$el = $(el);
    base.el = el;

    base.$el.data("wsol.slider", base);

    base.init = function() {
      base.options = $.extend({}, $.wsol.slider.defaultOptions, options);

      base.swipe = new Swipe(base.el, $.extend({}, base.options.swipe, {
        callback: base._slideHandler,
        transitionEnd: base.options.transitionEnd ? base.options.transitionEnd.bind(base, base) : null
      }));

      // Build slider
      if (base.options.arrows) {
        base._buildArrows();
        base.updateArrows();

        base.$prevArrow.on("click.slider", {
          message: "previous"
        }, base._changeSlide);
        base.$nextArrow.on("click.slider", {
          message: "next"
        }, base._changeSlide);
      }
      if (base.options.paginated) {
        base._buildPagination();
        base.updatePagination();

        base.$pagination.children("li").on("click.slider", {
          message: "index"
        }, base._changeSlide);
      }
    };

    base._buildArrows = function() {
      base.$prevArrow = $(base.options.prevArrow).appendTo(base.$el);
      base.$nextArrow = $(base.options.nextArrow).appendTo(base.$el);
    };

    base.updateArrows = function() {
      var current = base.swipe.getPos(),
          length = base.swipe.getNumSlides();

      if (!base.options.swipe.continuous) {
        if (0 < current) {
          base.$prevArrow.removeClass(base.options.disabledArrowClass);
          if (base.$prevArrow.is("input") || base.$prevArrow.is("button")) base.$prevArrow.removeAttr("disabled");
        } else {
          base.$prevArrow.addClass(base.options.disabledArrowClass);
          if (base.$prevArrow.is("input") || base.$prevArrow.is("button")) base.$prevArrow.attr("disabled", "disabled");
        }

        if (current + 1 < length) {
          base.$nextArrow.removeClass(base.options.disabledArrowClass);
          if (base.$nextArrow.is("input") || base.$nextArrow.is("button")) base.$nextArrow.removeAttr("disabled");
        } else {
          base.$nextArrow.addClass(base.options.disabledArrowClass);
          if (base.$nextArrow.is("input") || base.$nextArrow.is("button")) base.$nextArrow.attr("disabled", "disabled");
        }
      }
    };

    base._buildPagination = function() {
      var paginationString = '<ol class="' + base.options.paginationClass + '">';
      for (var i = 0, l = base.swipe.getNumSlides(); i < l; i++) {
        paginationString += '<li>' + base.options.customPage.call(this, this, i, base.swipe.getSlide(i)) + '</li>';
      }
      paginationString += '</ol>';

      base.$pagination = $(paginationString).appendTo(base.$el);
    };

    base.updatePagination = function() {
      var current = base.swipe.getPos();

      base.$pagination.children("li")
        .removeClass(base.options.currentPageClass)
        .eq(current).addClass(base.options.currentPageClass);
    };

    base._changeSlide = function(event) {
      var $target = $(event.target);

      // Prevent default action if target is a link
      $target.is('a') && event.preventDefault();

      switch(event.data.message) {
        case 'previous':
          base.swipe.prev();
          break;

        case 'next':
          base.swipe.next();
          break;

        case 'index':
          base.swipe.slide($target.closest("li").index());
          break;
      }
    };

    base._slideHandler = function(index, slide) {
      if (base.options.arrows) {
        base.updateArrows();
      }
      if (base.options.paginated) {
        base.updatePagination();
      }

      if (base.options.callback != null) {
        base.options.callback.call(base, base, index, slide);
      }
    };

    base.prev = function() {
      base.swipe.prev();
    };

    base.next = function() {
      base.swipe.next();
    };

    base.getPos = function() {
      base.swipe.getPos();
    };

    base.getNumSlides = function() {
      base.swipe.getNumSlides();
    };

    base.slide = function(slide, duration) {
      base.swipe.slide(slide, duration);
    };

    base.destroy = function() {
      base.swipe.kill();

      if (base.options.arrows) {
        base.$prevArrow.remove();
        base.$nextArrow.remove();
      }
      if (base.options.paginated) {
        base.$pagination.remove()
      }
    };

    base.init();
  };

  $.wsol.slider.defaultOptions = {
    swipe: {
      startSlide: 0,
      speed: 300,
      auto: 0,
      continuous: true,
      disableScroll: false,
      stopPropagation: false
    },
    arrows: true,
    prevArrow: '<button type="button" class="slider-prev">Previous</button>',
    nextArrow: '<button type="button" class="slider-next">Next</button>',
    disabledArrowClass: 'disabled',
    paginated: false,
    paginationClass: "slider-pagination",
    customPage: function(slider, index, slide) {
      return '<button type="button">' + (index + 1) + '</button>';
    },
    currentPageClass: 'current',
    callback: null,
    transitionEnd: null
  };

  $.fn.wsol_slider = function(options) {
    return this.each(function() {
      new $.wsol.slider(this, options);
    });
  };

})(jQuery, window, document);
