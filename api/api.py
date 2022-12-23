import time
from flask import Flask
from flask_mongoengine import MongoEngine

app = Flask(__name__)

app.config['MONGODB_SETTINGS'] = {
    'db': 'programare',
    'host': 'localhost',
    'port': 27017
}

db = MongoEngine()
db.init_app(app)

class User(db.Document):
    name = db.StringField()
    email = db.StringField()

class Restante(db.Document):
    materii = db.ListField()

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/test')
def writeDB():
    Restante(materii=["mate", "logica"]).save()
    return {'success': True}