import "./index.css";
import logo from "./logo.png";
import demo from "./demo.png";
import terminal from "./terminal.png";
import { useState, useEffect } from "react";

interface VersionInfo {
  version: string;
  downloadUrl: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<"agents" | "terminal">("agents");
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    fetch("https://r2.aizen.win/appcast.xml")
      .then((res) => res.text())
      .then((xmlText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        const enclosure = xml.querySelector("enclosure");
        const versionTag = xml.querySelector("enclosure");

        if (enclosure) {
          const downloadUrl = enclosure.getAttribute("url") || "";
          const version = enclosure.getAttribute("sparkle:version") || "1.0.0";

          setVersionInfo({ version, downloadUrl });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch version info:", err);
      });
  }, []);

  return (
    <div className="app">
      <div className="alpha-badge">Available in early access</div>
      <section className="hero-section">
        <div className="gradient-bg"></div>
        <div className="hero-content">
          <img src={logo} alt="Aizen" className="hero-logo" />
          <h1 className="hero-title">Aizen</h1>
          <p className="hero-subtitle">
            Manage multiple Git branches simultaneously with<br />
            dedicated terminals and agents in parallel.
          </p>
          <div className="hero-cta">
            <a
              href={versionInfo?.downloadUrl || "https://github.com/vivy-company/aizen/releases"}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download {versionInfo?.version && `v${versionInfo.version}`}
            </a>
            <a
              href="https://github.com/vivy-company/aizen"
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
          <p className="hero-requirements">
            Requires Apple Silicon (M1 or later) and macOS 15+
          </p>
        </div>
      </section>

      <section className="visual-section">
        <div className="container">
          <div className="showcase-tabs">
            <button
              className={`tab-button ${activeTab === "agents" ? "active" : ""}`}
              onClick={() => setActiveTab("agents")}
            >
              Agents
            </button>
            <button
              className={`tab-button ${activeTab === "terminal" ? "active" : ""}`}
              onClick={() => setActiveTab("terminal")}
            >
              Terminal
            </button>
          </div>
          <div className="showcase-content">
            {activeTab === "agents" && (
              <img src={demo} alt="Aizen Agents" className="screenshot-image" />
            )}
            {activeTab === "terminal" && (
              <img src={terminal} alt="Aizen Terminal" className="screenshot-image" />
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Worktrees. Terminal. Agents.<br />All in one place.</h2>
          <div className="bento-grid">
            <div className="bento-item bento-large">
              <div className="bento-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M24 8L40 16V32L24 40L8 32V16L24 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M24 8V24M24 24L8 16M24 24L40 16M24 24V40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Git Worktrees</h3>
              <p>Work on multiple branches simultaneously without switching contexts.</p>
            </div>
            <div className="bento-item bento-small">
              <div className="bento-icon">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M14 20L18 24L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>GPU Terminal</h3>
              <p>Powered by libghostty.</p>
            </div>
            <div className="bento-item bento-small">
              <div className="bento-icon">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="14" cy="32" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="34" cy="32" r="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 22V26M18 28L14 32M30 28L34 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Agents</h3>
              <p>Claude, Codex, Gemini.</p>
            </div>
            <div className="bento-item bento-medium">
              <div className="bento-icon">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <rect x="10" y="10" width="28" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 18H38M18 10V38" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Workspace Management</h3>
              <p>Organize repositories into workspaces.</p>
            </div>
            <div className="bento-item bento-medium">
              <div className="bento-icon">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                  <path d="M24 14C24 14 16 18 16 24C16 30 24 34 24 34C24 34 32 30 32 24C32 18 24 14 24 14Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="24" cy="24" r="3" fill="currentColor"/>
                </svg>
              </div>
              <h3>Voice Mode</h3>
              <p>Talk to your agents with voice commands.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps-list">
            <div className="step-item">
              <span className="step-num">1.</span>
              <div>
                <h3>Create workspaces</h3>
                <p>Organize your Git repositories into workspaces for better project management.</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-num">2.</span>
              <div>
                <h3>Manage worktrees</h3>
                <p>Create and manage Git worktrees with a visual UI. Work on multiple branches simultaneously.</p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-num">3.</span>
              <div>
                <h3>Integrated tools</h3>
                <p>Use the integrated terminal and AI agents to streamline your development workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently asked questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>What are Git worktrees?</h3>
              <p>Git worktrees allow you to check out multiple branches at the same time in different directories, making it easy to switch between branches without stashing changes.</p>
            </div>
            <div className="faq-item">
              <h3>Which AI agents are supported?</h3>
              <p>Aizen supports Claude, Codex, and Gemini via the Agent Client Protocol (ACP).</p>
            </div>
            <div className="faq-item">
              <h3>What terminal emulator does Aizen use?</h3>
              <p>Aizen uses libghostty, a GPU-accelerated terminal emulator for fast and responsive terminal sessions.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-copy">© 2025 Vivy Technologies</p>
            <div className="footer-links">
              <a href="https://x.com/aizenwin" target="_blank" rel="noopener noreferrer">
                X
              </a>
              <a href="https://github.com/vivy-company/aizen" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
