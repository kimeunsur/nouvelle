from flask import Flask, request, jsonify
from pymongo import MongoClient
from pydantic import BaseModel, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional
from src.models.Auth import AuthSchema

# MongoDB 연결
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

app = Flask(__name__)



# 회원가입 API
@app.route('/signup', methods=['POST'])
def signup():
    try:
        # 요청 본문에서 데이터를 받음
        data = request.get_json()

        # Pydantic 모델 검증
        auth_data = AuthSchema(**data)

        # MongoDB에서 이미 해당 이메일이 존재하는지 확인
        if auth_collection.find_one({"email": auth_data.email}):
            return jsonify({"message": "Email already exists"}), 400

        # MongoDB에 저장
        auth_collection.insert_one(auth_data.to_mongo_dict())
        return jsonify({"message": "User created successfully"}), 201

    except ValidationError as e:
        # 모델 검증 실패 시 에러 메시지 반환
        return jsonify({"message": "Validation error", "errors": e.errors()}), 400

# 로그인 API
@app.route('/login', methods=['POST'])
def login():
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

        return jsonify({"message": "Login successful", "user": {"email": user['email'], "name": user['name']}}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)