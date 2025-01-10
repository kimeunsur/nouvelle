import requests
from pymongo import MongoClient

# MongoDB 연결
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client["nouvelle"]
auth_collection = db["Auth"]
CLIENT_ID = "lRgFOjhvIeBEWzlRLXBI"
CLIENT_SECRET = "vXgNaAglSB"

def get_access_token(userCode):
    url = "https://nid.naver.com/oauth2.0/authorize"
    params = {
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": userCode,
        "state": "random_state",
        "redirect_uri": "http://localhost:3000/main"
    }
    
    response = requests.post(url, params=params)
    data = response.json()
    #print(f"Response Text: {response.text}")
    
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
        raise Exception("Failed to get user info: " + user_info.get("message", "Unknown error"))

def save_user_to_mongodb(user_info):
    user_data = {
        "name": user_info["name"],
        "email": f"{user_info['naver_id']}@naver.com"
    }
    
    result = auth_collection.update_one(
        {"email": f"{user_info['naver_id']}@naver.com"},
        {"$set": user_data},
        upsert=True  # 문서가 없으면 새로 삽입
    )
    
    return result


#code = "AUTHORIZATION_CODE"
redirect_uri = "http://localhost:3000/main"

#access_token = "YOUR_ACCESS_TOKEN"  # 네이버 로그인 후 받은 액세스 토큰
#user_info = get_user_info(access_token)
#save_user_to_mongodb(user_info)