
import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#f9f6ef",
        borderTop: "1px solid #e5e7eb",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 14, color: "#374151" }}>
          © {new Date().getFullYear()} Darbar Restaurant. All rights reserved.
        </div>

        <nav style={{ display: "flex", gap: 16 }}>
          {["Impressum", "Datenschutz", "AGB"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => alert(`${label} page coming soon`)}
              style={{
                appearance: "none",
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                fontSize: 14,
                color: "#374151",
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
