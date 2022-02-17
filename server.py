from ALP4 import *
from DMDTools import *
from flask import Flask,render_template,request
import atexit

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
    i = request.form['flash'] * 1000 #microsec to ms
    p = request.form['period'] * 1000 #microsec to ms
    DMD.SetTiming(illuminationTime= i, pictureTime = p)
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
            print("Error while sending sequence")
    return nbImg

@app.route('/run')
def run():
    print("Run...")
    DMD.Run()
    return "run"

@app.route('/stop')
def stop():
    print("Stop")
    DMD.Halt()
    return "stop"

if __name__=="__main__":
    app.run()