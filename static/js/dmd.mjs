class DMD{
    constructor(transformedid){
        this.canvas = document.getElementById(transformedid);
        this.ctx = this.canvas.getContext('2d');
    }

    get w(){
        return this.canvas.width;
    }

    get h(){
        return this.canvas.height;
    }

    get img(){
        return this.ctx.getImageData(0,0,this.w,this.h);
    }

    get nbpix(){
        return this.w * this.h;
    }

    get imgArr(){
        let nb = this.nbpix;
        let a = {white:zeros(nb),green:zeros(nb),blue:zeros(nb),red:zeros(nb),orange:zeros(nb),yellow:zeros(nb)};
        let d = this.img.data;
        for(let p = 0; p < nb; p++){
            let p0 = 4*p;
            let c = getColor(d[p0],d[p0+1],d[p0+2]);
            if(c !== undefined) a[c][p] = 1;
        }
        for(const color in a){
            if(a[color].reduce((partialSum, a) => partialSum + a, 0) == 0) a[color] = undefined;
        }
        return a;
    }

    get seq(){
        let imgarr = this.imgArr;
        let nbimg = 0;
        let seq = [];
        for(const color of ["white","green","blue","red","orange","yellow"]){
            if(imgarr[color] !== undefined){
                nbimg++;
                seq = seq.concat(imgarr[color]);
            }
        }
        console.log('seq/4',seq.length/4);
        let buffer = new Uint8Array(seq.length/4);
        seq.forEach((b,i)=>{
            setBit(buffer, Math.floor(i/4), i%4, b);
        });
        return {nbimg:nbimg,seq:new Blob(buffer,{type:'application/octet-stream'})};
    }
    
    async sendTiming(){
        let f = $('#inputTimingFlash').val();
        let p = $('#inputTimingPeriod').val();
        await $.post(`/timing`,{flash:f,period:p},(d)=>{
            console.log(d);
        });
    }

    async sendSeq(){
        // console.log(this.seq);
        await $.post(`/seq`,this.seq,(d)=>{
            console.log(d);
        });
    }

}


function getColor(r,v,b){
    if(r == 0 && v == 0 && b == 0) return undefined;
    if(r == 255 && v == 255 && b == 255) return "white";
    if(r == 0 && v == 128 && b == 0) return "green";
    if(r == 0 && v == 0 && b == 255) return "blue";
    if(r == 255 && v == 0 && b == 0) return "red";
    if(r == 255 && v == 165 && b == 0) return "orange";
    if(r == 255 && v == 255 && b == 0) return "yellow";
    return undefined;
}

function zeros(n){
    return new Array(n+1).join('0').split('').map(parseFloat)
}

function readBit(buffer, i, bit){
    return (buffer[i] >> bit) % 2;
}
    
function setBit(buffer, i, bit, value){
    if(value == 0){
        buffer[i] &= ~(1 << bit);
    }else{
        buffer[i] |= (1 << bit);
    }
}

let dmd = new DMD('transformed');

export {dmd}