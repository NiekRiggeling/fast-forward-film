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
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/movies">Current movies</Link></li>
                    <li><Link href="/movie-archive">All movies</Link></li>
                    <li><Link href="/add-movie">Add a movie</Link></li>
                </ul>
            </nav>
        </div>
      </div>
    </header>
  );
}