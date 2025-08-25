

import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact-map-section">
      <div className="map-container">
        <iframe
          title="Darbaar Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2556.380142383129!2d8.4825583!3d49.4807649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4797cc2a8f9a7c23%3A0xf9d4ab83663a5a76!2sSchwetzinger%20Str.%2040%2C%2068165%20Mannheim!5e0!3m2!1sen!2sde!4v1692200000000!5m2!1sen!2sde"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <aside className="info-card right">
        <h2>Contact Us</h2>

      

        <div className="block">
          <div className="kicker">ADDRESS</div>
          <div className="value">
            DARBAAR · Indische Schnellimbiss<br />
            Schwetzinger Str. 40<br />
            68165 Mannheim, Germany
          </div>
        </div>

        <div className="block">
          <div className="kicker">PHONE</div>
          <div className="value">+49 (0)621 43759556</div>
        </div>

        <div className="block">
          <div className="kicker">OPENING HOURS</div>
          <div className="value">
            Lunch: 11:00–15:00<br />
            Dinner: 17:00–21:00
          </div>
        </div>

        <a className="menu-btn" href="/menu.pdf" target="_blank" download>
          ⬇️  Download the Menu (PDF)
        </a>
      </aside>
    </section>
  );
}
