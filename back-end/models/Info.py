from pymongo import MongoClient
from pydantic import BaseModel, Field, ValidationError
from werkzeug.security import generate_password_hash
from typing import Optional

# MongoDB 연결
client = MongoClient("mongodb+srv://admin:adminadmin77@nouvelle.58oqk.mongodb.net/")
db = client['nouvelle']
auth_collection = db['Auth']

