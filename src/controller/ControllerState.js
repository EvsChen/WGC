class ControllerState {
  /**
   * constructor for the ControllerState
   * @param {object} config
   * @param {number} config.updateFrequency
   * @param {any} config.emitter
   * @param {number} config.innerHeight
   * @param {number} config.innerWidth
   */
  constructor(config) {
    this.type = '';
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.touchX = 0;
    this.touchY = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.xAcce = 0;
    this.yAcce = 0;
    this.zAcce = 0;
    this._xVel = 0;
    this._yVel = 0;
    this._zVel = 0;
    this.innerHeight = config.innerHeight || 100;
    this.innerWidth = config.innerWidth || 100;
    this._freq = config.updateFrequency || 50;
    this._freq /= 1000;
    this._lastUpdate = 0;
    this._acceThreshold = 0.5;
    this.listeners = {};
  }

  handleEvent(e) {
    if (!e) return;
    this.type = e.type;
    switch (e.type) {
      case 'devicemotion':
        this.handleDeviceMotion(e);
        break;
      default:
        console.log(e);
    };
  }

  handleDeviceMotion(e) {
    const {x, y, z} = e.acceleration;
    const threshold = this._acceThreshold;
    if (Math.abs(x) > threshold
        || Math.abs(y) > threshold
        || Math.abs(z) > threshold
    ) {
      this.xAcce = x;
      this.yAcce = y;
      this.zAcce = z;
      this.dispatch('update');
    }
  }

  on(evt, func) {
    this.listeners[evt] = func;
  }

  dispatch(evt, ...args) {
    if (this.listeners[evt]) {
      this.listeners[evt](...args);
    }
  }

  /**
   * set the start position of the touches
   * @param {number} x
   * @param {number} y
   */
  setTouchStartPosition(x, y) {
    this.touchX = x;
    this.touchStartX = x;
    this.touchY = y;
    this.touchStartY = y;
  }

  /**
   * set the position of the touches
   * @param {number} x
   * @param {number} y
   */
  setTouchPosition(x, y) {
    this.touchX = x;
    this.touchY = y;
  }

  resetTouchPosition() {
    this.touchX = this.touchY = 0;
    this.touchStartX = this.touchStartY = 0;
  }

  getPercentageTouchOffset() {
    const halfWidth = this.innerWidth / 2;
    const halfHeight = this.innerHeight / 2;
    const offsetX = (this.touchX - halfWidth) / halfWidth;
    const offsetY = (this.touchY - halfHeight) / halfHeight;
    return {offsetX, offsetY};
  }

  /**
   * set the frequency that the controller reports data
   * @param {number} freq
   */
  setFrequency(freq) {
    this._freq = freq / 1000;
  }

  /**
   * set the acceleration of the controller
   * @param {number} xAcce
   * @param {number} yAcce
   * @param {number} zAcce
   */
  setAcceleration(xAcce, yAcce, zAcce) {
    const threshold = this._acceThreshold;
    if (xAcce < threshold && yAcce < threshold && zAcce < threshold) return;
    this.xAcce = xAcce;
    this.yAcce = yAcce;
    this.zAcce = zAcce;
  }

  /**
   * reset everything except frequency
   */
  reset() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.xAcce = 0;
    this.yAcce = 0;
    this.zAcce = 0;
    this._xVel = 0;
    this._yVel = 0;
    this._zVel = 0;
  }

  resetPos() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  /**
   * @return {Object} position
   * @return {number} position.x
   * @return {number} position.y
   * @return {number} position.z
   */
  getPos() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }
  
  /**
   * @return {Object} accleration
   * @return {number} position.xAcce
   * @return {number} position.yAcce
   * @return {number} position.zAcce
   */
  getAcceleration() {
    return {
      xAcce: this.xAcce,
      yAcce: this.yAcce,
      zAcce: this.zAcce,
    };
  }
}

export default ControllerState;
