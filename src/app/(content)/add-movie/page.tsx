'use client';
import React, { useState } from 'react';
import { useTransitionRouter } from '@/lib/view-transitions';
import classes from "./page.module.scss";
import PosterPreview from "@/components/poster-preview";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const baseTimes = ["16:00", "20:00", "00:00"];

export default function AddMovie() {
  const router = useTransitionRouter();
  const [loading, setLoading] = useState(false);
  const [showings, setShowings] = useState([{ day: "", time: "" }]);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("showings", JSON.stringify(showings));

    const res = await fetch("/api/add-movie", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // Navigate with view transition
      router.push("/movies");
    } else {
      setLoading(false);
    }
  }

  return (
    <section className={classes["add-movie"]}>
      <h2>Add a New Movie</h2>
      <p>Use the form below to add a new movie to our collection.</p>

      <form className={classes["add-movie__form"]}
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className={classes["form-group"]}>
          <input type="text" name="title" id="title" placeholder="Name *" />
          <input
            placeholder="Release year *"
            type="number"
            name="releaseYear"
            id="releaseYear"
            min="1900"
            max={new Date().getFullYear()}
            step="1"
          />
        </div>

        <div>
          <label>Showings (day & time):</label>
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
              <button type="button" onClick={() => removeShowing(idx)} disabled={showings.length === 1}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addShowing}>Add Showing</button>
        </div>

        <div className={classes["form-group"]}>
          <input type="text" name="genre" id="genre" placeholder="Genre" />
          <input type="text" name="director" id="director" placeholder="Director" />
        </div>
        <textarea name="description" id="description" placeholder="Description" />
        <input type="text" name="movie_link" id="movie_link" placeholder="Movie link" />
        <PosterPreview />

        <button type="submit" disabled={loading}>Add Movie</button>
      </form>
    </section>
  );
}