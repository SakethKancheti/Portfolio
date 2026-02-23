import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

// ─── Lenis smooth scroll ───────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    let lenis;
    let rafId;

    async function init() {
      const { default: Lenis } = await import("https://esm.sh/@studio-freight/lenis@1.0.42");
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    }
    init();
    return () => {
      if (lenis) lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);
}

// ─── Reveal on scroll ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 36 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Magnetic button ──────────────────────────────────────────────────────
function MagneticBtn({ children, href, accent }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left - r.width / 2) * 0.35,
      y: (e.clientY - r.top - r.height / 2) * 0.35,
    });
  };
  return (
    <motion.a
      ref={ref}
      href={href || "#"}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      style={{
        display: "inline-block",
        padding: "14px 36px",
        borderRadius: "100px",
        background: accent ? "var(--accent)" : "transparent",
        border: `2px solid ${accent ? "var(--accent)" : "var(--text)"}`,
        color: accent ? "#0d0f0b" : "var(--text)",
        fontWeight: 700,
        fontSize: "0.9rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
        cursor: "pointer",
        userSelect: "none",
        fontFamily: "var(--font-body)",
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.a>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Projects", "Skills", "Lectures", "Achievements", "Contact"];
  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "20px 5vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "rgba(209,213,200,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          transition: "background 0.4s, backdrop-filter 0.4s",
        }}
      >
        <a href="#" style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 400, letterSpacing: "0.05em", color: "var(--accent2)", textDecoration: "none" }}>
          SK
        </a>
        <div style={{ display: "flex", gap: "2.5rem" }} className="nav-links">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                textDecoration: "none",
                transition: "color 0.2s",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
            >
              {l}
            </a>
          ))}
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          className="hamburger"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text)",
            fontSize: "1.5rem",
          }}
        >
          ☰
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--bg)",
              zIndex: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: "absolute",
                top: "2rem",
                right: "5vw",
                background: "none",
                border: "none",
                color: "var(--text)",
                fontSize: "2rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            {links.map((l, i) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 8vw, 4rem)",
                  fontWeight: 400,
                  color: "var(--text)",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--text)")}
              >
                {l}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const chars = "SAKETH KANCHETI".split("");

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 5vw",
      }}
    >
      {/* background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />
      {/* radial glow behind hero text */}
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 0,
        }}
      />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "1.5rem",
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
          }}
        >
          ▸ PORTFOLIO // 2025
        </motion.p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 12vw, 11rem)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          {chars.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 80, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: 0.4 + i * 0.04,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                display: "inline-block",
                color: ch === " " ? "transparent" : "var(--text)",
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          style={{
            marginTop: "2rem",
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            color: "var(--text-muted)",
            maxWidth: "540px",
            margin: "2rem auto 3rem",
            lineHeight: 1.6,
            fontFamily: "var(--font-body)",
          }}
        >
          Security Engineer — building bold digital experiences across enterprise security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <MagneticBtn href="#projects" accent>
            View Work
          </MagneticBtn>
          <MagneticBtn href="#contact">Get in Touch</MagneticBtn>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            width: "1px",
            height: "50px",
            background: "linear-gradient(to bottom, var(--accent), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "12rem 5vw", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        <div>
          <Reveal>
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
              }}
            >
              01 — About
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: "0.02em",
                margin: "1.2rem 0 2rem",
                color: "var(--text)",
              }}
            >
              Crafting security
              <br />
              <span style={{ color: "var(--accent)" }}>experiences.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.9,
                fontSize: "1.05rem",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-body)",
              }}
            >
              Security Engineer with 3+ years of experience in operations, governance, penetration testing, and OSINT threat intelligence of enterprise security controls such as SIEM, SOAR, EDR, IAM, cloud, and vulnerability management platforms.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.9,
                fontSize: "1.05rem",
                fontFamily: "var(--font-body)",
              }}
            >
              I have a record of accomplishment in defining and quantifying security KPIs, enabling continuous improvement, and leading complex security initiatives in both cloud and on-premises infrastructures from conception to delivery.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "100%",
                aspectRatio: "3/4",
                borderRadius: "4px",
                background: "linear-gradient(135deg, rgba(74,222,128,0.08), rgba(74,222,128,0.02))",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "6rem",
              }}
            >
              🛡️
            </div>
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  fontFamily: "var(--font-display)",
                  lineHeight: 1,
                }}
              >
                3+
              </span>
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "var(--text)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}
              >
                Years exp
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────
const projects = [
  {
    title: "Ripple Consensus Security Analysis",
    tag: "Security Research",
    year: "2024",
    desc: "Analyzed the security properties of Ripple's federated consensus protocol, identifying trust model weaknesses, conditions for ledger divergence, and gaps between documented and formally proven guarantees.",
  },
  {
    title: "Project Beta",
    tag: "Frontend",
    year: "2024",
    desc: "Award-winning marketing site with scroll animations and modern web technologies.",
  },
  {
    title: "Project Gamma",
    tag: "Security",
    year: "2023",
    desc: "Enterprise security tooling with detection-as-code and threat intelligence integration.",
  },
  {
    title: "Project Delta",
    tag: "DevSecOps",
    year: "2023",
    desc: "Automation pipeline for SIEM alert synchronization and CI/CD security checks.",
  },
];

function ProjectCard({ project, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={i * 0.08}>
      <motion.div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ y: hovered ? -8 : 0 }}
        style={{
          padding: "2.5rem",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "border-color 0.3s",
          borderColor: hovered ? "var(--accent)" : "var(--border)",
          background: hovered ? "rgba(74,222,128,0.04)" : "transparent",
          boxShadow: hovered ? "0 8px 30px rgba(74,222,128,0.12)" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontWeight: 700,
              border: "1px solid rgba(74,222,128,0.4)",
              padding: "4px 12px",
              borderRadius: "100px",
              fontFamily: "var(--font-mono)",
            }}
          >
            {project.tag}
          </span>
          <span
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {project.year}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            margin: "0 0 1rem",
            color: "var(--text)",
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            lineHeight: 1.7,
            fontSize: "0.95rem",
            marginBottom: "2rem",
            fontFamily: "var(--font-body)",
          }}
        >
          {project.desc}
        </p>
        <motion.span
          animate={{ x: hovered ? 6 : 0 }}
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}
        >
          View Project →
        </motion.span>
      </motion.div>
    </Reveal>
  );
}

function Projects() {
  return (
    <section
      id="projects"
      style={{
        padding: "8rem 5vw",
        background: "var(--bg-soft)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            02 — Projects
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              margin: "1.2rem 0 4rem",
              color: "var(--text)",
            }}
          >
            Selected Work
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
          className="projects-grid"
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────
const skills = [
  { name: "SIEM / SOAR", pct: 95 },
  { name: "Cloud Security (AWS)", pct: 88 },
  { name: "Penetration Testing", pct: 85 },
  { name: "EDR / XDR", pct: 82 },
  { name: "Python / Automation", pct: 90 },
  { name: "Threat Intelligence", pct: 85 },
  { name: "Terraform / IaC", pct: 78 },
  { name: "NIST / HIPAA", pct: 88 },
];

function SkillBar({ skill, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <Reveal delay={i * 0.06}>
      <div ref={ref} style={{ marginBottom: "1.8rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              color: "var(--text)",
            }}
          >
            {skill.name}
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              color: "var(--accent)",
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
            }}
          >
            {skill.pct}%
          </span>
        </div>
        <div
          style={{
            height: "3px",
            background: "rgba(74,222,128,0.15)",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${skill.pct}%` } : {}}
            transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--accent), #86efac)",
              borderRadius: "100px",
            }}
          />
        </div>
      </div>
    </Reveal>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "8rem 5vw" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            03 — Skills
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              margin: "1.2rem 0 4rem",
              color: "var(--text)",
            }}
          >
            My Toolkit
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 5rem" }}>
          {skills.map((s, i) => (
            <SkillBar key={s.name} skill={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Guest Lectures ───────────────────────────────────────────────────────
const lectures = [
  { title: "Modern Security Patterns", venue: "DevSecOps Conf 2024", date: "Nov 2024", audience: "500+" },
  { title: "Threat Hunting with SIEM", venue: "Security Summit", date: "Aug 2024", audience: "300+" },
  { title: "Building Secure Cloud Infra", venue: "CloudSec Conf", date: "Mar 2024", audience: "200+" },
];

function Lectures() {
  return (
    <section
      id="lectures"
      style={{
        padding: "8rem 5vw",
        background: "var(--bg-soft)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            04 — Guest Lectures
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              margin: "1.2rem 0 4rem",
              color: "var(--text)",
            }}
          >
            Speaking
          </h2>
        </Reveal>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {lectures.map((l, i) => (
            <Reveal key={l.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ background: "rgba(74,222,128,0.06)" }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  padding: "2rem 2.5rem",
                  borderBottom: i < lectures.length - 1 ? "1px solid var(--border)" : "none",
                  background: "transparent",
                  transition: "background 0.3s",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.4rem",
                      fontWeight: 400,
                      margin: "0 0 0.4rem",
                      letterSpacing: "0.02em",
                      color: "var(--text)",
                    }}
                  >
                    {l.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {l.venue} · {l.date}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--accent)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {l.audience}
                  </span>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      margin: "0.2rem 0 0",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    Attendees
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────
const achievements = [
  {
    icon: "🏆",
    title: "Security Excellence Award",
    org: "NKC Health",
    desc: "Recognized for outstanding contributions to enterprise security posture.",
  },
  {
    icon: "🥇",
    title: "Detection-as-Code Pipeline",
    org: "Accenture",
    desc: "Built DevSecOps automation that reduced false positives by 30%.",
  },
  {
    icon: "📜",
    title: "AWS Certified",
    org: "Amazon Web Services",
    desc: "Solutions Architect and Security Specialty certifications.",
  },
  {
    icon: "🌟",
    title: "NIST & HIPAA Compliance",
    org: "Enterprise",
    desc: "Led governance playbooks and policy documentation for regulated environments.",
  },
];

function Achievements() {
  return (
    <section id="achievements" style={{ padding: "8rem 5vw" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            05 — Achievements
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              margin: "1.2rem 0 4rem",
              color: "var(--text)",
            }}
          >
            Milestones
          </h2>
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
          className="achievements-grid"
        >
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6, borderColor: "var(--accent)" }}
                style={{
                  padding: "2.5rem",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  transition: "border-color 0.3s",
                  background: "var(--bg-card)",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1.2rem" }}>{a.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    margin: "0 0 0.3rem",
                    letterSpacing: "0.02em",
                    color: "var(--text)",
                  }}
                >
                  {a.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    marginBottom: "0.8rem",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {a.org}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {a.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section
      id="contact"
      style={{
        padding: "8rem 5vw 6rem",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <span
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
            }}
          >
            06 — Contact
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              lineHeight: 0.95,
              margin: "1.2rem 0 2rem",
              color: "var(--text)",
            }}
          >
            Let's build
            <br />
            <span style={{ color: "var(--accent)" }}>something.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              marginBottom: "3rem",
              fontFamily: "var(--font-body)",
            }}
          >
            Open to freelance projects, full-time roles, and speaking engagements.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <MagneticBtn href="mailto:sakethkancheti@gmail.com" accent>
              Email
            </MagneticBtn>
            <MagneticBtn href="https://www.linkedin.com/in/sakethkancheti/">LinkedIn</MagneticBtn>
            <MagneticBtn href="https://github.com/SakethKancheti">GitHub</MagneticBtn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: "2rem 5vw",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        background: "var(--bg-soft)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 400,
          color: "var(--accent2)",
        }}
      >
        SK
      </span>
      <span
        style={{
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        © {new Date().getFullYear()} Saketh Kancheti. Built with React + Framer Motion + Lenis.
      </span>
    </footer>
  );
}

// ─── CS Crosshair Cursor ──────────────────────────────────────────────────
function CustomCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const down = () => setClicked(true);
    const up = () => setClicked(false);
    const over = (e) => setHovered(!!e.target.closest("a, button"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  const gap = hovered ? 10 : clicked ? 2 : 5;
  const lineLen = hovered ? 10 : 14;
  const thickness = 2;
  const color = "#4ade80";
  const shadow = "0 0 6px #4ade80, 0 0 12px rgba(74,222,128,0.5)";

  const baseStyle = {
    position: "fixed",
    background: color,
    boxShadow: shadow,
    pointerEvents: "none",
    zIndex: 9999,
    borderRadius: "1px",
  };

  return (
    <>
      {/* center dot */}
      <motion.div
        animate={{
          x: pos.x - 1.5,
          y: pos.y - 1.5,
          opacity: clicked ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 40 }}
        style={{ ...baseStyle, width: 3, height: 3, borderRadius: "50%" }}
      />
      {/* top */}
      <motion.div
        animate={{
          x: pos.x - thickness / 2,
          y: pos.y - gap - lineLen,
          width: thickness,
          height: lineLen,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        style={baseStyle}
      />
      {/* bottom */}
      <motion.div
        animate={{
          x: pos.x - thickness / 2,
          y: pos.y + gap,
          width: thickness,
          height: lineLen,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        style={baseStyle}
      />
      {/* left */}
      <motion.div
        animate={{
          x: pos.x - gap - lineLen,
          y: pos.y - thickness / 2,
          width: lineLen,
          height: thickness,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        style={baseStyle}
      />
      {/* right */}
      <motion.div
        animate={{
          x: pos.x + gap,
          y: pos.y - thickness / 2,
          width: lineLen,
          height: thickness,
        }}
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        style={baseStyle}
      />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────
export default function App() {
  useLenis();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Share+Tech+Mono&display=swap');
        :root {
          --font-display: 'Bebas Neue', sans-serif;
          --font-body: 'Rajdhani', sans-serif;
          --font-mono: 'Share Tech Mono', monospace;
          --bg: #d1d5c8;
          --bg-soft: #c8ccbf;
          --bg-card: #cdd1c8;
          --text: #0d0f0b;
          --text-muted: rgba(13,15,11,0.5);
          --accent: #4ade80;
          --accent2: #f59e0b;
          --border: rgba(13,15,11,0.12);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { cursor: none; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          overflow-x: hidden;
          font-size: 1.05rem;
          letter-spacing: 0.01em;
          line-height: 1.6;
        }
        a { cursor: none; }
        button { cursor: none; }
        ::selection { background: var(--accent); color: var(--text); }
        /* scanline overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(13,15,11,0.02) 2px,
            rgba(13,15,11,0.02) 4px
          );
          pointer-events: none;
          z-index: 1000;
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          section > div { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .achievements-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Lectures />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
