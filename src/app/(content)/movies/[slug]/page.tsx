import { getMovieBySlug, Movie } from "@/lib/movies";

export default async function MoviesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
   let movie: Movie | undefined = undefined;

   try {
       movie = getMovieBySlug(slug);
   } catch (error) {
       console.error("Error fetching movie:", error);
    }

    if (!movie) {
        return (
            <section className="">
                <h1>Movie not found</h1>
                <p>The movie you're looking for doesn't exist.</p>
            </section>
        );
    }

    console.log("Movie details:", movie);

  return (
    <section className="">
      <h1>{movie.title}</h1>
    </section>
  );
}