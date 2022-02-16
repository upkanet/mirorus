class Drawing{
    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.activemouse = false;
        this.rectsize = 0;
    }

    mousedown(e){
        this.activemouse = true;
        if(e.ctrlKey){
            console.log("erase");
            this.ctx.fillStyle="black";
        }
        else{
            console.log("draw");
            this.ctx.fillStyle=$(this.canvas).data('drawingcolor');
        }
        this.rectsize = Number($('#rangeRectSize').val()) / 100 * this.canvas.width / 10;
        this.fillRect(e);
    }
    
    mousemove(e){
        if(this.activemouse) this.fillRect(e);
    }

    mouseup(e){
        this.activemouse = false;
        this.fillRect(e);
    }

    fillRect(e){
        this.ctx.fillRect(e.offsetX-this.rectsize/2,e.offsetY-this.rectsize/2,this.rectsize,this.rectsize);
    }

    selectColor(e){
        let color = $(e.target).data('color');
        $(this.canvas).data('drawingcolor',color);
    }
    
    full(color){
        this.ctx.fillStyle=color;
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    }

    fullfield(){
        this.full("white");
    }

    delete(){
        if(confirm("Delete everything")) this.full("black");
    }

    init(){
        this.full("black");
        initGrid();
    }

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

let draw = new Drawing('drawing');

export {draw}