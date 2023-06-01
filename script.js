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
  const similarMovies = await fetchRelatedMovies(movie.id);
  const trailers = await fetchTrailers(movie.id);
  renderMovie(movieRes, actorRes, similarMovies, trailers);
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
// Fetch Similar Movies

const fetchRelatedMovies = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/similar`);
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
};

// Fetch Trailers

const fetchTrailers = async (movie_id) => {
  const url = constructUrl(`movie/${movie_id}/videos`);
  const res = await fetch(url);
  const data = await res.json();
  return data;
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
    class="rounded hover:bg-red-400 px-4 block whitespace-no-wrap text-white "
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
    <img src="${BACKDROP_BASE_URL + movie.backdrop_path}">
   
        <h3 class="mt-5">${movie.title}</h3>`;

    movieDiv.addEventListener("click", () => {
      movieDetails(movie, movie.id);
    });

    moviesContainer.appendChild(movieDiv);
  });
};

// Fetch All Actors

const fetchAllActors = async () => {
  const url = constructUrl("person/popular");
  const res = await fetch(url);
  const act = await res.json();
  return act;
};
fetchAllActors();
const movieActors = async () => {
  const actors = await fetchAllActors();
  renderActors(actors.results);
};

const renderActors = (actors) => {
  let id = 1;
  moviesContainer.innerHTML = "";
  actors.forEach((actor) => {
    let actorsDiv = document.createElement("div");
    actorsDiv.classList.add("actors");
    actorsDiv.id = id;
    id++;
    actorsDiv.innerHTML = `
        <img class="mt-5 actorBlur" src="${
          BACKDROP_BASE_URL + actor.profile_path
        }" alt="${actor.title} poster">
        <div class="actorsMov">
        <img src="${BACKDROP_BASE_URL + actor.known_for[0].backdrop_path}">
    <img src="${BACKDROP_BASE_URL + actor.known_for[1].backdrop_path}">
    <img src="${BACKDROP_BASE_URL + actor.known_for[2].backdrop_path}">
    </div>
        <h3 class="mt-5 text-xl">${actor.name}</h3>`;
    actorsDiv.addEventListener("click", () => {
      renderActor(actor);
      console.log(actor);
    });
    moviesContainer.appendChild(actorsDiv);
  });
};

// fetching actors' details
const fetchActorDetails = async (actor) => {
  const url = constructUrl(`person/${actor}`);
  const res = await fetch(url);
  return res.json();
};

const actorDetails = async (actor) => {
  const actorRes = await fetchActorDetails(actor.id);
  return actorRes;
};

const fetchActorRelatedMovies = async (actor) => {
  const url = constructUrl(`person/${actor}/combined_credits`);
  const res = await fetch(url);
  return res.json();
};

const actorRelatedMovieDetails = async (actor) => {
  const actorRelatedMoviesRes = await fetchActorRelatedMovies(actor.id);
  return actorRelatedMoviesRes;
};

const renderActor = async (actor) => {
  actor = await actorDetails(actor);
  let movies = await fetchActorRelatedMovies(actor.id);
  let slicedMovies = movies.cast.splice(0, 5);
  let gender;
  if (actor.gender === 1) {
    gender = "Female";
  } else if (actor.gender === 2) {
    gender = "Male";
  }
  CONTAINER.innerHTML = `
    <div class="row text-white">
        <div class="flex flex-col space-y-2 items-center text-center text-xl">
             <img width='200' height='200' class="rounded-full shadow-xl shadow-slate-900 mx-auto" src=${
               BACKDROP_BASE_URL + actor.profile_path
             } alt='${actor.name}'>
             <h3 id="movie-release-date" class='text-6xl py-2 font-bold'><b>${
               actor.name
             }</b></h3>
             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Gender</h3>
              <p class='text-slate-400'>${gender}</p>
             </div>


             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Popularity</h3>
              <p class='text-slate-400'>${actor.popularity}</p>
             </div>

             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Birthday</h3>
              <p class='text-slate-400'>${actor.birthday}</p>
             </div>

             <div class="deathday"></div>

             <div class='flex space-x-3 justify-center'>
              <h3 class='font-bold'>Place of Birth</h3>
              <p class='text-slate-400'>${actor.place_of_birth}</p>
             </div>

             <div class='flex space-x-3 justify-center w-1/2 '>
              <h3 class='font-bold'>Biography</h3>
              <p class='text-slate-400'>${actor.biography}</p>
             </div>
             <h3 class='text-3xl font-bold py-3'>Related Movies</h3>
            <ul class="similarMoviesList mb-10">
            ${slicedMovies.map(
              (movie) => `
            <li class="simMovie list-group-item m-2">
            <img class="similar-movie-img" src="${
              BACKDROP_BASE_URL + movie.backdrop_path
            }"><h5 class="text-center mt-5 text-xl">${movie.title}</h5>     
            </li>
    `
            )}`;
  const similarList = document.querySelectorAll(".simMovie");
  console.log(similarList);
  similarList.forEach((movie, index) => {
    movie.addEventListener("click", () => {
      movieDetails(slicedMovies[index], slicedMovies[index].id);
    });
  });
};

let actorsDiv = document.querySelector("#actorsDiv");
actorsDiv.addEventListener("click", movieActors);

// You'll need to play with this function in order to add features and enhance the style.

const renderMovie = async (movie, actors, similar, trailer) => {
  CONTAINER.innerHTML = `
    <div class="row text-white">
        <div class="col-md-4 flex items-center justify-center mt-5">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8 text-center p-6">
            <h2 class="text-5xl mb-10">${movie.title}</h2>
            <p id="movie-release-date" class="mb-2"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3 class="headersSec">Overview</h3>
            <p  class="text-xl m-auto max-w-5xl">${movie.overview}</p>
        </div>
        <div >
      <h3 class="headersSec text-center">Trailer</h3>
      <div class="movie-trailer">
        <iframe class="trailerVideo" src="https://www.youtube.com/embed/${
          trailer.results[0].key
        }?autoplay=1"></iframe>
      </div>
    </div> 
        <div >
            <h3 class="headers text-center" >Actors</h3>
        <ul id="actors" class="list-unstyled flex items-center justify-center w-full mt-5 mb-10 gap-20">


        </div>
        
        <h3 class="headers text-center">Similar Movies</h3>  
        <ul class="similarMoviesList mb-10"></ul>  
  </div>
          </li>
            </ul>
            </div>
    </div>`;
  const actorsList = document.querySelector("#actors");
  for (let i = 0; i < 5; i++) {
    const li = document.createElement("li");
    li.id = actors[i].name;
    li.classList = `flex flex-row items-center justify-center actors5`;
    li.innerHTML = `<img  src="${PROFILE_BASE_URL}/${actors[i].profile_path}"
      alt="" class="actor-img" >
      <h5 class ="text-center text-xl mt-2">${actors[i].name}</h5>`;
    actorsList.appendChild(li);
  }
  const actorsListEvent = document.querySelectorAll(".actors5");
  actorsListEvent.forEach((actor) => {
    actor.addEventListener("click", () => {
      renderActor(actor.id);
      console.log(actor.id);
    });
  });
  renderSimilarMov(similar);
};
// render similar Movies

const renderSimilarMov = (similarMovies) => {
  const similarList = document.querySelector(".similarMoviesList");
  similarMovies.slice(0, 5).map((movie) => {
    const movieSec = document.createElement("li");
    movieSec.innerHTML = `
    <li class="list-group-item m-2">
    <img class="similar-movie-img" src="${
      BACKDROP_BASE_URL + movie.backdrop_path
    }"><h5 class="text-center mt-5 text-xl">${movie.title}</h5>     
      </li>
    `;
    similarList.appendChild(movieSec);
    movieSec.addEventListener("click", () => {
      movieDetails(movie, movie.id);
    });
  });
};

// Fetch Search Movie

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

document.addEventListener("DOMContentLoaded", autorun);
