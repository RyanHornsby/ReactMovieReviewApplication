import {React, useState, useEffect} from 'react'

const useMoviesData = () => {

  const currentYear = (new Date).getFullYear(); // Gets current year once upon loading
  const [allMovies, setAllMovies] = useState([]);  
  const [genres, setGenres] = useState({});
  const apiKey = process.env.REACT_APP_API_KEY;

  // Runs the function to fetch data once upon loading
  useEffect(() => {fetchMovies()}, []);
  // Fetches data from TMDB
async function fetchMovies() {
  try {
    // 1. Fetch and format genres
    const fetchedGenres = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
    const genresJson = await fetchedGenres.json();
    const genresObject = genresJson.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
    setGenres(genresObject);

    // 2. Create an array of years we want to fetch
    const years = [];
    for (let year = currentYear; year > 1867; year--) {
      years.push(year);
    }

    // 3. Map years to an array of concurrent fetch promises
    // To avoid hitting API rate limits all at once, we fetch pages 1-4 for each year together
    const fetchPromises = years.map(async (year) => {
      try {
        // Fetch the first page to get total pages
        const firstPageResponse = await fetch(
          `https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&api_key=${apiKey}&sort_by=popularity.desc&page=1`
        );
        if (!firstPageResponse.ok) return [];
        const firstPageData = await firstPageResponse.ok ? await firstPageResponse.json() : { results: [] };
        
        let yearMovies = [...(firstPageData.results || [])];
        const maxPages = Math.min(firstPageData.total_pages || 0, 4);

        // If there are more pages, fetch them concurrently for this specific year
        if (maxPages > 1) {
          const pagePromises = [];
          for (let pageNo = 2; pageNo <= maxPages; pageNo++) {
            pagePromises.push(
              fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&api_key=${apiKey}&sort_by=popularity.desc&page=${pageNo}`)
                .then(res => res.ok ? res.json() : { results: [] })
                .then(data => data.results || [])
                .catch(() => []) // Gracefully handle single page failures
            );
          }
          const additionalPagesResults = await Promise.all(pagePromises);
          yearMovies = yearMovies.concat(additionalPagesResults.flat());
        }

        return yearMovies;
      } catch (err) {
        console.error(`Error fetching movies for year ${year}:`, err);
        return [];
      }
    });

    // 4. Resolve all years concurrently
    const allMoviesByYear = await Promise.all(fetchPromises);

    // 5. Flatten results and filter duplicates using a Set (O(1) lookup time)
    const seenIds = new Set();
    const uniqueMovies = [];

    allMoviesByYear.flat().forEach((movie) => {
      if (movie && movie.id && !seenIds.has(movie.id)) {
        seenIds.add(movie.id);
        uniqueMovies.push(movie);
      }
    });

    // 6. Set state exactly ONCE to prevent hundreds of unnecessary re-renders
    setAllMovies(uniqueMovies);

  } catch (error) {
    console.error("Critical error in fetchMovies:", error);
  }
}

export default useMoviesData;
