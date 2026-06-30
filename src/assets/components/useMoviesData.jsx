import {React, useState, useEffect} from 'react'
const useMoviesData = () => {

  const currentYear = (new Date).getFullYear(); // Gets current year once upon loading
  const [allMovies, setAllMovies] = useState([]);  
  const [genres, setGenres] = useState({});
  const apiKey = import.meta.env.REACT_APP_API_KEY;
  console.log(`API key: ${apiKey}`);

  // Runs the function to fetch data once upon loading
  useEffect(() => {fetchMovies()}, []);
  // Fetches data from TMDB
  async function fetchMovies() {
    // Figure out genres before actual data so don't have to wait for it to load in
    const fetchedGenres = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
    const genresJson = await fetchedGenres.json();
    // Uses the reduce function to put it in a usable object form
    const genresObject = genresJson.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {});
    setGenres(genresObject);

    // Retrieves all info
    // API limits you to 500 pages of data total and there are lots more. So to circumvent this, just get data from each year. Still limited to 500 per year though. If I cared that much, I could then go per year per month
    // But there's over 1 million movies so only going up to 100 most popular per year is fine for demonstration
    // Go down to 1868 as earliest movie in TMDB records is from 1874. Gives a bit of a buffer if they find anything earlier to add  
    let fetchedData;
    let data;
    let allMovieIds = [];
    let fetchedDataCombined = [];
    for (let year=currentYear; year>1867; year--) {
      // Looks at the first page of each year and determines how many pages there are
      fetchedData = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&api_key=${apiKey}&sort_by=popularity.desc`);
      data = await fetchedData.json();  
        for (let i=0; i<data.results.length; i++) {
          if (!allMovieIds.includes(data.results[i].id)) {
            fetchedDataCombined.push(data.results[i]); 
            allMovieIds.push(data.results[i].id);
          }
        } 
      setAllMovies([...fetchedDataCombined]);          
      // API shows 20 entries per page, so go through each page per year from 2nd page onwards as first page already added
      for (let pageNo=2; pageNo < Math.min(data.total_pages, 5); pageNo++) {
        fetchedData = await fetch(`https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&api_key=${apiKey}&sort_by=popularity.desc&page=${pageNo}`);
        data = await fetchedData.json();
        for (let i=0; i<data.results.length; i++) {
          if (!allMovieIds.includes(data.results[i].id)) {
            fetchedDataCombined.push(data.results[i]); 
            allMovieIds.push(data.results[i].id);
          }
        }   
        // Sets the data in batches so the user isn't waiting for ages
        setAllMovies([...fetchedDataCombined]);       
    };  
    }  
  };
  return {allMovies, genres};  
};

export default useMoviesData
