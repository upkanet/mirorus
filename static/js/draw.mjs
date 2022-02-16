const canvasd = document.getElementById('drawing');
const ctxd = canvasd.getContext('2d');
let activemouse = false;
let rectsize = 0;

function mousedown(e){
    activemouse = true;
    if(e.ctrlKey){
        console.log("erase");
        ctxd.fillStyle="black";
    }
    else{
        console.log("draw");
        ctxd.fillStyle=$(canvasd).data('drawingcolor');
    }
    rectsize = Number($('#rangeRectSize').val()) / 100 * canvasd.width / 10;
    ctxd.fillRect(e.offsetX,e.offsetY,rectsize,rectsize);
}

function mousemove(e){
    if(activemouse) ctxd.fillRect(e.offsetX,e.offsetY,rectsize,rectsize);
}

function mouseup(e){
    activemouse = false;
    ctxd.fillRect(e.offsetX,e.offsetY,rectsize,rectsize);
}

function init(){
    ctxd.fillRect(0,0,canvasd.width,canvasd.height);
    initGrid();
}

function initGrid(){
    console.log("Init Grid");
    const canvasg = document.getElementById('drawinggrid');
    const w = canvasg.width;
    const h = canvasg.height;
    const ctxg = canvasg.getContext('2d');
    ctxg.strokeStyle = "#375a7f";
    for(let i=1;i<10;i++){
        for(let j=1;j<10;j++){
            ctxg.moveTo(0,h/10*j);
            ctxg.lineTo(w,h/10*j);
            ctxg.moveTo(w/10*i,0);
            ctxg.lineTo(w/10*i,h);
        }
    }
    ctxg.stroke();
}

export {init,mousedown,mousemove,mouseup}