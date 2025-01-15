from pymongo import MongoClient
from pydantic import BaseModel, HttpUrl, ValidationError
from werkzeug.security import generate_password_hash
from typing import List

class FriendSchema(BaseModel):
    email: str
    fstack: List[str]