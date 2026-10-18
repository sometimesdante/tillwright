// <head> markup for HTML rendered to PDF by /api/pdf (invoices and exports).
// Loads the brand fonts and maps Tailwind's font-sans / font-display /
// font-mono to them, matching src/styles/globals.css and tailwind.config.ts.
export const PDF_HEAD = `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['"Bricolage Grotesque"', '"Avenir Next"', "system-ui", "sans-serif"],
            sans: ['"Instrument Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
            mono: ['"IBM Plex Mono"', "ui-monospace", '"SF Mono"', "Menlo", "monospace"],
          },
        },
      },
    };
  </script>
`;
