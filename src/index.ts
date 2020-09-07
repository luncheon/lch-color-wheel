import lab2lch from 'pure-color/convert/lab2lch'
import lab2xyz from 'pure-color/convert/lab2xyz'
import lch2lab from 'pure-color/convert/lch2lab'
import rgb2xyz from 'pure-color/convert/rgb2xyz'
import xyz2lab from 'pure-color/convert/xyz2lab'

const rgb2lch = (rgb: readonly [number, number, number]) => lab2lch(xyz2lab(rgb2xyz(rgb)))

const rgb2srgb = (r: number) => Math.round(256 * (r > 0.0031308 ? 1.055 * r ** (1.0 / 2.4) - 0.055 : r * 12.92))

const xyz2rgb = (xyz: readonly [number, number, number]): [number, number, number] => {
  const x = xyz[0] * 0.01
  const y = xyz[1] * 0.01
  const z = xyz[2] * 0.01

  const r = x * 3.2406 + y * -1.5372 + z * -0.4986
  const g = x * -0.9689 + y * 1.8758 + z * 0.0415
  const b = x * 0.0557 + y * -0.204 + z * 1.057

  return [rgb2srgb(r), rgb2srgb(g), rgb2srgb(b)]
}

const lch2rgbRaw = (lch: readonly [number, number, number]) => xyz2rgb(lab2xyz(lch2lab(lch)))
const isRgbValid = (rgb: readonly [number, number, number]) =>
  0 <= rgb[0] && rgb[0] <= 255 && 0 <= rgb[1] && rgb[1] <= 255 && 0 <= rgb[2] && rgb[2] <= 255

const lch2rgb = (lch: readonly [number, number, number]): [number, number, number] => {
  let rgb = lch2rgbRaw(lch)
  if (isRgbValid(rgb)) {
    return rgb
  }
  let validMinimumChroma = 0
  let invalidMinimumChroma = lch[1]
  let previousRgb
  const _lch: [number, number, number] = [lch[0], lch[1] * 0.5, lch[2]]
  do {
    previousRgb = rgb
    rgb = lch2rgbRaw(_lch)
    if (isRgbValid(rgb)) {
      validMinimumChroma = _lch[1]
      _lch[1] = (_lch[1] + invalidMinimumChroma) * 0.5
    } else {
      invalidMinimumChroma = _lch[1]
      _lch[1] = (_lch[1] + validMinimumChroma) * 0.5
    }
  } while (previousRgb[0] !== rgb[0] || previousRgb[1] !== rgb[1] || previousRgb[2] !== rgb[2])
  return [Math.max(0, Math.min(255, rgb[0])), Math.max(0, Math.min(255, rgb[1])), Math.max(0, Math.min(255, rgb[2]))]
}

const createElement = <K extends keyof HTMLElementTagNameMap>(
  parentElement: HTMLElement,
  tag: K,
  style: Partial<CSSStyleDeclaration & { webkitTouchCallout: string }>,
) => {
  const element = parentElement.appendChild(document.createElement(tag))
  for (const key of Object.keys(style) as any[]) {
    element.style[key] = style[key] as string
  }
  return element
}

export class LchColorWheel {
  static defaultOptions = {
    wheelDiameter: 200,
    wheelThickness: 20,
    handleDiameter: 16,
    drawsRgbValidityBoundary: false,
    maxChroma: 134,
    onChange: Function.prototype as (lchColorWheel: LchColorWheel) => unknown,
  }

  wheelDiameter = this.options.wheelDiameter || LchColorWheel.defaultOptions.wheelDiameter
  wheelThickness = this.options.wheelThickness || LchColorWheel.defaultOptions.wheelThickness
  handleDiameter = this.options.handleDiameter || LchColorWheel.defaultOptions.handleDiameter
  drawsRgbValidityBoundary = this.options.drawsRgbValidityBoundary || LchColorWheel.defaultOptions.drawsRgbValidityBoundary
  readonly maxChroma = this.options.maxChroma || LchColorWheel.defaultOptions.maxChroma
  onChange = this.options.onChange || LchColorWheel.defaultOptions.onChange

  readonly rootElement = createElement(this.options.appendTo, 'div', {
    position: 'relative',
    borderRadius: '50%',
    display: 'inline-block',
    lineHeight: '0',
    touchAction: 'none',
    userSelect: 'none',
    webkitTouchCallout: 'none',
    webkitTapHighlightColor: 'transparent',
  })
  readonly hueWheelElement = createElement(this.rootElement, 'canvas', { borderRadius: '50%' })
  readonly hueHandleElement = createElement(this.rootElement, 'div', {
    position: 'absolute',
    boxSizing: 'border-box',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 0 0 1px black inset',
    pointerEvents: 'none',
  })
  readonly lcSpaceElement = createElement(this.rootElement, 'canvas', {
    position: 'absolute',
    left: '0',
    top: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
  })
  readonly lcHandleElement = createElement(this.rootElement, 'div', {
    position: 'absolute',
    boxSizing: 'border-box',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 0 0 1px black inset',
  })

  private _rgb: [number, number, number] = [255, 0, 0]
  private _lch: [number, number, number] = rgb2lch(this._rgb)

  get lch(): [number, number, number] {
    return this._lch
  }
  set lch(lch) {
    this._setLch(lch[0], lch[1], lch[2])
  }

  get rgb(): [number, number, number] {
    return this._rgb
  }
  set rgb(rgb) {
    this._setLch.apply(this, rgb2lch(rgb))
  }

  constructor(readonly options: Readonly<Partial<typeof LchColorWheel.defaultOptions> & { appendTo: HTMLElement }>) {
    this.redraw()

    this.hueWheelElement.addEventListener('pointerdown', event => {
      if (event.button === 0) {
        const hueWheelElement = event.currentTarget as HTMLCanvasElement
        hueWheelElement.setPointerCapture(event.pointerId)
        const angle = Math.atan2(event.offsetY - hueWheelElement.height / 2, event.offsetX - hueWheelElement.width / 2)
        this._setLch(this._lch[0], this._lch[1], (angle * 180) / Math.PI + 90)
      }
    })
    this.hueWheelElement.addEventListener('pointermove', event => {
      const hueWheelElement = event.currentTarget as HTMLCanvasElement
      if (hueWheelElement.hasPointerCapture(event.pointerId)) {
        const angle = Math.atan2(event.offsetY - hueWheelElement.height / 2, event.offsetX - hueWheelElement.width / 2)
        this._setLch(this._lch[0], this._lch[1], (angle * 180) / Math.PI + 90)
      }
    })

    this.lcSpaceElement.addEventListener('pointerdown', event => {
      if (event.button === 0) {
        const lcSpaceElement = event.currentTarget as HTMLCanvasElement
        lcSpaceElement.setPointerCapture(event.pointerId)
        this._setLch(
          100 - (event.offsetY * 100) / lcSpaceElement.width,
          (event.offsetX * this.maxChroma) / lcSpaceElement.height,
          this._lch[2],
        )
      }
    })
    this.lcSpaceElement.addEventListener('pointermove', event => {
      const lcSpaceElement = event.currentTarget as HTMLCanvasElement
      if (lcSpaceElement.hasPointerCapture(event.pointerId)) {
        this._setLch(
          100 - (event.offsetY * 100) / lcSpaceElement.width,
          (event.offsetX * this.maxChroma) / lcSpaceElement.height,
          this._lch[2],
        )
      }
    })
    this.lcHandleElement.addEventListener('pointerdown', event => {
      if (event.button === 0) {
        this.lcSpaceElement.setPointerCapture(event.pointerId)
      }
    })
  }

  private _setLch(l: number, c: number, h: number) {
    const old = this._lch
    const lch = (this._lch = [Math.max(0, Math.min(100, l)), Math.max(0, Math.min(this.maxChroma, c)), (h % 360) + (h < 0 ? 360 : 0)])
    if (lch[0] !== old[0] || lch[1] !== old[1]) {
      this._redrawLcHandle()
      this._redrawHueWheel()
    }
    if (lch[2] !== old[2]) {
      this._redrawHueHandle()
      this._requestRedrawLcSpace()
    }
    if (lch[0] !== old[0] || lch[1] !== old[1] || lch[2] !== old[2]) {
      const rgb = lch2rgb(this._lch)
      this._rgb = [Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])]
      this.onChange(this)
    }
  }

  redraw() {
    this.hueWheelElement.width = this.hueWheelElement.height = this.wheelDiameter
    this.lcSpaceElement.width = this.lcSpaceElement.height = (this.wheelDiameter - this.wheelThickness * 2) * Math.SQRT1_2
    this.hueHandleElement.style.width = this.hueHandleElement.style.height = this.lcHandleElement.style.width = this.lcHandleElement.style.height = `${this.handleDiameter}px`
    this._redrawHueWheel()
    this._redrawHueHandle()
    this._redrawLcSpace()
    this._redrawLcHandle()
  }

  private _redrawHueWheel() {
    const [l, c] = this._lch
    const hueWheelElement = this.hueWheelElement
    const context = hueWheelElement.getContext('2d')!
    context.imageSmoothingEnabled = false
    context.lineWidth = this.wheelThickness
    context.clearRect(0, 0, hueWheelElement.width, hueWheelElement.height)
    const cx = hueWheelElement.width / 2
    const cy = hueWheelElement.height / 2
    const r = cx - this.wheelThickness / 2
    const TO_RAD = Math.PI / 180
    for (let h = 0; h < 360; h++) {
      const rgb = lch2rgb([l, c, h])
      context.beginPath()
      context.arc(cx, cy, r, (h - 90.5) * TO_RAD, (h - 89.2) * TO_RAD)
      context.strokeStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
      context.stroke()
    }
  }

  private _redrawHueHandle() {
    const hueHandleStyle = this.hueHandleElement.style
    const wheelCenter = this.wheelDiameter / 2
    const wheelRadius = wheelCenter - this.wheelThickness / 2
    const angle = ((this._lch[2] - 90) * Math.PI) / 180
    const offset = -this.handleDiameter / 2
    hueHandleStyle.left = `${wheelRadius * Math.cos(angle) + wheelCenter + offset}px`
    hueHandleStyle.top = `${wheelRadius * Math.sin(angle) + wheelCenter + offset}px`
  }

  private _redrawLcSpace() {
    const h = this._lch[2]
    const canvas = this.lcSpaceElement
    const context = canvas.getContext('2d')!
    context.imageSmoothingEnabled = false
    const imageData = context.createImageData(canvas.width, canvas.height)
    const data = imageData.data
    let p = 0
    const yToOverflowXMap = []
    for (let y = 0; y < imageData.height; y++) {
      let rgb: [number, number, number] | undefined
      let overflow: 1 | undefined
      for (let x = 0; x < imageData.width; x++) {
        const lch = [((imageData.height - y) * 100) / imageData.height, (x * this.maxChroma) / imageData.width, h] as const
        if (rgb) {
          const currentRgb = lch2rgbRaw(lch)
          if (isRgbValid(currentRgb)) {
            rgb = currentRgb
          } else if (!overflow) {
            overflow = 1
            yToOverflowXMap[y] = x
          }
        } else {
          rgb = lch2rgb(lch)
        }
        data.set(rgb, p)
        data[p + 3] = 255
        p += 4
      }
    }
    context.putImageData(imageData, 0, 0)
    if (this.drawsRgbValidityBoundary) {
      context.beginPath()
      context.moveTo(yToOverflowXMap[0], 0)
      for (let y = 1; y < imageData.height; y++) {
        context.lineTo(yToOverflowXMap[y], y)
      }
      context.strokeStyle = '#fff'
      context.lineWidth = 1.25
      context.stroke()
    }
  }

  private _redrawLcHandle() {
    const lcSpaceElement = this.lcSpaceElement
    const lcHandleStyle = this.lcHandleElement.style
    const offset = -this.handleDiameter / 2
    lcHandleStyle.top = `${lcSpaceElement.offsetTop + lcSpaceElement.offsetHeight * (1 - this._lch[0] / 100) + offset}px`
    lcHandleStyle.left = `${lcSpaceElement.offsetLeft + (lcSpaceElement.offsetWidth * this._lch[1]) / this.maxChroma + offset}px`
  }

  private _requestRedrawLcSpace_ = 0
  private _requestRedrawLcSpace() {
    if (!this._requestRedrawLcSpace_) {
      this._requestRedrawLcSpace_ = 1
      requestAnimationFrame(() => {
        this._requestRedrawLcSpace_ = 0
        this._redrawLcSpace()
      })
    }
  }
}
