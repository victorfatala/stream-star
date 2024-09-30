import { FaStar } from "react-icons/fa";

const FavoriteButton = ({ toggleFavorite, selectedMovie, favorites }) => {
  return (
    <button
      className="favorite-button"
      onClick={() => toggleFavorite(selectedMovie)}
    >
      Favoritar
      <FaStar
        className="star-icon"
        color={favorites.has(selectedMovie.id) ? "#EA85FF" : "#453455"}
        size={25}
      />
    </button>
  );
};

export default FavoriteButton;
