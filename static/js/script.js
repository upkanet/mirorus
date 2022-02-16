import {init,mousedown,mousemove,mouseup} from './draw.mjs'

init();

$("#drawing").mousedown(mousedown)
$("#drawing").mousemove(mousemove)
$("#drawing").mouseup(mouseup)