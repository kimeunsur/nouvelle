from pymongo import MongoClient
from flask import Flask, request, abort
from flask_pymongo import PyMongo
from src.routes.auth import auth_bp
from src.routes.naver_auth import naver_bp
from src.routes.kakao_auth import kakao_bp
from src.routes.item import item_bp
from src.routes.grids import grid_bp
from flask_cors import CORS
import jwt

import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='urllib3')

app = Flask(__name__)

app.config['MONGO_URI'] = "mongodb://localhost:27017"
mongo = PyMongo(app)


@app.after_request
def apply_csp(response):
    response.headers["Content-Security-Policy"] = "script-src *.nid.naver.com 'unsafe-inline' 'self';"
    return response

CORS(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(naver_bp, url_prefix='/naver_auth')
app.register_blueprint(kakao_bp, url_prefix='/kakao_auth')
app.register_blueprint(grid_bp, url_prefix='/grid_auth')
app.register_blueprint(item_bp, url_prefix='/item')

if __name__ == '__main__':
    app.run(debug=True)