import React, { useEffect, useState } from "react";
import "./styles/App.css";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";
import { RedirectToSignIn, useUser } from "@clerk/clerk-react";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const loadAll = async () => {
      const list = await Tmdb.getHomeList();
      setMovieList(list);

      const originals = list.filter(({ slug }) => slug === "originals");
      const randonChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      const chosen = originals[0].items.results[randonChosen];
      const chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  if (movieList.length <= 0 || !isLoaded) {
    return (
      <div className="loading">
        <img
          src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif"
          alt="loading"
        ></img>
      </div>
    );
  }

  if (!isLoaded || !isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="page">
      <Header />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item) => (
          <MovieRow
            key={item.title}
            title={item.title}
            items={item.items}
          ></MovieRow>
        ))}
      </section>
      <footer>Copyright © 2023 Netflyer</footer>
    </div>
  );
};
