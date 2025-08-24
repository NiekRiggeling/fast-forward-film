import { NextRequest, NextResponse } from "next/server";
import { saveMovie } from "@/lib/movies";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const posterFile = formData.get("poster") as File | null;
  const title = formData.get("title") as string;
  const releaseYear = Number(formData.get("releaseYear"));
  const description = formData.get("description") as string;
  const genre = formData.get("genre") as string;
  const director = formData.get("director") as string;
  const movie_link = formData.get("movie_link") as string;
  const showings = JSON.parse(formData.get("showings") as string || "[]");

  // You may want to generate a slug from the title
  const slug = title.toLowerCase().replace(/\s+/g, "-");

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