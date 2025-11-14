import "./index.css";
import logo from "./logo.png";
import demo from "./demo.png";
import terminal from "./terminal.png";
import { useState, useEffect } from "react";
import { GitBranch, Terminal, Bot, Folder, Mic, Settings, RefreshCw, FileText, GitCommit } from "lucide-react";

interface VersionInfo {
  version: string;
  downloadUrl: string;
}

type VersionSegment =
  | { type: "number"; value: number }
  | { type: "string"; value: string };

interface SparkleReleaseCandidate {
  versionKey: string | null;
  displayVersion: string;
  downloadUrl: string;
  pubDate: number | null;
}

const tokenizeVersion = (version: string): VersionSegment[] =>
  version
    .split(/[\.-]/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map((segment) =>
      /^\d+$/.test(segment)
        ? { type: "number", value: parseInt(segment, 10) }
        : { type: "string", value: segment.toLowerCase() },
    );

const compareVersionStrings = (a: string, b: string): number => {
  const tokensA = tokenizeVersion(a);
  const tokensB = tokenizeVersion(b);
  const maxLength = Math.max(tokensA.length, tokensB.length);

  for (let index = 0; index < maxLength; index += 1) {
    const segA = tokensA[index] ?? { type: "number", value: 0 };
    const segB = tokensB[index] ?? { type: "number", value: 0 };

    if (segA.type === segB.type) {
      if (segA.value === segB.value) {
        continue;
      }

      if (segA.type === "number") {
        return segA.value > segB.value ? 1 : -1;
      }

      return segA.value > segB.value ? 1 : -1;
    }

    if (segA.type === "number" && segB.type === "string") {
      return 1;
    }

    if (segA.type === "string" && segB.type === "number") {
      return -1;
    }
  }

  return 0;
};

const findLatestSparkleRelease = (xml: Document): VersionInfo | null => {
  const items = Array.from(xml.querySelectorAll("channel > item"));
  let latest: SparkleReleaseCandidate | null = null;

  for (const item of items) {
    const enclosure = item.querySelector("enclosure");
    if (!enclosure) {
      continue;
    }

    const downloadUrl = enclosure.getAttribute("url")?.trim();
    if (!downloadUrl) {
      continue;
    }

    const versionAttr = enclosure.getAttribute("sparkle:version")?.trim() ?? "";
    const shortVersion =
      enclosure.getAttribute("sparkle:shortVersionString")?.trim() ?? "";
    const versionKey = versionAttr || shortVersion || null;
    const displayVersion = shortVersion || versionAttr || "";
    const pubDateText =
      item.querySelector("pubDate")?.textContent?.trim() ?? "";
    const parsedPubDate = pubDateText ? Date.parse(pubDateText) : NaN;

    const candidate: SparkleReleaseCandidate = {
      versionKey,
      displayVersion,
      downloadUrl,
      pubDate: Number.isNaN(parsedPubDate) ? null : parsedPubDate,
    };

    if (!latest) {
      latest = candidate;
      continue;
    }

    if (candidate.versionKey && latest.versionKey) {
      const versionComparison = compareVersionStrings(
        candidate.versionKey,
        latest.versionKey,
      );
      if (versionComparison > 0) {
        latest = candidate;
        continue;
      }

      if (versionComparison < 0) {
        continue;
      }
    } else if (candidate.versionKey && !latest.versionKey) {
      latest = candidate;
      continue;
    } else if (!candidate.versionKey && latest.versionKey) {
      continue;
    }

    const latestPubDate = latest.pubDate ?? -Infinity;
    const candidatePubDate = candidate.pubDate ?? -Infinity;

    if (candidatePubDate > latestPubDate) {
      latest = candidate;
    }
  }

  if (!latest) {
    return null;
  }

  return {
    version: latest.displayVersion,
    downloadUrl: latest.downloadUrl,
  };
};

export function App() {
  const [activeTab, setActiveTab] = useState<"agents" | "terminal">("agents");
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);

  useEffect(() => {
    fetch("https://r2.aizen.win/appcast.xml")
      .then((res) => res.text())
      .then((xmlText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");

        const latestRelease = findLatestSparkleRelease(xml);

        if (latestRelease) {
          setVersionInfo(latestRelease);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch version info:", err);
      });
  }, []);

  return (
    <div className="app">
      <section className="hero-section">
        <div className="gradient-bg"></div>
        <div className="hero-content">
          <div className="hero-logo-wrapper">
            <div className="alpha-badge">Early access</div>
            <img src={logo} alt="Aizen" className="hero-logo" />
          </div>
          <h1 className="hero-title">Aizen</h1>
          <p className="hero-subtitle">
            Manage multiple Git branches simultaneously with
            <br />
            dedicated terminals and agents in parallel.
          </p>
          <div className="hero-cta">
            <a
              href={
                versionInfo?.downloadUrl ||
                "https://github.com/vivy-company/aizen/releases"
              }
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
            Requires macOS 13.5 Ventura or later (Apple Silicon ARM64 only).
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
              <img src={demo} alt="Aizen agents" className="screenshot-image" />
            )}
            {activeTab === "terminal" && (
              <img
                src={terminal}
                alt="Aizen terminal"
                className="screenshot-image"
              />
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">
            Worktrees. Terminal. Agents.
            <br />
            All in one place.
          </h2>
          <div className="bento-grid">
            <div className="bento-item bento-small" style={{ gridColumn: '1 / 3', gridRow: '1' }}>
              <div className="bento-icon" style={{ color: '#007aff' }}>
                <Folder size={40} />
              </div>
              <h3>Workspace Management</h3>
              <p>Organize repositories into workspaces.</p>
            </div>
            <div className="bento-item bento-small" style={{ gridColumn: '3 / 5', gridRow: '1' }}>
              <div className="bento-icon" style={{ color: '#ff9500' }}>
                <GitBranch size={48} />
              </div>
              <h3>Git Worktrees</h3>
              <p>
                Work on multiple branches simultaneously without switching
                contexts.
              </p>
            </div>
            <div className="bento-item bento-small" style={{ gridColumn: '1 / 3', gridRow: '2' }}>
              <div className="bento-icon" style={{ color: '#34c759' }}>
                <Bot size={40} />
              </div>
              <h3>Agents</h3>
              <p>Claude, Codex, Gemini, Kimi, and custom agents via ACP.</p>
            </div>
            <div className="bento-item bento-small" style={{ gridColumn: '3 / 5', gridRow: '2' }}>
              <div className="bento-icon" style={{ color: '#30d158' }}>
                <Terminal size={40} />
              </div>
              <h3>Integrated Terminal</h3>
              <p>Powered by libghostty.</p>
            </div>
            <div className="bento-item bento-small" style={{ gridColumn: '1 / 3', gridRow: '3' }}>
              <div className="bento-icon" style={{ color: '#ff9500' }}>
                <GitCommit size={40} />
              </div>
              <h3>Git Operations</h3>
              <p>Stage, commit, push, pull, and manage branches.</p>
            </div>
            <div className="bento-item bento-small" style={{ gridColumn: '3 / 4', gridRow: '3' }}>
              <div className="bento-icon" style={{ color: '#ff3b30' }}>
                <Mic size={40} />
              </div>
              <h3>Voice Mode</h3>
              <p>Talk to your agents with voice commands.</p>
            </div>
            <div className="bento-item bento-small" style={{ gridColumn: '4 / 5', gridRow: '3' }}>
              <div className="bento-icon" style={{ color: '#ff2d55' }}>
                <RefreshCw size={40} />
              </div>
              <h3>Automatic Updates</h3>
              <p>Built-in update system via Sparkle.</p>
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
                <h3>Set up workspaces</h3>
                <p>
                  Organize your Git repositories into structured workspaces for
                  efficient project management and navigation.
                </p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-num">2.</span>
              <div>
                <h3>Create Git worktrees</h3>
                <p>
                  Use the visual interface to create and manage multiple Git
                  worktrees, enabling simultaneous work on different branches
                  without context switching.
                </p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-num">3.</span>
              <div>
                <h3>Perform Git operations</h3>
                <p>
                  Stage, commit, push, pull, and manage branches directly
                  within the app's integrated Git tools.
                </p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-num">4.</span>
              <div>
                <h3>Use integrated terminal</h3>
                <p>
                  Access a GPU-accelerated terminal powered by libghostty for
                  seamless command-line operations in your worktree directories.
                </p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-num">5.</span>
              <div>
                <h3>Interact with agents</h3>
                <p>
                  Chat with Claude, Codex, Gemini, Kimi, and custom agents via
                  the Agent Client Protocol for code assistance and automation.
                </p>
              </div>
            </div>
            <div className="step-item">
              <span className="step-num">6.</span>
              <div>
                <h3>Enable voice features</h3>
                <p>
                  Use voice input for hands-free interaction with agents and
                  enjoy automatic updates via Sparkle.
                </p>
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
              <h3>What are workspaces?</h3>
              <p>
                Workspaces are organizational containers for your Git repositories.
                They help you group related projects and manage them efficiently
                within the app's interface.
              </p>
            </div>
            <div className="faq-item">
              <h3>What are Git worktrees?</h3>
              <p>
                Git worktrees allow you to check out multiple branches at the
                same time in different directories, making it easy to work on
                multiple branches simultaneously without stashing changes.
              </p>
            </div>
            <div className="faq-item">
              <h3>Which agents are supported?</h3>
              <p>
                Aizen supports Claude, Codex, Gemini, Kimi, and custom agents via
                the Agent Client Protocol (ACP). Agents can be automatically
                discovered and installed from NPM or GitHub releases.
              </p>
            </div>
            <div className="faq-item">
              <h3>What terminal emulator does Aizen use?</h3>
              <p>
                Aizen uses libghostty, a GPU-accelerated terminal emulator for
                fast and responsive terminal sessions with support for split panes
                and multiple tabs.
              </p>
            </div>
            <div className="faq-item">
              <h3>How does voice input work?</h3>
              <p>
                Voice input uses speech-to-text transcription with live waveform
                visualization. You can use voice commands to interact with agents
                for hands-free coding assistance.
              </p>
            </div>
            <div className="faq-item">
              <h3>How do updates work?</h3>
              <p>
                Aizen includes automatic update checks via Sparkle. Updates are
                delivered seamlessly in the background, and you can configure
                update preferences in the app settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-copy">© 2025 Vivy Technologies</p>
            <div className="footer-links">
              <a
                href="https://x.com/aizenwin"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              <a
                href="https://github.com/vivy-company/aizen"
                target="_blank"
                rel="noopener noreferrer"
              >
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
