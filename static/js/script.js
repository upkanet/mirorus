import {initDraw,mousedown,mousemove,mouseup,selectColor} from './draw.mjs'

initDraw();

$("#drawing").mousedown(mousedown)
$("#drawing").mousemove(mousemove)
$("#drawing").mouseup(mouseup)

$('.btncolor').click(selectColor);