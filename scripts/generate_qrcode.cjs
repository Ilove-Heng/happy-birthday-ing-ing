const { createCanvas, loadImage } = require('canvas')
const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')

async function createCuteQrCode() {
  const url = 'https://ilove-heng.github.io/happy-birthday-ing-ing/'
  
  // 1. Generate QR Code Matrix (Error correction Level H = 30% recovery)
  const qrData = QRCode.create(url, { errorCorrectionLevel: 'H' })
  const modules = qrData.modules
  const moduleCount = modules.size

  const width = 1000
  const height = 1360
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Background gradient: Soft dreamy romantic pastel
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#fff3f6')
  bgGrad.addColorStop(0.5, '#ffe6ed')
  bgGrad.addColorStop(1, '#fde2eb')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // Floating background aesthetic symbols
  const decor = [
    { text: '✨', x: 70, y: 120, size: 28, alpha: 0.8 },
    { text: '🌸', x: 920, y: 140, size: 32, alpha: 0.85 },
    { text: '💖', x: 80, y: 460, size: 30, alpha: 0.7 },
    { text: '🎀', x: 910, y: 520, size: 34, alpha: 0.8 },
    { text: '🧸', x: 70, y: 880, size: 32, alpha: 0.75 },
    { text: '🎂', x: 920, y: 920, size: 30, alpha: 0.85 },
    { text: '⭐', x: 100, y: 1240, size: 26, alpha: 0.8 },
    { text: '🍓', x: 890, y: 1260, size: 30, alpha: 0.8 },
    { text: '✨', x: 880, y: 320, size: 24, alpha: 0.7 },
    { text: '✨', x: 110, y: 690, size: 26, alpha: 0.7 },
  ]

  decor.forEach(d => {
    ctx.save()
    ctx.globalAlpha = d.alpha
    ctx.font = `${d.size}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(d.text, d.x, d.y)
    ctx.restore()
  })

  // Helper for rounded rect
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // Main Card Container
  const cardX = 110
  const cardY = 90
  const cardW = 780
  const cardH = 1180
  const cardR = 42

  // Card drop shadow
  ctx.save()
  ctx.shadowColor = 'rgba(255, 67, 112, 0.18)'
  ctx.shadowBlur = 38
  ctx.shadowOffsetY = 16
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, cardX, cardY, cardW, cardH, cardR)
  ctx.fill()
  ctx.restore()

  // Inner card subtle border
  ctx.save()
  ctx.strokeStyle = '#ffd1dc'
  ctx.lineWidth = 3
  roundRect(ctx, cardX, cardY, cardW, cardH, cardR)
  ctx.stroke()
  ctx.restore()

  // Dashed inner decorative border
  ctx.save()
  ctx.setLineDash([8, 6])
  ctx.strokeStyle = 'rgba(255, 105, 180, 0.45)'
  ctx.lineWidth = 2
  roundRect(ctx, cardX + 16, cardY + 16, cardW - 32, cardH - 32, cardR - 12)
  ctx.stroke()
  ctx.restore()

  // 1. Header Pill: "Special Birthday Surprise 🎀"
  const pillW = 340
  const pillH = 42
  const pillX = (width - pillW) / 2
  const pillY = cardY + 42
  ctx.save()
  const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY)
  pillGrad.addColorStop(0, '#ffebee')
  pillGrad.addColorStop(1, '#ffdce5')
  ctx.fillStyle = pillGrad
  roundRect(ctx, pillX, pillY, pillW, pillH, 21)
  ctx.fill()
  ctx.strokeStyle = '#ffb6c9'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.fillStyle = '#d81b60'
  ctx.font = 'bold 17px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🎀 SPECIAL BIRTHDAY SURPRISE 🎀', width / 2, pillY + pillH / 2)
  ctx.restore()

  // 2. Main Title: "Happy Birthday Ing Ing 💖"
  ctx.save()
  ctx.fillStyle = '#ff2a6d'
  ctx.font = 'bold 44px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(255, 42, 109, 0.25)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetY = 3
  ctx.fillText('Happy Birthday Ing Ing 💖', width / 2, cardY + 130)
  ctx.restore()

  // 3. Khmer Subtitle
  ctx.save()
  ctx.fillStyle = '#7a3b56'
  ctx.font = '22px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('ជូនចំពោះគូរដណ្តឹងដ៏ល្អបំផុតរបស់បង 💍', width / 2, cardY + 180)
  ctx.restore()

  // 4. QR Code Box Container
  const qrBoxSize = 540
  const qrBoxX = (width - qrBoxSize) / 2
  const qrBoxY = cardY + 225
  const qrBoxR = 30

  // QR box background with soft pink tint
  ctx.save()
  ctx.fillStyle = '#fff9fb'
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, qrBoxR)
  ctx.fill()
  ctx.strokeStyle = '#ffe0e8'
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.restore()

  // QR Code Rendering with rounded dots
  const qrPadding = 38
  const actualQrSize = qrBoxSize - qrPadding * 2
  const cellSize = actualQrSize / moduleCount
  const qrStartX = qrBoxX + qrPadding
  const qrStartY = qrBoxY + qrPadding

  // Gradient for QR Code Dots: Radiant Rose / Hot Pink
  const qrDotGrad = ctx.createLinearGradient(qrStartX, qrStartY, qrStartX + actualQrSize, qrStartY + actualQrSize)
  qrDotGrad.addColorStop(0, '#e91e63')
  qrDotGrad.addColorStop(0.5, '#d81b60')
  qrDotGrad.addColorStop(1, '#c2185b')

  // Helper to check if row/col is in Finder Pattern (the 3 big corners)
  function isFinderPattern(r, c) {
    if (r < 7 && c < 7) return true // Top-left
    if (r < 7 && c >= moduleCount - 7) return true // Top-right
    if (r >= moduleCount - 7 && c < 7) return true // Bottom-left
    return false
  }

  // Draw custom stylish Finder Patterns
  function drawFinder(startX, startY) {
    const s = 7 * cellSize
    const cx = startX + s / 2
    const cy = startY + s / 2

    // Outer box
    ctx.save()
    ctx.fillStyle = '#c2185b'
    roundRect(ctx, startX, startY, s, s, cellSize * 1.8)
    ctx.fill()

    // Inner white cutout
    ctx.fillStyle = '#fff9fb'
    roundRect(ctx, startX + cellSize, startY + cellSize, s - 2 * cellSize, s - 2 * cellSize, cellSize * 1.2)
    ctx.fill()

    // Center solid circle/dot
    ctx.fillStyle = '#d81b60'
    roundRect(ctx, startX + cellSize * 2, startY + cellSize * 2, s - 4 * cellSize, s - 4 * cellSize, cellSize * 0.8)
    ctx.fill()
    ctx.restore()
  }

  // Draw regular QR modules with cute rounded circular pills
  ctx.fillStyle = qrDotGrad
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (isFinderPattern(r, c)) continue

      if (modules.get(r, c)) {
        const x = qrStartX + c * cellSize
        const y = qrStartY + r * cellSize
        const dotR = cellSize * 0.42

        ctx.beginPath()
        ctx.arc(x + cellSize / 2, y + cellSize / 2, dotR, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  // Draw the 3 beautiful styled Finder Patterns
  drawFinder(qrStartX, qrStartY)
  drawFinder(qrStartX + (moduleCount - 7) * cellSize, qrStartY)
  drawFinder(qrStartX, qrStartY + (moduleCount - 7) * cellSize)

  // 5. Center Badge: Cute Heart Emblem (safe within 30% error correction)
  const centerSize = 88
  const centerX = qrStartX + actualQrSize / 2
  const centerY = qrStartY + actualQrSize / 2

  // Center white badge backing
  ctx.save()
  ctx.shadowColor = 'rgba(216, 27, 96, 0.28)'
  ctx.shadowBlur = 18
  ctx.fillStyle = '#ffffff'
  roundRect(ctx, centerX - centerSize / 2, centerY - centerSize / 2, centerSize, centerSize, 24)
  ctx.fill()
  ctx.restore()

  // Badge border
  ctx.save()
  ctx.strokeStyle = '#ffb3c6'
  ctx.lineWidth = 3
  roundRect(ctx, centerX - centerSize / 2, centerY - centerSize / 2, centerSize, centerSize, 24)
  ctx.stroke()
  ctx.restore()

  // Cute Heart inside center badge
  ctx.save()
  ctx.font = '48px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('💖', centerX, centerY + 2)
  ctx.restore()

  // 6. Bottom Instruction Callout
  const scanBadgeY = cardY + 810
  ctx.save()
  const scanGrad = ctx.createLinearGradient(0, scanBadgeY, 0, scanBadgeY + 54)
  scanGrad.addColorStop(0, '#ff4081')
  scanGrad.addColorStop(1, '#f50057')
  ctx.fillStyle = scanGrad
  ctx.shadowColor = 'rgba(255, 64, 129, 0.4)'
  ctx.shadowBlur = 16
  ctx.shadowOffsetY = 6
  roundRect(ctx, (width - 480) / 2, scanBadgeY, 480, 54, 27)
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✨ Scan to Open Birthday Surprise 🎂', width / 2, scanBadgeY + 27)
  ctx.restore()

  // 7. Date & Love Note
  ctx.save()
  ctx.fillStyle = '#ff4370'
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✨ 10 September • Forever With You 🫶 ✨', width / 2, cardY + 910)

  ctx.fillStyle = '#8a5b6f'
  ctx.font = 'italic 18px sans-serif'
  ctx.fillText('Oun Sml 🎀 | គូរដណ្តឹងដ៏ល្អបំផុតរបស់បង', width / 2, cardY + 950)
  ctx.restore()

  // 8. Bottom URL Display
  const urlBoxY = cardY + 1000
  ctx.save()
  ctx.fillStyle = '#f8f1f4'
  roundRect(ctx, (width - 640) / 2, urlBoxY, 640, 42, 21)
  ctx.fill()
  ctx.strokeStyle = '#fed4e0'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.fillStyle = '#c2185b'
  ctx.font = '16px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('ilove-heng.github.io/happy-birthday-ing-ing/', width / 2, urlBoxY + 21)
  ctx.restore()

  // 9. Save output files
  const buffer = canvas.toBuffer('image/png')
  
  // Output paths
  const p1 = path.resolve(__dirname, '../public/images/qrcode_ing_ing.png')
  const p2 = path.resolve(__dirname, '../qrcode_ing_ing.png')
  const p3 = '/Users/macbookpro/.gemini/antigravity-cli/brain/8f211b47-5e73-4cb0-af88-326d59dff29c/qrcode_ing_ing.png'

  fs.writeFileSync(p1, buffer)
  fs.writeFileSync(p2, buffer)
  try {
    fs.writeFileSync(p3, buffer)
  } catch (e) {
    console.warn('Artifact write note:', e)
  }

  console.log('SUCCESS: Cute QR code created!')
  console.log('Saved to:', p1)
  console.log('Saved to:', p2)
  console.log('Saved to:', p3)
}

createCuteQrCode().catch(err => {
  console.error('Error generating QR code:', err)
  process.exit(1)
})
