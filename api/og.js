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
    <rect x="80" y="80" width="1040" height="470" rx="24" fill="rgba(255,255,255,0.08)"/>
    <text x="600" y="220" font-family="Arial Black, sans-serif" font-size="32" font-weight="900" fill="rgba(255,255,255,0.7)" text-anchor="middle" letter-spacing="4">REMOTE WORK UNION</text>
    <text x="600" y="340" font-family="Arial Black, sans-serif" font-size="88" font-weight="900" fill="white" text-anchor="middle">Find Remote</text>
    <text x="600" y="440" font-family="Arial Black, sans-serif" font-size="88" font-weight="900" fill="white" text-anchor="middle">Work Jobs</text>
    <text x="600" y="510" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.75)" text-anchor="middle">Free newsletter · Job listings · Hiring tips · Resume advice</text>
    <text x="600" y="570" font-family="Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.5)" text-anchor="middle">remoteworkunion.com</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(svg);
};
