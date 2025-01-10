import requests
from pymongo import MongoClient
from flask import Blueprint, request, jsonify
from src.models.naver import get_access_token, get_user_info, save_user_to_mongodb

client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

naver_bp = Blueprint('naver_auth', __name__)

@naver_bp.route("/naver-login", methods=["POST"])
def login():
    # 네이버 로그인 URL 설정 (클라이언트 ID와 리디렉션 URI는 실제 값으로 수정)
    client_id = "lRgFOjhvIeBEWzlRLXBI"  # 네이버 개발자 센터에서 발급받은 클라이언트 ID
    redirect_uri = "http://localhost:5000/main"  # 네이버 로그인 후 리디렉션할 URI
    state = "random_state_string"  # 임의의 상태 값 (보안 목적)

    # 네이버 로그인 URL 구성
    naver_login_url = "https://nid.naver.com/oauth2.0/authorize"
    naver_login_url += f"?response_type=code&client_id={client_id}&redirect_uri={urllib.parse.quote(redirect_uri)}&state={state}"

    # 네이버 로그인 페이지로 리디렉션
    return redirect(naver_login_url)