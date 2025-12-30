/**
 * iPIXEL Display Card - LED Matrix Preview
 */

import { iPIXELCardBase, iPIXELCardStyles } from '../ipixel-base.js';

export class iPIXELDisplayCard extends iPIXELCardBase {
  render() {
    if (!this._hass) return;

    const [width, height] = this.getResolution();
    const isOn = this.isOn();
    const entity = this.getEntity();
    const name = this._config.name || entity?.attributes?.friendly_name || 'iPIXEL Display';
    const pixelCount = Math.min(width * height, 2048);

    this.shadowRoot.innerHTML = `
      <style>${iPIXELCardStyles}
        .display-container {
          background: #000;
          border-radius: 8px;
          padding: 8px;
        }
        .display-grid {
          display: grid;
          grid-template-columns: repeat(${width}, 1fr);
          gap: 1px;
          background: #111;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: ${width}/${height};
        }
        .pixel {
          background: #1a1a1a;
          aspect-ratio: 1;
        }
        .pixel.on {
          background: var(--pixel-color, #ff6600);
          box-shadow: 0 0 2px var(--pixel-color, #ff6600);
        }
        .display-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 0.75em;
          opacity: 0.6;
        }
      </style>
      <ha-card>
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">
              <span class="status-dot ${isOn ? '' : 'off'}"></span>
              ${name}
            </div>
            <button class="icon-btn ${isOn ? 'active' : ''}" id="power-btn">
              <svg viewBox="0 0 24 24"><path d="M13,3H11V13H13V3M17.83,5.17L16.41,6.59C18.05,7.91 19,9.9 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12C5,9.9 5.95,7.91 7.59,6.59L6.17,5.17C4.23,6.82 3,9.26 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,9.26 19.77,6.82 17.83,5.17Z"/></svg>
            </button>
          </div>
          <div class="display-container">
            <div class="display-grid">
              ${Array(pixelCount).fill(0).map(() => `<div class="pixel ${isOn ? 'on' : ''}"></div>`).join('')}
            </div>
            <div class="display-footer">
              <span>${width} x ${height}</span>
              <span>${isOn ? 'Active' : 'Off'}</span>
            </div>
          </div>
        </div>
      </ha-card>
    `;

    this.shadowRoot.getElementById('power-btn')?.addEventListener('click', () => {
      const switchEntity = this.getRelatedEntity('switch');
      if (switchEntity) {
        this._hass.callService('switch', 'toggle', { entity_id: switchEntity.entity_id });
      }
    });
  }

  static getConfigElement() { return document.createElement('ipixel-simple-editor'); }
  static getStubConfig() { return { entity: '' }; }
}
