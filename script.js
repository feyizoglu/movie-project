"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
// const searchURL =
//   TMDB_BASE_URL + "/search/movie?" + "6f4621a95489dc57656a3d8c6fd529a1";
const CONTAINER = document.querySelector(".container");
const moviesContainer = document.querySelector(".movies-container");
const form = document.getElementById("form");
const search = document.getElementById("search");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${"6f4621a95489dc57656a3d8c6fd529a1"}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie, actors) => {
  const movieRes = await fetchMovie(movie.id);
  const actorRes = await fetchActors(actors);
  renderMovie(movieRes, actorRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};
const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  const act = await res.json();
  return act.cast;
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  Object.values(movies).map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movies");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie, movie.id);
      console.log(movie.id);
    });
    moviesContainer.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, actors) => {
  CONTAINER.innerHTML = `
    <div class="row text-white">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        <div>
            <h3 >Actors:</h3>
            <ul id="actors" class="list-unstyled">
            <li>${actors[0].name}</li>
            <li>${actors[1].name}</li>
            <li>${actors[2].name}</li>
            <li>${actors[3].name}</li>
            <li>${actors[4].name}</li>
            </ul>
            </div>
    </div>`;
};

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const searchTerm = search.value;

//   if (searchTerm) {
//     renderMovies(searchURL + "&query=" + searchTerm);
//   }
// });

document.addEventListener("DOMContentLoaded", autorun);
