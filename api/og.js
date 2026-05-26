const { createCanvas } = require('canvas');

module.exports = (req, res) => {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Blue gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#003BB5');
  gradient.addColorStop(0.5, '#1A6DFF');
  gradient.addColorStop(1, '#40A0FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Glass card
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.roundRect(60, 60, 1080, 510, 24);
  ctx.fill();

  // Brand name
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('REMOTE WORK UNION', 600, 180);

  // Main headline
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 96px Arial Black';
  ctx.textAlign = 'center';
  ctx.fillText('Find Remote', 600, 320);
  ctx.fillText('Work Jobs', 600, 430);

  // Subline
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '32px Arial';
  ctx.fillText('AI Training · Data Annotation · Prompt Writing · Remote Jobs', 600, 510);

  // URL
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '24px Arial';
  ctx.fillText('remoteworkunion.com', 600, 570);

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.end(canvas.toBuffer('image/png'));
};
