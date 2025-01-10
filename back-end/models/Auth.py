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
    userId: str
    password: str
    name: str

    # MongoDB에 저장할 데이터로 변환
    def to_mongo_dict(self):
        # 비밀번호 해싱 처리 (pbkdf2_sha256 알고리즘 사용)
        hashed_password = generate_password_hash(self.password, method='pbkdf2')
        return {
            'userId': self.userId,
            'password': hashed_password,
            'name': self.name,
        }

# 사용자 데이터 생성 함수
def create_user(user_data: dict):
    try:
        # Pydantic 모델을 사용해 데이터 검증
        user = AuthSchema(**user_data)
        
        # 검증된 데이터 MongoDB에 삽입
        auth_collection.insert_one(user.to_mongo_dict())
        print(f"User {user.userId} created successfully!")

    except ValidationError as e:
        print(f"Validation error: {e}")

# 예시 데이터 삽입
user_data = {
    'userId': 'john_doe',
    'password': 'securepassword123',  # 비밀번호는 최소 6자 이상이어야 합니다.
    'name': 'John Doe',
}

create_user(user_data)