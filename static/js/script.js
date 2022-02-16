import {draw} from './draw.mjs'

draw.init();

$("#drawing").mousedown((e)=>{draw.mousedown(e)})
$("#drawing").mousemove((e)=>{draw.mousemove(e)})
$("#drawing").mouseup((e)=>{draw.mouseup(e)})

$('.btncolor').click((e)=>{draw.selectColor(e)});

$('#btnFullfield').click(()=>{draw.fullfield()});
$('#btnDelete').click(()=>{draw.delete()});