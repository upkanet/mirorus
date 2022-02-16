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
        ctxd.fillStyle="white";
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

export {mousedown,mousemove,mouseup}