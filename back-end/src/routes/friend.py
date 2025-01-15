from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pydantic import BaseModel, ValidationError, HttpUrl
from werkzeug.security import check_password_hash
from typing import Optional
from src.models.Auth import AuthSchema
import logging
from pymongo.errors import PyMongoError
import jwt
from datetime import datetime, timedelta
from src.models.Item import ItemSchema

# MongoDB 연결
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
item_collection = db['Item']
auth_collection = db['Auth']
friend_collection = db['Friend']

friend_bp = Blueprint('friend', __name__)

@friend_bp.route("/add_friend", methods=["POST"])
def add_friend():
        
        data = request.json
        email = data.get('email')