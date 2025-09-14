import { getAllMovies } from "@/lib/movies";
import Link from "next/link";
import Image from "next/image";
import classes from "./page.module.scss";

export default async function Home() {
  const movies = await getAllMovies();

  return (
    <section className="home">
        <h1 className="home__title">
          A platform to explore and discover films from around the world.
        </h1>

        <div className={classes.home__movies}>
          {movies.map((movie: any) => (
              <div className={classes.home__movie_item} key={movie.id}>
                <Link href={`/movies/${movie.slug}`}>
                  <Image src={movie.posterUrl} alt={`${movie.title} poster`} width={200} height={300} />
                </Link>
              </div>
          ))}
        </div>

    </section>
  );
}
