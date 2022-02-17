from ALP4 import *
from DMDTools import *
from flask import Flask,render_template,request
import atexit
import webbrowser

def OnExitServer():
        print("Closing DMD")
        DMD.FreeSeq()
        DMD.Free()

atexit.register(OnExitServer)

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__,template_folder="public")
app.config.from_mapping(config)

#DMD
DMD = ALP4(version = '4.2',libDir = "dll")
try:
    DMD.Initialize()
except:
    print("Enable to initialize DMD")

@app.route('/')
def index():
    print("index")
    return render_template("index.htm")

@app.route('/timing', methods = ['POST'])
def timing():
    i = int(request.form['flash']) * 1000 #microsec to ms
    p = int(request.form['period']) * 1000 #microsec to ms
    try:
        DMD.SetTiming(illuminationTime= i, pictureTime = p)
    except:
        print('Error while setting timing',i,p)
    return request.form

@app.route('/seq',methods=['POST'])
def seq():
    #Remove previous Sequence
    try:
        DMD.FreeSeq()
    except:
        print("Error while free DMD memory")
    # print(request.form)
    dmdimg = DMDImg(request.form['img'])
    nbImg,seq = dmdimg.seq()
    print(f"Sending {nbImg} images to the DMD")
    if nbImg > 0:
        try:
            DMD.SeqAlloc(nbImg = nbImg, bitDepth = 1)
            DMD.SeqPut(imgData = seq)
        except:
            print("Error while sending sequence",nbImg)
    return f"{nbImg}"

@app.route('/run')
def run():
    print("Run...")
    try:
        DMD.Run()
    except:
        print("Error while launching DMD")
    return "run"

@app.route('/stop')
def stop():
    print("Stop")
    try:
        DMD.Halt()
    except:
        print("Error while stopping the DMD")
    return "stop"

if __name__=="__main__":
    webbrowser.open('http://localhost:5000')
    app.run()