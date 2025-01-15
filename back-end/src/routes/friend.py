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
        fname = data.get('fname')
        
        if not email or not fname:
                return jsonify({"message":"data 수신 못 함~"}), 400
        result = friend_collection.update_one(
                {"email":email},
                {"$addToSet":{"fstack":fname}},
                upsert=True
        )
        if result.matched_count > 0:
                return jsonify({"message": "친구 추가 성공!"}), 200
        else:
                return jsonify({"message": "새로운 문서 생성 후 친구 추가 성공!"}), 201
        
@friend_bp.route("/myFriend", methods=["POST"])
def myFriend():
        try:
                data = request.json
                logging.debug(f"Received data: {data}")

                email = data.get('email')
                if not email:
                        return jsonify({"message":"email 못받음"}),400
                
                result = item_collection.find_one({"email": email})
                logging.debug(f"Database query result: {result}")

                if result:
                        fstack = result.get("fstack", [])
                        return jsonify({"email": email, "fstack": fstack}), 200
                else:
                        return jsonify({"message": "No data found for the given email"}), 404
        except Exception as e:
                logging.exception("An error occurred while processing the request")
                return jsonify({"message": "Internal server error"}), 500
        