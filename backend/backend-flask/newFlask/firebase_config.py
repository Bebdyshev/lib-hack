import firebase_admin
from firebase_admin import credentials, firestore

# Инициализация Firebase с использованием приватного ключа
cred = credentials.Certificate('bs-hack1-firebase-adminsdk-glq41-66011b1738.json')
firebase_admin.initialize_app(cred)

# Создание клиента Firestore
db = firestore.client()
