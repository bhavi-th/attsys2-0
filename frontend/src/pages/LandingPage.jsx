import '../styles/LandingPage.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const LandingPage = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [activeSection, setActiveSection] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const sectionRefs = {
        hero: useRef(null),
        about: useRef(null),
        features: useRef(null),
        process: useRef(null),
        benefits: useRef(null),
        cta: useRef(null),
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);

            // Update active section for nav highlighting
            const sections = Object.entries(sectionRefs);
            for (const [key, ref] of sections) {
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(key);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.dataset.section]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        Object.entries(sectionRefs).forEach(([key, ref]) => {
            if (ref.current) {
                ref.current.dataset.section = key;
                observer.observe(ref.current);
            }
        });

        return () => observer.disconnect();
    }, []);

    const smoothScroll = (e, targetId) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const stats = [
        { value: '99.9%', label: 'Accuracy Rate', icon: '🎯' },
        { value: '< 2s', label: 'Check-in Time', icon: '⚡' },
        { value: '0', label: 'Manual Errors', icon: '✓' },
        { value: '24/7', label: 'Availability', icon: '🌐' },
    ];

    return (
        <div className={`LandingPage ${mobileMenuOpen ? 'menu-open' : ''}`}>
            <nav className={`landing-nav ${scrollY > 50 ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-logo">ATTSYS 2.0</div>
                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                        <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                    <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                        <a
                            href="#about"
                            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                            onClick={(e) => smoothScroll(e, 'about')}
                        >
                            About
                        </a>
                        <a
                            href="#features"
                            className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
                            onClick={(e) => smoothScroll(e, 'features')}
                        >
                            Features
                        </a>
                        <Link className="nav-link nav-cta" to="/signup/teacher">
                            Get Started
                        </Link>
                    </div>
                </div>
                {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>}
            </nav>

            <div className="hero-section" ref={sectionRefs.hero}>
                <div className="hero-grid-overlay"></div>
                <div className="hero-content" style={{
                    transform: `translateY(${scrollY * 0.3}px)`,
                    opacity: Math.max(0, 1 - scrollY / 800)
                }}>
                    <div className="hero-badge">
                        <span className="badge-text">🚀 Next-Gen Attendance System</span>
                    </div>
                    <h1 className="hero-title">
                        Revolutionize Your
                        <span className="title-highlight"> Attendance</span>
                        Management
                    </h1>
                    <p className="hero-subtitle">
                        Eliminate manual tracking with secure QR-based check-ins. Built for modern institutions who value accuracy, privacy, and efficiency.
                    </p>
                    <div className="hero-actions">
                        <Link className="landing-link primary" to="/signup/teacher">
                            Get Started Free
                        </Link>
                        <a href="#features" className="landing-link secondary" onClick={(e) => smoothScroll(e, 'features')}>
                            Learn More
                        </a>
                    </div>
                    <div className="hero-stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="floating-shape shape-1" style={{
                        transform: `translateY(${scrollY * 0.1}px) translateX(${scrollY * 0.05}px)`
                    }}></div>
                    <div className="floating-shape shape-2" style={{
                        transform: `translateY(${scrollY * 0.15}px) translateX(${scrollY * -0.05}px)`
                    }}></div>
                    <div className="floating-shape shape-3" style={{
                        transform: `translateY(${scrollY * 0.08}px) translateX(${scrollY * -0.03}px)`
                    }}></div>
                    <div className="hero-glow"></div>
                </div>
            </div>

            <section id="about" className="about-section" ref={sectionRefs.about}>
                <div className="section-container">
                    <div className={`about-content ${isVisible.about ? 'visible' : ''}`}>
                        <div className="about-text-column">
                            <div className="section-label">About Us</div>
                            <h2 className="section-title">
                                Transforming Attendance Management for the Digital Age
                            </h2>
                            <p className="about-text">
                                ATTSYS 2.0 is a high-performance, automated attendance management system built to eliminate the inefficiencies of manual tracking. We believe that educational institutions deserve modern, reliable tools that save time and reduce administrative burden.
                            </p>
                            <p className="about-text">
                                By leveraging cutting-edge QR technology and a secure PWA architecture, we've created a seamless experience that bridges the gap between traditional attendance methods and modern digital solutions. Our system ensures accurate, real-time tracking while maintaining the highest standards of security and user experience.
                            </p>
                            <div className="about-features">
                                <div className="about-feature">
                                    <span className="feature-check">✓</span>
                                    <span>Zero manual data entry</span>
                                </div>
                                <div className="about-feature">
                                    <span className="feature-check">✓</span>
                                    <span>Instant verification</span>
                                </div>
                                <div className="about-feature">
                                    <span className="feature-check">✓</span>
                                    <span>Comprehensive reports</span>
                                </div>
                                <div className="about-feature">
                                    <span className="feature-check">✓</span>
                                    <span>Role-based access</span>
                                </div>
                            </div>

                        </div>
                        <div className="about-visual">
                            <div className="about-cards-stack">
                                <div className="about-card card-front">
                                    <div className="about-card-inner">
                                        <div className="about-card-icon">🎓</div>
                                        <div className="about-card-title">Smart Education</div>
                                        <div className="about-card-desc">
                                            Empowering institutions with technology
                                        </div>
                                    </div>
                                </div>
                                <div className="about-card card-middle">
                                    <div className="about-card-inner">
                                        <div className="about-card-icon">🔐</div>
                                        <div className="about-card-title">Secure & Private</div>
                                        <div className="about-card-desc">
                                            End-to-end encryption for all data
                                        </div>
                                    </div>
                                </div>
                                <div className="about-card card-back">
                                    <div className="about-card-inner">
                                        <div className="about-card-icon">⚡</div>
                                        <div className="about-card-title">Lightning Fast</div>
                                        <div className="about-card-desc">
                                            Check-in under 2 seconds
                                        </div>
                                    </div>
                                </div>
                                <div className="about-card card-extra">
                                    <div className="about-card-inner">
                                        <div className="about-card-icon">📊</div>
                                        <div className="about-card-title">Real-time Analytics</div>
                                        <div className="about-card-desc">
                                            Track attendance with detailed insights
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="features-section" ref={sectionRefs.features}>
                <div className="section-container">
                    <div className={`features-header ${isVisible.features ? 'visible' : ''}`}>
                        <div className="section-label">Features</div>
                        <h2 className="section-title">Everything You Need to Manage Attendance</h2>
                        <p className="section-subtitle">
                            Powerful features designed to streamline your workflow and enhance the educational experience
                        </p>
                    </div>
                    <div className={`features-grid ${isVisible.features ? 'visible' : ''}`}>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">📱</span>
                            </div>
                            <h3 className="feature-title">PWA Integration</h3>
                            <p className="feature-description">
                                Installable on Android, iOS, and Desktop for a native app feel with offline caching capabilities. Access your data anywhere, anytime.
                            </p>
                            <div className="feature-link">Learn more →</div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">🔐</span>
                            </div>
                            <h3 className="feature-title">Secure QR Verification</h3>
                            <p className="feature-description">
                                Real-time QR generation and scanning for instantaneous student check-ins with enhanced security protocols and anti-fraud measures.
                            </p>
                            <div className="feature-link">Learn more →</div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">👥</span>
                            </div>
                            <h3 className="feature-title">Dual-Portal Architecture</h3>
                            <p className="feature-description">
                                Dedicated dashboards for Teachers (class management, analytics) and Students (attendance history) with role-specific features.
                            </p>
                            <div className="feature-link">Learn more →</div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">🎨</span>
                            </div>
                            <h3 className="feature-title">Futuristic UI/UX</h3>
                            <p className="feature-description">
                                A high-contrast, HUD-inspired aesthetic built with precision for optimal performance, accessibility, and visual appeal.
                            </p>
                            <div className="feature-link">Learn more →</div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">⚡</span>
                            </div>
                            <h3 className="feature-title">Automated Onboarding</h3>
                            <p className="feature-description">
                                Optimized flow for user registration and role-based access control for seamless account setup and instant deployment.
                            </p>
                            <div className="feature-link">Learn more →</div>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <span className="feature-icon">📊</span>
                            </div>
                            <h3 className="feature-title">Real-time Analytics</h3>
                            <p className="feature-description">
                                Comprehensive attendance tracking with detailed reports, historical data analysis, and exportable insights.
                            </p>
                            <div className="feature-link">Learn more →</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`process-section ${isVisible.process ? 'visible' : ''}`} ref={sectionRefs.process}>
                <div className="section-container">
                    <div className="process-header">
                        <div className="section-label">How It Works</div>
                        <h2 className="section-title">Simple 3-Step Process</h2>
                        <p className="section-subtitle">
                            Get started in minutes with our streamlined attendance workflow
                        </p>
                    </div>
                    <div className="process-flow">
                        <div className="process-step">
                            <div className="step-number">01</div>
                            <div className="step-card">
                                <div className="step-icon">📝</div>
                                <h3 className="step-title">Teacher Generates QR</h3>
                                <p className="step-desc">
                                    Teachers create unique QR codes for each class session with one click
                                </p>
                            </div>
                        </div>
                        <div className="process-arrow">→</div>
                        <div className="process-step">
                            <div className="step-number">02</div>
                            <div className="step-card">
                                <div className="step-icon">📸</div>
                                <h3 className="step-title">Student Scans Code</h3>
                                <p className="step-desc">
                                    Students scan the QR code using their device camera for instant check-in
                                </p>
                            </div>
                        </div>
                        <div className="process-arrow">→</div>
                        <div className="process-step">
                            <div className="step-number">03</div>
                            <div className="step-card">
                                <div className="step-icon">✅</div>
                                <h3 className="step-title">Attendance Recorded</h3>
                                <p className="step-desc">
                                    System automatically records attendance with timestamp and location
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`benefits-section ${isVisible.benefits ? 'visible' : ''}`} ref={sectionRefs.benefits}>
                <div className="section-container">
                    <div className="benefits-header">
                        <div className="section-label">Benefits</div>
                        <h2 className="section-title">Why Choose ATTSYS 2.0?</h2>
                    </div>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-visual">
                                <div className="benefit-icon">⏰</div>
                            </div>
                            <h3 className="benefit-title">Save Time</h3>
                            <p className="benefit-desc">
                                Reduce attendance taking time from 10 minutes to 10 seconds per class
                            </p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-visual">
                                <div className="benefit-icon">🎯</div>
                            </div>
                            <h3 className="benefit-title">Eliminate Errors</h3>
                            <p className="benefit-desc">
                                Zero manual entry errors with automated QR-based verification
                            </p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-visual">
                                <div className="benefit-icon">📈</div>
                            </div>
                            <h3 className="benefit-title">Better Insights</h3>
                            <p className="benefit-desc">
                                Track attendance patterns and identify at-risk students automatically
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section" ref={sectionRefs.cta}>
                <div className={`section-container ${isVisible.cta ? 'visible' : ''}`}>
                    <h2 className="cta-title">Ready to Transform Your Attendance System?</h2>
                    <p className="cta-subtitle">
                        Join thousands of educators and students experiencing the future of attendance management.
                    </p>
                    <div className="cta-actions">
                        <Link className="landing-link primary" to="/signup/teacher">
                            <span className="btn-icon">👨‍🏫</span>
                            Get Started as Teacher
                        </Link>
                        <Link className="landing-link secondary" to="/signup/student">
                            <span className="btn-icon">👨‍🎓</span>
                            Get Started as Student
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-content">
                    <p>&copy; 2024 ATTSYS 2.0. Built with ❤️ for modern education.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
