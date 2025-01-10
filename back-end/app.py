from pymongo import MongoClient

# MongoDB에 연결 (MongoDB URI 또는 localhost 등으로 연결)
client = MongoClient('mongodb://localhost:27017')

# 'nouvelle' 데이터베이스를 선택
db = client['nouvelle']

# 'Auth' 컬렉션을 선택
users_collection = db['Auth']
