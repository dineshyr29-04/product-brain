export interface PdfExportData {
  title: string;
  prdId?: string;
  category?: string;
  prdContent?: string;
  summary?: string;
  userStories?: string[];
  acceptanceCriteria?: string[];
  productName?: string;
  affectedArr?: number;
  ticketCount?: number;
  customerCount?: number;
  customers?: string[];
}

export function exportPrdToPdf(data: PdfExportData) {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const title = data.title || "Product Requirement Document";
  const prdId = data.prdId || "PRD-SPEC";
  const category = data.category || "Technical Remediation";
  const productName = data.productName || "Core Platform";
  const affectedArr = Number(data.affectedArr || 750000).toLocaleString();
  const ticketCount = data.ticketCount || 1;
  const customerCount = data.customerCount || 1;
  const customers = data.customers ? data.customers.join(", ") : "Tier-1 Accounts";

  let bodyHtml = "";

  if (data.prdContent) {
    bodyHtml = data.prdContent
      .split("\n")
      .map((line) => {
        if (line.startsWith("# ")) {
          return `<h1 style="color: #111827; font-size: 20px; font-weight: 800; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-top: 18px; margin-bottom: 12px;">${line.replace("# ", "")}</h1>`;
        }
        if (line.startsWith("## ")) {
          return `<h2 style="color: #047857; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px;">${line.replace("## ", "")}</h2>`;
        }
        if (line.startsWith("### ")) {
          return `<h3 style="color: #1f2937; font-size: 13px; font-weight: 700; margin-top: 12px; margin-bottom: 6px;">${line.replace("### ", "")}</h3>`;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          const item = line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          return `<li style="margin-left: 18px; margin-bottom: 4px; color: #374151; font-size: 12px;">${item}</li>`;
        }
        if (/^\d+\.\s/.test(line)) {
          const item = line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          return `<li style="margin-left: 18px; margin-bottom: 4px; color: #374151; font-size: 12px;">${item}</li>`;
        }
        if (!line.trim()) return `<div style="height: 4px;"></div>`;
        const parsedText = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return `<p style="color: #374151; font-size: 12px; line-height: 1.6; margin-bottom: 8px;">${parsedText}</p>`;
      })
      .join("\n");
  } else {
    bodyHtml = `
      <h2 style="color: #047857; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px;">1. Executive Summary</h2>
      <p style="color: #374151; font-size: 12px; line-height: 1.6; margin-bottom: 12px;">${data.summary || "Technical specification for defect remediation and ARR protection."}</p>

      ${
        data.userStories && data.userStories.length > 0
          ? `<h2 style="color: #047857; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px;">2. User Stories</h2>
             <ul style="margin: 0; padding: 0;">
               ${data.userStories.map((us) => `<li style="margin-left: 18px; margin-bottom: 4px; color: #374151; font-size: 12px;">${us}</li>`).join("")}
             </ul>`
          : ""
      }

      ${
        data.acceptanceCriteria && data.acceptanceCriteria.length > 0
          ? `<h2 style="color: #047857; font-size: 15px; font-weight: 700; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px;">3. Acceptance Criteria</h2>
             <ul style="margin: 0; padding: 0;">
               ${data.acceptanceCriteria.map((ac) => `<li style="margin-left: 18px; margin-bottom: 4px; color: #065f46; font-size: 12px;">✓ ${ac}</li>`).join("")}
             </ul>`
          : ""
      }
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${prdId} - ${title}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
            line-height: 1.6;
            margin: 0;
            padding: 16px;
            background: #fff;
          }
          .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #047857;
            padding-bottom: 10px;
            margin-bottom: 16px;
          }
          .brand-title {
            font-size: 18px;
            font-weight: 900;
            color: #111827;
            letter-spacing: -0.5px;
          }
          .badge {
            background: #ecfdf5;
            color: #047857;
            font-size: 10px;
            font-weight: 800;
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid #a7f3d0;
            text-transform: uppercase;
          }
          .document-title {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin: 0 0 12px 0;
          }
          .meta-box {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .meta-field {
            font-size: 11px;
          }
          .meta-label {
            color: #6b7280;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 9px;
            display: block;
          }
          .meta-val {
            color: #111827;
            font-weight: 800;
            margin-top: 2px;
          }
          .content-body {
            margin-top: 10px;
          }
          .footer-bar {
            margin-top: 36px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 10px;
            color: #9ca3af;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div class="brand-title">ProductBrain Intelligence</div>
          <div class="badge">AUTONOMOUS TECHNICAL PRD • ${prdId}</div>
        </div>

        <h1 class="document-title">${title}</h1>

        <div class="meta-box">
          <div class="meta-field">
            <span class="meta-label">Category / Area</span>
            <div class="meta-val">${category}</div>
          </div>
          <div class="meta-field">
            <span class="meta-label">Target Product</span>
            <div class="meta-val">${productName}</div>
          </div>
          <div class="meta-field">
            <span class="meta-label">ARR Protection</span>
            <div class="meta-val" style="color: #047857;">$${affectedArr} ARR</div>
          </div>
          <div class="meta-field">
            <span class="meta-label">Impacted Accounts</span>
            <div class="meta-val">${customers}</div>
          </div>
        </div>

        <div class="content-body">
          ${bodyHtml}
        </div>

        <div class="footer-bar">
          <span>Generated autonomously by ProductBrain Intelligence Platform</span>
          <span>Confidential • Internal Technical Specification</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
