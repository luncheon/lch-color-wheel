import lab2xyz from 'pure-color/convert/lab2xyz';
import lch2lab from 'pure-color/convert/lch2lab';
import xyz2rgb from 'pure-color/convert/xyz2rgb';
const createElement = (parentElement, tag, style) => {
    const element = parentElement.appendChild(document.createElement(tag));
    for (const key of Object.keys(style)) {
        element.style[key] = style[key];
    }
    return element;
};
export class LchColorWheel {
    constructor(options) {
        this.options = options;
        this.wheelDiameter = this.options.wheelDiameter || LchColorWheel.defaultOptions.wheelDiameter;
        this.wheelThickness = this.options.wheelThickness || LchColorWheel.defaultOptions.wheelThickness;
        this.handleDiameter = this.options.handleDiameter || LchColorWheel.defaultOptions.handleDiameter;
        this.maxChroma = this.options.maxChroma || LchColorWheel.defaultOptions.maxChroma;
        this.onChange = this.options.onChange || LchColorWheel.defaultOptions.onChange;
        this.rootElement = createElement(this.options.appendTo, 'div', {
            position: 'relative',
            borderRadius: '50%',
            display: 'inline-block',
            lineHeight: '0',
            touchAction: 'none',
            userSelect: 'none',
            webkitTouchCallout: 'none',
            webkitTapHighlightColor: 'transparent',
        });
        this.hueWheelElement = createElement(this.rootElement, 'canvas', { borderRadius: '50%' });
        this.hueHandleElement = createElement(this.rootElement, 'div', {
            position: 'absolute',
            boxSizing: 'border-box',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 0 0 1px black inset',
            pointerEvents: 'none',
        });
        this.lcSpaceElement = createElement(this.rootElement, 'canvas', {
            position: 'absolute',
            left: '0',
            top: '0',
            right: '0',
            bottom: '0',
            margin: 'auto',
        });
        this.lcHandleElement = createElement(this.rootElement, 'div', {
            position: 'absolute',
            boxSizing: 'border-box',
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 0 0 1px black inset',
        });
        this._lch = [50, this.maxChroma, 0];
        this._requestRedrawLcSpace_ = false;
        this.redraw();
        this.hueWheelElement.addEventListener('pointerdown', event => {
            if (event.button === 0) {
                const hueWheelElement = event.currentTarget;
                hueWheelElement.setPointerCapture(event.pointerId);
                const angle = Math.atan2(event.offsetY - hueWheelElement.height / 2, event.offsetX - hueWheelElement.width / 2);
                this._setLch(this._lch[0], this._lch[1], (angle * 180) / Math.PI + 90);
            }
        });
        this.hueWheelElement.addEventListener('pointermove', event => {
            const hueWheelElement = event.currentTarget;
            if (hueWheelElement.hasPointerCapture(event.pointerId)) {
                const angle = Math.atan2(event.offsetY - hueWheelElement.height / 2, event.offsetX - hueWheelElement.width / 2);
                this._setLch(this._lch[0], this._lch[1], (angle * 180) / Math.PI + 90);
            }
        });
        this.lcSpaceElement.addEventListener('pointerdown', event => {
            if (event.button === 0) {
                const lcSpaceElement = event.currentTarget;
                lcSpaceElement.setPointerCapture(event.pointerId);
                this._setLch(100 - (event.offsetY * 100) / lcSpaceElement.width, (event.offsetX * this.maxChroma) / lcSpaceElement.height, this._lch[2]);
            }
        });
        this.lcSpaceElement.addEventListener('pointermove', event => {
            const lcSpaceElement = event.currentTarget;
            if (lcSpaceElement.hasPointerCapture(event.pointerId)) {
                this._setLch(100 - (event.offsetY * 100) / lcSpaceElement.width, (event.offsetX * this.maxChroma) / lcSpaceElement.height, this._lch[2]);
            }
        });
        this.lcHandleElement.addEventListener('pointerdown', event => {
            if (event.button === 0) {
                this.lcSpaceElement.setPointerCapture(event.pointerId);
            }
        });
    }
    get lch() {
        return this._lch;
    }
    set lch(lch) {
        this._setLch(lch[0], lch[1], lch[2]);
    }
    get rgb() {
        const rgb = LchColorWheel.lch2rgb(this._lch);
        return [Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])];
    }
    _setLch(l, c, h) {
        const old = [...this._lch];
        const lch = (this._lch = [Math.max(0, Math.min(100, l)), Math.max(0, Math.min(this.maxChroma, c)), (h % 360) + (h < 0 ? 360 : 0)]);
        if (lch[0] !== old[0] || lch[1] !== old[1]) {
            this._redrawLcHandle();
            this._redrawHueWheel();
        }
        if (lch[2] !== old[2]) {
            this._redrawHueHandle();
            this._requestRedrawLcSpace();
        }
        if (lch[0] !== old[0] || lch[1] !== old[1] || lch[2] !== old[2]) {
            this.onChange(this);
        }
    }
    redraw() {
        this.hueWheelElement.width = this.hueWheelElement.height = this.wheelDiameter;
        this.lcSpaceElement.width = this.lcSpaceElement.height = (this.wheelDiameter - this.wheelThickness * 2) * Math.SQRT1_2;
        this.hueHandleElement.style.width = this.hueHandleElement.style.height = this.lcHandleElement.style.width = this.lcHandleElement.style.height = `${this.handleDiameter}px`;
        this._redrawHueWheel();
        this._redrawHueHandle();
        this._redrawLcSpace();
        this._redrawLcHandle();
    }
    _redrawHueWheel() {
        const [l, c] = this._lch;
        const hueWheelElement = this.hueWheelElement;
        const context = hueWheelElement.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.lineWidth = this.wheelThickness;
        context.clearRect(0, 0, hueWheelElement.width, hueWheelElement.height);
        const cx = hueWheelElement.width / 2;
        const cy = hueWheelElement.height / 2;
        const r = cx - this.wheelThickness / 2;
        const TO_RAD = Math.PI / 180;
        for (let h = 0; h < 360; h++) {
            const rgb = LchColorWheel.lch2rgb([l, c, h]);
            context.beginPath();
            context.arc(cx, cy, r, (h - 90.5) * TO_RAD, (h - 89.2) * TO_RAD);
            context.strokeStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
            context.stroke();
        }
    }
    _redrawHueHandle() {
        const hueHandleStyle = this.hueHandleElement.style;
        const wheelCenter = this.wheelDiameter / 2;
        const wheelRadius = wheelCenter - this.wheelThickness / 2;
        const angle = ((this._lch[2] - 90) * Math.PI) / 180;
        const offset = -this.handleDiameter / 2;
        hueHandleStyle.left = `${wheelRadius * Math.cos(angle) + wheelCenter + offset}px`;
        hueHandleStyle.top = `${wheelRadius * Math.sin(angle) + wheelCenter + offset}px`;
    }
    _redrawLcSpace() {
        const h = this._lch[2];
        const canvas = this.lcSpaceElement;
        const context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        const imageData = context.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        let p = 0;
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                data.set(LchColorWheel.lch2rgb([((imageData.height - y) * 100) / imageData.height, (x * this.maxChroma) / imageData.width, h]), p);
                data[p + 3] = 255;
                p += 4;
            }
        }
        context.putImageData(imageData, 0, 0);
    }
    _redrawLcHandle() {
        const lcSpaceElement = this.lcSpaceElement;
        const lcHandleStyle = this.lcHandleElement.style;
        const offset = -this.handleDiameter / 2;
        lcHandleStyle.top = `${lcSpaceElement.offsetTop + lcSpaceElement.offsetHeight * (1 - this._lch[0] / 100) + offset}px`;
        lcHandleStyle.left = `${lcSpaceElement.offsetLeft + (lcSpaceElement.offsetWidth * this._lch[1]) / this.maxChroma + offset}px`;
    }
    _requestRedrawLcSpace() {
        if (!this._requestRedrawLcSpace_) {
            this._requestRedrawLcSpace_ = true;
            requestAnimationFrame(() => {
                this._requestRedrawLcSpace_ = false;
                this._redrawLcSpace();
            });
        }
    }
}
LchColorWheel.defaultOptions = {
    wheelDiameter: 200,
    wheelThickness: 20,
    handleDiameter: 16,
    maxChroma: 132,
    onChange: Function.prototype,
};
LchColorWheel.lch2rgb = (lch) => xyz2rgb(lab2xyz(lch2lab(lch)));
