/**
 * iPIXEL Text Card - Text Input with Effects
 */

import { iPIXELCardBase, iPIXELCardStyles, hexToRgb } from '../ipixel-base.js';

export class iPIXELTextCard extends iPIXELCardBase {
  render() {
    if (!this._hass) return;

    this.shadowRoot.innerHTML = `
      <style>${iPIXELCardStyles}
        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .input-row .text-input { flex: 1; }
      </style>
      <ha-card>
        <div class="card-content">
          <div class="section-title">Display Text</div>
          <div class="input-row">
            <input type="text" class="text-input" id="text-input" placeholder="Enter text to display...">
            <button class="btn btn-primary" id="send-btn">Send</button>
          </div>

          <div class="section-title">Effect</div>
          <div class="control-row">
            <select class="dropdown" id="effect">
              <option value="fixed">Fixed</option>
              <option value="scroll_ltr" selected>Scroll Left to Right</option>
              <option value="scroll_rtl">Scroll Right to Left</option>
              <option value="blink">Blink</option>
              <option value="breeze">Breeze</option>
              <option value="snow">Snow</option>
              <option value="laser">Laser</option>
            </select>
          </div>

          <div class="section-title">Speed</div>
          <div class="control-row">
            <div class="slider-row">
              <input type="range" class="slider" id="speed" min="1" max="100" value="50">
              <span class="slider-value" id="speed-val">50</span>
            </div>
          </div>

          <div class="section-title">Colors</div>
          <div class="control-row">
            <div class="color-row">
              <span style="font-size: 0.85em;">Text:</span>
              <input type="color" class="color-picker" id="text-color" value="#ffffff">
              <span style="font-size: 0.85em; margin-left: 16px;">Background:</span>
              <input type="color" class="color-picker" id="bg-color" value="#000000">
            </div>
          </div>
        </div>
      </ha-card>
    `;

    this.attachListeners();
  }

  attachListeners() {
    // Speed slider
    const speed = this.shadowRoot.getElementById('speed');
    if (speed) {
      speed.style.setProperty('--value', `${speed.value}%`);
      speed.addEventListener('input', (e) => {
        e.target.style.setProperty('--value', `${e.target.value}%`);
        this.shadowRoot.getElementById('speed-val').textContent = e.target.value;
      });
    }

    // Send button
    this.shadowRoot.getElementById('send-btn')?.addEventListener('click', () => {
      const text = this.shadowRoot.getElementById('text-input')?.value;
      const effect = this.shadowRoot.getElementById('effect')?.value;
      const speedVal = parseInt(this.shadowRoot.getElementById('speed')?.value || '50');
      const textColor = hexToRgb(this.shadowRoot.getElementById('text-color')?.value);
      const bgColor = hexToRgb(this.shadowRoot.getElementById('bg-color')?.value);

      if (text) {
        this.callService('ipixel_color', 'display_text', {
          text,
          effect,
          speed: speedVal,
          color_fg: textColor,
          color_bg: bgColor,
        });
      }
    });
  }

  static getConfigElement() { return document.createElement('ipixel-simple-editor'); }
  static getStubConfig() { return { entity: '' }; }
}
