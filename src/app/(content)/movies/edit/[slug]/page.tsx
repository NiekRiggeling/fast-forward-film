"use client";   

import { useState, useEffect } from "react";
import { useTransitionRouter } from "@/lib/view-transitions";
import PosterPreview from "@/components/poster-preview";
import classes from "../../../add-movie/page.module.scss";

type Movie = {
  id: number;
  title: string;
  slug: string;
  releaseYear: number;
  description: string;
  genre: string;
  director: string;
  movie_link: string;
  posterUrl: string;
  showings: string;
};

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const baseTimes = ["16:00", "20:00", "00:00"];

export default function EditMovie({ params }: { params: Promise<{ slug: string }> }) {
    const [slug, setSlug] = useState<string>("");
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>("");
    const [showings, setShowings] = useState([{ day: "", time: "" }]);
    const router = useTransitionRouter();

    useEffect(() => {
        async function getSlug() {
            const resolvedParams = await params;
            setSlug(resolvedParams.slug);
        }
        getSlug();
    }, [params]);

    useEffect(() => {
        if (!slug) return;
        
        async function fetchMovie() {
            try {
                const response = await fetch(`/api/movies/${slug}`);
                if (!response.ok) {
                    throw new Error("Movie not found");
                }
                const movieData = await response.json();
                setMovie(movieData);
                
                // Parse showings from JSON string
                try {
                    const parsedShowings = JSON.parse(movieData.showings || "[]");
                    setShowings(parsedShowings.length > 0 ? parsedShowings : [{ day: "", time: "" }]);
                } catch {
                    setShowings([{ day: "", time: "" }]);
                }
            } catch (error) {
                console.error("Error fetching movie:", error);
                setError("Failed to load movie");
            } finally {
                setLoading(false);
            }
        }
        
        fetchMovie();
    }, [slug]);

    function deleteMovie(id: string) {
        if (confirm("Are you sure you want to delete this movie?")) {
            deleteMovieAsync(id);
        }
    }

    async function deleteMovieAsync(movieId: string) {
        try {
            const response = await fetch(`/api/movies/${slug}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete movie");
            }

            // Redirect to movies list after deletion with view transition
            router.push('/movies');
        } catch (error) {
            console.error("Error deleting movie:", error);
            setError("Failed to delete movie");
        }
    }

    function handleShowingsChange(index: number, field: "day" | "time", value: string) {
        const updated = [...showings];
        updated[index][field] = value;
        setShowings(updated);
    }

    function addShowing() {
        setShowings([...showings, { day: "", time: "" }]);
    }

    function removeShowing(index: number) {
        setShowings(showings.filter((_, i) => i !== index));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!movie) return;

        setSaving(true);
        setError("");


        try {
            const formData = new FormData(event.currentTarget);
            formData.append("showings", JSON.stringify(showings));

            const response = await fetch(`/api/movies/${slug}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to update movie");
            }

            // Redirect to movie detail page with view transition
            router.push(`/movie-archive`);
        } catch (error) {
            console.error("Error updating movie:", error);
            setError("Failed to update movie");
            setSaving(false);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error && !movie) {
        return <div>Error: {error}</div>;
    }

    return (
        <section className={classes["add-movie"]}>
            <h2>Edit Movie</h2>
            <p>Use the form below to edit the movie details.</p>

            {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

            {movie ? (
                <form 
                    className={classes["add-movie__form"]}
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                >
                    <div className={classes["form-group"]}>
                        <input 
                            type="text" 
                            name="title" 
                            id="title" 
                            placeholder="Name *" 
                            defaultValue={movie.title}
                            required 
                        />
                        <input
                            placeholder="Release year *"
                            type="number"
                            name="releaseYear"
                            id="releaseYear"
                            min="1900"
                            max={new Date().getFullYear()}
                            step="1"
                            defaultValue={movie.releaseYear}
                            required
                        />
                    </div>

                    <div>
                        <h4>Showings (day & time):</h4>
                        {showings.map((showing, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                <select
                                    value={showing.day}
                                    onChange={e => handleShowingsChange(idx, "day", e.target.value)}
                                    required
                                >
                                    <option value="">Select day</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                                <select
                                    value={showing.time}
                                    onChange={e => handleShowingsChange(idx, "time", e.target.value)}
                                    required
                                >
                                    <option value="">Select time</option>
                                    {baseTimes.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                                <button 
                                    type="button" 
                                    onClick={() => removeShowing(idx)} 
                                    disabled={showings.length === 1}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addShowing}>Add Showing</button>
                    </div>

                    <div className={classes["form-group"]}>
                        <input 
                            type="text" 
                            name="genre" 
                            id="genre" 
                            placeholder="Genre" 
                            defaultValue={movie.genre}
                        />
                        <input 
                            type="text" 
                            name="director" 
                            id="director" 
                            placeholder="Director" 
                            defaultValue={movie.director}
                        />
                    </div>
                    
                    <textarea 
                        name="description" 
                        id="description" 
                        placeholder="Description" 
                        defaultValue={movie.description}
                    />
                    
                    <input 
                        type="text" 
                        name="movie_link" 
                        id="movie_link" 
                        placeholder="Movie link" 
                        defaultValue={movie.movie_link}
                    />
                    
                    <div>
                        <h4>Current Poster:</h4>

                        {movie.posterUrl && (
                            <img 
                                src={movie.posterUrl} 
                                alt="Current poster" 
                                style={{ maxWidth: "200px", height: "auto", marginBottom: "1rem" }}
                            />
                        )}
                        <PosterPreview />
                        <h4 style={{ fontSize: "0.9em", color: "#666" }}>
                            Leave empty to keep current poster
                        </h4>
                    </div>

                    <div className={classes['add-movie__buttons']}>
                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Update Movie"}
                        </button>

                        <button type="button" className='button button--danger' onClick={() => deleteMovie(movie.id.toString())}>Delete Movie</button>
                    </div>
                </form>
            ) : (
                <p>Movie not found</p>
            )}
        </section>
    );
}