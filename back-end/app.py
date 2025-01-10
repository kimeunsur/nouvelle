from pymongo import MongoClient
from flask import Flask
from flask_pymongo import PyMongo
from src.routes.auth import auth_bp
from src.routes.naver_auth import naver_bp

app = Flask(__name__)

app.config['MONGO_URI'] = "mongodb://localhost:27017"
mongo = PyMongo(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(naver_bp, url_prefix='/naver')
if __name__ == '__main__':
    app.run(debug=True)