from ALP4 import *
from flask import Flask,render_template

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__,template_folder="public")
app.config.from_mapping(config)

@app.route('/')
def index():
    print("index")
    return render_template("index.htm")

# @app.route('/css/<cssfile>')
# def css(cssfile):
#     return send_from_directory('css',cssfile)

# @app.route('/js/<jsfile>')
# def js(jsfile):
#     return send_from_directory('js',jsfile)


if __name__=="__main__":
    app.run()