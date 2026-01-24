/**
 * Canvas-based LED Matrix Renderer
 * High-performance replacement for SVG renderer
 * Uses ImageData for direct pixel manipulation
 */

import { EffectManager, EFFECTS } from './effects/index.js';

/**
 * Canvas LED Matrix Renderer
 * Much faster than SVG for pixel-level updates
 */
export class CanvasLEDRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.width = options.width || 64;
    this.height = options.height || 16;
    this.pixelGap = options.pixelGap || 0.15;
    this.glowEnabled = options.glow !== false;

    // Scale factor for crisp LED pixels
    this.scale = options.scale || 8;

    // Buffers
    this.buffer = [];
    this._initBuffer();

    // Extended pixels for scrolling
    this._colorPixels = [];
    this._extendedColorPixels = [];
    this.extendedWidth = this.width;

    // Animation state
    this.effect = 'fixed';
    this.speed = 50;
    this.animationId = null;
    this.lastFrameTime = 0;
    this._isRunning = false;

    // Canvas elements
    this._canvas = null;
    this._ctx = null;
    this._glowCanvas = null;
    this._glowCtx = null;
    this._wrapper = null;
    this._canvasCreated = false;

    // Effect manager
    this.effectManager = new EffectManager(this);
  }

  _initBuffer() {
    this.buffer = [];
    for (let i = 0; i < this.width * this.height; i++) {
      this.buffer.push([0, 0, 0]);
    }
  }

  /**
   * Create the canvas elements
   */
  _createCanvas() {
    const canvasWidth = this.width * this.scale;
    const canvasHeight = this.height * this.scale;

    // Create wrapper for layering
    this._wrapper = document.createElement('div');
    this._wrapper.style.cssText = `
      position: relative;
      width: 100%;
      aspect-ratio: ${this.width} / ${this.height};
      background: #0a0a0a;
      border-radius: 4px;
      overflow: hidden;
    `;

    // Glow layer (behind main canvas, blurred)
    if (this.glowEnabled) {
      this._glowCanvas = document.createElement('canvas');
      this._glowCanvas.width = canvasWidth;
      this._glowCanvas.height = canvasHeight;
      this._glowCanvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        filter: blur(${this.scale * 0.8}px);
        opacity: 0.6;
        image-rendering: pixelated;
      `;
      this._glowCtx = this._glowCanvas.getContext('2d', { alpha: false });
      this._wrapper.appendChild(this._glowCanvas);
    }

    // Main canvas
    this._canvas = document.createElement('canvas');
    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this._canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    `;
    this._ctx = this._canvas.getContext('2d', { alpha: false });
    this._ctx.imageSmoothingEnabled = false;
    this._wrapper.appendChild(this._canvas);

    // Attach to container
    if (this.container && this.container.isConnected !== false) {
      this.container.innerHTML = '';
      this.container.appendChild(this._wrapper);
    }

    this._canvasCreated = true;
  }

  /**
   * Ensure canvas is in the container
   */
  _ensureCanvasInContainer() {
    if (!this.container) return false;

    if (this._wrapper && this._wrapper.parentNode === this.container) {
      return true;
    }

    if (this._wrapper && this.container.isConnected !== false) {
      this.container.innerHTML = '';
      this.container.appendChild(this._wrapper);
      return true;
    }

    return false;
  }

  /**
   * Set pixel in buffer
   */
  setPixel(x, y, color) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const idx = y * this.width + x;
      if (idx < this.buffer.length) {
        this.buffer[idx] = color;
      }
    }
  }

  /**
   * Clear buffer to black
   */
  clear() {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = [0, 0, 0];
    }
  }

  /**
   * Flush buffer to canvas - the main rendering function
   */
  flush() {
    if (!this._canvasCreated) {
      this._createCanvas();
    } else if (!this._ensureCanvasInContainer()) {
      this._createCanvas();
    }

    const ctx = this._ctx;
    const scale = this.scale;
    const gap = Math.max(1, Math.floor(scale * this.pixelGap));
    const pixelSize = scale - gap;
    const cornerRadius = Math.max(1, Math.floor(scale * 0.15));

    // Clear to dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    // Draw pixels
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const color = this.buffer[idx];

        if (!color || !Array.isArray(color)) continue;

        const [r, g, b] = color;
        const px = x * scale;
        const py = y * scale;

        ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

        // Draw rounded rect for LED pixel look
        this._roundRect(ctx, px, py, pixelSize, pixelSize, cornerRadius);
      }
    }

    // Update glow layer
    if (this.glowEnabled && this._glowCtx) {
      this._glowCtx.drawImage(this._canvas, 0, 0);
    }
  }

  /**
   * Draw a rounded rectangle
   */
  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Set pixel data from color string array
   */
  setData(pixels, extendedPixels = null, extendedWidth = null) {
    this._colorPixels = pixels || [];

    if (extendedPixels) {
      this._extendedColorPixels = extendedPixels;
      this.extendedWidth = extendedWidth || this.width;
    } else {
      this._extendedColorPixels = pixels || [];
      this.extendedWidth = this.width;
    }
  }

  /**
   * Set animation effect and speed
   */
  setEffect(effect, speed = 50) {
    const wasRunning = this._isRunning;

    if (this.effect !== effect) {
      this.effect = effect;
      this.effectManager.initEffect(effect, { speed });
    }

    this.speed = speed;

    if (wasRunning && effect !== 'fixed') {
      this.start();
    }
  }

  /**
   * Start the animation loop
   */
  start() {
    if (this._isRunning) return;
    this._isRunning = true;
    this.lastFrameTime = performance.now();
    this._animate();
  }

  /**
   * Stop the animation loop
   */
  stop() {
    this._isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Check if animation is running
   */
  get isRunning() {
    return this._isRunning;
  }

  /**
   * Animation loop
   */
  _animate() {
    if (!this._isRunning) return;

    const now = performance.now();

    // Frame interval based on speed (1 = slow ~500ms, 100 = fast ~30ms)
    const frameInterval = 500 - (this.speed - 1) * 4.7;

    if (now - this.lastFrameTime >= frameInterval) {
      this.lastFrameTime = now;
      this.effectManager.step();
    }

    this._renderFrame();
    this.animationId = requestAnimationFrame(() => this._animate());
  }

  /**
   * Render current frame to buffer and flush
   */
  _renderFrame() {
    this.effectManager.render(
      this._colorPixels,
      this._extendedColorPixels,
      this.extendedWidth
    );
    this.flush();
  }

  /**
   * Render a single static frame
   */
  renderStatic() {
    if (!this._canvasCreated) {
      this._createCanvas();
    }
    this._renderFrame();
  }

  /**
   * Update dimensions
   */
  setDimensions(width, height) {
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.extendedWidth = width;
      this._initBuffer();
      this._canvasCreated = false;

      this.effectManager = new EffectManager(this);
      if (this.effect !== 'fixed') {
        this.effectManager.initEffect(this.effect, { speed: this.speed });
      }
    }
  }

  /**
   * Update container reference
   */
  setContainer(container) {
    if (container !== this.container) {
      this.container = container;
      if (this._wrapper && container) {
        container.innerHTML = '';
        container.appendChild(this._wrapper);
      }
    }
  }

  /**
   * Destroy renderer and clean up
   */
  destroy() {
    this.stop();
    this._canvas = null;
    this._ctx = null;
    this._glowCanvas = null;
    this._glowCtx = null;
    this._wrapper = null;
    this._canvasCreated = false;
  }
}

/**
 * High-performance Canvas renderer using ImageData
 * Even faster for full-frame updates (complex effects)
 */
export class ImageDataLEDRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.width = options.width || 64;
    this.height = options.height || 16;
    this.pixelGap = options.pixelGap || 0.15;
    this.glowEnabled = options.glow !== false;

    // Scale factor
    this.scale = options.scale || 8;

    // Buffer (RGB array)
    this.buffer = [];
    this._initBuffer();

    // Extended pixels for scrolling
    this._colorPixels = [];
    this._extendedColorPixels = [];
    this.extendedWidth = this.width;

    // Animation state
    this.effect = 'fixed';
    this.speed = 50;
    this.animationId = null;
    this.lastFrameTime = 0;
    this._isRunning = false;

    // Canvas elements
    this._canvas = null;
    this._ctx = null;
    this._imageData = null;
    this._glowCanvas = null;
    this._glowCtx = null;
    this._wrapper = null;
    this._canvasCreated = false;

    // Pre-computed pixel template
    this._pixelTemplate = null;

    // Effect manager
    this.effectManager = new EffectManager(this);
  }

  _initBuffer() {
    this.buffer = [];
    for (let i = 0; i < this.width * this.height; i++) {
      this.buffer.push([0, 0, 0]);
    }
  }

  /**
   * Create canvas and pre-compute pixel template
   */
  _createCanvas() {
    const canvasWidth = this.width * this.scale;
    const canvasHeight = this.height * this.scale;

    // Create wrapper
    this._wrapper = document.createElement('div');
    this._wrapper.style.cssText = `
      position: relative;
      width: 100%;
      aspect-ratio: ${this.width} / ${this.height};
      background: #0a0a0a;
      border-radius: 4px;
      overflow: hidden;
    `;

    // Glow layer
    if (this.glowEnabled) {
      this._glowCanvas = document.createElement('canvas');
      this._glowCanvas.width = canvasWidth;
      this._glowCanvas.height = canvasHeight;
      this._glowCanvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        filter: blur(${this.scale * 0.6}px);
        opacity: 0.5;
      `;
      this._glowCtx = this._glowCanvas.getContext('2d', { alpha: false });
      this._wrapper.appendChild(this._glowCanvas);
    }

    // Main canvas
    this._canvas = document.createElement('canvas');
    this._canvas.width = canvasWidth;
    this._canvas.height = canvasHeight;
    this._canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    `;
    this._ctx = this._canvas.getContext('2d', { alpha: false });
    this._wrapper.appendChild(this._canvas);

    // Create ImageData buffer
    this._imageData = this._ctx.createImageData(canvasWidth, canvasHeight);

    // Pre-compute pixel mask template
    this._createPixelTemplate();

    // Fill background
    this._fillBackground();

    // Attach to container
    if (this.container && this.container.isConnected !== false) {
      this.container.innerHTML = '';
      this.container.appendChild(this._wrapper);
    }

    this._canvasCreated = true;
  }

  /**
   * Create a template mask for LED pixels (with gaps and rounded corners)
   */
  _createPixelTemplate() {
    const scale = this.scale;
    const gap = Math.max(1, Math.floor(scale * this.pixelGap));
    const pixelSize = scale - gap;
    const radius = Math.max(1, Math.floor(scale * 0.15));

    // Template for one LED pixel
    this._pixelTemplate = [];

    for (let py = 0; py < scale; py++) {
      for (let px = 0; px < scale; px++) {
        // Check if inside the rounded rect
        let inside = false;

        if (px < pixelSize && py < pixelSize) {
          // Check corners
          if (px < radius && py < radius) {
            // Top-left corner
            const dx = radius - px;
            const dy = radius - py;
            inside = (dx * dx + dy * dy) <= (radius * radius);
          } else if (px >= pixelSize - radius && py < radius) {
            // Top-right corner
            const dx = px - (pixelSize - radius - 1);
            const dy = radius - py;
            inside = (dx * dx + dy * dy) <= (radius * radius);
          } else if (px < radius && py >= pixelSize - radius) {
            // Bottom-left corner
            const dx = radius - px;
            const dy = py - (pixelSize - radius - 1);
            inside = (dx * dx + dy * dy) <= (radius * radius);
          } else if (px >= pixelSize - radius && py >= pixelSize - radius) {
            // Bottom-right corner
            const dx = px - (pixelSize - radius - 1);
            const dy = py - (pixelSize - radius - 1);
            inside = (dx * dx + dy * dy) <= (radius * radius);
          } else {
            inside = true;
          }
        }

        this._pixelTemplate.push(inside);
      }
    }
  }

  /**
   * Fill ImageData with background color
   */
  _fillBackground() {
    const data = this._imageData.data;
    const bgR = 10, bgG = 10, bgB = 10;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = bgR;
      data[i + 1] = bgG;
      data[i + 2] = bgB;
      data[i + 3] = 255;
    }
  }

  _ensureCanvasInContainer() {
    if (!this.container) return false;

    if (this._wrapper && this._wrapper.parentNode === this.container) {
      return true;
    }

    if (this._wrapper && this.container.isConnected !== false) {
      this.container.innerHTML = '';
      this.container.appendChild(this._wrapper);
      return true;
    }

    return false;
  }

  setPixel(x, y, color) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      const idx = y * this.width + x;
      if (idx < this.buffer.length) {
        this.buffer[idx] = color;
      }
    }
  }

  clear() {
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] = [0, 0, 0];
    }
  }

  /**
   * Flush buffer to canvas using ImageData (fastest method)
   */
  flush() {
    if (!this._canvasCreated) {
      this._createCanvas();
    } else if (!this._ensureCanvasInContainer()) {
      this._createCanvas();
    }

    const data = this._imageData.data;
    const scale = this.scale;
    const canvasWidth = this.width * scale;
    const template = this._pixelTemplate;
    const bgR = 10, bgG = 10, bgB = 10;

    // Update each LED pixel
    for (let ledY = 0; ledY < this.height; ledY++) {
      for (let ledX = 0; ledX < this.width; ledX++) {
        const bufferIdx = ledY * this.width + ledX;
        const color = this.buffer[bufferIdx];

        if (!color || !Array.isArray(color)) continue;

        const r = Math.round(color[0]);
        const g = Math.round(color[1]);
        const b = Math.round(color[2]);

        const baseX = ledX * scale;
        const baseY = ledY * scale;

        // Fill in the scaled pixel using template
        for (let py = 0; py < scale; py++) {
          for (let px = 0; px < scale; px++) {
            const templateIdx = py * scale + px;
            const canvasIdx = ((baseY + py) * canvasWidth + (baseX + px)) * 4;

            if (template[templateIdx]) {
              data[canvasIdx] = r;
              data[canvasIdx + 1] = g;
              data[canvasIdx + 2] = b;
              data[canvasIdx + 3] = 255;
            } else {
              data[canvasIdx] = bgR;
              data[canvasIdx + 1] = bgG;
              data[canvasIdx + 2] = bgB;
              data[canvasIdx + 3] = 255;
            }
          }
        }
      }
    }

    // Put ImageData to canvas (single draw call!)
    this._ctx.putImageData(this._imageData, 0, 0);

    // Update glow layer
    if (this.glowEnabled && this._glowCtx) {
      this._glowCtx.drawImage(this._canvas, 0, 0);
    }
  }

  setData(pixels, extendedPixels = null, extendedWidth = null) {
    this._colorPixels = pixels || [];

    if (extendedPixels) {
      this._extendedColorPixels = extendedPixels;
      this.extendedWidth = extendedWidth || this.width;
    } else {
      this._extendedColorPixels = pixels || [];
      this.extendedWidth = this.width;
    }
  }

  setEffect(effect, speed = 50) {
    const wasRunning = this._isRunning;

    if (this.effect !== effect) {
      this.effect = effect;
      this.effectManager.initEffect(effect, { speed });
    }

    this.speed = speed;

    if (wasRunning && effect !== 'fixed') {
      this.start();
    }
  }

  start() {
    if (this._isRunning) return;
    this._isRunning = true;
    this.lastFrameTime = performance.now();
    this._animate();
  }

  stop() {
    this._isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  get isRunning() {
    return this._isRunning;
  }

  _animate() {
    if (!this._isRunning) return;

    const now = performance.now();
    const frameInterval = 500 - (this.speed - 1) * 4.7;

    if (now - this.lastFrameTime >= frameInterval) {
      this.lastFrameTime = now;
      this.effectManager.step();
    }

    this._renderFrame();
    this.animationId = requestAnimationFrame(() => this._animate());
  }

  _renderFrame() {
    this.effectManager.render(
      this._colorPixels,
      this._extendedColorPixels,
      this.extendedWidth
    );
    this.flush();
  }

  renderStatic() {
    if (!this._canvasCreated) {
      this._createCanvas();
    }
    this._renderFrame();
  }

  setDimensions(width, height) {
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.extendedWidth = width;
      this._initBuffer();
      this._canvasCreated = false;

      this.effectManager = new EffectManager(this);
      if (this.effect !== 'fixed') {
        this.effectManager.initEffect(this.effect, { speed: this.speed });
      }
    }
  }

  setContainer(container) {
    if (container !== this.container) {
      this.container = container;
      if (this._wrapper && container) {
        container.innerHTML = '';
        container.appendChild(this._wrapper);
      }
    }
  }

  destroy() {
    this.stop();
    this._canvas = null;
    this._ctx = null;
    this._imageData = null;
    this._glowCanvas = null;
    this._glowCtx = null;
    this._wrapper = null;
    this._canvasCreated = false;
    this._pixelTemplate = null;
  }
}

// Export the fastest renderer as default
export { ImageDataLEDRenderer as LEDMatrixRenderer };
