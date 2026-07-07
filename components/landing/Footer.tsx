export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "48px",
        padding: "24px 16px 32px",
        textAlign: "center",
        borderTop: "2px solid rgba(255,255,255,0.15)",
      }}
    >
      <p
        className="pixel-font"
        style={{
          fontSize: "13px",
          lineHeight: 1.7,
          opacity: 0.85,
          maxWidth: "380px",
          margin: "0 auto 16px",
        }}
      >
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        
        <a
          href="mailto:tsaitejasrisanjana@gmail.com"
          aria-label="Email"
          style={{ color: "inherit", opacity: 0.75, display: "flex" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 6-10 7L2 6" />
          </svg>
        </a>

        
        <a
          href="https://www.linkedin.com/in/sai-teja-sri-sanjana-thummalapalli-2b9223235/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          style={{ color: "inherit", opacity: 0.75, display: "flex" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
          </svg>
        </a>
      </div>

      <p
        className="pixel-font"
        style={{ fontSize: "10px", opacity: 0.5, marginTop: "16px" }}
      >
        Built by Sanjana - ideas &amp; feedback welcome.
      </p>
    </footer>
  );
}