from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pydantic import BaseModel, ValidationError
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
auth_collection = db['Auth']
item_collection = db['Item']
auth_bp = Blueprint('auth', __name__) 

SECRET_KEY="1234"

# 회원가입 API
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        # 요청 본문에서 데이터를 받음 
        data = request.get_json()

        # Pydantic 모델 검증
        auth_data = AuthSchema(**data)

        # MongoDB에서 이미 해당 이메일이 존재하는지 확인
        if auth_collection.find_one({"email": auth_data.email}):
            return jsonify({"message": "Email already exists"}), 400
        
        item_collection.insert_one({
            "color": "#ffffff",
            "stack": [],
            "external_link1": "https://www.naver.com/",
            "external_link2": "https://www.daum.net/",
            "email":  auth_data.email
        })
        # MongoDB에 저장
        auth_collection.insert_one(auth_data.to_mongo_dict())
        #return jsonify({"message": "User created successfully"}), 201
        return jsonify({"message": "User created successful", "user": {"email": auth_data.email, "name": auth_data.name}}), 200
        

        
    except ValidationError as e:
        # 모델 검증 실패 시 에러 메시지 반환
        logging.error(f"Validation error: {e.errors()}")
        return jsonify({"message": "Validation error", "errors": e.errors()}), 400

    except PyMongoError as e:
        # MongoDB 관련 오류 처리
        logging.error(f"Database error: {str(e)}")
        return jsonify({"message": "Database error", "error": str(e)}), 500

    except Exception as e:
        # 일반적인 예외 처리
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

# 로그인 API
@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        # 요청 본문에서 데이터를 받음
        data = request.get_json()

        # 이메일과 비밀번호 가져오기
        email = data.get('email')
        password = data.get('password')

        # MongoDB에서 해당 이메일을 가진 사용자 찾기
        user = auth_collection.find_one({"email": email})
        if user is None:
            return jsonify({"message": "User not found"}), 404

        # 비밀번호 확인
        if not check_password_hash(user['password'], password):
            return jsonify({"message": "Invalid password"}), 400
        

        if isinstance(token, bytes):
            token = token.decode('utf-8')
        logging.info(f"Generated token: {token}")  # 토큰 확인을 위한 로그
        return jsonify({"message": "Signin successful", "user": {"email": user['email'], "name": user['name']}
                        }), 200

    except PyMongoError as e:
        # MongoDB 관련 오류 처리
        logging.error(f"Database error: {str(e)}")
        return jsonify({"message": "Database error", "error": str(e)}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({"message": str(e)}), 500

@auth_bp.route('/user/email', methods=["POST"])
def getUser():
    data = request.get_json()
    email = data.get('email')

    user = auth_collection.find_one({"email": email})
    if user is None:
        return jsonify({"message": "User not found"}), 404

    print(user)
    return jsonify({"message": "Signin successful", "user": {"email": user['email'], "name": user['name']}}), 200
