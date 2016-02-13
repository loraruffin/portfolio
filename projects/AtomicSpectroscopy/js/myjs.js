
function init(p){

    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = canvas.width;
	
    var canvasOffset=$("#canvas").offset();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;

    var isDown=false;

    var cx=canvas.width/2;
    var cy=canvas.height/2;
    var w;
    var h;
    var r=33;
	
	var element;
	

    var img=new Image();
    img.onload=function(){
        w=img.width/2;
        h=img.height/2;
        draw();
    }
    img.src="images/clock.gif";
	






    function draw(m){
        ctx.clearRect(0,0,canvas.width,canvas.height);
		//drawRect();
		drawDial();
		drawCircle();
		specHe(-2.8 * m);
        drawRotationHandle(true); 
    }
	
	
	 function drawCircle(){
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(0);
		ctx.fillRect(-10,-200,20,180);
		ctx.fillStyle="black";
		ctx.fill();
	
		ctx.beginPath();
		
	
		
		ctx.arc(0,0,110,0,2*Math.PI);
		ctx.stroke(); 
		
		ctx.moveTo(100,0);
		ctx.lineTo(120, 0);
		ctx.fillText("0",123,4);		
		ctx.stroke();
	
		ctx.beginPath();
		
	
		
		
		ctx.arc(0,0,120,0.25*Math.PI,1.75*Math.PI);
		ctx.moveTo(85,-85);
		ctx.lineTo(125,-125);
		ctx.moveTo(125,125);
		ctx.arc(0,0,177,0.25*Math.PI,1.75*Math.PI);
		ctx.moveTo(125,125);
		ctx.lineTo(85,85);	
		ctx.stroke(); 
			
		
        ctx.restore();
		specHe(0);
    }
	
	function specHe(x){
		//Helium
			if(p == 1){
			var sy = -cy  ;
			//var sx = canvas.width/2;
			var sh = 100;
			var sw = 2;
			ctx.save();
			ctx.translate(cx,cy);
			ctx.rotate(0);
			ctx.fillStyle="black";      
			ctx.fillRect(x-400,sy,sw+800,sh);
			//yellow
			ctx.fillStyle="#FFFF66";      
			ctx.fillRect(x,sy,sw+2,sh);
			//purple
			ctx.fillStyle="#A352CC";      
			ctx.fillRect(x+117,sy,sw,sh);
			
			//purple
			ctx.fillStyle="#A352CC";      
			ctx.fillRect(x+124 ,sy,sw,sh);
			
			//blue
			ctx.fillStyle="#1947D1";
			ctx.fillRect(x+130,sy,sw,sh);
			
			//green
			ctx.fillStyle="#00FF99";      
			ctx.fillRect(x+136 ,sy,sw,sh);
			
			//green
			ctx.fillStyle="#00FF99";      
			ctx.fillRect(x+140 ,sy,sw,sh);
			
			//yellow
			ctx.fillStyle="yellow";      
			ctx.fillRect(x+164,sy,sw,sh);
			
			//red
			ctx.fillStyle="#E62E2E";      
			ctx.fillRect(x+ 188 ,sy,sw,sh);
			
			//red
			ctx.fillStyle="red";      
			ctx.fillRect(x+ 198 ,sy,sw,sh);

			ctx.restore();
		} else {
				//Hydrogen
				var sy = -cy ;
				//var sx = canvas.width/2;
				var sh = 100;
				var sw = 2;
				ctx.save();
				ctx.translate(cx,cy);
				ctx.rotate(0);
				ctx.fillStyle="black";      
				ctx.fillRect(x-400,sy,sw+800,sh);
			
				//purple
				ctx.fillStyle="#A352CC";      
				ctx.fillRect(x+117,sy,sw,sh);
		
				//blue
				ctx.fillStyle="#1947D1";
				ctx.fillRect(x+124,sy,sw,sh);
					
				//green
				ctx.fillStyle="#00FF99";      
				ctx.fillRect(x+135 ,sy,sw,sh);
					
				//red
				ctx.fillStyle="red";      
				ctx.fillRect(x+ 184 ,sy,sw,sh);

				ctx.restore();
		}
    }




    function drawDial(){
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(r);
        ctx.drawImage(img,0,0,img.width,img.height,-w/2,-h/2,w,h);
        ctx.restore();
    }

    function drawRotationHandle(withFill){
        ctx.save();
        ctx.translate(cx,cy);
        ctx.rotate(r);
        ctx.beginPath();
        ctx.moveTo(0,-10);
		ctx.lineTo(w/2,-10);
        ctx.lineTo(w/2,-10);
        ctx.lineTo(w/2,10);
        ctx.lineTo(w/2,10);
		ctx.lineTo(0,10);
		ctx.moveTo(0,-1);
        ctx.lineTo(w/2+20,-1);
        ctx.lineTo(w/2+20,-7);
        ctx.lineTo(w/2+30,-7);
        ctx.lineTo(w/2+30,7);
        ctx.lineTo(w/2+20,7);
        ctx.lineTo(w/2+20,1);
        ctx.lineTo(0,1);
        ctx.closePath();
		
        if(withFill){
            ctx.fillStyle="black";
            ctx.fill();
        }
        ctx.restore();
    }

    function handleMouseDown(e){
      mouseX=parseInt(e.clientX-offsetX);
      mouseY=parseInt(e.clientY-offsetY);
      drawRotationHandle(false);
      isDown=ctx.isPointInPath(mouseX,mouseY);
      console.log(isDown);

    }

    function handleMouseUp(e){
      isDown=false;
    }

    function handleMouseOut(e){
      isDown=false;
    }

    function handleMouseMove(e){
      if(!isDown){return;}

      mouseX=parseInt(e.clientX-offsetX);
      mouseY=parseInt(e.clientY-offsetY);
      var dx=mouseX-cx;
      var dy=mouseY-cy;
      r=Math.atan2(dy,dx);

      draw(dx);
    }

    $("#canvas").mousedown(function(e){handleMouseDown(e);});
    $("#canvas").mousemove(function(e){handleMouseMove(e);});
    $("#canvas").mouseup(function(e){handleMouseUp(e);});
    $("#canvas").mouseout(function(e){handleMouseOut(e);});
	
	
	

} // end $(function(){});
