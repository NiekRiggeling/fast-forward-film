import Database from "better-sqlite3";
import { writeFile } from "fs/promises";
import path from "path";

// Initialize or open the SQLite database
const db = new Database("movies.db");

// Create the movies table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    releaseYear INTEGER NOT NULL,
    description TEXT,
    genre TEXT,
    director TEXT,
    movie_link TEXT,
    posterUrl TEXT,
    showings TEXT
  )
`);

// Function to save a movie and its poster image
export async function saveMovie(movie: {
  title: string;
  slug: string;
  releaseYear: number;
  description?: string;
  genre?: string;
  director?: string;
  movie_link?: string;
  posterFile?: File; 
  showings?: Array<{ day: string; time: string }>;
}) {
  let posterUrl = "";

  if (movie.posterFile) {
    const buffer = Buffer.from(await movie.posterFile.arrayBuffer());
    const fileName = `${Date.now()}-${movie.posterFile.name}`;
    // process.cwd returns the current working directory
    const filePath = path.join(process.cwd(), "public/images", fileName);
    await writeFile(filePath, buffer);
    posterUrl = `/images/${fileName}`;
  }

  const stmt = db.prepare(`
    INSERT INTO movies (title, slug, releaseYear, description, genre, director, movie_link, posterUrl, showings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  console.log("Saving movie:");
  stmt.run(
    movie.title,
    movie.slug,
    movie.releaseYear,
    movie.description || "",
    movie.genre || "",
    movie.director || "",
    movie.movie_link || "",
    posterUrl,
    JSON.stringify(movie.showings || [])
  );
}

export function getAllMovies() {
  const stmt = db.prepare("SELECT * FROM movies ORDER BY id DESC");
  return stmt.all();
}

export function getMovieBySlug(slug: string) {
  const stmt = db.prepare("SELECT * FROM movies WHERE slug = ?");
  return stmt.get(slug);
}

export function removeAllMovies() {
  const stmt = db.prepare("DELETE FROM movies");
  stmt.run();
}

// removeAllMovies();
