import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* ===== NAVBAR ===== */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">SERVIXO</div>
        <div className="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <Link to="/login" className="nav-btn nav-btn-outline">Sign In</Link>
          <Link to="/signup" className="nav-btn nav-btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            Trusted by thousands of homeowners
          </div>
          <h1>
            Professional Services,<br />
            <span className="gradient-text">Right at Your Doorstep.</span>
          </h1>
          <p>
            From plumbing to painting, find verified professionals near you.
            Book instantly, pay securely, and get it done  hassle-free.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="hero-btn hero-btn-primary">Book a Service </Link>
            <a href="#how-it-works" className="hero-btn hero-btn-secondary">See How It Works</a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Verified Professionals</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Services Completed</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="landing-section" id="how-it-works">
        <div className="section-header">
          <div className="section-tag">How It Works</div>
          <h2>Get Your Service Done in 3 Simple Steps</h2>
          <p>No complicated processes. Just search, book, and relax while a verified professional handles the rest.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon"></div>
            <h3>Search & Discover</h3>
            <p>Browse through a wide range of professional services or search by category, skill, or location to find exactly what you need.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon"></div>
            <h3>Book Instantly</h3>
            <p>Select your preferred date, time, and professional. Provide details about your requirement and confirm your booking in seconds.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon"></div>
            <h3>Get It Done</h3>
            <p>Your verified professional arrives at your doorstep. Pay securely after the job is done and leave a review to help others.</p>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="landing-section" id="services" style={{ background: 'var(--bg-card)' }}>
        <div className="section-header">
          <div className="section-tag">Our Services</div>
          <h2>Everything Your Home Needs, Under One Roof</h2>
          <p>From quick fixes to full renovations  we connect you with the right expert for every job.</p>
        </div>

        <div className="features-grid">
          {[
            { icon: '', title: 'Plumbing', desc: 'Leaky pipes, clogged drains, fixture installations  our certified plumbers handle it all with precision.', color: 'hsla(220, 100%, 60%, 0.12)' },
            { icon: '', title: 'Electrical', desc: 'Wiring, panel upgrades, lighting installations, and emergency repairs by licensed electricians.', color: 'hsla(45, 100%, 55%, 0.12)' },
            { icon: '', title: 'House Cleaning', desc: 'Deep cleaning, regular maintenance, and move-in/out cleaning services for spotless living spaces.', color: 'hsla(155, 100%, 45%, 0.12)' },
            { icon: '', title: 'Painting', desc: 'Interior and exterior painting with premium finishes. Transform your space with expert brushwork.', color: 'hsla(280, 100%, 70%, 0.12)' },
            { icon: '', title: 'Outdoor & Garden', desc: 'Lawn mowing, landscaping, hedge trimming, and garden design to keep your outdoor space beautiful.', color: 'hsla(120, 80%, 50%, 0.12)' },
            { icon: '', title: 'Moving & Logistics', desc: 'Packing, loading, transportation, and unpacking services for stress-free relocations across the city.', color: 'hsla(20, 100%, 60%, 0.12)' },
          ].map((service, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: service.color }}>{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT / WHY US ===== */}
      <section className="landing-section" id="about">
        <div className="section-header">
          <div className="section-tag">Why Servixo</div>
          <h2>Built for Trust, Designed for Simplicity</h2>
          <p>We're not just another marketplace. Servixo is a platform built around safety, transparency, and quality.</p>
        </div>

        <div className="features-grid" style={{ maxWidth: '900px' }}>
          {[
            { icon: '', title: 'Verified Professionals', desc: 'Every service provider goes through identity verification and background checks before joining the platform.' },
            { icon: '', title: 'Secure Payments', desc: 'Your payments are protected with end-to-end encryption. Pay only after the service is completed to your satisfaction.' },
            { icon: '', title: 'Ratings & Reviews', desc: 'Transparent reviews from real customers help you choose the best professional for your needs.' },
            { icon: '', title: '24/7 Support', desc: 'Our dedicated support team is always available to help resolve any issues through our built-in ticket system.' },
            { icon: '', title: 'Local & Reliable', desc: 'Find trusted professionals in your neighborhood. Quick arrivals, local expertise, and community accountability.' },
            { icon: '', title: 'Easy Rebooking', desc: 'Loved the service? Rebook the same professional with a single click from your dashboard.' },
          ].map((item, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: 'var(--primary-glow)' }}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of happy homeowners. Book your first service today  it only takes a minute.</p>
          <div className="hero-actions" style={{ position: 'relative', zIndex: 2 }}>
            <Link to="/signup" className="hero-btn hero-btn-primary">Create Free Account</Link>
            <Link to="/login" className="hero-btn hero-btn-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">SERVIXO</div>
            <p>Your trusted marketplace for professional home services. Connecting homeowners with verified experts since 2024.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#how-it-works">How It Works</a>
            <a href="#services">Services</a>
            <a href="#about">Why Servixo</a>
            <Link to="/signup">Become a Pro</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/login">Help Center</Link>
            <Link to="/login">Contact Us</Link>
            <Link to="/login">Safety</Link>
            <Link to="/login">Community</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Servixo. All rights reserved. Made with  for better homes.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
