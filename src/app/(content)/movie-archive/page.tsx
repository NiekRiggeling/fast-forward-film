import { getAllMovies } from "@/lib/movies";
import classes from "./page.module.scss";
import Movie from "@/components/movies/movie";

export default async function MovieArchive() {
  const movies = await getAllMovies();

  return (
    <section>
      <h1>Movie Archive</h1>
      <p>This is the movie archive page.</p>

      <div className={classes['movie-archive']}>
        {movies.map((movie: any) => (
            <div className={classes['movies__item-wrapper']} key={movie.id}>
              <Movie {...movie} />
            </div>
        ))}
      </div>

    </section>
  );
}
