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

item_bp = Blueprint('item', __name__) 

@item_bp.route("/get_edit_info", methods=["POST"])
def get_edit_info():
    try :
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_keys = {"color", "stack", "external_link1", "external_link2", "email"}
        if not required_keys.issubset(data):
            return jsonify({"error": "Invalid data structure", "details": data}), 400

        item = ItemSchema(**data)

        user_item = item_collection.find_one({"email":item.email})
        if not user_item:
            return jsonify({"message":"user item db not founded"})
        updated_data = {}
        if item.color: updated_data['color'] = item.color,
        if item.stack: updated_data['stack'] =item.stack,
        if item.external_link1: updated_data['external_link1'] = str(item.external_link1),
        if item.external_link2: updated_data['external_link2'] = str(item.external_link2),
        
        item_collection.update_one({"email": item.email}, {"$set": updated_data})

           
        return jsonify({"message": "Item saved successfully"}), 201
    except ValidationError as e:
        return jsonify({"error": "Invalid data", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@item_bp.route("/bring_user_items", methods=["POST"])
def bring_user_items():
    data = request.get_json()
    email = data.get('email')
    
    user_item_data = item_collection.find_one({"email":email})
    if user_item_data is None:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message":"bring item successful", 
                    "ITEM":{"color": user_item_data['color'],"stack": user_item_data['stack'],
                            "external_link1": user_item_data['external_link1'],
                            "external_link1":user_item_data['external_link2'],
                            "email": user_item_data['email']}})
    