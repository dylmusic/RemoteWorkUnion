module.exports = (req, res) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#003BB5"/>
        <stop offset="50%" style="stop-color:#1A6DFF"/>
        <stop offset="100%" style="stop-color:#40A0FF"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>

    <!-- Logo card -->
    <rect x="524" y="60" width="152" height="152" rx="28" fill="white"/>
    <!-- RM text in logo -->
    <text x="600" y="170" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="#1A6DFF" text-anchor="middle">RM</text>
    <!-- Pencil lines under RM -->
    <rect x="544" y="182" width="112" height="6" rx="3" fill="rgba(26,109,255,0.25)"/>
    <rect x="544" y="194" width="90" height="6" rx="3" fill="rgba(26,109,255,0.2)"/>
    <rect x="544" y="206" width="100" height="6" rx="3" fill="rgba(26,109,255,0.15)"/>

    <!-- Brand name -->
    <text x="600" y="275" font-family="Arial Black, sans-serif" font-size="28" font-weight="900" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="4">REMOTE WORK UNION</text>

    <!-- Main headline -->
    <text x="600" y="370" font-family="Arial Black, sans-serif" font-size="90" font-weight="900" fill="white" text-anchor="middle">Find Remote</text>
    <text x="600" y="465" font-family="Arial Black, sans-serif" font-size="90" font-weight="900" fill="white" text-anchor="middle">Work Jobs</text>

    <!-- Subline -->
    <text x="600" y="530" font-family="Arial, sans-serif" font-size="30" fill="rgba(255,255,255,0.75)" text-anchor="middle">AI Training · Data Annotation · Prompt Writing · Remote Jobs</text>

    <!-- URL -->
    <text x="600" y="590" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.45)" text-anchor="middle">remoteworkunion.com</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(svg);
};
