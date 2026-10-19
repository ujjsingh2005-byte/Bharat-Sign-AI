from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

print("===================================")
print("MONGO_URI:", MONGO_URI)
print("DATABASE_NAME:", DATABASE_NAME)
print("===================================")

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

try:
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully")

except Exception as e:
    print("❌ MongoDB Connection Failed")
    print(e)
    raise

db = client[DATABASE_NAME]

users_collection = db["users"]