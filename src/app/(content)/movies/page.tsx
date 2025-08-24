import TodaysMovies from "@/components/movies/todays-movies";
import classes from "./page.module.scss";

export default async function MoviesPage() {
  return (
    <>
      <section className={classes.movies}>
        <TodaysMovies time='today' />
        <TodaysMovies time='tomorrow' />
      </section>
    </>
  );
}