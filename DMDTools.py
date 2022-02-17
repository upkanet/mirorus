import io
import base64
from PIL import Image

class DMDImg(object):

    def __init__(self,b64str):
        image_string = io.BytesIO(base64.b64decode(b64str))
        image = Image.open(image_string)
        pix = image.load()
        self.image = image
        self.pix = pix

    def seq(self):
        print(self.image.size)
        print(self.pix)