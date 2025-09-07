import { getMovieBySlug, editMovieBySlug } from "@/lib/movies";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const movie = getMovieBySlug(slug);
    
    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    
    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Check if movie exists first
    const existingMovie = getMovieBySlug(slug);
    if (!existingMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    const formData = await request.formData();
    
    // Extract all form fields
    const title = formData.get("title") as string;
    const releaseYear = parseInt(formData.get("releaseYear") as string);
    const description = formData.get("description") as string;
    const genre = formData.get("genre") as string;
    const director = formData.get("director") as string;
    const movie_link = formData.get("movie_link") as string;
    const showings = formData.get("showings") as string;
    const posterFile = formData.get("poster") as File;

    const updatedMovie: any = {
      title,
      releaseYear,
      description,
      genre,
      director,
      movie_link,
      showings
    };

    // Handle poster file upload if a new one is provided
    if (posterFile && posterFile.size > 0) {
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      const fileName = `${Date.now()}-${posterFile.name}`;
      const filePath = path.join(process.cwd(), "public/images", fileName);
      await writeFile(filePath, buffer);
      updatedMovie.posterUrl = `/images/${fileName}`;
    }

    // Remove any undefined values
    Object.keys(updatedMovie).forEach(key => {
      if (updatedMovie[key] === undefined || updatedMovie[key] === "undefined") {
        delete updatedMovie[key];
      }
    });
    
    editMovieBySlug(slug, updatedMovie);
    
    // Return the updated movie
    const movie = getMovieBySlug(slug);
    return NextResponse.json(movie);
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}
