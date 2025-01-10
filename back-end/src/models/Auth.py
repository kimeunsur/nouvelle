from pymongo import MongoClient
from pydantic import BaseModel, Field, ValidationError
from werkzeug.security import generate_password_hash
from typing import Optional

# MongoDB 연결
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

# Pydantic 모델 정의
class AuthSchema(BaseModel):
    email: str
    password: str
    name: str

    # MongoDB에 저장할 데이터로 변환
    def to_mongo_dict(self):
        # 비밀번호 해싱 처리 (pbkdf2_sha256 알고리즘 사용)
        hashed_password = generate_password_hash(self.password, method='pbkdf2')
        return {
            'email': self.email,
            'password': hashed_password,
            'name': self.name,
        }
