import React, { useEffect } from 'react'
import Chatbot from './components/Chatbot'
import './index.css'

function App() {
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
      <div className="nav">
        <a href="#home" className="logo">SUMIT <span>HATEKAR</span></a>
        <div className="nav-links">
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#education" className="nav-link">Education</a>
          <a href="#contact" className="nav-cta">Contact</a>
        </div>
      </div>

      <div className="hero" id="home">
        <div className="hero-tag"><div className="hero-dot"></div>Full Stack Developer · Pune, India</div>
        <div className="hero-title">SUMIT<br /><span className="light">HATEKAR</span></div>
        <div className="hero-sub">Building scalable enterprise systems and performance-focused web architectures. Java / Spring Boot · React · WebGL.</div>
        <div className="hero-btns">
          <a href="#projects" className="btn-dark">View Projects</a>
          <a href="#contact" className="btn-outline">Get In Touch</a>
        </div>
        <div className="hero-chips">
          <div className="chip">Backend Architecture</div>
          <div className="chip">Full Stack Delivery</div>
          <div className="chip">Enterprise Systems</div>
          <div className="chip">WebGL / Canvas</div>
        </div>
      </div>

      <div className="section" id="projects">
        <div className="section-label">Showcase</div>
        <div className="section-title">Featured <span>Projects</span></div>

        <div className="proj-grid">
          
          <div className="proj-card">
            <div className="proj-thumb">
              <video src="/videos/resume-maker.mp4#t=30" autoPlay muted loop playsInline />
            </div>
            <div className="proj-body">
              <div className="proj-tech">React · PixiJS · Spring Boot · Java</div>
              <div className="proj-name">ResumeMaker Pro</div>
              <div className="proj-desc">A GPU-accelerated resume platform using PixiJS for precision and Spring Boot for industrial backends. Solves the conflict between design freedom and document integrity.</div>
              <div className="proj-links">
                <a href="https://resume-maker-pro.netlify.app" target="_blank" rel="noopener noreferrer" className="proj-btn">Live Link</a>
              </div>
            </div>
          </div>

          <div className="proj-card">
            <div className="proj-thumb">
              <video src="/videos/Screen Recording 2026-01-24 122721.mp4#t=30" autoPlay muted loop playsInline />
            </div>
            <div className="proj-body">
              <div className="proj-tech">Python · FastAPI · PyMuPDF · React</div>
              <div className="proj-name">PDF Editor App</div>
              <div className="proj-desc">Advanced engine deconstructing PDFs into structured JSON for manipulation and 100% fidelity regeneration. Bridges the gap between static docs and editable data.</div>
              <div className="proj-links">
                <a href="https://pdf-editor-1-ehhh.onrender.com" target="_blank" rel="noopener noreferrer" className="proj-btn">Live Link</a>
              </div>
            </div>
          </div>

          <div className="proj-card">
            <div className="proj-thumb">
              <div style={{display:'flex', height:'100%', width: '100%'}}>
                <div className="mrb-sidebar">
                  <div style={{height:'8px',background:'rgba(255,255,255,0.3)',borderRadius:'3px',width:'80%',marginBottom:'10px'}}></div>
                  <div className="mrb-s-item active"></div>
                  <div className="mrb-s-item" style={{width:'60%'}}></div>
                  <div className="mrb-s-item" style={{width:'75%'}}></div>
                  <div className="mrb-s-item" style={{width:'50%'}}></div>
                  <div className="mrb-s-item" style={{width:'65%'}}></div>
                </div>
                <div className="mrb-content">
                  <div className="mrb-stat"><div className="mrb-stat-label">Total Students</div><div className="mrb-stat-val">400</div></div>
                  <div style={{background:'white',borderRadius:'4px',padding:'8px',display:'flex',alignItems:'flex-end',gap:'3px',height:'50px'}}>
                    <div style={{flex:1,background:'#BFDBFE',height:'60%',borderRadius:'1px'}}></div>
                    <div style={{flex:1,background:'#BFDBFE',height:'30%',borderRadius:'1px'}}></div>
                    <div style={{flex:1,background:'#3B82F6',height:'80%',borderRadius:'1px'}}></div>
                    <div style={{flex:1,background:'#BFDBFE',height:'45%',borderRadius:'1px'}}></div>
                    <div style={{flex:1,background:'#3B82F6',height:'95%',borderRadius:'1px'}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="proj-body">
              <div className="proj-tech">React · Spring Boot · PostgreSQL</div>
              <div className="proj-name">MRB Exam Management</div>
              <div className="proj-desc">Enterprise-grade examination platform designed for massive scalability and data security, handling thousands of concurrent sessions for academic institutions.</div>
              <div className="proj-links"></div>
            </div>
          </div>

          <div className="proj-card">
            <div className="proj-thumb">
               <video src="/videos/webgl-canvas-coustom implementation.mp4#t=30" autoPlay muted loop playsInline />
            </div>
            <div className="proj-body">
              <div className="proj-tech">PixiJS · Web Workers · Canvas API</div>
              <div className="proj-name">DOM-WebGL Engine</div>
              <div className="proj-desc">High-performance scene-graph managing thousands of concurrent nodes with millisecond updates and complex spatial calculations in the browser.</div>
              <div className="proj-links">
                <a href="https://github.com/sumit1456/webgl" target="_blank" rel="noopener noreferrer" className="proj-btn ghost">View Source</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="skills-section" id="skills">
        <div className="section-label">Capabilities</div>
        <div className="section-title">Technical <span>Ecosystem</span></div>
        <div className="skills-grid">
          <div className="skill-row">
            <div className="skill-cat">Programming Languages</div>
            <div className="skill-tags">
              <div className="s-tag">Java</div><div className="s-tag">Python</div><div className="s-tag">JavaScript</div><div className="s-tag">SQL</div>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Systems & Backend</div>
            <div className="skill-tags">
              <div className="s-tag">Spring Boot</div><div className="s-tag">Spring Security (JWT)</div><div className="s-tag">RESTful APIs</div><div className="s-tag">System Design</div><div className="s-tag">DSA</div><div className="s-tag">RBAC</div>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Interface & Rendering</div>
            <div className="skill-tags">
              <div className="s-tag">React</div><div className="s-tag">Redux</div><div className="s-tag">PixiJS (WebGL)</div><div className="s-tag">Canvas API</div><div className="s-tag">Responsive UI</div>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Data Persistence</div>
            <div className="skill-tags">
              <div className="s-tag">PostgreSQL</div><div className="s-tag">MySQL</div><div className="s-tag">Hibernate</div><div className="s-tag">Spring Data JPA</div>
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-cat">Infrastructure & Tools</div>
            <div className="skill-tags">
              <div className="s-tag">AWS</div><div className="s-tag">Docker</div><div className="s-tag">CI/CD</div><div className="s-tag">Git</div><div className="s-tag">GitHub</div><div className="s-tag">Netlify</div><div className="s-tag">Render</div><div className="s-tag">Antigravity</div>
            </div>
          </div>
        </div>
      </div>

      <div className="edu-section" id="education">
        <div className="section-label">Academic Foundation</div>
        <div className="section-title">Credentials & <span>Expertise</span></div>
        <div className="edu-grid">
          <div className="edu-card">
            <div className="edu-year">2025 – 2027 (Expected)</div>
            <div className="edu-title">Master of Science in Computer Applications</div>
            <div className="edu-org">Savitribai Phule Pune University</div>
            <div className="edu-detail">Current academic performance: <span className="edu-grade">89.63%</span>. Focused on advanced software engineering, algorithm optimization, and complex system design.</div>
          </div>
          <div className="edu-card">
            <div className="edu-year">2024</div>
            <div className="edu-title">Java Full Stack Development</div>
            <div className="edu-org">QSpiders Wakad</div>
            <div className="edu-detail">Comprehensive professional certification covering the entire Spring Boot ecosystem, industrial-grade REST API security, and database normalization strategies.</div>
          </div>
          <div className="edu-card">
            <div className="edu-year">2021 – 2024</div>
            <div className="edu-title">Bachelor of Science in Chemistry</div>
            <div className="edu-org">Shivaji University</div>
            <div className="edu-detail">Graduated with <span className="edu-grade">65%</span>. Developed strong analytical thinking and experimental methodologies that now inform a data-driven approach to technical problem-solving.</div>
          </div>
        </div>
      </div>

      <div className="contact-section" id="contact">
        <div className="section-label">Connection</div>
        <div className="section-title">Get In <span>Touch</span></div>
        <div className="contact-grid">
          <div>
            <div className="contact-lead">Let's build something extraordinary together.</div>
            <div className="contact-sub">I am currently open to exciting new opportunities, interesting collaborations, or just a friendly chat about full-stack engineering and performance architectures.</div>
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
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="form-row">
              <div><label className="form-label">Full Name</label><input name="name" className="form-inp" placeholder="John Doe" required /></div>
              <div><label className="form-label">Subject</label><input name="subject" className="form-inp" placeholder="Project Inquiry" required /></div>
            </div>
            <div><label className="form-label">Message</label><textarea name="message" className="form-textarea" placeholder="Describe your vision..." required></textarea></div>
            <button type="submit" className="form-submit">Transmit Message</button>
          </form>
        </div>
      </div>

      <div className="footer">
        <div className="footer-text">© 2026 Sumit Hatekar. Dedicated to systems that scale.</div>
        <div className="footer-links">
          <a href="https://github.com/sumit1456" target="_blank" rel="noopener noreferrer" className="f-link">GitHub</a>
          <a href="https://linkedin.com/in/sumit-hatekar123" target="_blank" rel="noopener noreferrer" className="f-link">LinkedIn</a>
        </div>
      </div>

      <Chatbot />
    </div>
  )
}

export default App