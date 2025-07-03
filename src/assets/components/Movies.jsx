import {React, useState, useEffect, useMemo, useRef} from 'react'
import '../stylesheets/Movies.css'
import MoviesFilters from './MoviesFilters'
import MovieList from './MovieList'
import useMoviesData from './useMoviesData'

const Movies = () => {   
  // Gathers the movies data
  const {allMovies, genres} = useMoviesData();

  const [sortBy, setSortBy] = useState("Date");
  const [direction, setDirection] = useState("Descending");  
  const [starRating, setStarRating] = useState(0);
  const [loadAmount, setLoadAmount] = useState(50);

  const firstLoad = useRef("Preparing...");  

  // Updates the movies list to only include filters, even as new entries are being drawn in the background
  const filteredMovies = useMemo(() => {
    return allMovies.filter((movie) => movie.vote_average >= starRating)
  },[sortBy, direction, starRating, allMovies]);

  // Determines which movies to display based on the page and the direction
  const moviesToShow = useMemo(() => {
    let moviesCopy = [...filteredMovies];
    // If sorting by date instead of popularity, rejig
    if (sortBy==="Rating") {
      moviesCopy.sort((a, b) => b.vote_average - a.vote_average)
    }
    moviesCopy = direction === "Descending" ? [...moviesCopy] : [...moviesCopy].reverse();

    return moviesCopy.slice(0, loadAmount);
  }, [sortBy, direction, starRating, loadAmount, firstLoad.current]);

  // Counts the "first load" as only occuring after 200 milliseconds (otherwise we would show no data until a sort was changed)
  useEffect(() => {
    const timer = setTimeout(() => {
      firstLoad.current = "Loaded!";
    }, 200);

    return () => clearTimeout(timer);
  }, []);


  return (
    <main id="moviesSection">
        <MoviesFilters setDirection={setDirection} setSortBy={setSortBy} starRating={starRating} setStarRating={setStarRating}/>
        {/*Maps all the movies in the DB. Limits it to 50 per page. Each time you click "load more" it adds another 50.*/}
        <section id="moviesList">
            {
                moviesToShow.map((movie) => (
                    <MovieList key={movie.id} movie={movie} genres={genres}/>
                ))
            }
        </section>
        {/*If there are more movies to load, add a load more button, hide it at first as well*/}
        <div id="loadMoreSection">
          { loadAmount < filteredMovies.length && firstLoad.current === "Loaded!" ?
            <button id="loadMore" onClick={(()=>setLoadAmount(loadAmount+50))}>Load more...</button> :
            ""
          }
        </div>
    </main>
  )
}

export default Movies