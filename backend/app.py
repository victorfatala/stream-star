import random
import requests
from flask import Flask, request, jsonify
from google.cloud import firestore
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "../backend/credentials.json"

db = firestore.Client()
TMDB_API_KEY = "faeec332ac19866492a9768d6bdade37" 

def get_tmdb_movie_info(movie_id):
    """Obtém informações detalhadas sobre um filme usando a TMDB API."""
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_API_KEY}&language=pt-BR"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Erro ao obter informações para o filme com ID {movie_id}. Status: {response.status_code}, Mensagem: {response.text}")
    return None

def fetch_popular_movies():
    """Obtém uma lista de filmes populares usando a TMDB API."""
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={TMDB_API_KEY}&language=pt-BR"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('results', [])
    else:
        print(f"Erro ao obter filmes populares. Status: {response.status_code}, Mensagem: {response.text}")
    return []

def fetch_top_rated_movies():
    """Obtém uma lista de filmes mais bem avaliados usando a TMDB API."""
    url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={TMDB_API_KEY}&language=pt-BR"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('results', [])
    else:
        print(f"Erro ao obter filmes mais bem avaliados. Status: {response.status_code}, Mensagem: {response.text}")
    return []

def generate_recommendations_for_user(user_id):
    """Gera recomendações de filmes para o usuário, excluindo filmes assistidos."""
    watched_response = requests.get(f"http://localhost:5000/watched/{user_id}")
    if watched_response.status_code == 200:
        watched_movies = watched_response.json().get("movies", [])
    else:
        watched_movies = []

    popular_movies = fetch_popular_movies()
    
    watched_movie_ids = {movie['id'] for movie in watched_movies}
    available_movies = [movie for movie in popular_movies if movie['id'] not in watched_movie_ids]

    if len(available_movies) < 10:
        available_movies = popular_movies 
    
    recommended_movies = random.sample(available_movies, min(10, len(available_movies)))
    
    recommendations = []
    for movie in recommended_movies:
        recommendations.append({
            'id': movie['id'],
            'title': movie['title'],
            'poster_path': movie.get('poster_path', ''),
            'overview': movie.get('overview', ''),
        })

    return {
        "message": "Recommendations generated and added successfully",
        "recommendations": recommendations
    }



@app.route("/watched/<user_id>", methods=["GET"])
def get_watched_movies(user_id):
    try:
        doc_ref = db.collection("watched").document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            return jsonify({"movies": data.get("movies", [])}), 200
        else:
            return jsonify({"movies": []}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/watched/<user_id>", methods=["POST"])
def add_watched_movie(user_id):
    try:
        if request.is_json:
            movie_data = request.get_json()
        else:
            return (
                jsonify({"error": "Request content type must be application/json"}),
                400,
            )

        doc_ref = db.collection("watched").document(user_id)
        doc = doc_ref.get()

        if doc.exists:
            data = doc.to_dict()
            movies = data.get("movies", [])
            movies = [movie for movie in movies if movie["id"] != movie_data["id"]]
            movies.append(movie_data)
        else:
            movies = [movie_data]

        doc_ref.set({"movies": movies}, merge=True)

        return jsonify({"message": "Movie added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/you/<user_id>", methods=["POST"])
def generate_recommendations(user_id):
    try:
        recommendations = generate_recommendations_for_user(user_id)
        doc_ref = db.collection("recommendations").document(user_id)
        doc_ref.set({"recommendations": recommendations}, merge=True)
        return (
            jsonify(
                {
                    "message": "Recommendations generated and added successfully",
                    "recommendations": recommendations,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/you/<user_id>", methods=["GET"])
def get_recommendations(user_id):
    try:
        doc_ref = db.collection("recommendations").document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            return jsonify({"recommendations": data.get("recommendations", [])}), 200
        else:
            return jsonify({"recommendations": []}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
