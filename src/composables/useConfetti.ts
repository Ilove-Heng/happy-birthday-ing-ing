import confetti from 'canvas-confetti'

export function useConfetti() {
  const safeConfetti = (options?: confetti.Options) => {
    try {
      confetti({
        disableForReducedMotion: true,
        ...options,
      })
    } catch (err) {
      console.warn('Confetti note:', err)
    }
  }

  const fireSplashConfetti = () => {
    safeConfetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.55 },
    })

    setTimeout(() => {
      safeConfetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.6 },
      })
      safeConfetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.6 },
      })
    }, 200)
  }

  const fireSingleCandleConfetti = () => {
    safeConfetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.5 },
    })
  }

  const fireCelebrationCannons = (durationMs = 3000) => {
    const end = Date.now() + durationMs
    const colors = ['#ff6b8b', '#9b51e0', '#ffd1dc', '#fff', '#ffd700']

    const frame = () => {
      safeConfetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      })
      safeConfetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const fireCardConfetti = () => {
    safeConfetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  return {
    safeConfetti,
    fireSplashConfetti,
    fireSingleCandleConfetti,
    fireCelebrationCannons,
    fireCardConfetti,
  }
}
