import unittest
from unittest.mock import patch, MagicMock
from src.models.naver import get_access_token, get_user_info, save_user_to_mongodb  # 실제 파일 이름으로 수정
from pymongo.results import UpdateResult
import requests

class NaverAuthTests(unittest.TestCase):
    @patch('requests.post')
    def test_get_access_token_success(self, mock_post):
        # Mock Naver token response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "access_token": "mock_access_token",
            "token_type": "bearer",
            "expires_in": "3600",
            "refresh_token": "mock_refresh_token"
        }
        mock_post.return_value = mock_response

        # User authentication code
        user_code = "mock_user_code"

        # Test get_access_token function
        access_token = get_access_token(user_code)
        self.assertEqual(access_token, "mock_access_token")
        mock_post.assert_called_once_with(
            "https://nid.naver.com/oauth2.0/token",
            data={
                "grant_type": "authorization_code",
                "client_id": "lRgFOjhvIeBEWzlRLXBI",
                "client_secret": "vXgNaAglSB",
                "code": user_code,
                "redirect_uri": "http://localhost:3000/main"
            }
        )

    @patch('requests.get')
    def test_get_user_info_success(self, mock_get):
        # Mock 네이버 사용자 정보 응답
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "resultcode": "00",
            "message": "success",
            "response": {
                "email": "test@example.com",
                "name": "Test User"
            }
        }
        mock_get.return_value = mock_response

        # 사용자 정보 가져오기 테스트
        access_token = "mock_access_token"
        user_info = get_user_info(access_token)
        self.assertEqual(user_info, {
            "email": "test@example.com",
            "name": "Test User"
        })
        mock_get.assert_called_once_with(
            "https://openapi.naver.com/v1/nid/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
    @patch('pymongo.collection.Collection.update_one')
    def test_save_user_to_mongodb(self, mock_update_one):
        user_info = {
            "email": "test@example.com",
            "name": "Test User"
        }
        # mock_update_one의 반환값 설정
        mock_result = MagicMock()
        mock_result.modified_count = 1  # 예시 값, 실제 반환값에 맞게 수정
        mock_update_one.return_value = mock_result

        # MongoDB에 사용자 저장 테스트
        result = save_user_to_mongodb(user_info)

        # 기대되는 결과 검증
        self.assertEqual(result, mock_result)
        mock_update_one.assert_called_once_with(
            {"email": "test@example.com"},  # 필터 조건
            {"$set": {  # 업데이트할 데이터
                "email": "test@example.com",
                "password": "1111",
                "name": "Test User"
            }},
            upsert=True  # upsert=True 설정 확인
        )