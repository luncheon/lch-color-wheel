# LCh Color Wheel

A wheel-style color picker based on CIE L*C*h color space.

[Demo](https://luncheon.github.io/lch-color-wheel/)

## Installation

T.B.D.

## Usage

```javascript
// create a new color picker
var colorWheel = new LchColorWheel({
  // appendTo is the only required property. specify the parent element of the color wheel.
  appendTo: document.getElementById('my-color-picker-container'),

  // optional properties and default values.
  wheelDiameter: 200,
  wheelThickness: 20,
  handleDiameter: 16,

  onChange: function (colorWheel) {
    // the only argument is the LchColorWheel instance itself.
    // console.log("lch:", colorWheel.lch[0], colorWheel.lch[1], colorWheel.lch[2])
  },
})

// set color in LCH / RGB
colorWheel.lch = [32, 134, 306.2]
colorWheel.rgb = [0, 0, 255]

// get color in LCH / RGB
console.log('lch:', colorWheel.lch[0], colorWheel.lch[1], colorWheel.lch[2])
console.log('rgb:', colorWheel.rgb[0], colorWheel.rgb[1], colorWheel.rgb[2])

// please call redraw() after changing some appearance properties.
colorWheel.wheelDiameter = 400
colorWheel.wheelThickness = 40
colorWheel.handleDiameter = 32
colorWheel.redraw()
```

## License

[WTFPL](http://www.wtfpl.net)

## Sister Package

[reinvented-color-wheel](https://github.com/luncheon/reinvented-color-wheel): **HSV** color wheel
