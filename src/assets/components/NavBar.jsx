import React from 'react'
import "../stylesheets/NarBar.css"

const NavBar = () => {
  return (
    <header>
      <a href="index.html">
        <h1 id="appName">
          Kinospective
        </h1>
      </a>
      <nav>
        <a href="#">Trending movies</a>
        <a href="#">All-time Top 100</a>
        <a href="#">Personal favourites</a>
        <a href="#">Auteur</a>
      </nav>
    </header>
  )
}

export default NavBar
