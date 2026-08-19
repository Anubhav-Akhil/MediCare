'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Rocket,
  Layers,
  Zap,
  Megaphone,
  Users,
  CalendarCheck,
  FileText,
  ShieldCheck,
  HeartPulse,
  Palette,
  Cpu,
  Clock,
  Check,
  ChevronDown,
} from 'lucide-react';

import styles from './page.module.css';

const sections = [
  {
    id: 'hero',
    label: 'Home',
  },
  {
    id: 'about',
    label: 'About',
    eyebrow: 'Mission Control',
    icon: Rocket,
    title: 'Next-Gen Clinical Workflow & Practice Intelligence',
    description:
      'MediCare replaces cumbersome legacy health management systems with a fluid, unified mission control designed for modern clinics, specialty practices, and hospital departments.',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    stats: [
      { value: '99.9%', label: 'Uptime Reliability' },
      { value: '10x', label: 'Faster Patient Intake' },
      { value: '< 1s', label: 'Record Query Speed' },
      { value: '100%', label: 'HIPAA-Ready Architecture' },
    ],
    cards: [
      {
        icon: ShieldCheck,
        title: 'Zero-Friction Intake',
        desc: 'Instant patient registration with automated profile validation, contact indexing, and blood group categorization.',
      },
      {
        icon: HeartPulse,
        title: 'Clinical Continuity',
        desc: 'Centralized diagnostic histories and medication logs accessible in one tap by authorized practitioners.',
      },
      {
        icon: Clock,
        title: 'Intelligent Turnaround',
        desc: 'Eliminate scheduling bottlenecks and double bookings with smart status pipelines and calendar views.',
      },
    ],
  },
  {
    id: 'designers',
    label: 'Designers',
    eyebrow: 'Crafted Experience',
    icon: Layers,
    title: 'Engineered with 3D Depth, Glassmorphism & Visual Precision',
    description:
      'We designed MediCare from the ground up to reduce cognitive load during demanding medical shifts. Glass layers, tailored contrast ratios, and spatial lighting keep vital information front and center.',
    gradient: 'linear-gradient(135deg, #d946ef 0%, #e879f9 100%)',
    features: [
      {
        icon: Palette,
        title: 'Harmonious Cosmic Theme',
        desc: 'Curated deep purple and violet hues tuned for dark ambient clinic environments, reducing eye fatigue during night shifts.',
      },
      {
        icon: Cpu,
        title: 'Kinetic Micro-Interactions',
        desc: 'Every badge transition, status update, and modal trigger responds with physics-based fluid animation.',
      },
      {
        icon: Layers,
        title: 'Multi-Tier Glass Hierarchy',
        desc: 'Backdrop-filtered surface cards create unmistakable visual elevation between critical clinical data and background context.',
      },
      {
        icon: CheckCircle2,
        title: 'Adaptive Cross-Device Scaling',
        desc: 'Pixel-perfect responsiveness across desktop workstations, clinic tablets, and on-the-go practitioner screens.',
      },
    ],
  },
  {
    id: 'features',
    label: 'Features',
    eyebrow: 'Core Capabilities',
    icon: Zap,
    title: 'Everything Your Medical Practice Needs in One Unified Suite',
    description:
      'From patient onboarding to prescription management, MediCare provides end-to-end tooling that empowers doctors, administrative staff, and patients alike.',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    modules: [
      {
        icon: Users,
        title: 'Patient Directory',
        badge: 'Directory',
        items: [
          'Full demographic and medical contact profiles',
          'Instant multi-field search and pagination',
          'One-click patient record and visit history link',
        ],
      },
      {
        icon: CalendarCheck,
        title: 'Appointment Engine',
        badge: 'Scheduling',
        items: [
          'Doctor & department specific slot allocation',
          'Instant status switching (Scheduled, Completed, Cancelled)',
          'Real-time daily calendar digest and visit reminders',
        ],
      },
      {
        icon: FileText,
        title: 'Clinical Records & Rx',
        badge: 'Medical Logs',
        items: [
          'Structured diagnosis and prescription logging',
          'Dedicated clinician observation notes',
          'Instant modal-based record preview and search',
        ],
      },
    ],
  },
  {
    id: 'news',
    label: 'News',
    eyebrow: 'Releases & Roadmap',
    icon: Megaphone,
    title: 'Launch Edition: Built for the Future of Connected Care',
    description:
      'Explore the latest enhancements delivered in this release, along with our active development roadmap for intelligence and connected telehealth.',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
    changelog: [
      {
        tag: 'v2.4 · Current',
        title: 'Cinematic 3D Landing & Navigation',
        desc: 'Introduced high-definition 3D canvas backdrop, synced section dot tracking, and refined dark theme glass surfaces.',
        status: 'Live',
      },
      {
        tag: 'v2.3 · Update',
        title: 'Unified Medical Records Vault',
        desc: 'Comprehensive diagnostic records with expandable clinical view modals and real-time practitioner notes indexing.',
        status: 'Live',
      },
      {
        tag: 'v2.2 · Update',
        title: 'Smart Appointment Workflow',
        desc: 'Interactive appointment management with instant status toggling, filtering, and seamless calendar synchronization.',
        status: 'Live',
      },
      {
        tag: 'v3.0 · In Development',
        title: 'AI Clinical Copilot & Telehealth',
        desc: 'Automated diagnostic summary generation, smart prescription suggestion, and encrypted real-time video consults.',
        status: 'Coming Soon',
      },
    ],
  },
];

export default function LandingPage() {
  const [videoReady, setVideoReady] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['hero', 'about', 'designers', 'features', 'news'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.pageShell}>
      {/* ── Fixed Pagination Dots ─────────────────────────────────── */}
      <nav className={styles.paginationDots} aria-label="Section navigation">
        {sections.map((section, i) => (
          <button
            key={section.id}
            type="button"
            className={styles.dotButton}
            onClick={() => scrollToSection(section.id)}
            aria-label={`Go to ${section.label}`}
            title={section.label}
          >
            <span
              className={`${styles.paginationDot} ${
                activeSection === i ? styles.paginationDotActive : ''
              }`}
            />
          </button>
        ))}
      </nav>

      {/* ── Hero Section (1/5) ────────────────────────────────────── */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBackdrop} aria-hidden="true">
          <video
            className={`${styles.heroVideo} ${videoReady ? styles.heroVideoReady : ''}`}
            src="/back_mvp.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onCanPlayThrough={() => setVideoReady(true)}
          />
          <div className={styles.heroShade} />
          <div className={styles.heroVignette} />
          <div className={styles.heroGlow} />
        </div>

        <div className={styles.heroInner}>
          <div className={styles.copyBlock}>
            <div className={styles.copyBadge}>
              <Sparkles size={14} />
              High-impact landing experience
            </div>
            <h1 className={styles.headline}>Boost Your Practice</h1>
            <p className={styles.subcopy}>
              Patients, appointments, and records now sit on top of a polished
              full-screen 3D background so the landing page feels premium before
              users even enter the product.
            </p>
            <div className={styles.ctaRow}>
              <Link href="/register" className={styles.primaryCta}>
                <span className={styles.ctaIcon}>
                  <CheckCircle2 size={16} />
                </span>
                Get Started
              </Link>
              <Link
                href="/login"
                className={styles.secondaryCta}
              >
                Sign In
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className={styles.socialRail}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className={styles.heroExplorePill}
            aria-label="Scroll to explore features"
          >
            <span className={styles.exploreMouseIcon}>
              <span className={styles.exploreMouseWheel} />
            </span>
            <span className={styles.exploreText}>Explore Experience</span>
            <ChevronDown size={14} className={styles.exploreChevron} />
          </button>
        </div>
      </section>

      {/* ── Section 2: About (2/5) ────────────────────────────────── */}
      <section id="about" className={styles.fullSection}>
        <div className={styles.fullSectionBg} aria-hidden="true">
          <div className={styles.fullSectionOrb1} style={{ background: sections[1].gradient }} />
          <div className={styles.fullSectionOrb2} style={{ background: sections[1].gradient }} />
        </div>

        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconWrap} style={{ background: sections[1].gradient }}>
              <Rocket size={26} color="#fff" strokeWidth={2} />
            </div>
            <span className={styles.sectionEyebrow}>{sections[1].eyebrow}</span>
            <h2 className={styles.sectionTitle}>{sections[1].title}</h2>
            <p className={styles.sectionDescription}>{sections[1].description}</p>
          </div>

          {/* Stats Row */}
          <div className={styles.statsGrid}>
            {sections[1].stats?.map((st) => (
              <div key={st.label} className={styles.statCard}>
                <p className={styles.statValue}>{st.value}</p>
                <p className={styles.statLabel}>{st.label}</p>
              </div>
            ))}
          </div>

          {/* Highlights 3-Card Grid */}
          <div className={styles.cardGrid3}>
            {sections[1].cards?.map((c) => {
              const CardIcon = c.icon;
              return (
                <div key={c.title} className={styles.featureCard}>
                  <div className={styles.cardIconBox} style={{ background: sections[1].gradient }}>
                    <CardIcon size={20} color="#fff" />
                  </div>
                  <h3 className={styles.cardHeading}>{c.title}</h3>
                  <p className={styles.cardBody}>{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 3: Designers (3/5) ────────────────────────────── */}
      <section id="designers" className={styles.fullSection}>
        <div className={styles.fullSectionBg} aria-hidden="true">
          <div className={styles.fullSectionOrb1} style={{ background: sections[2].gradient }} />
          <div className={styles.fullSectionOrb2} style={{ background: sections[2].gradient }} />
        </div>

        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconWrap} style={{ background: sections[2].gradient }}>
              <Layers size={26} color="#fff" strokeWidth={2} />
            </div>
            <span className={styles.sectionEyebrow}>{sections[2].eyebrow}</span>
            <h2 className={styles.sectionTitle}>{sections[2].title}</h2>
            <p className={styles.sectionDescription}>{sections[2].description}</p>
          </div>

          {/* 2x2 Feature Showcase Cards */}
          <div className={styles.cardGrid2}>
            {sections[2].features?.map((f) => {
              const FIcon = f.icon;
              return (
                <div key={f.title} className={styles.showcaseCard}>
                  <div className={styles.showcaseHeader}>
                    <div className={styles.cardIconBox} style={{ background: sections[2].gradient }}>
                      <FIcon size={20} color="#fff" />
                    </div>
                    <h3 className={styles.cardHeading}>{f.title}</h3>
                  </div>
                  <p className={styles.cardBody}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 4: Features (4/5) ─────────────────────────────── */}
      <section id="features" className={styles.fullSection}>
        <div className={styles.fullSectionBg} aria-hidden="true">
          <div className={styles.fullSectionOrb1} style={{ background: sections[3].gradient }} />
          <div className={styles.fullSectionOrb2} style={{ background: sections[3].gradient }} />
        </div>

        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconWrap} style={{ background: sections[3].gradient }}>
              <Zap size={26} color="#fff" strokeWidth={2} />
            </div>
            <span className={styles.sectionEyebrow}>{sections[3].eyebrow}</span>
            <h2 className={styles.sectionTitle}>{sections[3].title}</h2>
            <p className={styles.sectionDescription}>{sections[3].description}</p>
          </div>

          {/* 3 Core Capability Modules */}
          <div className={styles.cardGrid3}>
            {sections[3].modules?.map((m) => {
              const MIcon = m.icon;
              return (
                <div key={m.title} className={styles.moduleCard}>
                  <div className={styles.moduleTop}>
                    <div className={styles.cardIconBox} style={{ background: sections[3].gradient }}>
                      <MIcon size={20} color="#fff" />
                    </div>
                    <span className={styles.moduleBadge}>{m.badge}</span>
                  </div>
                  <h3 className={styles.cardHeading}>{m.title}</h3>
                  <ul className={styles.moduleList}>
                    {m.items.map((it) => (
                      <li key={it}>
                        <Check size={14} className={styles.checkIcon} />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 5: News (5/5) ─────────────────────────────────── */}
      <section id="news" className={styles.fullSection}>
        <div className={styles.fullSectionBg} aria-hidden="true">
          <div className={styles.fullSectionOrb1} style={{ background: sections[4].gradient }} />
          <div className={styles.fullSectionOrb2} style={{ background: sections[4].gradient }} />
        </div>

        <div className={styles.fullSectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIconWrap} style={{ background: sections[4].gradient }}>
              <Megaphone size={26} color="#fff" strokeWidth={2} />
            </div>
            <span className={styles.sectionEyebrow}>{sections[4].eyebrow}</span>
            <h2 className={styles.sectionTitle}>{sections[4].title}</h2>
            <p className={styles.sectionDescription}>{sections[4].description}</p>
          </div>

          {/* 4-Item Timeline / Changelog Grid */}
          <div className={styles.cardGrid2}>
            {sections[4].changelog?.map((log) => (
              <div key={log.title} className={styles.newsCard}>
                <div className={styles.newsTopRow}>
                  <span className={styles.newsTag}>{log.tag}</span>
                  <span
                    className={
                      log.status === 'Live'
                        ? styles.newsStatusLive
                        : styles.newsStatusUpcoming
                    }
                  >
                    {log.status}
                  </span>
                </div>
                <h3 className={styles.cardHeading}>{log.title}</h3>
                <p className={styles.cardBody}>{log.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>MediCare</span>
            <span className={styles.footerTagline}>Modern Patient Management Platform</span>
          </div>
          <nav className={styles.footerNav}>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/patients">Patients</Link>
            <Link href="/appointments">Appointments</Link>
            <Link href="/records">Records</Link>
          </nav>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} MediCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
