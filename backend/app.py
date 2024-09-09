from flask import Flask, request, jsonify
from google.cloud import firestore
import os

app = Flask(__name__)


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./credentials.json"  

db = firestore.Client()

@app.route('/watched/<user_id>', methods=['GET'])
def get_watched_movies(user_id):
    try:
        doc_ref = db.collection('watched').document(user_id)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            return jsonify({"movies": data.get("movies", [])}), 200
        else:
            return jsonify({"movies": []}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/watched/<user_id>', methods=['POST'])
def add_watched_movie(user_id):
    try:
        if request.is_json:
            movie_data = request.get_json()
        else:
            return jsonify({"error": "Request content type must be application/json"}), 400
        
        doc_ref = db.collection('watched').document(user_id)
        
        doc_ref.set({
            "movies": firestore.ArrayUnion([movie_data])
        }, merge=True)
        
        return jsonify({"message": "Movie added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
