import { dmd } from './dmd.mjs';
import {draw} from './draw.mjs'

draw.init();

$("#drawing").mousedown((e)=>{draw.mousedown(e)})
$("#drawing").mousemove((e)=>{draw.mousemove(e)})
$("#drawing").mouseup((e)=>{draw.mouseup(e)})
$("#drawing").mouseover((e)=>{draw.mouseover(e)})
$("#drawing").mouseout((e)=>{draw.mouseout(e)})

$('.btncolor').click((e)=>{draw.selectColor(e)});

$('#btnFullfield').click(()=>{draw.fullfield()});
$('#btnDelete').click(()=>{draw.delete()});

$('#btnInvert').click(()=>{draw.invert()});

$('#btnRun').click(run);
$('#btnTest').click(test);

$('body').keydown((e)=>{
    let k = e.key;
    let s = e.shiftKey;
    if(k == "ArrowLeft") draw.move(s?2:1,-1,0)
    if(k == "ArrowRight") draw.move(s?2:1,1,0)
    if(k == "ArrowUp") draw.move(s?2:1,0,-1)
    if(k == "ArrowDown") draw.move(s?2:1,0,1)
    if(k == "t") $('#transformed').toggle();
})

async function test(){
    await draw.prepare("transformed");
    console.log(dmd.seq);
}

async function run(){
    await draw.prepare("transformed");
    console.log(dmd.imgArr);
}