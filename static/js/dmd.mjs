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
            console.log(d);
        });
    }

    async sendImg(){
        await $.post(`/seq`,{img:this.dataURL},(d)=>{
            console.log(d);
        });
    }

    async run(){
        this.showStatus('green');
        let cit = $('#checkboxTimingLoop').prop('checked')
        let it = $('#inputTimingIterations').val()
        let p = $('#inputTimingPeriod').val();
        await $.get(`/run`);
        if(!cit) setTimeout(()=>{this.stop()},it*p);
    }

    async stop(){
        this.showStatus('red');
        await $.get(`/stop`);
        this.showStatus('grey');
    }

    showStatus(status){
        let sdmd = $('#statusDMD');
        sdmd.css('color',status);
    }

}

let dmd = new DMD('transformed');

export {dmd}