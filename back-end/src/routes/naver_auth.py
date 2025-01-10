import requests
from pymongo import MongoClient
from flask import Flask, request, jsonify
from src.models.naver import get_access_token
from src.models.naver import get_user_info
from src.models.naver import save_user_to_mongodb

client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

app = Flask(__name__)

@app.route("/naver-login", methods=["POST"])
def login():
    user_code = request.json.get("code")
    redirect_uri = request.json.get("redirect_uri")
    
    if not user_code or not redirect_uri:
        return jsonify({"error": "Missing parameters"}), 400
    
    try:
        access_token = get_access_token(user_code, redirect_uri)
        user_info = get_user_info(access_token)
        save_user_to_mongodb(user_info)
        return jsonify({"message": "user info saved 성공적~"}), 200
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
if __name__ == "__main__":
    app.run(debug=True)
    