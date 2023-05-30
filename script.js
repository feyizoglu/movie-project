"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const API_KEY = "api_key=6f4621a95489dc57656a3d8c6fd529a1";
const API_URL =
  TMDB_BASE_URL + "/discover/movie?sort_by=now_playing.desc&" + API_KEY;
const searchURL = TMDB_BASE_URL + "/search/movie?" + API_KEY;
const CONTAINER = document.querySelector(".containerDiv");
const moviesContainer = document.querySelector(".movies-container");
const form = document.getElementById("form");
const search = document.getElementById("search");
const genreList = document.querySelector("#genreList");
// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

const home = document.querySelector("#home");
home.addEventListener("click", () => {
  window.location.reload();
});

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

//Genre Section
const fetchGenre = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  const gen = await res.json();

  gen.genres.forEach((genre) => {
    const genreDiv = document.createElement("li");
    genreDiv.classList.add("genreContainer");
    genreDiv.innerHTML = `
    <a
    class="rounded hover:bg-red-400 px-4 block whitespace-no-wrap text-white"
    href="#"
    >${genre.name}</a
  >
    `;
    genreList.appendChild(genreDiv);
    genreDiv.addEventListener("click", () => {
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=6f4621a95489dc57656a3d8c6fd529a1&with_genres=${genre.id}`
      )
        .then((res) => res.json())
        .then((data) => data.results)
        .then((movies) => renderMovies(movies));
    });
  });

  return gen.genres;
};
fetchGenre();

// Filter Section
const filterPopular = document.querySelectorAll(".filter");
filterPopular.forEach((filter) => {
  filter.addEventListener("click", () => {
    fetch(
      `https://api.themoviedb.org/3/movie/${filter.id}?api_key=6f4621a95489dc57656a3d8c6fd529a1`
    )
      .then((res) => res.json())
      .then((data) => data.results)
      .then((movies) => renderMovies(movies));
  });
});

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  let id = 1;
  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    let movieDiv = document.createElement("div");
    movieDiv.classList.add("movies");
    movieDiv.id = id;
    id++;
    movieDiv.innerHTML = `
        <img class="mt-5" src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${
      movie.title
    } poster">
        <h3 class="mt-5">${movie.title}</h3>`;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie, movie.id);
    });

    moviesContainer.appendChild(movieDiv);
  });
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, actors) => {
  console.log(movie);
  CONTAINER.innerHTML = `
    <div class="row text-white">
        <div class="col-md-4 flex items-center justify-center mt-5">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8 text-center p-6">
            <h2 class="text-3xl mb-5">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3 class="mt-3 mb-3 text-2xl">Overview:</h3>
            <p id="movie-overview" class="m-auto max-w-5xl">${
              movie.overview
            }</p>
        </div>
        <div >
            <h3 class="text-center mb-5 text-3xl" >Actors</h3>
            <ul id="actors" class="list-unstyled flex items-center justify-center w-full">
            <li>



        <div class="flex items-center justify-center w-full ">
        <div class="flex flex-col items-center justify-center ">
        <img src="${PROFILE_BASE_URL}/${actors[0].profile_path}"
        alt="" class="actor-img" >
        <h5 class ="text-center text-xl">${actors[0].name}</h5>
        </div>

        <div class="flex flex-col items-center justify-center ">
        <img src="${PROFILE_BASE_URL}/${actors[1].profile_path}"
        alt="" class="actor-img" >
        <h5 class ="text-center text-xl">${actors[1].name}</h5>
        </div>

        <div class="flex flex-col items-center justify-center ">
        <img src="${PROFILE_BASE_URL}/${actors[2].profile_path}"
        alt="" class="actor-img" >
        <h5 class ="text-center text-xl">${actors[2].name}</h5>

        </div>

        <div class="flex flex-col items-center justify-center ">
        <img src="${PROFILE_BASE_URL}/${actors[3].profile_path}"
        alt="" class="actor-img" >
        <h5 class ="text-center text-xl">${actors[3].name}</h5>

        </div>

        <div class="flex flex-col items-center justify-center ">
        <img src="${PROFILE_BASE_URL}/${actors[4].profile_path}"
        alt="" class="actor-img" >
        <h5 class ="text-center text-xl">${actors[4].name}</h5>

        </div>
        </div>

        
  </div>

          </li>
            
            </ul>
            </div>
    </div>`;
};

const fetchSearchMovies = async (url) => {
  const res = await fetch(url);
  const sea = await res.json();
  if (sea.results) {
    renderMovies(sea.results);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  console.log(searchTerm);
  if (searchTerm) {
    fetchSearchMovies(searchURL + "&query=" + searchTerm);
  }
});

// ${PROFILE_BASE_URL}/${actors[0].profile_path}
// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const searchTerm = search.value;

//   if (searchTerm) {
//     renderMovies(searchURL + "&query=" + searchTerm);
//   }
// });

document.addEventListener("DOMContentLoaded", autorun);
