import requests
import random, string
import flask
from pymongo import MongoClient
from flask import Blueprint, request, jsonify, redirect
from flask_cors import CORS  # CORS를 임포트합니다
from src.models.naver import get_access_token, get_user_info, save_user_to_mongodb

client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

naver_bp = Blueprint('naver_auth', __name__)

CLIENT_ID = "lRgFOjhvIeBEWzlRLXBI"
CLIENT_SECRET = "vXgNaAglSB"
REDIRECT_URI = "http://127.0.0.1:5000/naver_auth/login/callback"

def generate_state(length=16):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

@naver_bp.route("/login", methods=["GET"])
def login():
    my_res = flask.Response()
    my_res.headers["Access-Control-Allow-Origin"] = "*"
    
    naver_login_url = "https://nid.naver.com/oauth2.0/authorize"
    naver_login_url += f"?response_type=code&client_id={CLIENT_ID}&state=${generate_state()}&redirect_uri=${REDIRECT_URI}"

    return redirect(naver_login_url)

@naver_bp.route("/login/callback", methods=["POST"])
def login_callback():
    if not request.json or not request.json.get("code"):
        return jsonify({"error": "Code is required"}), 400
    
    code = request.json.get("code")
    
    try:
        # 액세스 토큰을 가져옵니다.
        access_token = get_access_token(code)

        # 사용자 정보를 가져옵니다.
        user_info = get_user_info(access_token)

        # 사용자 정보를 MongoDB에 저장합니다.
        save_user_to_mongodb(user_info)

        email = user_info.get("email")

        return redirect(f"http://localhost:3000/main/?email={urllib.parse.quote(email)}")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400