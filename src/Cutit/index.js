class Cutit {
  constructor(props) {
    let { canvas } = props;
    this.canvas = {
      element: canvas,
      context: canvas.getContext('2d'),
    };
    this.image = false;
    this.points = [];
    this.settings = {
      view: {
        styles: {
          color: '#000',
        },
      },
    };
    this.init();
  }

  init() {
    this.listeners();
    this.render();
  }

  listeners() {
    let { element } = this.canvas;
    window.addEventListener('resize', (event) => {
      this.resize();
    });
    element.addEventListener('click', (event) => {
      this.addPoint(event);
    });
  }

  addPoint(event) {
    let { image, points } = this;
    if (!image) return;
    points.push({
      x: event.layerX,
      y: event.layerY,
    });
  }

  render() {
    this.drawBackground();
    this.drawImage();
    this.drawPoints();
    requestAnimationFrame(this.render.bind(this));
  }

  drawBackground() {
    let { canvas, settings } = this,
      { view } = settings,
      { context, element } = canvas,
      { background } = view.styles,
      ratio = window.devicePixelRatio || 1;
    element.width = element.clientWidth * ratio;
    element.height = element.clientHeight * ratio;
    context.scale(ratio, ratio);
    context.fillStyle = background;
    context.fillRect(0, 0, element.width, element.height);
  }

  resize() {
    let { canvas, image } = this;
    if (!image) return;
    let imageProportion = image.element.height / image.element.width;
    canvas.element.height = canvas.element.width * imageProportion;
  }

  drawImage() {
    let { image, canvas } = this,
      { context, element } = canvas;
    if (!image) return;
    context.drawImage(
      image.element.target,
      0,
      0,
      element.clientWidth,
      element.clientHeight
    );
  }

  drawPoints() {
    let { points, canvas } = this,
      { context, element } = canvas;
    for(let i = 0; i <= points.length - 1; i++){
      let point = points[i];

      context.beginPath();
      context.arc(point.x, point.y, 6, 0, 2 * Math.PI, false);
      context.fillStyle = '#ffffff80';
      context.fill();
      context.lineWidth = 0;
      context.strokeStyle = 'transparent';
      context.stroke();

      context.beginPath();
      context.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
      context.fillStyle = 'white';
      context.fill();
      context.lineWidth = 0;
      context.strokeStyle = 'transparent';
      context.stroke();

    }
  }

  setImage(event) {
    let { context, element } = this.canvas;
    if (!event) return;
    let file = event.target.files[0],
      fileResult = {};
    if (!file) return;
    new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function () {
        let base64 = btoa(reader.result),
          image = new Image();
        base64 = 'data:' + file.type + ';base64,' + base64;
        image.src = base64;
        image.onload = (event) => {
          fileResult = {
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64,
            element: {
              target: event.target,
              width: event.target.naturalWidth,
              height: event.target.naturalHeight,
            },
          };
          resolve(fileResult);
        };
      };
    }).then((resp) => {
      this.image = resp;
      this.resize();
    });
  }
}

export default Cutit;
