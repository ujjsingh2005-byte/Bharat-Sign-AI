from app.database import users_collection
from app.utils.hashing import hash_password, verify_password
from app.services.jwt_service import create_access_token

def create_user(data):

    existing = users_collection.find_one(
        {"email": data.email}
    )

    if existing:
        return {
            "success": False,
            "message": "Email already exists"
        }

    user = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password)
    }

    users_collection.insert_one(user)

    return {
        "success": True,
        "message": "User Registered Successfully"
    }


def login_user(data):

    user = users_collection.find_one(
        {"email": data.email}
    )

    if not user:
        return {
            "success": False,
            "message": "Invalid Email"
        }

    if not verify_password(
        data.password,
        user["password"]
    ):
        return {
            "success": False,
            "message": "Invalid Password"
        }

    token = create_access_token(
        {
            "email": user["email"],
            "name": user["name"]
        }
    )

    return {
        "success": True,
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"]
        }
    }