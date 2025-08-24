import Movie from "@/components/movies/movie";
import classes from "./todays-movies.module.scss";
import { getAllMovies } from "@/lib/movies";

const baseTimes = ["16:00", "20:00", "00:00"];

export default async function TodaysMovies({time}: {time: 'today' | 'tomorrow'}) {
  const movies = await getAllMovies();

  const today = new Date();
  // Set data to tommorow for testing purposes
  if (time === 'tomorrow') {
    today.setDate(today.getDate() + 1);
  } 
  const todayName = today.toLocaleDateString("en-EN", { weekday: "long" });

  // Group movies by timeslot
  const groupedMovies: { [key: string]: any[] } = {};
  baseTimes.forEach((time) => {
    groupedMovies[time] = [];
  });

  movies.forEach((movie: any) => {
    if (!movie.showings) return;
    let showings;
    try {
      showings = JSON.parse(movie.showings);
    } catch {
      return;
    }
    showings.forEach((showing: any) => {
      if (showing.day === todayName && baseTimes.includes(showing.time)) {
        groupedMovies[showing.time].push(movie);
      }
    });
  });

  return (
    <section className={classes.movies}>
      <h2><span>{time}s</span> movies</h2>
      <p>There {Object.values(groupedMovies).flat().length > 0 ? "are" : "is"} {Object.values(groupedMovies).flat().length} movie{Object.values(groupedMovies).flat().length !== 1 ? "s" : ""} on {time}.</p>

      <div className={classes.movies__days}>
        <h3>
          {today.toLocaleDateString("en-EN", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
      </div>

      {baseTimes.map((time) => (
        <div key={time} className={classes.movies__timeslot}>
          <h4>{time}</h4>

          <div className={classes.movies__items}>
            {groupedMovies[time].length > 0 ? (
              groupedMovies[time].map((movie: any) => (
                <div className={classes['movies__item-wrapper']} key={movie.id}>
                  <Movie {...movie} />
                </div>
              ))
            ) : (
              <p>No movies for this timeslot.</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}