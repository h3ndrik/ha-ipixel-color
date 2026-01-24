(()=>{var yt="2.11.1";var $=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._config={},this._hass=null}set hass(e){this._hass=e,this.render()}setConfig(e){if(!e.entity)throw new Error("Please define an entity");this._config=e,this.render()}getEntity(){return!this._hass||!this._config.entity?null:this._hass.states[this._config.entity]}getRelatedEntity(e,t=""){if(!this._hass||!this._config.entity)return null;let s=this._config.entity.replace(/^[^.]+\./,"").replace(/_?(text|display|gif_url)$/i,""),i=`${e}.${s}${t}`;if(this._hass.states[i])return this._hass.states[i];let o=Object.keys(this._hass.states).filter(n=>{if(!n.startsWith(`${e}.`))return!1;let a=n.replace(/^[^.]+\./,"");return a.includes(s)||s.includes(a.replace(t,""))});if(t){let n=o.find(a=>a.endsWith(t));if(n)return this._hass.states[n]}else{let n=o.sort((a,r)=>a.length-r.length);if(n.length>0)return this._hass.states[n[0]]}return o.length>0?this._hass.states[o[0]]:null}async callService(e,t,s={}){if(this._hass)try{await this._hass.callService(e,t,s)}catch(i){console.error(`iPIXEL service call failed: ${e}.${t}`,i)}}getResolution(){let e=this.getRelatedEntity("sensor","_width")||this._hass?.states["sensor.display_width"],t=this.getRelatedEntity("sensor","_height")||this._hass?.states["sensor.display_height"];if(e&&t){let s=parseInt(e.state),i=parseInt(t.state);if(!isNaN(s)&&!isNaN(i)&&s>0&&i>0)return[s,i]}return[64,16]}isOn(){return this.getRelatedEntity("switch")?.state==="on"}hexToRgb(e){let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:[255,255,255]}render(){}getCardSize(){return 2}};var P=`
  :host {
    --ipixel-primary: var(--primary-color, #03a9f4);
    --ipixel-accent: var(--accent-color, #ff9800);
    --ipixel-text: var(--primary-text-color, #fff);
    --ipixel-bg: var(--ha-card-background, #1c1c1c);
    --ipixel-border: var(--divider-color, #333);
  }

  .card-content { padding: 16px; }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .card-title {
    font-size: 1.1em;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
  }
  .status-dot.off { background: #f44336; }
  .status-dot.unavailable { background: #9e9e9e; }

  .section-title {
    font-size: 0.85em;
    font-weight: 500;
    margin-bottom: 8px;
    opacity: 0.8;
  }

  .control-row { margin-bottom: 12px; }

  /* Buttons */
  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85em;
    font-weight: 500;
    transition: all 0.2s;
  }
  .btn-primary { background: var(--ipixel-primary); color: #fff; }
  .btn-primary:hover { opacity: 0.9; }
  .btn-secondary {
    background: rgba(255,255,255,0.1);
    color: var(--ipixel-text);
    border: 1px solid var(--ipixel-border);
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.15); }
  .btn-danger { background: #f44336; color: #fff; }
  .btn-success { background: #4caf50; color: #fff; }

  .icon-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.1);
    border: 1px solid var(--ipixel-border);
    border-radius: 6px;
    cursor: pointer;
    color: inherit;
  }
  .icon-btn:hover { background: rgba(255,255,255,0.15); }
  .icon-btn.active {
    background: rgba(3, 169, 244, 0.3);
    border-color: var(--ipixel-primary);
  }
  .icon-btn svg { width: 20px; height: 20px; fill: currentColor; }

  /* Slider */
  .slider-row { display: flex; align-items: center; gap: 12px; }
  .slider-label { min-width: 70px; font-size: 0.85em; }
  .slider {
    flex: 1;
    -webkit-appearance: none;
    appearance: none;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right,
      var(--ipixel-primary) 0%,
      var(--ipixel-primary) var(--value, 50%),
      rgba(255,255,255,0.25) var(--value, 50%),
      rgba(255,255,255,0.25) 100%);
    outline: none;
    cursor: pointer;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--ipixel-primary);
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--ipixel-primary);
    cursor: pointer;
  }
  .slider-value { min-width: 40px; text-align: right; font-size: 0.85em; font-weight: 500; }

  /* Dropdown */
  .dropdown {
    width: 100%;
    padding: 8px 12px;
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--ipixel-border);
    border-radius: 6px;
    color: inherit;
    font-size: 0.9em;
    cursor: pointer;
  }

  /* Input */
  .text-input {
    width: 100%;
    padding: 10px 12px;
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--ipixel-border);
    border-radius: 6px;
    color: inherit;
    font-size: 0.9em;
    box-sizing: border-box;
  }
  .text-input:focus { outline: none; border-color: var(--ipixel-primary); }

  /* Button Grid */
  .button-grid { display: grid; gap: 8px; }
  .button-grid-4 { grid-template-columns: repeat(4, 1fr); }
  .button-grid-3 { grid-template-columns: repeat(3, 1fr); }
  .button-grid-2 { grid-template-columns: repeat(2, 1fr); }

  /* Mode buttons */
  .mode-btn {
    padding: 10px 8px;
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--ipixel-border);
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    font-size: 0.8em;
    color: inherit;
    transition: all 0.2s;
  }
  .mode-btn:hover { background: rgba(255,255,255,0.12); }
  .mode-btn.active { background: rgba(3, 169, 244, 0.25); border-color: var(--ipixel-primary); }

  /* Color picker */
  .color-row { display: flex; align-items: center; gap: 12px; }
  .color-picker {
    width: 40px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--ipixel-border);
    border-radius: 4px;
    cursor: pointer;
    background: none;
  }

  /* List items */
  .list-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    margin-bottom: 8px;
    gap: 12px;
  }
  .list-item:last-child { margin-bottom: 0; }
  .list-item-info { flex: 1; }
  .list-item-name { font-weight: 500; font-size: 0.9em; }
  .list-item-meta { font-size: 0.75em; opacity: 0.6; margin-top: 2px; }
  .list-item-actions { display: flex; gap: 4px; }

  /* Empty state */
  .empty-state { text-align: center; padding: 24px; opacity: 0.6; font-size: 0.9em; }

  @media (max-width: 400px) {
    .button-grid-4 { grid-template-columns: repeat(2, 1fr); }
  }
`;var J={A:[124,18,17,18,124],B:[127,73,73,73,54],C:[62,65,65,65,34],D:[127,65,65,34,28],E:[127,73,73,73,65],F:[127,9,9,9,1],G:[62,65,73,73,122],H:[127,8,8,8,127],I:[0,65,127,65,0],J:[32,64,65,63,1],K:[127,8,20,34,65],L:[127,64,64,64,64],M:[127,2,12,2,127],N:[127,4,8,16,127],O:[62,65,65,65,62],P:[127,9,9,9,6],Q:[62,65,81,33,94],R:[127,9,25,41,70],S:[70,73,73,73,49],T:[1,1,127,1,1],U:[63,64,64,64,63],V:[31,32,64,32,31],W:[63,64,56,64,63],X:[99,20,8,20,99],Y:[7,8,112,8,7],Z:[97,81,73,69,67],a:[32,84,84,84,120],b:[127,72,68,68,56],c:[56,68,68,68,32],d:[56,68,68,72,127],e:[56,84,84,84,24],f:[8,126,9,1,2],g:[12,82,82,82,62],h:[127,8,4,4,120],i:[0,68,125,64,0],j:[32,64,68,61,0],k:[127,16,40,68,0],l:[0,65,127,64,0],m:[124,4,24,4,120],n:[124,8,4,4,120],o:[56,68,68,68,56],p:[124,20,20,20,8],q:[8,20,20,24,124],r:[124,8,4,4,8],s:[72,84,84,84,32],t:[4,63,68,64,32],u:[60,64,64,32,124],v:[28,32,64,32,28],w:[60,64,48,64,60],x:[68,40,16,40,68],y:[12,80,80,80,60],z:[68,100,84,76,68],0:[62,81,73,69,62],1:[0,66,127,64,0],2:[66,97,81,73,70],3:[33,65,69,75,49],4:[24,20,18,127,16],5:[39,69,69,69,57],6:[60,74,73,73,48],7:[1,113,9,5,3],8:[54,73,73,73,54],9:[6,73,73,41,30]," ":[0,0,0,0,0],".":[0,96,96,0,0],",":[0,128,96,0,0],":":[0,54,54,0,0],";":[0,128,54,0,0],"!":[0,0,95,0,0],"?":[2,1,81,9,6],"-":[8,8,8,8,8],"+":[8,8,62,8,8],"=":[20,20,20,20,20],_:[64,64,64,64,64],"/":[32,16,8,4,2],"\\":[2,4,8,16,32],"(":[0,28,34,65,0],")":[0,65,34,28,0],"[":[0,127,65,65,0],"]":[0,65,65,127,0],"<":[8,20,34,65,0],">":[0,65,34,20,8],"*":[20,8,62,8,20],"#":[20,127,20,127,20],"@":[62,65,93,85,30],"&":[54,73,85,34,80],"%":[35,19,8,100,98],$:[18,42,127,42,36],"'":[0,0,7,0,0],'"':[0,7,0,7,0],"`":[0,1,2,0,0],"^":[4,2,1,2,4],"~":[8,4,8,16,8]};function wt(p,e,t,s="#ff6600",i="#111"){let o=[],r=Math.floor((t-7)/2);for(let h=0;h<t;h++)for(let f=0;f<e;f++)o.push(i);let l=p.length*6-1,d=Math.max(1,Math.floor((e-l)/2));for(let h of p){let f=J[h]||J[" "];for(let u=0;u<5;u++)for(let g=0;g<7;g++){let b=f[u]>>g&1,x=d+u,_=r+g;x>=0&&x<e&&_<t&&_>=0&&(o[_*e+x]=b?s:i)}d+=6}return o}function Et(p,e,t,s="#ff6600",i="#111"){let a=Math.floor((t-7)/2),r=p.length*6,l=e+r+e,c=[];for(let h=0;h<t;h++)for(let f=0;f<l;f++)c.push(i);let d=e;for(let h of p){let f=J[h]||J[" "];for(let u=0;u<5;u++)for(let g=0;g<7;g++){let b=f[u]>>g&1,x=d+u,_=a+g;x>=0&&x<l&&_<t&&_>=0&&(c[_*l+x]=b?s:i)}d+=6}return{pixels:c,width:l}}var Ct={VCR_OSD_MONO:{16:{font_size:16,offset:[0,0],pixel_threshold:70,var_width:!0},24:{font_size:24,offset:[0,0],pixel_threshold:70,var_width:!0},32:{font_size:28,offset:[-1,2],pixel_threshold:30,var_width:!1}},CUSONG:{16:{font_size:16,offset:[0,-1],pixel_threshold:70,var_width:!1},24:{font_size:24,offset:[0,0],pixel_threshold:70,var_width:!1},32:{font_size:32,offset:[0,0],pixel_threshold:70,var_width:!1}}},V={},K={};function Vt(p){return window.location.pathname.includes("preview.html")||window.location.port==="8080"||window.location.hostname.includes("github.io")?`./fonts/${p}.ttf`:`/hacsfiles/ipixel_color/fonts/${p}.ttf`}async function W(p){return V[p]===!0?!0:V[p]===!1?!1:(K[p]||(K[p]=(async()=>{let e=Vt(p);try{let s=await new FontFace(p,`url(${e})`).load();return document.fonts.add(s),V[p]=!0,console.log(`iPIXEL: Font ${p} loaded successfully`),!0}catch(t){return console.warn(`iPIXEL: Failed to load font ${p}:`,t),V[p]=!1,!1}})()),K[p])}function Z(p){return V[p]===!0}function It(p){return p<=18?16:p<=28?24:32}function St(p){let e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(p);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:{r:0,g:0,b:0}}function kt(p,e,t,s="#ff6600",i="#111",o="VCR_OSD_MONO"){let n=Ct[o];if(!n)return console.warn(`iPIXEL: Unknown font: ${o}`),null;if(!Z(o))return W(o),null;let a=It(t),r=n[a],l=document.createElement("canvas");l.width=e,l.height=t;let c=l.getContext("2d");if(c.imageSmoothingEnabled=!1,c.fillStyle=i,c.fillRect(0,0,e,t),!p||p.trim()===""){let m=[];for(let v=0;v<e*t;v++)m.push(i);return m}c.font=`${r.font_size}px "${o}"`,c.fillStyle=s,c.textBaseline="top";let h=c.measureText(p).width,f=Math.floor((e-h)/2)+r.offset[0],u=Math.floor((t-r.font_size)/2)+r.offset[1];c.fillText(p,f,u);let g=c.getImageData(0,0,e,t),b=[],x=St(s),_=St(i);for(let m=0;m<g.data.length;m+=4){let v=g.data[m],y=g.data[m+1],S=g.data[m+2];(v+y+S)/3>=r.pixel_threshold?b.push(s):b.push(i)}return b}function Rt(p,e,t,s="#ff6600",i="#111",o="VCR_OSD_MONO"){let n=Ct[o];if(!n)return null;if(!Z(o))return W(o),null;let a=It(t),r=n[a],c=document.createElement("canvas").getContext("2d");c.font=`${r.font_size}px "${o}"`;let d=Math.ceil(c.measureText(p).width),h=e+d+e,f=document.createElement("canvas");f.width=h,f.height=t;let u=f.getContext("2d");if(u.imageSmoothingEnabled=!1,u.fillStyle=i,u.fillRect(0,0,h,t),!p||p.trim()===""){let m=[];for(let v=0;v<h*t;v++)m.push(i);return{pixels:m,width:h}}u.font=`${r.font_size}px "${o}"`,u.fillStyle=s,u.textBaseline="top";let g=e+r.offset[0],b=Math.floor((t-r.font_size)/2)+r.offset[1];u.fillText(p,g,b);let x=u.getImageData(0,0,h,t),_=[];for(let m=0;m<x.data.length;m+=4){let v=x.data[m],y=x.data[m+1],S=x.data[m+2];(v+y+S)/3>=r.pixel_threshold?_.push(s):_.push(i)}return{pixels:_,width:h}}var Wt=function(p,e,t,s){return new(t||(t=Promise))(function(i,o){function n(l){try{r(s.next(l))}catch(c){o(c)}}function a(l){try{r(s.throw(l))}catch(c){o(c)}}function r(l){var c;l.done?i(l.value):(c=l.value,c instanceof t?c:new t(function(d){d(c)})).then(n,a)}r((s=s.apply(p,e||[])).next())})},B=function(p){return this instanceof B?(this.v=p,this):new B(p)},Gt=function(p,e,t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s,i=t.apply(p,e||[]),o=[];return s={},n("next"),n("throw"),n("return"),s[Symbol.asyncIterator]=function(){return this},s;function n(d){i[d]&&(s[d]=function(h){return new Promise(function(f,u){o.push([d,h,f,u])>1||a(d,h)})})}function a(d,h){try{(f=i[d](h)).value instanceof B?Promise.resolve(f.value.v).then(r,l):c(o[0][2],f)}catch(u){c(o[0][3],u)}var f}function r(d){a("next",d)}function l(d){a("throw",d)}function c(d,h){d(h),o.shift(),o.length&&a(o[0][0],o[0][1])}};function Tt(p,{includeLastEmptyLine:e=!0,encoding:t="utf-8",delimiter:s=/\r?\n/g}={}){return Gt(this,arguments,function*(){let i=yield B((d=>Wt(void 0,void 0,void 0,function*(){let h=yield fetch(d);if(h.body===null)throw new Error("Cannot read file");return h.body.getReader()}))(p)),{value:o,done:n}=yield B(i.read()),a=new TextDecoder(t),r,l=o?a.decode(o):"";if(typeof s=="string"){if(s==="")throw new Error("delimiter cannot be empty string!");r=new RegExp(s.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&"),"g")}else r=/g/.test(s.flags)===!1?new RegExp(s.source,s.flags+"g"):s;let c=0;for(;;){let d=r.exec(l);if(d!==null)yield yield B(l.substring(c,d.index)),c=r.lastIndex;else{if(n===!0)break;let h=l.substring(c);({value:o,done:n}=yield B(i.read())),l=h+(l?a.decode(o):""),c=0}}(e||c<l.length)&&(yield yield B(l.substring(c)))})}var A=function(p,e,t,s){return new(t||(t=Promise))(function(i,o){function n(l){try{r(s.next(l))}catch(c){o(c)}}function a(l){try{r(s.throw(l))}catch(c){o(c)}}function r(l){var c;l.done?i(l.value):(c=l.value,c instanceof t?c:new t(function(d){d(c)})).then(n,a)}r((s=s.apply(p,e||[])).next())})},jt=function(p){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,t=p[Symbol.asyncIterator];return t?t.call(p):(p=typeof __values=="function"?__values(p):p[Symbol.iterator](),e={},s("next"),s("throw"),s("return"),e[Symbol.asyncIterator]=function(){return this},e);function s(i){e[i]=p[i]&&function(o){return new Promise(function(n,a){(function(r,l,c,d){Promise.resolve(d).then(function(h){r({value:h,done:c})},l)})(n,a,(o=p[i](o)).done,o.value)})}}},Mt="[\\s]+",qt={glyphname:"empty",codepoint:8203,bbw:0,bbh:0,bbxoff:0,bbyoff:0,swx0:0,swy0:0,dwx0:0,dwy0:0,swx1:0,swy1:0,dwx1:0,dwy1:0,vvectorx:0,vvectory:0,hexdata:[]},Ut=["glyphname","codepoint","bbw","bbh","bbxoff","bbyoff","swx0","swy0","dwx0","dwy0","swx1","swy1","dwx1","dwy1","vvectorx","vvectory","hexdata"],Yt={lr:"lrtb",rl:"rltb",tb:"tbrl",bt:"btrl",lrtb:void 0,lrbt:void 0,rltb:void 0,rlbt:void 0,tbrl:void 0,tblr:void 0,btrl:void 0,btlr:void 0},Q={lr:1,rl:2,tb:0,bt:-1},ut=class{constructor(){this.headers=void 0,this.__headers={},this.props={},this.glyphs=new Map,this.__glyph_count_to_check=null,this.__curline_startchar=null,this.__curline_chars=null}load_filelines(e){var t,s;return A(this,void 0,void 0,function*(){try{this.__f=e,yield this.__parse_headers()}finally{if(typeof Deno<"u"&&this.__f!==void 0)try{for(var i,o=jt(this.__f);!(i=yield o.next()).done;)i.value}catch(n){t={error:n}}finally{try{i&&!i.done&&(s=o.return)&&(yield s.call(o))}finally{if(t)throw t.error}}}return this})}__parse_headers(){var e,t;return A(this,void 0,void 0,function*(){for(;;){let s=(t=yield(e=this.__f)===null||e===void 0?void 0:e.next())===null||t===void 0?void 0:t.value,i=s.split(/ (.+)/,2),o=i.length,n;if(o===2){let a=i[0],r=i[1].trim();switch(a){case"STARTFONT":this.__headers.bdfversion=parseFloat(r);break;case"FONT":this.__headers.fontname=r;break;case"SIZE":n=r.split(" "),this.__headers.pointsize=parseInt(n[0],10),this.__headers.xres=parseInt(n[1],10),this.__headers.yres=parseInt(n[2],10);break;case"FONTBOUNDINGBOX":n=r.split(" "),this.__headers.fbbx=parseInt(n[0],10),this.__headers.fbby=parseInt(n[1],10),this.__headers.fbbxoff=parseInt(n[2],10),this.__headers.fbbyoff=parseInt(n[3],10);break;case"STARTPROPERTIES":return this.__parse_headers_after(),void(yield this.__parse_props());case"COMMENT":"comment"in this.__headers&&Array.isArray(this.__headers.comment)||(this.__headers.comment=[]),this.__headers.comment.push(r.replace(/^[\s"'\t\r\n]+|[\s"'\t\r\n]+$/g,""));break;case"SWIDTH":n=r.split(" "),this.__headers.swx0=parseInt(n[0],10),this.__headers.swy0=parseInt(n[1],10);break;case"DWIDTH":n=r.split(" "),this.__headers.dwx0=parseInt(n[0],10),this.__headers.dwy0=parseInt(n[1],10);break;case"SWIDTH1":n=r.split(" "),this.__headers.swx1=parseInt(n[0],10),this.__headers.swy1=parseInt(n[1],10);break;case"DWIDTH1":n=r.split(" "),this.__headers.dwx1=parseInt(n[0],10),this.__headers.dwy1=parseInt(n[1],10);break;case"VVECTOR":n=Mt.split(r),this.__headers.vvectorx=parseInt(n[0],10),this.__headers.vvectory=parseInt(n[1],10);break;case"METRICSSET":case"CONTENTVERSION":this.__headers[a.toLowerCase()]=parseInt(r,10);break;case"CHARS":return console.warn("It looks like the font does not have property block beginning with 'STARTPROPERTIES' keyword"),this.__parse_headers_after(),this.__curline_chars=s,void(yield this.__parse_glyph_count());case"STARTCHAR":return console.warn("It looks like the font does not have property block beginning with 'STARTPROPERTIES' keyword"),console.warn("Cannot find 'CHARS' line"),this.__parse_headers_after(),this.__curline_startchar=s,void(yield this.__prepare_glyphs())}}if(o===1&&i[0].trim()==="ENDFONT")return console.warn("It looks like the font does not have property block beginning with 'STARTPROPERTIES' keyword"),void console.warn("This font does not have any glyphs")}})}__parse_headers_after(){"metricsset"in this.__headers||(this.__headers.metricsset=0),this.headers=this.__headers}__parse_props(){var e,t;return A(this,void 0,void 0,function*(){for(;;){let s=((t=yield(e=this.__f)===null||e===void 0?void 0:e.next())===null||t===void 0?void 0:t.value).split(/ (.+)/,2),i=s.length;if(i===2){let o=s[0],n=s[1].replace(/^[\s"'\t\r\n]+|[\s"'\t\r\n]+$/g,"");o==="COMMENT"?("comment"in this.props&&Array.isArray(this.props.comment)||(this.props.comment=[]),this.props.comment.push(n.replace(/^[\s"'\t\r\n]+|[\s"'\t\r\n]+$/g,""))):this.props[o.toLowerCase()]=n}else if(i===1){let o=s[0].trim();if(o==="ENDPROPERTIES")return void(yield this.__parse_glyph_count());if(o==="ENDFONT")return void console.warn("This font does not have any glyphs");this.props[o]=null}}})}__parse_glyph_count(){var e,t;return A(this,void 0,void 0,function*(){let s;if(this.__curline_chars===null?s=(t=yield(e=this.__f)===null||e===void 0?void 0:e.next())===null||t===void 0?void 0:t.value:(s=this.__curline_chars,this.__curline_chars=null),s.trim()==="ENDFONT")return void console.warn("This font does not have any glyphs");let i=s.split(/ (.+)/,2);i[0]==="CHARS"?this.__glyph_count_to_check=parseInt(i[1].trim(),10):(this.__curline_startchar=s,console.warn("Cannot find 'CHARS' line next to 'ENDPROPERTIES' line")),yield this.__prepare_glyphs()})}__prepare_glyphs(){var e,t;return A(this,void 0,void 0,function*(){let s=0,i=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],o=[],n=!1,a=!1;for(;;){let r;if(this.__curline_startchar===null?r=(t=yield(e=this.__f)===null||e===void 0?void 0:e.next())===null||t===void 0?void 0:t.value:(r=this.__curline_startchar,this.__curline_startchar=null),r==null)return console.warn("This font does not have 'ENDFONT' keyword"),void this.__prepare_glyphs_after();let l=r.split(/ (.+)/,2),c=l.length;if(c===2){let d=l[0],h=l[1].trim(),f;switch(d){case"STARTCHAR":i=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],i[0]=h,a=!1;break;case"ENCODING":s=parseInt(h,10),i[1]=s;break;case"BBX":f=h.split(" "),i[2]=parseInt(f[0],10),i[3]=parseInt(f[1],10),i[4]=parseInt(f[2],10),i[5]=parseInt(f[3],10);break;case"SWIDTH":f=h.split(" "),i[6]=parseInt(f[0],10),i[7]=parseInt(f[1],10);break;case"DWIDTH":f=h.split(" "),i[8]=parseInt(f[0],10),i[9]=parseInt(f[1],10);break;case"SWIDTH1":f=h.split(" "),i[10]=parseInt(f[0],10),i[11]=parseInt(f[1],10);break;case"DWIDTH1":f=h.split(" "),i[12]=parseInt(f[0],10),i[13]=parseInt(f[1],10);break;case"VVECTOR":f=Mt.split(h),i[14]=parseInt(f[0],10),i[15]=parseInt(f[1],10)}}else if(c===1){let d=l[0].trim();switch(d){case"BITMAP":o=[],n=!0;break;case"ENDCHAR":n=!1,i[16]=o,this.glyphs.set(s,i),a=!0;break;case"ENDFONT":if(a)return void this.__prepare_glyphs_after();default:n&&o.push(d)}}}})}__prepare_glyphs_after(){let e=this.glyphs.size;this.__glyph_count_to_check!==e&&(this.__glyph_count_to_check===null?console.warn("The glyph count next to 'CHARS' keyword does not exist"):console.warn(`The glyph count next to 'CHARS' keyword is ${this.__glyph_count_to_check.toString()}, which does not match the actual glyph count ${e.toString()}`))}get length(){return this.glyphs.size}itercps(e,t){let s=e??1,i=t??null,o,n=[...this.glyphs.keys()];switch(s){case 1:o=n.sort((a,r)=>a-r);break;case 0:o=n;break;case 2:o=n.sort((a,r)=>r-a);break;case-1:o=n.reverse()}if(i!==null){let a=r=>{if(typeof i=="number")return r<i;if(Array.isArray(i)&&i.length===2&&typeof i[0]=="number"&&typeof i[1]=="number")return r<=i[1]&&r>=i[0];if(Array.isArray(i)&&Array.isArray(i[0]))for(let l of i){let[c,d]=l;if(r<=d&&r>=c)return!0}return!1};o=o.filter(a)}return o}*iterglyphs(e,t){for(let s of this.itercps(e,t))yield this.glyphbycp(s)}glyphbycp(e){let t=this.glyphs.get(e);if(t==null)return console.warn(`Glyph "${String.fromCodePoint(e)}" (codepoint ${e.toString()}) does not exist in the font. Will return 'null'`),null;{let s={};return Ut.forEach((i,o)=>{var n,a,r;n=s,a=i,r=t[o],n[a]=r}),new D(s,this)}}glyph(e){let t=e.codePointAt(0);return t===void 0?null:this.glyphbycp(t)}lacksglyphs(e){let t=[],s=e.length;for(let i,o=0;o<s;o++){i=e[o];let n=i.codePointAt(0);n!==void 0&&this.glyphs.has(n)||t.push(i)}return t.length!==0?t:null}drawcps(e,t={}){var s,i,o,n,a,r,l;let c=(s=t.linelimit)!==null&&s!==void 0?s:512,d=(i=t.mode)!==null&&i!==void 0?i:1,h=(o=t.direction)!==null&&o!==void 0?o:"lrtb",f=(n=t.usecurrentglyphspacing)!==null&&n!==void 0&&n,u=(a=t.missing)!==null&&a!==void 0?a:null;if(this.headers===void 0)throw new Error("Font is not loaded");let g,b,x,_,m,v,y,S,E,I,C,T,L,M,O,j,q,U,gt=(r=Yt[h])!==null&&r!==void 0?r:h,xt=gt.slice(0,2),mt=gt.slice(2,4);xt in Q&&mt in Q?(v=Q[xt],y=Q[mt]):(v=1,y=0),y===0||y===2?g=1:y!==1&&y!==-1||(g=0),v===1||v===-1?b=1:v!==2&&v!==0||(b=0),d===1&&(S=v>0?this.headers.fbbx:this.headers.fbby,v>0?(T="dwx0",L="dwy0"):(T="dwx1",L="dwy1"),C=T in this.headers?this.headers[T]:L in this.headers?this.headers[L]:null);let bt=[];_=[];let vt=[];O=[],j=0;let _t=()=>{bt.push(_),f?O.shift():O.pop(),vt.push(O)},zt=e[Symbol.iterator]();for(q=!1;;){if(q)q=!1;else{if(m=(l=zt.next())===null||l===void 0?void 0:l.value,m===void 0)break;let Y=this.glyphbycp(m);E=Y!==null?Y:u?u instanceof D?u:new D(u,this):new D(qt,this),x=E.draw(),U=x.width(),M=0,d===1&&T!==void 0&&L!==void 0&&(I=E.meta[T]||E.meta[L],I==null&&(I=C),I!=null&&S!==void 0&&(M=I-S))}if(U!==void 0&&M!==void 0&&x!==void 0&&E!==void 0&&m!==void 0)if(j+=U+M,j<=c)_.push(x),O.push(M);else{if(_.length===0)throw new Error(`\`_linelimit\` (${c}) is too small the line can't even contain one glyph: "${E.chr()}" (codepoint ${m}, width: ${U})`);_t(),j=0,_=[],O=[],q=!0}}_.length!==0&&_t();let Nt=bt.map((Y,Xt)=>G.concatall(Y,{direction:v,align:g,offsetlist:vt[Xt]}));return G.concatall(Nt,{direction:y,align:b})}draw(e,t={}){let{linelimit:s,mode:i,direction:o,usecurrentglyphspacing:n,missing:a}=t;return this.drawcps(e.split("").map(r=>{let l=r.codePointAt(0);return l===void 0?8203:l}),{linelimit:s,mode:i,direction:o,usecurrentglyphspacing:n,missing:a})}drawall(e={}){let{order:t,r:s,linelimit:i,mode:o,direction:n,usecurrentglyphspacing:a}=e,r=o??0;return this.drawcps(this.itercps(t,s),{linelimit:i,mode:r,direction:n,usecurrentglyphspacing:a})}},D=class{constructor(e,t){this.meta=e,this.font=t}toString(){return this.draw().toString()}repr(){var e;return"Glyph("+JSON.stringify(this.meta,null,2)+", Font(<"+((e=this.font.headers)===null||e===void 0?void 0:e.fontname)+">)"}cp(){return this.meta.codepoint}chr(){return String.fromCodePoint(this.cp())}draw(e,t){let s=t??null,i;switch(e??0){case 0:i=this.__draw_fbb();break;case 1:i=this.__draw_bb();break;case 2:i=this.__draw_original();break;case-1:if(s===null)throw new Error("Parameter bb in draw() method must be set when mode=-1");i=this.__draw_user_specified(s)}return i}__draw_user_specified(e){let t=this.meta.bbxoff,s=this.meta.bbyoff,[i,o,n,a]=e;return this.__draw_bb().crop(i,o,-t+n,-s+a)}__draw_original(){return new G(this.meta.hexdata.map(e=>e?parseInt(e,16).toString(2).padStart(4*e.length,"0"):""))}__draw_bb(){let e=this.meta.bbw,t=this.meta.bbh,s=this.__draw_original(),i=s.bindata,o=i.length;return o!==t&&console.warn(`Glyph "${this.meta.glyphname.toString()}" (codepoint ${this.meta.codepoint.toString()})'s bbh, ${t.toString()}, does not match its hexdata line count, ${o.toString()}`),s.bindata=i.map(n=>n.slice(0,e)),s}__draw_fbb(){let e=this.font.headers;if(e===void 0)throw new Error("Font is not loaded");return this.__draw_user_specified([e.fbbx,e.fbby,e.fbbxoff,e.fbbyoff])}origin(e={}){var t,s,i,o;let n=(t=e.mode)!==null&&t!==void 0?t:0,a=(s=e.fromorigin)!==null&&s!==void 0&&s,r=(i=e.xoff)!==null&&i!==void 0?i:null,l=(o=e.yoff)!==null&&o!==void 0?o:null,c,d=this.meta.bbxoff,h=this.meta.bbyoff;switch(n){case 0:let f=this.font.headers;if(f===void 0)throw new Error("Font is not loaded");c=[f.fbbxoff,f.fbbyoff];break;case 1:case 2:c=[d,h];break;case-1:if(r===null||l===null)throw new Error("Parameter xoff and yoff in origin() method must be all set when mode=-1");c=[r,l]}return a?c:[0-c[0],0-c[1]]}},G=class p{constructor(e){this.bindata=e}toString(){return this.bindata.join(`
`).replace(/0/g,".").replace(/1/g,"#").replace(/2/g,"&")}repr(){return`Bitmap(${JSON.stringify(this.bindata,null,2)})`}width(){return this.bindata[0].length}height(){return this.bindata.length}clone(){return new p([...this.bindata])}static __crop_string(e,t,s){let i=e,o=e.length,n=0;t<0&&(n=0-t,i=i.padStart(n+o,"0")),t+s>o&&(i=i.padEnd(t+s-o+i.length,"0"));let a=t+n;return i.slice(a,a+s)}static __string_offset_concat(e,t,s){let i=s??0;if(i===0)return e+t;let o=e.length,n=o+i,a=n+t.length,r=Math.min(0,n),l=Math.max(o,a),c=p.__crop_string(e,r,l-r),d=p.__crop_string(t,r-n,l-r);return c.split("").map((h,f)=>(parseInt(d[f],10)||parseInt(h,10)).toString()).join("")}static __listofstr_offset_concat(e,t,s){let i=s??0,o,n;if(i===0)return e.concat(t);let a=e[0].length,r=e.length,l=r+i,c=l+t.length,d=Math.min(0,l),h=Math.max(r,c),f=[];for(let u=d;u<h;u++)o=u<0||u>=r?"0".repeat(a):e[u],n=u<l||u>=c?"0".repeat(a):t[u-l],f.push(o.split("").map((g,b)=>(parseInt(n[b],10)||parseInt(g,10)).toString()).join(""));return f}static __crop_bitmap(e,t,s,i,o){let n,a=[],r=e.length;for(let l=0;l<s;l++)n=r-o-s+l,n<0||n>=r?a.push("0".repeat(t)):a.push(p.__crop_string(e[n],i,t));return a}crop(e,t,s,i){let o=s??0,n=i??0;return this.bindata=p.__crop_bitmap(this.bindata,e,t,o,n),this}overlay(e){let t=this.bindata,s=e.bindata;return t.length!==s.length&&console.warn("the bitmaps to overlay have different height"),t[0].length!==s[0].length&&console.warn("the bitmaps to overlay have different width"),this.bindata=t.map((i,o)=>{let n=i,a=s[o];return n.split("").map((r,l)=>(parseInt(a[l],10)||parseInt(r,10)).toString()).join("")}),this}static concatall(e,t={}){var s,i,o;let n=(s=t.direction)!==null&&s!==void 0?s:1,a=(i=t.align)!==null&&i!==void 0?i:1,r=(o=t.offsetlist)!==null&&o!==void 0?o:null,l,c,d,h,f,u,g;if(n>0){d=Math.max(...e.map(x=>x.height())),f=Array(d).fill("");let b=(x,_,m)=>n===1?p.__string_offset_concat(x,_,m):p.__string_offset_concat(_,x,m);for(let x=0;x<d;x++){c=a?-x-1:x,h=0;let _=e.length;for(let m=0;m<_;m++){let v=e[m];r&&m!==0&&(h=r[m-1]),x<v.height()?c>=0?f[c]=b(f[c],v.bindata[c],h):f[d+c]=b(f[d+c],v.bindata[v.height()+c],h):c>=0?f[c]=b(f[c],"0".repeat(v.width()),h):f[d+c]=b(f[d+c],"0".repeat(v.width()),h)}}}else{d=Math.max(...e.map(x=>x.width())),f=[],h=0;let b=e.length;for(let x=0;x<b;x++){let _=e[x];r&&x!==0&&(h=r[x-1]),l=_.bindata,u=_.width(),u!==d&&(g=a?0:u-d,l=this.__crop_bitmap(l,d,_.height(),g,0)),f=n===0?p.__listofstr_offset_concat(f,l,h):p.__listofstr_offset_concat(l,f,h)}}return new this(f)}concat(e,t={}){let{direction:s,align:i,offset:o}=t,n=o??0;return this.bindata=p.concatall([this,e],{direction:s,align:i,offsetlist:[n]}).bindata,this}static __enlarge_bindata(e,t,s){let i=t??1,o=s??1,n=[...e];return i>1&&(n=n.map(a=>a.split("").reduce((r,l)=>r.concat(Array(i).fill(l)),[]).join(""))),o>1&&(n=n.reduce((a,r)=>a.concat(Array(o).fill(r)),[])),n}enlarge(e,t){return this.bindata=p.__enlarge_bindata(this.bindata,e,t),this}replace(e,t){let s=typeof e=="number"?e.toString():e,i=typeof t=="number"?t.toString():t;return this.bindata=this.bindata.map(o=>((n,a,r)=>{if("replaceAll"in String.prototype)return n.replaceAll(a,r);{let l=c=>c.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&");return n.replace(new RegExp(l(a),"g"),r)}})(o,s,i)),this}shadow(e,t){let s=e??1,i=t??-1,o,n,a,r,l,c,d=this.clone();return c=this.width(),o=this.height(),c+=Math.abs(s),o+=Math.abs(i),d.bindata=d.bindata.map(h=>h.replace(/1/g,"2")),s>0?(n=0,r=-s):(n=s,r=0),i>0?(a=0,l=-i):(a=i,l=0),this.crop(c,o,n,a),d.crop(c,o,r,l),d.overlay(this),this.bindata=d.bindata,this}glow(e){var t,s,i,o,n,a,r,l,c,d,h,f,u,g;let b=e??0,x,_,m,v;m=this.width(),v=this.height(),m+=2,v+=2,this.crop(m,v,-1,-1);let y=this.todata(2),S=y.length;for(let E=0;E<S;E++){x=y[E];let I=x.length;for(let C=0;C<I;C++)_=x[C],_===1&&((t=y[E])[s=C-1]||(t[s]=2),(i=y[E])[o=C+1]||(i[o]=2),(n=y[E-1])[C]||(n[C]=2),(a=y[E+1])[C]||(a[C]=2),b===1&&((r=y[E-1])[l=C-1]||(r[l]=2),(c=y[E-1])[d=C+1]||(c[d]=2),(h=y[E+1])[f=C-1]||(h[f]=2),(u=y[E+1])[g=C+1]||(u[g]=2)))}return this.bindata=y.map(E=>E.map(I=>I.toString()).join("")),this}bytepad(e){let t=e??8,s=this.width(),i=this.height(),o=s%t;return o===0?this:this.crop(s+t-o,i)}todata(e){let t;switch(e??1){case 0:t=this.bindata.join(`
`);break;case 1:t=this.bindata;break;case 2:t=this.bindata.map(s=>s.split("").map(i=>parseInt(i,10)));break;case 3:t=[].concat(...this.todata(2));break;case 4:t=this.bindata.map(s=>{if(!/^[01]+$/.test(s))throw new Error(`Invalid binary string: ${s}`);return parseInt(s,2).toString(16).padStart(-1*Math.floor(-1*this.width()/4),"0")});break;case 5:t=this.bindata.map(s=>{if(!/^[01]+$/.test(s))throw new Error(`Invalid binary string: ${s}`);return parseInt(s,2)})}return t}draw2canvas(e,t){let s=t??{0:null,1:"black",2:"red"};return this.todata(2).forEach((i,o)=>{i.forEach((n,a)=>{let r=n.toString();if(r==="0"||r==="1"||r==="2"){let l=s[r];l!=null&&(e.fillStyle=l,e.fillRect(a,o,1,1))}})}),this}},Lt=p=>A(void 0,void 0,void 0,function*(){return yield new ut().load_filelines(p)});var Jt={VCR_OSD_MONO:{16:{file:"VCR_OSD_MONO_16.bdf",yOffset:0},24:{file:"VCR_OSD_MONO_24.bdf",yOffset:0},32:{file:"VCR_OSD_MONO_32.bdf",yOffset:2}},CUSONG:{16:{file:"CUSONG_16.bdf",yOffset:-1},24:{file:"CUSONG_24.bdf",yOffset:0},32:{file:"CUSONG_32.bdf",yOffset:0}}},H=new Map,tt=new Map;function Kt(p){return window.location.pathname.includes("preview.html")||window.location.port==="8080"||window.location.hostname.includes("github.io")?`./fonts/${p}`:`/hacsfiles/ipixel_color/fonts/${p}`}function et(p){return p<=18?16:p<=28?24:32}async function F(p,e=16){let t=`${p}_${e}`;if(H.has(t))return H.get(t);if(tt.has(t))return tt.get(t);let s=Jt[p];if(!s||!s[e])return console.warn(`iPIXEL BDF: No config for font ${p} at height ${e}`),null;let i=s[e],o=(async()=>{try{let n=Kt(i.file);console.log(`iPIXEL BDF: Loading ${n}...`);let r={font:await Lt(Tt(n)),config:i};return H.set(t,r),console.log(`iPIXEL BDF: Font ${p} (${e}px) loaded successfully`),r}catch(n){return console.warn(`iPIXEL BDF: Failed to load font ${p} (${e}px):`,n),tt.delete(t),null}})();return tt.set(t,o),o}function $t(p,e=16){let t=`${p}_${e}`;return H.has(t)}function Pt(p,e,t,s="#ff6600",i="#111",o="VCR_OSD_MONO"){let n=et(t),a=`${o}_${n}`,r=H.get(a);if(!r)return F(o,n),null;let{font:l,config:c}=r,d=new Array(e*t).fill(i);if(!p||p.trim()==="")return d;try{let h=l.draw(p,{direction:"lrtb",mode:1}),f=h.bindata,u=h.width(),g=h.height(),b=Math.floor((e-u)/2),x=Math.floor((t-g)/2)+(c.yOffset||0);for(let _=0;_<g;_++){let m=f[_]||"";for(let v=0;v<m.length;v++){let y=b+v,S=x+_;if(y>=0&&y<e&&S>=0&&S<t){let E=S*e+y;d[E]=m[v]==="1"?s:i}}}}catch(h){return console.warn("iPIXEL BDF: Error rendering text:",h),null}return d}function Ft(p,e,t,s="#ff6600",i="#111",o="VCR_OSD_MONO"){let n=et(t),a=`${o}_${n}`,r=H.get(a);if(!r)return F(o,n),null;let{font:l,config:c}=r;if(!p||p.trim()===""){let d=e*3;return{pixels:new Array(d*t).fill(i),width:d}}try{let d=l.draw(p,{direction:"lrtb",mode:1}),h=d.bindata,f=d.width(),u=d.height(),g=e+f+e,b=new Array(g*t).fill(i),x=e,_=Math.floor((t-u)/2)+(c.yOffset||0);for(let m=0;m<u;m++){let v=h[m]||"";for(let y=0;y<v.length;y++){let S=x+y,E=_+m;if(S>=0&&S<g&&E>=0&&E<t){let I=E*g+S;b[I]=v[y]==="1"?s:i}}}return{pixels:b,width:g}}catch(d){return console.warn("iPIXEL BDF: Error rendering scroll text:",d),null}}var it=class{constructor(e){this.renderer=e}init(e,t){let{width:s,height:i}=this.renderer;switch(e){case"scroll_ltr":case"scroll_rtl":t.offset=0;break;case"blink":t.visible=!0;break;case"snow":case"breeze":t.phases=[];for(let o=0;o<s*i;o++)t.phases[o]=Math.random()*Math.PI*2;break;case"laser":t.position=0;break;case"fade":t.opacity=0,t.direction=1;break;case"typewriter":t.charIndex=0,t.cursorVisible=!0;break;case"bounce":t.offset=0,t.direction=1;break;case"sparkle":t.sparkles=[];for(let o=0;o<Math.floor(s*i*.1);o++)t.sparkles.push({x:Math.floor(Math.random()*s),y:Math.floor(Math.random()*i),brightness:Math.random(),speed:.05+Math.random()*.1});break}}step(e,t){let{width:s,extendedWidth:i}=this.renderer;switch(e){case"scroll_ltr":t.offset-=1,t.offset<=-(i||s)&&(t.offset=s);break;case"scroll_rtl":t.offset+=1,t.offset>=(i||s)&&(t.offset=-s);break;case"blink":t.visible=!t.visible;break;case"laser":t.position=(t.position+1)%s;break;case"fade":t.opacity+=t.direction*.05,t.opacity>=1?(t.opacity=1,t.direction=-1):t.opacity<=0&&(t.opacity=0,t.direction=1);break;case"typewriter":t.tick%3===0&&t.charIndex++,t.cursorVisible=t.tick%10<5;break;case"bounce":t.offset+=t.direction;let o=Math.max(0,(i||s)-s);t.offset>=o?(t.offset=o,t.direction=-1):t.offset<=0&&(t.offset=0,t.direction=1);break;case"sparkle":for(let n of t.sparkles)n.brightness+=n.speed,n.brightness>1&&(n.brightness=0,n.x=Math.floor(Math.random()*s),n.y=Math.floor(Math.random()*this.renderer.height));break}}render(e,t,s,i,o){let{width:n,height:a}=this.renderer,r=i||s||[],l=s||[],c=o||n;for(let d=0;d<a;d++)for(let h=0;h<n;h++){let f,u=h;if(e==="scroll_ltr"||e==="scroll_rtl"||e==="bounce"){for(u=h-(t.offset||0);u<0;)u+=c;for(;u>=c;)u-=c;f=r[d*c+u]||"#111"}else if(e==="typewriter"){let v=(t.charIndex||0)*6;h<v?f=l[d*n+h]||"#111":h===v&&t.cursorVisible?f="#ffffff":f="#111"}else f=l[d*n+h]||"#111";let[g,b,x]=this._hexToRgb(f);if(g>20||b>20||x>20)switch(e){case"blink":t.visible||(g=b=x=17);break;case"snow":{let m=t.phases?.[d*n+h]||0,v=t.tick||0,y=.3+.7*Math.abs(Math.sin(m+v*.3));g*=y,b*=y,x*=y;break}case"breeze":{let m=t.phases?.[d*n+h]||0,v=t.tick||0,y=.4+.6*Math.abs(Math.sin(m+v*.15+h*.2));g*=y,b*=y,x*=y;break}case"laser":{let m=t.position||0,y=Math.abs(h-m)<3?1:.3;g*=y,b*=y,x*=y;break}case"fade":{let m=t.opacity||1;g*=m,b*=m,x*=m;break}}if(e==="sparkle"&&t.sparkles){for(let m of t.sparkles)if(m.x===h&&m.y===d){let v=Math.sin(m.brightness*Math.PI);g=Math.min(255,g+v*200),b=Math.min(255,b+v*200),x=Math.min(255,x+v*200)}}this.renderer.setPixel(h,d,[g,b,x])}}_hexToRgb(e){if(!e||e==="#111"||e==="#000")return[17,17,17];if(e==="#050505")return[5,5,5];let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:[17,17,17]}};function Bt(p,e,t){let s,i,o,n=Math.floor(p*6),a=p*6-n,r=t*(1-e),l=t*(1-a*e),c=t*(1-(1-a)*e);switch(n%6){case 0:s=t,i=c,o=r;break;case 1:s=l,i=t,o=r;break;case 2:s=r,i=t,o=c;break;case 3:s=r,i=l,o=t;break;case 4:s=c,i=r,o=t;break;case 5:s=t,i=r,o=l;break}return[s*255,i*255,o*255]}var st=class{constructor(e){this.renderer=e}init(e,t){let{width:s,height:i}=this.renderer;switch(e){case"rainbow":t.position=0;break;case"matrix":let o=[[0,255,0],[0,255,255],[255,0,255]];t.colorMode=o[Math.floor(Math.random()*o.length)],t.buffer=[];for(let a=0;a<i;a++)t.buffer.push(Array(s).fill(null).map(()=>[0,0,0]));break;case"plasma":t.time=0;break;case"gradient":t.time=0;break;case"fire":t.heat=[];for(let a=0;a<s*i;a++)t.heat[a]=0;t.palette=this._createFirePalette();break;case"water":t.current=[],t.previous=[];for(let a=0;a<s*i;a++)t.current[a]=0,t.previous[a]=0;t.damping=.95;break;case"stars":t.stars=[];let n=Math.floor(s*i*.15);for(let a=0;a<n;a++)t.stars.push({x:Math.floor(Math.random()*s),y:Math.floor(Math.random()*i),brightness:Math.random(),speed:.02+Math.random()*.05,phase:Math.random()*Math.PI*2});break;case"confetti":t.particles=[];for(let a=0;a<20;a++)t.particles.push(this._createConfettiParticle(s,i,!0));break;case"plasma_wave":t.time=0;break;case"radial_pulse":t.time=0;break;case"hypnotic":t.time=0;break;case"lava":t.time=0,t.noise=[];for(let a=0;a<s*i;a++)t.noise[a]=Math.random()*Math.PI*2;break;case"aurora":t.time=0;break}}step(e,t){let{width:s,height:i}=this.renderer;switch(e){case"rainbow":t.position=(t.position+.01)%1;break;case"matrix":this._stepMatrix(t,s,i);break;case"plasma":case"gradient":t.time=(t.time||0)+.05;break;case"fire":this._stepFire(t,s,i);break;case"water":this._stepWater(t,s,i);break;case"stars":for(let o of t.stars)o.phase+=o.speed;break;case"confetti":for(let o=0;o<t.particles.length;o++){let n=t.particles[o];n.y+=n.speed,n.x+=n.drift,n.rotation+=n.rotationSpeed,n.y>i&&(t.particles[o]=this._createConfettiParticle(s,i,!1))}break;case"plasma_wave":case"radial_pulse":case"hypnotic":case"lava":case"aurora":t.time=(t.time||0)+.03;break}}render(e,t){switch(e){case"rainbow":this._renderRainbow(t);break;case"matrix":this._renderMatrix(t);break;case"plasma":this._renderPlasma(t);break;case"gradient":this._renderGradient(t);break;case"fire":this._renderFire(t);break;case"water":this._renderWater(t);break;case"stars":this._renderStars(t);break;case"confetti":this._renderConfetti(t);break;case"plasma_wave":this._renderPlasmaWave(t);break;case"radial_pulse":this._renderRadialPulse(t);break;case"hypnotic":this._renderHypnotic(t);break;case"lava":this._renderLava(t);break;case"aurora":this._renderAurora(t);break}}_renderRainbow(e){let{width:t,height:s}=this.renderer,i=e.position||0;for(let o=0;o<t;o++){let n=(i+o/t)%1,[a,r,l]=Bt(n,1,.6);for(let c=0;c<s;c++)this.renderer.setPixel(o,c,[a,r,l])}}_stepMatrix(e,t,s){let i=e.buffer,o=e.colorMode,n=.15;i.pop();let a=i[0].map(([r,l,c])=>[r*(1-n),l*(1-n),c*(1-n)]);i.unshift(JSON.parse(JSON.stringify(a)));for(let r=0;r<t;r++)Math.random()<.08&&(i[0][r]=[Math.floor(Math.random()*o[0]),Math.floor(Math.random()*o[1]),Math.floor(Math.random()*o[2])])}_renderMatrix(e){let{width:t,height:s}=this.renderer,i=e.buffer;if(i)for(let o=0;o<s;o++)for(let n=0;n<t;n++){let[a,r,l]=i[o]?.[n]||[0,0,0];this.renderer.setPixel(n,o,[a,r,l])}}_renderPlasma(e){let{width:t,height:s}=this.renderer,i=e.time||0,o=t/2,n=s/2;for(let a=0;a<t;a++)for(let r=0;r<s;r++){let l=a-o,c=r-n,d=Math.sqrt(l*l+c*c),h=Math.sin(a/8+i),f=Math.sin(r/6+i*.8),u=Math.sin(d/6-i*1.2),g=Math.sin((a+r)/10+i*.5),b=(h+f+u+g+4)/8,x=Math.sin(b*Math.PI*2)*.5+.5,_=Math.sin(b*Math.PI*2+2)*.5+.5,m=Math.sin(b*Math.PI*2+4)*.5+.5;this.renderer.setPixel(a,r,[x*255,_*255,m*255])}}_renderGradient(e){let{width:t,height:s}=this.renderer,o=(e.time||0)*10;for(let n=0;n<t;n++)for(let a=0;a<s;a++){let r=(Math.sin((n+o)*.05)*.5+.5)*255,l=(Math.cos((a+o)*.05)*.5+.5)*255,c=(Math.sin((n+a+o)*.03)*.5+.5)*255;this.renderer.setPixel(n,a,[r,l,c])}}_createFirePalette(){let e=[];for(let t=0;t<256;t++){let s,i,o;t<64?(s=t*4,i=0,o=0):t<128?(s=255,i=(t-64)*4,o=0):t<192?(s=255,i=255,o=(t-128)*4):(s=255,i=255,o=255),e.push([s,i,o])}return e}_stepFire(e,t,s){let i=e.heat;for(let o=0;o<t*s;o++)i[o]=Math.max(0,i[o]-Math.random()*10);for(let o=0;o<s-1;o++)for(let n=0;n<t;n++){let a=o*t+n,r=(o+1)*t+n,l=o*t+Math.max(0,n-1),c=o*t+Math.min(t-1,n+1);i[a]=(i[r]+i[l]+i[c])/3.05}for(let o=0;o<t;o++)Math.random()<.6&&(i[(s-1)*t+o]=180+Math.random()*75)}_renderFire(e){let{width:t,height:s}=this.renderer,i=e.heat,o=e.palette;for(let n=0;n<s;n++)for(let a=0;a<t;a++){let r=n*t+a,l=Math.floor(Math.min(255,i[r])),[c,d,h]=o[l];this.renderer.setPixel(a,n,[c,d,h])}}_stepWater(e,t,s){let{current:i,previous:o,damping:n}=e,a=[...o];for(let r=0;r<i.length;r++)o[r]=i[r];for(let r=1;r<s-1;r++)for(let l=1;l<t-1;l++){let c=r*t+l;i[c]=(a[(r-1)*t+l]+a[(r+1)*t+l]+a[r*t+(l-1)]+a[r*t+(l+1)])/2-i[c],i[c]*=n}if(Math.random()<.1){let r=Math.floor(Math.random()*(t-2))+1,l=Math.floor(Math.random()*(s-2))+1;i[l*t+r]=255}}_renderWater(e){let{width:t,height:s}=this.renderer,i=e.current;for(let o=0;o<s;o++)for(let n=0;n<t;n++){let a=o*t+n,r=Math.abs(i[a]),l=Math.min(255,r*2),c=l>200?l:0,d=l>150?l*.8:l*.3,h=Math.min(255,50+l);this.renderer.setPixel(n,o,[c,d,h])}}_renderStars(e){let{width:t,height:s}=this.renderer;for(let i=0;i<s;i++)for(let o=0;o<t;o++)this.renderer.setPixel(o,i,[5,5,15]);for(let i of e.stars){let o=(Math.sin(i.phase)*.5+.5)*255,n=Math.floor(i.x),a=Math.floor(i.y);n>=0&&n<t&&a>=0&&a<s&&this.renderer.setPixel(n,a,[o,o,o*.9])}}_createConfettiParticle(e,t,s){let i=[[255,0,0],[0,255,0],[0,0,255],[255,255,0],[255,0,255],[0,255,255],[255,128,0],[255,192,203]];return{x:Math.random()*e,y:s?Math.random()*t:-2,speed:.2+Math.random()*.3,drift:(Math.random()-.5)*.3,color:i[Math.floor(Math.random()*i.length)],size:1+Math.random(),rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*.2}}_renderConfetti(e){let{width:t,height:s}=this.renderer;for(let i=0;i<s;i++)for(let o=0;o<t;o++)this.renderer.setPixel(o,i,[10,10,10]);for(let i of e.particles){let o=Math.floor(i.x),n=Math.floor(i.y);if(o>=0&&o<t&&n>=0&&n<s){this.renderer.setPixel(o,n,i.color);let a=Math.abs(Math.sin(i.rotation))*.5+.5,[r,l,c]=i.color;this.renderer.setPixel(o,n,[r*a,l*a,c*a])}}}_renderPlasmaWave(e){let{width:t,height:s}=this.renderer,i=e.time||0;for(let o=0;o<t;o++)for(let n=0;n<s;n++){let a=o/t,r=n/s,l=Math.sin(a*10+i)+Math.sin(r*10+i)+Math.sin((a+r)*10+i)+Math.sin(Math.sqrt((a-.5)**2+(r-.5)**2)*20-i*2),c=Math.sin(l*Math.PI)*.5+.5,d=Math.sin(l*Math.PI+2.094)*.5+.5,h=Math.sin(l*Math.PI+4.188)*.5+.5;this.renderer.setPixel(o,n,[c*255,d*255,h*255])}}_renderRadialPulse(e){let{width:t,height:s}=this.renderer,i=e.time||0,o=t/2,n=s/2;for(let a=0;a<t;a++)for(let r=0;r<s;r++){let l=a-o,c=r-n,d=Math.sqrt(l*l+c*c),h=Math.sin(d*.8-i*3)*.5+.5,f=Math.sin(i*2)*.3+.7,u=(d/20+i*.5)%1,[g,b,x]=Bt(u,.8,h*f);this.renderer.setPixel(a,r,[g,b,x])}}_renderHypnotic(e){let{width:t,height:s}=this.renderer,i=e.time||0,o=t/2,n=s/2;for(let a=0;a<t;a++)for(let r=0;r<s;r++){let l=a-o,c=r-n,d=Math.sqrt(l*l+c*c),h=Math.atan2(c,l),u=Math.sin(h*4+d*.5-i*2)*.5+.5,g=u*(Math.sin(i)*.5+.5),b=u*(Math.sin(i+2.094)*.5+.5),x=u*(Math.sin(i+4.188)*.5+.5);this.renderer.setPixel(a,r,[g*255,b*255,x*255])}}_renderLava(e){let{width:t,height:s}=this.renderer,i=e.time||0;for(let o=0;o<t;o++)for(let n=0;n<s;n++){let a=o/t,r=n/s,l=Math.sin(a*8+i*.7)*Math.cos(r*6+i*.5),c=Math.sin(a*12-i*.3)*Math.sin(r*10+i*.8),d=Math.cos((a+r)*5+i),h=(l+c+d+3)/6,f,u,g;h<.3?(f=h*3*100,u=0,g=0):h<.6?(f=100+(h-.3)*3*155,u=(h-.3)*3*100,g=0):(f=255,u=100+(h-.6)*2.5*155,g=(h-.6)*2.5*100),this.renderer.setPixel(o,n,[f,u,g])}}_renderAurora(e){let{width:t,height:s}=this.renderer,i=e.time||0;for(let o=0;o<t;o++)for(let n=0;n<s;n++){let a=o/t,r=n/s,l=Math.sin(a*6+i)*.3,c=Math.sin(a*4-i*.7)*.2,d=Math.sin(a*8+i*1.3)*.15,h=.5+l+c+d,f=Math.abs(r-h),u=Math.max(0,1-f*4),g=Math.pow(u,1.5),b=Math.sin(a*3+i*.5),x=g*(.2+b*.3)*255,_=g*(.8+Math.sin(i+a)*.2)*255,m=g*(.6+b*.4)*255,v=Math.sin(o*127.1+n*311.7)*.5+.5,y=Math.sin(i*3+o+n)*.5+.5,S=x,E=_,I=m;if(v>.98&&u<.3){let C=y*180;S=Math.max(x,C),E=Math.max(_,C),I=Math.max(m,C*.9)}this.renderer.setPixel(o,n,[S,E,I])}}};function Ot(p,e,t){let s,i,o,n=Math.floor(p*6),a=p*6-n,r=t*(1-e),l=t*(1-a*e),c=t*(1-(1-a)*e);switch(n%6){case 0:s=t,i=c,o=r;break;case 1:s=l,i=t,o=r;break;case 2:s=r,i=t,o=c;break;case 3:s=r,i=l,o=t;break;case 4:s=c,i=r,o=t;break;case 5:s=t,i=r,o=l;break}return[s*255,i*255,o*255]}var ot=class{constructor(e){this.renderer=e}init(e,t){switch(e){case"color_cycle":t.hue=0;break;case"rainbow_text":t.offset=0;break;case"neon":t.glowIntensity=0,t.direction=1,t.baseColor=t.fgColor||"#ff00ff";break}}step(e,t){switch(e){case"color_cycle":t.hue=(t.hue+.01)%1;break;case"rainbow_text":t.offset=(t.offset+.02)%1;break;case"neon":t.glowIntensity+=t.direction*.05,t.glowIntensity>=1?(t.glowIntensity=1,t.direction=-1):t.glowIntensity<=.3&&(t.glowIntensity=.3,t.direction=1);break}}render(e,t,s){let{width:i,height:o}=this.renderer,n=s||[];for(let a=0;a<o;a++)for(let r=0;r<i;r++){let l=n[a*i+r]||"#111",[c,d,h]=this._hexToRgb(l);if(c>20||d>20||h>20)switch(e){case"color_cycle":{let[u,g,b]=Ot(t.hue,1,.8),x=(c+d+h)/(3*255);c=u*x,d=g*x,h=b*x;break}case"rainbow_text":{let u=(t.offset+r/i)%1,[g,b,x]=Ot(u,1,.8),_=(c+d+h)/(3*255);c=g*_,d=b*_,h=x*_;break}case"neon":{let u=this._hexToRgb(t.baseColor||"#ff00ff"),g=t.glowIntensity||.5;if(c=u[0]*g,d=u[1]*g,h=u[2]*g,g>.8){let b=(g-.8)*5;c=c+(255-c)*b*.3,d=d+(255-d)*b*.3,h=h+(255-h)*b*.3}break}}this.renderer.setPixel(r,a,[c,d,h])}}_hexToRgb(e){if(!e||e==="#111"||e==="#000")return[17,17,17];if(e==="#050505")return[5,5,5];let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:[17,17,17]}};var w={TEXT:"text",AMBIENT:"ambient",COLOR:"color"},k={fixed:{category:w.TEXT,name:"Fixed",description:"Static display"},scroll_ltr:{category:w.TEXT,name:"Scroll Left",description:"Text scrolls left to right"},scroll_rtl:{category:w.TEXT,name:"Scroll Right",description:"Text scrolls right to left"},blink:{category:w.TEXT,name:"Blink",description:"Text blinks on/off"},breeze:{category:w.TEXT,name:"Breeze",description:"Gentle wave brightness"},snow:{category:w.TEXT,name:"Snow",description:"Sparkle effect"},laser:{category:w.TEXT,name:"Laser",description:"Scanning beam"},fade:{category:w.TEXT,name:"Fade",description:"Fade in/out"},typewriter:{category:w.TEXT,name:"Typewriter",description:"Characters appear one by one"},bounce:{category:w.TEXT,name:"Bounce",description:"Text bounces back and forth"},sparkle:{category:w.TEXT,name:"Sparkle",description:"Random sparkle overlay"},rainbow:{category:w.AMBIENT,name:"Rainbow",description:"HSV rainbow gradient"},matrix:{category:w.AMBIENT,name:"Matrix",description:"Digital rain effect"},plasma:{category:w.AMBIENT,name:"Plasma",description:"Classic plasma waves"},gradient:{category:w.AMBIENT,name:"Gradient",description:"Moving color gradients"},fire:{category:w.AMBIENT,name:"Fire",description:"Fire/flame simulation"},water:{category:w.AMBIENT,name:"Water",description:"Ripple/wave effect"},stars:{category:w.AMBIENT,name:"Stars",description:"Twinkling starfield"},confetti:{category:w.AMBIENT,name:"Confetti",description:"Falling colored particles"},plasma_wave:{category:w.AMBIENT,name:"Plasma Wave",description:"Multi-frequency sine waves"},radial_pulse:{category:w.AMBIENT,name:"Radial Pulse",description:"Expanding ring patterns"},hypnotic:{category:w.AMBIENT,name:"Hypnotic",description:"Spiral pattern"},lava:{category:w.AMBIENT,name:"Lava",description:"Flowing lava/magma"},aurora:{category:w.AMBIENT,name:"Aurora",description:"Northern lights"},color_cycle:{category:w.COLOR,name:"Color Cycle",description:"Cycle through colors"},rainbow_text:{category:w.COLOR,name:"Rainbow Text",description:"Rainbow gradient on text"},neon:{category:w.COLOR,name:"Neon",description:"Pulsing neon glow"}},z=class{constructor(e){this.renderer=e,this.textEffects=new it(e),this.ambientEffects=new st(e),this.colorEffects=new ot(e),this.currentEffect="fixed",this.effectState={}}getEffectInfo(e){return k[e]||k.fixed}getEffectsByCategory(e){return Object.entries(k).filter(([t,s])=>s.category===e).map(([t,s])=>({name:t,...s}))}initEffect(e,t={}){let s=this.getEffectInfo(e);switch(this.currentEffect=e,this.effectState={tick:0,...t},s.category){case w.TEXT:this.textEffects.init(e,this.effectState);break;case w.AMBIENT:this.ambientEffects.init(e,this.effectState);break;case w.COLOR:this.colorEffects.init(e,this.effectState);break}return this.effectState}step(){let e=this.getEffectInfo(this.currentEffect);switch(this.effectState.tick=(this.effectState.tick||0)+1,e.category){case w.TEXT:this.textEffects.step(this.currentEffect,this.effectState);break;case w.AMBIENT:this.ambientEffects.step(this.currentEffect,this.effectState);break;case w.COLOR:this.colorEffects.step(this.currentEffect,this.effectState);break}}render(e,t,s){switch(this.getEffectInfo(this.currentEffect).category){case w.AMBIENT:this.ambientEffects.render(this.currentEffect,this.effectState);break;case w.TEXT:this.textEffects.render(this.currentEffect,this.effectState,e,t,s);break;case w.COLOR:this.colorEffects.render(this.currentEffect,this.effectState,e);break}}isAmbient(e){return this.getEffectInfo(e).category===w.AMBIENT}needsAnimation(e){return e!=="fixed"}},ye=Object.entries(k).filter(([p,e])=>e.category===w.TEXT).map(([p])=>p),we=Object.entries(k).filter(([p,e])=>e.category===w.AMBIENT).map(([p])=>p),Ee=Object.entries(k).filter(([p,e])=>e.category===w.COLOR).map(([p])=>p),Se=Object.keys(k);var N=class{constructor(e,t={}){this.container=e,this.width=t.width||64,this.height=t.height||16,this.pixelGap=t.pixelGap||.15,this.glowEnabled=t.glow!==!1,this.scale=t.scale||8,this.buffer=[],this._initBuffer(),this._colorPixels=[],this._extendedColorPixels=[],this.extendedWidth=this.width,this.effect="fixed",this.speed=50,this.animationId=null,this.lastFrameTime=0,this._isRunning=!1,this._canvas=null,this._ctx=null,this._imageData=null,this._glowCanvas=null,this._glowCtx=null,this._wrapper=null,this._canvasCreated=!1,this._pixelTemplate=null,this.effectManager=new z(this)}_initBuffer(){this.buffer=[];for(let e=0;e<this.width*this.height;e++)this.buffer.push([0,0,0])}_createCanvas(){let e=this.width*this.scale,t=this.height*this.scale;this._wrapper=document.createElement("div"),this._wrapper.style.cssText=`
      position: relative;
      width: 100%;
      aspect-ratio: ${this.width} / ${this.height};
      background: #0a0a0a;
      border-radius: 4px;
      overflow: hidden;
    `,this.glowEnabled&&(this._glowCanvas=document.createElement("canvas"),this._glowCanvas.width=e,this._glowCanvas.height=t,this._glowCanvas.style.cssText=`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        filter: blur(${this.scale*.6}px);
        opacity: 0.5;
      `,this._glowCtx=this._glowCanvas.getContext("2d",{alpha:!1}),this._wrapper.appendChild(this._glowCanvas)),this._canvas=document.createElement("canvas"),this._canvas.width=e,this._canvas.height=t,this._canvas.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    `,this._ctx=this._canvas.getContext("2d",{alpha:!1}),this._wrapper.appendChild(this._canvas),this._imageData=this._ctx.createImageData(e,t),this._createPixelTemplate(),this._fillBackground(),this.container&&this.container.isConnected!==!1&&(this.container.innerHTML="",this.container.appendChild(this._wrapper)),this._canvasCreated=!0}_createPixelTemplate(){let e=this.scale,t=Math.max(1,Math.floor(e*this.pixelGap)),s=e-t,i=Math.max(1,Math.floor(e*.15));this._pixelTemplate=[];for(let o=0;o<e;o++)for(let n=0;n<e;n++){let a=!1;if(n<s&&o<s)if(n<i&&o<i){let r=i-n,l=i-o;a=r*r+l*l<=i*i}else if(n>=s-i&&o<i){let r=n-(s-i-1),l=i-o;a=r*r+l*l<=i*i}else if(n<i&&o>=s-i){let r=i-n,l=o-(s-i-1);a=r*r+l*l<=i*i}else if(n>=s-i&&o>=s-i){let r=n-(s-i-1),l=o-(s-i-1);a=r*r+l*l<=i*i}else a=!0;this._pixelTemplate.push(a)}}_fillBackground(){let e=this._imageData.data,t=10,s=10,i=10;for(let o=0;o<e.length;o+=4)e[o]=t,e[o+1]=s,e[o+2]=i,e[o+3]=255}_ensureCanvasInContainer(){return this.container?this._wrapper&&this._wrapper.parentNode===this.container?!0:this._wrapper&&this.container.isConnected!==!1?(this.container.innerHTML="",this.container.appendChild(this._wrapper),!0):!1:!1}setPixel(e,t,s){if(e>=0&&e<this.width&&t>=0&&t<this.height){let i=t*this.width+e;i<this.buffer.length&&(this.buffer[i]=s)}}clear(){for(let e=0;e<this.buffer.length;e++)this.buffer[e]=[0,0,0]}flush(){this._canvasCreated?this._ensureCanvasInContainer()||this._createCanvas():this._createCanvas();let e=this._imageData.data,t=this.scale,s=this.width*t,i=this._pixelTemplate,o=10,n=10,a=10;for(let r=0;r<this.height;r++)for(let l=0;l<this.width;l++){let c=r*this.width+l,d=this.buffer[c];if(!d||!Array.isArray(d))continue;let h=Math.round(d[0]),f=Math.round(d[1]),u=Math.round(d[2]),g=l*t,b=r*t;for(let x=0;x<t;x++)for(let _=0;_<t;_++){let m=x*t+_,v=((b+x)*s+(g+_))*4;i[m]?(e[v]=h,e[v+1]=f,e[v+2]=u,e[v+3]=255):(e[v]=o,e[v+1]=n,e[v+2]=a,e[v+3]=255)}}this._ctx.putImageData(this._imageData,0,0),this.glowEnabled&&this._glowCtx&&this._glowCtx.drawImage(this._canvas,0,0)}setData(e,t=null,s=null){this._colorPixels=e||[],t?(this._extendedColorPixels=t,this.extendedWidth=s||this.width):(this._extendedColorPixels=e||[],this.extendedWidth=this.width)}setEffect(e,t=50){let s=this._isRunning;this.effect!==e&&(this.effect=e,this.effectManager.initEffect(e,{speed:t})),this.speed=t,s&&e!=="fixed"&&this.start()}start(){this._isRunning||(this._isRunning=!0,this.lastFrameTime=performance.now(),this._animate())}stop(){this._isRunning=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}get isRunning(){return this._isRunning}_animate(){if(!this._isRunning)return;let e=performance.now(),t=500-(this.speed-1)*4.7;e-this.lastFrameTime>=t&&(this.lastFrameTime=e,this.effectManager.step()),this._renderFrame(),this.animationId=requestAnimationFrame(()=>this._animate())}_renderFrame(){this.effectManager.render(this._colorPixels,this._extendedColorPixels,this.extendedWidth),this.flush()}renderStatic(){this._canvasCreated||this._createCanvas(),this._renderFrame()}setDimensions(e,t){(e!==this.width||t!==this.height)&&(this.width=e,this.height=t,this.extendedWidth=e,this._initBuffer(),this._canvasCreated=!1,this.effectManager=new z(this),this.effect!=="fixed"&&this.effectManager.initEffect(this.effect,{speed:this.speed}))}setContainer(e){e!==this.container&&(this.container=e,this._wrapper&&e&&(e.innerHTML="",e.appendChild(this._wrapper)))}destroy(){this.stop(),this._canvas=null,this._ctx=null,this._imageData=null,this._glowCanvas=null,this._glowCtx=null,this._wrapper=null,this._canvasCreated=!1,this._pixelTemplate=null}};var At="iPIXEL_DisplayState",Zt={text:"",mode:"text",effect:"fixed",speed:50,fgColor:"#ff6600",bgColor:"#000000",font:"VCR_OSD_MONO",lastUpdate:0};function Qt(){try{let p=localStorage.getItem(At);if(p)return JSON.parse(p)}catch(p){console.warn("iPIXEL: Could not load saved state",p)}return{...Zt}}function te(p){try{localStorage.setItem(At,JSON.stringify(p))}catch(e){console.warn("iPIXEL: Could not save state",e)}}window.iPIXELDisplayState||(window.iPIXELDisplayState=Qt());function nt(){return window.iPIXELDisplayState}function R(p){return window.iPIXELDisplayState={...window.iPIXELDisplayState,...p,lastUpdate:Date.now()},te(window.iPIXELDisplayState),window.dispatchEvent(new CustomEvent("ipixel-display-update",{detail:window.iPIXELDisplayState})),window.iPIXELDisplayState}var rt=new Map,at=class extends ${constructor(){super(),this._renderer=null,this._displayContainer=null,this._lastState=null,this._cachedResolution=null,this._rendererId=null,this._handleDisplayUpdate=e=>{this._updateDisplay(e.detail)},window.addEventListener("ipixel-display-update",this._handleDisplayUpdate)}connectedCallback(){this._rendererId||(this._rendererId=`renderer_${Date.now()}_${Math.random().toString(36).substr(2,9)}`),rt.has(this._rendererId)&&(this._renderer=rt.get(this._rendererId)),F("VCR_OSD_MONO",16).then(()=>{this._lastState&&this._updateDisplay(this._lastState)}),F("VCR_OSD_MONO",24),F("VCR_OSD_MONO",32),F("CUSONG",16),F("CUSONG",24),F("CUSONG",32),W("VCR_OSD_MONO"),W("CUSONG")}disconnectedCallback(){window.removeEventListener("ipixel-display-update",this._handleDisplayUpdate),this._renderer&&this._rendererId&&(this._renderer.stop(),rt.set(this._rendererId,this._renderer))}_getResolutionCached(){let[e,t]=this.getResolution();if(e>0&&t>0&&e!==64){this._cachedResolution=[e,t];try{localStorage.setItem("iPIXEL_Resolution",JSON.stringify([e,t]))}catch{}}if(this._cachedResolution)return this._cachedResolution;try{let s=localStorage.getItem("iPIXEL_Resolution");if(s){let i=JSON.parse(s);if(Array.isArray(i)&&i.length===2)return this._cachedResolution=i,i}}catch{}return this._config?.width&&this._config?.height?[this._config.width,this._config.height]:[e||64,t||16]}_updateDisplay(e){if(!this._displayContainer)return;let[t,s]=this._getResolutionCached(),i=this.isOn();if(this._renderer?(this._renderer.setContainer(this._displayContainer),(this._renderer.width!==t||this._renderer.height!==s)&&this._renderer.setDimensions(t,s)):(this._renderer=new N(this._displayContainer,{width:t,height:s}),this._rendererId&&rt.set(this._rendererId,this._renderer)),!i){this._renderer.setData([]),this._renderer.setEffect("fixed",50),this._renderer.stop(),this._renderer.renderStatic();return}let o=e?.text||"",n=e?.effect||"fixed",a=e?.speed||50,r=e?.fgColor||"#ff6600",l=e?.bgColor||"#111",c=e?.mode||"text",d=e?.font||"VCR_OSD_MONO";this._lastState=e;let h=o,f=r;if(c==="clock"?(h=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!1}),f="#00ff88"):c==="gif"?(h="GIF",f="#ff44ff"):c==="rhythm"&&(h="***",f="#44aaff"),k[n]?.category==="ambient")this._renderer.setData([],[],t);else{let b=et(s),x=d!=="LEGACY"&&$t(d,b),_=d!=="LEGACY"&&Z(d),m=(E,I,C,T,L)=>{if(x){let M=Pt(E,I,C,T,L,d);if(M)return M}if(_){let M=kt(E,I,C,T,L,d);if(M)return M}return wt(E,I,C,T,L)},v=(E,I,C,T,L)=>{if(x){let M=Ft(E,I,C,T,L,d);if(M)return M}if(_){let M=Rt(E,I,C,T,L,d);if(M)return M}return Et(E,I,C,T,L)},y=_?h.length*10:h.length*6;if((n==="scroll_ltr"||n==="scroll_rtl"||n==="bounce")&&y>t){let E=v(h,t,s,f,l),I=m(h,t,s,f,l);this._renderer.setData(I,E.pixels,E.width)}else{let E=m(h,t,s,f,l);this._renderer.setData(E)}}this._renderer.setEffect(n,a),n==="fixed"?(this._renderer.stop(),this._renderer.renderStatic()):this._renderer.start()}render(){if(!this._hass)return;let[e,t]=this._getResolutionCached(),s=this.isOn(),i=this._config.name||this.getEntity()?.attributes?.friendly_name||"iPIXEL Display",o=nt(),a=this.getEntity()?.state||"",l=this.getRelatedEntity("select","_mode")?.state||o.mode||"text",c=o.text||a,d=o.effect||"fixed",h=o.speed||50,f=o.fgColor||"#ff6600",u=o.bgColor||"#111",g=o.font||"VCR_OSD_MONO",x=k[d]?.category==="ambient",_=Object.entries(k).filter(([y,S])=>S.category==="text").map(([y,S])=>`<option value="${y}">${S.name}</option>`).join(""),m=Object.entries(k).filter(([y,S])=>S.category==="ambient").map(([y,S])=>`<option value="${y}">${S.name}</option>`).join(""),v=Object.entries(k).filter(([y,S])=>S.category==="color").map(([y,S])=>`<option value="${y}">${S.name}</option>`).join("");this.shadowRoot.innerHTML=`
      <style>${P}
        .display-container { background: #000; border-radius: 8px; padding: 8px; border: 2px solid #222; }
        .display-screen {
          background: #000;
          border-radius: 4px;
          overflow: hidden;
          min-height: 60px;
        }
        .display-footer { display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.75em; opacity: 0.6; }
        .mode-badge { background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px; text-transform: capitalize; }
        .effect-badge { background: rgba(100,149,237,0.2); padding: 2px 6px; border-radius: 3px; margin-left: 4px; }
      </style>
      <ha-card>
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">
              <span class="status-dot ${s?"":"off"}"></span>
              ${i}
            </div>
            <button class="icon-btn ${s?"active":""}" id="power-btn">
              <svg viewBox="0 0 24 24"><path d="M13,3H11V13H13V3M17.83,5.17L16.41,6.59C18.05,7.91 19,9.9 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12C5,9.9 5.95,7.91 7.59,6.59L6.17,5.17C4.23,6.82 3,9.26 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,9.26 19.77,6.82 17.83,5.17Z"/></svg>
            </button>
          </div>
          <div class="display-container">
            <div class="display-screen" id="display-screen"></div>
            <div class="display-footer">
              <span>${e} x ${t}</span>
              <span>
                <span class="mode-badge">${s?l:"Off"}</span>
                ${s&&d!=="fixed"?`<span class="effect-badge">${k[d]?.name||d}</span>`:""}
              </span>
            </div>
          </div>
        </div>
      </ha-card>`,this._displayContainer=this.shadowRoot.getElementById("display-screen"),this._updateDisplay({text:c,effect:d,speed:h,fgColor:f,bgColor:u,mode:l,font:g}),this._attachPowerButton()}_attachPowerButton(){this.shadowRoot.getElementById("power-btn")?.addEventListener("click",()=>{let e=this._switchEntityId;if(!e){let t=this.getRelatedEntity("switch");t&&(this._switchEntityId=t.entity_id,e=t.entity_id)}if(e&&this._hass.states[e])this._hass.callService("switch","toggle",{entity_id:e});else{let t=Object.keys(this._hass.states).filter(o=>o.startsWith("switch.")),s=this._config.entity?.replace(/^[^.]+\./,"").replace(/_?(text|display|gif_url)$/i,"")||"",i=t.find(o=>o.includes(s.substring(0,10)));i?(this._switchEntityId=i,this._hass.callService("switch","toggle",{entity_id:i})):console.warn("iPIXEL: No switch found. Entity:",this._config.entity,"Available:",t)}})}static getConfigElement(){return document.createElement("ipixel-simple-editor")}static getStubConfig(){return{entity:""}}};var ee=[{value:1,name:"Style 1 (Digital)"},{value:2,name:"Style 2 (Minimal)"},{value:3,name:"Style 3 (Bold)"},{value:4,name:"Style 4 (Retro)"},{value:5,name:"Style 5 (Neon)"},{value:6,name:"Style 6 (Matrix)"},{value:7,name:"Style 7 (Classic)"},{value:8,name:"Style 8 (Modern)"}],ie=[{value:0,name:"Static"},{value:1,name:"Scroll Left"},{value:2,name:"Scroll Right"},{value:3,name:"Scroll Up"},{value:4,name:"Scroll Down"},{value:5,name:"Flash"},{value:6,name:"Fade In/Out"},{value:7,name:"Bounce"}],lt=class extends ${constructor(){super(),this._clockStyle=1,this._is24Hour=!0,this._showDate=!1,this._upsideDown=!1,this._animationMode=0}render(){if(!this._hass)return;let e=this.isOn(),t=this.getRelatedEntity("switch","_upside_down");t&&(this._upsideDown=t.state==="on"),this.shadowRoot.innerHTML=`
      <style>${P}
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }
        .toggle-label {
          font-size: 0.85em;
          color: var(--primary-text-color, #fff);
        }
        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .toggle-switch.active {
          background: var(--primary-color, #03a9f4);
        }
        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .toggle-switch.active::after {
          transform: translateX(20px);
        }
        .subsection {
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
        }
        .subsection-title {
          font-size: 0.75em;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.6;
          margin-bottom: 8px;
        }
        .screen-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 6px;
        }
        .screen-btn {
          padding: 8px 4px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: var(--primary-text-color, #fff);
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8em;
          text-align: center;
          transition: all 0.2s;
        }
        .screen-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .screen-btn.active {
          background: var(--primary-color, #03a9f4);
          border-color: var(--primary-color, #03a9f4);
        }
        .screen-btn.delete {
          background: rgba(244,67,54,0.2);
          border-color: rgba(244,67,54,0.3);
          color: #f44336;
        }
        .screen-btn.delete:hover {
          background: rgba(244,67,54,0.4);
        }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .compact-row { display: flex; gap: 8px; align-items: center; }
        .compact-row select { flex: 1; }
      </style>
      <ha-card>
        <div class="card-content">
          <div class="section-title">Quick Actions</div>
          <div class="control-row">
            <div class="button-grid button-grid-4">
              <button class="icon-btn ${e?"active":""}" data-action="power" title="Power">
                <svg viewBox="0 0 24 24"><path d="M13,3H11V13H13V3M17.83,5.17L16.41,6.59C18.05,7.91 19,9.9 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12C5,9.9 5.95,7.91 7.59,6.59L6.17,5.17C4.23,6.82 3,9.26 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,9.26 19.77,6.82 17.83,5.17Z"/></svg>
              </button>
              <button class="icon-btn" data-action="clear" title="Clear">
                <svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>
              </button>
              <button class="icon-btn" data-action="clock" title="Clock">
                <svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/></svg>
              </button>
              <button class="icon-btn" data-action="sync" title="Sync Time">
                <svg viewBox="0 0 24 24"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4M18.2,7.27L19.62,5.85C18.27,4.5 16.5,3.5 14.5,3.13V5.17C15.86,5.5 17.08,6.23 18.2,7.27M20,12H22A10,10 0 0,0 12,2V4A8,8 0 0,1 20,12M5.8,16.73L4.38,18.15C5.73,19.5 7.5,20.5 9.5,20.87V18.83C8.14,18.5 6.92,17.77 5.8,16.73M4,12H2A10,10 0 0,0 12,22V20A8,8 0 0,1 4,12Z"/></svg>
              </button>
            </div>
          </div>

          <div class="section-title">Brightness</div>
          <div class="control-row">
            <div class="slider-row">
              <input type="range" class="slider" id="brightness" min="1" max="100" value="50">
              <span class="slider-value" id="brightness-val">50%</span>
            </div>
          </div>

          <div class="section-title">Display Mode</div>
          <div class="control-row">
            <div class="button-grid button-grid-3">
              <button class="mode-btn" data-mode="textimage">Text+Image</button>
              <button class="mode-btn" data-mode="text">Text</button>
              <button class="mode-btn" data-mode="clock">Clock</button>
              <button class="mode-btn" data-mode="gif">GIF</button>
              <button class="mode-btn" data-mode="rhythm">Rhythm</button>
            </div>
          </div>

          <div class="section-title">Clock Settings</div>
          <div class="subsection">
            <div class="compact-row" style="margin-bottom: 12px;">
              <select class="dropdown" id="clock-style">
                ${ee.map(s=>`<option value="${s.value}"${s.value===this._clockStyle?" selected":""}>${s.name}</option>`).join("")}
              </select>
              <button class="btn btn-primary" id="apply-clock-btn">Apply</button>
            </div>
            <div class="toggle-row">
              <span class="toggle-label">24-Hour Format</span>
              <div class="toggle-switch ${this._is24Hour?"active":""}" id="toggle-24h"></div>
            </div>
            <div class="toggle-row">
              <span class="toggle-label">Show Date</span>
              <div class="toggle-switch ${this._showDate?"active":""}" id="toggle-date"></div>
            </div>
          </div>

          <div class="section-title">Text Animation</div>
          <div class="control-row">
            <select class="dropdown" id="animation-mode">
              ${ie.map(s=>`<option value="${s.value}"${s.value===this._animationMode?" selected":""}>${s.name}</option>`).join("")}
            </select>
          </div>

          <div class="section-title">Orientation & Display</div>
          <div class="two-col">
            <div>
              <div class="subsection-title">Rotation</div>
              <select class="dropdown" id="orientation">
                <option value="0">0\xB0 (Normal)</option>
                <option value="1">180\xB0</option>
              </select>
            </div>
            <div>
              <div class="subsection-title">Flip</div>
              <div class="toggle-row" style="padding: 4px 0;">
                <span class="toggle-label">Upside Down</span>
                <div class="toggle-switch ${this._upsideDown?"active":""}" id="toggle-upside-down"></div>
              </div>
            </div>
          </div>

          <div class="section-title">Screen Slots</div>
          <div class="subsection">
            <div class="subsection-title">Select Screen (1-9)</div>
            <div class="screen-grid" style="margin-bottom: 12px;">
              ${[1,2,3,4,5,6,7,8,9].map(s=>`<button class="screen-btn" data-screen="${s}">${s}</button>`).join("")}
            </div>
            <div class="subsection-title">Delete Screen</div>
            <div class="screen-grid">
              ${[1,2,3,4,5,6,7,8,9,10].map(s=>`<button class="screen-btn delete" data-delete="${s}">\xD7${s}</button>`).join("")}
            </div>
          </div>

          <div class="section-title">Font Settings</div>
          <div class="subsection">
            <div class="two-col" style="margin-bottom: 12px;">
              <div>
                <div class="subsection-title">Size (1-128)</div>
                <input type="number" class="text-input" id="font-size" value="16" min="1" max="128" style="width: 100%;">
              </div>
              <div>
                <div class="subsection-title">Offset X, Y</div>
                <div style="display: flex; gap: 4px;">
                  <input type="number" class="text-input" id="font-offset-x" value="0" min="-64" max="64" style="width: 50%;">
                  <input type="number" class="text-input" id="font-offset-y" value="0" min="-32" max="32" style="width: 50%;">
                </div>
              </div>
            </div>
          </div>

          <div class="section-title">DIY Mode</div>
          <div class="control-row">
            <select class="dropdown" id="diy-mode">
              <option value="">-- Select Action --</option>
              <option value="1">Enter (Clear Display)</option>
              <option value="3">Enter (Preserve Content)</option>
              <option value="0">Exit (Keep Previous)</option>
              <option value="2">Exit (Keep Current)</option>
            </select>
          </div>

          <div class="section-title">Raw Command</div>
          <div class="control-row" style="margin-top: 8px;">
            <div style="display: flex; gap: 8px;">
              <input type="text" class="text-input" id="raw-command" placeholder="Raw hex (e.g., 05 00 07 01 01)" style="flex: 1;">
              <button class="btn btn-secondary" id="send-raw-btn">Send</button>
            </div>
          </div>
        </div>
      </ha-card>`,this._attachControlListeners()}_attachControlListeners(){this.shadowRoot.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",s=>{let i=s.currentTarget.dataset.action;if(i==="power"){let o=this.getRelatedEntity("switch");o&&this._hass.callService("switch","toggle",{entity_id:o.entity_id})}else i==="clear"?(R({text:"",mode:"text",effect:"fixed",speed:50,fgColor:"#ff6600",bgColor:"#000000"}),this.callService("ipixel_color","clear_pixels")):i==="clock"?this._applyClockSettings():i==="sync"&&this.callService("ipixel_color","sync_time")})});let e=this.shadowRoot.getElementById("brightness");e&&(e.style.setProperty("--value",`${e.value}%`),e.addEventListener("input",t=>{t.target.style.setProperty("--value",`${t.target.value}%`),this.shadowRoot.getElementById("brightness-val").textContent=`${t.target.value}%`}),e.addEventListener("change",t=>{this.callService("ipixel_color","set_brightness",{level:parseInt(t.target.value)})})),this.shadowRoot.querySelectorAll("[data-mode]").forEach(t=>{t.addEventListener("click",s=>{let i=s.currentTarget.dataset.mode,o=this.getRelatedEntity("select","_mode");o&&this._hass.callService("select","select_option",{entity_id:o.entity_id,option:i}),R({mode:i,fgColor:{text:"#ff6600",textimage:"#ff6600",clock:"#00ff88",gif:"#ff44ff",rhythm:"#44aaff"}[i]||"#ff6600",text:i==="clock"?"":window.iPIXELDisplayState?.text||""}),this.shadowRoot.querySelectorAll("[data-mode]").forEach(a=>a.classList.remove("active")),s.currentTarget.classList.add("active")})}),this.shadowRoot.getElementById("clock-style")?.addEventListener("change",t=>{this._clockStyle=parseInt(t.target.value)}),this.shadowRoot.getElementById("apply-clock-btn")?.addEventListener("click",()=>{this._applyClockSettings()}),this.shadowRoot.getElementById("toggle-24h")?.addEventListener("click",t=>{this._is24Hour=!this._is24Hour,t.currentTarget.classList.toggle("active",this._is24Hour)}),this.shadowRoot.getElementById("toggle-date")?.addEventListener("click",t=>{this._showDate=!this._showDate,t.currentTarget.classList.toggle("active",this._showDate)}),this.shadowRoot.getElementById("animation-mode")?.addEventListener("change",t=>{this._animationMode=parseInt(t.target.value),R({animationMode:this._animationMode}),this.callService("ipixel_color","set_animation_mode",{mode:this._animationMode})}),this.shadowRoot.getElementById("orientation")?.addEventListener("change",t=>{let s=parseInt(t.target.value);this.callService("ipixel_color","set_orientation",{orientation:s})}),this.shadowRoot.getElementById("toggle-upside-down")?.addEventListener("click",t=>{this._upsideDown=!this._upsideDown,t.currentTarget.classList.toggle("active",this._upsideDown);let s=this.getRelatedEntity("switch","_upside_down");s?this._hass.callService("switch",this._upsideDown?"turn_on":"turn_off",{entity_id:s.entity_id}):this.callService("ipixel_color","set_upside_down",{enabled:this._upsideDown})}),this.shadowRoot.querySelectorAll("[data-screen]").forEach(t=>{t.addEventListener("click",s=>{let i=parseInt(s.currentTarget.dataset.screen);this.callService("ipixel_color","set_screen",{screen:i}),this.shadowRoot.querySelectorAll("[data-screen]").forEach(o=>o.classList.remove("active")),s.currentTarget.classList.add("active")})}),this.shadowRoot.querySelectorAll("[data-delete]").forEach(t=>{t.addEventListener("click",s=>{let i=parseInt(s.currentTarget.dataset.delete);confirm(`Delete screen slot ${i}?`)&&this.callService("ipixel_color","delete_screen",{slot:i})})}),this.shadowRoot.getElementById("font-size")?.addEventListener("change",t=>{let s=parseInt(t.target.value);R({fontSize:s}),this.callService("ipixel_color","set_font_size",{size:s})}),this.shadowRoot.getElementById("font-offset-x")?.addEventListener("change",()=>{this._updateFontOffset()}),this.shadowRoot.getElementById("font-offset-y")?.addEventListener("change",()=>{this._updateFontOffset()}),this.shadowRoot.getElementById("diy-mode")?.addEventListener("change",t=>{let s=t.target.value;s!==""&&(this.callService("ipixel_color","set_diy_mode",{mode:s}),setTimeout(()=>{t.target.value=""},500))}),this.shadowRoot.getElementById("send-raw-btn")?.addEventListener("click",()=>{let t=this.shadowRoot.getElementById("raw-command")?.value;t&&t.trim()&&this.callService("ipixel_color","send_raw_command",{hex_data:t.trim()})}),this.shadowRoot.getElementById("raw-command")?.addEventListener("keypress",t=>{if(t.key==="Enter"){let s=t.target.value;s&&s.trim()&&this.callService("ipixel_color","send_raw_command",{hex_data:s.trim()})}})}_applyClockSettings(){R({text:"",mode:"clock",effect:"fixed",speed:50,fgColor:"#00ff88",bgColor:"#000000",clockStyle:this._clockStyle,is24Hour:this._is24Hour,showDate:this._showDate}),this.callService("ipixel_color","set_clock_mode",{style:this._clockStyle,format_24h:this._is24Hour,show_date:this._showDate})}_updateFontOffset(){let e=parseInt(this.shadowRoot.getElementById("font-offset-x")?.value||"0"),t=parseInt(this.shadowRoot.getElementById("font-offset-y")?.value||"0");R({fontOffsetX:e,fontOffsetY:t}),this.callService("ipixel_color","set_font_offset",{x:e,y:t})}static getConfigElement(){return document.createElement("ipixel-simple-editor")}static getStubConfig(){return{entity:""}}};var se=[{value:0,name:"None"},{value:1,name:"Rainbow Wave"},{value:2,name:"Rainbow Cycle"},{value:3,name:"Rainbow Pulse"},{value:4,name:"Rainbow Fade"},{value:5,name:"Rainbow Chase"},{value:6,name:"Rainbow Sparkle"},{value:7,name:"Rainbow Gradient"},{value:8,name:"Rainbow Theater"},{value:9,name:"Rainbow Fire"}],oe=[{value:0,name:"Classic Bars"},{value:1,name:"Mirrored Bars"},{value:2,name:"Center Out"},{value:3,name:"Wave Style"},{value:4,name:"Particle Style"}],ct=class extends ${constructor(){super(),this._activeTab="text",this._rhythmLevels=[0,0,0,0,0,0,0,0,0,0,0],this._selectedRhythmStyle=0,this._selectedAmbient="rainbow"}_buildTextEffectOptions(){let e=Object.entries(k).filter(([s,i])=>i.category===w.TEXT).map(([s,i])=>`<option value="${s}">${i.name}</option>`).join(""),t=Object.entries(k).filter(([s,i])=>i.category===w.COLOR).map(([s,i])=>`<option value="${s}">${i.name}</option>`).join("");return`
      <optgroup label="Text Effects">
        ${e}
      </optgroup>
      <optgroup label="Color Effects">
        ${t}
      </optgroup>
    `}_buildAmbientEffectOptions(){return Object.entries(k).filter(([e,t])=>t.category===w.AMBIENT).map(([e,t])=>`<option value="${e}">${t.name}</option>`).join("")}_buildAmbientGrid(){let e=this._selectedAmbient||"rainbow";return Object.entries(k).filter(([t,s])=>s.category===w.AMBIENT).map(([t,s])=>`
        <button class="effect-btn ${t===e?"active":""}" data-effect="${t}">
          ${s.name}
        </button>
      `).join("")}_buildRainbowOptions(){return se.map(e=>`<option value="${e.value}">${e.name}</option>`).join("")}_buildRhythmStyleGrid(){let e=this._selectedRhythmStyle||0;return oe.map(t=>`
      <button class="style-btn ${t.value===e?"active":""}" data-style="${t.value}">
        ${t.name}
      </button>
    `).join("")}_buildRhythmLevelSliders(){let e=["32Hz","64Hz","125Hz","250Hz","500Hz","1kHz","2kHz","4kHz","8kHz","12kHz","16kHz"];return this._rhythmLevels.map((t,s)=>`
      <div class="rhythm-band">
        <label>${e[s]}</label>
        <input type="range" class="rhythm-slider" data-band="${s}" min="0" max="15" value="${t}">
        <span class="rhythm-val">${t}</span>
      </div>
    `).join("")}render(){if(!this._hass)return;let e=this._activeTab==="text",t=this._activeTab==="ambient",s=this._activeTab==="rhythm",i=this._activeTab==="advanced";this.shadowRoot.innerHTML=`
      <style>${P}
        .tabs { display: flex; gap: 4px; margin-bottom: 16px; }
        .tab {
          flex: 1;
          padding: 10px 8px;
          border: none;
          background: rgba(255,255,255,0.05);
          color: var(--primary-text-color, #fff);
          cursor: pointer;
          border-radius: 8px;
          font-size: 0.8em;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .tab:hover { background: rgba(255,255,255,0.1); }
        .tab.active {
          background: var(--primary-color, #03a9f4);
          color: #fff;
        }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .input-row { display: flex; gap: 8px; margin-bottom: 12px; }
        .input-row .text-input { flex: 1; }
        select optgroup { font-weight: bold; color: var(--primary-text-color, #fff); }
        select option { font-weight: normal; }
        .effect-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        .effect-btn, .style-btn {
          padding: 12px 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: var(--primary-text-color, #fff);
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.75em;
          text-align: center;
          transition: all 0.2s ease;
        }
        .effect-btn:hover, .style-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .effect-btn.active, .style-btn.active {
          background: var(--primary-color, #03a9f4);
          border-color: var(--primary-color, #03a9f4);
        }
        .style-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .rhythm-band {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .rhythm-band label {
          width: 50px;
          font-size: 0.75em;
          opacity: 0.8;
        }
        .rhythm-slider {
          flex: 1;
          height: 4px;
        }
        .rhythm-val {
          width: 20px;
          font-size: 0.75em;
          text-align: right;
        }
        .rhythm-container {
          max-height: 300px;
          overflow-y: auto;
          padding-right: 8px;
        }
        .gfx-textarea {
          width: 100%;
          min-height: 150px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--primary-text-color, #fff);
          font-family: monospace;
          font-size: 0.8em;
          padding: 12px;
          resize: vertical;
        }
        .gfx-textarea:focus {
          outline: none;
          border-color: var(--primary-color, #03a9f4);
        }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      </style>
      <ha-card>
        <div class="card-content">
          <div class="tabs">
            <button class="tab ${e?"active":""}" id="tab-text">Text</button>
            <button class="tab ${t?"active":""}" id="tab-ambient">Ambient</button>
            <button class="tab ${s?"active":""}" id="tab-rhythm">Rhythm</button>
            <button class="tab ${i?"active":""}" id="tab-advanced">GFX</button>
          </div>

          <!-- Text Tab -->
          <div class="tab-content ${e?"active":""}" id="content-text">
            <div class="section-title">Display Text</div>
            <div class="input-row">
              <input type="text" class="text-input" id="text-input" placeholder="Enter text to display...">
              <button class="btn btn-primary" id="send-btn">Send</button>
            </div>
            <div class="two-col">
              <div>
                <div class="section-title">Effect</div>
                <div class="control-row">
                  <select class="dropdown" id="text-effect">
                    ${this._buildTextEffectOptions()}
                  </select>
                </div>
              </div>
              <div>
                <div class="section-title">Rainbow Mode</div>
                <div class="control-row">
                  <select class="dropdown" id="rainbow-mode">
                    ${this._buildRainbowOptions()}
                  </select>
                </div>
              </div>
            </div>
            <div class="section-title">Speed</div>
            <div class="control-row">
              <div class="slider-row">
                <input type="range" class="slider" id="text-speed" min="1" max="100" value="50">
                <span class="slider-value" id="text-speed-val">50</span>
              </div>
            </div>
            <div class="section-title">Font</div>
            <div class="control-row">
              <select class="dropdown" id="font-select">
                <option value="VCR_OSD_MONO">VCR OSD Mono</option>
                <option value="CUSONG">CUSONG</option>
                <option value="LEGACY">Legacy (Bitmap)</option>
              </select>
            </div>
            <div class="section-title">Colors</div>
            <div class="control-row">
              <div class="color-row">
                <span style="font-size: 0.85em;">Text:</span>
                <input type="color" class="color-picker" id="text-color" value="#ff6600">
                <span style="font-size: 0.85em; margin-left: 16px;">Background:</span>
                <input type="color" class="color-picker" id="bg-color" value="#000000">
              </div>
            </div>
          </div>

          <!-- Ambient Tab -->
          <div class="tab-content ${t?"active":""}" id="content-ambient">
            <div class="section-title">Ambient Effect</div>
            <div class="effect-grid" id="ambient-grid">
              ${this._buildAmbientGrid()}
            </div>
            <div class="section-title">Speed</div>
            <div class="control-row">
              <div class="slider-row">
                <input type="range" class="slider" id="ambient-speed" min="1" max="100" value="50">
                <span class="slider-value" id="ambient-speed-val">50</span>
              </div>
            </div>
            <button class="btn btn-primary" id="apply-ambient-btn" style="width: 100%; margin-top: 8px;">Apply Effect</button>
          </div>

          <!-- Rhythm Tab -->
          <div class="tab-content ${s?"active":""}" id="content-rhythm">
            <div class="section-title">Visualization Style</div>
            <div class="style-grid" id="rhythm-style-grid">
              ${this._buildRhythmStyleGrid()}
            </div>
            <div class="section-title">Frequency Levels (0-15)</div>
            <div class="rhythm-container">
              ${this._buildRhythmLevelSliders()}
            </div>
            <button class="btn btn-primary" id="apply-rhythm-btn" style="width: 100%; margin-top: 12px;">Apply Rhythm</button>
          </div>

          <!-- Advanced/GFX Tab -->
          <div class="tab-content ${i?"active":""}" id="content-advanced">
            <div class="section-title">GFX JSON Data</div>
            <textarea class="gfx-textarea" id="gfx-json" placeholder='Enter GFX JSON data...
Example:
{
  "width": 64,
  "height": 16,
  "pixels": [
    {"x": 0, "y": 0, "color": "#ff0000"},
    {"x": 1, "y": 0, "color": "#00ff00"}
  ]
}'></textarea>
            <button class="btn btn-primary" id="apply-gfx-btn" style="width: 100%; margin-top: 12px;">Render GFX</button>
            <div class="section-title" style="margin-top: 16px;">Per-Character Colors</div>
            <div class="input-row">
              <input type="text" class="text-input" id="multicolor-text" placeholder="Text (e.g., HELLO)">
            </div>
            <div class="input-row">
              <input type="text" class="text-input" id="multicolor-colors" placeholder="Colors (e.g., #ff0000,#00ff00,#0000ff)">
            </div>
            <button class="btn btn-primary" id="apply-multicolor-btn" style="width: 100%; margin-top: 8px;">Send Multicolor Text</button>
          </div>
        </div>
      </ha-card>`,this._attachListeners()}_getTextFormValues(){return{text:this.shadowRoot.getElementById("text-input")?.value||"",effect:this.shadowRoot.getElementById("text-effect")?.value||"fixed",rainbowMode:parseInt(this.shadowRoot.getElementById("rainbow-mode")?.value||"0"),speed:parseInt(this.shadowRoot.getElementById("text-speed")?.value||"50"),fgColor:this.shadowRoot.getElementById("text-color")?.value||"#ff6600",bgColor:this.shadowRoot.getElementById("bg-color")?.value||"#000000",font:this.shadowRoot.getElementById("font-select")?.value||"VCR_OSD_MONO"}}_getRhythmFormValues(){return{style:this._selectedRhythmStyle||0,levels:[...this._rhythmLevels]}}_getGfxFormValues(){let e=this.shadowRoot.getElementById("gfx-json")?.value||"";try{return JSON.parse(e)}catch{return null}}_getMulticolorFormValues(){let e=this.shadowRoot.getElementById("multicolor-text")?.value||"",s=(this.shadowRoot.getElementById("multicolor-colors")?.value||"").split(",").map(i=>i.trim()).filter(i=>i);return{text:e,colors:s}}_getAmbientFormValues(){return{effect:this._selectedAmbient||"rainbow",speed:parseInt(this.shadowRoot.getElementById("ambient-speed")?.value||"50")}}_updateTextPreview(){let{text:e,effect:t,speed:s,fgColor:i,bgColor:o,font:n}=this._getTextFormValues();R({text:e||"Preview",mode:"text",effect:t,speed:s,fgColor:i,bgColor:o,font:n})}_updateAmbientPreview(){let{effect:e,speed:t}=this._getAmbientFormValues();R({text:"",mode:"ambient",effect:e,speed:t,fgColor:"#ffffff",bgColor:"#000000"})}_attachListeners(){this.shadowRoot.getElementById("tab-text")?.addEventListener("click",()=>{this._activeTab="text",this.render()}),this.shadowRoot.getElementById("tab-ambient")?.addEventListener("click",()=>{this._activeTab="ambient",this.render()}),this.shadowRoot.getElementById("tab-rhythm")?.addEventListener("click",()=>{this._activeTab="rhythm",this.render()}),this.shadowRoot.getElementById("tab-advanced")?.addEventListener("click",()=>{this._activeTab="advanced",this.render()});let e=this.shadowRoot.getElementById("text-speed");e&&(e.style.setProperty("--value",`${e.value}%`),e.addEventListener("input",s=>{s.target.style.setProperty("--value",`${s.target.value}%`),this.shadowRoot.getElementById("text-speed-val").textContent=s.target.value,this._updateTextPreview()})),this.shadowRoot.getElementById("text-effect")?.addEventListener("change",()=>{this._updateTextPreview()}),this.shadowRoot.getElementById("rainbow-mode")?.addEventListener("change",()=>{this._updateTextPreview()}),this.shadowRoot.getElementById("font-select")?.addEventListener("change",()=>{this._updateTextPreview()}),this.shadowRoot.getElementById("text-color")?.addEventListener("input",()=>{this._updateTextPreview()}),this.shadowRoot.getElementById("bg-color")?.addEventListener("input",()=>{this._updateTextPreview()}),this.shadowRoot.getElementById("text-input")?.addEventListener("input",()=>{this._updateTextPreview()}),this.shadowRoot.getElementById("send-btn")?.addEventListener("click",()=>{let{text:s,effect:i,rainbowMode:o,speed:n,fgColor:a,bgColor:r,font:l}=this._getTextFormValues();if(s){R({text:s,mode:"text",effect:i,speed:n,fgColor:a,bgColor:r,font:l,rainbowMode:o}),this._config.entity&&this._hass.callService("text","set_value",{entity_id:this._config.entity,value:s});let c=l==="LEGACY"?"CUSONG":l;this.callService("ipixel_color","display_text",{text:s,effect:i,speed:n,color_fg:this.hexToRgb(a),color_bg:this.hexToRgb(r),font:c,rainbow_mode:o})}}),this.shadowRoot.querySelectorAll(".effect-btn").forEach(s=>{s.addEventListener("click",i=>{let o=i.target.dataset.effect;this._selectedAmbient=o,this.shadowRoot.querySelectorAll(".effect-btn").forEach(n=>n.classList.remove("active")),i.target.classList.add("active"),this._updateAmbientPreview()})});let t=this.shadowRoot.getElementById("ambient-speed");t&&(t.style.setProperty("--value",`${t.value}%`),t.addEventListener("input",s=>{s.target.style.setProperty("--value",`${s.target.value}%`),this.shadowRoot.getElementById("ambient-speed-val").textContent=s.target.value,this._updateAmbientPreview()})),this.shadowRoot.getElementById("apply-ambient-btn")?.addEventListener("click",()=>{let{effect:s,speed:i}=this._getAmbientFormValues();R({text:"",mode:"ambient",effect:s,speed:i,fgColor:"#ffffff",bgColor:"#000000"})}),this.shadowRoot.querySelectorAll(".style-btn").forEach(s=>{s.addEventListener("click",i=>{let o=parseInt(i.target.dataset.style);this._selectedRhythmStyle=o,this.shadowRoot.querySelectorAll(".style-btn").forEach(n=>n.classList.remove("active")),i.target.classList.add("active")})}),this.shadowRoot.querySelectorAll(".rhythm-slider").forEach(s=>{s.addEventListener("input",i=>{let o=parseInt(i.target.dataset.band),n=parseInt(i.target.value);this._rhythmLevels[o]=n,i.target.nextElementSibling.textContent=n})}),this.shadowRoot.getElementById("apply-rhythm-btn")?.addEventListener("click",()=>{let{style:s,levels:i}=this._getRhythmFormValues();R({text:"",mode:"rhythm",rhythmStyle:s,rhythmLevels:i}),this.callService("ipixel_color","set_rhythm_level",{style:s,levels:i})}),this.shadowRoot.getElementById("apply-gfx-btn")?.addEventListener("click",()=>{let s=this._getGfxFormValues();if(!s){console.warn("iPIXEL: Invalid GFX JSON");return}R({text:"",mode:"gfx",gfxData:s}),this.callService("ipixel_color","render_gfx",{data:s})}),this.shadowRoot.getElementById("apply-multicolor-btn")?.addEventListener("click",()=>{let{text:s,colors:i}=this._getMulticolorFormValues();s&&i.length>0&&(R({text:s,mode:"multicolor",colors:i}),this.callService("ipixel_color","display_multicolor_text",{text:s,colors:i.map(o=>this.hexToRgb(o))}))})}static getConfigElement(){return document.createElement("ipixel-simple-editor")}static getStubConfig(){return{entity:""}}};var Dt="iPIXEL_Presets",dt=class extends ${constructor(){super(),this._presets=this._loadPresets(),this._editingPreset=null,this._selectedIcon="\u{1F4FA}"}_loadPresets(){try{let e=localStorage.getItem(Dt);return e?JSON.parse(e):[]}catch{return[]}}_savePresets(){try{localStorage.setItem(Dt,JSON.stringify(this._presets))}catch(e){console.warn("iPIXEL: Failed to save presets",e)}}render(){this._hass&&(this.shadowRoot.innerHTML=`
      <style>${P}
        .preset-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          max-height: 300px;
          overflow-y: auto;
        }
        .preset-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all 0.2s;
        }
        .preset-item:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }
        .preset-item.active {
          border-color: var(--primary-color, #03a9f4);
          background: rgba(3, 169, 244, 0.1);
        }
        .preset-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2em;
        }
        .preset-info {
          flex: 1;
          min-width: 0;
        }
        .preset-name {
          font-weight: 500;
          font-size: 0.9em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .preset-desc {
          font-size: 0.75em;
          opacity: 0.6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .preset-actions {
          display: flex;
          gap: 4px;
        }
        .preset-actions button {
          padding: 6px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .preset-actions button:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .preset-actions button.delete:hover {
          background: rgba(244,67,54,0.2);
          color: #f44;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          opacity: 0.5;
        }
        .empty-state svg {
          width: 48px;
          height: 48px;
          margin-bottom: 12px;
          opacity: 0.5;
        }
        .add-preset-form {
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 16px;
        }
        .form-row {
          margin-bottom: 12px;
        }
        .form-row label {
          display: block;
          font-size: 0.8em;
          opacity: 0.7;
          margin-bottom: 4px;
        }
        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 4px;
          margin-top: 8px;
        }
        .icon-option {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.1em;
          transition: all 0.2s;
          background: transparent;
        }
        .icon-option:hover {
          background: rgba(255,255,255,0.1);
        }
        .icon-option.selected {
          border-color: var(--primary-color, #03a9f4);
          background: rgba(3, 169, 244, 0.2);
        }
      </style>
      <ha-card>
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">Presets</div>
            <button class="icon-btn" id="add-preset-btn" title="Save Current as Preset">
              <svg viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>
            </button>
          </div>

          <div class="preset-list" id="preset-list">
            ${this._presets.length===0?`
              <div class="empty-state">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"/></svg>
                <div>No presets saved</div>
                <div style="font-size: 0.85em; margin-top: 4px;">Click + to save current display</div>
              </div>
            `:this._presets.map((e,t)=>`
              <div class="preset-item" data-index="${t}">
                <div class="preset-icon" style="background: ${e.fgColor||"#ff6600"}20; color: ${e.fgColor||"#ff6600"}">
                  ${e.icon||"\u{1F4FA}"}
                </div>
                <div class="preset-info">
                  <div class="preset-name">${this._escapeHtml(e.name)}</div>
                  <div class="preset-desc">${e.mode} \xB7 ${e.effect||"fixed"}${e.text?' \xB7 "'+e.text.substring(0,15)+(e.text.length>15?"...":"")+'"':""}</div>
                </div>
                <div class="preset-actions">
                  <button class="edit" data-action="edit" data-index="${t}" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/></svg>
                  </button>
                  <button class="delete" data-action="delete" data-index="${t}" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="add-preset-form" id="preset-form" style="display: none;">
            <div class="form-row">
              <label>Preset Name</label>
              <input type="text" class="text-input" id="preset-name" placeholder="My Preset">
            </div>
            <div class="form-row">
              <label>Icon</label>
              <div class="icon-grid" id="icon-grid">
                ${["\u{1F4FA}","\u{1F4AC}","\u23F0","\u{1F3B5}","\u{1F3A8}","\u2B50","\u2764\uFE0F","\u{1F525}","\u{1F4A1}","\u{1F308}","\u{1F3AE}","\u{1F4E2}","\u{1F3E0}","\u{1F514}","\u2728","\u{1F389}"].map(e=>`
                  <button type="button" class="icon-option${e===this._selectedIcon?" selected":""}" data-icon="${e}">${e}</button>
                `).join("")}
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-secondary" id="cancel-preset-btn">Cancel</button>
              <button class="btn btn-primary" id="save-preset-btn">Save Preset</button>
            </div>
          </div>
        </div>
      </ha-card>`,this._attachListeners())}_escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}_attachListeners(){this.shadowRoot.getElementById("add-preset-btn")?.addEventListener("click",()=>{this._editingPreset=null,this._selectedIcon="\u{1F4FA}",this.shadowRoot.getElementById("preset-form").style.display="block",this.shadowRoot.getElementById("preset-name").value="",this.shadowRoot.querySelectorAll(".icon-option").forEach(e=>e.classList.remove("selected")),this.shadowRoot.querySelector(".icon-option")?.classList.add("selected")}),this.shadowRoot.getElementById("cancel-preset-btn")?.addEventListener("click",()=>{this.shadowRoot.getElementById("preset-form").style.display="none",this._editingPreset=null}),this.shadowRoot.getElementById("save-preset-btn")?.addEventListener("click",()=>{let e=this.shadowRoot.getElementById("preset-name").value.trim()||"Preset",s=this.shadowRoot.querySelector(".icon-option.selected")?.dataset.icon||"\u{1F4FA}",i=nt(),o={name:e,icon:s,text:i.text||"",mode:i.mode||"text",effect:i.effect||"fixed",speed:i.speed||50,fgColor:i.fgColor||"#ff6600",bgColor:i.bgColor||"#000000",font:i.font||"VCR_OSD_MONO",rainbowMode:i.rainbowMode||0,createdAt:Date.now()};this._editingPreset!==null?this._presets[this._editingPreset]=o:this._presets.push(o),this._savePresets(),this.shadowRoot.getElementById("preset-form").style.display="none",this._editingPreset=null,this.render()}),this.shadowRoot.querySelectorAll(".icon-option").forEach(e=>{e.addEventListener("click",t=>{this.shadowRoot.querySelectorAll(".icon-option").forEach(s=>s.classList.remove("selected")),t.currentTarget.classList.add("selected"),this._selectedIcon=t.currentTarget.dataset.icon})}),this.shadowRoot.querySelectorAll(".preset-item").forEach(e=>{e.addEventListener("click",t=>{if(t.target.closest(".preset-actions"))return;let s=parseInt(e.dataset.index),i=this._presets[s];i&&(R({text:i.text,mode:i.mode,effect:i.effect,speed:i.speed,fgColor:i.fgColor,bgColor:i.bgColor,font:i.font,rainbowMode:i.rainbowMode}),i.mode==="text"&&i.text&&this.callService("ipixel_color","display_text",{text:i.text,effect:i.effect,speed:i.speed,color_fg:this.hexToRgb(i.fgColor),color_bg:this.hexToRgb(i.bgColor),font:i.font,rainbow_mode:i.rainbowMode}),this.shadowRoot.querySelectorAll(".preset-item").forEach(o=>o.classList.remove("active")),e.classList.add("active"))})}),this.shadowRoot.querySelectorAll('[data-action="edit"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let s=parseInt(t.currentTarget.dataset.index),i=this._presets[s];i&&(this._editingPreset=s,this._selectedIcon=i.icon||"\u{1F4FA}",this.shadowRoot.getElementById("preset-form").style.display="block",this.shadowRoot.getElementById("preset-name").value=i.name,this.shadowRoot.querySelectorAll(".icon-option").forEach(o=>{o.classList.toggle("selected",o.dataset.icon===i.icon)}))})}),this.shadowRoot.querySelectorAll('[data-action="delete"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let s=parseInt(t.currentTarget.dataset.index);confirm("Delete this preset?")&&(this._presets.splice(s,1),this._savePresets(),this.render())})})}static getConfigElement(){return document.createElement("ipixel-simple-editor")}static getStubConfig(){return{entity:""}}};var Ht="iPIXEL_Schedules",ht=class extends ${constructor(){super(),this._schedules=this._loadSchedules(),this._powerSchedule=this._loadPowerSchedule(),this._editingSlot=null,this._checkInterval=null}connectedCallback(){this._checkInterval=setInterval(()=>this._checkSchedules(),6e4),this._checkSchedules()}disconnectedCallback(){this._checkInterval&&clearInterval(this._checkInterval)}_loadSchedules(){try{let e=localStorage.getItem(Ht);return e?JSON.parse(e):[]}catch{return[]}}_saveSchedules(){try{localStorage.setItem(Ht,JSON.stringify(this._schedules))}catch(e){console.warn("iPIXEL: Failed to save schedules",e)}}_loadPowerSchedule(){try{let e=localStorage.getItem("iPIXEL_PowerSchedule");return e?JSON.parse(e):{enabled:!1,onTime:"07:00",offTime:"22:00"}}catch{return{enabled:!1,onTime:"07:00",offTime:"22:00"}}}_savePowerSchedule(){try{localStorage.setItem("iPIXEL_PowerSchedule",JSON.stringify(this._powerSchedule))}catch(e){console.warn("iPIXEL: Failed to save power schedule",e)}}_checkSchedules(){let e=new Date,t=`${e.getHours().toString().padStart(2,"0")}:${e.getMinutes().toString().padStart(2,"0")}`,s=e.getDay();for(let i of this._schedules)i.enabled&&(i.days&&!i.days.includes(s)||i.startTime===t&&(R({text:i.text||"",mode:i.mode||"text",effect:i.effect||"fixed",fgColor:i.fgColor||"#ff6600",bgColor:i.bgColor||"#000000"}),i.mode==="text"&&i.text?this.callService("ipixel_color","display_text",{text:i.text,effect:i.effect,color_fg:this.hexToRgb(i.fgColor),color_bg:this.hexToRgb(i.bgColor)}):i.mode==="clock"&&this.callService("ipixel_color","set_clock_mode",{style:1})))}render(){if(!this._hass)return;let e=new Date,t=(e.getHours()*60+e.getMinutes())/1440*100,s=`${e.getHours().toString().padStart(2,"0")}:${e.getMinutes().toString().padStart(2,"0")}`,i=this._schedules.filter(n=>n.enabled).map(n=>{let a=this._timeToMinutes(n.startTime),r=n.endTime?this._timeToMinutes(n.endTime):a+60,l=a/1440*100,c=(r-a)/1440*100;return`<div class="timeline-block" style="left: ${l}%; width: ${c}%; background: ${n.fgColor||"#03a9f4"}40;" title="${n.name||"Schedule"}"></div>`}).join(""),o=["Su","Mo","Tu","We","Th","Fr","Sa"];this.shadowRoot.innerHTML=`
      <style>${P}
        .timeline { background: rgba(255,255,255,0.05); border-radius: 6px; padding: 12px; margin-bottom: 12px; }
        .timeline-header { display: flex; justify-content: space-between; font-size: 0.7em; opacity: 0.5; margin-bottom: 6px; }
        .timeline-bar { height: 32px; background: rgba(255,255,255,0.1); border-radius: 4px; position: relative; overflow: hidden; }
        .timeline-now { position: absolute; width: 2px; height: 100%; background: #f44336; left: ${t}%; z-index: 2; }
        .timeline-block { position: absolute; height: 100%; border-radius: 2px; z-index: 1; }
        .power-section { background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px; margin-bottom: 12px; }
        .power-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .power-row label { font-size: 0.85em; }
        .power-row input[type="time"] {
          padding: 6px 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          color: inherit;
        }
        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
          max-height: 250px;
          overflow-y: auto;
        }
        .schedule-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .schedule-toggle {
          width: 36px;
          height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
        }
        .schedule-toggle.active {
          background: var(--primary-color, #03a9f4);
        }
        .schedule-toggle::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.2s;
        }
        .schedule-toggle.active::after {
          transform: translateX(16px);
        }
        .schedule-info { flex: 1; min-width: 0; }
        .schedule-name { font-weight: 500; font-size: 0.9em; }
        .schedule-time { font-size: 0.75em; opacity: 0.6; }
        .schedule-actions button {
          padding: 4px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          border-radius: 4px;
        }
        .schedule-actions button:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .add-slot-form {
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
          padding: 16px;
          margin-top: 12px;
        }
        .form-row { margin-bottom: 12px; }
        .form-row label { display: block; font-size: 0.8em; opacity: 0.7; margin-bottom: 4px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .day-selector {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .day-btn {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          background: transparent;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 0.75em;
          transition: all 0.2s;
        }
        .day-btn.selected {
          background: var(--primary-color, #03a9f4);
          border-color: var(--primary-color, #03a9f4);
          color: #fff;
        }
        .form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
        .current-time { font-size: 0.85em; opacity: 0.7; text-align: right; margin-bottom: 4px; }
      </style>
      <ha-card>
        <div class="card-content">
          <div class="current-time">Current: ${s}</div>

          <div class="section-title">Timeline</div>
          <div class="timeline">
            <div class="timeline-header">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
            </div>
            <div class="timeline-bar">
              ${i}
              <div class="timeline-now"></div>
            </div>
          </div>

          <div class="section-title">Power Schedule</div>
          <div class="power-section">
            <div class="power-row">
              <div class="schedule-toggle ${this._powerSchedule.enabled?"active":""}" id="power-toggle"></div>
              <label>On:</label>
              <input type="time" id="power-on" value="${this._powerSchedule.onTime}">
              <label>Off:</label>
              <input type="time" id="power-off" value="${this._powerSchedule.offTime}">
              <button class="btn btn-primary" id="save-power">Save</button>
            </div>
          </div>

          <div class="section-title">Content Schedules</div>
          <div class="schedule-list" id="schedule-list">
            ${this._schedules.length===0?`
              <div class="empty-state" style="padding: 20px; text-align: center; opacity: 0.5;">
                No schedules configured
              </div>
            `:this._schedules.map((n,a)=>`
              <div class="schedule-item" data-index="${a}">
                <div class="schedule-toggle ${n.enabled?"active":""}" data-action="toggle" data-index="${a}"></div>
                <div class="schedule-info">
                  <div class="schedule-name">${this._escapeHtml(n.name||"Schedule "+(a+1))}</div>
                  <div class="schedule-time">
                    ${n.startTime}${n.endTime?" - "+n.endTime:""} \xB7
                    ${n.days?n.days.map(r=>o[r]).join(", "):"Daily"} \xB7
                    ${n.mode||"text"}
                  </div>
                </div>
                <div class="schedule-actions">
                  <button data-action="edit" data-index="${a}" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/></svg>
                  </button>
                  <button data-action="delete" data-index="${a}" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/></svg>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <button class="btn btn-secondary" id="add-slot" style="width: 100%;">+ Add Schedule</button>

          <div class="add-slot-form" id="slot-form" style="display: none;">
            <div class="form-row">
              <label>Name</label>
              <input type="text" class="text-input" id="slot-name" placeholder="Morning Message">
            </div>
            <div class="form-grid">
              <div class="form-row">
                <label>Start Time</label>
                <input type="time" class="text-input" id="slot-start" value="08:00" style="width: 100%;">
              </div>
              <div class="form-row">
                <label>End Time (optional)</label>
                <input type="time" class="text-input" id="slot-end" style="width: 100%;">
              </div>
            </div>
            <div class="form-row">
              <label>Days</label>
              <div class="day-selector" id="day-selector">
                ${o.map((n,a)=>`
                  <button type="button" class="day-btn selected" data-day="${a}">${n}</button>
                `).join("")}
              </div>
            </div>
            <div class="form-grid">
              <div class="form-row">
                <label>Mode</label>
                <select class="dropdown" id="slot-mode">
                  <option value="text">Text</option>
                  <option value="clock">Clock</option>
                  <option value="off">Power Off</option>
                </select>
              </div>
              <div class="form-row">
                <label>Effect</label>
                <select class="dropdown" id="slot-effect">
                  <option value="fixed">Fixed</option>
                  <option value="scroll_ltr">Scroll Left</option>
                  <option value="scroll_rtl">Scroll Right</option>
                  <option value="blink">Blink</option>
                </select>
              </div>
            </div>
            <div class="form-row" id="text-row">
              <label>Text</label>
              <input type="text" class="text-input" id="slot-text" placeholder="Good Morning!">
            </div>
            <div class="form-grid">
              <div class="form-row">
                <label>Text Color</label>
                <input type="color" id="slot-fg-color" value="#ff6600" style="width: 100%; height: 32px;">
              </div>
              <div class="form-row">
                <label>Background</label>
                <input type="color" id="slot-bg-color" value="#000000" style="width: 100%; height: 32px;">
              </div>
            </div>
            <div class="form-actions">
              <button class="btn btn-secondary" id="cancel-slot">Cancel</button>
              <button class="btn btn-primary" id="save-slot">Save Schedule</button>
            </div>
          </div>
        </div>
      </ha-card>`,this._attachListeners()}_timeToMinutes(e){let[t,s]=e.split(":").map(Number);return t*60+s}_escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}_attachListeners(){this.shadowRoot.getElementById("power-toggle")?.addEventListener("click",e=>{this._powerSchedule.enabled=!this._powerSchedule.enabled,e.currentTarget.classList.toggle("active",this._powerSchedule.enabled)}),this.shadowRoot.getElementById("save-power")?.addEventListener("click",()=>{this._powerSchedule.onTime=this.shadowRoot.getElementById("power-on")?.value||"07:00",this._powerSchedule.offTime=this.shadowRoot.getElementById("power-off")?.value||"22:00",this._savePowerSchedule(),this.callService("ipixel_color","set_power_schedule",{enabled:this._powerSchedule.enabled,on_time:this._powerSchedule.onTime,off_time:this._powerSchedule.offTime})}),this.shadowRoot.getElementById("add-slot")?.addEventListener("click",()=>{this._editingSlot=null,this._resetSlotForm(),this.shadowRoot.getElementById("slot-form").style.display="block"}),this.shadowRoot.getElementById("cancel-slot")?.addEventListener("click",()=>{this.shadowRoot.getElementById("slot-form").style.display="none",this._editingSlot=null}),this.shadowRoot.querySelectorAll(".day-btn").forEach(e=>{e.addEventListener("click",t=>{t.currentTarget.classList.toggle("selected")})}),this.shadowRoot.getElementById("slot-mode")?.addEventListener("change",e=>{let t=this.shadowRoot.getElementById("text-row");t&&(t.style.display=e.target.value==="text"?"block":"none")}),this.shadowRoot.getElementById("save-slot")?.addEventListener("click",()=>{let e=Array.from(this.shadowRoot.querySelectorAll(".day-btn.selected")).map(s=>parseInt(s.dataset.day)),t={name:this.shadowRoot.getElementById("slot-name")?.value||"Schedule",startTime:this.shadowRoot.getElementById("slot-start")?.value||"08:00",endTime:this.shadowRoot.getElementById("slot-end")?.value||"",days:e.length===7?null:e,mode:this.shadowRoot.getElementById("slot-mode")?.value||"text",effect:this.shadowRoot.getElementById("slot-effect")?.value||"fixed",text:this.shadowRoot.getElementById("slot-text")?.value||"",fgColor:this.shadowRoot.getElementById("slot-fg-color")?.value||"#ff6600",bgColor:this.shadowRoot.getElementById("slot-bg-color")?.value||"#000000",enabled:!0};this._editingSlot!==null?this._schedules[this._editingSlot]=t:this._schedules.push(t),this._saveSchedules(),this.shadowRoot.getElementById("slot-form").style.display="none",this._editingSlot=null,this.render()}),this.shadowRoot.querySelectorAll('[data-action="toggle"]').forEach(e=>{e.addEventListener("click",t=>{let s=parseInt(t.currentTarget.dataset.index);this._schedules[s].enabled=!this._schedules[s].enabled,this._saveSchedules(),t.currentTarget.classList.toggle("active",this._schedules[s].enabled)})}),this.shadowRoot.querySelectorAll('[data-action="edit"]').forEach(e=>{e.addEventListener("click",t=>{let s=parseInt(t.currentTarget.dataset.index),i=this._schedules[s];i&&(this._editingSlot=s,this._fillSlotForm(i),this.shadowRoot.getElementById("slot-form").style.display="block")})}),this.shadowRoot.querySelectorAll('[data-action="delete"]').forEach(e=>{e.addEventListener("click",t=>{let s=parseInt(t.currentTarget.dataset.index);confirm("Delete this schedule?")&&(this._schedules.splice(s,1),this._saveSchedules(),this.render())})})}_resetSlotForm(){this.shadowRoot.getElementById("slot-name").value="",this.shadowRoot.getElementById("slot-start").value="08:00",this.shadowRoot.getElementById("slot-end").value="",this.shadowRoot.getElementById("slot-mode").value="text",this.shadowRoot.getElementById("slot-effect").value="fixed",this.shadowRoot.getElementById("slot-text").value="",this.shadowRoot.getElementById("slot-fg-color").value="#ff6600",this.shadowRoot.getElementById("slot-bg-color").value="#000000",this.shadowRoot.querySelectorAll(".day-btn").forEach(e=>e.classList.add("selected")),this.shadowRoot.getElementById("text-row").style.display="block"}_fillSlotForm(e){this.shadowRoot.getElementById("slot-name").value=e.name||"",this.shadowRoot.getElementById("slot-start").value=e.startTime||"08:00",this.shadowRoot.getElementById("slot-end").value=e.endTime||"",this.shadowRoot.getElementById("slot-mode").value=e.mode||"text",this.shadowRoot.getElementById("slot-effect").value=e.effect||"fixed",this.shadowRoot.getElementById("slot-text").value=e.text||"",this.shadowRoot.getElementById("slot-fg-color").value=e.fgColor||"#ff6600",this.shadowRoot.getElementById("slot-bg-color").value=e.bgColor||"#000000";let t=e.days||[0,1,2,3,4,5,6];this.shadowRoot.querySelectorAll(".day-btn").forEach(s=>{s.classList.toggle("selected",t.includes(parseInt(s.dataset.day)))}),this.shadowRoot.getElementById("text-row").style.display=e.mode==="text"?"block":"none"}static getConfigElement(){return document.createElement("ipixel-simple-editor")}static getStubConfig(){return{entity:""}}};var ne=["#FFFFFF","#000000","#FF0000","#00FF00","#0080FF","#FFFF00","#FF00FF","#00FFFF","#FF8000","#8000FF","#2EC4FF","#0010A0","#A0FF00","#FF80C0","#808080","#C0C0C0"],re=[{value:"16x16",label:"16\xD716"},{value:"32x8",label:"32\xD78"},{value:"32x16",label:"32\xD716"},{value:"32x32",label:"32\xD732"},{value:"64x16",label:"64\xD716"},{value:"96x16",label:"96\xD716"},{value:"128x16",label:"128\xD716"}],X={r:25,g:25,b:25},pt=class extends ${constructor(){super(),this._width=64,this._height=16,this._tool="pen",this._drawing=!1,this._gridOn=!0,this._currentColor="#ff6600",this._scale=8,this._sending=!1,this._logicalCanvas=document.createElement("canvas"),this._ctx=this._logicalCanvas.getContext("2d"),this._displayCanvas=null,this._dctx=null,this._initialized=!1}setConfig(e){if(!e.entity)throw new Error("Please define an entity");this._config=e}set hass(e){let t=!!this._hass;if(this._hass=e,!t){let[s,i]=this.getResolution();this._width=s,this._height=i,this._logicalCanvas.width=s,this._logicalCanvas.height=i,this.render()}}render(){if(!this._hass)return;let e=this.getEntity(),t=this.isOn(),[s,i]=this.getResolution(),o=re.map(a=>{let r=a.value===`${this._width}x${this._height}`?"selected":"";return`<option value="${a.value}" ${r}>${a.label}</option>`}).join(""),n=ne.map(a=>`<div class="color-swatch ${a.toLowerCase()===this._currentColor.toLowerCase()?"active":""}" data-color="${a}" style="background:${a}"></div>`).join("");this.shadowRoot.innerHTML=`
      <style>
        ${P}

        .editor-toolbar {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .tool-group {
          display: flex;
          gap: 4px;
        }

        .color-palette {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 12px;
        }

        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          border: 2px solid transparent;
          box-sizing: border-box;
        }

        .color-swatch:hover {
          border-color: rgba(255,255,255,0.5);
        }

        .color-swatch.active {
          border-color: var(--ipixel-primary);
          box-shadow: 0 0 0 1px var(--ipixel-primary);
        }

        .canvas-container {
          background: #050608;
          border-radius: 8px;
          padding: 8px;
          margin-bottom: 12px;
          overflow: auto;
          text-align: center;
        }

        #editor-canvas {
          display: inline-block;
          cursor: crosshair;
          image-rendering: pixelated;
          touch-action: none;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75em;
          opacity: 0.6;
          margin-bottom: 8px;
        }

        .tool-icon {
          font-size: 16px;
        }

        .resolution-select {
          padding: 6px 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid var(--ipixel-border);
          border-radius: 6px;
          color: inherit;
          font-size: 0.85em;
          cursor: pointer;
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>

      <ha-card>
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">
              <span class="status-dot ${t?"":"off"}"></span>
              ${this._config.name||"Pixel Editor"}
            </div>
          </div>

          <!-- Toolbar -->
          <div class="editor-toolbar">
            <div class="tool-group">
              <button class="icon-btn ${this._tool==="pen"?"active":""}" id="pen-tool" title="Pen Tool">
                <span class="tool-icon">&#9998;</span>
              </button>
              <button class="icon-btn ${this._tool==="eraser"?"active":""}" id="eraser-tool" title="Eraser Tool">
                <span class="tool-icon">&#9746;</span>
              </button>
            </div>
            <input type="color" class="color-picker" id="color-picker" value="${this._currentColor}" title="Pick Color">
            <button class="icon-btn ${this._gridOn?"active":""}" id="grid-toggle" title="Toggle LED Grid">
              <span class="tool-icon">&#9638;</span>
            </button>
            <select class="resolution-select" id="resolution-select" title="Canvas Size">
              ${o}
            </select>
          </div>

          <!-- Color Palette -->
          <div class="color-palette" id="palette">
            ${n}
          </div>

          <!-- Canvas -->
          <div class="canvas-container">
            <canvas id="editor-canvas"></canvas>
          </div>

          <!-- Info -->
          <div class="info-row">
            <span>Tool: ${this._tool} | Grid: ${this._gridOn?"LED":"Flat"}</span>
            <span>Device: ${s}\xD7${i}</span>
          </div>

          <!-- Actions -->
          <div class="button-grid button-grid-3">
            <button class="btn btn-secondary" id="clear-btn">Clear</button>
            <button class="btn btn-secondary" id="import-btn">Import</button>
            <button class="btn btn-primary send-btn" id="send-btn" ${this._sending?"disabled":""}>
              ${this._sending?"Sending...":"Send to Device"}
            </button>
          </div>

          <!-- Hidden file input for import -->
          <input type="file" id="file-input" accept="image/png,image/gif,image/jpeg" style="display:none">
        </div>
      </ha-card>
    `,this._initCanvas(),this._attachListeners()}_initCanvas(){this._displayCanvas=this.shadowRoot.getElementById("editor-canvas"),this._displayCanvas&&(this._dctx=this._displayCanvas.getContext("2d"),(this._logicalCanvas.width!==this._width||this._logicalCanvas.height!==this._height)&&(this._logicalCanvas.width=this._width,this._logicalCanvas.height=this._height),this._updateDisplaySize(),this._renderDisplay(),this._initialized=!0)}_updateDisplaySize(){this._displayCanvas&&(this._displayCanvas.width=this._width*this._scale,this._displayCanvas.height=this._height*this._scale)}_renderDisplay(){if(!this._dctx||!this._ctx)return;this._updateDisplaySize(),this._dctx.fillStyle="#050608",this._dctx.fillRect(0,0,this._displayCanvas.width,this._displayCanvas.height);let e=this._ctx.getImageData(0,0,this._width,this._height).data,t=this._scale,s=t*.38;for(let i=0;i<this._height;i++)for(let o=0;o<this._width;o++){let n=(i*this._width+o)*4,a=e[n],r=e[n+1],l=e[n+2],d=e[n+3]===0,h=o*t,f=i*t,u=h+t/2,g=f+t/2;if(this._dctx.fillStyle=`rgb(${X.r},${X.g},${X.b})`,this._dctx.fillRect(h,f,t,t),this._gridOn)if(d)this._dctx.fillStyle="rgb(5,5,5)",this._dctx.beginPath(),this._dctx.arc(u,g,s,0,Math.PI*2),this._dctx.fill();else{let b=this._dctx.createRadialGradient(u,g,s*.3,u,g,s*1.8);b.addColorStop(0,`rgba(${a},${r},${l},0.4)`),b.addColorStop(1,`rgba(${a},${r},${l},0)`),this._dctx.fillStyle=b,this._dctx.beginPath(),this._dctx.arc(u,g,s*1.8,0,Math.PI*2),this._dctx.fill(),this._dctx.fillStyle=`rgb(${a},${r},${l})`,this._dctx.beginPath(),this._dctx.arc(u,g,s,0,Math.PI*2),this._dctx.fill()}else d?this._dctx.fillStyle=`rgb(${X.r},${X.g},${X.b})`:this._dctx.fillStyle=`rgb(${a},${r},${l})`,this._dctx.fillRect(h,f,t,t)}}_getPixelPos(e){if(!this._displayCanvas)return null;let t=this._displayCanvas.getBoundingClientRect(),s=t.width/this._width,i=t.height/this._height,o=e.touches?e.touches[0].clientX:e.clientX,n=e.touches?e.touches[0].clientY:e.clientY,a=Math.floor((o-t.left)/s),r=Math.floor((n-t.top)/i);return a<0||r<0||a>=this._width||r>=this._height?null:{x:a,y:r}}_drawAt(e){let t=this._getPixelPos(e);t&&(this._tool==="pen"?(this._ctx.fillStyle=this._currentColor,this._ctx.fillRect(t.x,t.y,1,1)):this._ctx.clearRect(t.x,t.y,1,1),this._renderDisplay())}_attachListeners(){let e=this.shadowRoot.getElementById("editor-canvas");e&&(e.addEventListener("mousedown",t=>{t.preventDefault(),this._drawing=!0,this._drawAt(t)}),e.addEventListener("mousemove",t=>{this._drawing&&this._drawAt(t)}),window.addEventListener("mouseup",()=>{this._drawing=!1}),e.addEventListener("touchstart",t=>{t.preventDefault(),this._drawing=!0,this._drawAt(t)},{passive:!1}),e.addEventListener("touchmove",t=>{t.preventDefault(),this._drawing&&this._drawAt(t)},{passive:!1}),e.addEventListener("touchend",()=>{this._drawing=!1}),this.shadowRoot.getElementById("pen-tool")?.addEventListener("click",()=>{this._tool="pen",this.render()}),this.shadowRoot.getElementById("eraser-tool")?.addEventListener("click",()=>{this._tool="eraser",this.render()}),this.shadowRoot.getElementById("color-picker")?.addEventListener("input",t=>{this._currentColor=t.target.value,this._updatePaletteSelection()}),this.shadowRoot.querySelectorAll(".color-swatch").forEach(t=>{t.addEventListener("click",()=>{this._currentColor=t.dataset.color,this.shadowRoot.getElementById("color-picker").value=this._currentColor,this._updatePaletteSelection()})}),this.shadowRoot.getElementById("grid-toggle")?.addEventListener("click",()=>{this._gridOn=!this._gridOn,this.render()}),this.shadowRoot.getElementById("resolution-select")?.addEventListener("change",t=>{let[s,i]=t.target.value.split("x").map(o=>parseInt(o,10));this._resizeCanvas(s,i)}),this.shadowRoot.getElementById("clear-btn")?.addEventListener("click",()=>{this._clearCanvas()}),this.shadowRoot.getElementById("import-btn")?.addEventListener("click",()=>{this.shadowRoot.getElementById("file-input")?.click()}),this.shadowRoot.getElementById("file-input")?.addEventListener("change",t=>{let s=t.target.files?.[0];s&&this._handleImport(s)}),this.shadowRoot.getElementById("send-btn")?.addEventListener("click",()=>{this._sendToDevice()}))}_updatePaletteSelection(){this.shadowRoot.querySelectorAll(".color-swatch").forEach(e=>{e.dataset.color.toLowerCase()===this._currentColor.toLowerCase()?e.classList.add("active"):e.classList.remove("active")})}_resizeCanvas(e,t){let s=this._ctx.getImageData(0,0,this._width,this._height);this._width=e,this._height=t,this._logicalCanvas.width=e,this._logicalCanvas.height=t,this._ctx.putImageData(s,0,0),this._updateDisplaySize(),this._renderDisplay();let i=this.shadowRoot.querySelector(".info-row span:first-child");i&&(i.textContent=`Tool: ${this._tool} | Grid: ${this._gridOn?"LED":"Flat"}`)}_clearCanvas(){this._ctx.clearRect(0,0,this._width,this._height),this._renderDisplay()}_handleImport(e){let t=new FileReader;t.onload=s=>{let i=new Image;i.onload=()=>{this._ctx.clearRect(0,0,this._width,this._height),this._ctx.imageSmoothingEnabled=!1,this._ctx.drawImage(i,0,0,this._width,this._height),this._renderDisplay()},i.src=s.target.result},t.readAsDataURL(e)}async _sendToDevice(){if(!this._sending){this._sending=!0,this.render();try{let e=this._ctx.getImageData(0,0,this._width,this._height).data,t=[];for(let s=0;s<this._height;s++)for(let i=0;i<this._width;i++){let o=(s*this._width+i)*4,n=e[o],a=e[o+1],r=e[o+2];e[o+3]>0&&t.push({x:i,y:s,color:this._rgbToHex(n,a,r)})}t.length>0&&await this.callService("ipixel_color","set_pixels",{pixels:t})}catch(e){console.error("Failed to send pixels to device:",e)}finally{this._sending=!1,this.render()}}}_rgbToHex(e,t,s){return(e<<16|t<<8|s).toString(16).padStart(6,"0")}static getConfigElement(){return document.createElement("ipixel-simple-editor")}static getStubConfig(){return{entity:""}}getCardSize(){return 4}};var ft=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}setConfig(e){this._config=e,this.render()}set hass(e){this._hass=e,this.render()}render(){if(!this._hass)return;let e=Object.keys(this._hass.states).filter(t=>t.startsWith("text.")||t.startsWith("switch.")).sort();this.shadowRoot.innerHTML=`
      <style>
        .row { margin-bottom: 12px; }
        label { display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.9em; }
        select, input {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color, #ccc);
          border-radius: 4px;
          background: var(--card-background-color);
          color: inherit;
          box-sizing: border-box;
        }
      </style>
      <div class="row">
        <label>Entity</label>
        <select id="entity">
          <option value="">Select entity</option>
          ${e.map(t=>`
            <option value="${t}" ${this._config?.entity===t?"selected":""}>
              ${this._hass.states[t]?.attributes?.friendly_name||t}
            </option>
          `).join("")}
        </select>
      </div>
      <div class="row">
        <label>Name (optional)</label>
        <input type="text" id="name" value="${this._config?.name||""}" placeholder="Display name">
      </div>`,this.shadowRoot.querySelectorAll("select, input").forEach(t=>{t.addEventListener("change",()=>this.fireConfig())})}fireConfig(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:{type:this._config?.type||"custom:ipixel-display-card",entity:this.shadowRoot.getElementById("entity")?.value,name:this.shadowRoot.getElementById("name")?.value||void 0}},bubbles:!0,composed:!0}))}};customElements.define("ipixel-display-card",at);customElements.define("ipixel-controls-card",lt);customElements.define("ipixel-text-card",ct);customElements.define("ipixel-playlist-card",dt);customElements.define("ipixel-schedule-card",ht);customElements.define("ipixel-editor-card",pt);customElements.define("ipixel-simple-editor",ft);window.customCards=window.customCards||[];[{type:"ipixel-display-card",name:"iPIXEL Display",description:"LED matrix preview with power control"},{type:"ipixel-controls-card",name:"iPIXEL Controls",description:"Brightness, mode, and orientation controls"},{type:"ipixel-text-card",name:"iPIXEL Text",description:"Text input with effects and colors"},{type:"ipixel-playlist-card",name:"iPIXEL Playlist",description:"Playlist management"},{type:"ipixel-schedule-card",name:"iPIXEL Schedule",description:"Power schedule and time slots"},{type:"ipixel-editor-card",name:"iPIXEL Pixel Editor",description:"Draw custom pixel art and send to your LED matrix"}].forEach(p=>window.customCards.push({...p,preview:!0,documentationURL:"https://github.com/cagcoach/ha-ipixel-color"}));console.info(`%c iPIXEL Cards %c ${yt} `,"background:#03a9f4;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px;","background:#333;color:#fff;padding:2px 6px;border-radius:0 4px 4px 0;");})();
