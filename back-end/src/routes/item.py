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

        result = item_collection.insert_one({
            "color": item.color,
            "stack": item.stack,
            "external_link1": str(item.external_link1),
            "external_link2": str(item.external_link2),
            "email": item.email,
        })
        item_data = {
            "_id": str(result.inserted_id),
            "color": item.color,
            "stack": item.stack,
            "external_link1": str(item.external_link1),
            "external_link2": str(item.external_link2),
            "email": item.email,     
        }
        #item_collection.insert_one(item_data)
        
        return jsonify({"message": "Item saved successfully", "data": item_data}), 201
    except ValidationError as e:
        return jsonify({"error": "Invalid data", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
