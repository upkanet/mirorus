import { dmd } from './dmd.mjs';
import {draw} from './draw.mjs'

//Canvas
draw.init();
$("#drawing").mousedown((e)=>{draw.mousedown(e)})
$("#drawing").mousemove((e)=>{draw.mousemove(e)})
$("#drawing").mouseup((e)=>{draw.mouseup(e)})
$("#drawing").mouseover((e)=>{draw.mouseover(e)})
$("#drawing").mouseout((e)=>{draw.mouseout(e)})

//Top menu
$('#btnFullfield').click(()=>{draw.fullfield()});
$('#btnDelete').click(()=>{draw.delete()});
$('#btnInvert').click(()=>{draw.invert()});

//Left menu
$('#btnRun').click(run);
$('#btnTest').click(test);

//Right menu
$('.btncolor').click((e)=>{draw.selectColor(e)});
$('#inputTimingPeriod').change(computeTiming);
$('#checkboxTimingLoop').change((e)=>{
    checkloop(e)
    computeTiming()
});
$('#inputTimingIterations').change(computeTiming);
$('#spanTimingTotal').ready(computeTiming);

//Shortcuts
$('body').keydown((e)=>{
    let k = e.key;
    let s = e.shiftKey;
    if(k == "ArrowLeft") draw.move(s?2:1,-1,0)
    if(k == "ArrowRight") draw.move(s?2:1,1,0)
    if(k == "ArrowUp") draw.move(s?2:1,0,-1)
    if(k == "ArrowDown") draw.move(s?2:1,0,1)
    if(k == "t") $('#transformed').toggle();
})

function checkloop(e){
    $('#inputTimingIterations').prop('disabled',e.target.checked)
}

function computeTiming(){
    let period = $('#inputTimingPeriod').val();
    let iterations = $('#inputTimingIterations').prop('disabled') ? undefined : $('#inputTimingIterations').val();
    let tot = period * iterations;
    let txt = isNaN(tot) ? 'inf' : `${tot/1000} sec`;
    $('#spanTimingTotal').html(txt);
}

async function test(){
    var buffer = new Uint8Array(2);
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


setBit(buffer, 0, 0, 1)
setBit(buffer, 0, 1, 1)
setBit(buffer, 0, 2, 0)
setBit(buffer, 0, 3, 1)

setBit(buffer, 1, 2, 1)
setBit(buffer, 1, 3, 1)

// read back the bits
console.log(
    readBit(buffer, 0, 0),
    readBit(buffer, 0, 1),
    readBit(buffer, 0, 2),
    readBit(buffer, 0, 3)
  );

console.log(
  readBit(buffer, 1, 0),
  readBit(buffer, 1, 1),
  readBit(buffer, 1, 2),
  readBit(buffer, 1, 3)
);
}

async function run(){
    await draw.prepare("transformed");
    await dmd.sendSeq();
    // await dmd.sendTiming();
    // await dmd.run();
}