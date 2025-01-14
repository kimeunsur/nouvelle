from pymongo import MongoClient
from pydantic import BaseModel, HttpUrl, ValidationError
from werkzeug.security import generate_password_hash
from typing import List

class ItemSchema(BaseModel):
    color: str
    stack: List[str]
    external_link: HttpUrl
    email: str