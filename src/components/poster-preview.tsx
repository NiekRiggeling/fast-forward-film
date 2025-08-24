'use client';
import React, { useState } from 'react';
import classes from './poster-preview.module.scss';

export default function PosterPreview() {
    const [posterUrl, setPosterUrl] = useState("");

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                setPosterUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className={classes["poster-preview"]}>
            {posterUrl ? (
                <img src={posterUrl} alt="Movie Poster Preview" />
            ) : (
                <p>No poster selected</p>
            )}

            <input
                type="file"
                name="poster"
                id="poster"
                accept="image/*"
                onChange={handleFileChange}
                placeholder="Poster *"
            />
        </div>
    );
}