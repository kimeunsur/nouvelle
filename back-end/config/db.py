from pymongo import MongoClient
import os

client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
db = client['nouvelle']  # default database

# 예시로 'users' 컬렉션 접근
users_collection = db['Auth']


