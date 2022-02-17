class Drawing{
    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.activemouse = false;
        this.activecursor = false;
    }

    get w(){
        return this.canvas.width;
    }

    get h(){
        return this.canvas.height;
    }

    get nbpix(){
        return this.w * this.h;
    }

    get rectsize(){
        return Number($('#rangeRectSize').val()) / 100 * this.w / 10;
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
        this.fillRect(e);
    }
    
    mousemove(e){
        if(this.activemouse) this.fillRect(e);
        if(this.activecursor) this.movecursor(e);
    }

    mouseup(e){
        this.activemouse = false;
        this.fillRect(e);
    }

    mouseover(e){
        this.enablecursor();
    }

    mouseout(e){
        this.disablecursor();
    }

    enablecursor(){
        this.activecursor = true;
        $('#cursor').show();
    }

    disablecursor(){
        this.activecursor = false;
        $('#cursor').hide();
    }

    movecursor(e){
        let rs = this.rectsize;
        $('#cursor').css('left',e.clientX - rs / 2);
        $('#cursor').css('top',e.clientY - rs / 2);
        $('#cursor').css('width',rs);
        $('#cursor').css('height',rs);
    }

    fillRect(e){
        this.ctx.fillRect(e.offsetX-this.rectsize/2,e.offsetY-this.rectsize/2,this.rectsize,this.rectsize);
    }

    selectColor(e){
        let color = $(e.target).data('color');
        $(this.canvas).data('drawingcolor',color);
        $('#cursor').css('border-color',color);
    }
    
    full(color){
        this.ctx.fillStyle=color;
        this.ctx.fillRect(0,0,this.w,this.h);
    }

    fullfield(){
        this.full("white");
    }

    delete(){
        if(confirm("Delete everything")) this.ctx.clearRect(0,0,this.w,this.h);
    }

    init(){
        this.generateCursor();
        initGrid();
    }

    generateCursor(){
        $("body").append('<div id="cursor" class="cursor"></div>');
        $('#cursor').hide();
    }

    get img(){
        return this.ctx.getImageData(0,0,this.w,this.h);
    }

    putImg(imgData){
        this.ctx.putImageData(imgData,0,0);
    }

    invert(){
        let newImg = this.img;
        for(let p = 0; p< this.nbpix;p++){
            let p0 = p*4;
            let newColor = (newImg.data[p0+3] == 0) ? 255 : 0;
            newImg.data[p0] = newColor;
            newImg.data[p0+1] = newColor;
            newImg.data[p0+2] = newColor;
            newImg.data[p0+3] = newColor;
        }
        this.putImg(newImg);
    }

    async prepare(targetid){
        let r = Number($('#inputCalibRotate').val());
        let h = $('#checkFlipH').prop('checked');
        let v = $('#checkFlipV').prop('checked');
        console.log(r,h,v);
        let tcan = document.getElementById(targetid);
        let tctx = tcan.getContext('2d');

        createImageBitmap(this.img).then((imgBitmap)=>{
            tctx.clearRect(0,0,tcan.width,tcan.height);
            //Mirror
            tctx.translate(v ? tcan.width : 0, h ? tcan.height : 0);
            tctx.scale(v ? -1 : 1, h ? -1 : 1);
            //Rotate
            tctx.translate(tcan.width / 2, tcan.height / 2);
            tctx.rotate(r * Math.PI/180);
            tctx.translate(-1 * tcan.width / 2, -1 * tcan.height / 2);
            //Draw
            tctx.drawImage(imgBitmap,0,0);
            tctx.resetTransform();
        })
    }

    move(speed,x,y){
        let img = this.img;
        this.ctx.clearRect(0,0,this.w,this.h);
        this.ctx.putImageData(img,x*speed,y*speed);
    }

    saveImg(){
        var link = document.createElement('a');
        link.download = 'image.png';
        link.href = this.canvas.toDataURL();
        link.click();
        link.delete;
    }

    loadImg(){
        let form = document.createElement('form');
        var f = document.createElement('input');
        f.style.display='none';
        f.type='file';
        f.name='file';
        form.appendChild(f);
        f.click();
        $(f).change((e)=>{
            var URL = window.webkitURL || window.URL;
            var url = URL.createObjectURL(e.target.files[0]);
            var img = new Image();
            img.src = url;
            img.onload = () => {
                    let img_width = img.width;
                    let img_height = img.height;
                    this.ctx.drawImage(img, 0, 0, img_width, img_height);
            }
        })
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