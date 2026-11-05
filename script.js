/**
 * BAIC V12 — ARCFOX T1
 * 1. Hero 2.0s Video Sync Choreography
 * 2. 3D Stacked Vertical Card Carousel
 * 3. Creative Scroll Animation (Hero Blur + Scale Down while White Sheet Rises)
 * 4. Official 360° Interactive Car Viewer & Color Configurator (36 frames × 4 colors)
 */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));

  const body = document.body;
  const hero = document.getElementById('hero');
  const heroVideo = document.getElementById('heroVideo');
  const videoProgressBar = document.getElementById('videoProgressBar');
  const replayIntroBtn = document.getElementById('replayIntroBtn');
  const colorStudio = document.getElementById('cores');
  const droneSection = document.getElementById('experiencia');
  const droneSticky = document.getElementById('droneSticky');
  const droneCanvas = document.getElementById('droneCanvas');
  const droneRailFill = document.getElementById('droneRailFill');
  const droneScrollPct = document.getElementById('droneScrollPct');
  const wheelItems = Array.from(document.querySelectorAll('.v-wheel__item'));
  const afterDroneSection = document.getElementById('duvidas');
  const bentoCards3D = Array.from(document.querySelectorAll('[data-card-3d]'));
  const afterDroneCta = document.getElementById('localizacao');
  const carPullSection = document.getElementById('destaques');
  const carPullTrack = document.getElementById('carPullTrack');
  const pullCarRig = document.getElementById('pullCarRig');
  const carPullProgressBar = document.getElementById('carPullProgressBar');
  const batterySection = document.getElementById('bateria');
  const batteryCanvas = document.getElementById('batteryCanvas');
  const batteryProgressBar = document.getElementById('batteryProgressBar');
  const batteryScrollPct = document.getElementById('batteryScrollPct');
  const batteryCallouts = Array.from(document.querySelectorAll('.bat-callout'));
  const bentoGallerySection = document.getElementById('galeria');
  const bentoGalleryTrack = document.getElementById('bentoGalleryTrack');
  const bentoGalleryProgressBar = document.getElementById('bentoGalleryProgressBar');
  const bentoGalleryPct = document.getElementById('bentoGalleryPct');

  // =========================================================================
  // 1. HERO 2.0s VIDEO SYNC CHOREOGRAPHY
  // =========================================================================

  const REVEAL_TIME_SECONDS = 2.0;
  let hasRevealed = false;
  let fallbackTimer = null;

  function triggerHeroReveal() {
    if (hasRevealed) return;
    hasRevealed = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);

    body.classList.remove('is-intro-locked');
    body.classList.add('is-revealed');
  }

  function replayCinematicIntro() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    hasRevealed = false;
    body.classList.remove('is-revealed');
    body.classList.add('is-intro-locked');

    if (heroVideo) {
      heroVideo.currentTime = 0;
      heroVideo.play().catch(() => {});
    }

    if (fallbackTimer) clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(triggerHeroReveal, 2350);
  }

  function monitorVideoTimeline() {
    if (heroVideo) {
      const current = heroVideo.currentTime || 0;
      const duration = heroVideo.duration || 30.8;

      if (!hasRevealed && current >= REVEAL_TIME_SECONDS) {
        triggerHeroReveal();
      }

      if (videoProgressBar && duration > 0) {
        const pct = Math.min(100, Math.max(0, (current / duration) * 100));
        videoProgressBar.style.width = `${pct.toFixed(2)}%`;
      }
    }
    requestAnimationFrame(monitorVideoTimeline);
  }

  if (heroVideo) {
    const startPlayback = () => {
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          fallbackTimer = setTimeout(triggerHeroReveal, 2000);
        });
      }
    };

    if (heroVideo.readyState >= 2) {
      startPlayback();
    } else {
      heroVideo.addEventListener('loadeddata', startPlayback, { once: true });
    }

    fallbackTimer = setTimeout(triggerHeroReveal, 2500);
    requestAnimationFrame(monitorVideoTimeline);
  } else {
    setTimeout(triggerHeroReveal, 2000);
  }

  if (replayIntroBtn) {
    replayIntroBtn.addEventListener('click', replayCinematicIntro);
  }

  // =========================================================================
  // 2. CREATIVE SCROLL ANIMATION (Hero Scales Down & Blurs as White Section Rises)
  // =========================================================================

  let scrollTicking = false;
  let targetDroneProgress = 0;
  let smoothedDroneProgress = 0;
  let targetAfterEntryProgress = 0;
  let smoothedAfterEntryProgress = 0;
  let targetCarPullProgress = 0;
  let smoothedCarPullProgress = 0;
  let targetBatteryProgress = 0;
  let smoothedBatteryProgress = 0;
  let targetBentoProgress = 0;
  let smoothedBentoProgress = 0;
  let closingSectionEl = null;
  let heroIsHidden = false;

  function updateScrollAnimation() {
    const scrollY = window.scrollY || window.pageYOffset;
    const vh = window.innerHeight || 1;

    // Progress from 0.0 (top of Hero) to 1.0 (White section fully covering screen)
    const progress = Math.min(1, Math.max(0, scrollY / vh));

    if (hero) {
      const scale = 1 - progress * 0.14;          // Scales down from 1.00 to 0.86
      const blur = progress * 18;                 // Blurs from 0px to 18px
      const opacity = 1 - progress * 0.55;        // Dims smoothly
      const radius = progress * 36;               // Rounds corners up to 36px

      hero.style.setProperty('--hero-scale', scale.toFixed(4));
      hero.style.setProperty('--hero-blur', `${blur.toFixed(2)}px`);
      hero.style.setProperty('--hero-opacity', opacity.toFixed(3));
      hero.style.setProperty('--hero-radius', `${radius.toFixed(1)}px`);

      // Hero is completely covered: stop rendering the blurred fixed video layer
      const heroCovered = progress >= 1;
      if (heroCovered !== heroIsHidden) {
        heroIsHidden = heroCovered;
        hero.style.visibility = heroCovered ? 'hidden' : '';
        if (heroVideo) {
          if (heroCovered) {
            heroVideo.pause();
          } else {
            heroVideo.play().catch(() => {});
          }
        }
      }
    }

    if (colorStudio) {
      // Sheet top corners flatten from 44px to 0px as it reaches the top
      const sheetRadius = Math.max(0, 44 * (1 - Math.pow(progress, 1.5)));
      colorStudio.style.setProperty('--sheet-radius', `${sheetRadius.toFixed(1)}px`);
    }

    // Section 3 (Drone Scroll-Locked Video) progress & exit transition
    let isDroneAtTop = false;
    let isAfterDroneAtTop = false;

    if (droneSection) {
      const rect = droneSection.getBoundingClientRect();
      // The last 100vh of droneSection is reserved for the exit transition as Section 4 rises over it
      const scrubDistance = Math.max(1, droneSection.offsetHeight - vh * 2);

      // Flatten top corners of Section 3 as it reaches the top of viewport
      const entryRatio = Math.min(1, Math.max(0, 1 - rect.top / (vh * 0.6)));
      const droneRadius = Math.max(0, 32 * (1 - entryRatio));
      droneSection.style.setProperty('--drone-radius', `${droneRadius.toFixed(1)}px`);

      // When rect.top <= 0, the section is pinned and scrubbing from 0.0 to 1.0
      targetDroneProgress = Math.min(1, Math.max(0, -rect.top / scrubDistance));
      isDroneAtTop = rect.top <= 72;

      // Exit animation: after video reaches 100% (-rect.top > scrubDistance), Section 4 rises over it
      const exitScrolled = Math.max(0, -rect.top - scrubDistance);
      const exitProgress = Math.min(1, Math.max(0, exitScrolled / vh));
      targetAfterEntryProgress = exitProgress;

      if (droneSticky) {
        const exitScale = 1 - exitProgress * 0.12;     // Scales down from 1.00 to 0.88
        const exitBlur = exitProgress * 16;            // Blurs from 0px to 16px
        const exitOpacity = 1 - exitProgress * 0.55;   // Dims from 1.00 to 0.45
        const exitRadius = Math.max(droneRadius, exitProgress * 34);

        droneSticky.style.setProperty('--drone-exit-scale', exitScale.toFixed(4));
        droneSticky.style.setProperty('--drone-exit-blur', `${exitBlur.toFixed(2)}px`);
        droneSticky.style.setProperty('--drone-exit-opacity', exitOpacity.toFixed(3));
        droneSticky.style.setProperty('--drone-exit-radius', `${exitRadius.toFixed(1)}px`);
      }

      if (afterDroneSection) {
        const afterRect = afterDroneSection.getBoundingClientRect();
        isAfterDroneAtTop = afterRect.top <= 72;
        const afterRadius = Math.max(0, 42 * (1 - Math.pow(exitProgress, 1.5)));
        afterDroneSection.style.setProperty('--after-radius', `${afterRadius.toFixed(1)}px`);
      }
    }

    // Section 5 (Blue ARCFOX T1 Driving Right-to-Left Pulling Cards Carousel)
    if (carPullSection) {
      const pullRect = carPullSection.getBoundingClientRect();
      const pullScrollable = Math.max(1, carPullSection.offsetHeight - vh);
      // Starts moving right as the section approaches the top (vh * 0.3) and finishes at -pullScrollable
      const rawPull = (vh * 0.3 - pullRect.top) / (pullScrollable + vh * 0.3);
      targetCarPullProgress = Math.min(1, Math.max(0, rawPull));
    }

    // Section 6 (Bateria Aurora Scroll-Locked Video + Alternating Callouts)
    if (batterySection) {
      const batRect = batterySection.getBoundingClientRect();
      const batScrubDistance = Math.max(1, batterySection.offsetHeight - vh);
      targetBatteryProgress = Math.min(1, Math.max(0, -batRect.top / batScrubDistance));
    }

    // Section 9 (Horizontal Scroll Interactive Bento Gallery — Right to Left)
    if (bentoGallerySection) {
      const bentoRect = bentoGallerySection.getBoundingClientRect();
      const bentoScrollable = Math.max(1, bentoGallerySection.offsetHeight - vh);
      const rawBento = -bentoRect.top / bentoScrollable;
      targetBentoProgress = Math.min(1, Math.max(0, rawBento));
    }

    // Switch Navbar to dark-on-light mode when white/light sections are under navbar,
    // and switch back to light-on-dark mode when the dark closing section (#agendamento) reaches the navbar
    const closingSection = closingSectionEl || (closingSectionEl = document.getElementById('agendamento'));
    const isClosingAtTop = closingSection ? closingSection.getBoundingClientRect().top <= 72 : false;

    if (((progress >= 0.88 && !isDroneAtTop) || isAfterDroneAtTop) && !isClosingAtTop) {
      body.classList.add('is-light-nav');
    } else {
      body.classList.remove('is-light-nav');
    }

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollAnimation);
      scrollTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateScrollAnimation, { passive: true });
  updateScrollAnimation();

  // =========================================================================
  // 2B. SECTION 3: 60FPS DRONE CANVAS SCRUBBING + VERTICAL FOCUS-WHEEL CAROUSEL
  // =========================================================================

  const DRONE_TOTAL_FRAMES = 166;
  const droneFrames = new Array(DRONE_TOTAL_FRAMES);
  let lastRenderedDroneFrame = -1;
  const droneCtx = droneCanvas ? droneCanvas.getContext('2d', { alpha: false }) : null;

  function getDroneFramePath(index1Based) {
    const padded = String(index1Based).padStart(3, '0');
    return `assets/drone-frames/f_${padded}.jpg`;
  }

  let lastDroneDrawnImg = null;

  function drawDroneFrame(frameIdx) {
    if (!droneCtx || !droneCanvas) return;
    const clampedIdx = Math.min(DRONE_TOTAL_FRAMES - 1, Math.max(0, frameIdx));
    const exactImg = droneFrames[clampedIdx];
    const exactReady = exactImg && exactImg.complete && exactImg.naturalWidth > 0;
    if (clampedIdx === lastRenderedDroneFrame && (!exactReady || lastDroneDrawnImg === exactImg)) return;

    // Find closest loaded frame if exact frame is still loading
    let img = exactReady ? exactImg : null;
    if (!img) {
      for (let offset = 1; offset < 25; offset++) {
        const prev = droneFrames[clampedIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = droneFrames[clampedIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (img && img !== lastDroneDrawnImg) {
      droneCtx.drawImage(img, 0, 0, droneCanvas.width, droneCanvas.height);
      lastDroneDrawnImg = img;
    }
    if (img) lastRenderedDroneFrame = clampedIdx;
  }

  // Preload frame 1 immediately, then preload remaining frames progressively
  if (droneCanvas) {
    const firstImg = new Image();
    firstImg.src = getDroneFramePath(1);
    firstImg.onload = () => {
      droneFrames[0] = firstImg;
      drawDroneFrame(0);
    };

    // Progressive batch preloader so network isn't choked all at once
    let nextFrameToLoad = 2;
    function preloadNextDroneBatch() {
      const batchSize = 8;
      let count = 0;
      while (nextFrameToLoad <= DRONE_TOTAL_FRAMES && count < batchSize) {
        const idx = nextFrameToLoad - 1;
        const img = new Image();
        img.src = getDroneFramePath(nextFrameToLoad);
        droneFrames[idx] = img;
        nextFrameToLoad++;
        count++;
      }
      if (nextFrameToLoad <= DRONE_TOTAL_FRAMES) {
        setTimeout(preloadNextDroneBatch, 35);
      }
    }
    setTimeout(preloadNextDroneBatch, 200);
  }

  /**
   * Updates the Vertical Focus-Wheel Text Carousel based on smoothedProgress (0.0 -> 1.0)
   * - Center item (dist ≈ 0): opacity = 1, blur = 0px, scale = 1
   * - Items above (dist < 0) and below (dist > 0): visible with lower opacity (~0.28)
   *   and progressive blur, fading out smoothly as they move further away
   */
  function updateVerticalWheel(progress) {
    if (wheelItems.length === 0) return;

    const totalSteps = wheelItems.length; // 4 items (0..3)
    const wheelPos = progress * (totalSteps - 1); // Continuous 0.0 -> 3.0
    const ITEM_VERTICAL_SPACING = 270; // Wide vertical distance (px) so top/bottom texts stay well clear of the center text

    wheelItems.forEach((item, idx) => {
      // dist < 0 means item has moved UP above center; dist > 0 means item is BELOW center
      const dist = idx - wheelPos;
      const absDist = Math.abs(dist);

      // Plateau right at center (absDist <= 0.16) so active statement stays 100% crisp
      const effectiveDist = Math.max(0, absDist - 0.16) / 0.84;

      // Vertical position relative to center (-50%)
      const offsetY = dist * ITEM_VERTICAL_SPACING;

      // Scale: 1.0 at center, 0.90 at +/-1 slot, 0.82 further out
      const scale = Math.max(0.82, 1 - effectiveDist * 0.095);

      // Opacity: 1.0 at center, ~0.24 for immediate neighbor above/below, fading to 0 beyond 1.55
      let opacity;
      if (effectiveDist <= 1.0) {
        opacity = 1 - effectiveDist * 0.76; // 1.0 -> 0.24
      } else {
        opacity = Math.max(0, 0.24 * (1 - (effectiveDist - 1.0) / 0.55)); // 0.24 -> 0.0
      }

      // Blur: 0px at center, ~4.8px at neighbor slot above/below, up to 13px as it exits
      const blur = Math.min(13, Math.pow(effectiveDist, 1.15) * 4.8);

      item.style.transform = `translate3d(0, calc(-50% + ${offsetY.toFixed(1)}px), 0) scale(${scale.toFixed(3)})`;
      item.style.opacity = opacity.toFixed(3);
      item.style.filter = blur < 0.15 ? 'none' : `blur(${blur.toFixed(2)}px)`;

      if (absDist < 0.45) {
        item.classList.add('is-active');
      } else {
        item.classList.remove('is-active');
      }
    });

    // Update left progress rail & bottom-right step HUD
    if (droneRailFill) {
      const fillPct = 18 + progress * 82;
      droneRailFill.style.height = `${fillPct.toFixed(1)}%`;
    }
    if (droneScrollPct) {
      const currentStepNum = Math.min(totalSteps, Math.max(1, Math.round(wheelPos) + 1));
      const pctNum = Math.round(progress * 100);
      droneScrollPct.textContent = `0${currentStepNum} / 0${totalSteps} • ${pctNum}%`;
    }
  }

  /**
   * 3D Card Entrance Animation for Section 4 (.after-drone):
   * As Section 4 rises into the viewport (entryProgress: 0.0 -> 1.0),
   * the 3 Bento cards enter fanned & tilted in 3D space and smoothly unfold
   * into their flat, organized 3-column grid right as the section finishes entering (1.0).
   */
  const CARD_3D_PRESETS = [
    // Left card: starts fanned inward from center-left in 3D space
    { tx: 135, ty: 145, tz: -210, rx: 36, ry: -32, rz: -11, scale: 0.84, startAt: 0.06, endAt: 0.92 },
    // Center card: starts elevated & tilted back in 3D space
    { tx: 0,   ty: 165, tz: -140, rx: 40, ry: 0,   rz: 0,   scale: 0.86, startAt: 0.12, endAt: 0.96 },
    // Right card: starts fanned inward from center-right in 3D space
    { tx: -135, ty: 145, tz: -210, rx: 36, ry: 32,  rz: 11,  scale: 0.84, startAt: 0.18, endAt: 1.00 }
  ];

  function update3DCardsEntrance(entryProgress) {
    if (bentoCards3D.length === 0) return;

    bentoCards3D.forEach((card, idx) => {
      const preset = CARD_3D_PRESETS[idx] || CARD_3D_PRESETS[1];
      const rawT = (entryProgress - preset.startAt) / Math.max(0.01, preset.endAt - preset.startAt);
      const clampedT = Math.min(1, Math.max(0, rawT));
      // Smooth cubic ease-out so cards lock cleanly into place as the section finishes entering
      const easedT = 1 - Math.pow(1 - clampedT, 3);
      const inv = 1 - easedT;

      const tx = preset.tx * inv;
      const ty = preset.ty * inv;
      const tz = preset.tz * inv;
      const rx = preset.rx * inv;
      const ry = preset.ry * inv;
      const rz = preset.rz * inv;
      const scale = preset.scale + (1 - preset.scale) * easedT;
      const opacity = Math.min(1, 0.15 + easedT * 0.85);

      if (inv <= 0.001) {
        card.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
        card.style.opacity = '1';
      } else {
        card.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
      }
    });

    if (afterDroneCta) {
      const ctaRaw = (entryProgress - 0.28) / 0.72;
      const ctaClamped = Math.min(1, Math.max(0, ctaRaw));
      const ctaEased = 1 - Math.pow(1 - ctaClamped, 3);
      const ctaInv = 1 - ctaEased;

      if (ctaInv <= 0.001) {
        afterDroneCta.style.transform = 'translate3d(0px, 0px, 0px) rotateX(0deg) scale(1)';
        afterDroneCta.style.opacity = '1';
      } else {
        const ty = 110 * ctaInv;
        const tz = -120 * ctaInv;
        const rx = 28 * ctaInv;
        const sc = 0.9 + 0.1 * ctaEased;
        afterDroneCta.style.transform = `translate3d(0px, ${ty.toFixed(1)}px, ${tz.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        afterDroneCta.style.opacity = (0.1 + 0.9 * ctaEased).toFixed(3);
      }
    }
  }

  /**
   * Section 5: Large 3D Blue ARCFOX T1 Driving Right-to-Left Pulling Cards Carousel
   * - Translates #carPullTrack horizontally from right to left
   * - Rotates front & rear alloy wheels counter-clockwise based on exact distance traveled
   * - Adds subtle road suspension micro-oscillation while moving
   */
  function updateCarPullConvoy(pullProgress) {
    if (!carPullTrack) return;

    const vw = window.innerWidth || 1440;
    const trackWidth = carPullTrack.scrollWidth || 2800;

    // At pullProgress = 0.0: car starts on the right side of the screen (vw * 0.42)
    // At pullProgress = 1.0: car has driven off the left side and all 5 cards have glided across the screen
    const startX = vw * 0.42;
    const endX = -Math.max(400, trackWidth - vw * 0.88);
    const currentX = startX + (endX - startX) * pullProgress;

    carPullTrack.style.transform = `translate3d(${currentX.toFixed(1)}px, 0px, 0px)`;

    // Distance traveled to the left in pixels
    const distanceMovedPx = Math.max(0, startX - currentX);

    // Physical wheel rotation: counter-clockwise (negative deg) when moving right-to-left
    // ~235px of horizontal travel = 1 full wheel revolution (360 deg)
    const wheelDeg = -(distanceMovedPx / 235) * 360;

    if (pullCarRig) {
      pullCarRig.style.setProperty('--wheel-deg', `${wheelDeg.toFixed(1)}deg`);
      // Subtle suspension bounce while driving
      const bounceY = Math.sin(distanceMovedPx * 0.045) * 1.6;
      pullCarRig.style.setProperty('--car-bounce-y', `${bounceY.toFixed(2)}px`);
    }

    if (carPullProgressBar) {
      carPullProgressBar.style.width = `${(pullProgress * 100).toFixed(1)}%`;
    }
  }

  // =========================================================================
  // 2C. SECTION 6: 60FPS BATTERY CANVAS SCRUBBING + BLUR-IN/SHARP/BLUR-OUT CALLOUTS
  // =========================================================================

  const BATTERY_TOTAL_FRAMES = 179;
  const batteryFrames = new Array(BATTERY_TOTAL_FRAMES);
  let lastRenderedBatteryFrame = -1;
  const batteryCtx = batteryCanvas ? batteryCanvas.getContext('2d', { alpha: false }) : null;

  function getBatteryFramePath(index1Based) {
    const padded = String(index1Based).padStart(3, '0');
    return `assets/battery-frames/f_${padded}.jpg`;
  }

  let lastBatteryDrawnImg = null;

  function drawBatteryFrame(frameIdx) {
    if (!batteryCtx || !batteryCanvas) return;
    const clampedIdx = Math.min(BATTERY_TOTAL_FRAMES - 1, Math.max(0, frameIdx));
    const exactImg = batteryFrames[clampedIdx];
    const exactReady = exactImg && exactImg.complete && exactImg.naturalWidth > 0;
    if (clampedIdx === lastRenderedBatteryFrame && (!exactReady || lastBatteryDrawnImg === exactImg)) return;

    let img = exactReady ? exactImg : null;
    if (!img) {
      for (let offset = 1; offset < 25; offset++) {
        const prev = batteryFrames[clampedIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = batteryFrames[clampedIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (img && img !== lastBatteryDrawnImg) {
      batteryCtx.drawImage(img, 0, 0, batteryCanvas.width, batteryCanvas.height);
      lastBatteryDrawnImg = img;
    }
    if (img) lastRenderedBatteryFrame = clampedIdx;
  }

  // Preload battery frame 1 immediately, then progressively load all 179 frames
  if (batteryCanvas) {
    const firstBatImg = new Image();
    firstBatImg.src = getBatteryFramePath(1);
    firstBatImg.onload = () => {
      batteryFrames[0] = firstBatImg;
      drawBatteryFrame(0);
    };

    let nextBatFrameToLoad = 2;
    function preloadNextBatteryBatch() {
      const batchSize = 8;
      let count = 0;
      while (nextBatFrameToLoad <= BATTERY_TOTAL_FRAMES && count < batchSize) {
        const idx = nextBatFrameToLoad - 1;
        const img = new Image();
        img.src = getBatteryFramePath(nextBatFrameToLoad);
        batteryFrames[idx] = img;
        nextBatFrameToLoad++;
        count++;
      }
      if (nextBatFrameToLoad <= BATTERY_TOTAL_FRAMES) {
        setTimeout(preloadNextBatteryBatch, 40);
      }
    }
    setTimeout(preloadNextBatteryBatch, 450);
  }

  /**
   * Animates the 5 alternating Left/Right battery callouts:
   * - Each callout enters blurred (blur 12px, opacity 0, slight vertical offset),
   *   locks into 100% sharp focus (opacity 1, zero blur) during its scroll window
   *   while its pointer line extends toward the battery layer, and then smoothly
   *   fades out as the next callout enters on the opposite side.
   */
  function updateBatteryCallouts(batProgress) {
    if (batteryCallouts.length === 0) return;

    const totalCallouts = batteryCallouts.length; // 5 callouts (0..4)
    // Continuous index from 0.0 (Callout 01 focused at start) to 4.0 (Callout 05 focused at end)
    const stagePos = batProgress * (totalCallouts - 1);

    batteryCallouts.forEach((callout, idx) => {
      const dist = stagePos - idx; // < 0 means incoming, 0 means dead-center, > 0 means outgoing
      const absDist = Math.abs(dist);

      // Reading plateau where callout stays at 100% opacity, with non-overlapping exit/enter spans
      // so the outgoing card and its texts vanish completely before the next card appears on top
      const plateau = 0.27;
      const transitionSpan = dist > 0 ? 0.18 : 0.22;

      let opacity = 1;
      let translateY = 0;
      let lineScale = 1;

      if (absDist > plateau) {
        const edge = Math.min(1, (absDist - plateau) / transitionSpan);
        opacity = Math.max(0, 1 - edge);
        // Enters from +20px below, exits toward -20px above
        translateY = (dist < 0 ? 1 : -1) * edge * 20;
        lineScale = Math.max(0.15, 1 - edge * 0.85);
      }

      callout.style.zIndex = String(10 + idx);
      callout.style.opacity = opacity.toFixed(3);
      callout.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
      callout.style.filter = 'none';
      callout.style.transform = `translate3d(0px, ${translateY.toFixed(1)}px, 0px)`;
      callout.style.setProperty('--line-scale', lineScale.toFixed(3));

      if (absDist <= 0.48) {
        callout.classList.add('is-active');
      } else {
        callout.classList.remove('is-active');
      }
    });

    if (batteryProgressBar) {
      batteryProgressBar.style.width = `${(batProgress * 100).toFixed(1)}%`;
    }

    if (batteryScrollPct) {
      const currentLayer = Math.min(totalCallouts, Math.max(1, Math.round(stagePos) + 1));
      const pctNum = Math.round(batProgress * 100);
      batteryScrollPct.textContent = `Camada 0${currentLayer} / 0${totalCallouts} • ${pctNum}%`;
    }
  }

  // Last rendered values so the loop only writes to the DOM when something actually changed
  const lastRendered = { drone: -1, after: -1, pull: -1, bat: -1, bento: -1, vw: 0 };

  function lerpTowards(current, target, factor) {
    const diff = target - current;
    return Math.abs(diff) > 0.0002 ? current + diff * factor : target;
  }

  function renderDroneLoop() {
    // Smooth linear interpolation (lerp) for silky 60fps scrubbing
    smoothedDroneProgress = lerpTowards(smoothedDroneProgress, targetDroneProgress, 0.14);
    smoothedAfterEntryProgress = lerpTowards(smoothedAfterEntryProgress, targetAfterEntryProgress, 0.14);
    smoothedCarPullProgress = lerpTowards(smoothedCarPullProgress, targetCarPullProgress, 0.12);
    smoothedBatteryProgress = lerpTowards(smoothedBatteryProgress, targetBatteryProgress, 0.14);
    smoothedBentoProgress = lerpTowards(smoothedBentoProgress, targetBentoProgress, 0.14);

    // Viewport width changes (rotation/resize) force a re-render of width-dependent tracks
    const vwNow = window.innerWidth || 0;
    const vwChanged = vwNow !== lastRendered.vw;
    lastRendered.vw = vwNow;

    if (smoothedDroneProgress !== lastRendered.drone) {
      lastRendered.drone = smoothedDroneProgress;
      updateVerticalWheel(smoothedDroneProgress);
    }
    // Canvas draw is internally de-duplicated and also picks up late-loading exact frames
    drawDroneFrame(Math.round(smoothedDroneProgress * (DRONE_TOTAL_FRAMES - 1)));

    if (smoothedAfterEntryProgress !== lastRendered.after) {
      lastRendered.after = smoothedAfterEntryProgress;
      update3DCardsEntrance(smoothedAfterEntryProgress);
    }

    if (smoothedCarPullProgress !== lastRendered.pull || vwChanged) {
      lastRendered.pull = smoothedCarPullProgress;
      updateCarPullConvoy(smoothedCarPullProgress);
    }

    if (smoothedBatteryProgress !== lastRendered.bat) {
      lastRendered.bat = smoothedBatteryProgress;
      updateBatteryCallouts(smoothedBatteryProgress);
    }
    drawBatteryFrame(Math.round(smoothedBatteryProgress * (BATTERY_TOTAL_FRAMES - 1)));

    if (smoothedBentoProgress !== lastRendered.bento || vwChanged) {
      lastRendered.bento = smoothedBentoProgress;
      updateBentoGalleryScroll(smoothedBentoProgress);
    }

    requestAnimationFrame(renderDroneLoop);
  }

  function updateBentoGalleryScroll(bentoProgress) {
    if (!bentoGalleryTrack) return;
    const vw = window.innerWidth || 1440;
    const trackWidth = bentoGalleryTrack.scrollWidth || 2400;

    // Starts slightly offset from the right and glides all the way to the left so all 9 columns are explored
    const startX = Math.min(140, vw * 0.08);
    const endX = -Math.max(0, trackWidth - vw + 48);
    const currentX = startX + (endX - startX) * bentoProgress;

    bentoGalleryTrack.style.transform = `translate3d(${currentX.toFixed(1)}px, 0px, 0px)`;

    if (bentoGalleryProgressBar) {
      bentoGalleryProgressBar.style.width = `${(bentoProgress * 100).toFixed(1)}%`;
    }
    if (bentoGalleryPct) {
      const pctNum = Math.round(bentoProgress * 100);
      bentoGalleryPct.textContent = `13 Fotos • ${pctNum}%`;
    }
  }

  updateVerticalWheel(0);
  update3DCardsEntrance(0);
  updateCarPullConvoy(0);
  updateBatteryCallouts(0);
  updateBentoGalleryScroll(0);
  requestAnimationFrame(renderDroneLoop);

  // Intersection Observer for revealing elements inside Section 2
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
          }
        });
      },
      { threshold: 0.18 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-in-view'));
  }

  // =========================================================================
  // 3. 3D STACKED VERTICAL CARD CAROUSEL (Hero Bottom-Left)
  // =========================================================================

  const carousel = document.getElementById('detailCarousel');
  const cards = carousel ? Array.from(carousel.querySelectorAll('.card-carousel__item')) : [];
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (cards.length > 0) {
    let activeIndex = 0;
    let autoPlayInterval = null;
    const AUTO_PLAY_MS = 3000;

    function updateCarouselStates() {
      const total = cards.length;
      const prevIndex = (activeIndex - 1 + total) % total;
      const nextIndex = (activeIndex + 1) % total;

      cards.forEach((card, idx) => {
        if (idx === activeIndex) {
          card.setAttribute('data-state', 'active');
        } else if (idx === prevIndex) {
          card.setAttribute('data-state', 'prev');
        } else if (idx === nextIndex) {
          card.setAttribute('data-state', 'next');
        } else {
          card.setAttribute('data-state', 'hidden');
        }
      });
    }

    function goNext() {
      activeIndex = (activeIndex + 1) % cards.length;
      updateCarouselStates();
    }

    function goPrev() {
      activeIndex = (activeIndex - 1 + cards.length) % cards.length;
      updateCarouselStates();
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(goNext, AUTO_PLAY_MS);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    updateCarouselStates();
    startAutoPlay();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goNext();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goPrev();
        startAutoPlay();
      });
    }

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (idx !== activeIndex) {
          activeIndex = idx;
          updateCarouselStates();
          startAutoPlay();
        }
      });
    });

    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
    }
  }

  // =========================================================================
  // 4. OFFICIAL 360° INTERACTIVE CAR VIEWER & COLOR CONFIGURATOR
  // =========================================================================

  const CDN_BASE = 'https://inconnectsites.s3.us-east-1.amazonaws.com/assets/cars/baic/t1/360';
  const TOTAL_FRAMES = 36;

  const COLOR_CATALOG = [
    { key: 'blue', name: 'Azul Atlântico', watermarkTint: 'rgba(30, 123, 255, 0.055)', isSilverAurora: false },
    { key: 'white', name: 'Branco Polar', watermarkTint: 'rgba(15, 23, 42, 0.04)', isSilverAurora: false },
    { key: 'gray', name: 'Cinza Titânio', watermarkTint: 'rgba(71, 85, 105, 0.055)', isSilverAurora: false },
    { key: 'green', name: 'Prata Aurora', watermarkTint: 'rgba(148, 163, 184, 0.06)', isSilverAurora: true }
  ];

  // Build frame URLs and persistent Image cache for each color (00 to 35)
  const giroData = COLOR_CATALOG.map((c) => {
    const frames = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const num = String(i).padStart(2, '0');
      frames.push(`${CDN_BASE}/${c.key}-${num}.webp`);
    }
    return { ...c, frames, cachedImages: new Array(TOTAL_FRAMES) };
  });

  const giroStage = document.getElementById('giroStage');
  const giroImg = document.getElementById('giroImg');
  const giroLoader = document.getElementById('giroLoader');
  const giroColorName = document.getElementById('giroColorName');
  const giroWatermark = document.getElementById('giroWatermark');
  const giroAutoBtn = document.getElementById('giroAutoBtn');
  const giroAutoLabel = document.getElementById('giroAutoLabel');
  const swatchBtns = document.querySelectorAll('.giro-swatch');

  let currentColorIdx = 0;   // Starts on Azul Atlântico (index 0)
  let currentFrameIdx = 22;  // 3/4 front-side hero angle
  let isDragging = false;
  let dragStartX = 0;
  let touchInitialX = 0;
  let touchInitialY = 0;
  let touchDirectionLocked = null; // 'horizontal' | 'vertical' | null
  let autoSpinTimer = null;
  const preloadedColors = new Set();

  /**
   * Preloads all 36 frames of a given color index and keeps strong references
   * in giroData[colorIdx].cachedImages so mobile browsers never garbage-collect them.
   */
  function preloadColorFrames(colorIdx) {
    if (preloadedColors.has(colorIdx)) return;
    preloadedColors.add(colorIdx);

    const colorEntry = giroData[colorIdx];
    const frames = colorEntry.frames;
    let loadedCount = 0;

    if (giroLoader && colorIdx === currentColorIdx) {
      giroLoader.classList.add('is-loading');
    }

    frames.forEach((src, frameIdx) => {
      const img = new Image();
      img.decoding = 'async';
      colorEntry.cachedImages[frameIdx] = img;

      const onDone = () => {
        loadedCount++;
        if (img.decode) {
          img.decode().catch(() => {});
        }
        if (loadedCount >= Math.min(10, TOTAL_FRAMES) && giroLoader && colorIdx === currentColorIdx) {
          giroLoader.classList.remove('is-loading');
        }
      };

      img.onload = onDone;
      img.onerror = onDone;
      img.src = src;
    });
  }

  // Start preloading the default color immediately after intro starts so mobile is ready right away
  setTimeout(() => preloadColorFrames(0), 600);

  /**
   * Updates the displayed 360° image frame
   */
  function renderGiroFrame() {
    if (!giroImg) return;
    const colorObj = giroData[currentColorIdx];
    const targetSrc = colorObj.frames[currentFrameIdx];
    giroImg.classList.toggle('is-silver-aurora', Boolean(colorObj.isSilverAurora));
    if (giroImg.getAttribute('src') !== targetSrc) {
      giroImg.src = targetSrc;
    }
  }

  /**
   * Advances or rewinds frame index by delta steps
   */
  function stepFrame(delta) {
    currentFrameIdx = ((currentFrameIdx + delta) % TOTAL_FRAMES + TOTAL_FRAMES) % TOTAL_FRAMES;
    renderGiroFrame();
  }

  /**
   * Starts or stops automatic 360° showroom rotation
   */
  function startAutoSpin() {
    stopAutoSpin();
    if (giroAutoBtn) giroAutoBtn.classList.add('is-spinning');
    if (giroAutoLabel) giroAutoLabel.textContent = 'Girando em 360° (toque p/ pausar)';
    autoSpinTimer = setInterval(() => {
      stepFrame(1);
    }, 85);
  }

  function stopAutoSpin() {
    if (autoSpinTimer) {
      clearInterval(autoSpinTimer);
      autoSpinTimer = null;
    }
    if (giroAutoBtn) giroAutoBtn.classList.remove('is-spinning');
    if (giroAutoLabel) giroAutoLabel.textContent = 'Arraste ou clique para girar 360°';
  }

  // Toggle Auto-Spin on Button Click
  if (giroAutoBtn) {
    giroAutoBtn.addEventListener('click', () => {
      if (autoSpinTimer) {
        stopAutoSpin();
      } else {
        preloadColorFrames(currentColorIdx);
        startAutoSpin();
      }
    });
  }

  // Interactive Mouse & Touch Drag Rotation on Stage (Optimized for Mobile & Desktop)
  if (giroStage) {
    const getPixelsPerFrame = () => ((window.innerWidth || 1024) <= 768 ? 6 : 11);

    const onPointerDown = (clientX) => {
      stopAutoSpin();
      preloadColorFrames(currentColorIdx);
      isDragging = true;
      dragStartX = clientX;
      giroStage.classList.add('is-dragging');
    };

    const onPointerMove = (clientX) => {
      if (!isDragging) return;
      const pxPerFrame = getPixelsPerFrame();
      const diffX = clientX - dragStartX;
      if (Math.abs(diffX) >= pxPerFrame) {
        const steps = Math.trunc(diffX / pxPerFrame);
        // Dragging right rotates car clockwise, dragging left counter-clockwise
        stepFrame(-steps);
        // Advance dragStartX by exact consumed pixels so sub-pixel remainder is preserved
        dragStartX += steps * pxPerFrame;
      }
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      touchDirectionLocked = null;
      giroStage.classList.remove('is-dragging');
    };

    // Desktop Mouse events
    giroStage.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onPointerDown(e.clientX);
    });
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX), { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    // Mobile Touch events (with horizontal vs vertical gesture lock so mobile swipe rotates smoothly)
    giroStage.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          touchInitialX = e.touches[0].clientX;
          touchInitialY = e.touches[0].clientY;
          touchDirectionLocked = null;
          onPointerDown(touchInitialX);
        }
      },
      { passive: true }
    );

    giroStage.addEventListener(
      'touchmove',
      (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;

        if (!touchDirectionLocked) {
          const dx = Math.abs(clientX - touchInitialX);
          const dy = Math.abs(clientY - touchInitialY);
          if (dx > 4 || dy > 4) {
            touchDirectionLocked = dx >= dy * 0.8 ? 'horizontal' : 'vertical';
          }
        }

        if (touchDirectionLocked === 'vertical') {
          // Let user scroll the page vertically if they swiped up/down
          onPointerUp();
          return;
        }

        // Prevent mobile browser from hijacking horizontal car rotation as page scroll
        if (e.cancelable) {
          e.preventDefault();
        }
        onPointerMove(clientX);
      },
      { passive: false }
    );

    window.addEventListener('touchend', onPointerUp, { passive: true });
    window.addEventListener('touchcancel', onPointerUp, { passive: true });
  }

  // Color Swatch Selection
  swatchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-color-index'));
      if (Number.isNaN(idx) || idx === currentColorIdx) return;

      currentColorIdx = idx;
      preloadColorFrames(currentColorIdx);

      // Update active UI states
      swatchBtns.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle('is-active', isCurrent);
        b.setAttribute('aria-checked', String(isCurrent));
      });

      const colorObj = giroData[currentColorIdx];
      if (giroColorName) giroColorName.textContent = colorObj.name;
      if (giroWatermark) giroWatermark.style.color = colorObj.watermarkTint;

      renderGiroFrame();
    });
  });

  // Preload remaining colors when Section 2 approaches viewport
  if ('IntersectionObserver' in window && colorStudio) {
    let hasTriggeredWelcomeSpin = false;
    const studioObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            preloadColorFrames(currentColorIdx);
            // Preload remaining colors quietly in background
            setTimeout(() => {
              COLOR_CATALOG.forEach((_, idx) => preloadColorFrames(idx));
            }, 900);

            // Perform a subtle welcome rotation once so user sees it's 360° interactive
            if (!hasTriggeredWelcomeSpin) {
              hasTriggeredWelcomeSpin = true;
              let welcomeSteps = 0;
              const welcomeInterval = setInterval(() => {
                if (isDragging || autoSpinTimer || welcomeSteps >= 12) {
                  clearInterval(welcomeInterval);
                  return;
                }
                stepFrame(1);
                welcomeSteps++;
              }, 85);
            }
          }
        });
      },
      { rootMargin: '300px 0px' }
    );
    studioObserver.observe(colorStudio);
  } else {
    preloadColorFrames(0);
  }

  // =========================================================================
  // 5. MOBILE MENU DRAWER & INTERACTIVE TEST DRIVE MODAL
  // =========================================================================

  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    mobileDrawer.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const modal = document.getElementById('testDriveModal');
  const modalColorNote = document.getElementById('modalColorNote');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  const testDriveForm = document.getElementById('testDriveForm');
  const phoneInput = document.getElementById('leadPhone');

  function openModal() {
    if (!modal) return;
    const selectedColor = giroData[currentColorIdx]?.name || 'Azul Atlântico';
    if (modalColorNote) {
      modalColorNote.innerHTML = `Cor selecionada: <strong style="color:#fff">${selectedColor}</strong>. Preencha seus dados para agendar sua visita e conhecer de perto o novo ARCFOX T1.`;
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('is-modal-open');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-modal-open');
  }

  openModalBtns.forEach((btn) => btn.addEventListener('click', openModal));
  closeModalBtns.forEach((btn) => btn.addEventListener('click', closeModal));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 6) {
        e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      } else if (digits.length > 2) {
        e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length > 0) {
        e.target.value = `(${digits}`;
      }
    });
  }

  if (testDriveForm) {
    testDriveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const labelEl = testDriveForm.querySelector('.btn-framer__label');
      const originalText = labelEl ? labelEl.textContent : 'Confirmar Agendamento';

      if (labelEl) {
        labelEl.textContent = 'Agendamento enviado!';
      }

      setTimeout(() => {
        testDriveForm.reset();
        if (labelEl) labelEl.textContent = originalText;
        closeModal();
      }, 1600);
    });
  }

  // =========================================================================
  // 6. SECTION 7: INTERACTIVE INTERIOR CONFIGURATOR (PRETO NOIR & CINZA CHAMPAGNE)
  // =========================================================================

  const INTERIOR_CATALOG = {
    noir: {
      key: 'noir',
      name: 'Preto Noir',
      carColorKey: 'blue',
      src: 'assets/interior-preto-noir.jpg',
      statusLabel: 'Cabine ARCFOX T1 • Preto Noir',
      footerTitle: 'Acabamento Preto Noir',
      footerDesc:
        'Atmosfera esportiva em grafite escuro e preto noir, bancos ergonômicos com costura em diamante e telas de 8,8" + 15,6".'
    },
    champagne: {
      key: 'champagne',
      name: 'Cinza Champagne',
      carColorKey: 'gray',
      src: 'assets/interior-cinza-champagne.jpg',
      statusLabel: 'Cabine ARCFOX T1 • Cinza Champagne',
      footerTitle: 'Acabamento Cinza Champagne',
      footerDesc:
        'Luminosidade acolhedora em tom champagne com revestimento Soft-Touch, amplo espaço interno e teto panorâmico.'
    }
  };

  const interiorStage = document.getElementById('interiorStage');
  const interiorInstruction = document.getElementById('interiorInstruction');
  const interiorCabinCard = document.getElementById('interiorCabinCard');
  const intPortalLeft = document.querySelector('.int-portal--left');
  const intPortalRight = document.querySelector('.int-portal--right');
  const intCarLeftRig = document.getElementById('intCarLeftRig');
  const intCarRightRig = document.getElementById('intCarRightRig');
  const intCarLeftImg = document.getElementById('intCarLeftImg');
  const intCarRightImg = document.getElementById('intCarRightImg');
  const intCabinViewport = document.getElementById('intCabinViewport');
  const intCabinBaseImg = document.getElementById('intCabinBaseImg');
  const intCabinRevealImg = document.getElementById('intCabinRevealImg');
  const intCabinStatusDot = document.getElementById('intCabinStatusDot');
  const intCabinStatusLabel = document.getElementById('intCabinStatusLabel');
  const intCabinFooterTitle = document.getElementById('intCabinFooterTitle');
  const intCabinFooterDesc = document.getElementById('intCabinFooterDesc');
  const exitInteriorBtn = document.getElementById('exitInteriorBtn');
  const exitInteriorLinks = document.querySelectorAll('[data-exit-interior]');
  const cabinSwitchBtns = document.querySelectorAll('[data-cabin-switch]');

  let activeInteriorKey = 'noir';
  let isInteriorTransitioning = false;
  let carRotationTimer = null;

  // Preload the 360° frames (18..22) for Blue & Gray cars + both interior images
  const SHOWROOM_FRAME = 22; // 3/4 front showroom stance
  const FRONT_FACING_FRAME = 18; // 100% straight-on front stance ("vira de frente para o usuário")

  function getCar360Url(colorKey, frameIdx) {
    const padded = String(frameIdx).padStart(2, '0');
    return `${CDN_BASE}/${colorKey}-${padded}.webp`;
  }

  function preloadInteriorAssets() {
    // Pre-decode existing DOM car images into GPU memory so the first click has zero frame stutter
    document.querySelectorAll('.int-portal__car-img').forEach((domImg) => {
      if (domImg.decode) {
        domImg.decode().catch(() => {});
      }
    });

    ['blue', 'gray'].forEach((colorKey) => {
      [FRONT_FACING_FRAME, SHOWROOM_FRAME].forEach((f) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = getCar360Url(colorKey, f);
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    });

    Object.values(INTERIOR_CATALOG).forEach((item) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = item.src;
      if (img.decode) {
        img.decode().catch(() => {});
      }
    });
  }
  setTimeout(preloadInteriorAssets, 300);

  function updateCabinMetadataUI(colorKey) {
    const data = INTERIOR_CATALOG[colorKey] || INTERIOR_CATALOG.noir;
    activeInteriorKey = data.key;

    if (interiorStage) {
      interiorStage.setAttribute('data-active-color', data.key);
    }
    if (intCabinStatusDot) {
      intCabinStatusDot.classList.toggle('is-champagne', data.key === 'champagne');
    }
    if (intCabinStatusLabel) {
      intCabinStatusLabel.textContent = data.statusLabel;
    }
    if (intCabinFooterTitle) {
      intCabinFooterTitle.textContent = data.footerTitle;
    }
    if (intCabinFooterDesc) {
      intCabinFooterDesc.textContent = data.footerDesc;
    }

    cabinSwitchBtns.forEach((btn) => {
      const isMatch = btn.getAttribute('data-cabin-switch') === data.key;
      btn.classList.toggle('is-active', isMatch);
    });
  }

  /**
   * 1. ENTER CABIN (Ultra-Fast, Pure GPU Transform/Opacity 60fps 3D Head-On Rush):
   * - User clicks on Left Car/Preview (Preto Noir) or Right Car/Preview (Cinza Champagne)
   * - Smoothly cross-morphs the 3/4 stance (--angled) into the 100% straight-front stance (--front)
   *   using only GPU-composited transform3d & opacity (zero blur/drop-shadow filters)
   * - Anchors scroll position when expanding the cabin so mobile never jumps down to the next section.
   */
  function enterInteriorFromShowroom(colorKey) {
    if (isInteriorTransitioning || !interiorStage) return;
    isInteriorTransitioning = true;

    if (carRotationTimer) {
      cancelAnimationFrame(carRotationTimer);
      carRotationTimer = null;
    }

    const chosenKey = INTERIOR_CATALOG[colorKey] ? colorKey : 'noir';
    const isLeft = chosenKey === 'noir';
    const activePortal = isLeft ? intPortalLeft : intPortalRight;
    const otherPortal = isLeft ? intPortalRight : intPortalLeft;
    const activeRig = isLeft ? intCarLeftRig : intCarRightRig;

    // Prepare the cabin image immediately so it expands seamlessly
    updateCabinMetadataUI(chosenKey);
    if (intCabinBaseImg) {
      intCabinBaseImg.src = INTERIOR_CATALOG[chosenKey].src;
    }
    if (intCabinRevealImg) {
      intCabinRevealImg.classList.remove('is-animating');
      intCabinRevealImg.style.clipPath = 'circle(0% at 50% 88%)';
    }

    // Measure exact horizontal & vertical offset to bring the chosen car dead-center on the screen
    let targetCenterX = isLeft ? 280 : -280;
    let targetCenterY = -95;
    if (activeRig) {
      const rigRect = activeRig.getBoundingClientRect();
      const rigCenterX = rigRect.left + rigRect.width / 2;
      const rigCenterY = rigRect.top + rigRect.height / 2;
      const viewportCenterX = (window.innerWidth || 1440) / 2;
      const viewportCenterY = (window.innerHeight || 900) * 0.52;
      targetCenterX = viewportCenterX - rigCenterX;
      targetCenterY = Math.max(-140, Math.min(140, viewportCenterY - rigCenterY - 40));
      // Disable CSS transition during 60fps JS-driven rush so there is zero lag
      activeRig.style.transition = 'none';
    }

    if (otherPortal) otherPortal.classList.add('is-receding');
    if (activePortal) activePortal.classList.add('is-driving-in');

    const TOTAL_DURATION_MS = 460;
    const startTime = performance.now();
    let hasTriggeredCabinExpand = false;
    const turnDir = isLeft ? -1 : 1;

    function stepRushIn(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, Math.max(0, elapsed / TOTAL_DURATION_MS));

      // Phase 1 (t: 0.0 -> 0.30): Smooth 3D morph from 3/4 stance to 100% straight front
      const turnRaw = Math.min(1, t / 0.30);
      const turnEase = 1 - Math.pow(1 - turnRaw, 2.5);
      const angledOpacity = Math.max(0, 1 - turnEase);
      const frontOpacity = Math.min(1, turnEase);
      const angledRy = turnDir * turnEase * 16;
      const frontRy = -turnDir * (1 - turnEase) * 12;
      const frontScale = 0.96 + 0.04 * turnEase;

      // Steer horizontally into the dead-center of the screen as it rushes forward
      const steerEase = 1 - Math.pow(1 - Math.min(1, t / 0.52), 2.5);
      const currentX = targetCenterX * steerEase;

      // Smooth exponential 3D perspective rush toward the user (scale 1.0 -> 6.8, filling the whole screen)
      const rushCurve = Math.pow(t, 2.0);
      const currentScale = 1 + rushCurve * 5.8;
      const currentY = targetCenterY * rushCurve;

      // Once the car fills the screen (t >= 0.62), fade it out while expanding the interior cabin
      let opacity = 1;
      if (t >= 0.62) {
        const fadeT = (t - 0.62) / 0.38;
        opacity = Math.max(0, 1 - fadeT);

        if (!hasTriggeredCabinExpand) {
          hasTriggeredCabinExpand = true;
          interiorStage.setAttribute('data-state', 'cabin');
          if (interiorCabinCard) {
            interiorCabinCard.setAttribute('aria-hidden', 'false');
          }
          if (interiorInstruction) {
            interiorInstruction.textContent =
              'Você está dentro do ARCFOX T1. Use o seletor para alternar entre Preto Noir e Cinza Champagne ou clique em "Sair do Interior".';
          }

          // Anchor scroll position so collapsing the tall mobile 2-car stack never jumps to the section below
          if (interiorCabinCard) {
            const cabinRect = interiorCabinCard.getBoundingClientRect();
            const navOffset = (window.innerWidth || 1024) <= 768 ? 82 : 96;
            if (cabinRect.top < navOffset - 16 || cabinRect.top > (window.innerHeight || 800) * 0.45) {
              const currentScroll = window.scrollY || window.pageYOffset;
              const targetScroll = Math.max(0, currentScroll + cabinRect.top - navOffset);
              window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
              updateScrollAnimation();
            }
          }
        }
      }

      if (activeRig) {
        activeRig.style.setProperty('--angled-opacity', angledOpacity.toFixed(3));
        activeRig.style.setProperty('--front-opacity', frontOpacity.toFixed(3));
        activeRig.style.setProperty('--angled-ry', `${angledRy.toFixed(1)}deg`);
        activeRig.style.setProperty('--front-ry', `${frontRy.toFixed(1)}deg`);
        activeRig.style.setProperty('--front-scale', frontScale.toFixed(3));
        activeRig.style.setProperty('--car-tx', `${currentX.toFixed(1)}px`);
        activeRig.style.setProperty('--car-ty', `${currentY.toFixed(1)}px`);
        activeRig.style.setProperty('--car-scale', currentScale.toFixed(3));
        activeRig.style.setProperty('--car-opacity', opacity.toFixed(3));
      }

      if (t < 1) {
        carRotationTimer = requestAnimationFrame(stepRushIn);
      } else {
        carRotationTimer = null;
        isInteriorTransitioning = false;
      }
    }

    carRotationTimer = requestAnimationFrame(stepRushIn);
  }

  /**
   * 2. EXIT CABIN (Reverses the 3D Head-On Rush smoothly at 60fps):
   */
  function exitInteriorToShowroom() {
    if (isInteriorTransitioning || !interiorStage) return;
    if (interiorStage.getAttribute('data-state') !== 'cabin') return;
    isInteriorTransitioning = true;

    if (carRotationTimer) {
      cancelAnimationFrame(carRotationTimer);
      carRotationTimer = null;
    }

    const isLeft = activeInteriorKey === 'noir';
    const activePortal = isLeft ? intPortalLeft : intPortalRight;
    const otherPortal = isLeft ? intPortalRight : intPortalLeft;
    const activeRig = isLeft ? intCarLeftRig : intCarRightRig;
    const otherRig = isLeft ? intCarRightRig : intCarLeftRig;

    // Ensure portal classes match the currently active interior (even if user switched color inside the cabin)
    if (activePortal) {
      activePortal.classList.remove('is-receding');
      activePortal.classList.add('is-driving-in');
    }
    if (otherPortal) {
      otherPortal.classList.remove('is-driving-in');
      otherPortal.classList.add('is-receding');
    }

    if (otherRig) {
      otherRig.style.transition = '';
      otherRig.style.setProperty('--angled-opacity', '1');
      otherRig.style.setProperty('--front-opacity', '0');
      otherRig.style.setProperty('--angled-ry', '0deg');
      otherRig.style.setProperty('--front-ry', '0deg');
      otherRig.style.setProperty('--front-scale', '0.96');
      otherRig.style.setProperty('--car-tx', '0px');
      otherRig.style.setProperty('--car-ty', '0px');
      otherRig.style.setProperty('--car-scale', '1');
      otherRig.style.setProperty('--car-opacity', '1');
    }

    // Switch back to 'showroom' state so the interior card shrinks out
    interiorStage.setAttribute('data-state', 'showroom');
    if (interiorCabinCard) {
      interiorCabinCard.setAttribute('aria-hidden', 'true');
    }
    if (interiorInstruction) {
      interiorInstruction.textContent =
        'Clique no veículo ou na prévia do acabamento de sua preferência para aproximar o ARCFOX T1 e entrar na cabine.';
    }

    const startCenterX = (window.innerWidth || 1024) <= 1024 ? 0 : isLeft ? 280 : -280;
    if (activeRig) {
      activeRig.style.transition = 'none';
    }

    const REVERSE_DURATION_MS = 380;
    const startTime = performance.now();
    const turnDir = isLeft ? -1 : 1;

    function stepReverseOut(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, Math.max(0, elapsed / REVERSE_DURATION_MS));
      const inv = 1 - t; // 1.0 (full screen at front) -> 0.0 (parked in showroom)

      // Smooth cubic ease-out as the car backs into its showroom spot
      const rushInv = Math.pow(inv, 2.15);
      const currentScale = 1 + rushInv * 4.6;
      const currentX = startCenterX * Math.pow(inv, 1.5);
      const currentY = -rushInv * 85;
      const opacity = Math.min(1, t / 0.24);

      // In the last 40% of backing up (t: 0.60 -> 1.0), smoothly cross-morph front view back to 3/4 showroom view
      let turnBackProgress = 0;
      if (t > 0.60) {
        turnBackProgress = (t - 0.60) / 0.40;
      }
      const angledOpacity = turnBackProgress;
      const frontOpacity = 1 - turnBackProgress;
      const angledRy = turnDir * (1 - turnBackProgress) * 14;
      const frontRy = -turnDir * turnBackProgress * 12;

      if (activeRig) {
        activeRig.style.setProperty('--angled-opacity', angledOpacity.toFixed(3));
        activeRig.style.setProperty('--front-opacity', frontOpacity.toFixed(3));
        activeRig.style.setProperty('--angled-ry', `${angledRy.toFixed(1)}deg`);
        activeRig.style.setProperty('--front-ry', `${frontRy.toFixed(1)}deg`);
        activeRig.style.setProperty('--car-tx', `${currentX.toFixed(1)}px`);
        activeRig.style.setProperty('--car-ty', `${currentY.toFixed(1)}px`);
        activeRig.style.setProperty('--car-scale', currentScale.toFixed(3));
        activeRig.style.setProperty('--car-opacity', opacity.toFixed(3));
      }

      if (t > 0.42) {
        [intPortalLeft, intPortalRight].forEach((p) => {
          if (p) p.classList.remove('is-driving-in', 'is-receding');
        });
      }

      if (t < 1) {
        carRotationTimer = requestAnimationFrame(stepReverseOut);
      } else {
        [intPortalLeft, intPortalRight].forEach((p) => {
          if (p) p.classList.remove('is-driving-in', 'is-receding');
        });
        if (activeRig) {
          activeRig.style.transition = '';
          activeRig.style.setProperty('--angled-opacity', '1');
          activeRig.style.setProperty('--front-opacity', '0');
          activeRig.style.setProperty('--angled-ry', '0deg');
          activeRig.style.setProperty('--front-ry', '0deg');
          activeRig.style.setProperty('--front-scale', '0.96');
          activeRig.style.setProperty('--car-tx', '0px');
          activeRig.style.setProperty('--car-ty', '0px');
          activeRig.style.setProperty('--car-scale', '1');
          activeRig.style.setProperty('--car-opacity', '1');
        }
        carRotationTimer = null;
        isInteriorTransitioning = false;
      }
    }

    carRotationTimer = requestAnimationFrame(stepReverseOut);
  }

  /**
   * 3. SWITCH COLOR INSIDE CABIN: Creative Circular Iris Wipe Transition
   */
  function switchCabinInteriorColor(targetKey, clickEvent) {
    if (isInteriorTransitioning) return;
    if (targetKey === activeInteriorKey) return;
    if (!INTERIOR_CATALOG[targetKey]) return;

    isInteriorTransitioning = true;
    const nextData = INTERIOR_CATALOG[targetKey];

    // Calculate origin (x%, y%) of the iris wave from the clicked button inside the viewport
    let originX = 50;
    let originY = 88;
    if (clickEvent && intCabinViewport) {
      const vpRect = intCabinViewport.getBoundingClientRect();
      const clientX = clickEvent.clientX || vpRect.left + vpRect.width / 2;
      const clientY = clickEvent.clientY || vpRect.top + vpRect.height * 0.88;
      originX = Math.min(95, Math.max(5, ((clientX - vpRect.left) / vpRect.width) * 100));
      originY = Math.min(95, Math.max(5, ((clientY - vpRect.top) / vpRect.height) * 100));
    }

    updateCabinMetadataUI(targetKey);

    if (intCabinRevealImg && intCabinBaseImg) {
      intCabinRevealImg.classList.remove('is-animating');
      intCabinRevealImg.src = nextData.src;
      intCabinRevealImg.style.clipPath = `circle(0% at ${originX.toFixed(1)}% ${originY.toFixed(1)}%)`;
      intCabinRevealImg.style.transform = 'scale(1.04)';

      // Force reflow so browser registers the 0% starting circle
      void intCabinRevealImg.offsetWidth;

      intCabinRevealImg.classList.add('is-animating');
      intCabinRevealImg.style.clipPath = `circle(148% at ${originX.toFixed(1)}% ${originY.toFixed(1)}%)`;
      intCabinRevealImg.style.transform = 'scale(1)';

      setTimeout(() => {
        intCabinBaseImg.src = nextData.src;
        intCabinRevealImg.classList.remove('is-animating');
        intCabinRevealImg.style.clipPath = 'circle(0% at 50% 88%)';
        isInteriorTransitioning = false;
      }, 720);
    } else {
      isInteriorTransitioning = false;
    }
  }

  // Bind click & keyboard events on the Left & Right 3D Car Portals
  [intPortalLeft, intPortalRight].forEach((portal) => {
    if (!portal) return;
    const colorKey = portal.getAttribute('data-interior-select');

    portal.addEventListener('click', () => {
      enterInteriorFromShowroom(colorKey);
    });

    portal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enterInteriorFromShowroom(colorKey);
      }
    });
  });

  // Bind Exit Cabin buttons
  if (exitInteriorBtn) {
    exitInteriorBtn.addEventListener('click', exitInteriorToShowroom);
  }
  exitInteriorLinks.forEach((btn) => {
    btn.addEventListener('click', exitInteriorToShowroom);
  });

  // Bind Cabin Color Switcher buttons inside the Framed Cabin Dock
  cabinSwitchBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetColor = btn.getAttribute('data-cabin-switch');
      switchCabinInteriorColor(targetColor, e);
    });
  });

  // 4. AUTO-RESET TO INITIAL SHOWROOM STATE WHEN USER SCROLLS TO PREVIOUS OR NEXT SECTION
  const interiorSection = document.getElementById('interiores');

  function resetInteriorToShowroomSilently(compensateScrollAbove) {
    if (!interiorStage) return;
    if (interiorStage.getAttribute('data-state') !== 'cabin' && !isInteriorTransitioning) return;

    if (carRotationTimer) {
      cancelAnimationFrame(carRotationTimer);
      carRotationTimer = null;
    }

    const heightBefore = interiorSection ? interiorSection.offsetHeight : 0;

    [intPortalLeft, intPortalRight].forEach((p) => {
      if (p) p.classList.remove('is-driving-in', 'is-receding');
    });

    [intCarLeftRig, intCarRightRig].forEach((rig) => {
      if (!rig) return;
      rig.style.transition = 'none';
      rig.style.setProperty('--angled-opacity', '1');
      rig.style.setProperty('--front-opacity', '0');
      rig.style.setProperty('--angled-ry', '0deg');
      rig.style.setProperty('--front-ry', '0deg');
      rig.style.setProperty('--front-scale', '0.96');
      rig.style.setProperty('--car-tx', '0px');
      rig.style.setProperty('--car-ty', '0px');
      rig.style.setProperty('--car-scale', '1');
      rig.style.setProperty('--car-opacity', '1');
    });

    if (intCabinRevealImg) {
      intCabinRevealImg.classList.remove('is-animating');
      intCabinRevealImg.style.clipPath = 'circle(0% at 50% 88%)';
    }

    interiorStage.setAttribute('data-state', 'showroom');
    if (interiorCabinCard) {
      interiorCabinCard.setAttribute('aria-hidden', 'true');
    }
    if (interiorInstruction) {
      interiorInstruction.textContent =
        'Clique no veículo ou na prévia do acabamento de sua preferência para aproximar o ARCFOX T1 e entrar na cabine.';
    }

    isInteriorTransitioning = false;

    // If #interiores is above the current viewport (user scrolled down to next section),
    // compensate any height difference (e.g. on mobile where 2 stacked cars are taller than the cabin card)
    // so the section the user is currently viewing does not shift by a single pixel.
    if (compensateScrollAbove && interiorSection) {
      const heightAfter = interiorSection.offsetHeight;
      const deltaH = heightAfter - heightBefore;
      if (Math.abs(deltaH) > 1) {
        window.scrollBy(0, deltaH);
      }
    }

    requestAnimationFrame(() => {
      [intCarLeftRig, intCarRightRig].forEach((rig) => {
        if (rig) rig.style.transition = '';
      });
    });
  }

  if (interiorSection && interiorStage) {
    const checkInteriorOffscreenReset = () => {
      if (interiorStage.getAttribute('data-state') !== 'cabin' && !isInteriorTransitioning) return;
      const rect = interiorSection.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;

      // 100% in a section BELOW #interiores (entire #interiores section has scrolled above top of screen)
      if (rect.bottom <= 0) {
        resetInteriorToShowroomSilently(true);
      }
      // 100% in a section ABOVE #interiores (entire #interiores section is below bottom of screen)
      else if (rect.top >= vh) {
        resetInteriorToShowroomSilently(false);
      }
    };

    window.addEventListener('scroll', checkInteriorOffscreenReset, { passive: true });
  }

  /* ==========================================================================
     SECTION 7.5 & MOBILE SECTION 8: CARDS EMPILHADOS EM SCROLL (STACKED DECKS)
     ========================================================================== */
  const smartStackDeck = document.getElementById('smartStackDeck');
  const smartStackSlots = smartStackDeck
    ? Array.from(smartStackDeck.querySelectorAll('.smart-stack-slot'))
    : [];
  const smartCards = smartStackSlots.map((slot) => slot.querySelector('.smart-card'));

  const cmpMobileStack = document.getElementById('cmpMobileStack');
  const cmpMobSlots = cmpMobileStack
    ? Array.from(cmpMobileStack.querySelectorAll('.cmp-mob-slot'))
    : [];
  const cmpMobCards = cmpMobSlots.map((slot) => slot.querySelector('.cmp-mob-card'));

  let smartStackRafId = null;

  function updateSingleStackedDeck(deckEl, slots, cards, stepOffsetPx) {
    if (!deckEl || !slots.length) return;
    const vh = window.innerHeight || 1;
    const deckRect = deckEl.getBoundingClientRect();
    if (deckRect.height === 0 || deckRect.bottom < -200 || deckRect.top > vh + 200) return;

    const total = slots.length;
    const slotRects = slots.map((slot) => slot.getBoundingClientRect());
    const stickyBaseTop = Math.min(118, Math.max(84, vh * 0.11));

    for (let i = 0; i < total; i++) {
      const card = cards[i];
      if (!card) continue;

      let coverDepth = 0;
      const cardHeight = slotRects[i].height || 480;

      for (let j = i + 1; j < total; j++) {
        const nextTop = slotRects[j].top;
        const targetTop = stickyBaseTop + j * stepOffsetPx;
        const distanceToLock = nextTop - targetTop;

        if (distanceToLock <= 0) {
          coverDepth += 1;
        } else if (distanceToLock < cardHeight) {
          coverDepth += 1 - distanceToLock / cardHeight;
        }
      }

      const targetScale = Math.max(0.78, 1 - coverDepth * 0.042);
      const targetBrightness = Math.max(0.68, 1 - coverDepth * 0.06);

      card.style.setProperty('--card-scale', targetScale.toFixed(4));
      card.style.setProperty('--card-brightness', targetBrightness.toFixed(4));
    }
  }

  function updateSmartStackedCards() {
    smartStackRafId = null;
    updateSingleStackedDeck(smartStackDeck, smartStackSlots, smartCards, 20);
    updateSingleStackedDeck(cmpMobileStack, cmpMobSlots, cmpMobCards, 14);
  }

  function requestSmartStackUpdate() {
    if (smartStackRafId === null) {
      smartStackRafId = requestAnimationFrame(updateSmartStackedCards);
    }
  }

  if (smartStackSlots.length > 0 || cmpMobSlots.length > 0) {
    window.addEventListener('scroll', requestSmartStackUpdate, { passive: true });
    window.addEventListener('resize', requestSmartStackUpdate, { passive: true });
    updateSmartStackedCards();
  }

  /* ==========================================================================
     SECTION 8: QUADRO COMPARATIVO INTERATIVO (ARCFOX T1 VS CONCORRENTES)
     ========================================================================== */
  const cmpBoard = document.getElementById('cmpBoard');
  const cmpFilterBtns = document.querySelectorAll('[data-cmp-filter]');
  const cmpCompetitorRows = document.querySelectorAll('.cmp-row--competitor');
  const cmpDeltaText = document.getElementById('cmpDeltaText');

  // 1. Category Filter Tabs (Visão Completa / Performance & Recarga / Espaço & Porta-Malas / Dimensões)
  cmpFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterKey = btn.getAttribute('data-cmp-filter') || 'all';
      cmpFilterBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (cmpBoard) {
        cmpBoard.setAttribute('data-active-filter', filterKey);
      }
    });
  });

  // 2. Direct 1v1 Comparison Delta Banner when hovering or clicking a Competitor Row
  function selectCompetitorRow(row) {
    if (!row) return;
    cmpCompetitorRows.forEach((r) => r.classList.toggle('is-selected', r === row));
    const deltaHtml = row.getAttribute('data-delta');
    if (cmpDeltaText && deltaHtml) {
      cmpDeltaText.innerHTML = deltaHtml;
    }
  }

  cmpCompetitorRows.forEach((row) => {
    row.addEventListener('click', () => selectCompetitorRow(row));
    row.addEventListener('mouseenter', () => selectCompetitorRow(row));
  });

  /* ==========================================================================
     SECTION 9: GALERIA BENTO EM SCROLL HORIZONTAL + MODAL DE EXPANSÃO COM MINIATURAS
     ========================================================================== */
  const bentoGrid = document.getElementById('bentoInteractiveGrid');
  const bentoItems = bentoGrid ? Array.from(bentoGrid.querySelectorAll('.bento-item')) : [];
  const bentoImgs = bentoGrid ? Array.from(bentoGrid.querySelectorAll('.bento-item__img')) : [];
  const bentoPrevBtn = document.getElementById('bentoPrevBtn');
  const bentoNextBtn = document.getElementById('bentoNextBtn');

  // Lightbox Modal Elements
  const bentoLightbox = document.getElementById('bentoLightbox');
  const bentoLbMainImg = document.getElementById('bentoLbMainImg');
  const bentoLbCounter = document.getElementById('bentoLbCounter');
  const bentoLbTag = document.getElementById('bentoLbTag');
  const bentoLbTitle = document.getElementById('bentoLbTitle');
  const bentoLbPrev = document.getElementById('bentoLbPrev');
  const bentoLbNext = document.getElementById('bentoLbNext');
  const bentoLbThumbStrip = document.getElementById('bentoLbThumbStrip');
  const bentoLbCloseEls = bentoLightbox
    ? Array.from(bentoLightbox.querySelectorAll('[data-close-bento-lb]'))
    : [];

  // 1. Smooth fade-in when each photo loads in the Bento Grid
  bentoImgs.forEach((img) => {
    const markLoaded = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });

  // 2. Build Gallery Data & Bottom Thumbnail Strip from Bento Items
  const galleryPhotos = bentoItems.map((item, idx) => {
    const imgEl = item.querySelector('.bento-item__img');
    const tagEl = item.querySelector('.bento-item__tag');
    const nameEl = item.querySelector('.bento-item__name');
    return {
      index: idx,
      src: imgEl ? imgEl.getAttribute('src') : '',
      alt: imgEl ? imgEl.getAttribute('alt') : '',
      tag: tagEl ? tagEl.textContent.trim() : '',
      title: nameEl ? nameEl.textContent.trim() : '',
    };
  });

  const bentoLbThumbBtns = [];
  if (bentoLbThumbStrip && galleryPhotos.length > 0) {
    bentoLbThumbStrip.innerHTML = '';
    galleryPhotos.forEach((photo, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bento-lb__thumb' + (idx === 0 ? ' is-active' : '');
      btn.setAttribute('aria-label', `Ver foto ${idx + 1}: ${photo.title}`);
      const thumbImg = document.createElement('img');
      thumbImg.src = photo.src;
      thumbImg.alt = photo.alt || photo.title;
      thumbImg.loading = 'lazy';
      btn.appendChild(thumbImg);
      btn.addEventListener('click', () => renderBentoLightboxPhoto(idx));
      bentoLbThumbStrip.appendChild(btn);
      bentoLbThumbBtns.push(btn);
    });
  }

  let currentBentoLbIndex = 0;
  let isBentoLbOpen = false;

  function renderBentoLightboxPhoto(targetIdx) {
    if (!galleryPhotos.length || !bentoLbMainImg) return;
    const total = galleryPhotos.length;
    const normalizedIdx = ((targetIdx % total) + total) % total;
    currentBentoLbIndex = normalizedIdx;
    const photo = galleryPhotos[normalizedIdx];

    bentoLbMainImg.classList.add('is-switching');
    setTimeout(() => {
      bentoLbMainImg.src = photo.src;
      bentoLbMainImg.alt = photo.alt || photo.title;
      bentoLbMainImg.classList.remove('is-switching');
    }, 90);

    if (bentoLbCounter) {
      const numStr = String(normalizedIdx + 1).padStart(2, '0');
      const totalStr = String(total).padStart(2, '0');
      bentoLbCounter.textContent = `${numStr} / ${totalStr}`;
    }
    if (bentoLbTag) bentoLbTag.textContent = photo.tag;
    if (bentoLbTitle) bentoLbTitle.textContent = photo.title;

    bentoLbThumbBtns.forEach((btn, idx) => {
      const isCurrent = idx === normalizedIdx;
      btn.classList.toggle('is-active', isCurrent);
      if (isCurrent) {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }

  function openBentoLightbox(index) {
    if (!bentoLightbox) return;
    isBentoLbOpen = true;
    renderBentoLightboxPhoto(index);
    bentoLightbox.classList.add('is-open');
    bentoLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBentoLightbox() {
    if (!bentoLightbox || !isBentoLbOpen) return;
    isBentoLbOpen = false;
    bentoLightbox.classList.remove('is-open');
    bentoLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function stepBentoLightbox(dir) {
    renderBentoLightboxPhoto(currentBentoLbIndex + dir);
  }

  bentoItems.forEach((item, idx) => {
    item.addEventListener('click', () => openBentoLightbox(idx));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBentoLightbox(idx);
      }
    });
  });

  if (bentoLbPrev) {
    bentoLbPrev.addEventListener('click', () => stepBentoLightbox(-1));
  }
  if (bentoLbNext) {
    bentoLbNext.addEventListener('click', () => stepBentoLightbox(1));
  }
  bentoLbCloseEls.forEach((el) => {
    el.addEventListener('click', closeBentoLightbox);
  });

  window.addEventListener('keydown', (e) => {
    if (!isBentoLbOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeBentoLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepBentoLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepBentoLightbox(1);
    }
  });

  // 3. Prev / Next Horizontal Glide Buttons (smoothly scrolls through Section 9)
  function stepBentoGallery(direction) {
    if (!bentoGallerySection) return;
    const vh = window.innerHeight || 1;
    const scrollable = Math.max(1, bentoGallerySection.offsetHeight - vh);
    const nextProgress = Math.min(1, Math.max(0, targetBentoProgress + direction * 0.28));
    const targetScrollY = bentoGallerySection.offsetTop + nextProgress * scrollable;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }

  if (bentoPrevBtn) {
    bentoPrevBtn.addEventListener('click', () => stepBentoGallery(-1));
  }
  if (bentoNextBtn) {
    bentoNextBtn.addEventListener('click', () => stepBentoGallery(1));
  }

  // =========================================================================
  // 13. SECTION 10: FAQ ACCORDION (#faqAccordion)
  // =========================================================================
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isAlreadyOpen = item.classList.contains('is-open');

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('is-open');
        const otherBtn = otherItem.querySelector('.faq-item__trigger');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================================
  // 14. SECTION 11: CLOSING 3D CAR + LEAD FORM (#agendamento)
  // =========================================================================
  const closingCarImg = document.getElementById('closingCarImg');
  const closingColorName = document.getElementById('closingColorName');
  const closingColorSelect = document.getElementById('closingColorSelect');
  const closingSwatches = Array.from(document.querySelectorAll('.lead-closing__swatch'));
  const closingPhoneInput = document.getElementById('closingPhone');
  const closingLeadForm = document.getElementById('closingLeadForm');

  function setClosingCarColor(swatchBtn) {
    if (!swatchBtn) return;
    const newSrc = swatchBtn.getAttribute('data-closing-src');
    const newName = swatchBtn.getAttribute('data-closing-color-name') || 'Azul Atlântico';
    const isSilver = swatchBtn.getAttribute('data-closing-color') === 'silver';

    closingSwatches.forEach((btn) => btn.classList.toggle('is-active', btn === swatchBtn));

    if (closingColorName) {
      closingColorName.textContent = newName;
    }

    if (closingColorSelect && closingColorSelect.value !== newName) {
      closingColorSelect.value = newName;
    }

    if (closingCarImg) {
      closingCarImg.classList.toggle('is-silver-aurora', isSilver);
    }

    if (closingCarImg && newSrc && closingCarImg.getAttribute('src') !== newSrc) {
      closingCarImg.classList.add('is-switching');
      const preloader = new Image();
      preloader.onload = () => {
        closingCarImg.src = newSrc;
        requestAnimationFrame(() => {
          closingCarImg.classList.remove('is-switching');
        });
      };
      preloader.onerror = () => {
        closingCarImg.src = newSrc;
        closingCarImg.classList.remove('is-switching');
      };
      preloader.src = newSrc;
    }
  }

  closingSwatches.forEach((btn) => {
    btn.addEventListener('click', () => setClosingCarColor(btn));
  });

  if (closingColorSelect) {
    closingColorSelect.addEventListener('change', () => {
      const selectedName = closingColorSelect.value;
      const matchingSwatch = closingSwatches.find(
        (btn) => btn.getAttribute('data-closing-color-name') === selectedName
      );
      if (matchingSwatch) {
        setClosingCarColor(matchingSwatch);
      }
    });
  }

  if (closingPhoneInput) {
    closingPhoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length > 6) {
        e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      } else if (digits.length > 2) {
        e.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length > 0) {
        e.target.value = `(${digits}`;
      } else {
        e.target.value = '';
      }
    });
  }

  if (closingLeadForm) {
    closingLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('closingSubmitBtn');
      const labelEl = submitBtn ? submitBtn.querySelector('.btn-framer__label') : null;
      const originalText = labelEl ? labelEl.textContent : 'Solicitar Contato e Test Drive';

      if (labelEl) {
        labelEl.textContent = 'Solicitação Recebida! Entraremos em Contato ✓';
      }
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        closingLeadForm.reset();
        if (closingColorName) {
          closingColorSelect.value = closingColorName.textContent || 'Azul Atlântico';
        }
        if (labelEl) {
          labelEl.textContent = originalText;
        }
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }, 3600);
    });
  }
});



