import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendar,
  FaHashtag,
  FaMinus,
  FaPlus,
  FaRegClock,
  FaRegStar,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { LuPopcorn } from "react-icons/lu";
import StarRating from "./StarRating";

const average = (arr) => {
  const validNumbers = arr.filter(Number.isFinite);

  if (validNumbers.length === 0) return 0;

  return validNumbers.reduce((acc, cur) => acc + cur, 0) / validNumbers.length;
};

const KEY = "ddd8017e";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error("Something went wrong while fetching movies.");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error(data.Error || "Movies not found.");
        }

        setMovies(data.Search || []);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error(error.message);
        setError(error.message);
        setMovies([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (query.trim().length < 3) {
      setMovies([]);
      setError("");
      setIsLoading(false);
      return;
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  const handleOpenMovieDetails = (id) => {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  };

  const handleCloseMovieDetails = () => {
    setSelectedId(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };

  const handleDltWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  return (
    <>
      <Navbar>
        <Logo></Logo>
        <Search query={query} setQuery={setQuery}></Search>
        <NumResults movies={movies}></NumResults>
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onOpenDetails={handleOpenMovieDetails} />
          )}
          {error && <ErrorMsg msg={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onOpenDetails={handleOpenMovieDetails}
              onCloseDetails={handleCloseMovieDetails}
              onAddWatched={handleAddWatched}
              watched={watched}
            ></MovieDetails>
          ) : (
            <>
              <WatchedSummary watched={watched}></WatchedSummary>
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDltWatched}
              ></WatchedList>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-base-300/70 bg-base-100/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        {children}
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20">
        <LuPopcorn className="text-2xl" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-xl font-black tracking-tight text-base-content sm:text-2xl">
          Use<span className="text-primary">Popcorn</span>
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/45">
          Your personal movie journal
        </p>
      </div>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <label className="relative block w-full min-w-0 flex-1 lg:max-w-2xl">
      <span className="sr-only">Search movies</span>
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base-content/40">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5"
          aria-hidden="true"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m16 16 4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        type="search"
        placeholder="Search movies by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input input-bordered h-12 w-full rounded-2xl border-base-300/80 bg-base-200/60 pl-12 pr-4 text-sm shadow-inner shadow-black/2 transition focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-4 focus:ring-primary/10"
      />
      <span className="pointer-events-none absolute inset-y-0 right-4 hidden items-center text-[11px] font-semibold text-base-content/35 sm:flex">
        TYPE TO SEARCH
      </span>
    </label>
  );
}

function NumResults({ movies }) {
  return (
    <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-base-300/70 bg-base-200/60 px-3.5 py-2 lg:self-auto">
      <span className="size-2 rounded-full bg-primary" />
      <p className="text-xs font-medium text-base-content/65 sm:text-sm">
        <strong className="font-extrabold text-base-content">
          {movies.length}
        </strong>{" "}
        {movies.length === 1 ? "movie found" : "movies found"}
      </p>
    </div>
  );
}

function Main({ children }) {
  return (
    <main className="min-h-[calc(100vh-88px)] bg-base-200/40 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-7">
        {children}
      </div>
    </main>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="relative min-w-0 rounded-3xl border border-base-300/70 bg-base-100 shadow-sm">
      <div className="flex min-h-12 items-center justify-end border-b border-base-300/50 px-3 py-2">
        <button
          type="button"
          className="btn btn-circle btn-ghost btn-sm"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Collapse section" : "Expand section"}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaMinus /> : <FaPlus />}
        </button>
      </div>

      {isOpen ? (
        <div className="min-w-0">{children}</div>
      ) : (
        <div className="flex min-h-20 items-center justify-center px-4 text-sm text-base-content/50">
          Section collapsed. Click + to expand.
        </div>
      )}
    </section>
  );
}

function MovieList({ movies, onOpenDetails }) {
  if (!movies.length) {
    return (
      <div className="flex min-h-120 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <LuPopcorn className="text-3xl" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-base-content">
          Find your next favorite
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-6 text-base-content/55">
          Search for a movie by title. Start with at least three characters to
          explore the catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="flex max-h-[75vh] min-h-0 flex-col p-2 sm:p-3">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-3 pb-3 pt-3">
        <div>
          <h2 className="text-sm font-extrabold tracking-tight text-base-content">
            Search results
          </h2>
          <p className="mt-0.5 text-xs text-base-content/45">
            Select a title to view details
          </p>
        </div>

        <span className="badge badge-ghost font-semibold">
          {movies.length} titles
        </span>
      </div>

      {/* Scrollable movie list */}
      <ul className="min-h-0 flex-1 divide-y divide-base-300/60 overflow-y-auto overscroll-contain">
        {movies.map((movie) => (
          <Movie
            movie={movie}
            key={movie.imdbID}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </ul>
    </div>
  );
}

function Movie({ movie, onOpenDetails }) {
  const posterAvailable = movie.Poster && movie.Poster !== "N/A";

  return (
    <li
      onClick={() => onOpenDetails(movie.imdbID)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetails(movie.imdbID);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.Title}`}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl px-3 py-4 transition duration-200 hover:bg-base-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:gap-5 sm:px-4"
    >
      {posterAvailable ? (
        <img
          src={movie.Poster}
          alt={`${movie.Title} poster`}
          loading="lazy"
          className="h-19 w-13.5 shrink-0 rounded-xl bg-base-200 object-cover shadow-md transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg sm:h-22 sm:w-15.5"
        />
      ) : (
        <div className="flex h-19 w-13.5 shrink-0 items-center justify-center rounded-xl bg-base-200 text-base-content/35 sm:h-22 sm:w-15.5">
          <LuPopcorn className="text-2xl" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-base-content transition-colors group-hover:text-primary sm:text-base">
          {movie.Title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-base-content/55 sm:text-sm">
          <FaCalendar className="shrink-0 text-primary/70" aria-hidden="true" />
          <span>{movie.Year}</span>
          <span className="size-1 rounded-full bg-base-content/25" />
          <span className="capitalize">{movie.Type || "Movie"}</span>
        </div>
      </div>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-base-300/70 text-base-content/35 transition group-hover:border-primary/20 group-hover:bg-primary group-hover:text-primary-content">
        <span aria-hidden="true">↗</span>
      </span>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => Number(movie.imdbRating)),
  );
  const avgUserRating = average(
    watched.map((movie) => Number(movie.userRating)),
  );
  const avgRuntime = average(watched.map((movie) => Number(movie.runtime)));

  return (
    <div className="border-b border-base-300/70 bg-linear-to-br from-primary/10 via-base-100 to-base-100 px-5 pb-5 pt-6 sm:px-6">
      <div className="mb-5 flex items-start justify-between gap-3 pr-10">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">
            Your collection
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-base-content sm:text-2xl">
            Movies you watched
          </h2>
          <p className="mt-1 text-xs text-base-content/50">
            A little snapshot of your movie taste
          </p>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-md shadow-primary/20">
          <FaStar className="text-lg" />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryStat
          icon={<FaHashtag />}
          label="Watched"
          value={watched.length}
        />
        <SummaryStat
          icon={<FaStar />}
          label="IMDb avg."
          value={avgImdbRating.toFixed(1)}
        />
        <SummaryStat
          icon={<FaRegStar />}
          label="Your avg."
          value={avgUserRating.toFixed(1)}
        />
        <SummaryStat
          icon={<FaRegClock />}
          label="Avg. runtime"
          value={Math.round(avgRuntime)}
        />
      </div>
    </div>
  );
}

function SummaryStat({ icon, label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-base-300/60 bg-base-100/90 p-3 sm:p-3.5 text-center">
      <div className="flex items-center justify-center gap-2 text-primary">
        <span className="text-sm">{icon}</span>
        <span className="truncate text-[10px] font-bold uppercase tracking-wider text-base-content/45">
          {label}
        </span>
      </div>
      <p className="mt-2 text-xl font-black tracking-tight text-base-content sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  if (!watched.length) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/35">
          <FaRegStar className="text-2xl" />
        </div>
        <h3 className="mt-4 text-sm font-bold text-base-content">
          Your watch history starts here
        </h3>
        <p className="mt-1.5 max-w-xs text-xs leading-5 text-base-content/50">
          Movies you rate and mark as watched will appear in this collection.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-base-300/60 p-2 sm:p-3">
      {watched.map((movie) => (
        <WatchedMovie
          onDeleteWatched={onDeleteWatched}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  const posterAvailable = movie.poster && movie.poster !== "N/A";

  return (
    <li className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-base-200/60 sm:gap-4 sm:px-4">
      {/* Movie Poster */}
      <div className="shrink-0">
        {posterAvailable ? (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="h-20 w-14 rounded-lg bg-base-200 object-cover shadow-sm sm:h-24 sm:w-16"
          />
        ) : (
          <div className="flex h-20 w-14 items-center justify-center rounded-lg bg-base-200 text-base-content/35 sm:h-24 sm:w-16">
            <LuPopcorn className="text-2xl" />
          </div>
        )}
      </div>

      {/* Movie Information */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-bold leading-5 text-base-content sm:text-base">
          {movie.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-base-content/60 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <FaStar className="shrink-0 text-amber-500" />
            <span>{movie.imdbRating || "N/A"}</span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <FaRegStar className="shrink-0 text-primary" />
            <span>{movie.userRating || "N/A"}</span>
          </span>

          <span className="inline-flex items-center gap-1.5">
            <FaRegClock className="shrink-0 text-base-content/40" />
            <span>{movie.runtime || "N/A"}</span>
          </span>
        </div>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => onDeleteWatched(movie.imdbID)}
        aria-label={`Remove ${movie.title} from watched movies`}
        title="Remove from watched"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-base-content/50 transition-colors hover:bg-error/10 hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
      >
        <span className="text-xl leading-none" aria-hidden="true">
          <FaTimes />
        </span>
      </button>
    </li>
  );
}

function Loader() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
      <span className="loading loading-spinner loading-lg text-primary" />
      <p className="mt-5 text-sm font-bold text-base-content">
        Finding your movie...
      </p>
      <p className="mt-1 text-xs text-base-content/50">
        Searching the movie database
      </p>
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div
      role="alert"
      className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center"
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-error/10 text-2xl">
        !
      </span>
      <h2 className="mt-4 text-base font-extrabold text-base-content">
        We couldn't find that
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-error">{msg}</p>
      <p className="mt-2 text-xs text-base-content/45">
        Try another title or check the spelling.
      </p>
    </div>
  );
}

function MovieDetails({ selectedId, onCloseDetails, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.imdbRating;

  const {
    Actors: actors,
    Awards: awards,
    BoxOffice: boxOffice,
    Country: country,
    Director: director,
    Genre: genre,
    Language: language,
    Metascore: metascore,
    Plot: plot,
    Poster: poster,
    Rated: rated,
    Ratings: ratings,
    Released: released,
    Runtime: runtime,
    Title: title,
    Type: type,
    Writer: writer,
    Year: year,
    imdbID,
    imdbRating,
    imdbVotes,
  } = movie;

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  useEffect(() => {
    const controller = new AbortController();

    async function getMovieDetails() {
      try {
        setIsLoading(true);
        setError("");
        setMovie({});

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch movie details.");
        }

        const data = await res.json();

        if (data.Response === "False") {
          throw new Error(data.Error || "Movie not found.");
        }

        setMovie(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    if (selectedId) getMovieDetails();

    return () => controller.abort();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;

    document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Escape") {
        onCloseDetails();
        console.log("hello world");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCloseDetails]);

  if (isLoading) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-xl">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-5 text-base font-semibold">Loading movie details...</p>
        <p className="mt-1 text-sm text-base-content/50">
          Please wait while we get the details.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex min-h-80 flex-col items-center justify-center rounded-2xl border border-base-300 bg-base-100 px-6 py-12 text-center shadow-xl">
        <button
          className="btn btn-circle btn-ghost btn-sm absolute top-4 right-4"
          onClick={onCloseDetails}
          aria-label="Close movie details"
        >
          <FaTimes />
        </button>
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-error/10 text-3xl">
          🎬
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Movie not found</h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-error">{error}</p>
        <button
          className="btn btn-primary mt-6 rounded-xl px-6"
          onClick={onCloseDetails}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!title) return null;

  const movieGenres = genre ? genre.split(",").map((item) => item.trim()) : [];

  const movieRatings = Array.isArray(ratings) ? ratings : [];

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseDetails();
  };

  return (
    <section className="mx-auto max-h-[75vh] w-full max-w-5xl overflow-y-auto overscroll-contain rounded-2xl border border-base-300/80 bg-base-100 text-base-content shadow-2xl shadow-black/10 sm:rounded-3xl">
      {/* Movie Header */}
      <header className="relative isolate overflow-hidden bg-neutral text-neutral-content">
        {poster && poster !== "N/A" && (
          <div
            className="absolute inset-0 -z-20 scale-110 bg-cover bg-center opacity-25 blur-2xl"
            style={{ backgroundImage: `url("${poster}")` }}
          />
        )}

        <div className="absolute inset-0 -z-10 bg-linear-to-br from-neutral/85 via-neutral/95 to-neutral" />

        <button
          type="button"
          className="btn btn-circle btn-sm absolute top-4 left-4 z-20! border border-white/15 bg-black/30 text-white shadow-lg backdrop-blur-md transition duration-200 hover:-translate-x-1 hover:border-white/30 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:top-5 sm:right-5"
          onClick={onCloseDetails}
          aria-label="Go back"
          title="Go back"
        >
          <FaArrowLeft />
        </button>

        <button
          className="btn btn-circle btn-sm absolute top-4 right-4 z-20 border border-white/15 bg-black/30 text-white shadow-lg backdrop-blur-md transition duration-200 hover:rotate-90 hover:border-white/30 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:top-5 sm:right-5"
          onClick={onCloseDetails}
          aria-label="Close movie details"
          title="Close details"
        >
          <FaTimes />
        </button>

        <div className="grid gap-6 p-5 pt-14 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-8 sm:p-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 lg:p-10">
          {/* Poster */}
          <div className="mx-auto w-36 sm:w-full">
            <img
              src={
                poster && poster !== "N/A"
                  ? poster
                  : "https://placehold.co/400x600/20252c/ffffff?text=No+Poster"
              }
              alt={`${title} poster`}
              className="aspect-2/3 w-full rounded-xl border border-white/15 object-cover shadow-2xl shadow-black/40 transition-transform duration-300 hover:scale-[1.02] sm:rounded-2xl"
            />
          </div>

          {/* Main Movie Details */}
          <div className="flex min-w-0 flex-col justify-center">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {type && type !== "N/A" && (
                <span className="badge badge-primary border-0 px-3 py-3 font-semibold capitalize">
                  {type}
                </span>
              )}

              {rated && rated !== "N/A" && (
                <span className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85">
                  {rated}
                </span>
              )}
            </div>

            <h2 className="max-w-2xl pr-4 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
              {year && year !== "N/A" && <span>{year}</span>}

              {released && released !== "N/A" && (
                <span className="flex items-center gap-2">
                  <FaCalendar className="text-white/45" />
                  {released}
                </span>
              )}

              {runtime && runtime !== "N/A" && (
                <span className="flex items-center gap-2">
                  <FaRegClock className="text-white/45" />
                  {runtime}
                </span>
              )}
            </div>

            {movieGenres.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {movieGenres.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {/* Rating Cards */}
            <div className="mt-7 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-black/30">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10">
                  <FaStar className="text-xl text-amber-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-2xl leading-none font-extrabold text-white">
                    {imdbRating && imdbRating !== "N/A" ? imdbRating : "N/A"}
                    <span className="ml-1 text-xs font-medium text-white/45">
                      /10
                    </span>
                  </p>
                  <p className="mt-1.5 text-xs text-white/60">IMDb Rating</p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors hover:bg-black/30">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FaRegStar className="text-xl text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-2xl leading-none font-extrabold text-white">
                    {metascore && metascore !== "N/A" ? metascore : "N/A"}
                  </p>
                  <p className="mt-1.5 text-xs text-white/60">Metascore</p>
                </div>
              </div>
            </div>

            {imdbVotes && imdbVotes !== "N/A" && (
              <p className="mt-3 text-xs text-white/45">
                {imdbVotes} IMDb votes
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="px-5 pt-5 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-base-300/70 bg-base-200/50 p-4 sm:p-5 space-y-3">
          {isWatched ? (
            <p className="font-semibold text-lg">
              You rated with movie ⭐ {watchedUserRating}
            </p>
          ) : (
            <>
              <StarRating maxRating={10} onSetRating={setUserRating} />
              {userRating > 0 && (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn btn-warning rounded-full w-full"
                >
                  <FaPlus /> Add to list
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-9 p-5 sm:p-8 lg:p-10">
        {/* Overview */}
        <section>
          <h3 className="mb-3 flex items-center gap-3 text-lg font-bold tracking-tight sm:text-xl">
            <span className="h-7 w-1 rounded-full bg-primary" />
            Overview
          </h3>

          <p className="max-w-4xl text-sm leading-7 text-base-content/75 sm:text-base sm:leading-8">
            {plot && plot !== "N/A"
              ? plot
              : "No plot summary is available for this movie."}
          </p>
        </section>

        {/* Cast and Crew */}
        <section>
          <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight sm:text-xl">
            <span className="h-7 w-1 rounded-full bg-primary" />
            Cast & Crew
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-base-300/80 bg-base-200/40 p-4 transition-colors hover:bg-base-200/70 sm:p-5">
              <p className="mb-2 text-xs font-bold tracking-[0.12em] text-base-content/45 uppercase">
                Director
              </p>
              <p className="text-sm leading-6 font-medium">
                {director && director !== "N/A" ? director : "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300/80 bg-base-200/40 p-4 transition-colors hover:bg-base-200/70 sm:p-5">
              <p className="mb-2 text-xs font-bold tracking-[0.12em] text-base-content/45 uppercase">
                Writer
              </p>
              <p className="text-sm leading-6 font-medium">
                {writer && writer !== "N/A" ? writer : "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-base-300/80 bg-base-200/40 p-4 transition-colors hover:bg-base-200/70 sm:col-span-2 sm:p-5">
              <p className="mb-2 text-xs font-bold tracking-[0.12em] text-base-content/45 uppercase">
                Cast
              </p>
              <p className="text-sm leading-7 font-medium">
                {actors && actors !== "N/A" ? actors : "Not available"}
              </p>
            </div>
          </div>
        </section>

        {/* Movie Information */}
        <section>
          <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight sm:text-xl">
            <span className="h-7 w-1 rounded-full bg-primary" />
            Movie Information
          </h3>

          <div className="grid grid-cols-1 gap-3 min-[450px]:grid-cols-2">
            {[
              ["Country", country],
              ["Language", language],
              ["Box Office", boxOffice],
              ["Awards", awards],
              ["IMDb ID", imdbID || selectedId],
            ].map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 rounded-2xl border border-base-300/80 bg-base-200/40 p-4 transition-colors hover:bg-base-200/70 sm:p-5"
              >
                <p className="mb-2 text-xs font-bold tracking-[0.12em] text-base-content/45 uppercase">
                  {label}
                </p>
                <p className="wrap-break-word text-sm leading-6 font-medium">
                  {value && value !== "N/A" ? value : "Not available"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ratings Breakdown */}
        {movieRatings.length > 0 && (
          <section>
            <h3 className="mb-4 flex items-center gap-3 text-lg font-bold tracking-tight sm:text-xl">
              <span className="h-7 w-1 rounded-full bg-primary" />
              Ratings Breakdown
            </h3>

            <div className="overflow-hidden rounded-2xl border border-base-300/80">
              {movieRatings.map((rating, index) => (
                <div
                  key={`${rating.Source}-${index}`}
                  className={`flex items-center justify-between gap-4 px-4 py-4 transition-colors hover:bg-base-200/60 sm:px-5 ${
                    index !== movieRatings.length - 1
                      ? "border-b border-base-300/70"
                      : ""
                  }`}
                >
                  <span className="min-w-0 text-sm leading-6 text-base-content/75">
                    {rating.Source}
                  </span>

                  <span className="badge badge-primary badge-outline shrink-0 px-3 py-3 font-bold">
                    {rating.Value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="flex flex-col gap-4 border-t border-base-300/80 pt-6 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.16em] text-base-content/40 uppercase">
              Movie Database
            </p>
            <p className="mt-1.5 text-sm text-base-content/60">
              {year} <span className="mx-1.5 text-base-content/30">·</span>
              <span className="capitalize">{type || "Movie"}</span>
            </p>
          </div>

          <button
            className="btn btn-outline btn-sm min-h-10 gap-2 rounded-xl px-4 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={onCloseDetails}
          >
            <FaTimes />
            Close Details
          </button>
        </footer>
      </div>
    </section>
  );
}
