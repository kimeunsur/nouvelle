#pytest test/test_auth.py
import unittest
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from app import app
from unittest.mock import patch
from src.routes.auth import auth_bp
# MongoDB 연결 (테스트를 위한 Mock 사용)
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

class AuthApiTests(unittest.TestCase):
    @classmethod
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
            'name': 'User1'
        }

        # POST 요청 보내기
        response = self.client.post('/auth/signup', json=test_data)
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
            'name': 'User1'
        }

        # POST 요청 보내기
        response = self.client.post('/auth/signup', json=test_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Email already exists', response.get_json()['message'])

    # 로그인 테스트
    @patch('pymongo.collection.Collection.find_one')
    def test_login_success(self, mock_find):
        # 존재하는 사용자
        mock_find.return_value = {'email': 'test@example.com', 'password': generate_password_hash('password123'), 'name': 'User1'}

        # 테스트 데이터
        test_data = {
            'email': 'test@example.com',
            'password': 'password123'
        }

        # POST 요청 보내기
        response = self.client.post('/auth/signin', json=test_data)
        self.assertIn('Signin successful', response.get_json()['message'])
        self.assertEqual(response.status_code, 200)

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
        response = self.client.post('/auth/signin', json=test_data)
        self.assertEqual(response.status_code, 404)
        self.assertIn('User not found', response.get_json()['message'])

    @patch('pymongo.collection.Collection.find_one')
    def test_login_invalid_password(self, mock_find):
        # 존재하는 사용자, 잘못된 비밀번호
        mock_find.return_value = {'email': 'test@example.com', 'password': generate_password_hash('password123'), 'name': 'User1'}

        # 테스트 데이터
        test_data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }

        # POST 요청 보내기
        response = self.client.post('/auth/signin', json=test_data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid password', response.get_json()['message'])

# 테스트 실행
if __name__ == '__main__':
    unittest.main()