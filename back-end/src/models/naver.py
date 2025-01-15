import requests
from pymongo import MongoClient
from src.models.Item import ItemSchema

# MongoDB 연결
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client["nouvelle"]
auth_collection = db["Auth"]
item_collection = db["Item"]
friend_collection = db['Friend']
CLIENT_ID = "lRgFOjhvIeBEWzlRLXBI"
CLIENT_SECRET = "vXgNaAglSB"
REDIRECT_URI = "http://127.0.0.1:5000/naver_auth/login/callback"

def get_access_token(userCode):
    url = "https://nid.naver.com/oauth2.0/token"
    headers={'Content-Type': 'application/x-www-form-urlencoded:charset=utf-8'}
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": userCode,
        "redirect_uri": REDIRECT_URI
    }
    
    response = requests.post(url, headers=headers, params=params)
    data = response.json()
    
    if "access_token" in data:
        return data["access_token"]
    else:
        raise Exception("Failed to get access token: " + data.get("error_description", "Unknown error"))

def get_user_info(access_token):
    url = "https://openapi.naver.com/v1/nid/me"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get(url, headers=headers)
    user_info = response.json()
    
    if user_info["resultcode"] == "00":
        return user_info["response"]
    else:
        error_message = user_info.get("message", "Unknown error")
        raise Exception(f"Failed to get user info: {error_message}")


def save_user_to_mongodb(user_info):
    user_data = {
        "email": user_info["email"],
        "password": "1111",
        "name": user_info["name"],
    }
    
    result = auth_collection.update_one(
        {"email": user_info["email"]},
        {"$set": user_data},
        upsert=True  # 문서가 없으면 새로 삽입
    )
    item_collection.insert_one({
            "color": "#ffffff",
            "stack": [],
            "external_link1": "https://www.naver.com/",
            "external_link2": "https://www.daum.net/",
            "email":  user_info["email"]
        })
    friend_collection.insert_one({
            "email": user_info["email"],
            "fstack": []
        })
    return result