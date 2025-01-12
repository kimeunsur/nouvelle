import requests
import flask
import urllib
from pymongo import MongoClient
from src.models import Auth
from flask import Blueprint, redirect, request, jsonify
from src.models.kakao import get_access_token, get_user_info, save_user_to_mongodb

client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

kakao_bp = Blueprint('kakao_auth', __name__)

CLIENT_ID = "97f19a31a9792b881a572c4b557f52f2"
CLIENT_SECRET = "aQheaRjnvnmxdmOse1CVzAKrYWYJvQvY"
REDIRECT_URI = "http://127.0.0.1:5000/kakao_auth/login/callback"

@kakao_bp.route("/login", methods=["GET"])
def login():
    my_res = flask.Response()
    my_res.headers["Access-Control-Allow-Origin"] = "*"

    # 1. 인가 코드 받기 : /oauth/authorize
    kakao_login_url = "https://kauth.kakao.com/oauth/authorize"
    kakao_login_url += f"?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}"
    # return)
    # code : 토큰을 받기 위해 필요한 인가 코드
    # error : 인증 실패시 반환되는 코드
    # error_description : 에러 메세지

    # 카카오 로그인 페이지로 리디렉션
    return redirect(kakao_login_url)

@kakao_bp.route("/login/callback", methods=['get'])
def login_callback():
    code = request.args.get('code')
    try:
        # 2. 토큰 받기 : /oauth/token
        access_token = access_token = get_access_token(code)

        # 3. 사용자 정보 받기 : v2/user/me
        user_info = get_user_info(access_token)
        
        # 4. 사용자 정보 DB에 추가
        save_user_to_mongodb(user_info)

        email = user_info.get("kakao_account").get("email")

        return redirect(f"http://localhost:3000/main/?email={urllib.parse.quote(email)}")
    
    except requests.exceptions.RequestException as e:
        print(f"Error during Kakao login: {e}")
        return jsonify({'message': 'Kakao Login failed', 'error': str(e)}), 500

    except Exception as e:
        print(f"Unexpected error during Kakao login: {e}")
        return jsonify({'message': 'Kakao Login failed', 'error': str(e)}), 500