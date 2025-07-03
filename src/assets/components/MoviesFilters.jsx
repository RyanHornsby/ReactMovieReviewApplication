import {React, useState} from 'react'
import '../stylesheets/MoviesFilters.css'

const MoviesFilters = ({setDirection, setSortBy, starRating, setStarRating}) => {
  function headAmongTheStars(e) {
    starRating !== e.target.value ? setStarRating(e.target.value) : setStarRating(0);
  };

  return (
    <section id="filterSection">
            <div id="filtersControls">  
            <h1>Trending movies</h1>      
            <div id="filtersContainer">
                <div id="byRatingsContainer">
                    <ul id="byRatings">
                        {/*If they click twice, remove the filter. Colour in up to the rating they selected*/}
                        <li className="movieRating" value="6" style={starRating >= 6 ? {color: "yellow"} : {}} onClick={(e)=>{headAmongTheStars(e)}}>&#9733;6+</li>
                        <li className="movieRating" value="7" style={starRating >= 7 ? {color: "yellow"} : {}} onClick={(e)=>{headAmongTheStars(e)}}>&#9733;7+</li>
                        <li className="movieRating" value="8" style={starRating >= 8 ? {color: "yellow"} : {}} onClick={(e)=>{headAmongTheStars(e)}}>&#9733;8+</li>
                    </ul>
                </div>
                <div id="sortingControls">
                    <div className="sortingContainer">
                        <select id="category" className="sortBy" onChange={(e)=>setSortBy(e.target.value)}>
                            <option value="Date">Date</option>
                            <option value="Rating">Rating</option>
                        </select>
                    </div>
                    <div className="sortingContainer">
                        <select id="direction" className="sortBy" defaultValue="Descending" onChange={(e)=>setDirection(e.target.value)}>
                            <option value="Ascending">Ascending</option>
                            <option value="Descending">Descending</option>
                        </select>
                    </div>
                </div>
            </div>  
        </div>      
    </section>    
  )
}

export default MoviesFilters
