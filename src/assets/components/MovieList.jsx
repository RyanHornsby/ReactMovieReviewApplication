import React from 'react'
import '../stylesheets/MovieList.css'
import fourOhFour from '../images/404.avif'

const MovieList = ({movie, genres}) => {
    // Some pre-built code I nabbed to convert the date into the format I want
    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        // Add ordinal suffix
        const getOrdinal = (n) => {
            if (n > 3 && n < 21) return 'th'; // covers 11th, 12th, 13th
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${getOrdinal(day)} ${month} ${year}`;
    }

    // Tidies up the genres into their actual values + puts in a nice string
    function genresCleaner(genreList) {
        let genreNames = [];
        for (let i=0; i<genreList.length; i++) {
            genreNames.push(genres[genreList[i]]);
        }
        return genreNames.join(", ")
    };

  return (
    <figure className="movieCard">
        <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" className="movieLink">
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : fourOhFour} alt="movie poster" className="moviePoster"/>
            <figcaption className="movieDetails">
                <div className="movieTitle">
                    {movie.title}
                </div>
                <div className="movieGenres">
                    {genresCleaner(movie.genre_ids)}
                </div>
                <div className="movieTechnicalInfo">
                    <div className="movieReleaseDate">
                        {formatDate(movie.release_date)}
                    </div>
                    <div className="movieRating">
                        {movie.vote_average.toFixed(1)} / 10 &#9733;
                    </div>
                </div>
            </figcaption>
        </a>
    </figure>
  )
}

export default MovieList
