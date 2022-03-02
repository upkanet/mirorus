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

    get dataURL(){
        return this.canvas.toDataURL().split(',')[1];
    }
    
    async sendTiming(){
        let f = $('#inputTimingFlash').val();
        let p = $('#inputTimingPeriod').val();
        await $.post(`/timing`,{flash:f,period:p},(d)=>{
            // console.log(d);
        });
    }

    async sendImg(){
        await $.post(`/seq`,{img:this.dataURL},(d)=>{
            // console.log(d);
        });
    }

    async run(){
        console.log("DMD run");
        this.showStatus('success');
        await $.get(`/run`);
    }

    async stop(){
        console.log("DMD stop");
        this.showStatus('danger');
        await $.get(`/stop`);
        this.showStatus('default');
    }

    showStatus(status){
        let sdmd = $('#statusDMD');
        if(status == 'default'){
            sdmd.html('<i class="ri-checkbox-blank-circle-fill"></i>');
            return 0;    
        }
        sdmd.html(`<div class="spinner-grow text-${status}"></div>`);
    }

}

let dmd = new DMD('transformed');

export {dmd}