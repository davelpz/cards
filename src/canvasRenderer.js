(function() {
  var CanvasRenderer;

  CanvasRenderer = (function() {

    function CanvasRenderer(canvas_id) {
      this.canvas = document.getElementById(canvas_id);
      this.ctx = this.canvas.getContext("2d");
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "black";
      this.ctx.fillStyle = "#8ED6FF";
    }

    CanvasRenderer.prototype.moveTo = function(x, y) {
      this.ctx.moveTo(x, y);
      return this;
    };

    CanvasRenderer.prototype.roundedRect = function(width, height, radius) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, radius);
      this.ctx.lineTo(0, height - radius);
      this.ctx.quadraticCurveTo(0, height, radius, height);
      this.ctx.lineTo(width - radius, height);
      this.ctx.quadraticCurveTo(width, height, width, height - radius);
      this.ctx.lineTo(width, radius);
      this.ctx.quadraticCurveTo(width, 0, width - radius, 0);
      this.ctx.lineTo(radius, 0);
      return this.ctx.quadraticCurveTo(0, 0, 0, radius);
    };

    CanvasRenderer.prototype.roundedRectTop = function(width, height, radius) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, radius);
      this.ctx.lineTo(0, height * 0.4);
      this.ctx.bezierCurveTo(width * 0.25, height * 0.5, width * 0.75, height * 0.5, width, height * 0.4);
      this.ctx.lineTo(width, radius);
      this.ctx.quadraticCurveTo(width, 0, width - radius, 0);
      this.ctx.lineTo(radius, 0);
      return this.ctx.quadraticCurveTo(0, 0, 0, radius);
    };

    CanvasRenderer.prototype.roundedRectBottom = function(width, height, radius) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, height * 0.6);
      this.ctx.lineTo(0, height - radius);
      this.ctx.quadraticCurveTo(0, height, radius, height);
      this.ctx.lineTo(width - radius, height);
      this.ctx.quadraticCurveTo(width, height, width, height - radius);
      this.ctx.lineTo(width, height * 0.6);
      return this.ctx.bezierCurveTo(width * 0.25, height * 0.5, width * 0.75, height * 0.5, 0, height * 0.6);
    };

    return CanvasRenderer;

  })();

  window.CanvasRenderer = CanvasRenderer;

}).call(this);
