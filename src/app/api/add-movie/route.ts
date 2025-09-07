import { NextRequest, NextResponse } from "next/server";
import { saveMovie } from "@/lib/movies";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // TODO: Why null for the posterfile and not the other fields?
  // The other fields are text-based and can be easily extracted from the form data,
  // but the poster file is a File object and needs to be handled differently.
  const posterFile = formData.get("poster") as File | null;
  const title = formData.get("title") as string;
  const releaseYear = Number(formData.get("releaseYear"));
  const description = formData.get("description") as string;
  const genre = formData.get("genre") as string;
  const director = formData.get("director") as string;
  const movie_link = formData.get("movie_link") as string;
  // Is || the same as ?? here? 
  // Yes, because JSON.parse will only return null if the input is null or undefined.
  // If showings is null or undefined, default to an empty array
  const showings = JSON.parse(formData.get("showings") as string || "[]");

  // also replace / within the title to avoid issues in URLs
  const safeTitle = title.replace(/\//g, "-");
  const slug = safeTitle.toLowerCase().replace(/\s+/g, "-");

  await saveMovie({
    title,
    slug,
    releaseYear,
    description,
    genre,
    director,
    movie_link,
    posterFile: posterFile ?? undefined,
    showings
  });

  return NextResponse.json({ success: true });
}