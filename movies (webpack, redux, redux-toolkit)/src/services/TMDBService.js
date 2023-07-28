import useHttp from "../hooks/http.hook";
import defaultCardBg from "../assets/img/default-card-bg.jpg";

function useTMDBService() {
  const _apiKey = "api_key=9812aaba21d66c0454dbaff70447e37f";
  const _apiBase = "https://api.themoviedb.org/3/";
  const imageBaseUrl = "https://www.themoviedb.org/t/p/w1280";
  const photoActorBaseUrl = "https://www.themoviedb.org/t/p/w300_and_h450_bestv2";
  const { request } = useHttp();

  const getData = async (dataType, page = 1) => {
    const res = await request(`${_apiBase}trending/${dataType}/week?${_apiKey}&page=${page}&language=en-US`);

    switch (dataType) {
      case "movie":
        res.results = res.results.map(_transfromMovies);
        break;
      case "tv":
        res.results = res.results.map(_transfromTvshows);
        break;
      default:
        res.results = [];
    }

    return res;
  };

  const getSearchedData = async (dataType, page = 1, searchValue) => {
    const res = await request(`${_apiBase}search/${dataType}?${_apiKey}&query=${searchValue}&page=${page}&include_adult=false&language=en-US`);

    if (res.results.length) {
      switch (dataType) {
        case "movie":
          res.results = res.results.map(_transfromMovies);
          break;
        case "tv":
          res.results = res.results.map(_transfromTvshows);
          break;
        default:
          res.results = [];
      }
      return res;
    } else {
      return null;
    }
  };

  const getFilteredData = async (dataType, page = 1, filters) => {
    const sortBy = filters.sortBy ? `&sort_by=${filters.sortBy}` : "";
    const genres = filters.genres ? `&with_genres=${filters.genres}` : "";
    const rating = filters.rating ? `&vote_average.gte=${Number(filters.rating)}` : "";
    let dateFrom = "";
    let dateTo = "";

    switch (dataType) {
      case "movie":
        dateFrom = filters.dateFrom ? `&primary_release_date.gte=${filters.dateFrom}-01-01` : "";
        dateTo = filters.dateTo ? `&primary_release_date.lte=${filters.dateTo}-12-31` : "";
        break;
      case "tv":
        dateFrom = filters.dateFrom ? `&first_air_date.gte=${filters.dateFrom}-01-01` : "";
        dateTo = filters.dateTo ? `&first_air_date.lte=${filters.dateTo}-12-31` : "";
        break;
    }

    const url = `${_apiBase}discover/${dataType}?${_apiKey}&language=en-US&include_adult=false&page=${page}${sortBy}${dateFrom}${dateTo}${rating}${genres}`;
    const res = await request(url);

    switch (dataType) {
      case "movie":
        res.results = res.results.map(_transfromMovies);
        break;
      case "tv":
        res.results = res.results.map(_transfromTvshows);
        break;
      default:
        res.results = [];
    }

    return res;
  };

  const getSingleData = async (dataType, id) => {
    const res = await request(`${_apiBase}${dataType}/${id}?${_apiKey}`);

    switch (dataType) {
      case "movie":
        return _transfromMovies(res);
      case "tv":
        return _transfromTvshows(res);
      default:
        return null;
    }
  };

  const getSingleDataCredits = async (dataType, id) => {
    const res = await request(`${_apiBase}${dataType}/${id}/credits?${_apiKey}&language=en-US`);
    return _transfromCast(res.cast);
  };

  const getSimilarData = async (dataType, id) => {
    const res = await request(`${_apiBase}${dataType}/${id}/similar?${_apiKey}&language=en-US&page=1`);

    switch (dataType) {
      case "movie":
        return res.results.map(_transfromMovies);
      case "tv":
        return res.results.map(_transfromTvshows);
      default:
        return null;
    }
  };

  const getTopRatedData = async (dataType, page = 1) => {
    const res = await request(`${_apiBase}${dataType}/top_rated?${_apiKey}&page=${page}&include_adult=false&language=en-US`);

    switch (dataType) {
      case "movie":
        return res.results.map(_transfromMovies);
      case "tv":
        return res.results.map(_transfromTvshows);
      default:
        return [];
    }
  };

  const getDataGenres = async (dataType) => {
    return await request(`${_apiBase}genre/${dataType}/list?${_apiKey}`);
  };

  const _transfromMovies = (movie) => {
    return {
      dataType: "movie",
      id: movie.id,
      title: movie.title,
      description: movie.overview || "There is no description...",
      image: movie.poster_path ? imageBaseUrl + movie.poster_path : null,
      imageBg: movie.backdrop_path ? imageBaseUrl + movie.backdrop_path : defaultCardBg,
      date: movie.release_date,
      rating: Math.round(movie.vote_average * 10) / 10,
      genres: movie.genres,
      runtime: movie.runtime,
      budget: movie.budget,
      revenue: movie.revenue,
    };
  };

  const _transfromTvshows = (show) => {
    return {
      dataType: "tv",
      id: show.id,
      title: show.name,
      description: show.overview || "There is no description...",
      image: show.poster_path ? imageBaseUrl + show.poster_path : null,
      imageBg: show.backdrop_path ? imageBaseUrl + show.backdrop_path : defaultCardBg,
      date: show.first_air_date,
      rating: Math.round(show.vote_average * 10) / 10,
      genres: show.genres,
    };
  };

  const _transfromCast = (cast) => {
    const actors = [];

    for (let item of cast) {
      if (item.known_for_department === "Acting") {
        actors.push(item);
      }

      if (actors.length >= 10) break;
    }

    return actors.map((actor) => {
      return {
        id: actor.id,
        photo: actor.profile_path ? photoActorBaseUrl + actor.profile_path : null,
        name: actor.name,
        character: actor.character,
      };
    });
  };

  return {
    getData,
    getSearchedData,
    getFilteredData,
    getTopRatedData,
    getSingleData,
    getSingleDataCredits,
    getSimilarData,
    getDataGenres,
  };
}

export default useTMDBService;
