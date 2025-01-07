# Filename - server.py

# Import flask and datetime module for showing date and time
from flask_cors import CORS
from flask import Flask, jsonify, request
import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initializing flask app
app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# SQLite Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    messages_sent = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender', lazy=True)
    messages_received = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

# Message Model
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
    
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/users', methods=['GET'])
def get_users():
    current_user_id = request.args.get('current_user_id', type=int)
    users = User.query.filter(User.id != current_user_id).all()
    return jsonify([{
        'id': user.id,
        'username': user.username
    } for user in users])

@app.route('/messages', methods=['POST'])
def send_message():
    data = request.json
    new_message = Message(
        content=data['content'],
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id']
    )
    
    try:
        db.session.add(new_message)
        db.session.commit()
        return jsonify({
            'id': new_message.id,
            'content': new_message.content,
            'timestamp': new_message.timestamp.isoformat(),
            'sender_id': new_message.sender_id,
            'receiver_id': new_message.receiver_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/messages/<int:user1_id>/<int:user2_id>', methods=['GET'])
def get_messages(user1_id, user2_id):
    messages = Message.query.filter(
        ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id)) |
        ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id))
    ).order_by(Message.timestamp).all()
    
    return jsonify([{
        'id': message.id,
        'content': message.content,
        'timestamp': message.timestamp.isoformat(),
        'sender_id': message.sender_id,
        'receiver_id': message.receiver_id
    } for message in messages])

# Running app
if __name__ == '__main__':
    app.run(debug=True)