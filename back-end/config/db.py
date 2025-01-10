from pymongo import MongoClient
import os

client = MongoClient(os.getenv('MONGODB_URI', 'mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/'))
db = client['nouvelle']  # default database

# 예시로 'users' 컬렉션 접근
users_collection = db['Auth']


