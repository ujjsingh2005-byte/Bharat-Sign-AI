from fastapi import APIRouter

from app.schemas.user_schema import (
    RegisterUser,
    LoginUser
)

from app.services.auth_service import (
    create_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: RegisterUser):
    return create_user(user)


@router.post("/login")
def login(user: LoginUser):
    return login_user(user)