import { useState } from "react";
import { CAPACITY_MAX } from "../constants";
import { postReservation } from "../services/api";
import "./Reserve.css"; 


export default function Reserve() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    phone: "",
    email: "",
  });

  const overCapacity = form.guests > CAPACITY_MAX || form.guests < 1;
  const valid = !!(form.date && form.time && form.name && form.phone) && !overCapacity;

  const submit = async () => {
    if (!valid) return;
    try {
      setLoading(true);
      await postReservation(form);
      alert(`Reservation confirmed for ${form.guests} on ${form.date} at ${form.time}.`);
      setForm({ date: "", time: "", guests: 2, name: "", phone: "", email: "" });
    } catch {
      alert("Could not book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

return (
  <section
    className="reserve-hero"
    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/reservation.jpg)` }}
  >
    <div className="reserve-overlay" />
    <div className="reserve-grid">

        <form className="reserve-card" onSubmit={onSubmit}>
          <h3 className="reserve-title">Reserve a Table</h3>

          <div className="fields">
            <label className="field">
              <span className="field-label">Date *</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="input"
              />
            </label>

            <label className="field">
              <span className="field-label">Time *</span>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                className="input"
              />
            </label>

            <label className="field">
              <span className="field-label">Guests *</span>
              <input
                type="number"
                min={1}
                max={CAPACITY_MAX}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                required
                className="input"
                placeholder="Guests"
              />
            </label>

            <label className="field">
              <span className="field-label">Full name *</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="input"
                placeholder="Your name"
              />
            </label>

            <label className="field">
              <span className="field-label">Phone *</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="input"
                placeholder="Your phone"
              />
            </label>

            <label className="field field-span-2">
              <span className="field-label">Email (optional)</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="you@example.com"
              />
            </label>
          </div>

          {overCapacity && (
            <p className="error">Maximum reservation size is {CAPACITY_MAX} people.</p>
          )}

          <button
            type="submit"
            disabled={!valid || loading}
            className={`reserve-btn ${valid && !loading ? "reserve-btn--ok" : "reserve-btn--disabled"}`}
          >
            {loading ? "Booking..." : "Book Table"}
          </button>
        </form>

        <div className="reserve-copy">
          <h1 className="copy-title">MAKE YOUR<br />RESERVATION</h1>
          <p className="copy-text">
            Book your table in seconds. We’ll confirm by phone or email.
            Pickup only — no delivery.
          </p>
        </div>
      </div>
    </section>
  );
}
