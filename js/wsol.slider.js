/**
 * wsol.slider.js 1.1.0
 * http://github.com/websolutions/slider
 */


;(function ($, window, document, undefined) {

  var defaults = {
    // Swipe config
    startSlide: 0,
    speed: 300,
    auto: 0,
    continuous: true,
    disableScroll: false,
    stopPropagation: false,
    callback: null,
    transitionEnd: null,

    // Custom config
    arrows: true,
    prevArrow: '<button type="button" class="slider-prev">Previous</button>',
    nextArrow: '<button type="button" class="slider-next">Next</button>',
    disabledArrowClass: 'disabled',
    paginated: false,
    paginationClass: "slider-pagination",
    customPage: function(slider, index, slide) {
      return '<button type="button">' + (index + 1) + '</button>';
    },
    currentPageClass: 'current'
  };

  function Slider(element, options) {
    this.$slider = $(element);

    this.changeSlide = $.proxy(this.changeSlide, this);
    this.slideHandler = $.proxy(this.slideHandler, this);

    this.settings = $.extend({}, defaults, options);
    this.swipe = new Swipe(element, $.extend({}, this.settings, {
      callback: this.slideHandler,
      transitionEnd: this.settings.transitionEnd ? this.settings.transitionEnd.bind(this, this) : null
    }));

    this.init();
  }

  Slider.prototype.init = function() {
    if (this.settings.arrows) {
      this.buildArrows();
      this.updateArrows();

      this.$prevArrow.on("click.slider", {
        message: "previous"
      }, this.changeSlide);
      this.$nextArrow.on("click.slider", {
        message: "next"
      }, this.changeSlide);
    }
    if (this.settings.paginated) {
      this.buildPagination();
      this.updatePagination();

      this.$pagination.children("li").on("click.slider", {
        message: "index"
      }, this.changeSlide);
    }
  };

  Slider.prototype.buildArrows = function() {
    this.$prevArrow = $(this.settings.prevArrow).appendTo(this.$slider);
    this.$nextArrow = $(this.settings.nextArrow).appendTo(this.$slider);
  };

  Slider.prototype.buildPagination = function() {
    var paginationString = '<ol class="' + this.settings.paginationClass + '">';
    for (var i = 0, l = this.swipe.getNumSlides(); i < l; i++) {
      paginationString += '<li>' + this.settings.customPage.call(this, this, i, this.swipe.getSlide(i)) + '</li>';
    }
    paginationString += '</ol>';

    this.$pagination = $(paginationString).appendTo(this.$slider);
  };

  Slider.prototype.updateArrows = function() {
    var current = this.swipe.getPos(),
        length = this.swipe.getNumSlides();

    if (!this.settings.continuous) {
      if (0 < current) {
        this.$prevArrow.removeClass(this.settings.disabledArrowClass);
        if (this.$prevArrow.is("input") || this.$prevArrow.is("button")) this.$prevArrow.removeAttr("disabled");
      } else {
        this.$prevArrow.addClass(this.settings.disabledArrowClass);
        if (this.$prevArrow.is("input") || this.$prevArrow.is("button")) this.$prevArrow.attr("disabled", "disabled");
      }

      if (current + 1 < length) {
        this.$nextArrow.removeClass(this.settings.disabledArrowClass);
        if (this.$nextArrow.is("input") || this.$nextArrow.is("button")) this.$nextArrow.removeAttr("disabled");
      } else {
        this.$nextArrow.addClass(this.settings.disabledArrowClass);
        if (this.$nextArrow.is("input") || this.$nextArrow.is("button")) this.$nextArrow.attr("disabled", "disabled");
      }
    }
  };

  Slider.prototype.updatePagination = function() {
    var current = this.swipe.getPos();

    this.$pagination.children("li")
      .removeClass(this.settings.currentPageClass)
      .eq(current).addClass(this.settings.currentPageClass);
  };

  Slider.prototype.changeSlide = function(event) {
    var $target = $(event.target);

    // Prevent default action if target is a link
    $target.is('a') && event.preventDefault();

    switch(event.data.message) {
      case 'previous':
        this.swipe.prev();
        break;

      case 'next':
        this.swipe.next();
        break;

      case 'index':
        this.swipe.slide($target.closest("li").index());
        break;
    }
  };

  Slider.prototype.slideHandler = function(index, slide) {
    if (this.settings.arrows) {
      this.updateArrows();
    }
    if (this.settings.paginated) {
      this.updatePagination();
    }

    if (this.settings.callback != null) {
      this.settings.callback.call(this, this, index, slide);
    }
  };

  Slider.prototype.destroy = function() {
    this.swipe.kill();

    if (this.settings.arrows) {
      this.$prevArrow.remove();
      this.$nextArrow.remove();
    }
    if (this.settings.paginated) {
      this.$pagination.remove()
    }
  };

  // Delete existing Swipe jQuery plugin
  delete $.fn.Swipe;

  $.fn.slider = function(options) {
    return this.each(function(index, element) {
      element.slider = new Slider(element, options);
    });
  };

  $.fn.sliderPrev = function() {
    return this.each(function(index, element) {
      if (element.slider) {
        element.slider.swipe.prev();
      }
    });
  };

  $.fn.sliderNext = function() {
    return this.each(function(index, element) {
      if (element.slider) {
        element.slider.swipe.next();
      }
    });
  };

  $.fn.sliderGetPos = function() {
    return this.get(0).slider.swipe.getPos();
  };

  $.fn.sliderGetNumSlides = function() {
    return this.get(0).slider.swipe.getNumSlides();
  };

  $.fn.sliderSlide = function(slide, duration) {
    return this.each(function(index, element) {
      if (element.slider) {
        element.slider.swipe.slide(slide, duration);
      }
    });
  };

  $.fn.unslider = function() {
    return this.each(function(index, element) {
      if (element.slider) {
        element.slider.destroy();
      }
    });
  };

})(jQuery, window, document);