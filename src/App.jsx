import React, { useEffect, useRef, useState } from 'react'
import Chatbot from './components/Chatbot'
import './index.css'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const handleContactSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const subject = formData.get('subject')
    const message = formData.get('message')
    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sumithatekar9@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Sumit,\n\nMy name is ${name}.\n\n${message}`)}`
    window.open(mailUrl, '_blank')
  }

  return (
    <div className="pf">
      {/* ── Navbar ── */}
      <div className="nav">
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <a href="#home" className="logo">SUMIT <span>HATEKAR</span></a>

          {/* Desktop nav links */}
          <div className="nav-links">
            <a href="#projects" className="nav-link">Projects</a>
            <a href="#skills" className="nav-link">Skills</a>
            <a href="#education" className="nav-link">Education</a>
            <a href="#contact" className="nav-cta">Contact</a>
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            className={`nav-hamburger${mobileMenuOpen ? ' open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`nav-mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
          <a href="#projects" className="nav-mobile-link" onClick={closeMobileMenu}>Projects</a>
          <a href="#skills" className="nav-mobile-link" onClick={closeMobileMenu}>Skills</a>
          <a href="#education" className="nav-mobile-link" onClick={closeMobileMenu}>Education</a>
          <a href="#contact" className="nav-mobile-link cta" onClick={closeMobileMenu}>Contact</a>
        </div>
      </div>

      <div className="hero" id="home">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-tag fade-up">
                <span className="hero-dot-active"></span>
                Full Stack Developer · Pune, India
              </div>
              <h1 className="hero-title-new fade-up fade-up-delay-1">
                SUMIT <span className="accent-gradient">HATEKAR</span>
              </h1>
              <p className="hero-tagline fade-up fade-up-delay-2">
                Backend-focused Software Engineer specializing in scalable web applications using Java and Spring Boot.
              </p>

              <div className="profile-summary-card fade-up fade-up-delay-2">
                <div className="summary-title">Profile Summary</div>
                <p className="summary-text">
                  Experienced in designing secure REST APIs with Spring Security (JWT, OAuth2, Rate Limiting). Proficient in database design, query optimization, and Redis caching. Skilled in cloud storage integrations (MinIO), asynchronous messaging, and deployment automation with GitHub Actions.
                </p>
              </div>

              <div className="hero-btns-new fade-up fade-up-delay-3">
                <a href="#projects" className="btn-dark-new">View Projects</a>
                <a href="#contact" className="btn-outline-new">Get In Touch</a>
              </div>
            </div>

            <div className="hero-visual fade-up fade-up-delay-2">
              <div className="ide-window">
                <div className="ide-header">
                  <div className="ide-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="ide-title">PortfolioController.java</div>
                </div>
                <div className="ide-body">
                  <pre>
                    <code>
                      <span className="code-annotation">@RestController</span>{"\n"}
                      <span className="code-annotation">@RequestMapping</span>(<span className="code-string">"/api/v1/dev"</span>){"\n"}
                      <span className="code-keyword">public class</span> <span className="code-class">PortfolioController</span> &#123;{"\n\n"}
                      {"    "}<span className="code-annotation">@GetMapping</span>(<span className="code-string">"/sumit"</span>){"\n"}
                      {"    "}<span className="code-keyword">public</span> <span className="code-type">ResponseEntity</span>&lt;<span className="code-type">DevProfile</span>&gt; getProfile() &#123;{"\n"}
                      {"        "}<span className="code-keyword">return</span> <span className="code-type">ResponseEntity</span>.ok({"\n"}
                      {"            "}<span className="code-type">DevProfile</span>.builder(){"\n"}
                      {"                "}.name(<span className="code-string">"Sumit Hatekar"</span>){"\n"}
                      {"                "}.role(<span className="code-string">"Full Stack Dev"</span>){"\n"}
                      {"                "}.specialization(<span className="code-string">"Spring Boot & AWS"</span>){"\n"}
                      {"                "}.gpa(<span className="code-number" style={{ color: '#f97316' }}>9.23</span>) <span className="code-comment">// SPPU First Year</span>{"\n"}
                      {"                "}.skills(<span className="code-type">List</span>.of({"\n"}
                      {"                    "}<span className="code-string">"Java"</span>, <span className="code-string">"PostgreSQL"</span>,{"\n"}
                      {"                    "}<span className="code-string">"Redis"</span>, <span className="code-string">"Docker"</span>, <span className="code-string">"React"</span>{"\n"}
                      {"                "})){"\n"}
                      {"                "}.build(){"\n"}
                      {"        "});{"\n"}
                      {"    "}&#125;{"\n"}
                      &#125;
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section" id="projects">
        <div className="wrap">
          <div className="section-label fade-up">Showcase</div>
          <div className="section-title fade-up fade-up-delay-1">Featured <span>Projects</span></div>

          <div className="proj-list">
            {/* UEMS */}
            <div className="proj-h-card fade-up">
              <div className="proj-h-video">
                <video src="/videos/uems exam management.mp4" autoPlay muted loop playsInline />
              </div>
              <div className="proj-h-body">
                <div className="proj-h-meta">
                  <span className="proj-badge role">Full Stack Developer</span>
                  <span className="proj-badge year">2025 – 2026</span>
                  <span className="proj-badge type">OJT · Team Project</span>
                </div>
                <div className="proj-tech">Spring Boot · React · PostgreSQL · Redis · Docker · AWS</div>
                <div className="proj-name">Unified Examination Management Portal</div>
                <div className="proj-subtitle">uems.corstack.in</div>
                <div className="proj-desc">Designed and developed a secure, multi-region unified examination management backend. Built end-to-end from exam creation to result processing, deployed on AWS with Docker and automated CI/CD.</div>
                <ul className="proj-highlights">
                  <li>Designed secure multi-region backend using Spring Boot with RESTful APIs for Schools, Students, Exams & Results</li>
                  <li>Integrated Redis caching to optimize queries and reduce database load for repetitive lookups</li>
                  <li>Configured AWS RDS (PostgreSQL) and MinIO/S3 for secure, automated document uploads</li>
                  <li>Built React UI components and connected them to the Spring Boot REST backend using Axios</li>
                  <li>Deployed on AWS EC2 via Docker, routed via Cloudflare & Nginx Proxy Manager with GitHub Actions CI/CD</li>
                </ul>
                <div className="proj-links">
                  <a href="https://uems.corstack.in" target="_blank" rel="noopener noreferrer" className="proj-btn-new">Live Demo <i className="ti ti-arrow-up-right"></i></a>
                </div>
              </div>
            </div>

            {/* ResumeMaker Pro */}
            <div className="proj-h-card fade-up">
              <div className="proj-h-video">
                <video src="/videos/resume-maker.mp4" autoPlay muted loop playsInline />
              </div>
              <div className="proj-h-body">
                <div className="proj-h-meta">
                  <span className="proj-badge role">Full Stack Developer</span>
                  <span className="proj-badge year">Sep 2025 – Dec 2025</span>
                  <span className="proj-badge type">Personal Project</span>
                </div>
                <div className="proj-tech">Spring Boot · React · Groq AI · RabbitMQ · Docker · AWS · JWT</div>
                <div className="proj-name">ResumeMaker Pro</div>
                <div className="proj-subtitle">resumemaker.corstack.in</div>
                <div className="proj-desc">Spring Boot backend for AI-powered resume creation, management, and optimization. Built secure authentication flows, integrated Groq AI for real-time content enhancement, and deployed with Docker on AWS.</div>
                <ul className="proj-highlights">
                  <li>Built secure auth using Spring Security, JWT (Access/Refresh Tokens), and API Rate Limiting</li>
                  <li>Integrated Groq AI service for real-time content enhancement and professional phrasing suggestions</li>
                  <li>Developed a PDF parsing and extraction service to extract layout data and map to resume DTOs</li>
                  <li>Configured an asynchronous notification flow using RabbitMQ, AWS EventBridge, and Brevo API</li>
                  <li>Designed relational database schemas with JPA to manage nested resume details deployed on AWS RDS</li>
                  <li>Built a React and PixiJS frontend, hosted on AWS EC2 via Docker, routed via Cloudflare & Nginx Proxy Manager</li>
                </ul>
                <div className="proj-links">
                  <a href="https://resumemaker.corstack.in" target="_blank" rel="noopener noreferrer" className="proj-btn-new">Live Demo <i className="ti ti-arrow-up-right"></i></a>
                </div>
              </div>
            </div>

            {/* PDF Editor App */}
            <div className="proj-h-card fade-up">
              <div className="proj-h-video">
                <video src="/videos/pdf-editor.mp4" autoPlay muted loop playsInline />
              </div>
              <div className="proj-h-body">
                <div className="proj-h-meta">
                  <span className="proj-badge role">Full Stack Developer</span>
                  <span className="proj-badge year">Dec 2025 – Present</span>
                  <span className="proj-badge type">Personal Project</span>
                </div>
                <div className="proj-tech">Python · FastAPI · PyMuPDF · React</div>
                <div className="proj-name">PDF Editor App — JSON-Based PDF Reconstruction</div>
                <div className="proj-subtitle">pdf-editor-1-tcb2.onrender.com</div>
                <div className="proj-desc">A PDF processing tool that extracts structured JSON from documents and regenerates PDFs with high visual fidelity. Features an AI chat panel for querying PDF content and an editing mode for modifying document structure.</div>
                <ul className="proj-highlights">
                  <li>Built a PDF extraction and regeneration backend using FastAPI and PyMuPDF for structured JSON processing</li>
                  <li>Regenerated PDFs from extracted JSON while preserving approximately 90–100% visual layout fidelity</li>
                  <li>Replaced system and embedded fonts with Google Fonts during PDF regeneration</li>
                  <li>Maintained consistent coordinate mapping between extracted data and regenerated output</li>
                  <li>Added an AI-powered chat panel for querying and conversing about PDF contents</li>
                </ul>
                <div className="proj-links">
                  <a href="https://pdf-editor-1-tcb2.onrender.com" target="_blank" rel="noopener noreferrer" className="proj-btn-new">Live Demo <i className="ti ti-arrow-up-right"></i></a>
                </div>
              </div>
            </div>

            {/* Code Search Engine */}
            <div className="proj-h-card fade-up">
              <div className="proj-h-video">
                <video src="/videos/codesearchengine.mp4" autoPlay muted loop playsInline />
              </div>
              <div className="proj-h-body">
                <div className="proj-h-meta">
                  <span className="proj-badge role">Creator & Developer</span>
                  <span className="proj-badge year">2025 – Present</span>
                  <span className="proj-badge type">Open Source</span>
                </div>
                <div className="proj-tech">Python · FastAPI · MCP · Tree-sitter · SQLite · Ripgrep</div>
                <div className="proj-name">Code Search Engine</div>
                <div className="proj-subtitle">Local-first developer tool for humans and AI</div>
                <div className="proj-desc">A local-first intelligent repository engine combining FastAPI backend, MCP server, and web UI. Features ripgrep-powered search, semantic embeddings, AST extraction, call graphs, and safe code editing.</div>
                <ul className="proj-highlights">
                  <li>Ripgrep-powered code search with semantic embeddings via BAAI/bge-small-en-v1.5</li>
                  <li>AST extraction for functions, classes and signatures via tree-sitter</li>
                  <li>Call graph analysis — callers, callees, impact analysis, execution tracing</li>
                  <li>MCP Server with 15+ tools for AI agents (Claude, OpenCode, Cursor)</li>
                </ul>
                <div className="proj-links">
                  <a href="https://github.com/sumit1456/CodeSearchEngine" target="_blank" rel="noopener noreferrer" className="proj-btn-new">GitHub <i className="ti ti-brand-github"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* Other Projects */}
          <div className="other-proj-header">
            <div className="section-label" style={{ marginBottom: 0 }}>Other Work</div>
            <p className="other-proj-sub">Team projects & collaborative work — no public demos available</p>
          </div>
          <div className="other-proj-grid">
            <div className="other-proj-card fade-up">
              <div className="other-proj-icon">🗃️</div>
              <div>
                <div className="other-proj-tech">Spring Boot · JPA Specifications · PostgreSQL · REST API</div>
                <div className="other-proj-name">Deadstock Inventory System</div>
                <div className="other-proj-desc">Built a Spring Boot backend to manage, track, and audit institution-wide assets. Developed paginated REST APIs using JPA Specifications for efficient searching. Collaborated with frontend team to integrate APIs and optimize PostgreSQL operations.</div>
                <div className="other-proj-meta">Institutional Commission · Team Project · 2025 – Present</div>
              </div>
            </div>
            <div className="other-proj-card other-proj-placeholder fade-up">
              <div className="other-proj-icon">🚧</div>
              <div>
                <div className="other-proj-name">More Coming Soon</div>
                <div className="other-proj-desc">Building more backend microservices. They'll appear here as they're ready.</div>
              </div>
            </div>
          </div>
        </div>{/* end .wrap */}
      </div>

      <div className="skills-section" id="skills">
        <div className="wrap">
          <div className="section-label fade-up">Capabilities</div>
          <div className="section-title fade-up fade-up-delay-1">Technical <span>Ecosystem</span></div>
          <div className="skills-grid-new">

            <div className="skill-card-new fade-up">
              <div className="skill-card-header">
                <i className="ti ti-code-circle skill-icon"></i>
                <div className="skill-card-title">Languages</div>
              </div>
              <div className="skill-card-tags">
                <span className="s-tag-new">Java (Core & Advanced)</span>
                <span className="s-tag-new">SQL</span>
                <span className="s-tag-new">JavaScript (ES6+)</span>
                <span className="s-tag-new">HTML5 / CSS3</span>
                <span className="s-tag-new">Python</span>
              </div>
            </div>

            <div className="skill-card-new fade-up fade-up-delay-1">
              <div className="skill-card-header">
                <i className="ti ti-layers-intersect skill-icon"></i>
                <div className="skill-card-title">Frameworks & Libraries</div>
              </div>
              <div className="skill-card-tags">
                <span className="s-tag-new">Spring Boot</span>
                <span className="s-tag-new">Spring Security</span>
                <span className="s-tag-new">Spring Data JPA</span>
                <span className="s-tag-new">Hibernate</span>
                <span className="s-tag-new">React</span>
                <span className="s-tag-new">Redux</span>
              </div>
            </div>

            <div className="skill-card-new fade-up fade-up-delay-2">
              <div className="skill-card-header">
                <i className="ti ti-cloud-computing skill-icon"></i>
                <div className="skill-card-title">Cloud & DevOps</div>
              </div>
              <div className="skill-card-tags">
                <span className="s-tag-new">AWS (EC2, S3, RDS, EventBridge)</span>
                <span className="s-tag-new">Docker</span>
                <span className="s-tag-new">Git</span>
                <span className="s-tag-new">GitHub Actions</span>
                <span className="s-tag-new">MinIO Object Storage</span>
                <span className="s-tag-new">CI/CD</span>
              </div>
            </div>

            <div className="skill-card-new fade-up fade-up-delay-1">
              <div className="skill-card-header">
                <i className="ti ti-database skill-icon"></i>
                <div className="skill-card-title">Databases & Caching</div>
              </div>
              <div className="skill-card-tags">
                <span className="s-tag-new">PostgreSQL</span>
                <span className="s-tag-new">Oracle SQL</span>
                <span className="s-tag-new">Redis Cache</span>
                <span className="s-tag-new">Database Indexing</span>
                <span className="s-tag-new">Query Optimization</span>
              </div>
            </div>

            <div className="skill-card-new fade-up fade-up-delay-2">
              <div className="skill-card-header">
                <i className="ti ti-shield-lock skill-icon"></i>
                <div className="skill-card-title">Architecture & Security</div>
              </div>
              <div className="skill-card-tags">
                <span className="s-tag-new">RESTful API Design</span>
                <span className="s-tag-new">OAuth2</span>
                <span className="s-tag-new">JWT (Access/Refresh Tokens)</span>
                <span className="s-tag-new">Rate Limiting</span>
                <span className="s-tag-new">RabbitMQ</span>
                <span className="s-tag-new">Maven</span>
              </div>
            </div>

            <div className="skill-card-new fade-up fade-up-delay-3">
              <div className="skill-card-header">
                <i className="ti ti-cpu skill-icon"></i>
                <div className="skill-card-title">Testing & AI Integrations</div>
              </div>
              <div className="skill-card-tags">
                <span className="s-tag-new">Postman API Testing</span>
                <span className="s-tag-new">Swagger Doc</span>
                <span className="s-tag-new">LLM Integration (Groq AI)</span>
                <span className="s-tag-new">PDF Data Extraction</span>
              </div>
            </div>

          </div>
        </div>{/* end .wrap */}
      </div>

      <div className="edu-section" id="education">
        <div className="wrap">
          <div className="section-label fade-up">Academic & Professional Foundation</div>
          <div className="section-title fade-up fade-up-delay-1">Credentials & <span>Certifications</span></div>
          <div className="edu-grid">
            <div className="edu-card fade-up">
              <div className="edu-year">2025 – 2027 (Expected)</div>
              <div className="edu-title">Master of Science in Computer Applications</div>
              <div className="edu-org">Savitribai Phule Pune University</div>
              <div className="edu-detail">Current First Year Performance: <span className="edu-grade">9.23 GPA</span>. Focuses on advanced software engineering, distributed systems, and backend design patterns.</div>
            </div>
            <div className="edu-card fade-up fade-up-delay-1">
              <div className="edu-year">2024</div>
              <div className="edu-title">Java Full Stack Development</div>
              <div className="edu-org">QSpiders Wakad</div>
              <div className="edu-detail">Professional training program. Developed industrial competencies in Core & Advanced Java, SQL, Hibernate, Spring Boot, React, and RESTful web services.</div>
            </div>
            <div className="edu-card fade-up fade-up-delay-2">
              <div className="edu-year">2021 – 2024</div>
              <div className="edu-title">Bachelor of Science in Chemistry</div>
              <div className="edu-org">Shivaji University</div>
              <div className="edu-detail">Graduated with <span className="edu-grade">65%</span>. Gained analytical research methodologies, mathematical reasoning, and systematic troubleshooting workflows.</div>
            </div>
          </div>
        </div>{/* end .wrap */}
      </div>

      <div className="contact-section" id="contact">
        <div className="wrap">
          <div className="section-label fade-up">Connection</div>
          <div className="section-title fade-up fade-up-delay-1">Get In <span>Touch</span></div>
          <div className="contact-grid">
            <div className="fade-up fade-up-delay-2">
              <div className="contact-lead">Let's build something extraordinary together.</div>
              <div className="contact-sub">I am currently open to exciting backend/full-stack developer opportunities, interesting collaborations, or discussing robust systems and cloud architecture.</div>
              <div className="contact-links">
                <a href="mailto:sumithatekar9@gmail.com" className="c-link">
                  <div className="c-icon"><i className="ti ti-mail" aria-hidden="true"></i></div>
                  <div><div className="c-info-label">Email</div><div className="c-info-val">sumithatekar9@gmail.com</div></div>
                </a>
                <a href="https://github.com/sumit1456" target="_blank" rel="noopener noreferrer" className="c-link">
                  <div className="c-icon"><i className="ti ti-brand-github" aria-hidden="true"></i></div>
                  <div><div className="c-info-label">GitHub</div><div className="c-info-val">github.com/sumit1456</div></div>
                </a>
                <a href="https://linkedin.com/in/sumit-hatekar123" target="_blank" rel="noopener noreferrer" className="c-link">
                  <div className="c-icon"><i className="ti ti-brand-linkedin" aria-hidden="true"></i></div>
                  <div><div className="c-info-label">LinkedIn</div><div className="c-info-val">in/sumit-hatekar123</div></div>
                </a>
              </div>
            </div>
            <form className="contact-form fade-up fade-up-delay-3" onSubmit={handleContactSubmit}>
              <div className="form-row">
                <div><label className="form-label">Full Name</label><input name="name" className="form-inp" placeholder="John Doe" required /></div>
                <div><label className="form-label">Subject</label><input name="subject" className="form-inp" placeholder="Project Inquiry" required /></div>
              </div>
              <div><label className="form-label">Message</label><textarea name="message" className="form-textarea" placeholder="Describe your vision..." required></textarea></div>
              <button type="submit" className="form-submit">Transmit Message</button>
            </form>
          </div>
        </div>{/* end .wrap */}
      </div>

      <div className="footer">
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="footer-text">© 2026 Sumit Hatekar. Dedicated to systems that scale.</div>
          <div className="footer-links">
            <a href="https://github.com/sumit1456" target="_blank" rel="noopener noreferrer" className="f-link">GitHub</a>
            <a href="https://linkedin.com/in/sumit-hatekar123" target="_blank" rel="noopener noreferrer" className="f-link">LinkedIn</a>
          </div>
        </div>
      </div>

      <Chatbot />
    </div>
  )
}

export default App