from ALP4 import *
from DMDTools import *
from flask import Flask,render_template,request
import atexit
import webbrowser
import os

DMD = ALP4(version = '4.2',libDir = "dll")

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__,template_folder="public")
app.config.from_mapping(config)

#Run once on server startup
if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    try:
        printServer("Initialize DMD")
        DMD.Initialize()
    except Exception as e:
        printServerError("Enable to initialize DMD")
        printServerError(e)
    webbrowser.open('http://localhost:5000')
    def OnExitServer():
        printServer("Closing DMD")
        try:
            DMD.FreeSeq()
        except Exception as e:
            printServerError("Error while freeing sequence")
            printServerError(e)
        try:
            DMD.Free()
        except Exception as e:
            printServerError("Error while freeing DMD")
            printServerError(e)
    atexit.register(OnExitServer)

@app.route('/')
def index():
    return render_template("index.htm")

@app.route('/timing', methods = ['POST'])
def timing():
    i = int(request.form['flash']) * 1000 #microsec to ms
    p = int(request.form['period']) * 1000 #microsec to ms
    printServer(f"Setting timing to {int(i/1000)} ms of illumination every {int(p/1000)} ms")
    try:
        DMD.SetTiming(illuminationTime= i, pictureTime = p)
    except Exception as e:
        printServerError('Error while setting timing')
        printServerError(e)
    return request.form

@app.route('/seq',methods=['POST'])
def seq():
    #Remove previous Sequence
    try:
        DMD.FreeSeq()
    except Exception as e:
        printServerError("Error while free DMD memory")
        printServerError(e)
    # printServer(request.form)
    dmdimg = DMDImg(request.form['img'])
    nbImg,seq = dmdimg.seq()
    printServer(f"Sending {nbImg} images to the DMD")
    if nbImg > 0:
        try:
            DMD.SeqAlloc(nbImg = nbImg, bitDepth = 1)
        except Exception as e:
            printServerError(f"Error while allocating sequence with {nbImg} images")
            printServerError(e)
        try:
            DMD.SeqPut(imgData = seq)
        except Exception as e:
            printServerError(f"Error while puting sequence with {nbImg} images")
            printServerError(e)

    return f"{nbImg}"

@app.route('/run')
def run():
    printServer("Run...")
    try:
        DMD.Run()
    except Exception as e:
        printServerError("Error while launching DMD")
        printServerError(e)
    return "run"

@app.route('/stop')
def stop():
    printServer("Stop")
    try:
        DMD.Halt()
    except Exception as e:
        printServerError("Error while stopping the DMD")
        printServerError(e)
    return "stop"

if __name__=="__main__":
    app.run()