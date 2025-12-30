/**
 * iPIXEL Controls Card - Brightness, Mode, Orientation
 */

import { iPIXELCardBase, iPIXELCardStyles } from '../ipixel-base.js';

export class iPIXELControlsCard extends iPIXELCardBase {
  render() {
    if (!this._hass) return;

    const isOn = this.isOn();

    this.shadowRoot.innerHTML = `
      <style>${iPIXELCardStyles}</style>
      <ha-card>
        <div class="card-content">
          <div class="section-title">Quick Actions</div>
          <div class="control-row">
            <div class="button-grid button-grid-4">
              <button class="icon-btn ${isOn ? 'active' : ''}" data-action="power" title="Power">
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

          <div class="section-title">Orientation</div>
          <div class="control-row">
            <select class="dropdown" id="orientation">
              <option value="0">0° (Normal)</option>
              <option value="90">90°</option>
              <option value="180">180°</option>
              <option value="270">270°</option>
            </select>
          </div>
        </div>
      </ha-card>
    `;

    this.attachListeners();
  }

  attachListeners() {
    // Quick actions
    this.shadowRoot.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        switch(action) {
          case 'power':
            const sw = this.getRelatedEntity('switch');
            if (sw) this._hass.callService('switch', 'toggle', { entity_id: sw.entity_id });
            break;
          case 'clear':
            this.callService('ipixel_color', 'clear_pixels');
            break;
          case 'clock':
            this.callService('ipixel_color', 'set_clock_mode', { style: 1 });
            break;
          case 'sync':
            this.callService('ipixel_color', 'sync_time');
            break;
        }
      });
    });

    // Brightness
    const slider = this.shadowRoot.getElementById('brightness');
    if (slider) {
      slider.style.setProperty('--value', `${slider.value}%`);
      slider.addEventListener('input', (e) => {
        e.target.style.setProperty('--value', `${e.target.value}%`);
        this.shadowRoot.getElementById('brightness-val').textContent = `${e.target.value}%`;
      });
      slider.addEventListener('change', (e) => {
        this.callService('ipixel_color', 'set_brightness', { level: parseInt(e.target.value) });
      });
    }

    // Mode buttons
    this.shadowRoot.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        const modeEntity = this.getRelatedEntity('select', '_mode');
        if (modeEntity) {
          this._hass.callService('select', 'select_option', {
            entity_id: modeEntity.entity_id,
            option: mode,
          });
        }
        this.shadowRoot.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Orientation
    const orient = this.shadowRoot.getElementById('orientation');
    if (orient) {
      orient.addEventListener('change', (e) => {
        const orientEntity = this.getRelatedEntity('select', '_orientation');
        if (orientEntity) {
          this._hass.callService('select', 'select_option', {
            entity_id: orientEntity.entity_id,
            option: e.target.value,
          });
        }
      });
    }
  }

  static getConfigElement() { return document.createElement('ipixel-simple-editor'); }
  static getStubConfig() { return { entity: '' }; }
}
