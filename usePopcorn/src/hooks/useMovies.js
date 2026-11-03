import { useEffect, useState } from "react";

const KEY = "ddd8017e";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.trim().length < 3) return;

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

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query, callback]);

  return { movies, isLoading, error };
}
