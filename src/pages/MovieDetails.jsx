import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import Header from "../components/Header";
import "../styles/MovieDetails.css";
import { useUser } from "@clerk/clerk-react";

const MovieDetails = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const { isLoaded, user, isSignedIn } = useUser();

  useEffect(() => {
    const fetchData = async (url, setDataCallback) => {
      const response = await fetch(url);
      const data = await response.json();
      setDataCallback(data);
    };

    fetchData(
      `https://api.themoviedb.org/3/movie/${id}?api_key=bb2818a2abb39fbdf6da79343e5e376b`,
      setMovieDetails
    );
    fetchData(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=bb2818a2abb39fbdf6da79343e5e376b`,
      (data) => setRecommendations(data.results.slice(0, 10))
    );
  }, [id]);

  if (!movieDetails || !isLoaded) {
    return (
      <div className="loading">
        <img
          src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
          alt="loading"
        ></img>
      </div>
    );
  }

  const overview = showFullOverview
    ? movieDetails.overview
    : movieDetails.overview.slice(0, 150) +
      (movieDetails.overview.length > 150 ? "..." : "");

  return (
    <>
      <Header />
      <div className="movieDetails">
        <div className="movie-info">
          <div className="image-container">
            <a href={`/watch/movie/${id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title || movieDetails.name}
              />
              <div className="overlay">
                <img src="/play.png" alt="Video Logo" className="video-logo" />
              </div>
            </a>
          </div>
          <h1>{movieDetails.original_title}</h1>
          <p>{overview}</p>
          {movieDetails.overview.length > 150 && (
            <button onClick={() => setShowFullOverview(!showFullOverview)}>
              {showFullOverview ? "Read Less" : "Read More"}
            </button>
          )}

          <p>
            Letterboxd:{" "}
            <a
              className="letterboxd"
              href={`https://letterboxd.com/tmdb/${id}`}
            >
              {movieDetails.original_title}
            </a>
          </p>
          <p>Release Date: {movieDetails.release_date}</p>
          <p>Runtime: {movieDetails.runtime} minutes</p>
          <p>
            Genres: {movieDetails.genres.map((genre) => genre.name).join(", ")}
          </p>
          {recommendations.length === 0 ? (
            <>Recommended Movies: 0</>
          ) : (
            <MovieRow
              title="Recommended Movies"
              items={{ results: recommendations }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
