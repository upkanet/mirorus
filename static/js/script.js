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

$('#btnTest').click(()=>{draw.prepare('transformed')});