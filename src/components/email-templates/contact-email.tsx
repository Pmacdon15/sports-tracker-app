interface EmailTemplateProps {
  message: string;
}

export function EmailTemplate({ message }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            color: "#0f172a",
            fontSize: "24px",
            fontWeight: "bold",
            margin: "16px",
          }}
        >
          Sports Tracker
        </h1>
        <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0" }}>
          Organization Management
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "24px",
          borderRadius: "8px",
          borderLeft: "4px solid #3b82f6",
          marginBottom: "30px",
        }}
      >
        <p
          style={{
            color: "#334155",
            fontSize: "16px",
            lineHeight: "1.6",
            margin: "0",
          }}
        >
          {message}
        </p>
      </div>

      {/* Button 1: Manage Subscription */}
      <div style={{ textAlign: "center" }}>
        <a
          href="https://sportstracker.patmac.ca/plans"
          style={{
            display: "inline-block",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            padding: "12px 24px",
            // Added vertical margin for spacing
            margin: "12px 0", 
            borderRadius: "6px",
            fontWeight: "bold", // Corrected semi-bold to bold
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          Manage Subscription & Upgrade
        </a>
      </div>

      {/* Button 2: Manage Inventory */}
      <div style={{ textAlign: "center" }}>
        <a
          href="https://sportstracker.patmac.ca/inventory"
          style={{
            display: "inline-block",
            backgroundColor: "#3b82f6",
            color: "#ffffff",
            padding: "12px 24px",
            // Added vertical margin for spacing
            margin: "12px 0", 
            borderRadius: "6px",
            fontWeight: "bold", // Corrected semi-bold to bold
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          Manage Inventory
        </a>
      </div>

      <div
        style={{
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#94a3b8", fontSize: "12px" }}>
          © {new Date().getFullYear()} Sports Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}