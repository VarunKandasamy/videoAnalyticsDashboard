from flask import Flask
from flask_cors import CORS
from models import db
from auth import login, register
from dotenv import load_dotenv
import os

from routes.video import video_bp
from routes.profile import profile_bp

load_dotenv()
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{os.getenv('DB_USER')}:{os.getenv('DB_PASS')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/login', methods=['POST'])
def handle_login():
    return login()
@app.route('/register', methods=['POST'])
def handle_register():
    return register()

app.register_blueprint(video_bp)
app.register_blueprint(profile_bp)

if __name__ == '__main__':
    app.run(debug=True)
