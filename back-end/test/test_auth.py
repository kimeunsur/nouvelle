#pytest test/test_auth.py
import unittest
from flask import Flask, request, jsonify
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from unittest.mock import patch, MagicMock
from pydantic import BaseModel
from src.models.Auth import AuthSchema

# MongoDB 연결 (테스트를 위한 Mock 사용)
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

# 테스트 클래스
class AuthApiTests(unittest.TestCase):
    
    # 테스트 클라이언트 설정
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    # 회원가입 테스트
    @patch('pymongo.collection.Collection.find_one')
    @patch('pymongo.collection.Collection.insert_one')
    def test_signup_success(self, mock_insert, mock_find):
        # mock_find는 이미 존재하는 이메일이 없다고 반환
        mock_find.return_value = None
        mock_insert.return_value = None
        
        # 테스트 데이터
        test_data = {
            'email': 'test@example.com',
            'password': 'password123',
            'name': 'Test User'
        }

        # POST 요청 보내기
        response = self.client.post('/signup', json=test_data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('User created successfully', response.get_json()['message'])

    @patch('pymongo.collection.Collection.find_one')
    def test_signup_email_exists(self, mock_find):
        # 이미 존재하는 이메일 시나리오
        mock_find.return_value = {'email': 'test@example.com'}
        
        # 테스트 데이터
        test_data = {
            'email': 'test@example.com',
            'password': 'password123',
            'name': 'Test User'
        }

        # POST 요청 보내기
        response = self.client.post('/signup', json=test_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Email already exists', response.get_json()['message'])

    # 로그인 테스트
    @patch('pymongo.collection.Collection.find_one')
    def test_login_success(self, mock_find):
        # 존재하는 사용자
        mock_find.return_value = {'email': 'test@example.com', 'password': generate_password_hash('password123'), 'name': 'Test User'}

        # 테스트 데이터
        test_data = {
            'email': 'test@example.com',
            'password': 'password123'
        }

        # POST 요청 보내기
        response = self.client.post('/login', json=test_data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Login successful', response.get_json()['message'])

    @patch('pymongo.collection.Collection.find_one')
    def test_login_user_not_found(self, mock_find):
        # 사용자 없음 시나리오
        mock_find.return_value = None

        # 테스트 데이터
        test_data = {
            'email': 'nonexistent@example.com',
            'password': 'password123'
        }

        # POST 요청 보내기
        response = self.client.post('/login', json=test_data)
        self.assertEqual(response.status_code, 404)
        self.assertIn('User not found', response.get_json()['message'])

    @patch('pymongo.collection.Collection.find_one')
    def test_login_invalid_password(self, mock_find):
        # 존재하는 사용자, 잘못된 비밀번호
        mock_find.return_value = {'email': 'test@example.com', 'password': generate_password_hash('password123'), 'name': 'Test User'}

        # 테스트 데이터
        test_data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }

        # POST 요청 보내기
        response = self.client.post('/login', json=test_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid password', response.get_json()['message'])

# 테스트 실행
if __name__ == '__main__':
    unittest.main()