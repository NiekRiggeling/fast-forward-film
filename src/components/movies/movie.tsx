"use client";

import Image from 'next/image';
import classes from './movie.module.scss';
import Link from 'next/link';

export default function Movie({id, title, slug, releaseYear, description, posterUrl, director, genre}: {id: int, title: string, slug: string, releaseYear: number, description: string, posterUrl?: string, director?: string, genre?: string}) {

    function editMovie(id: string) {
        // logic to edit movie
        return <Link href={`/movies/edit/${id}`}>Edit Movie</Link>;

    }

    function deleteMovie(id: string) {
        // logic to delete movie
        console.log("Delete movie with id:", id);
    }

    
    return (
        <>
        <Link href={`/movies/${slug}`} className={classes.movie}>
            {posterUrl && <Image src={posterUrl} alt={`${title} poster`} width={200} height={300} />}
            <div className={classes.movie__info}>
                <h2>{title} ({releaseYear})</h2>

                <p>{description}</p>

                <div className={classes.movie__details}>
                    <span>{director && <p><strong>Director:</strong> {director}</p>}</span>
                    <span>{genre && <p><strong>Genre:</strong> {genre}</p>}</span>
                </div>
            </div>
        </Link>

        <Link className='button' href={`/movies/edit/${slug}`}>Edit Movie</Link>
        <button className='button button--danger' onClick={() => deleteMovie(id.toString())}>Delete Movie</button>
        </>
    );
}