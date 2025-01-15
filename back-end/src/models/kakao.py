import requests
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from src.models.Item import ItemSchema
# MongoDB 연결
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client["nouvelle"]
auth_collection = db["Auth"]
item_collection = db["Item"]

CLIENT_ID = "97f19a31a9792b881a572c4b557f52f2"
CLIENT_SECRET = "aQheaRjnvnmxdmOse1CVzAKrYWYJvQvY"
REDIRECT_URI = "http://127.0.0.1:5000/kakao_auth/login/callback"

# 2. 토큰 받기 : /oauth/token
def get_access_token(code):
    response = requests.post('https://kauth.kakao.com/oauth/token',
        headers={'Content-Type': 'application/x-www-form-urlencoded:charset=utf-8'},
        params={
            'grant_type': 'authorization_code', # 고정
            'client_id': CLIENT_ID,             # 앱 rest API 키
            'redirect_uri': REDIRECT_URI,       # 인가 코드가 리다이렉트된 URI
            'code': code,                       # 인가 코드 받기 요청으로 얻은 인가 코드
            'client_secret': CLIENT_SECRET
        },
    )
    access_token = response.json()
    # return )
    # token_type : bear로 고정
    # access_token : 사용자 액세스 토큰값
    # expires_in : 만료시간(sec)
    # refresh_token : 사용자 리프레시 토큰값
    # refresh_token_expires_in : 리프레시 토큰 만료 시간(sec)
    
    if "access_token" in access_token:
        return access_token.get('access_token')
    else:
        raise Exception("Failed to get access token")
    
# 3. 사용자 정보 받기 : v2/user/me
def get_user_info(access_token):
    response = requests.get('https://kapi.kakao.com/v2/user/me',
        headers={
            'Authorization': f'Bearer {access_token}',
            'Contept-Type': 'application/x-www-form-urlencoded:charset=utf-8'
        },
    )
    return response.json()

# 4. 사용자 정보 DB에 추가
def save_user_to_mongodb(user_info):
    kakao_account = user_info.get('kakao_account')
    user_id = user_info.get('id')
    hashed_password = generate_password_hash(f'kakao-{user_id}', method='pbkdf2')
    
    user_data = {
        "name": kakao_account.get('profile').get('nickname'),
        "email": kakao_account.get('email'),
        "password": hashed_password
    }
    
    result = auth_collection.update_one(
        {"email": kakao_account.get('email')},
        {"$set": user_data},
        upsert=True  # 문서가 없으면 새로 삽입
    )
    
    item_collection.insert_one({
            "color": "#ffffff",
            "stack": [],
            "external_link1": "https://www.naver.com/",
            "external_link2": "https://www.daum.net/",
            "email":  kakao_account.get('email')
        })
    return result