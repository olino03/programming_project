import time
import bcrypt
from flask import Flask, request
from flask_mongoengine import MongoEngine
# from os import environ

# secret = environ.get('SECRET')

app = Flask(__name__)

app.config['MONGODB_SETTINGS'] = {
    'db': 'programare',
    'host': 'localhost',
    'port': 27017
}

db = MongoEngine()
db.init_app(app)

# class Restante(db.Document):
#     materii = db.ListField()

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

# @app.route('/test')
# def writeDB():
#     Restante(materii=["mate", "logica"]).save()
#     return {'success': True}

class User(db.Document):
    fname = db.StringField()
    lname = db.StringField()
    email = db.StringField()
    phone = db.StringField()
    password = db.StringField()

@app.route('/register', methods=["POST"])
def register():
    data = request.json
    print(data)
    passw = bytes(data['password'], 'UTF-8')

    salt = bcrypt.gensalt()
    hashedPass = bcrypt.hashpw(passw, salt)
    print(hashedPass)

    User(fname=data['fname'], lname=data['lname'], email=data['email'], phone=data["phone"], password=hashedPass).save()
    return {"success": True}