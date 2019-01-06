export class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.accelerate = false;
    this.speed = 0;
    this.steer = 0;
    this.direction = 0;
    const carDiv = document.createElement('div');
    carDiv.id = 'carId';
    carDiv.style.width = '100px';
    carDiv.style.height = '100px';
    carDiv.style.position = 'absolute';
    carDiv.style.left = `${x}px`;
    carDiv.style.top = `${y}px`;
    carDiv.style.backgroundColor = 'red';
    document.body.appendChild(carDiv);
    this.elem = document.getElementById('carId');
    // Key of the refresh
    this.refreshInterval = window.setInterval(this.refreshState.bind(this), 100);
  }

  setState(state) {
    this.accelerate = state.accelerate || 0;
    this.steer = state.steer || 0;
    this.direction = state.direction || 0;
    this.refreshState();
  }

  refreshState() {
    if (this.accelerate) {
      if (this.speed < 20) {
        this.speed += 3;
      }
    } else {
      if (this.speed > 0) {
        this.speed -= 3;
      }
    }
    this.x += this.speed;
    this.setPositon();
    this.setAngle();
  }

  setAngle() {
    anime({
      targets: this.elem,
      rotate: {
        value: this.direction,
      },
      duration: 500,
      loop: false,
    });
  }

  setPositon() {
    this.elem.style.left = `${this.x}px`;
    this.elem.style.top = `${this.y}px`;
  }

  destroy() {
    document.body.removeChild(this.elem);
    window.clearInterval(this.refreshInterval);
  }
}
