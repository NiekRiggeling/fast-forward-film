import { getMovieBySlug } from "@/lib/movies";

export default async function MoviesDetailPage({ params }: { params: { slug: string } }) {
   let movie = null;

   try {
       movie = await getMovieBySlug(params.slug);
   } catch (error) {
       console.error("Error fetching movie:", error);
    }

    console.log("Movie details:", movie);

  return (
    <section className="">
      <h1>{movie?.title}</h1>
    </section>
  );
}