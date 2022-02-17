import io
import base64
from PIL import Image
import numpy as np

class DMDImg(object):

    def __init__(self,b64str):
        image_string = io.BytesIO(base64.b64decode(b64str))
        image = Image.open(image_string)
        pix = image.load()
        self.image = image
        self.size = image.size
        self.pix = pix

    def seq(self):
        w,h = self.size
        arr = {
            "white":np.zeros([h,w]),
            "green":np.zeros([h,w]),
            "blue":np.zeros([h,w]),
            "red":np.zeros([h,w]),
            "orange":np.zeros([h,w]),
            "yellow":np.zeros([h,w])
        }
        for x in range(w):
            for y in range(h):
                pixela = self.pix[x,y]
                (r,g,b,a) = pixela
                pixel = (r,g,b)
                if pixel != (0,0,0):
                    # arr['colorname'][y][x]
                    color = getColor(pixel)
                    if color is not None: arr[color][y][x] = 1
        arrseq = []
        nbImg = 0
        for color in arr:
            #remove empty colors
            if sum(arr[color].ravel()) != 0: 
                nbImg += 1
                arrseq = np.concatenate((arrseq,arr[color].ravel()),axis=None)
        return (nbImg,arrseq)
        


def getColor(pixel):
    if pixel == (0,0,0): return None
    if pixel == (255,255,255): return "white"
    if pixel == (0,128,0): return "green"
    if pixel == (0,0,255): return "blue"
    if pixel == (255,0,0): return "red"
    if pixel == (255,165,0): return "orange"
    if pixel == (255,255,0): return "yellow"
    return None