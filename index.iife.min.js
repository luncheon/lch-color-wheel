var LchColorWheel=function(){"use strict"
const t=t=>{return n=function(t){var e=t[0]/255,h=t[1]/255,i=t[2]/255
return[100*(.4124*(e=e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92)+.3576*(h=h>.04045?Math.pow((h+.055)/1.055,2.4):h/12.92)+.1805*(i=i>.04045?Math.pow((i+.055)/1.055,2.4):i/12.92)),100*(.2126*e+.7152*h+.0722*i),100*(.0193*e+.1192*h+.9505*i)]}(t),o=n[0],r=n[1],l=n[2],r/=100,l/=108.883,o=(o/=95.047)>.008856?Math.pow(o,1/3):7.787*o+16/116,e=[116*(r=r>.008856?Math.pow(r,1/3):7.787*r+16/116)-16,500*(o-r),200*(r-(l=l>.008856?Math.pow(l,1/3):7.787*l+16/116))],i=e[0],s=e[1],a=e[2],(h=360*Math.atan2(a,s)/2/Math.PI)<0&&(h+=360),[i,Math.sqrt(s*s+a*a),h]
var e,h,i,s,a,n,o,r,l},e=t=>Math.round(255*(t>.0031308?1.055*t**(1/2.4)-.055:12.92*t)),h=t=>{return(t=>{const h=.01*t[0],i=.01*t[1],s=.01*t[2],a=-.9689*h+1.8758*i+.0415*s,n=.0557*h+-.204*i+1.057*s
return[e(3.2406*h+-1.5372*i+-.4986*s),e(a),e(n)]})((h=function(t){var e,h=t[0],i=t[1]
return e=t[2]/360*2*Math.PI,[h,i*Math.cos(e),i*Math.sin(e)]}(t),o=h[0],r=h[1],l=h[2],o<=8?n=(s=100*o/903.3)/100*7.787+16/116:(s=100*Math.pow((o+16)/116,3),n=Math.pow(s/100,1/3)),[i=i/95.047<=.008856?i=95.047*(r/500+n-16/116)/7.787:95.047*Math.pow(r/500+n,3),s,a=a/108.883<=.008859?a=108.883*(n-l/200-16/116)/7.787:108.883*Math.pow(n-l/200,3)]))
var h,i,s,a,n,o,r,l},i=t=>0<=t[0]&&t[0]<=255&&0<=t[1]&&t[1]<=255&&0<=t[2]&&t[2]<=255,s=t=>{let e=h(t)
if(i(e))return e
let s,a=0,n=t[1]
const o=[t[0],.5*t[1],t[2]]
do{s=e,e=h(o),i(e)?(a=o[1],o[1]=.5*(o[1]+n)):(n=o[1],o[1]=.5*(o[1]+a))}while(s[0]!==e[0]||s[1]!==e[1]||s[2]!==e[2])
return[Math.max(0,Math.min(255,e[0])),Math.max(0,Math.min(255,e[1])),Math.max(0,Math.min(255,e[2]))]},a=(t,e,h)=>{const i=t.appendChild(document.createElement(e))
for(const t of Object.keys(h))i.style[t]=h[t]
return i}
class n{constructor(e){this.options=e,this.wheelDiameter=this.options.wheelDiameter||n.defaultOptions.wheelDiameter,this.wheelThickness=this.options.wheelThickness||n.defaultOptions.wheelThickness,this.handleDiameter=this.options.handleDiameter||n.defaultOptions.handleDiameter,this.drawsRgbValidityBoundary=this.options.drawsRgbValidityBoundary||n.defaultOptions.drawsRgbValidityBoundary,this.maxChroma=this.options.maxChroma||n.defaultOptions.maxChroma,this.onChange=this.options.onChange||n.defaultOptions.onChange,this.rootElement=a(this.options.appendTo,"div",{position:"relative",borderRadius:"50%",display:"inline-block",lineHeight:"0",touchAction:"none",userSelect:"none",webkitTouchCallout:"none",webkitTapHighlightColor:"transparent"}),this.hueWheelElement=a(this.rootElement,"canvas",{borderRadius:"50%"}),this.hueHandleElement=a(this.rootElement,"div",{position:"absolute",boxSizing:"border-box",borderRadius:"50%",border:"2px solid white",boxShadow:"0 0 0 1px black inset",pointerEvents:"none"}),this.lcSpaceElement=a(this.rootElement,"canvas",{position:"absolute",left:"0",top:"0",right:"0",bottom:"0",margin:"auto"}),this.lcHandleElement=a(this.rootElement,"div",{position:"absolute",boxSizing:"border-box",borderRadius:"50%",border:"2px solid white",boxShadow:"0 0 0 1px black inset"}),this._rgb=[255,0,0],this._lch=t(this._rgb),this._requestRedrawLcSpace_=0,this.redraw(),this.hueWheelElement.addEventListener("pointerdown",t=>{if(0===t.button){const e=t.currentTarget
e.setPointerCapture(t.pointerId)
const h=Math.atan2(t.offsetY-e.height/2,t.offsetX-e.width/2)
this._setLch(this._lch[0],this._lch[1],180*h/Math.PI+90)}}),this.hueWheelElement.addEventListener("pointermove",t=>{const e=t.currentTarget
if(e.hasPointerCapture(t.pointerId)){const h=Math.atan2(t.offsetY-e.height/2,t.offsetX-e.width/2)
this._setLch(this._lch[0],this._lch[1],180*h/Math.PI+90)}}),this.lcSpaceElement.addEventListener("pointerdown",t=>{if(0===t.button){const e=t.currentTarget
e.setPointerCapture(t.pointerId),this._setLch(100-100*t.offsetY/e.width,t.offsetX*this.maxChroma/e.height,this._lch[2])}}),this.lcSpaceElement.addEventListener("pointermove",t=>{const e=t.currentTarget
e.hasPointerCapture(t.pointerId)&&this._setLch(100-100*t.offsetY/e.width,t.offsetX*this.maxChroma/e.height,this._lch[2])}),this.lcHandleElement.addEventListener("pointerdown",t=>{0===t.button&&this.lcSpaceElement.setPointerCapture(t.pointerId)})}get lch(){return this._lch}set lch(t){this._setLch(t[0],t[1],t[2])}get rgb(){return this._rgb}set rgb(e){this._setLch.apply(this,t(e))}_setLch(t,e,h){const i=this._lch,a=this._lch=[Math.max(0,Math.min(100,t)),Math.max(0,Math.min(this.maxChroma,e)),h%360+(h<0?360:0)]
if(a[0]===i[0]&&a[1]===i[1]||(this._redrawLcHandle(),this._redrawHueWheel()),a[2]!==i[2]&&(this._redrawHueHandle(),this._requestRedrawLcSpace()),a[0]!==i[0]||a[1]!==i[1]||a[2]!==i[2]){const t=s(this._lch)
this._rgb=[Math.round(t[0]),Math.round(t[1]),Math.round(t[2])],this.onChange(this)}}redraw(){this.hueWheelElement.width=this.hueWheelElement.height=this.wheelDiameter,this.lcSpaceElement.width=this.lcSpaceElement.height=(this.wheelDiameter-2*this.wheelThickness)*Math.SQRT1_2,this.hueHandleElement.style.width=this.hueHandleElement.style.height=this.lcHandleElement.style.width=this.lcHandleElement.style.height=this.handleDiameter+"px",this._redrawHueWheel(),this._redrawHueHandle(),this._redrawLcSpace(),this._redrawLcHandle()}_redrawHueWheel(){const[t,e]=this._lch,h=this.hueWheelElement,i=h.getContext("2d")
i.imageSmoothingEnabled=!1,i.lineWidth=this.wheelThickness,i.clearRect(0,0,h.width,h.height)
const a=h.width/2,n=h.height/2,o=a-this.wheelThickness/2,r=Math.PI/180
for(let h=0;h<360;h++){const l=s([t,e,h])
i.beginPath(),i.arc(a,n,o,(h-90.5)*r,(h-89.2)*r),i.strokeStyle=`rgb(${l[0]},${l[1]},${l[2]})`,i.stroke()}}_redrawHueHandle(){const t=this.hueHandleElement.style,e=this.wheelDiameter/2,h=e-this.wheelThickness/2,i=(this._lch[2]-90)*Math.PI/180,s=-this.handleDiameter/2
t.left=h*Math.cos(i)+e+s+"px",t.top=h*Math.sin(i)+e+s+"px"}_redrawLcSpace(){const t=this._lch[2],e=this.lcSpaceElement,a=e.getContext("2d")
a.imageSmoothingEnabled=!1
const n=a.createImageData(e.width,e.height),o=n.data
let r=0
const l=[]
for(let e=0;e<n.height;e++){let a,d
for(let c=0;c<n.width;c++){const p=[100*(n.height-e)/n.height,c*this.maxChroma/n.width,t]
if(a){const t=h(p)
i(t)?a=t:d||(d=1,l[e]=c)}else a=s(p)
o.set(a,r),o[r+3]=255,r+=4}}if(a.putImageData(n,0,0),this.drawsRgbValidityBoundary){a.beginPath(),a.moveTo(l[0],0)
for(let t=1;t<n.height;t++)a.lineTo(l[t],t)
a.strokeStyle="#fff",a.lineWidth=1.25,a.stroke()}}_redrawLcHandle(){const t=this.lcSpaceElement,e=this.lcHandleElement.style,h=-this.handleDiameter/2
e.top=t.offsetTop+t.offsetHeight*(1-this._lch[0]/100)+h+"px",e.left=t.offsetLeft+t.offsetWidth*this._lch[1]/this.maxChroma+h+"px"}_requestRedrawLcSpace(){this._requestRedrawLcSpace_||(this._requestRedrawLcSpace_=1,requestAnimationFrame(()=>{this._requestRedrawLcSpace_=0,this._redrawLcSpace()}))}}return n.defaultOptions={wheelDiameter:200,wheelThickness:20,handleDiameter:16,drawsRgbValidityBoundary:!1,maxChroma:134,onChange:Function.prototype},n}()
