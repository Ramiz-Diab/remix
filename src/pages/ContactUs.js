import React from 'react';
import './ContactUs.css';

function ContactUs() {
  return (
    <div className="page contact-us-page">
      <h1>📧 Contact Us</h1>

      <div className="contact-container">
        <div className="contact-form">
          <h2>Send us a Message</h2>
          
          <form>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your full name" required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" required />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="Message subject" required />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                placeholder="Write your message here..." 
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-large">
              📤 Send Message
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>
            <strong>📧 Email:</strong><br />
            arab@remix.com
          </p>
          <p>
            <strong>📱 Phone:</strong><br />
            +966 50 XXXX XXXX
          </p>
          <p>
            <strong>🕒 Business Hours:</strong><br />
            9:00 AM to 6:00 PM<br />
            (Mecca Standard Time)
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
