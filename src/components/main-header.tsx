import Link from "next/link";
import classes from "./main-header.module.scss";

export default function MainHeader() {
  return (
    <header className={classes.mainheader}>
      <div className="container">
        <div className={classes.mainheader__wrapper}>
            <Link href="/" className={classes.mainheader__logo}>
                <h1>Fast Forward Film</h1>
            </Link>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/movies">Current movies</a></li>
                    <li><a href="/movie-archive">All movies</a></li>
                    <li><a href="/add-movie">Add a movie</a></li>
                </ul>
            </nav>
        </div>
      </div>
    </header>
  );
}