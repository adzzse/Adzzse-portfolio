import React, { useEffect, useRef, useState } from "react";

function lerp(a, b, n) {
  return a + (b - a) * n;
}

export default function About() {
  // Age
  const birthYear = 2003;
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  // Discord Status
  const [discordStatus, setDiscordStatus] = useState("loading");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(true);
  const animationFrame = useRef();
  const containerRef = useRef(null);

  useEffect(() => {
    fetch("https://lanyard.rest/v1/users/579340597022687292")
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          setDiscordStatus(data.data.discord_status);
          const user = data.data.discord_user;
          let avatar;
          if (user.avatar) {
            avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
          } else {
            // default
            avatar = `https://cdn.discordapp.com/embed/avatars/0.png`;
          }
          setAvatarUrl(avatar);
        } else {
          setDiscordStatus("offline");
          setAvatarUrl("https://cdn.discordapp.com/embed/avatars/0.png");
        }
      })
      .catch(() => {
        setDiscordStatus("offline");
        setAvatarUrl("https://cdn.discordapp.com/embed/avatars/0.png");
      });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    // Only show cursor effect for pointer devices, detect if not touch
    const isTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof window.DocumentTouch)
      );
    };
    setShowCursor(!isTouchDevice());
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // cursor follow animation
  useEffect(() => {
    if (!showCursor) return;
    let running = true;
    function animate() {
      setCursorPos((prev) => {
        const nx = lerp(prev.x, mousePosition.x, 0.22);
        const ny = lerp(prev.y, mousePosition.y, 0.22);
        // prevents React thrash on first load
        if (Math.abs(nx - prev.x) < 0.05 && Math.abs(ny - prev.y) < 0.05) {
          return prev;
        }
        return { x: nx, y: ny };
      });
      if (running) animationFrame.current = requestAnimationFrame(animate);
    }
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(animationFrame.current);
    };
  }, [mousePosition, showCursor]);

  return (
    <main className="about-main" ref={containerRef}>
      <div className="about-bg-grid"></div>
      {showCursor && (
        <div
          className="about-cursor-circle"
          style={{
            left: `${cursorPos.x - 15}px`,
            top: `${cursorPos.y - 15}px`,
          }}
        ></div>
      )}
      <div className="about-content-container">
        <div className="about-header">
          <h1 className="about-title">Adzzse</h1>
          <p className="about-subtitle">{age} y/o software developer & food enjoyer</p>
        </div>
        <div className="about-bento-grid">
          <div className="about-card about-card-pizza md-col-2">
            <div>
              <h2 className="about-card-heading">Adzzse</h2>
              <p className="about-card-highlight">{age} y/o software developer & food enjoyer</p>
            </div>
          </div>
          <div className="about-card about-card-privatebin">
            <div className="about-card-external">
              <span></span> <span className="about-external-icon">🔗</span>
            </div>
            <div>
              <h3 className="about-card-heading">Projects</h3>
              <p className="about-card-desc">My own Projects.</p>
            </div>
          </div>
          <div className="about-card about-card-status">
            <div></div>
            <div>
              <div className="about-status-header">
                <div className="about-offline-avatar" style={{overflow: 'hidden', padding: 0}}>
                  {avatarUrl && (
                    <img src={avatarUrl} alt="Discord avatar" style={{width: '50%', height: '50%', objectFit: 'cover', borderRadius: '50%'}} />
                  )}
                </div>
                <span className="about-status-title">{discordStatus}</span>
              </div>
              <p className="about-status-username">@276ms</p>
            </div>
          </div>
          <div className="about-card about-card-time">
            <div></div>
            <div>
              <p className="about-time-big">07:56</p>
              <p className="about-time-sub">in Italy</p>
              <p className="about-time-detail">276 days until birthday</p>
            </div>
          </div>
          <div className="about-card about-card-github md-col-1">
            <div className="about-github-bg">
              {Array(10)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>{Array(30).fill("█").join("")}</div>
                ))}
            </div>
            <div className="about-github-content">
              <h3 className="about-card-heading">GitHub</h3>
              <p className="about-card-desc">[sometimes] post some of the bad stuff I make.</p>
            </div>
          </div>
          <div className="about-card about-card-playlists md-col-3">
            <div className="about-card-external"><span></span> <span className="about-external-icon">🔗</span></div>
            <div>
              <h3 className="about-card-heading">playlists: vibes</h3>
              <p className="about-card-desc">All my playlists, mixed in one big mess.</p>
            </div>
          </div>
          <div className="about-card about-card-tech md-col-1">
            <div></div>
            <div className="about-tech-stack">
              <div>JS</div>
              <div>TS</div>
              <div>N</div>
              <div>⚡</div>
              <div>🔷</div>
              <div>👁️</div>
              <div>G</div>
              <div>🐍</div>
              <div>◇</div>
              <div>🔗</div>
              <div>👀</div>
              <div>🛡️</div>
            </div>
          </div>
          <div className="about-card about-card-about md-col-2">
            <div>
              <h3 className="about-card-heading">Hey There! 👋</h3>
              <p className="about-card-desc">
                I'm Lory, a software developer from Italy. I've been programming since I was 9 and I'm currently in uni,
                studying computer science.
              </p>
              <p className="about-card-desc">
                Programming aside, I love to roam around the world without a plan, with my trusty camera and friends.
                Some other things I enjoy are working on my cars and music, especially lyrical rap.
              </p>
            </div>
          </div>
          <div className="about-card about-card-id md-col-3">
            <h3 className="about-card-heading">ID Check 📋</h3>
            <p className="about-card-desc">
              Use this tool to check if you're <span className="about-highlight">actually</span> talking to me.
            </p>
            <input
              type="text"
              value="579340597022687292"
              readOnly
              className="about-id-input"
            />
          </div>
          <div className="about-card about-card-contact md-col-3">
            <h3 className="about-card-heading">Let's talk 👋</h3>
            <p className="about-card-desc">Send me a message, I'll contact you back if needed.</p>
            <form className="about-contact-form">
              <input type="email" placeholder="mail@lory.dev" className="about-input" />
              <textarea placeholder="Your message" rows={4} className="about-textarea"></textarea>
              <button className="about-btn">Send</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
