from pymongo import MongoClient
from flask import Flask
from flask_pymongo import PyMongo
from src.routes.auth import auth_bp
from src.routes.naver_auth import naver_bp
from flask_cors import CORS

import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='urllib3')

app = Flask(__name__)

app.config['MONGO_URI'] = "mongodb://localhost:27017"
mongo = PyMongo(app)

CORS(app, origins="http://localhost:5000")

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(naver_bp, url_prefix='/naver_auth')
if __name__ == '__main__':
    app.run(debug=True)