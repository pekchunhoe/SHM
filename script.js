/* =========================================================
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION
   SCRIPT.JS — PART 1
   Y-COMPONENT MODEL

   Main equation:
       y = A sin(ωt)

   IMPORTANT:
   The SHM displacement is based ONLY on the Y-component.
========================================================= */


/* =========================================================
   1. PHYSICS CONSTANTS
========================================================= */

const DEFAULT_AMPLITUDE = 100;
const DEFAULT_FREQUENCY = 0.5;

const MIN_AMPLITUDE = 50;
const MAX_AMPLITUDE = 150;

const MIN_FREQUENCY = 0.1;
const MAX_FREQUENCY = 2.0;


/* =========================================================
   2. SIMULATION STATE
========================================================= */

const state = {

  amplitude: DEFAULT_AMPLITUDE,

  frequency: DEFAULT_FREQUENCY,

  omega: 2 * Math.PI * DEFAULT_FREQUENCY,

  period: 1 / DEFAULT_FREQUENCY,

  time: 0,

  theta: 0,

  y: 0,

  playing: false,

  showYComponent: true,

  lastTimestamp: null

};


/* =========================================================
   3. CANVAS REFERENCES
========================================================= */

const circularCanvas =
  document.getElementById("circularCanvas");

const shmCanvas =
  document.getElementById("shmCanvas");

const graphCanvas =
  document.getElementById("graphCanvas");


const circularCtx =
  circularCanvas.getContext("2d");

const shmCtx =
  shmCanvas.getContext("2d");

const graphCtx =
  graphCanvas.getContext("2d");


/* =========================================================
   4. CONTROL REFERENCES
========================================================= */

const amplitudeSlider =
  document.getElementById("amplitudeSlider");

const frequencySlider =
  document.getElementById("frequencySlider");

const playButton =
  document.getElementById("playButton");

const resetButton =
  document.getElementById("resetButton");

const yComponentToggle =
  document.getElementById("yComponentToggle");


/* =========================================================
   5. DISPLAY REFERENCES
========================================================= */

const simulationStatus =
  document.getElementById("simulationStatus");

const amplitudeDisplay =
  document.getElementById("amplitudeDisplay");

const angleDisplay =
  document.getElementById("angleDisplay");

const yDisplay =
  document.getElementById("yDisplay");

const amplitudeValue =
  document.getElementById("amplitudeValue");

const frequencyValue =
  document.getElementById("frequencyValue");

const valueAmplitude =
  document.getElementById("valueAmplitude");

const valueFrequency =
  document.getElementById("valueFrequency");

const valueOmega =
  document.getElementById("valueOmega");

const valuePeriod =
  document.getElementById("valuePeriod");

const valueTheta =
  document.getElementById("valueTheta");

const valueY =
  document.getElementById("valueY");


/* =========================================================
   6. COLLAPSIBLE PANEL REFERENCES
========================================================= */

const formulaToggle =
  document.getElementById("formulaToggle");

const formulaContent =
  document.getElementById("formulaContent");

const formulaArrow =
  document.getElementById("formulaArrow");

const conceptToggle =
  document.getElementById("conceptToggle");

const conceptContent =
  document.getElementById("conceptContent");

const conceptArrow =
  document.getElementById("conceptArrow");


/* =========================================================
   7. CANVAS RESIZING
========================================================= */

function resizeCanvas(canvas, ctx) {

  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(rect.width * dpr);

  canvas.height = Math.round(rect.height * dpr);

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}


/* =========================================================
   8. RESIZE ALL CANVASES
========================================================= */

function resizeAllCanvases() {

  resizeCanvas(
    circularCanvas,
    circularCtx
  );

  resizeCanvas(
    shmCanvas,
    shmCtx
  );

  resizeCanvas(
    graphCanvas,
    graphCtx
  );

  drawAll();
}


/* =========================================================
   9. GET CANVAS SIZE
========================================================= */

function getCanvasSize(canvas) {

  const rect =
    canvas.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height
  };

}


/* =========================================================
   10. UPDATE PHYSICS
========================================================= */

function updatePhysics() {

  /*
    Angular frequency:

        ω = 2πf
  */

  state.omega =
    2 * Math.PI * state.frequency;


  /*
    Period:

        T = 1/f
  */

  state.period =
    1 / state.frequency;


  /*
    Angular displacement:

        θ = ωt
  */

  state.theta =
    state.omega * state.time;


  /*
    Keep theta within one complete revolution
    for display purposes.
  */

  const displayTheta =
    state.theta % (2 * Math.PI);


  /*
    MAIN SHM EQUATION

        y = A sin(ωt)

    This is the ONLY displacement used
    for the vertical SHM representation.
  */

  state.y =
    state.amplitude *
    Math.sin(state.theta);


  /*
    Store display angle separately.
  */

  state.displayTheta =
    displayTheta;

}


/* =========================================================
   11. FORMAT NUMBER
========================================================= */

function formatNumber(value, decimals = 2) {

  return Number(value).toFixed(decimals);

}


/* =========================================================
   12. UPDATE DISPLAY
========================================================= */

function updateDisplays() {

  const angleDegrees =
    state.displayTheta *
    180 /
    Math.PI;


  const y =
    state.y;


  /* ---------------------------------------------
     Small information below circular diagram
  --------------------------------------------- */

  amplitudeDisplay.textContent =
    `${formatNumber(state.amplitude, 0)} px`;

  angleDisplay.textContent =
    `${formatNumber(angleDegrees, 0)}°`;

  yDisplay.textContent =
    `${formatNumber(y, 1)} px`;


  /* ---------------------------------------------
     Slider values
  --------------------------------------------- */

  amplitudeValue.textContent =
    `${formatNumber(state.amplitude, 0)} px`;

  frequencyValue.textContent =
    `${formatNumber(state.frequency, 2)} Hz`;


  /* ---------------------------------------------
     Physics value cards
  --------------------------------------------- */

  valueAmplitude.textContent =
    `${formatNumber(state.amplitude, 0)} px`;

  valueFrequency.textContent =
    `${formatNumber(state.frequency, 2)} Hz`;

  valueOmega.textContent =
    `${formatNumber(state.omega, 2)} rad/s`;

  valuePeriod.textContent =
    `${formatNumber(state.period, 2)} s`;

  valueTheta.textContent =
    `${formatNumber(angleDegrees, 0)}°`;

  valueY.textContent =
    `${formatNumber(y, 1)} px`;


  /* ---------------------------------------------
     Simulation status
  --------------------------------------------- */

  if (state.playing) {

    simulationStatus.textContent =
      "Playing";

    simulationStatus.classList.add(
      "playing"
    );

    playButton.textContent =
      "❚❚ Pause";

  } else {

    simulationStatus.textContent =
      "Paused";

    simulationStatus.classList.remove(
      "playing"
    );

    playButton.textContent =
      "▶ Play";

  }

}


/* =========================================================
   13. READ AMPLITUDE
========================================================= */

function updateAmplitude() {

  let value =
    Number(amplitudeSlider.value);


  value = Math.max(
    MIN_AMPLITUDE,
    Math.min(MAX_AMPLITUDE, value)
  );


  state.amplitude =
    value;


  updatePhysics();

  updateDisplays();

  drawAll();

}


/* =========================================================
   14. READ FREQUENCY
========================================================= */

function updateFrequency() {

  let value =
    Number(frequencySlider.value);


  value = Math.max(
    MIN_FREQUENCY,
    Math.min(MAX_FREQUENCY, value)
  );


  state.frequency =
    value;


  updatePhysics();

  updateDisplays();

  drawAll();

}


/* =========================================================
   15. PLAY / PAUSE
========================================================= */

function togglePlay() {

  state.playing =
    !state.playing;


  if (state.playing) {

    state.lastTimestamp =
      performance.now();

    requestAnimationFrame(
      animationLoop
    );

  } else {

    state.lastTimestamp =
      null;

  }


  updateDisplays();

}


/* =========================================================
   16. RESET SIMULATION
========================================================= */

function resetSimulation() {

  state.amplitude =
    DEFAULT_AMPLITUDE;

  state.frequency =
    DEFAULT_FREQUENCY;

  state.omega =
    2 * Math.PI *
    DEFAULT_FREQUENCY;

  state.period =
    1 / DEFAULT_FREQUENCY;

  state.time = 0;

  state.theta = 0;

  state.y = 0;

  state.displayTheta = 0;

  state.playing = false;

  state.lastTimestamp = null;


  amplitudeSlider.value =
    DEFAULT_AMPLITUDE;

  frequencySlider.value =
    DEFAULT_FREQUENCY;

  yComponentToggle.checked =
    true;

  state.showYComponent =
    true;


  updatePhysics();

  updateDisplays();

  drawAll();

}


/* =========================================================
   17. Y-COMPONENT TOGGLE
========================================================= */

function toggleYComponent() {

  state.showYComponent =
    yComponentToggle.checked;


  drawAll();

}


/* =========================================================
   18. ANIMATION LOOP
========================================================= */

function animationLoop(timestamp) {

  if (!state.playing) {
    return;
  }


  if (state.lastTimestamp === null) {

    state.lastTimestamp =
      timestamp;

  }


  /*
    Calculate elapsed real time.
  */

  const deltaTime =
    (timestamp - state.lastTimestamp)
    / 1000;


  state.lastTimestamp =
    timestamp;


  /*
    Prevent a huge time jump if the
    browser temporarily pauses animation.
  */

  const safeDelta =
    Math.min(deltaTime, 0.05);


  /*
    Advance simulation time.
  */

  state.time +=
    safeDelta;


  /*
    Update:

        θ = ωt

        y = A sin(ωt)
  */

  updatePhysics();

  updateDisplays();

  drawAll();


  requestAnimationFrame(
    animationLoop
  );

}


/* =========================================================
   19. DRAW ALL SIMULATIONS
========================================================= */

function drawAll() {

  drawCircularMotion();

  drawSHM();

  drawGraph();

}


/* =========================================================
   20. EVENT LISTENERS
========================================================= */

amplitudeSlider.addEventListener(
  "input",
  updateAmplitude
);


frequencySlider.addEventListener(
  "input",
  updateFrequency
);


playButton.addEventListener(
  "click",
  togglePlay
);


resetButton.addEventListener(
  "click",
  resetSimulation
);


yComponentToggle.addEventListener(
  "change",
  toggleYComponent
);


/* =========================================================
   21. FORMULA COLLAPSE
========================================================= */

formulaToggle.addEventListener(
  "click",
  () => {

    const hidden =
      formulaContent.style.display === "none";


    if (hidden) {

      formulaContent.style.display =
        "block";

      formulaArrow.textContent =
        "▼";

    } else {

      formulaContent.style.display =
        "none";

      formulaArrow.textContent =
        "▶";

    }

  }
);


/* =========================================================
   22. CONCEPT COLLAPSE
========================================================= */

conceptToggle.addEventListener(
  "click",
  () => {

    const hidden =
      conceptContent.style.display === "none";


    if (hidden) {

      conceptContent.style.display =
        "block";

      conceptArrow.textContent =
        "▼";

    } else {

      conceptContent.style.display =
        "none";

      conceptArrow.textContent =
        "▶";

    }

  }
);


/* =========================================================
   23. WINDOW RESIZE
========================================================= */

window.addEventListener(
  "resize",
  () => {

    resizeAllCanvases();

  }
);


/* =========================================================
   24. INITIALIZATION
========================================================= */

function initializeSimulation() {

  updatePhysics();

  updateDisplays();

  resizeAllCanvases();

}


/* =========================================================
   25. START
========================================================= */

initializeSimulation();


/*
=========================================================
PART 1 COMPLETE

Part 2 will contain the actual drawing functions:

    drawCircularMotion()
    drawSHM()
    drawGraph()

These functions will visually connect:

    Circular motion
          ↓
    Y-component
          ↓
    Vertical SHM
          ↓
    y = A sin(ωt)
          ↓
    Sinusoidal graph
=========================================================
*/

/* =========================================================
   SCRIPT.JS — PART 2
   DRAWING FUNCTIONS
========================================================= */


/* =========================================================
   26. DRAW CIRCULAR MOTION
========================================================= */

function drawCircularMotion() {

  const size =
    getCanvasSize(circularCanvas);

  const width = size.width;
  const height = size.height;

  circularCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     Canvas centre
  --------------------------------------------------------- */

  const cx = width * 0.5;
  const cy = height * 0.5;


  /*
    Keep the circle comfortably inside
    the canvas.
  */

  const maxRadius =
    Math.min(width, height) * 0.32;

  const radius =
    Math.min(
      state.amplitude,
      maxRadius
    );


  /* ---------------------------------------------------------
     Background
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#ffffff";

  circularCtx.fillRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     Grid
  --------------------------------------------------------- */

  drawLightGrid(
    circularCtx,
    width,
    height
  );


  /* ---------------------------------------------------------
     Coordinate axes
  --------------------------------------------------------- */

  circularCtx.strokeStyle =
    "#94a3b8";

  circularCtx.lineWidth = 1.2;

  circularCtx.setLineDash([5, 5]);

  /* Horizontal axis */

  circularCtx.beginPath();

  circularCtx.moveTo(
    15,
    cy
  );

  circularCtx.lineTo(
    width - 15,
    cy
  );

  circularCtx.stroke();


  /* Vertical axis */

  circularCtx.beginPath();

  circularCtx.moveTo(
    cx,
    15
  );

  circularCtx.lineTo(
    cx,
    height - 15
  );

  circularCtx.stroke();

  circularCtx.setLineDash([]);


  /* ---------------------------------------------------------
     Circle
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.arc(
    cx,
    cy,
    radius,
    0,
    2 * Math.PI
  );

  circularCtx.strokeStyle =
    "#2563eb";

  circularCtx.lineWidth = 3;

  circularCtx.stroke();


  /* ---------------------------------------------------------
     Calculate particle position
  --------------------------------------------------------- */

  /*
     IMPORTANT:

     The Y-component is:

         y = A sin(θ)

     Canvas Y increases downward.

     Therefore:

         screenY = cy - y
  */

  const y =
    state.y;

  const particleY =
    cy - y;


  /*
     X-coordinate is used ONLY to
     locate the rotating particle.

     It is NOT used for the SHM
     displacement calculation.
  */

  const particleX =
    cx +
    radius *
    Math.cos(state.displayTheta);


  /* ---------------------------------------------------------
     Radius line
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.moveTo(
    cx,
    cy
  );

  circularCtx.lineTo(
    particleX,
    particleY
  );

  circularCtx.strokeStyle =
    "#64748b";

  circularCtx.lineWidth = 2;

  circularCtx.stroke();


  /* ---------------------------------------------------------
     Y-component projection
  --------------------------------------------------------- */

  if (state.showYComponent) {

    /*
       Vertical projection from the
       circular particle to the Y-axis.
    */

    circularCtx.beginPath();

    circularCtx.moveTo(
      particleX,
      particleY
    );

    circularCtx.lineTo(
      cx,
      particleY
    );

    circularCtx.strokeStyle =
      "#16a34a";

    circularCtx.lineWidth = 3;

    circularCtx.setLineDash([6, 4]);

    circularCtx.stroke();

    circularCtx.setLineDash([]);


    /*
       Highlight the vertical
       displacement y.
    */

    circularCtx.beginPath();

    circularCtx.moveTo(
      cx,
      cy
    );

    circularCtx.lineTo(
      cx,
      particleY
    );

    circularCtx.strokeStyle =
      "#16a34a";

    circularCtx.lineWidth = 5;

    circularCtx.stroke();


    /* -----------------------------------------------------
       Y displacement arrow
    ----------------------------------------------------- */

    drawArrow(
      circularCtx,
      cx,
      cy,
      cx,
      particleY,
      "#16a34a",
      3
    );


    /* -----------------------------------------------------
       Y label
    ----------------------------------------------------- */

    circularCtx.fillStyle =
      "#15803d";

    circularCtx.font =
      "bold 16px Arial";

    circularCtx.textAlign =
      "left";

    circularCtx.fillText(
      "y",
      cx + 10,
      (cy + particleY) / 2
    );

  }


  /* ---------------------------------------------------------
     Particle
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.arc(
    particleX,
    particleY,
    9,
    0,
    2 * Math.PI
  );

  circularCtx.fillStyle =
    "#dc2626";

  circularCtx.fill();


  circularCtx.strokeStyle =
    "#ffffff";

  circularCtx.lineWidth = 2;

  circularCtx.stroke();


  /* ---------------------------------------------------------
     Centre point
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.arc(
    cx,
    cy,
    5,
    0,
    2 * Math.PI
  );

  circularCtx.fillStyle =
    "#172033";

  circularCtx.fill();


  /* ---------------------------------------------------------
     Labels
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#172033";

  circularCtx.font =
    "bold 14px Arial";

  circularCtx.textAlign =
    "center";

  circularCtx.fillText(
    "O",
    cx + 13,
    cy + 18
  );


  circularCtx.fillStyle =
    "#dc2626";

  circularCtx.fillText(
    "P",
    particleX + 15,
    particleY - 12
  );


  /* ---------------------------------------------------------
     Amplitude label
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#2563eb";

  circularCtx.font =
    "bold 14px Arial";

  circularCtx.textAlign =
    "center";

  circularCtx.fillText(
    "A",
    cx + radius * 0.55,
    cy - radius * 0.55
  );


  /* ---------------------------------------------------------
     Phase angle
  --------------------------------------------------------- */

  drawPhaseAngle(
    circularCtx,
    cx,
    cy,
    radius,
    state.displayTheta
  );


  /* ---------------------------------------------------------
     Main equation
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#2563eb";

  circularCtx.font =
    "bold 15px Arial";

  circularCtx.textAlign =
    "center";

  circularCtx.fillText(
    "y = A sin(ωt)",
    width / 2,
    height - 15
  );

}


/* =========================================================
   27. DRAW VERTICAL SHM
========================================================= */

function drawSHM() {

  const size =
    getCanvasSize(shmCanvas);

  const width = size.width;
  const height = size.height;

  shmCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     Background
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#ffffff";

  shmCtx.fillRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     Layout
  --------------------------------------------------------- */

  const cx =
    width * 0.5;

  const centreY =
    height * 0.5;

  const maxAmplitude =
    Math.min(width, height) * 0.38;

  const amplitude =
    Math.min(
      state.amplitude,
      maxAmplitude
    );


  /* ---------------------------------------------------------
     Vertical SHM path
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx,
    centreY - amplitude
  );

  shmCtx.lineTo(
    cx,
    centreY + amplitude
  );

  shmCtx.strokeStyle =
    "#94a3b8";

  shmCtx.lineWidth = 5;

  shmCtx.stroke();


  /* ---------------------------------------------------------
     Equilibrium line
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx - 65,
    centreY
  );

  shmCtx.lineTo(
    cx + 65,
    centreY
  );

  shmCtx.strokeStyle =
    "#64748b";

  shmCtx.lineWidth = 2;

  shmCtx.setLineDash([5, 4]);

  shmCtx.stroke();

  shmCtx.setLineDash([]);


  /* ---------------------------------------------------------
     Maximum positive displacement
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx - 10,
    centreY - amplitude
  );

  shmCtx.lineTo(
    cx + 10,
    centreY - amplitude
  );

  shmCtx.strokeStyle =
    "#dc2626";

  shmCtx.lineWidth = 3;

  shmCtx.stroke();


  /* ---------------------------------------------------------
     Maximum negative displacement
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx - 10,
    centreY + amplitude
  );

  shmCtx.lineTo(
    cx + 10,
    centreY + amplitude
  );

  shmCtx.strokeStyle =
    "#dc2626";

  shmCtx.lineWidth = 3;

  shmCtx.stroke();


  /* ---------------------------------------------------------
     Current SHM position
  --------------------------------------------------------- */

  /*
      y = A sin(ωt)

      Canvas coordinate:

      screenY = centreY - y
  */

  const particleY =
    centreY - state.y;


  /* ---------------------------------------------------------
     Displacement arrow
  --------------------------------------------------------- */

  if (state.showYComponent) {

    drawArrow(
      shmCtx,
      cx - 35,
      centreY,
      cx - 35,
      particleY,
      "#16a34a",
      4
    );

  }


  /* ---------------------------------------------------------
     SHM particle
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.arc(
    cx,
    particleY,
    11,
    0,
    2 * Math.PI
  );

  shmCtx.fillStyle =
    "#16a34a";

  shmCtx.fill();

  shmCtx.strokeStyle =
    "#ffffff";

  shmCtx.lineWidth = 3;

  shmCtx.stroke();


  /* ---------------------------------------------------------
     Labels
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#dc2626";

  shmCtx.font =
    "bold 14px Arial";

  shmCtx.textAlign =
    "left";

  shmCtx.fillText(
    "+A",
    cx + 18,
    centreY - amplitude + 5
  );


  shmCtx.fillText(
    "-A",
    cx + 18,
    centreY + amplitude + 5
  );


  shmCtx.fillStyle =
    "#64748b";

  shmCtx.fillText(
    "y = 0",
    cx + 18,
    centreY + 5
  );


  /* ---------------------------------------------------------
     Current displacement
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#16a34a";

  shmCtx.font =
    "bold 16px Arial";

  shmCtx.fillText(
    `y = ${formatNumber(state.y, 1)}`,
    cx + 35,
    particleY - 12
  );


  /* ---------------------------------------------------------
     Title
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#172033";

  shmCtx.font =
    "bold 15px Arial";

  shmCtx.textAlign =
    "center";

  shmCtx.fillText(
    "Vertical projection → SHM",
    width / 2,
    22
  );


  /* ---------------------------------------------------------
     Equation
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#2563eb";

  shmCtx.font =
    "bold 16px Arial";

  shmCtx.fillText(
    "y = A sin(ωt)",
    width / 2,
    height - 15
  );

}


/* =========================================================
   28. DRAW SINUSOIDAL GRAPH
========================================================= */

function drawGraph() {

  const size = getCanvasSize(graphCanvas);

  const width = size.width;
  const height = size.height;

  graphCtx.clearRect(0, 0, width, height);

  /* =====================================================
     GRAPH AREA
  ===================================================== */

  const left = 50;
  const right = width - 20;
  const top = 25;
  const bottom = height - 40;

  const graphWidth = right - left;
  const graphHeight = bottom - top;

  const centreY =
    top + graphHeight / 2;


  /* =====================================================
     BACKGROUND
  ===================================================== */

  graphCtx.fillStyle = "#ffffff";

  graphCtx.fillRect(
    0,
    0,
    width,
    height
  );


  /* =====================================================
     VERTICAL SCALE
     
     Amplitude directly controls
     the height of the sine wave.
  ===================================================== */

  const maxGraphAmplitude =
    graphHeight * 0.40;

  const amplitudeScale =
    maxGraphAmplitude /
    state.amplitude;


  /* =====================================================
     TIME WINDOW
     
     ALWAYS SHOW 2 COMPLETE PERIODS.

     Therefore:
     
     higher frequency
       → smaller period
       → more compressed graph

     lower frequency
       → larger period
       → wider graph
  ===================================================== */

  const visibleTime =
    2 * state.period;


  /* =====================================================
     GRID
  ===================================================== */

  graphCtx.strokeStyle =
    "#e2e8f0";

  graphCtx.lineWidth = 1;


  /* Horizontal grid */

  for (let i = 0; i <= 4; i++) {

    const y =
      top +
      i *
      graphHeight /
      4;

    graphCtx.beginPath();

    graphCtx.moveTo(
      left,
      y
    );

    graphCtx.lineTo(
      right,
      y
    );

    graphCtx.stroke();

  }


  /* Vertical grid */

  for (let i = 0; i <= 8; i++) {

    const x =
      left +
      i *
      graphWidth /
      8;

    graphCtx.beginPath();

    graphCtx.moveTo(
      x,
      top
    );

    graphCtx.lineTo(
      x,
      bottom
    );

    graphCtx.stroke();

  }


  /* =====================================================
     AXES
  ===================================================== */

  graphCtx.strokeStyle =
    "#64748b";

  graphCtx.lineWidth = 1.5;


  /* X axis */

  graphCtx.beginPath();

  graphCtx.moveTo(
    left,
    centreY
  );

  graphCtx.lineTo(
    right,
    centreY
  );

  graphCtx.stroke();


  /* Y axis */

  graphCtx.beginPath();

  graphCtx.moveTo(
    left,
    top
  );

  graphCtx.lineTo(
    left,
    bottom
  );

  graphCtx.stroke();


  /* =====================================================
     AMPLITUDE LABELS
  ===================================================== */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "right";


  graphCtx.fillText(
    `+${formatNumber(state.amplitude, 0)}`,
    left - 7,
    centreY -
      maxGraphAmplitude +
      4
  );


  graphCtx.fillText(
    "0",
    left - 7,
    centreY + 4
  );


  graphCtx.fillText(
    `-${formatNumber(state.amplitude, 0)}`,
    left - 7,
    centreY +
      maxGraphAmplitude +
      4
  );


  /* =====================================================
     SINUSOIDAL CURVE
     
     SAME PHYSICS EQUATION AS THE CIRCLE:

          y = A sin(ωt)
  ===================================================== */

  graphCtx.beginPath();

  const samples = 600;


  for (
    let i = 0;
    i <= samples;
    i++
  ) {

    /*
       Convert horizontal position
       into actual physical time.
    */

    const t =
      (i / samples) *
      visibleTime;


    /*
       SAME equation used by
       circular motion:

          y = A sin(ωt)
    */

    const y =
      state.amplitude *
      Math.sin(
        state.omega * t
      );


    /*
       Convert physical displacement
       to screen position.
    */

    const screenY =
      centreY -
      y * amplitudeScale;


    const x =
      left +
      (t / visibleTime) *
      graphWidth;


    if (i === 0) {

      graphCtx.moveTo(
        x,
        screenY
      );

    } else {

      graphCtx.lineTo(
        x,
        screenY
      );

    }

  }


  /* =====================================================
     DRAW SINE CURVE
  ===================================================== */

  graphCtx.strokeStyle =
    "#2563eb";

  graphCtx.lineWidth = 3;

  graphCtx.stroke();


  /* =====================================================
     CURRENT TIME
     
     The red dot corresponds to the
     SAME y value as the circular particle.
  ===================================================== */

  const currentTime =
    state.time % visibleTime;


  const currentX =
    left +
    (currentTime / visibleTime) *
    graphWidth;


  const currentY =
    centreY -
    state.y *
    amplitudeScale;


  /* Current-time vertical line */

  graphCtx.beginPath();

  graphCtx.moveTo(
    currentX,
    top
  );

  graphCtx.lineTo(
    currentX,
    bottom
  );

  graphCtx.strokeStyle =
    "#f59e0b";

  graphCtx.lineWidth = 1.5;

  graphCtx.setLineDash([
    5,
    4
  ]);

  graphCtx.stroke();

  graphCtx.setLineDash([]);


  /* Current point */

  graphCtx.beginPath();

  graphCtx.arc(
    currentX,
    currentY,
    7,
    0,
    Math.PI * 2
  );

  graphCtx.fillStyle =
    "#dc2626";

  graphCtx.fill();

  graphCtx.strokeStyle =
    "#ffffff";

  graphCtx.lineWidth = 2;

  graphCtx.stroke();


  /* =====================================================
     PERIOD MARKERS
  ===================================================== */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "center";


  /*
     Mark:

        0
        T/2
        T
        3T/2
        2T
  */

  for (
    let i = 0;
    i <= 4;
    i++
  ) {

    const t =
      i *
      state.period /
      2;


    const x =
      left +
      (t / visibleTime) *
      graphWidth;


    graphCtx.fillText(
      `${formatNumber(t, 2)} s`,
      x,
      bottom + 18
    );


    /*
       Small tick
    */

    graphCtx.beginPath();

    graphCtx.moveTo(
      x,
      centreY - 5
    );

    graphCtx.lineTo(
      x,
      centreY + 5
    );

    graphCtx.strokeStyle =
      "#64748b";

    graphCtx.lineWidth = 1;

    graphCtx.stroke();

  }


  /* =====================================================
     AXIS TITLES
  ===================================================== */

  graphCtx.fillStyle =
    "#172033";

  graphCtx.font =
    "bold 13px Arial";

  graphCtx.textAlign =
    "center";


  graphCtx.fillText(
    "time, t",
    width / 2,
    height - 7
  );


  graphCtx.save();

  graphCtx.translate(
    14,
    height / 2
  );

  graphCtx.rotate(
    -Math.PI / 2
  );

  graphCtx.fillText(
    "displacement, y",
    0,
    0
  );

  graphCtx.restore();


  /* =====================================================
     EQUATION
  ===================================================== */

  graphCtx.fillStyle =
    "#2563eb";

  graphCtx.font =
    "bold 14px Arial";

  graphCtx.textAlign =
    "left";

  graphCtx.fillText(
    "y = A sin(ωt)",
    left + 8,
    top + 15
  );


  /* =====================================================
     LIVE PARAMETERS
  ===================================================== */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "right";

  graphCtx.fillText(
    `A = ${formatNumber(state.amplitude, 0)}`,
    right,
    top + 15
  );

  graphCtx.fillText(
    `f = ${formatNumber(state.frequency, 2)} Hz`,
    right,
    top + 30
  );

}


  /* ---------------------------------------------------------
     Background
  --------------------------------------------------------- */

  graphCtx.fillStyle =
    "#ffffff";

  graphCtx.fillRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     Graph geometry
  --------------------------------------------------------- */

  const left =
    45;

  const right =
    width - 18;

  const top =
    25;

  const bottom =
    height - 35;

  const graphWidth =
    right - left;

  const graphHeight =
    bottom - top;

  const centreY =
    top + graphHeight / 2;


  /*
     Vertical scale.

     The graph shows ± amplitude.
  */

  const verticalScale =
    (graphHeight * 0.38) /
    Math.max(
      state.amplitude,
      1
    );


  /* ---------------------------------------------------------
     Grid
  --------------------------------------------------------- */

  graphCtx.strokeStyle =
    "#e2e8f0";

  graphCtx.lineWidth = 1;


  /* Horizontal grid */

  for (let i = 0; i <= 4; i++) {

    const y =
      top +
      i *
      graphHeight /
      4;

    graphCtx.beginPath();

    graphCtx.moveTo(
      left,
      y
    );

    graphCtx.lineTo(
      right,
      y
    );

    graphCtx.stroke();

  }


  /* Vertical grid */

  for (let i = 0; i <= 8; i++) {

    const x =
      left +
      i *
      graphWidth /
      8;

    graphCtx.beginPath();

    graphCtx.moveTo(
      x,
      top
    );

    graphCtx.lineTo(
      x,
      bottom
    );

    graphCtx.stroke();

  }


  /* ---------------------------------------------------------
     Main axes
  --------------------------------------------------------- */

  graphCtx.strokeStyle =
    "#64748b";

  graphCtx.lineWidth = 1.5;


  /* X-axis */

  graphCtx.beginPath();

  graphCtx.moveTo(
    left,
    centreY
  );

  graphCtx.lineTo(
    right,
    centreY
  );

  graphCtx.stroke();


  /* Y-axis */

  graphCtx.beginPath();

  graphCtx.moveTo(
    left,
    top
  );

  graphCtx.lineTo(
    left,
    bottom
  );

  graphCtx.stroke();


  /* ---------------------------------------------------------
     Y labels
  --------------------------------------------------------- */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "right";

  graphCtx.fillText(
    `+${formatNumber(state.amplitude, 0)}`,
    left - 7,
    centreY -
      graphHeight * 0.38 +
      4
  );

  graphCtx.fillText(
    "0",
    left - 7,
    centreY + 4
  );

  graphCtx.fillText(
    `-${formatNumber(state.amplitude, 0)}`,
    left - 7,
    centreY +
      graphHeight * 0.38 +
      4
  );


  /* ---------------------------------------------------------
     Time scale
  --------------------------------------------------------- */

  const visibleTime =
    state.period * 2;


  /*
     Draw two complete cycles.
  */

  graphCtx.beginPath();

  const samples = 500;


  for (let i = 0; i <= samples; i++) {

    const t =
      i /
      samples *
      visibleTime;


    /*
       MAIN GRAPH EQUATION

           y = A sin(ωt)
    */

    const y =
      state.amplitude *
      Math.sin(
        state.omega * t
      );


    const x =
      left +
      (t / visibleTime) *
      graphWidth;


    const screenY =
      centreY -
      y *
      verticalScale;


    if (i === 0) {

      graphCtx.moveTo(
        x,
        screenY
      );

    } else {

      graphCtx.lineTo(
        x,
        screenY
      );

    }

  }


  /* ---------------------------------------------------------
     Sinusoidal curve
  --------------------------------------------------------- */

  graphCtx.strokeStyle =
    "#2563eb";

  graphCtx.lineWidth = 3;

  graphCtx.stroke();


  /* ---------------------------------------------------------
     Current time marker
  --------------------------------------------------------- */

  /*
     Keep marker within the
     displayed two-period window.
  */

  const currentTime =
    state.time %
    visibleTime;


  const markerX =
    left +
    (currentTime / visibleTime) *
    graphWidth;


  const markerY =
    centreY -
    state.y *
    verticalScale;


  /* Vertical marker */

  graphCtx.beginPath();

  graphCtx.moveTo(
    markerX,
    top
  );

  graphCtx.lineTo(
    markerX,
    bottom
  );

  graphCtx.strokeStyle =
    "#f59e0b";

  graphCtx.lineWidth = 1.5;

  graphCtx.setLineDash([5, 4]);

  graphCtx.stroke();

  graphCtx.setLineDash([]);


  /* Current graph point */

  graphCtx.beginPath();

  graphCtx.arc(
    markerX,
    markerY,
    6,
    0,
    2 * Math.PI
  );

  graphCtx.fillStyle =
    "#dc2626";

  graphCtx.fill();

  graphCtx.strokeStyle =
    "#ffffff";

  graphCtx.lineWidth = 2;

  graphCtx.stroke();


  /* ---------------------------------------------------------
     X-axis labels
  --------------------------------------------------------- */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "center";


  for (let i = 0; i <= 4; i++) {

    const t =
      i *
      state.period /
      2;

    const x =
      left +
      (t / visibleTime) *
      graphWidth;

    graphCtx.fillText(
      `${formatNumber(t, 1)}s`,
      x,
      bottom + 18
    );

  }


  /* ---------------------------------------------------------
     Axis titles
  --------------------------------------------------------- */

  graphCtx.font =
    "bold 13px Arial";

  graphCtx.fillStyle =
    "#172033";

  graphCtx.textAlign =
    "center";

  graphCtx.fillText(
    "time, t",
    width / 2,
    height - 6
  );


  graphCtx.save();

  graphCtx.translate(
    14,
    height / 2
  );

  graphCtx.rotate(
    -Math.PI / 2
  );

  graphCtx.fillText(
    "displacement, y",
    0,
    0
  );

  graphCtx.restore();


  /* ---------------------------------------------------------
     Graph equation
  --------------------------------------------------------- */

  graphCtx.fillStyle =
    "#2563eb";

  graphCtx.font =
    "bold 14px Arial";

  graphCtx.textAlign =
    "left";

  graphCtx.fillText(
    "y = A sin(ωt)",
    left + 8,
    top + 15
  );

}


/* =========================================================
   29. LIGHT GRID HELPER
========================================================= */

function drawLightGrid(
  ctx,
  width,
  height
) {

  ctx.strokeStyle =
    "#f1f5f9";

  ctx.lineWidth = 1;


  const spacing = 25;


  for (
    let x = 0;
    x <= width;
    x += spacing
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.lineTo(
      x,
      height
    );

    ctx.stroke();

  }


  for (
    let y = 0;
    y <= height;
    y += spacing
  ) {

    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      width,
      y
    );

    ctx.stroke();

  }

}


/* =========================================================
   30. DRAW ARROW
========================================================= */

function drawArrow(
  ctx,
  x1,
  y1,
  x2,
  y2,
  color,
  lineWidth = 3
) {

  const headLength = 9;


  const dx =
    x2 - x1;

  const dy =
    y2 - y1;

  const length =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (length < 1) {
    return;
  }


  const ux =
    dx / length;

  const uy =
    dy / length;


  /* Main line */

  ctx.beginPath();

  ctx.moveTo(
    x1,
    y1
  );

  ctx.lineTo(
    x2,
    y2
  );

  ctx.strokeStyle =
    color;

  ctx.lineWidth =
    lineWidth;

  ctx.stroke();


  /* Arrow head */

  const leftX =
    x2 -
    ux * headLength -
    uy * headLength * 0.55;

  const leftY =
    y2 -
    uy * headLength +
    ux * headLength * 0.55;


  const rightX =
    x2 -
    ux * headLength +
    uy * headLength * 0.55;

  const rightY =
    y2 -
    uy * headLength -
    ux * headLength * 0.55;


  ctx.beginPath();

  ctx.moveTo(
    x2,
    y2
  );

  ctx.lineTo(
    leftX,
    leftY
  );

  ctx.lineTo(
    rightX,
    rightY
  );

  ctx.closePath();

  ctx.fillStyle =
    color;

  ctx.fill();

}


/* =========================================================
   31. DRAW PHASE ANGLE
========================================================= */

function drawPhaseAngle(
  ctx,
  cx,
  cy,
  radius,
  theta
) {

  const arcRadius =
    Math.min(
      radius * 0.32,
      45
    );


  /*
     Draw the angle from the
     positive X-axis to the radius.

     The angle is only a visual
     reference. The SHM displacement
     itself remains:

         y = A sin(θ)
  */

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    arcRadius,
    0,
    -theta,
    true
  );

  ctx.strokeStyle =
    "#f59e0b";

  ctx.lineWidth = 3;

  ctx.stroke();


  /* ---------------------------------------------------------
     θ label
  --------------------------------------------------------- */

  const labelAngle =
    -theta / 2;


  const labelRadius =
    arcRadius + 15;


  const labelX =
    cx +
    labelRadius *
    Math.cos(labelAngle);


  const labelY =
    cy +
    labelRadius *
    Math.sin(labelAngle);


  ctx.fillStyle =
    "#d97706";

  ctx.font =
    "bold 14px Arial";

  ctx.textAlign =
    "center";

  ctx.fillText(
    "θ",
    labelX,
    labelY
  );

}


/* =========================================================
   32. FINAL REDRAW
========================================================= */

updatePhysics();

updateDisplays();

drawAll();

/* =========================================================
   SCRIPT.JS — PART 3
   TEACHING + Y-COMPONENT VISUALIZATION
========================================================= */


/* =========================================================
   33. IMPROVED PHASE ANGLE DRAWING
========================================================= */

/*
   The important geometric relationship is:

       y = A sin θ

   θ is measured from the positive X-axis.

   The X-coordinate is used only to locate the
   rotating particle. The SHM displacement is
   always calculated from the Y-component.
*/

function drawPhaseAngle(
  ctx,
  cx,
  cy,
  radius,
  theta
) {

  const arcRadius =
    Math.min(radius * 0.30, 42);

  /*
     Canvas coordinates have positive Y downward,
     so the mathematical angle is drawn using -theta.
  */

  ctx.beginPath();

  ctx.arc(
    cx,
    cy,
    arcRadius,
    0,
    -theta,
    true
  );

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 3;
  ctx.stroke();


  /* ---------------------------------------------------------
     θ LABEL
  --------------------------------------------------------- */

  const labelAngle =
    -theta / 2;

  const labelRadius =
    arcRadius + 16;

  const labelX =
    cx +
    labelRadius *
    Math.cos(labelAngle);

  const labelY =
    cy +
    labelRadius *
    Math.sin(labelAngle);

  ctx.fillStyle = "#d97706";
  ctx.font = "bold 15px Arial";
  ctx.textAlign = "center";

  ctx.fillText(
    "θ",
    labelX,
    labelY
  );

}


/* =========================================================
   34. Y-COMPONENT INFORMATION
========================================================= */

function getYComponentInfo() {

  const theta =
    state.displayTheta;

  const y =
    state.amplitude *
    Math.sin(theta);

  return {
    theta: theta,
    y: y,
    amplitude: state.amplitude
  };

}


/* =========================================================
   35. DRAW Y-COMPONENT LABEL
========================================================= */

function drawYComponentLabel(
  ctx,
  x,
  y,
  value
) {

  const padding = 7;

  const text =
    `y = ${formatNumber(value, 1)}`;

  ctx.font =
    "bold 13px Arial";

  const textWidth =
    ctx.measureText(text).width;

  const boxWidth =
    textWidth + padding * 2;

  const boxHeight =
    26;


  ctx.fillStyle =
    "#ecfdf5";

  ctx.strokeStyle =
    "#16a34a";

  ctx.lineWidth = 1.5;


  ctx.beginPath();

  ctx.roundRect(
    x,
    y - boxHeight,
    boxWidth,
    boxHeight,
    6
  );

  ctx.fill();

  ctx.stroke();


  ctx.fillStyle =
    "#15803d";

  ctx.textAlign =
    "left";

  ctx.fillText(
    text,
    x + padding,
    y - 8
  );

}


/* =========================================================
   36. ENHANCE CIRCULAR MOTION
========================================================= */

function drawCircularYGuide() {

  if (!state.showYComponent) {
    return;
  }

  const size =
    getCanvasSize(circularCanvas);

  const width =
    size.width;

  const height =
    size.height;

  const cx =
    width * 0.5;

  const cy =
    height * 0.5;

  const radius =
    Math.min(
      state.amplitude,
      Math.min(width, height) * 0.32
    );

  const y =
    state.y;

  const particleY =
    cy - y;


  /*
     Highlight the vertical line
     representing the possible
     range of SHM displacement.
  */

  circularCtx.beginPath();

  circularCtx.moveTo(
    cx,
    cy - radius
  );

  circularCtx.lineTo(
    cx,
    cy + radius
  );

  circularCtx.strokeStyle =
    "rgba(22,163,74,0.18)";

  circularCtx.lineWidth =
    8;

  circularCtx.stroke();


  /*
     Mark +A.
  */

  circularCtx.beginPath();

  circularCtx.arc(
    cx,
    cy - radius,
    4,
    0,
    Math.PI * 2
  );

  circularCtx.fillStyle =
    "#16a34a";

  circularCtx.fill();


  /*
     Mark -A.
  */

  circularCtx.beginPath();

  circularCtx.arc(
    cx,
    cy + radius,
    4,
    0,
    Math.PI * 2
  );

  circularCtx.fill();


  /*
     Current projected point.
  */

  circularCtx.beginPath();

  circularCtx.arc(
    cx,
    particleY,
    6,
    0,
    Math.PI * 2
  );

  circularCtx.fillStyle =
    "#16a34a";

  circularCtx.fill();


  /*
     Current Y value.
  */

  drawYComponentLabel(
    circularCtx,
    cx + 18,
    particleY,
    y
  );

}


/* =========================================================
   37. DRAW PHASE MARKERS ON CIRCLE
========================================================= */

function drawPhaseMarkers() {

  const size =
    getCanvasSize(circularCanvas);

  const width =
    size.width;

  const height =
    size.height;

  const cx =
    width * 0.5;

  const cy =
    height * 0.5;

  const radius =
    Math.min(
      state.amplitude,
      Math.min(width, height) * 0.32
    );


  const markers = [
    {
      angle: 0,
      label: "0°"
    },
    {
      angle: Math.PI / 2,
      label: "90°"
    },
    {
      angle: Math.PI,
      label: "180°"
    },
    {
      angle: 3 * Math.PI / 2,
      label: "270°"
    }
  ];


  circularCtx.font =
    "11px Arial";

  circularCtx.textAlign =
    "center";

  circularCtx.fillStyle =
    "#64748b";


  markers.forEach(marker => {

    const x =
      cx +
      radius *
      Math.cos(marker.angle);

    const y =
      cy -
      radius *
      Math.sin(marker.angle);


    circularCtx.beginPath();

    circularCtx.arc(
      x,
      y,
      3,
      0,
      Math.PI * 2
    );

    circularCtx.fillStyle =
      "#64748b";

    circularCtx.fill();


    let labelX = x;
    let labelY = y;


    if (marker.angle === 0) {
      labelX += 16;
      labelY += 4;
    }

    if (marker.angle === Math.PI / 2) {
      labelY -= 9;
    }

    if (marker.angle === Math.PI) {
      labelX -= 18;
      labelY += 4;
    }

    if (marker.angle === 3 * Math.PI / 2) {
      labelY += 16;
    }


    circularCtx.fillText(
      marker.label,
      labelX,
      labelY
    );

  });

}


/* =========================================================
   38. SHM PHASE POSITION MARKERS
========================================================= */

function drawSHMMarkers() {

  const size =
    getCanvasSize(shmCanvas);

  const width =
    size.width;

  const height =
    size.height;

  const cx =
    width * 0.5;

  const centreY =
    height * 0.5;

  const amplitude =
    Math.min(
      state.amplitude,
      Math.min(width, height) * 0.38
    );


  /*
     +A
  */

  shmCtx.beginPath();

  shmCtx.arc(
    cx,
    centreY - amplitude,
    4,
    0,
    Math.PI * 2
  );

  shmCtx.fillStyle =
    "#dc2626";

  shmCtx.fill();


  /*
     Equilibrium
  */

  shmCtx.beginPath();

  shmCtx.arc(
    cx,
    centreY,
    4,
    0,
    Math.PI * 2
  );

  shmCtx.fillStyle =
    "#64748b";

  shmCtx.fill();


  /*
     -A
  */

  shmCtx.beginPath();

  shmCtx.arc(
    cx,
    centreY + amplitude,
    4,
    0,
    Math.PI * 2
  );

  shmCtx.fillStyle =
    "#dc2626";

  shmCtx.fill();

}


/* =========================================================
   39. UPDATE FORMULA VALUES
========================================================= */

function updateFormulaValues() {

  /*
     This function keeps the displayed
     physics relationship synchronized
     with the simulation.

     y = A sin(ωt)
  */

  const equation =
    document.querySelector(
      ".formula-result strong"
    );

  if (equation) {

    equation.textContent =
      "y = A sin(ωt)";

  }

}


/* =========================================================
   40. ADD CURRENT TIME INFORMATION
========================================================= */

function updateTimeDisplay() {

  /*
     Create a time display dynamically
     if one does not already exist.
  */

  let timeElement =
    document.getElementById(
      "simulationTime"
    );


  if (!timeElement) {

    timeElement =
      document.createElement("div");

    timeElement.id =
      "simulationTime";

    timeElement.className =
      "simulation-time";


    const valuesPanel =
      document.querySelector(
        ".values-panel"
      );


    if (valuesPanel) {

      valuesPanel.appendChild(
        timeElement
      );

    }

  }


  if (timeElement) {

    timeElement.innerHTML =
      `<span>Time</span>
       <strong>${formatNumber(state.time, 2)} s</strong>`;

  }

}


/* =========================================================
   41. UPDATE ALL TEACHING INFORMATION
========================================================= */

function updateTeachingInformation() {

  updateFormulaValues();

  updateTimeDisplay();

}


/* =========================================================
   42. WRAP ORIGINAL DRAW FUNCTION
========================================================= */

const originalDrawAll =
  drawAll;


/*
   Replace drawAll with an enhanced
   version.

   Original drawings are retained,
   then additional Y-component
   teaching markers are added.
*/

drawAll = function () {

  originalDrawAll();


  /*
     Additional circular Y-component
     highlighting.
  */

  drawCircularYGuide();


  /*
     Phase markers.
  */

  drawPhaseMarkers();


  /*
     SHM reference markers.
  */

  drawSHMMarkers();

};


/* =========================================================
   43. WRAP ORIGINAL UPDATE DISPLAY
========================================================= */

const originalUpdateDisplays =
  updateDisplays;


updateDisplays = function () {

  originalUpdateDisplays();

  updateTeachingInformation();

};


/* =========================================================
   44. PHYSICS CHECK
========================================================= */

function verifyYComponentEquation() {

  const expectedY =
    state.amplitude *
    Math.sin(
      state.omega *
      state.time
    );


  const difference =
    Math.abs(
      state.y -
      expectedY
    );


  /*
     Numerical tolerance.
  */

  return difference < 0.000001;

}


/* =========================================================
   45. DEBUG INFORMATION
========================================================= */

function getSimulationState() {

  return {

    amplitude:
      state.amplitude,

    frequency:
      state.frequency,

    omega:
      state.omega,

    period:
      state.period,

    time:
      state.time,

    theta:
      state.theta,

    y:
      state.y,

    equation:
      "y = A sin(ωt)",

    yComponentOnly:
      true,

    equationVerified:
      verifyYComponentEquation()

  };

}


/* =========================================================
   46. KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
       Spacebar:
       Play / Pause
    */

    if (
      event.code === "Space" &&
      event.target.tagName !== "INPUT"
    ) {

      event.preventDefault();

      togglePlay();

    }


    /*
       R:
       Reset
    */

    if (
      event.key.toLowerCase() === "r" &&
      event.target.tagName !== "INPUT"
    ) {

      resetSimulation();

    }

  }
);


/* =========================================================
   47. CLICK OUTSIDE SAFETY
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    /*
       Prevent the simulation from
       jumping forward when the browser
       tab becomes inactive.
    */

    if (
      document.hidden &&
      state.playing
    ) {

      state.lastTimestamp =
        null;

    }

  }
);


/* =========================================================
   48. RESTART TIMING AFTER TAB RETURNS
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      !document.hidden &&
      state.playing
    ) {

      state.lastTimestamp =
        performance.now();

      requestAnimationFrame(
        animationLoop
      );

    }

  }
);


/* =========================================================
   49. FINAL INITIALIZATION
========================================================= */

updatePhysics();

updateDisplays();

updateTeachingInformation();

drawAll();


/* =========================================================
   50. PHYSICS MODEL SUMMARY
========================================================= */

/*

   CIRCULAR MOTION
   ----------------

          P
         /|
        / |
       /  | y
      /θ  |
     O----|

   The particle rotates around O.

   Its vertical coordinate is:

       y = A sin θ


   Since:

       θ = ωt


   Therefore:

       y = A sin(ωt)


   This vertical projection performs
   simple harmonic motion.

   IMPORTANT:

   The X-coordinate is NOT used as
   the SHM displacement.

   The simulation therefore demonstrates:

       UCM
        ↓
       Y-component
        ↓
       y = A sin(θ)
        ↓
       θ = ωt
        ↓
       y = A sin(ωt)
        ↓
       SHM
        ↓
       Sinusoidal y-t graph

========================================================= */

/* =========================================================
   SCRIPT.JS — PART 4
   FINAL TEACHING / INTERACTION LAYER
========================================================= */


/* =========================================================
   51. PHASE POSITION DESCRIPTION
========================================================= */

function getPhaseDescription() {

  const degrees =
    (
      state.displayTheta *
      180 /
      Math.PI
    ) % 360;

  const d =
    degrees < 0
      ? degrees + 360
      : degrees;


  if (d < 45 || d >= 315) {

    return {
      position: "Equilibrium",
      description:
        "The Y-component is zero.",
      equation:
        "y = 0"
    };

  }

  if (d < 135) {

    return {
      position: "Maximum +Y",
      description:
        "The Y-component reaches maximum positive displacement.",
      equation:
        "y = +A"
    };

  }

  if (d < 225) {

    return {
      position: "Equilibrium",
      description:
        "The Y-component returns through equilibrium.",
      equation:
        "y = 0"
    };

  }

  return {

    position: "Maximum −Y",

    description:
      "The Y-component reaches maximum negative displacement.",

    equation:
      "y = −A"

  };

}


/* =========================================================
   52. CREATE PHASE INFORMATION BOX
========================================================= */

function createPhaseInformation() {

  let box =
    document.getElementById(
      "phaseInformation"
    );


  if (box) {
    return box;
  }


  box =
    document.createElement("div");

  box.id =
    "phaseInformation";

  box.className =
    "phase-information";


  const circularPanel =
    document.querySelector(
      ".simulation-panel"
    );


  if (circularPanel) {

    circularPanel.appendChild(
      box
    );

  }


  return box;

}


/* =========================================================
   53. UPDATE PHASE INFORMATION
========================================================= */

function updatePhaseInformation() {

  const box =
    createPhaseInformation();

  if (!box) {
    return;
  }


  const info =
    getPhaseDescription();


  const degrees =
    (
      state.displayTheta *
      180 /
      Math.PI
    ) % 360;


  box.innerHTML = `

    <div class="phase-title">
      Current Y-component
    </div>

    <div class="phase-position">
      ${info.position}
    </div>

    <div class="phase-equation">
      ${info.equation}
    </div>

    <div class="phase-description">
      ${info.description}
    </div>

    <div class="phase-angle">
      θ = ${formatNumber(degrees, 0)}°
    </div>

  `;

}


/* =========================================================
   54. CREATE Y COMPONENT EQUATION BOX
========================================================= */

function createLiveEquation() {

  let box =
    document.getElementById(
      "liveEquation"
    );


  if (box) {
    return box;
  }


  box =
    document.createElement("div");

  box.id =
    "liveEquation";

  box.className =
    "live-equation";


  const shmPanel =
    document.querySelectorAll(
      ".simulation-panel"
    )[1];


  if (shmPanel) {

    shmPanel.appendChild(
      box
    );

  }


  return box;

}


/* =========================================================
   55. UPDATE LIVE EQUATION
========================================================= */

function updateLiveEquation() {

  const box =
    createLiveEquation();

  if (!box) {
    return;
  }


  const thetaDegrees =
    (
      state.displayTheta *
      180 /
      Math.PI
    ) % 360;


  const y =
    state.y;


  box.innerHTML = `

    <div class="live-equation-title">
      Current Y-component
    </div>

    <div class="live-equation-main">
      y = A sin(ωt)
    </div>

    <div class="live-equation-values">
      y = ${formatNumber(state.amplitude, 0)}
      sin(${formatNumber(thetaDegrees, 0)}°)
    </div>

    <div class="live-equation-result">
      y = ${formatNumber(y, 1)} px
    </div>

  `;

}


/* =========================================================
   56. CREATE GRAPH PHASE LABEL
========================================================= */

function createGraphPhaseLabel() {

  let label =
    document.getElementById(
      "graphPhaseLabel"
    );


  if (label) {
    return label;
  }


  label =
    document.createElement("div");

  label.id =
    "graphPhaseLabel";

  label.className =
    "graph-phase-label";


  const graphPanel =
    document.querySelector(
      ".graph-panel"
    );


  if (graphPanel) {

    graphPanel.appendChild(
      label
    );

  }


  return label;

}


/* =========================================================
   57. UPDATE GRAPH PHASE LABEL
========================================================= */

function updateGraphPhaseLabel() {

  const label =
    createGraphPhaseLabel();

  if (!label) {
    return;
  }


  label.innerHTML = `

    <span>
      Current position
    </span>

    <strong>
      y = ${formatNumber(state.y, 1)} px
    </strong>

  `;

}


/* =========================================================
   58. ENHANCED TEACHING UPDATE
========================================================= */

function updateTeachingInformationFinal() {

  updatePhaseInformation();

  updateLiveEquation();

  updateGraphPhaseLabel();

}


/* =========================================================
   59. REPLACE PREVIOUS TEACHING UPDATE
========================================================= */

const previousTeachingUpdate =
  updateTeachingInformation;


updateTeachingInformation = function () {

  previousTeachingUpdate();

  updateTeachingInformationFinal();

};


/* =========================================================
   60. DRAW Y-DISPLACEMENT RANGE
========================================================= */

function drawYDisplacementRange() {

  if (!state.showYComponent) {
    return;
  }


  const size =
    getCanvasSize(circularCanvas);

  const width =
    size.width;

  const height =
    size.height;

  const cx =
    width / 2;

  const cy =
    height / 2;

  const radius =
    Math.min(
      state.amplitude,
      Math.min(width, height) * 0.32
    );


  /*
     Draw +A and -A markers
     on the Y-axis.
  */

  circularCtx.strokeStyle =
    "#16a34a";

  circularCtx.lineWidth = 2;


  /* +A */

  circularCtx.beginPath();

  circularCtx.moveTo(
    cx - 8,
    cy - radius
  );

  circularCtx.lineTo(
    cx + 8,
    cy - radius
  );

  circularCtx.stroke();


  /* -A */

  circularCtx.beginPath();

  circularCtx.moveTo(
    cx - 8,
    cy + radius
  );

  circularCtx.lineTo(
    cx + 8,
    cy + radius
  );

  circularCtx.stroke();


  circularCtx.fillStyle =
    "#15803d";

  circularCtx.font =
    "bold 12px Arial";

  circularCtx.textAlign =
    "left";


  circularCtx.fillText(
    "+A",
    cx + 11,
    cy - radius + 4
  );


  circularCtx.fillText(
    "−A",
    cx + 11,
    cy + radius + 4
  );

}


/* =========================================================
   61. DRAW EQUILIBRIUM MARKER
========================================================= */

function drawEquilibriumMarker() {

  const size =
    getCanvasSize(shmCanvas);

  const width =
    size.width;

  const height =
    size.height;

  const cx =
    width / 2;

  const cy =
    height / 2;


  shmCtx.strokeStyle =
    "#64748b";

  shmCtx.lineWidth =
    2;


  shmCtx.beginPath();

  shmCtx.moveTo(
    cx - 80,
    cy
  );

  shmCtx.lineTo(
    cx + 80,
    cy
  );

  shmCtx.stroke();


  shmCtx.fillStyle =
    "#64748b";

  shmCtx.font =
    "bold 12px Arial";

  shmCtx.textAlign =
    "left";

  shmCtx.fillText(
    "Equilibrium",
    cx + 84,
    cy + 4
  );

}


/* =========================================================
   62. DRAW CURRENT Y VALUE ON SHM
========================================================= */

function drawCurrentSHMValue() {

  const size =
    getCanvasSize(shmCanvas);

  const width =
    size.width;

  const height =
    size.height;

  const cx =
    width / 2;

  const cy =
    height / 2;

  const amplitude =
    Math.min(
      state.amplitude,
      Math.min(width, height) * 0.38
    );

  const particleY =
    cy - state.y;


  /*
     Horizontal guide from
     particle to value label.
  */

  if (state.showYComponent) {

    shmCtx.beginPath();

    shmCtx.moveTo(
      cx,
      particleY
    );

    shmCtx.lineTo(
      cx + 25,
      particleY
    );

    shmCtx.strokeStyle =
      "#16a34a";

    shmCtx.lineWidth =
      2;

    shmCtx.stroke();


    shmCtx.fillStyle =
      "#15803d";

    shmCtx.font =
      "bold 13px Arial";

    shmCtx.textAlign =
      "left";

    shmCtx.fillText(
      `y = ${formatNumber(state.y, 1)} px`,
      cx + 30,
      particleY + 5
    );

  }

}


/* =========================================================
   63. DRAW GRAPH ZERO-CROSSING MARKERS
========================================================= */

function drawGraphPhaseMarkers() {

  const size =
    getCanvasSize(graphCanvas);

  const width =
    size.width;

  const height =
    size.height;

  const left =
    45;

  const right =
    width - 18;

  const top =
    25;

  const bottom =
    height - 35;

  const graphWidth =
    right - left;

  const graphHeight =
    bottom - top;

  const centreY =
    top +
    graphHeight / 2;


  /*
     Show the equilibrium axis
     more clearly.
  */

  graphCtx.strokeStyle =
    "#94a3b8";

  graphCtx.lineWidth =
    2;


  graphCtx.beginPath();

  graphCtx.moveTo(
    left,
    centreY
  );

  graphCtx.lineTo(
    right,
    centreY
  );

  graphCtx.stroke();


  /*
     Mark one complete period.
  */

  const periodWidth =
    graphWidth / 2;


  for (let cycle = 0; cycle < 2; cycle++) {

    const x =
      left +
      cycle *
      periodWidth;


    graphCtx.beginPath();

    graphCtx.moveTo(
      x,
      centreY - 5
    );

    graphCtx.lineTo(
      x,
      centreY + 5
    );

    graphCtx.strokeStyle =
      "#64748b";

    graphCtx.lineWidth =
      1.5;

    graphCtx.stroke();

  }

}


/* =========================================================
   64. WRAP DRAW FUNCTION AGAIN
========================================================= */

const previousDrawAll =
  drawAll;


drawAll = function () {

  previousDrawAll();

  drawYDisplacementRange();

  drawEquilibriumMarker();

  drawCurrentSHMValue();

  drawGraphPhaseMarkers();

};


/* =========================================================
   65. CREATE OPTIONAL STYLE
========================================================= */

function addDynamicStyles() {

  if (
    document.getElementById(
      "dynamicSimulationStyles"
    )
  ) {

    return;

  }


  const style =
    document.createElement("style");

  style.id =
    "dynamicSimulationStyles";


  style.textContent = `

    .phase-information {
      margin: 8px 12px 12px;
      padding: 9px 11px;
      border-radius: 8px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      text-align: center;
    }

    .phase-title {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 3px;
    }

    .phase-position {
      font-size: 14px;
      font-weight: bold;
      color: #15803d;
    }

    .phase-equation {
      margin-top: 3px;
      font-size: 15px;
      font-weight: bold;
      color: #16a34a;
    }

    .phase-description {
      margin-top: 4px;
      font-size: 11px;
      color: #475569;
    }

    .phase-angle {
      margin-top: 4px;
      font-size: 11px;
      color: #64748b;
    }

    .live-equation {
      margin: 8px 12px 12px;
      padding: 9px;
      text-align: center;
      border-radius: 8px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
    }

    .live-equation-title {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;
    }

    .live-equation-main {
      font-size: 16px;
      font-weight: bold;
      color: #2563eb;
    }

    .live-equation-values {
      margin-top: 3px;
      font-size: 12px;
      color: #475569;
    }

    .live-equation-result {
      margin-top: 4px;
      font-size: 15px;
      font-weight: bold;
      color: #15803d;
    }

    .graph-phase-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-top: 1px solid #d9e0ea;
      font-size: 11px;
      color: #64748b;
    }

    .graph-phase-label strong {
      color: #dc2626;
      font-size: 13px;
    }

    .simulation-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 12px 12px;
      padding: 8px 10px;
      border-radius: 8px;
      background: #f8fafc;
      border: 1px solid #d9e0ea;
      font-size: 12px;
      color: #64748b;
    }

    .simulation-time strong {
      color: #172033;
      font-size: 13px;
    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================================================
   66. FINAL PHYSICS VALIDATION
========================================================= */

function validateSimulation() {

  const calculatedY =
    state.amplitude *
    Math.sin(
      state.omega *
      state.time
    );


  const error =
    Math.abs(
      calculatedY -
      state.y
    );


  return {

    valid:
      error < 0.000001,

    calculatedY:
      calculatedY,

    simulationY:
      state.y,

    error:
      error

  };

}


/* =========================================================
   67. EXPOSE DEBUG FUNCTION
========================================================= */

window.physicsSimulation = {

  getState:
    getSimulationState,

  validate:
    validateSimulation,

  reset:
    resetSimulation,

  playPause:
    togglePlay

};


/* =========================================================
   68. INITIALIZE FINAL LAYER
========================================================= */

addDynamicStyles();

updatePhysics();

updateDisplays();

updateTeachingInformation();

drawAll();


/* =========================================================
   69. FINAL CONCEPT
========================================================= */

/*

        UNIFORM CIRCULAR MOTION
                  │
                  │
                  ▼
           ROTATING PARTICLE
                  │
                  │
          vertical projection
                  │
                  ▼
             Y-COMPONENT
                  │
                  ▼
             y = A sin θ
                  │
              θ = ωt
                  │
                  ▼
           y = A sin(ωt)
                  │
                  ▼
                 SHM
                  │
                  ▼
           SINUSOIDAL GRAPH


   IMPORTANT:

   The X-component is NOT used to represent
   the SHM displacement.

   Only the vertical/Y-component is used.

========================================================= */