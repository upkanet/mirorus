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
$('#btnFullfield').click(()=>{if(confirm("Erase and load fullfield ?")) draw.fullfield()});
$('#btnDelete').click(()=>{if(confirm("Delete everything ? ")) draw.clear()});
$('#btnInvert').click(()=>{if(confirm("Are you sure you want to invert, it will loose color information ?")) draw.invert()});
$('#btnTarget').click(()=>{if(confirm("Erase and load target image ?")) draw.loadTarget()});

//Left menu
$('#btnRun').click(run);
$('#btnStop').click(()=>{dmd.stop()});
$('#btnSave').click(()=>{draw.saveImg()});
$('#btnLoad').click(()=>{if(confirm("Erase and load new image ?")) draw.loadImg()});
$('#btnHelp').click(toggleTooltips);
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
$('#btnTimingDefault').click(resetTiming)
$('#btnTimingContinuous').click(continuousTiming)
$('#btnCircuitLoad').click(()=>{draw.loadCircuit()});

//Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('.hastooltip'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})
tooltipList.forEach((tt)=>{
    
})

function disableTooltips(){
    tooltipList.forEach((tt)=>{
        tt.hide();
        tt.disable();
    })
}
disableTooltips();

function enableTooltips(){
    tooltipList.forEach((tt)=>{
        tt.enable();
        tt.show();
    })
}

let tooltipsOn = false;

function toggleTooltips(){
    if(tooltipsOn) disableTooltips();
    else enableTooltips();
    tooltipsOn = !tooltipsOn;
}


//Shortcuts
$('body').keydown((e)=>{
    let k = e.key;
    let s = e.shiftKey;
    if(k == "ArrowLeft") draw.move(s?2:1,-1,0)
    if(k == "ArrowRight") draw.move(s?2:1,1,0)
    if(k == "ArrowUp") draw.move(s?2:1,0,-1)
    if(k == "ArrowDown") draw.move(s?2:1,0,1)
    if(k == "t") $('#transformed').toggle();

    if(k == "q" || k == "Q") draw.moveCircuit(s?4:1,-1,0)
    if(k == "d" || k == "D") draw.moveCircuit(s?4:1,1,0)
    if(k == "z" || k == "Z") draw.moveCircuit(s?4:1,0,-1)
    if(k == "s" || k == "S") draw.moveCircuit(s?4:1,0,1)

    if(k == "r" || k == "R") draw.scaleCircuit(s?2:1,-1)
    if(k == "f" || k == "F") draw.scaleCircuit(s?2:1,1)

    if(k == "a" || k == "A") draw.rotateCircuit(s?2:1,-1)
    if(k == "e" || k == "E") draw.rotateCircuit(s?2:1,1)

    if(k == "+") brushSize(1)
    if(k == "-") brushSize(-1)

    if(k == "1") $('[data-color="white"]').click()
    if(k == "2") $('[data-color="green"]').click()
    if(k == "3") $('[data-color="blue"]').click()
    if(k == "4") $('[data-color="red"]').click()
    if(k == "5") $('[data-color="orange"]').click()
    if(k == "6") $('[data-color="yellow"]').click()
})

function checkloop(e){
    $('#inputTimingIterations').prop('disabled',e.target.checked)
}

function computeTiming(){
    let period = $('#inputTimingPeriod').val();
    let iterations = $('#inputTimingIterations').prop('disabled') ? undefined : $('#inputTimingIterations').val();
    let tot = period * iterations;
    let txt = isNaN(tot) ? 'forever' : `${tot/1000} sec`;
    $('#spanTimingTotal').html(txt);
}

function continuousTiming(){
    let p = Number($('#inputTimingPeriod').val());
    $('#inputTimingFlash').val(p);
}

function resetTiming(){
    function rst(id){
        $(`#${id}`).val($(`#${id}`).attr('value'));
        $(`#${id}`).prop('checked',$(`#${id}`).attr('checked') == 'checked');
    }
    rst('inputTimingFlash')
    rst('inputTimingPeriod')
    rst('checkboxTimingLoop')
    rst('inputTimingIterations')
}

async function test(){

}

function brushSize(direction){
    let r = $('#rangeRectSize');
    let step = Number(r.attr('step'));
    let nval = Number(r.val()) + direction * step;
    r.val(nval);
}

async function run(){
    await draw.prepare("transformed");
    await dmd.sendImg();
    await dmd.sendTiming();
    await dmd.run();
}