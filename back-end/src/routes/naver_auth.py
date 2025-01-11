import requests
from pymongo import MongoClient
from flask import Blueprint, request, jsonify
from src.models.naver import get_access_token, get_user_info, save_user_to_mongodb
#from Keys import Keys 
Keys = {
    "clientId": "lRgFOjhvIeBEWzlRLXBI",
    "clientSecret": "vXgNaAglSB"
}

client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

naver_bp = Blueprint('naver_auth', __name__)

@naver_bp.route("/naver-login", methods=["POST"])
def login():
    code = request.json.get("code")
    
    try:
        # 액세스 토큰을 가져옵니다.
        access_token = get_access_token(code)
        # 사용자 정보를 가져옵니다.
        user_info = get_user_info(access_token)

        # 사용자 정보를 MongoDB에 저장합니다.
        save_user_to_mongodb(user_info)
        
        return jsonify({"message": "User info saved successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400
