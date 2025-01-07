# Filename - server.py

# Import flask and datetime module for showing date and time
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, request
import datetime
from flask_sqlalchemy import SQLAlchemy

# Initializing flask app
app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# SQLite Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chatbot.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    messages = db.relationship('Message', backref='user', lazy=True)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.now)
    is_bot = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Create tables
with app.app_context():
    db.create_all()

# Route for seeing a data
@app.route('/data')
def get_time():

    # Returning an api for showing in  reactjs
    return jsonify({
        'Name':"geek", 
        "Age":"22",
        "Date":datetime.datetime.now(), 
        "programming":"python"
        })

@app.route('/chat', methods=['POST'])
@cross_origin()
def chat():
    data = request.json
    message = data.get('message', '')
    username = data.get('username', 'anonymous')
    
    # Get or create user
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()
    
    # Store user message
    user_message = Message(
        content=message,
        user_id=user.id,
        is_bot=False
    )
    db.session.add(user_message)
    
    # Add your chatbot logic here
    response = f"You said: {message}"
    
    # Store bot response
    bot_message = Message(
        content=response,
        user_id=user.id,
        is_bot=True
    )
    db.session.add(bot_message)
    db.session.commit()
    
    return jsonify({"response": response})

    
# Running app
if __name__ == '__main__':
    app.run(debug=True)