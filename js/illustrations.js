/**
 * EE - VLSI DESIGN AND TECHNOLOGY
 * Themed SVG Illustrations & Semiconductor Pattern Generator
 * Generates distinct vector graphics for each event card and modal banner
 */

const EventIllustrations = {
  /**
   * Generates themed SVG background markup based on the pattern type
   * @param {string} patternType 
   * @param {string} primaryColor 
   * @param {string} accentGradient 
   * @returns {string} SVG string
   */
  getSvg(patternType, primaryColor, accentGradient) {
    switch (patternType) {
      case 'asic-routing':
        return `
        <svg class="card-header-svg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="grad-asic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e3a8a"/>
              <stop offset="50%" stop-color="#2563eb"/>
              <stop offset="100%" stop-color="#60a5fa"/>
            </linearGradient>
            <pattern id="grid-dots-asic" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.18)"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad-asic)"/>
          <rect width="100%" height="100%" fill="url(#grid-dots-asic)"/>
          <!-- Silicon Die Core -->
          <rect x="220" y="25" width="150" height="100" rx="8" fill="rgba(15,23,42,0.4)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
          <rect x="235" y="40" width="120" height="70" rx="4" fill="rgba(37,99,235,0.3)" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="4 2"/>
          <text x="295" y="78" fill="#ffffff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" letter-spacing="1">TSMC 28nm GDSII</text>
          
          <!-- Routing Tracks & Vias -->
          <path d="M 20 40 L 90 40 L 120 70 L 220 70" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" fill="none"/>
          <circle cx="20" cy="40" r="4" fill="#93c5fd"/>
          <circle cx="120" cy="70" r="3.5" fill="#ffffff"/>
          <circle cx="220" cy="70" r="4" fill="#38bdf8"/>
          
          <path d="M 40 120 L 110 120 L 140 90 L 220 90" stroke="rgba(147,197,253,0.8)" stroke-width="2" fill="none"/>
          <circle cx="40" cy="120" r="3.5" fill="#ffffff"/>
          <circle cx="220" cy="90" r="3.5" fill="#60a5fa"/>

          <path d="M 70 15 L 140 15 L 170 45 L 220 45" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>
          
          <!-- Wirebond Pads -->
          <g fill="#fde047" opacity="0.85">
            <rect x="225" y="15" width="8" height="6" rx="1"/>
            <rect x="250" y="15" width="8" height="6" rx="1"/>
            <rect x="275" y="15" width="8" height="6" rx="1"/>
            <rect x="300" y="15" width="8" height="6" rx="1"/>
            <rect x="325" y="15" width="8" height="6" rx="1"/>
            <rect x="350" y="15" width="8" height="6" rx="1"/>
          </g>
        </svg>`;

      case 'nanosheet':
        return `
        <svg class="card-header-svg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="grad-nano" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4c1d95"/>
              <stop offset="50%" stop-color="#7c3aed"/>
              <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad-nano)"/>
          
          <!-- Sub-2nm GAA Nanosheet Channels representation -->
          <g transform="translate(180, 20)">
            <!-- Gate material surround -->
            <rect x="50" y="10" width="70" height="95" rx="6" fill="rgba(192,132,252,0.3)" stroke="#e9d5ff" stroke-width="1.5"/>
            <!-- 3 stacked horizontal nanosheet channels -->
            <rect x="30" y="25" width="110" height="12" rx="4" fill="#ffffff" opacity="0.95"/>
            <rect x="30" y="52" width="110" height="12" rx="4" fill="#ffffff" opacity="0.95"/>
            <rect x="30" y="78" width="110" height="12" rx="4" fill="#ffffff" opacity="0.95"/>
            <!-- Source and Drain contacts -->
            <rect x="10" y="20" width="22" height="75" rx="3" fill="#facc15" opacity="0.85"/>
            <rect x="138" y="20" width="22" height="75" rx="3" fill="#facc15" opacity="0.85"/>
            <text x="85" y="120" fill="#f3e8ff" font-family="sans-serif" font-size="9" font-weight="700" text-anchor="middle">GAAFET CHANNEL STACK</text>
          </g>

          <!-- Wave vectors -->
          <path d="M 15 75 Q 50 20 85 75 T 155 75" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="85" cy="75" r="5" fill="#f43f5e"/>
          <circle cx="15" cy="75" r="4" fill="#38bdf8"/>
        </svg>`;

      case 'fpga-grid':
        return `
        <svg class="card-header-svg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="grad-fpga" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#064e3b"/>
              <stop offset="50%" stop-color="#059669"/>
              <stop offset="100%" stop-color="#34d399"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad-fpga)"/>
          
          <!-- Configurable Logic Block (CLB) Matrix Array -->
          <g transform="translate(190, 15)">
            <rect x="0" y="0" width="40" height="30" rx="3" fill="rgba(255,255,255,0.2)" stroke="#a7f3d0" stroke-width="1.2"/>
            <text x="20" y="19" fill="#ffffff" font-family="monospace" font-size="8" text-anchor="middle">LUT 6</text>

            <rect x="55" y="0" width="40" height="30" rx="3" fill="rgba(255,255,255,0.2)" stroke="#a7f3d0" stroke-width="1.2"/>
            <text x="75" y="19" fill="#ffffff" font-family="monospace" font-size="8" text-anchor="middle">FF / D</text>

            <rect x="110" y="0" width="40" height="30" rx="3" fill="rgba(255,255,255,0.2)" stroke="#a7f3d0" stroke-width="1.2"/>
            <text x="130" y="19" fill="#ffffff" font-family="monospace" font-size="8" text-anchor="middle">DSP48</text>

            <rect x="0" y="45" width="40" height="30" rx="3" fill="rgba(255,255,255,0.2)" stroke="#a7f3d0" stroke-width="1.2"/>
            <text x="20" y="64" fill="#ffffff" font-family="monospace" font-size="8" text-anchor="middle">BRAM</text>

            <rect x="55" y="45" width="40" height="30" rx="3" fill="rgba(255,255,255,0.2)" stroke="#a7f3d0" stroke-width="1.2"/>
            <text x="75" y="64" fill="#ffffff" font-family="monospace" font-size="8" text-anchor="middle">AXI4</text>

            <rect x="110" y="45" width="40" height="30" rx="3" fill="rgba(255,255,255,0.2)" stroke="#a7f3d0" stroke-width="1.2"/>
            <text x="130" y="64" fill="#ffffff" font-family="monospace" font-size="8" text-anchor="middle">HLS IP</text>

            <!-- Interconnect Matrix switch points -->
            <path d="M 40 15 L 55 15 M 95 15 L 110 15 M 20 30 L 20 45 M 75 30 L 75 45 M 130 30 L 130 45" stroke="#fef08a" stroke-width="2"/>
            <circle cx="47" cy="15" r="2.5" fill="#fde047"/>
            <circle cx="102" cy="15" r="2.5" fill="#fde047"/>
            <circle cx="75" cy="37" r="2.5" fill="#fde047"/>
          </g>

          <!-- Waveform clock input -->
          <path d="M 20 110 L 40 110 L 40 85 L 60 85 L 60 110 L 80 110 L 80 85 L 100 85 L 100 110 L 120 110" stroke="#ffffff" stroke-width="2.5" fill="none"/>
          <text x="20" y="130" fill="#d1fae5" font-family="monospace" font-size="9">CLK 250 MHz</text>
        </svg>`;

      case 'logic-gates':
        return `
        <svg class="card-header-svg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="grad-logic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#92400e"/>
              <stop offset="50%" stop-color="#d97706"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad-logic)"/>
          
          <!-- SystemVerilog Assertions & Digital Logic Gates -->
          <g transform="translate(195, 20)">
            <!-- AND Gate -->
            <path d="M 30 20 L 55 20 A 20 20 0 0 1 55 60 L 30 60 Z" fill="rgba(255,255,255,0.25)" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="30" x2="30" y2="30" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="50" x2="30" y2="50" stroke="#ffffff" stroke-width="2"/>
            <line x1="75" y1="40" x2="100" y2="40" stroke="#ffffff" stroke-width="2"/>
            <circle cx="100" cy="40" r="3" fill="#fef08a"/>

            <!-- SVA Property Assertion text -->
            <rect x="40" y="75" width="130" height="35" rx="5" fill="rgba(15,23,42,0.4)" stroke="#fde68a" stroke-width="1"/>
            <text x="48" y="90" fill="#fef08a" font-family="monospace" font-size="9" font-weight="bold">assert property (@clk</text>
            <text x="48" y="103" fill="#ffffff" font-family="monospace" font-size="8">req |-&gt; ##[1:2] gnt);</text>
          </g>

          <!-- Bug warning crosshair -->
          <circle cx="70" cy="65" r="28" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="4 2"/>
          <circle cx="70" cy="65" r="14" fill="rgba(239,68,68,0.3)" stroke="#fee2e2" stroke-width="1.5"/>
          <line x1="35" y1="65" x2="105" y2="65" stroke="#ffffff" stroke-width="1.5"/>
          <line x1="70" y1="30" x2="70" y2="100" stroke="#ffffff" stroke-width="1.5"/>
          <text x="70" y="125" fill="#fef3c7" font-family="sans-serif" font-size="10" font-weight="700" text-anchor="middle">RTL VERIFICATION</text>
        </svg>`;

      case 'analog-waves':
        return `
        <svg class="card-header-svg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="grad-analog" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#065f46"/>
              <stop offset="50%" stop-color="#059669"/>
              <stop offset="100%" stop-color="#10b981"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad-analog)"/>
          
          <!-- Analog Op-Amp Symbol & Differential Pair -->
          <g transform="translate(200, 25)">
            <path d="M 30 15 L 30 85 L 95 50 Z" fill="rgba(255,255,255,0.2)" stroke="#ffffff" stroke-width="2"/>
            <line x1="10" y1="30" x2="30" y2="30" stroke="#ffffff" stroke-width="2"/>
            <line x1="10" y1="70" x2="30" y2="70" stroke="#ffffff" stroke-width="2"/>
            <line x1="95" y1="50" x2="125" y2="50" stroke="#ffffff" stroke-width="2"/>
            <text x="35" y="35" fill="#ffffff" font-size="12" font-weight="bold">-</text>
            <text x="35" y="75" fill="#ffffff" font-size="12" font-weight="bold">+</text>
            <circle cx="125" cy="50" r="3.5" fill="#a7f3d0"/>
            <text x="75" y="105" fill="#d1fae5" font-family="monospace" font-size="9" text-anchor="middle">VIRTUOSO OTA</text>
          </g>

          <!-- Smooth Analog Sine Wave Curves -->
          <path d="M 10 75 Q 35 25 60 75 T 110 75 T 160 75" fill="none" stroke="#ffffff" stroke-width="2.5"/>
          <path d="M 10 75 Q 35 115 60 75 T 110 75 T 160 75" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="4 2"/>
        </svg>`;

      case 'wafer-grid':
        return `
        <svg class="card-header-svg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="grad-wafer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#881337"/>
              <stop offset="50%" stop-color="#e11d48"/>
              <stop offset="100%" stop-color="#f43f5e"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad-wafer)"/>
          
          <!-- 300mm Silicon Wafer Representation -->
          <g transform="translate(230, 10)">
            <circle cx="65" cy="65" r="60" fill="rgba(15,23,42,0.3)" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
            <!-- Wafer Notch -->
            <path d="M 125 65 A 60 60 0 0 1 65 125 A 60 60 0 0 1 5 65 A 60 60 0 0 1 65 5" fill="none" stroke="#fecdd3" stroke-width="1.5"/>
            <!-- Die matrix inside wafer -->
            <g stroke="#ffffff" stroke-width="0.8" opacity="0.6">
              <line x1="25" y1="35" x2="105" y2="35"/>
              <line x1="15" y1="55" x2="115" y2="55"/>
              <line x1="15" y1="75" x2="115" y2="75"/>
              <line x1="25" y1="95" x2="105" y2="95"/>
              
              <line x1="35" y1="25" x2="35" y2="105"/>
              <line x1="55" y1="15" x2="55" y2="115"/>
              <line x1="75" y1="15" x2="75" y2="115"/>
              <line x1="95" y1="25" x2="95" y2="105"/>
            </g>
            <circle cx="65" cy="65" r="6" fill="#fbbf24"/>
          </g>

          <g transform="translate(30, 30)">
            <!-- Hackathon Sprint Trophy & Stopwatch Motif -->
            <rect x="0" y="0" width="130" height="70" rx="8" fill="rgba(0,0,0,0.25)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
            <text x="65" y="28" fill="#ffffff" font-family="sans-serif" font-size="12" font-weight="800" text-anchor="middle">36-HR SPRINT</text>
            <text x="65" y="48" fill="#fecdd3" font-family="monospace" font-size="9" text-anchor="middle">₹1,50,000 PRIZES</text>
            <text x="65" y="60" fill="#fde047" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="middle">★ NATIONAL COMP ★</text>
          </g>
        </svg>`;

      case 'riscv-pipeline':
      default:
        return `
        <svg class="card-header-svg-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="grad-riscv" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#075985"/>
              <stop offset="50%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#38bdf8"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad-riscv)"/>
          
          <!-- 5-Stage RISC-V Pipeline -->
          <g transform="translate(30, 45)">
            <rect x="0" y="0" width="45" height="40" rx="4" fill="rgba(255,255,255,0.25)" stroke="#e0f2fe" stroke-width="1.5"/>
            <text x="22" y="24" fill="#ffffff" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">IF</text>

            <line x1="45" y1="20" x2="60" y2="20" stroke="#ffffff" stroke-width="2"/>

            <rect x="60" y="0" width="45" height="40" rx="4" fill="rgba(255,255,255,0.25)" stroke="#e0f2fe" stroke-width="1.5"/>
            <text x="82" y="24" fill="#ffffff" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">ID</text>

            <line x1="105" y1="20" x2="120" y2="20" stroke="#ffffff" stroke-width="2"/>

            <rect x="120" y="0" width="45" height="40" rx="4" fill="rgba(255,255,255,0.25)" stroke="#e0f2fe" stroke-width="1.5"/>
            <text x="142" y="24" fill="#ffffff" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">EX</text>

            <line x1="165" y1="20" x2="180" y2="20" stroke="#ffffff" stroke-width="2"/>

            <rect x="180" y="0" width="45" height="40" rx="4" fill="rgba(255,255,255,0.25)" stroke="#e0f2fe" stroke-width="1.5"/>
            <text x="202" y="24" fill="#ffffff" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">MEM</text>

            <line x1="225" y1="20" x2="240" y2="20" stroke="#ffffff" stroke-width="2"/>

            <rect x="240" y="0" width="45" height="40" rx="4" fill="rgba(255,255,255,0.25)" stroke="#e0f2fe" stroke-width="1.5"/>
            <text x="262" y="24" fill="#ffffff" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">WB</text>
          </g>

          <text x="30" y="125" fill="#f0f9ff" font-family="sans-serif" font-size="10" font-weight="700">RV64GC + CUSTOM TENSOR ACCELERATOR</text>
        </svg>`;
    }
  }
};
