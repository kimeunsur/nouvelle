import requests
import flask
import urllib
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from src.models import Auth
from flask import Blueprint, redirect, request, jsonify
from src.models.naver import get_access_token, get_user_info, save_user_to_mongodb

client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

kakao_bp = Blueprint('kakao_auth', __name__)

CLIENT_ID = "97f19a31a9792b881a572c4b557f52f2"
CLIENT_SECRET = "aQheaRjnvnmxdmOse1CVzAKrYWYJvQvY"
REDIRECT_URI = "http://127.0.0.1:5000/kakao_auth/kakao-login/callback"

@kakao_bp.route("/kakao-login", methods=["get"])
def login():
    my_res = flask.Response()
    my_res.headers["Access-Control-Allow-Origin"] = "*"

    # 1. 인가 코드 받기 : /oauth/authorize
    kakao_login_url = "https://kauth.kakao.com/oauth/authorize"
    kakao_login_url += f"?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code"
    # return)
    # code : 토큰을 받기 위해 필요한 인가 코드
    # error : 인증 실패시 반환되는 코드
    # error_description : 에러 메세지

    # 카카오 로그인 페이지로 리디렉션
    return redirect(kakao_login_url)

@kakao_bp.route("/kakao-login/callback", methods=['get'])
def login_callback():
    try:
        # 2. 토큰 받기 : /oauth/token
        code = request.args.get('code')
        token_response = requests.post('https://kauth.kakao.com/oauth/token',
            headers={'Content-Type': 'application/x-www-form-urlencoded:charset=utf-8'},
            params={
                'grant_type': 'authorization_code', # 고정
                'client_id': CLIENT_ID,             # 앱 rest API 키
                'redirect_uri': REDIRECT_URI,       # 인가 코드가 리다이렉트된 URI
                'code': code,                       # 인가 코드 받기 요청으로 얻은 인가 코드
                'client_secret': CLIENT_SECRET
            },
        )
        token_response.raise_for_status() # rasie_for_status() : 상태코드가 400 이상인 경우 HTTPError를 raise 함
        access_token = token_response.json().get('access_token')
        # return )
        # token_type : bear로 고정
        # access_token : 사용자 액세스 토큰값
        # expires_in : 만료시간(sec)
        # refresh_token : 사용자 리프레시 토큰값
        # refresh_token_expires_in : 리프레시 토큰 만료 시간(sec)

        # 3. 사용자 정보 받기 : v2/user/me
        user_info_response = requests.get('https://kapi.kakao.com/v2/user/me',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Contept-Type': 'application/x-www-form-urlencoded:charset=utf-8'
            },
        )
        user_info_response.raise_for_status()
        user_data = user_info_response.json()
        
        # 4. 사용자 정보 DB에 추가
        kakao_account = user_data.get('kakao_account')
        email = kakao_account.get('email')
        name = kakao_account.get('profile').get('nickname')
        user_id = user_data.get('id')

        #user = Auth.query.filter_by(email=email).first()

        hashed_password = generate_password_hash(f'kakao-{user_id}', method='pbkdf2')
        result = auth_collection.update_one(
            {"email": email},
            {"$set": {
                'email': email,
                'password': hashed_password,  # Placeholder hashed password
                'name': name
            }},
            upsert=True
        )
        #if not user:
        #    hashed_password = generate_password_hash(f'kakao-{user_id}', method='pbkdf2')
        #    new_user = {
        #        'email': email,
        #        'password': hashed_password,  # Placeholder hashed password
        #        'name': name
        #    }
        #    auth_collection.insert_one(new_user)

        return redirect("http://localhost:3000/main")
    
    except requests.exceptions.RequestException as e:
        print(f"Error during Kakao login: {e}")
        return jsonify({'message': 'Kakao Login failed', 'error': str(e)}), 500

    except Exception as e:
        print(f"Unexpected error during Kakao login: {e}")
        return jsonify({'message': 'Kakao Login failed', 'error': str(e)}), 500