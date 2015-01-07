# Slider

A jQuery slider built around Brad Birdsall's [Swipe plugin](https://github.com/thebird/Swipe).

## Installation

Install via [Bower](http://bower.io):
```
$ bower install websolutions/slider --save
```

## Usage

The most basic example follows this DOM structure:
``` html
<div class="slider">
  <div class="slider-wrap">
    <div>Slide #1</div>
    <div>Slide #2</div>
    <div>Slide #3</div>
  </div>
</div>
```

And is initialized like so:
``` javascript
$(".slider").wsol_slider();
```

Sliders can be destroyed at any time:
``` javascript
$(".slider").data("wsol.slider").destroy();
```

The plugin also supports the Swipe's other documented [API methods](https://github.com/thebird/Swipe#swipe-api).

### Configuring

In addition to Swipe's [options](https://github.com/thebird/Swipe#config-options), the plugin can be configured as such:

Option                      | Type     | Description                                                          | Default
----------------------------|----------|----------------------------------------------------------------------|--------
`swipe`                     | Object   | Configuration options for the underlying Swipe plugin                |
`arrows`                    | Boolean  | If the slider should use previous/next arrows                        | `true`
`prevArrow`                 | String   | Markup for the previous arrow                                        | `<button type="button" class="slider-prev">Previous</button>`
`nextArrow    `             | String   | Markup for the next arrow                                            | `<button type="button" class="slider-next">Next</button>`
`disabledArrowClass`        | String   | Class name to apply to disabled arrows                               | `disabled`
`paginated`                 | Boolean  | If the slider should use pagination                                  | `false`
`paginationClass`           | String   | Class name to apply to the pagination container                      | `slider-pagination`
`customPage`                | Function | Function to build pagination items                                   |
`currentPageClass`          | String   | Class name to apply to the current pagination item                   | `current`
`callback`                  | Function | Called when the slide changes                                        |
`transitionEnd`             | Function | Called when the transition for the current slide change ends         |
