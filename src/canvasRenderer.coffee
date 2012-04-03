
class CanvasRenderer
	constructor: (canvas_id)->
		@canvas = document.getElementById(canvas_id)
		@ctx = @canvas.getContext("2d");
		@ctx.lineWidth = 1;
		@ctx.strokeStyle = "black";
		@ctx.fillStyle = "#8ED6FF";

	moveTo: (x,y) ->
		@ctx.moveTo(x,y);
		this


	roundedRect: (width,height,radius) ->
        @ctx.beginPath();
        @ctx.moveTo(0,radius);
        @ctx.lineTo(0,height-radius);
        @ctx.quadraticCurveTo(0,height,radius,height);
        @ctx.lineTo(width-radius,height);
        @ctx.quadraticCurveTo(width,height,width,height-radius);
        @ctx.lineTo(width,radius);
        @ctx.quadraticCurveTo(width,0,width-radius,0);
        @ctx.lineTo(radius,0);
        @ctx.quadraticCurveTo(0,0,0,radius);
    

    roundedRectTop: (width,height,radius) ->
        @ctx.beginPath();
        @ctx.moveTo(0,radius);
        @ctx.lineTo(0,height*0.4);
        @ctx.bezierCurveTo(width*0.25,height*0.5, width*0.75,height*0.5, width,height*0.4);
        @ctx.lineTo(width,radius);
        @ctx.quadraticCurveTo(width,0,width-radius,0);
        @ctx.lineTo(radius,0);
        @ctx.quadraticCurveTo(0,0,0,radius);

    roundedRectBottom: (width,height,radius) ->
        @ctx.beginPath();
        @ctx.moveTo(0,height*0.6);
        @ctx.lineTo(0,height-radius);
        @ctx.quadraticCurveTo(0,height,radius,height);
        @ctx.lineTo(width-radius,height);
        @ctx.quadraticCurveTo(width,height,width,height-radius);
        @ctx.lineTo(width,height*0.6);
        @ctx.bezierCurveTo(width*0.25,height*0.5, width*0.75,height*0.5, 0,height*0.6);

window.CanvasRenderer = CanvasRenderer