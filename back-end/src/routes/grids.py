from pymongo import MongoClient
from flask import Blueprint, request, abort, jsonify
import jwt

client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

SECRET_KEY = 'abcd'

grid_bp = Blueprint('grid_auth', __name__)

@grid_bp.route("/get_user_info", methods=["GET"])
def get_user_info():
    email = request.headers.get("email")
    
    if email:
        try:
            user = auth_collection.find_one({"email":email})
            user_name = user.get("name")
            if user:
                current_user_email = user.get("email")
                if email == current_user_email:
                    is_me = True
                else:
                    is_me = False
                return jsonify({"isMe": is_me, "user": {"email": email, "name": user_name}}), 200
            else:
                return jsonify({'message': 'User not found'}), 404
        except Exception as e:
            return jsonify({'message': f'Error: {str(e)}'}), 500
    else:
        return jsonify({'message': 'Email missing'}), 400
    
@grid_bp.route("/get_all_users", methods=["GET"])
def get_all_users():
    try:
        users = list(auth_collection.find({}, {"_id":0, "email":1, "name":1}))
        return jsonify({"users":users}), 200
    except Exception as e:
        return jsonify({"message": f"error: {str(e)}"}), 500
    
@grid_bp.route("/searchQ", methods=["GET"])
def searchQ():
    search_query = request.args.get('query', '')
    if search_query:
        users = auth_collection.find({"name": {"$regex": search_query, "$options": "i"}})
    else:
        users = auth_collection.find()
    
    result = [{"name": user["name"], "email":user["email"]} for user in users]
    return jsonify(result)