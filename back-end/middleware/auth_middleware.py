import jwt
import datetime

SECRET_KEY = "1234"

#jwt 토큰 생성
def create_token(user_id):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {
        "user_id": user_id,
        "exp": expiration_time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


#jwt 토큰 검증
def decode_token(token):
    try:
        decoded_payload = jwt.decode(token, SECRET_KEY, algorithm="HS256")
        return decoded_payload
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None