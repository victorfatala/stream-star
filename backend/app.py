from flask import Flask, request, jsonify
from google.cloud import firestore
import os
from flask_cors import CORS

# Adicione isto logo após a criação do app

app = Flask(__name__)

CORS(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "../backend/credentials.json"  

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
            print(f"Dados recebidos para o usuário {user_id}: {movie_data}")
        else:
            return jsonify({"error": "Request content type must be application/json"}), 400
        
        doc_ref = db.collection('watched').document(user_id)
        doc = doc_ref.get()

        if doc.exists:
            data = doc.to_dict()
            movies = data.get("movies", [])
            movies = [movie for movie in movies if movie['id'] != movie_data['id']]
            movies.append(movie_data)
        else:
            movies = [movie_data]

        doc_ref.set({
            "movies": movies
        }, merge=True)

        print(f"Filme adicionado com sucesso para o usuário {user_id}.")
        return jsonify({"message": "Movie added successfully"}), 200
    except Exception as e:
        print(f"Erro ao adicionar filme: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)