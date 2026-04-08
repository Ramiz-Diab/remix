import React from 'react';
import '../styles/AboutUs.css';

function AboutUs() {
  return (
    <div className="page about-us-page">
      <h1>📖 About Us</h1>

      <div className="about-content">
        <section>
          <h2>🎵 About Arabic Remix</h2>
          <p>
            We specialize in producing and selling authentic Arabic remixes in very high quality.
          </p>
          <p>
            Our mission is to provide the best remixes for artists, professionals, and enthusiasts who seek exceptional quality.
          </p>
        </section>

        <section>
          <h2>🎯 Our Goals</h2>
          <ul>
            <li>Provide professionally-produced remixes</li>
            <li>Support Arab artists</li>
            <li>Offer fair pricing</li>
            <li>Deliver excellent customer service</li>
          </ul>
        </section>

        <section>
          <h2>👥 Our Team</h2>
          <p>
            A team of professional music producers with years of experience in music production and remixing.
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
