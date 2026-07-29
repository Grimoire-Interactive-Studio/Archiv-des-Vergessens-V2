/**
 * GameLoop Engine: Framerate-unabhängiger Delta-Time Loop
 */

export class GameLoop {
  constructor({ onTick, logicIntervalMs = 100 }) {
    this._onTick = onTick;
    this._logicInterval = logicIntervalMs;
    this._running = false;
    this._lastTimestamp = 0;
    this._accumulator = 0;
    this._frameId = null;
    this._boundTick = this._tick.bind(this);
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._lastTimestamp = performance.now();
    this._accumulator = 0;
    this._frameId = requestAnimationFrame(this._boundTick);
  }

  stop() {
    if (!this._running) return;
    this._running = false;
    if (this._frameId !== null) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
  }

  _tick(timestamp) {
    if (!this._running) return;

    let delta = timestamp - this._lastTimestamp;
    this._lastTimestamp = timestamp;

    // Delta-Kapping gegen Anti-Speed-Hack und Tab-Switch Lag Spike (max 1 Sekunde per Frame)
    if (delta > 1000) {
      delta = 1000;
    }

    this._accumulator += delta;

    while (this._accumulator >= this._logicInterval) {
      if (this._onTick) {
        this._onTick(this._logicInterval);
      }
      this._accumulator -= this._logicInterval;
    }

    this._frameId = requestAnimationFrame(this._boundTick);
  }

  isRunning() {
    return this._running;
  }
}

export default GameLoop;
