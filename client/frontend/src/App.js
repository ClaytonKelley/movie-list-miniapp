import './App.css';
import {useEffect, useState} from 'react'

function App() {

  const [movieList, setMovieList] = useState([])
  const [moviesearch, setMovieSearch] = useState('')
  const [addMovie, setAddMovie] = useState({})

useEffect(() => {
  fetchMovies();
}, [addMovie])

const fetchMovies = () => {
    fetch(`http://localhost:8080/movies/`)
      .then((response) => response.json())
      .then((moviesdata) => setMovieList(moviesdata))
  };

const searchaMovie = (event) => {
  event.preventDefault()
     fetch(`http://localhost:8080/movies/${moviesearch}`)
      .then((response) => response.json())
      .then((moviesdata) => setMovieList(moviesdata))
      .then(() => document.getElementById("movieSearchbox").value = "")
}

const clearSearch = (event) => {
  event.preventDefault()
    setMovieSearch('')
    fetchMovies()
}

const postAddMovie = (event) => {
  event.preventDefault();
  const movie = {
      "title": document.getElementById('addmoviebox').value
  }
  fetch("http://localhost:8080/movies", {
    method: "POST",
    body: JSON.stringify(movie),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(() => document.getElementById('addmoviebox').value = '')
  .then(() => fetchMovies())
}

const deleteMovie = (movieTitle) => {
  console.log('mymovietitle',movieTitle)
  const movie ={
    "title" : movieTitle
  }
  fetch(`http://localhost:8080/movies/`, {
    method: 'DELETE',
    body: JSON.stringify(movie),
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(() => fetchMovies())
}




  return (
    <div className="App">
      <form onSubmit = {(event) => searchaMovie(event)}>
        <label>
          Search a movie:
          <input id = 'movieSearchbox' type="text" name="name" onChange={(event) => setMovieSearch(event.target.value)} />
        </label>
          <input type="submit" value="Submit" />
          <button type="button" onClick = {(event) => clearSearch(event)}>Clear</button>
      </form>


      <form onSubmit = {(event) => postAddMovie(event)}>
        <label>
          Add a Movie:
          <input id = 'addmoviebox' type="text" name="name"/>
        </label>
          <input type="submit" value="Submit" />
      </form>

        {movieList.map((movie, index) => <p key = {index} ><button>Watched</button> {movie.title} <button onClick = {() => deleteMovie(movie.title)}>X</button></p>)}
    </div>
  );
}

export default App;
