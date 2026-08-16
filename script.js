/* =========================================================
   PHYSICS SIMULATION
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   SCRIPT.JS — PART 1

   Core physics:

       θ = ωt

       ω = 2πf

       y = A sin θ

   Therefore:

       y = A sin(ωt)

   IMPORTANT:
   The Y-component is used for SHM.
   The X-component is NOT used as displacement.
========================================================= */


/* =========================================================
   1. GLOBAL STATE
========================================================= */

const state = {

  /* -------------------------------------------------------
     Physical parameters
  ------------------------------------------------------- */

  amplitude: 100,

  frequency: 0.50,

  omega: 2 * Math.PI * 0.50,

  period: 1 / 0.50,

  /* -------------------------------------------------------
     Time
  ------------------------------------------------------- */

  time: 0,

  theta: 0,

  displayTheta: 0,

  /* -------------------------------------------------------
     SHM quantities
  ------------------------------------------------------- */

  y: 0,

  velocity: 0,

  acceleration: 0,

  /* -------------------------------------------------------
     Animation
  ------------------------------------------------------- */

  playing: false,

  lastTimestamp: null,

  animationId: null,

  /* -------------------------------------------------------
     Display controls
  ------------------------------------------------------- */

  showYComponent: true,

  showGraphPoint: true

};


/* =========================================================
   2. CONSTANTS
========================================================= */

const TWO_PI =
  2 * Math.PI;


/* =========================================================
   3. CANVAS REFERENCES
========================================================= */

const circularCanvas =
  document.getElementById(
    "circularCanvas"
  );


const shmCanvas =
  document.getElementById(
    "shmCanvas"
  );


const graphCanvas =
  document.getElementById(
    "graphCanvas"
  );


/* =========================================================
   4. CANVAS CONTEXTS
========================================================= */

const circularCtx =
  circularCanvas
    ? circularCanvas.getContext("2d")
    : null;


const shmCtx =
  shmCanvas
    ? shmCanvas.getContext("2d")
    : null;


const graphCtx =
  graphCanvas
    ? graphCanvas.getContext("2d")
    : null;


/* =========================================================
   5. CONTROL REFERENCES
========================================================= */

const amplitudeSlider =
  document.getElementById(
    "amplitudeSlider"
  );


const frequencySlider =
  document.getElementById(
    "frequencySlider"
  );


const playButton =
  document.getElementById(
    "playButton"
  );


const resetButton =
  document.getElementById(
    "resetButton"
  );


const yComponentToggle =
  document.getElementById(
    "yComponentToggle"
  );


/* =========================================================
   6. OUTPUT REFERENCES
========================================================= */

const amplitudeValue =
  document.getElementById(
    "amplitudeValue"
  );


const frequencyValue =
  document.getElementById(
    "frequencyValue"
  );


const omegaValue =
  document.getElementById(
    "omegaValue"
  );


const periodValue =
  document.getElementById(
    "periodValue"
  );


const displacementValue =
  document.getElementById(
    "displacementValue"
  );


const velocityValue =
  document.getElementById(
    "velocityValue"
  );


const accelerationValue =
  document.getElementById(
    "accelerationValue"
  );


const phaseValue =
  document.getElementById(
    "phaseValue"
  );


const statusValue =
  document.getElementById(
    "statusValue"
  );


/* =========================================================
   7. UTILITY — NUMBER FORMAT
========================================================= */

function formatNumber(
  value,
  decimals = 2
) {

  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number(value)
    .toFixed(decimals);

}


/* =========================================================
   8. UTILITY — DEGREE CONVERSION
========================================================= */

function radiansToDegrees(
  radians
) {

  return radians *
    180 /
    Math.PI;

}


/* =========================================================
   9. UTILITY — NORMALIZE ANGLE
========================================================= */

function normalizeAngle(
  angle
) {

  let result =
    angle % TWO_PI;

  if (result < 0) {
    result += TWO_PI;
  }

  return result;

}


/* =========================================================
   10. GET RESPONSIVE CANVAS SIZE
========================================================= */

function getCanvasSize(
  canvas
) {

  if (!canvas) {

    return {
      width: 0,
      height: 0
    };

  }


  const rect =
    canvas.getBoundingClientRect();


  const width =
    Math.max(
      1,
      rect.width
    );


  const height =
    Math.max(
      1,
      rect.height
    );


  return {
    width,
    height
  };

}


/* =========================================================
   11. RESIZE CANVAS
========================================================= */

function resizeCanvas(
  canvas,
  ctx
) {

  if (!canvas || !ctx) {
    return;
  }


  const rect =
    canvas.getBoundingClientRect();


  const dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  const width =
    Math.max(
      1,
      Math.round(
        rect.width * dpr
      )
    );


  const height =
    Math.max(
      1,
      Math.round(
        rect.height * dpr
      )
    );


  if (
    canvas.width !== width ||
    canvas.height !== height
  ) {

    canvas.width =
      width;

    canvas.height =
      height;

  }


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
   12. RESIZE ALL CANVASES
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
   13. READ AMPLITUDE
========================================================= */

function readAmplitude() {

  if (!amplitudeSlider) {
    return state.amplitude;
  }


  const value =
    parseFloat(
      amplitudeSlider.value
    );


  if (!Number.isFinite(value)) {
    return state.amplitude;
  }


  return value;

}


/* =========================================================
   14. READ FREQUENCY
========================================================= */

function readFrequency() {

  if (!frequencySlider) {
    return state.frequency;
  }


  const value =
    parseFloat(
      frequencySlider.value
    );


  if (!Number.isFinite(value)) {
    return state.frequency;
  }


  return value;

}


/* =========================================================
   15. UPDATE PHYSICS PARAMETERS
========================================================= */

function updatePhysicsParameters() {

  state.amplitude =
    Math.max(
      0.001,
      readAmplitude()
    );


  state.frequency =
    Math.max(
      0.001,
      readFrequency()
    );


  /*
     Angular frequency:

         ω = 2πf
  */

  state.omega =
    TWO_PI *
    state.frequency;


  /*
     Period:

         T = 1/f
  */

  state.period =
    1 /
    state.frequency;

}


/* =========================================================
   16. CALCULATE SHM
========================================================= */

function calculateSHM() {

  /*
     Phase angle:

         θ = ωt
  */

  state.theta =
    state.omega *
    state.time;


  /*
     Display angle is normalized
     to one revolution.
  */

  state.displayTheta =
    normalizeAngle(
      state.theta
    );


  /*
     SHM displacement:

         y = A sin(ωt)

     THIS IS THE Y-COMPONENT.

     The X-component is NOT used.
  */

  state.y =
    state.amplitude *
    Math.sin(
      state.theta
    );


  /*
     Velocity:

         v = Aω cos(ωt)
  */

  state.velocity =
    state.amplitude *
    state.omega *
    Math.cos(
      state.theta
    );


  /*
     Acceleration:

         a = -Aω² sin(ωt)

     or:

         a = -ω²y
  */

  state.acceleration =
    -state.omega *
    state.omega *
    state.y;

}


/* =========================================================
   17. UPDATE PHYSICS
========================================================= */

function updatePhysics() {

  updatePhysicsParameters();

  calculateSHM();

}


/* =========================================================
   18. UPDATE SLIDER LABELS
========================================================= */

function updateSliderLabels() {

  if (amplitudeValue) {

    amplitudeValue.textContent =
      `${formatNumber(
        state.amplitude,
        0
      )}`;

  }


  if (frequencyValue) {

    frequencyValue.textContent =
      `${formatNumber(
        state.frequency,
        2
      )} Hz`;

  }

}


/* =========================================================
   19. UPDATE PHYSICS OUTPUTS
========================================================= */

function updatePhysicsOutputs() {

  if (omegaValue) {

    omegaValue.textContent =
      `${formatNumber(
        state.omega,
        2
      )} rad/s`;

  }


  if (periodValue) {

    periodValue.textContent =
      `${formatNumber(
        state.period,
        2
      )} s`;

  }


  if (displacementValue) {

    displacementValue.textContent =
      `${formatNumber(
        state.y,
        1
      )}`;

  }


  if (velocityValue) {

    velocityValue.textContent =
      `${formatNumber(
        state.velocity,
        1
      )}`;

  }


  if (accelerationValue) {

    accelerationValue.textContent =
      `${formatNumber(
        state.acceleration,
        1
      )}`;

  }


  if (phaseValue) {

    phaseValue.textContent =
      `${formatNumber(
        radiansToDegrees(
          state.displayTheta
        ),
        0
      )}°`;

  }

}


/* =========================================================
   20. UPDATE STATUS
========================================================= */

function updateStatus() {

  if (!statusValue) {
    return;
  }


  if (state.playing) {

    statusValue.textContent =
      "Running";

  } else {

    statusValue.textContent =
      "Paused";

  }

}


/* =========================================================
   21. UPDATE ALL DISPLAYS
========================================================= */

function updateDisplays() {

  updateSliderLabels();

  updatePhysicsOutputs();

  updateStatus();

}


/* =========================================================
   22. PLAY SIMULATION
========================================================= */

function playSimulation() {

  if (state.playing) {
    return;
  }


  state.playing =
    true;


  state.lastTimestamp =
    null;


  updateDisplays();


  state.animationId =
    requestAnimationFrame(
      animationLoop
    );

}


/* =========================================================
   23. PAUSE SIMULATION
========================================================= */

function pauseSimulation() {

  state.playing =
    false;


  state.lastTimestamp =
    null;


  if (
    state.animationId !== null
  ) {

    cancelAnimationFrame(
      state.animationId
    );

    state.animationId =
      null;

  }


  updateDisplays();

}


/* =========================================================
   24. TOGGLE PLAY / PAUSE
========================================================= */

function togglePlay() {

  if (state.playing) {

    pauseSimulation();

  } else {

    playSimulation();

  }

}


/* =========================================================
   25. RESET SIMULATION
========================================================= */

function resetSimulation() {

  pauseSimulation();


  state.time =
    0;


  state.theta =
    0;


  state.displayTheta =
    0;


  state.y =
    0;


  state.velocity =
    state.amplitude *
    state.omega;


  state.acceleration =
    0;


  updatePhysics();

  updateDisplays();

  drawAll();

}


/* =========================================================
   26. ANIMATION LOOP
========================================================= */

function animationLoop(
  timestamp
) {

  if (!state.playing) {
    return;
  }


  if (
    state.lastTimestamp === null
  ) {

    state.lastTimestamp =
      timestamp;

  }


  /*
     Real elapsed time.

     Convert milliseconds → seconds.
  */

  let dt =
    (
      timestamp -
      state.lastTimestamp
    ) / 1000;


  state.lastTimestamp =
    timestamp;


  /*
     Prevent a huge jump if the browser
     temporarily freezes.
  */

  dt =
    Math.min(
      dt,
      0.05
    );


  /*
     Advance physical time.

     IMPORTANT:

     Time is independent of amplitude.

     Frequency determines how quickly
     theta changes.
  */

  state.time +=
    dt;


  /*
     Recalculate:

       θ
       y
       v
       a
  */

  calculateSHM();


  updateDisplays();

  drawAll();


  state.animationId =
    requestAnimationFrame(
      animationLoop
    );

}


/* =========================================================
   27. AMPLITUDE SLIDER EVENT
========================================================= */

if (amplitudeSlider) {

  amplitudeSlider.addEventListener(
    "input",
    () => {

      /*
         Changing amplitude immediately
         changes the physical size of:

         1. Circular orbit
         2. Y-component
         3. SHM
         4. Sine-wave amplitude
      */

      updatePhysics();

      updateDisplays();

      drawAll();

    }
  );

}


/* =========================================================
   28. FREQUENCY SLIDER EVENT
========================================================= */

if (frequencySlider) {

  frequencySlider.addEventListener(
    "input",
    () => {

      /*
         Changing frequency immediately
         changes:

             ω = 2πf

         and:

             T = 1/f

         Therefore the sine graph changes
         its horizontal shape as well.
      */

      updatePhysics();

      updateDisplays();

      drawAll();

    }
  );

}


/* =========================================================
   29. PLAY BUTTON EVENT
========================================================= */

if (playButton) {

  playButton.addEventListener(
    "click",
    togglePlay
  );

}


/* =========================================================
   30. RESET BUTTON EVENT
========================================================= */

if (resetButton) {

  resetButton.addEventListener(
    "click",
    resetSimulation
  );

}


/* =========================================================
   31. Y-COMPONENT TOGGLE
========================================================= */

if (yComponentToggle) {

  yComponentToggle.addEventListener(
    "change",
    () => {

      state.showYComponent =
        yComponentToggle.checked;

      drawAll();

    }
  );

}


/* =========================================================
   32. TOUCH / POINTER SUPPORT
========================================================= */

function preventCanvasScroll(
  canvas
) {

  if (!canvas) {
    return;
  }


  canvas.addEventListener(
    "touchstart",
    event => {

      /*
         Prevent page scrolling while
         interacting with the simulation.
      */

      if (
        event.touches.length === 1
      ) {

        event.preventDefault();

      }

    },
    {
      passive: false
    }
  );

}


preventCanvasScroll(
  circularCanvas
);

preventCanvasScroll(
  shmCanvas
);

preventCanvasScroll(
  graphCanvas
);


/* =========================================================
   33. WINDOW RESIZE
========================================================= */

let resizeTimer = null;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        () => {

          resizeAllCanvases();

        },
        100
      );

  }
);


/* =========================================================
   34. VISIBILITY CHANGE
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      state.lastTimestamp =
        null;

    } else if (
      state.playing
    ) {

      state.lastTimestamp =
        performance.now();

    }

  }
);


/* =========================================================
   35. INITIALIZE CANVAS
========================================================= */

resizeAllCanvases();


/* =========================================================
   36. INITIAL PHYSICS
========================================================= */

updatePhysics();


/* =========================================================
   37. INITIAL DISPLAY
========================================================= */

updateDisplays();


/* =========================================================
   38. INITIAL DRAW
========================================================= */

drawAll();


/* =========================================================
   END OF SCRIPT.JS — PART 1
========================================================= */

/* =========================================================
   PHYSICS SIMULATION
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   SCRIPT.JS — PART 2

   VISUALIZATION FUNCTIONS

   IMPORTANT:

       y = A sin(ωt)

   ONLY THE Y-COMPONENT IS USED FOR SHM.
========================================================= */


/* =========================================================
   39. DRAW ALL VISUALIZATIONS
========================================================= */

function drawAll() {

  drawCircularMotion();

  drawSHM();

  drawGraph();

}


/* =========================================================
   40. DRAW CIRCULAR MOTION
========================================================= */

function drawCircularMotion() {

  if (!circularCanvas || !circularCtx) {
    return;
  }


  const size =
    getCanvasSize(
      circularCanvas
    );


  const width =
    size.width;

  const height =
    size.height;


  circularCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     BACKGROUND
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
     CENTRE
  --------------------------------------------------------- */

  const cx =
    width / 2;

  const cy =
    height / 2;


  /*
     Keep the circular motion
     inside the canvas.

     The physical amplitude A is
     represented by the radius.
  */

  const radius =
    Math.min(
      state.amplitude,
      Math.min(
        width,
        height
      ) * 0.34
    );


  /* ---------------------------------------------------------
     LIGHT GRID
  --------------------------------------------------------- */

  drawLightGrid(
    circularCtx,
    width,
    height
  );


  /* ---------------------------------------------------------
     X AXIS
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.moveTo(
    15,
    cy
  );

  circularCtx.lineTo(
    width - 15,
    cy
  );

  circularCtx.strokeStyle =
    "#94a3b8";

  circularCtx.lineWidth =
    1.2;

  circularCtx.setLineDash([
    5,
    5
  ]);

  circularCtx.stroke();


  /* ---------------------------------------------------------
     Y AXIS
  --------------------------------------------------------- */

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
     CIRCULAR PATH
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.arc(
    cx,
    cy,
    radius,
    0,
    TWO_PI
  );

  circularCtx.strokeStyle =
    "#2563eb";

  circularCtx.lineWidth =
    3;

  circularCtx.stroke();


  /* ---------------------------------------------------------
     ROTATING PARTICLE
  --------------------------------------------------------- */

  /*
     Mathematical position:

         x = A cos θ
         y = A sin θ

     IMPORTANT:

     x is ONLY used to locate the
     particle on the circular path.

     SHM displacement uses:

         y = A sin θ
  */

  const particleX =
    cx +
    radius *
    Math.cos(
      state.displayTheta
    );


  /*
     Canvas Y direction is downward.

     Therefore positive mathematical
     y appears upward:

         screenY = cy - y
  */

  const particleY =
    cy -
    state.y *
    (
      radius /
      state.amplitude
    );


  /* ---------------------------------------------------------
     RADIUS VECTOR
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

  circularCtx.lineWidth =
    2;

  circularCtx.stroke();


  /* ---------------------------------------------------------
     Y-COMPONENT PROJECTION
  --------------------------------------------------------- */

  if (
    state.showYComponent
  ) {

    /*
       Horizontal projection from
       particle to Y-axis.
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

    circularCtx.lineWidth =
      3;

    circularCtx.setLineDash([
      6,
      4
    ]);

    circularCtx.stroke();

    circularCtx.setLineDash([]);


    /*
       Vertical Y displacement.

       This is the SHM displacement.
    */

    drawArrow(
      circularCtx,

      cx,
      cy,

      cx,
      particleY,

      "#16a34a",

      4
    );


    /* -----------------------------------------------------
       Y LABEL
    ----------------------------------------------------- */

    circularCtx.fillStyle =
      "#15803d";

    circularCtx.font =
      "bold 15px Arial";

    circularCtx.textAlign =
      "left";


    circularCtx.fillText(
      `y = ${formatNumber(
        state.y,
        1
      )}`,
      cx + 12,
      (cy + particleY) / 2
    );

  }


  /* ---------------------------------------------------------
     PARTICLE
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.arc(
    particleX,
    particleY,
    9,
    0,
    TWO_PI
  );

  circularCtx.fillStyle =
    "#dc2626";

  circularCtx.fill();

  circularCtx.strokeStyle =
    "#ffffff";

  circularCtx.lineWidth =
    2;

  circularCtx.stroke();


  /* ---------------------------------------------------------
     CENTRE POINT
  --------------------------------------------------------- */

  circularCtx.beginPath();

  circularCtx.arc(
    cx,
    cy,
    5,
    0,
    TWO_PI
  );

  circularCtx.fillStyle =
    "#172033";

  circularCtx.fill();


  /* ---------------------------------------------------------
     POINT LABEL
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#dc2626";

  circularCtx.font =
    "bold 13px Arial";

  circularCtx.textAlign =
    "left";


  circularCtx.fillText(
    "P",
    particleX + 12,
    particleY - 10
  );


  /* ---------------------------------------------------------
     CENTRE LABEL
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#172033";

  circularCtx.fillText(
    "O",
    cx + 9,
    cy + 18
  );


  /* ---------------------------------------------------------
     AMPLITUDE LABEL
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#2563eb";

  circularCtx.font =
    "bold 13px Arial";

  circularCtx.textAlign =
    "center";


  circularCtx.fillText(
    "A",
    cx +
      radius * 0.55,
    cy -
      radius * 0.55
  );


  /* ---------------------------------------------------------
     PHASE ANGLE
  --------------------------------------------------------- */

  drawPhaseAngle(
    circularCtx,
    cx,
    cy,
    radius,
    state.displayTheta
  );


  /* ---------------------------------------------------------
     PHASE VALUE
  --------------------------------------------------------- */

  circularCtx.fillStyle =
    "#d97706";

  circularCtx.font =
    "bold 13px Arial";

  circularCtx.textAlign =
    "left";


  circularCtx.fillText(
    `θ = ${formatNumber(
      radiansToDegrees(
        state.displayTheta
      ),
      0
    )}°`,
    15,
    25
  );


  /* ---------------------------------------------------------
     EQUATION
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
    height - 12
  );

}


/* =========================================================
   41. DRAW VERTICAL SHM
========================================================= */

function drawSHM() {

  if (!shmCanvas || !shmCtx) {
    return;
  }


  const size =
    getCanvasSize(
      shmCanvas
    );


  const width =
    size.width;

  const height =
    size.height;


  shmCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     BACKGROUND
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
     CENTRE
  --------------------------------------------------------- */

  const cx =
    width / 2;

  const cy =
    height / 2;


  /*
     Amplitude represented by
     vertical SHM range.
  */

  const amplitude =
    Math.min(
      state.amplitude,
      Math.min(
        width,
        height
      ) * 0.38
    );


  /* ---------------------------------------------------------
     TITLE
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#172033";

  shmCtx.font =
    "bold 15px Arial";

  shmCtx.textAlign =
    "center";


  shmCtx.fillText(
    "Y-component → SHM",
    width / 2,
    20
  );


  /* ---------------------------------------------------------
     SHM PATH
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx,
    cy - amplitude
  );

  shmCtx.lineTo(
    cx,
    cy + amplitude
  );

  shmCtx.strokeStyle =
    "#94a3b8";

  shmCtx.lineWidth =
    5;

  shmCtx.stroke();


  /* ---------------------------------------------------------
     EQUILIBRIUM LINE
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx - 70,
    cy
  );

  shmCtx.lineTo(
    cx + 70,
    cy
  );

  shmCtx.strokeStyle =
    "#64748b";

  shmCtx.lineWidth =
    2;

  shmCtx.setLineDash([
    5,
    4
  ]);

  shmCtx.stroke();

  shmCtx.setLineDash([]);


  /* ---------------------------------------------------------
     +A MARKER
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx - 10,
    cy - amplitude
  );

  shmCtx.lineTo(
    cx + 10,
    cy - amplitude
  );

  shmCtx.strokeStyle =
    "#dc2626";

  shmCtx.lineWidth =
    3;

  shmCtx.stroke();


  /* ---------------------------------------------------------
     -A MARKER
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.moveTo(
    cx - 10,
    cy + amplitude
  );

  shmCtx.lineTo(
    cx + 10,
    cy + amplitude
  );

  shmCtx.stroke();


  /* ---------------------------------------------------------
     CURRENT Y POSITION
  --------------------------------------------------------- */

  /*
     Convert physical y into
     screen displacement.

         y_screen = cy - y

     The same state.y from the
     circular motion is used.
  */

  const scale =
    amplitude /
    state.amplitude;


  const particleY =
    cy -
    state.y *
    scale;


  /* ---------------------------------------------------------
     Y DISPLACEMENT ARROW
  --------------------------------------------------------- */

  if (
    state.showYComponent
  ) {

    drawArrow(
      shmCtx,

      cx - 35,
      cy,

      cx - 35,
      particleY,

      "#16a34a",

      4
    );

  }


  /* ---------------------------------------------------------
     SHM PARTICLE
  --------------------------------------------------------- */

  shmCtx.beginPath();

  shmCtx.arc(
    cx,
    particleY,
    11,
    0,
    TWO_PI
  );

  shmCtx.fillStyle =
    "#16a34a";

  shmCtx.fill();

  shmCtx.strokeStyle =
    "#ffffff";

  shmCtx.lineWidth =
    3;

  shmCtx.stroke();


  /* ---------------------------------------------------------
     CURRENT Y VALUE
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#15803d";

  shmCtx.font =
    "bold 13px Arial";

  shmCtx.textAlign =
    "left";


  shmCtx.fillText(
    `y = ${formatNumber(
      state.y,
      1
    )}`,
    cx + 20,
    particleY - 12
  );


  /* ---------------------------------------------------------
     +A LABEL
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#dc2626";

  shmCtx.font =
    "bold 13px Arial";

  shmCtx.textAlign =
    "left";


  shmCtx.fillText(
    "+A",
    cx + 17,
    cy - amplitude + 5
  );


  /* ---------------------------------------------------------
     0 LABEL
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#64748b";


  shmCtx.fillText(
    "y = 0",
    cx + 17,
    cy + 5
  );


  /* ---------------------------------------------------------
     -A LABEL
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#dc2626";


  shmCtx.fillText(
    "−A",
    cx + 17,
    cy + amplitude + 5
  );


  /* ---------------------------------------------------------
     EQUATION
  --------------------------------------------------------- */

  shmCtx.fillStyle =
    "#2563eb";

  shmCtx.font =
    "bold 15px Arial";

  shmCtx.textAlign =
    "center";


  shmCtx.fillText(
    "y = A sin(ωt)",
    width / 2,
    height - 12
  );

}


/* =========================================================
   42. DRAW SINUSOIDAL GRAPH
========================================================= */

function drawGraph() {

  if (!graphCanvas || !graphCtx) {
    return;
  }


  const size =
    getCanvasSize(
      graphCanvas
    );


  const width =
    size.width;

  const height =
    size.height;


  graphCtx.clearRect(
    0,
    0,
    width,
    height
  );


  /* ---------------------------------------------------------
     GRAPH BOUNDARIES
  --------------------------------------------------------- */

  const left =
    48;

  const right =
    width - 18;

  const top =
    28;

  const bottom =
    height - 42;


  const graphWidth =
    right - left;

  const graphHeight =
    bottom - top;


  const centreY =
    top +
    graphHeight / 2;


  /* ---------------------------------------------------------
     BACKGROUND
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
     GRAPH AMPLITUDE SCALE
  --------------------------------------------------------- */

  /*
     ±A occupies 40% of the graph height.

     Therefore:

       amplitude ↑
       → physical y ↑
       → graph vertical displacement ↑

     The displayed graph therefore
     remains physically tied to A.
  */

  const maxGraphAmplitude =
    graphHeight * 0.40;


  const amplitudeScale =
    maxGraphAmplitude /
    state.amplitude;


  /* ---------------------------------------------------------
     TIME WINDOW
  --------------------------------------------------------- */

  /*
     Show EXACTLY two periods.

         T = 1/f

     Therefore:

       frequency ↑
       → T ↓
       → two cycles occupy same width
       → wave becomes horizontally compressed.

       frequency ↓
       → T ↑
       → wave becomes horizontally stretched.
  */

  const visibleTime =
    2 *
    state.period;


  /* ---------------------------------------------------------
     GRID
  --------------------------------------------------------- */

  graphCtx.strokeStyle =
    "#e2e8f0";

  graphCtx.lineWidth =
    1;


  /* Horizontal grid */

  for (
    let i = 0;
    i <= 4;
    i++
  ) {

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

  for (
    let i = 0;
    i <= 8;
    i++
  ) {

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
     X AXIS
  --------------------------------------------------------- */

  graphCtx.beginPath();

  graphCtx.moveTo(
    left,
    centreY
  );

  graphCtx.lineTo(
    right,
    centreY
  );

  graphCtx.strokeStyle =
    "#64748b";

  graphCtx.lineWidth =
    1.5;

  graphCtx.stroke();


  /* ---------------------------------------------------------
     Y AXIS
  --------------------------------------------------------- */

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
     AMPLITUDE LABELS
  --------------------------------------------------------- */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "right";


  graphCtx.fillText(
    `+${formatNumber(
      state.amplitude,
      0
    )}`,
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
    `−${formatNumber(
      state.amplitude,
      0
    )}`,
    left - 7,
    centreY +
      maxGraphAmplitude +
      4
  );


  /* =========================================================
     SINE WAVE

     EXACT EQUATION:

         y = A sin(ωt)

     No separate graph physics is used.
  ========================================================= */

  graphCtx.beginPath();


  const samples =
    800;


  for (
    let i = 0;
    i <= samples;
    i++
  ) {

    /*
       Convert graph position
       into actual physical time.
    */

    const t =
      (
        i /
        samples
      ) *
      visibleTime;


    /*
       Calculate physical displacement.

       SAME EQUATION used everywhere.
    */

    const y =
      state.amplitude *
      Math.sin(
        state.omega *
        t
      );


    /*
       Convert physical y
       into screen position.
    */

    const screenY =
      centreY -
      y *
      amplitudeScale;


    const x =
      left +
      (
        t /
        visibleTime
      ) *
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


  /* ---------------------------------------------------------
     DRAW WAVE
  --------------------------------------------------------- */

  graphCtx.strokeStyle =
    "#2563eb";

  graphCtx.lineWidth =
    3;

  graphCtx.stroke();


  /* =========================================================
     CURRENT TIME MARKER
  ========================================================= */

  /*
     Use exactly the same state.time
     and state.y as the other diagrams.
  */

  const currentTime =
    state.time %
    visibleTime;


  const currentX =
    left +
    (
      currentTime /
      visibleTime
    ) *
    graphWidth;


  const currentY =
    centreY -
    state.y *
    amplitudeScale;


  /* ---------------------------------------------------------
     CURRENT TIME LINE
  --------------------------------------------------------- */

  if (
    state.showGraphPoint
  ) {

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

    graphCtx.lineWidth =
      1.5;

    graphCtx.setLineDash([
      5,
      4
    ]);

    graphCtx.stroke();

    graphCtx.setLineDash([]);


    /* -------------------------------------------------------
       CURRENT POINT
    ------------------------------------------------------- */

    graphCtx.beginPath();

    graphCtx.arc(
      currentX,
      currentY,
      7,
      0,
      TWO_PI
    );

    graphCtx.fillStyle =
      "#dc2626";

    graphCtx.fill();

    graphCtx.strokeStyle =
      "#ffffff";

    graphCtx.lineWidth =
      2;

    graphCtx.stroke();

  }


  /* =========================================================
     PERIOD LABELS
  ========================================================= */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "center";


  /*
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
      (
        t /
        visibleTime
      ) *
      graphWidth;


    graphCtx.fillText(
      `${formatNumber(
        t,
        2
      )} s`,
      x,
      bottom + 18
    );


    /* Tick */

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
      1;

    graphCtx.stroke();

  }


  /* =========================================================
     AXIS TITLES
  ========================================================= */

  graphCtx.fillStyle =
    "#172033";

  graphCtx.font =
    "bold 13px Arial";

  graphCtx.textAlign =
    "center";


  graphCtx.fillText(
    "time, t",
    width / 2,
    height - 8
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


  /* =========================================================
     EQUATION
  ========================================================= */

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


  /* =========================================================
     LIVE PARAMETERS
  ========================================================= */

  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "12px Arial";

  graphCtx.textAlign =
    "right";


  graphCtx.fillText(
    `A = ${formatNumber(
      state.amplitude,
      0
    )}`,
    right,
    top + 14
  );


  graphCtx.fillText(
    `f = ${formatNumber(
      state.frequency,
      2
    )} Hz`,
    right,
    top + 29
  );


  graphCtx.fillText(
    `T = ${formatNumber(
      state.period,
      2
    )} s`,
    right,
    top + 44
  );

}


/* =========================================================
   43. LIGHT GRID
========================================================= */

function drawLightGrid(
  ctx,
  width,
  height
) {

  const spacing =
    25;


  ctx.strokeStyle =
    "#f1f5f9";

  ctx.lineWidth =
    1;


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
   44. DRAW ARROW
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

  const dx =
    x2 - x1;

  const dy =
    y2 - y1;


  const length =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (
    length < 1
  ) {

    return;

  }


  const ux =
    dx /
    length;

  const uy =
    dy /
    length;


  const headLength =
    9;

  const headWidth =
    5;


  /* ---------------------------------------------------------
     MAIN LINE
  --------------------------------------------------------- */

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


  /* ---------------------------------------------------------
     ARROW HEAD
  --------------------------------------------------------- */

  const leftX =
    x2 -
    ux * headLength -
    uy * headWidth;


  const leftY =
    y2 -
    uy * headLength +
    ux * headWidth;


  const rightX =
    x2 -
    ux * headLength +
    uy * headWidth;


  const rightY =
    y2 -
    uy * headLength -
    ux * headWidth;


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
   45. DRAW PHASE ANGLE
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
      radius * 0.28,
      42
    );


  /*
     Mathematical angle:

         θ

     Canvas Y is inverted,
     therefore use -theta.
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

  ctx.lineWidth =
    3;

  ctx.stroke();


  /* ---------------------------------------------------------
     THETA LABEL
  --------------------------------------------------------- */

  const middleAngle =
    -theta / 2;


  const labelRadius =
    arcRadius + 14;


  const labelX =
    cx +
    labelRadius *
    Math.cos(
      middleAngle
    );


  const labelY =
    cy +
    labelRadius *
    Math.sin(
      middleAngle
    );


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
   46. DRAW PHASE MARKERS
========================================================= */

function drawPhaseMarkers() {

  if (
    !circularCanvas ||
    !circularCtx
  ) {

    return;

  }


  const size =
    getCanvasSize(
      circularCanvas
    );


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
      Math.min(
        width,
        height
      ) * 0.34
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


  markers.forEach(
    marker => {

      const x =
        cx +
        radius *
        Math.cos(
          marker.angle
        );


      const y =
        cy -
        radius *
        Math.sin(
          marker.angle
        );


      circularCtx.beginPath();

      circularCtx.arc(
        x,
        y,
        3,
        0,
        TWO_PI
      );

      circularCtx.fillStyle =
        "#64748b";

      circularCtx.fill();


      circularCtx.fillStyle =
        "#64748b";

      circularCtx.textAlign =
        "center";


      let labelX =
        x;

      let labelY =
        y;


      if (
        marker.angle === 0
      ) {

        labelX += 15;
        labelY += 4;

      }


      if (
        marker.angle ===
        Math.PI / 2
      ) {

        labelY -= 8;

      }


      if (
        marker.angle ===
        Math.PI
      ) {

        labelX -= 17;
        labelY += 4;

      }


      if (
        marker.angle ===
        3 * Math.PI / 2
      ) {

        labelY += 15;

      }


      circularCtx.fillText(
        marker.label,
        labelX,
        labelY
      );

    }
  );

}


/* =========================================================
   47. ADD PHASE MARKERS AFTER CIRCLE
========================================================= */

const originalCircularMotion =
  drawCircularMotion;


drawCircularMotion = function () {

  originalCircularMotion();

  drawPhaseMarkers();

};


/* =========================================================
   48. END OF SCRIPT.JS — PART 2
========================================================= */

/* =========================================================
   PHYSICS SIMULATION
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   SCRIPT.JS — PART 3

   TEACHING / INTERACTION / LIVE INFORMATION

   Core relationship:

       θ = ωt

       y = A sin θ

       y = A sin(ωt)

   The Y-component of circular motion is
   the displacement of the SHM.
========================================================= */


/* =========================================================
   49. EXTRA UI REFERENCES
========================================================= */

const equationDisplay =
  document.getElementById(
    "equationDisplay"
  );


const thetaDisplay =
  document.getElementById(
    "thetaDisplay"
  );


const yEquationDisplay =
  document.getElementById(
    "yEquationDisplay"
  );


const motionDescription =
  document.getElementById(
    "motionDescription"
  );


const conceptPanel =
  document.getElementById(
    "conceptPanel"
  );


const conceptToggle =
  document.getElementById(
    "conceptToggle"
  );


const formulaPanel =
  document.getElementById(
    "formulaPanel"
  );


const formulaToggle =
  document.getElementById(
    "formulaToggle"
  );


const amplitudeReadout =
  document.getElementById(
    "amplitudeReadout"
  );


const frequencyReadout =
  document.getElementById(
    "frequencyReadout"
  );


const periodReadout =
  document.getElementById(
    "periodReadout"
  );


const omegaReadout =
  document.getElementById(
    "omegaReadout"
  );


const phaseReadout =
  document.getElementById(
    "phaseReadout"
  );


const displacementReadout =
  document.getElementById(
    "displacementReadout"
  );


/* =========================================================
   50. OPTIONAL ELEMENT HELPER
========================================================= */

function setText(
  element,
  text
) {

  if (!element) {
    return;
  }

  element.textContent =
    text;

}


/* =========================================================
   51. UPDATE EQUATION DISPLAY
========================================================= */

function updateEquationDisplay() {

  /*
     Main equation:

         y = A sin(ωt)
  */

  setText(
    equationDisplay,
    "y = A sin(ωt)"
  );


  /*
     Expanded equation using
     the current angular frequency.
  */

  setText(
    yEquationDisplay,
    `y = ${formatNumber(
      state.amplitude,
      1
    )} sin(${formatNumber(
      state.omega,
      2
    )}t)`
  );


  /*
     Current phase angle.
  */

  setText(
    thetaDisplay,
    `θ = ${formatNumber(
      radiansToDegrees(
        state.displayTheta
      ),
      0
    )}°`
  );

}


/* =========================================================
   52. UPDATE LIVE READOUT
========================================================= */

function updateTeachingReadout() {

  setText(
    amplitudeReadout,
    `A = ${formatNumber(
      state.amplitude,
      1
    )}`
  );


  setText(
    frequencyReadout,
    `f = ${formatNumber(
      state.frequency,
      2
    )} Hz`
  );


  setText(
    periodReadout,
    `T = ${formatNumber(
      state.period,
      2
    )} s`
  );


  setText(
    omegaReadout,
    `ω = ${formatNumber(
      state.omega,
      2
    )} rad/s`
  );


  setText(
    phaseReadout,
    `θ = ${formatNumber(
      radiansToDegrees(
        state.displayTheta
      ),
      0
    )}°`
  );


  setText(
    displacementReadout,
    `y = ${formatNumber(
      state.y,
      1
    )}`
  );

}


/* =========================================================
   53. MOTION DESCRIPTION
========================================================= */

function updateMotionDescription() {

  if (!motionDescription) {
    return;
  }


  const theta =
    normalizeAngle(
      state.displayTheta
    );


  const quarter =
    Math.PI / 2;


  let description = "";


  /* ---------------------------------------------------------
     TOP EXTREME
  --------------------------------------------------------- */

  if (
    theta < 0.08 ||
    Math.abs(
      theta - TWO_PI
    ) < 0.08
  ) {

    description =
      "The particle is at the equilibrium crossing. " +
      "The Y-component is y = 0 and the SHM particle " +
      "moves through equilibrium.";

  }


  /* ---------------------------------------------------------
     90°
  --------------------------------------------------------- */

  else if (
    Math.abs(
      theta - quarter
    ) < 0.08
  ) {

    description =
      "The particle is at maximum positive Y. " +
      "The SHM displacement is +A.";

  }


  /* ---------------------------------------------------------
     180°
  --------------------------------------------------------- */

  else if (
    Math.abs(
      theta - Math.PI
    ) < 0.08
  ) {

    description =
      "The particle is at maximum negative Y. " +
      "The SHM displacement is −A.";

  }


  /* ---------------------------------------------------------
     270°
  --------------------------------------------------------- */

  else if (
    Math.abs(
      theta -
      3 * quarter
    ) < 0.08
  ) {

    description =
      "The particle is at maximum negative Y. " +
      "The SHM displacement is −A.";

  }


  /* ---------------------------------------------------------
     POSITIVE HALF
  --------------------------------------------------------- */

  else if (
    theta > 0 &&
    theta < Math.PI
  ) {

    description =
      "The Y-component is positive. " +
      "The SHM particle is above equilibrium.";

  }


  /* ---------------------------------------------------------
     NEGATIVE HALF
  --------------------------------------------------------- */

  else {

    description =
      "The Y-component is negative. " +
      "The SHM particle is below equilibrium.";

  }


  motionDescription.textContent =
    description;

}


/* =========================================================
   54. DETERMINE MOTION PHASE
========================================================= */

function getMotionPhase() {

  const theta =
    normalizeAngle(
      state.displayTheta
    );


  if (
    theta < Math.PI / 2
  ) {

    return "0° → 90°";

  }


  if (
    theta < Math.PI
  ) {

    return "90° → 180°";

  }


  if (
    theta < 3 * Math.PI / 2
  ) {

    return "180° → 270°";

  }


  return "270° → 360°";

}


/* =========================================================
   55. EXPLAIN Y-COMPONENT
========================================================= */

function getYComponentExplanation() {

  const y =
    state.y;


  const A =
    state.amplitude;


  if (
    Math.abs(y) <
    A * 0.03
  ) {

    return (
      "Y-component = 0. " +
      "The particle is at the SHM equilibrium position."
    );

  }


  if (
    y > 0
  ) {

    return (
      "Y-component is positive. " +
      "Therefore SHM displacement y is positive."
    );

  }


  return (
    "Y-component is negative. " +
    "Therefore SHM displacement y is negative."
  );

}


/* =========================================================
   56. UPDATE CONCEPT EXPLANATION
========================================================= */

function updateConceptExplanation() {

  const element =
    document.getElementById(
      "conceptExplanation"
    );


  if (!element) {
    return;
  }


  element.textContent =
    getYComponentExplanation();

}


/* =========================================================
   57. UPDATE ALL TEACHING INFORMATION
========================================================= */

function updateTeachingDisplays() {

  updateEquationDisplay();

  updateTeachingReadout();

  updateMotionDescription();

  updateConceptExplanation();

}


/* =========================================================
   58. FORMULA PANEL TOGGLE
========================================================= */

if (formulaToggle) {

  formulaToggle.addEventListener(
    "click",
    () => {

      if (!formulaPanel) {
        return;
      }


      const isHidden =
        formulaPanel.classList.contains(
          "hidden"
        );


      if (isHidden) {

        formulaPanel.classList.remove(
          "hidden"
        );


        formulaToggle.setAttribute(
          "aria-expanded",
          "true"
        );

      } else {

        formulaPanel.classList.add(
          "hidden"
        );


        formulaToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );

}


/* =========================================================
   59. CONCEPT PANEL TOGGLE
========================================================= */

if (conceptToggle) {

  conceptToggle.addEventListener(
    "click",
    () => {

      if (!conceptPanel) {
        return;
      }


      const isHidden =
        conceptPanel.classList.contains(
          "hidden"
        );


      if (isHidden) {

        conceptPanel.classList.remove(
          "hidden"
        );


        conceptToggle.setAttribute(
          "aria-expanded",
          "true"
        );

      } else {

        conceptPanel.classList.add(
          "hidden"
        );


        conceptToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );

}


/* =========================================================
   60. KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
       Space:
       Play / Pause
    */

    if (
      event.code === "Space"
    ) {

      /*
         Don't interfere with sliders.
      */

      if (
        event.target &&
        (
          event.target.tagName ===
          "INPUT" ||
          event.target.tagName ===
          "TEXTAREA"
        )
      ) {

        return;

      }


      event.preventDefault();

      togglePlay();

    }


    /*
       R:
       Reset
    */

    if (
      event.key.toLowerCase() ===
      "r"
    ) {

      resetSimulation();

    }

  }
);


/* =========================================================
   61. SLIDER VALUE CHANGE
========================================================= */

if (amplitudeSlider) {

  amplitudeSlider.addEventListener(
    "change",
    () => {

      updatePhysics();

      updateTeachingDisplays();

      drawAll();

    }
  );

}


if (frequencySlider) {

  frequencySlider.addEventListener(
    "change",
    () => {

      updatePhysics();

      updateTeachingDisplays();

      drawAll();

    }
  );

}


/* =========================================================
   62. Y COMPONENT TOGGLE SUPPORT
========================================================= */

function updateYComponentToggle() {

  if (!yComponentToggle) {
    return;
  }


  state.showYComponent =
    yComponentToggle.checked;

}


if (yComponentToggle) {

  yComponentToggle.addEventListener(
    "input",
    () => {

      updateYComponentToggle();

      drawAll();

    }
  );

}


/* =========================================================
   63. UPDATE PLAY BUTTON TEXT
========================================================= */

function updatePlayButton() {

  if (!playButton) {
    return;
  }


  if (state.playing) {

    playButton.textContent =
      "Pause";

    playButton.setAttribute(
      "aria-label",
      "Pause simulation"
    );

  } else {

    playButton.textContent =
      "Play";

    playButton.setAttribute(
      "aria-label",
      "Play simulation"
    );

  }

}


/* =========================================================
   64. UPDATE STATUS DISPLAY
========================================================= */

function updateDetailedStatus() {

  const element =
    document.getElementById(
      "detailedStatus"
    );


  if (!element) {
    return;
  }


  if (state.playing) {

    element.textContent =
      `Running • ${getMotionPhase()}`;

  } else {

    element.textContent =
      `Paused • ${getMotionPhase()}`;

  }

}


/* =========================================================
   65. MASTER TEACHING UPDATE
========================================================= */

function updateTeachingLayer() {

  updateTeachingDisplays();

  updatePlayButton();

  updateDetailedStatus();

}


/* =========================================================
   66. WRAP UPDATE DISPLAYS
========================================================= */

/*
   Part 1 already contains:

       updateDisplays()

   We extend it rather than replacing
   the physics system.
*/

const baseUpdateDisplays =
  updateDisplays;


updateDisplays = function () {

  baseUpdateDisplays();

  updateTeachingLayer();

};


/* =========================================================
   67. ADD PHASE INFORMATION TO CIRCLE
========================================================= */

function drawPhaseInformation() {

  if (
    !circularCanvas ||
    !circularCtx
  ) {

    return;

  }


  const size =
    getCanvasSize(
      circularCanvas
    );


  const width =
    size.width;

  const height =
    size.height;


  /*
     Small information box.
  */

  const boxWidth =
    Math.min(
      170,
      width - 20
    );


  const boxHeight =
    58;


  const x =
    10;


  const y =
    38;


  circularCtx.save();


  circularCtx.fillStyle =
    "rgba(255,255,255,0.90)";


  circularCtx.strokeStyle =
    "#cbd5e1";


  circularCtx.lineWidth =
    1;


  circularCtx.beginPath();

  circularCtx.roundRect(
    x,
    y,
    boxWidth,
    boxHeight,
    8
  );

  circularCtx.fill();

  circularCtx.stroke();


  circularCtx.fillStyle =
    "#475569";

  circularCtx.font =
    "11px Arial";

  circularCtx.textAlign =
    "left";


  circularCtx.fillText(
    `f = ${formatNumber(
      state.frequency,
      2
    )} Hz`,
    x + 10,
    y + 18
  );


  circularCtx.fillText(
    `T = ${formatNumber(
      state.period,
      2
    )} s`,
    x + 10,
    y + 34
  );


  circularCtx.fillText(
    `ω = ${formatNumber(
      state.omega,
      2
    )} rad/s`,
    x + 10,
    y + 50
  );


  circularCtx.restore();

}


/* =========================================================
   68. WRAP CIRCULAR DRAW
========================================================= */

const baseDrawCircularMotion =
  drawCircularMotion;


drawCircularMotion = function () {

  baseDrawCircularMotion();

  drawPhaseInformation();

};


/* =========================================================
   69. SHM INFORMATION BOX
========================================================= */

function drawSHMInformation() {

  if (
    !shmCanvas ||
    !shmCtx
  ) {

    return;

  }


  const size =
    getCanvasSize(
      shmCanvas
    );


  const width =
    size.width;

  const height =
    size.height;


  const boxWidth =
    Math.min(
      185,
      width - 20
    );


  const boxHeight =
    48;


  const x =
    10;


  const y =
    28;


  shmCtx.save();


  shmCtx.fillStyle =
    "rgba(255,255,255,0.90)";


  shmCtx.strokeStyle =
    "#cbd5e1";


  shmCtx.lineWidth =
    1;


  shmCtx.beginPath();

  shmCtx.roundRect(
    x,
    y,
    boxWidth,
    boxHeight,
    8
  );

  shmCtx.fill();

  shmCtx.stroke();


  shmCtx.fillStyle =
    "#475569";

  shmCtx.font =
    "11px Arial";

  shmCtx.textAlign =
    "left";


  shmCtx.fillText(
    `Y = ${formatNumber(
      state.y,
      1
    )}`,
    x + 10,
    y + 18
  );


  shmCtx.fillText(
    `Phase = ${formatNumber(
      radiansToDegrees(
        state.displayTheta
      ),
      0
    )}°`,
    x + 10,
    y + 35
  );


  shmCtx.restore();

}


/* =========================================================
   70. WRAP SHM DRAW
========================================================= */

const baseDrawSHM =
  drawSHM;


drawSHM = function () {

  baseDrawSHM();

  drawSHMInformation();

};


/* =========================================================
   71. GRAPH INFORMATION BOX
========================================================= */

function drawGraphInformation() {

  if (
    !graphCanvas ||
    !graphCtx
  ) {

    return;

  }


  const size =
    getCanvasSize(
      graphCanvas
    );


  const width =
    size.width;

  const height =
    size.height;


  graphCtx.save();


  graphCtx.fillStyle =
    "rgba(255,255,255,0.90)";


  graphCtx.strokeStyle =
    "#cbd5e1";


  graphCtx.lineWidth =
    1;


  const boxWidth =
    Math.min(
      180,
      width - 20
    );


  const boxHeight =
    46;


  const x =
    10;


  const y =
    46;


  graphCtx.beginPath();

  graphCtx.roundRect(
    x,
    y,
    boxWidth,
    boxHeight,
    8
  );

  graphCtx.fill();

  graphCtx.stroke();


  graphCtx.fillStyle =
    "#475569";

  graphCtx.font =
    "11px Arial";

  graphCtx.textAlign =
    "left";


  graphCtx.fillText(
    `Current y = ${formatNumber(
      state.y,
      1
    )}`,
    x + 10,
    y + 18
  );


  graphCtx.fillText(
    `t = ${formatNumber(
      state.time,
      2
    )} s`,
    x + 10,
    y + 35
  );


  graphCtx.restore();

}


/* =========================================================
   72. WRAP GRAPH DRAW
========================================================= */

const baseDrawGraph =
  drawGraph;


drawGraph = function () {

  baseDrawGraph();

  drawGraphInformation();

};


/* =========================================================
   73. INITIAL TEACHING UPDATE
========================================================= */

updateTeachingLayer();


/* =========================================================
   74. END OF SCRIPT.JS — PART 3
========================================================= */

/* =========================================================
   PHYSICS SIMULATION
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   SCRIPT.JS — PART 4 / FINAL

   FINAL SYNCHRONIZATION + INITIALIZATION

   Main physics:

       θ = ωt
       ω = 2πf
       y = A sin(ωt)

   The Y-component is the SHM displacement.
========================================================= */


/* =========================================================
   75. FINAL SYNCHRONIZATION FUNCTION
========================================================= */

function synchronizeSimulation() {

  /*
     Update physical parameters first.
  */

  updatePhysicsParameters();


  /*
     Calculate the SAME Y-component used
     by all three visualizations.
  */

  calculateSHM();


  /*
     Update all numerical displays.
  */

  updateDisplays();


  /*
     Redraw all visualizations immediately.

     This is important when a slider changes.
  */

  drawAll();

}


/* =========================================================
   76. FINAL AMPLITUDE SLIDER HANDLER
========================================================= */

if (amplitudeSlider) {

  amplitudeSlider.addEventListener(
    "input",
    () => {

      /*
         Read new amplitude immediately.
      */

      state.amplitude =
        Math.max(
          0.001,
          parseFloat(
            amplitudeSlider.value
          ) || state.amplitude
        );


      /*
         Recalculate SHM.

         New amplitude changes:

             radius
             y
             velocity
             acceleration
             graph height
      */

      calculateSHM();


      updateDisplays();

      drawAll();

    }
  );

}


/* =========================================================
   77. FINAL FREQUENCY SLIDER HANDLER
========================================================= */

if (frequencySlider) {

  frequencySlider.addEventListener(
    "input",
    () => {

      /*
         Read new frequency.
      */

      state.frequency =
        Math.max(
          0.001,
          parseFloat(
            frequencySlider.value
          ) || state.frequency
        );


      /*
         Recalculate:

             ω = 2πf

             T = 1/f
      */

      state.omega =
        TWO_PI *
        state.frequency;


      state.period =
        1 /
        state.frequency;


      /*
         Recalculate SHM immediately.

         This changes the SHAPE of the graph,
         not merely the displayed value.
      */

      calculateSHM();


      updateDisplays();

      drawAll();

    }
  );

}


/* =========================================================
   78. FINAL RESET FUNCTION
========================================================= */

function finalReset() {

  pauseSimulation();


  /*
     Return time to zero.
  */

  state.time =
    0;


  state.theta =
    0;


  state.displayTheta =
    0;


  /*
     Re-read slider values.

     This means Reset returns the animation
     to the START of the currently selected
     amplitude and frequency.
  */

  updatePhysicsParameters();


  calculateSHM();


  updateDisplays();

  drawAll();

}


/* =========================================================
   79. RESET BUTTON
========================================================= */

if (resetButton) {

  resetButton.addEventListener(
    "click",
    finalReset
  );

}


/* =========================================================
   80. FINAL PLAY / PAUSE UPDATE
========================================================= */

function finalPlayPauseUpdate() {

  updatePlayButton();

  updateDetailedStatus();

}


/* =========================================================
   81. FINAL ANIMATION SYNCHRONIZATION
========================================================= */

function synchronizedAnimationLoop(
  timestamp
) {

  if (!state.playing) {

    return;

  }


  if (
    state.lastTimestamp === null
  ) {

    state.lastTimestamp =
      timestamp;

  }


  /*
     Calculate elapsed time.
  */

  let dt =
    (
      timestamp -
      state.lastTimestamp
    ) / 1000;


  state.lastTimestamp =
    timestamp;


  /*
     Prevent large jumps after
     browser lag or tab switching.
  */

  dt =
    Math.min(
      dt,
      0.05
    );


  /*
     Advance time.

     Frequency does NOT change time.

     Frequency changes ω, which changes
     the phase:

         θ = ωt
  */

  state.time +=
    dt;


  /*
     Calculate everything from
     the same physical state.
  */

  calculateSHM();


  /*
     Update numerical information.
  */

  updateDisplays();


  /*
     Redraw:

       Circular motion
       ↓
       Y-component
       ↓
       SHM
       ↓
       sine graph
  */

  drawAll();


  /*
     Continue animation.
  */

  state.animationId =
    requestAnimationFrame(
      synchronizedAnimationLoop
    );

}


/* =========================================================
   82. REPLACE ANIMATION START
========================================================= */

function startSynchronizedAnimation() {

  if (state.playing) {

    return;

  }


  state.playing =
    true;


  state.lastTimestamp =
    null;


  finalPlayPauseUpdate();


  state.animationId =
    requestAnimationFrame(
      synchronizedAnimationLoop
    );

}


/* =========================================================
   83. REPLACE PLAY FUNCTION
========================================================= */

function finalPlaySimulation() {

  startSynchronizedAnimation();

}


/* =========================================================
   84. REPLACE PAUSE FUNCTION
========================================================= */

function finalPauseSimulation() {

  state.playing =
    false;


  state.lastTimestamp =
    null;


  if (
    state.animationId !== null
  ) {

    cancelAnimationFrame(
      state.animationId
    );

  }


  state.animationId =
    null;


  finalPlayPauseUpdate();

}


/* =========================================================
   85. FINAL PLAY BUTTON HANDLER
========================================================= */

if (playButton) {

  playButton.onclick =
    () => {

      if (state.playing) {

        finalPauseSimulation();

      } else {

        finalPlaySimulation();

      }

    };

}


/* =========================================================
   86. FINAL WINDOW RESIZE
========================================================= */

let finalResizeTimer =
  null;


window.addEventListener(
  "resize",
  () => {

    clearTimeout(
      finalResizeTimer
    );


    finalResizeTimer =
      setTimeout(
        () => {

          resizeAllCanvases();

          synchronizeSimulation();

        },
        120
      );

  }
);


/* =========================================================
   87. HANDLE DEVICE PIXEL RATIO CHANGE
========================================================= */

window.addEventListener(
  "orientationchange",
  () => {

    setTimeout(
      () => {

        resizeAllCanvases();

        synchronizeSimulation();

      },
      200
    );

  }
);


/* =========================================================
   88. PREVENT ANIMATION JUMP
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      /*
         Don't allow a long hidden-tab interval
         to create a huge time jump.
      */

      state.lastTimestamp =
        null;

    } else if (
      state.playing
    ) {

      state.lastTimestamp =
        performance.now();

    }

  }
);


/* =========================================================
   89. FINAL KEYBOARD CONTROL
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
       Ignore keyboard shortcuts when
       editing a control.
    */

    if (
      event.target &&
      (
        event.target.tagName ===
        "INPUT" ||

        event.target.tagName ===
        "TEXTAREA" ||

        event.target.tagName ===
        "SELECT"
      )
    ) {

      return;

    }


    /*
       SPACE = PLAY / PAUSE
    */

    if (
      event.code ===
      "Space"
    ) {

      event.preventDefault();


      if (state.playing) {

        finalPauseSimulation();

      } else {

        finalPlaySimulation();

      }

    }


    /*
       R = RESET
    */

    if (
      event.key.toLowerCase() ===
      "r"
    ) {

      finalReset();

    }

  }
);


/* =========================================================
   90. INITIALIZE FROM SLIDERS
========================================================= */

function initializeSimulation() {

  /*
     Read amplitude and frequency.
  */

  updatePhysicsParameters();


  /*
     Start at t = 0.
  */

  state.time =
    0;


  state.theta =
    0;


  state.displayTheta =
    0;


  /*
     Calculate initial SHM state.
  */

  calculateSHM();


  /*
     Synchronize toggle state.
  */

  if (yComponentToggle) {

    state.showYComponent =
      yComponentToggle.checked;

  }


  /*
     Resize canvases.
  */

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


  /*
     Update displays.
  */

  updateDisplays();


  /*
     Draw everything.
  */

  drawAll();

}


/* =========================================================
   91. INITIALIZE AFTER DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeSimulation
  );

} else {

  initializeSimulation();

}


/* =========================================================
   92. FINAL DEBUG INFORMATION
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

    displacement:
      state.y,

    velocity:
      state.velocity,

    acceleration:
      state.acceleration

  };

}


/* =========================================================
   93. OPTIONAL GLOBAL DEBUG ACCESS
========================================================= */

window.physicsSimulation =
  {

    state,

    getSimulationState,

    play:
      finalPlaySimulation,

    pause:
      finalPauseSimulation,

    reset:
      finalReset

  };


/* =========================================================
   94. FINAL PHYSICS CHECK
========================================================= */

function verifyPhysics() {

  const expectedOmega =
    TWO_PI *
    state.frequency;


  const expectedPeriod =
    1 /
    state.frequency;


  const expectedY =
    state.amplitude *
    Math.sin(
      state.omega *
      state.time
    );


  const omegaCorrect =
    Math.abs(
      state.omega -
      expectedOmega
    ) < 0.000001;


  const periodCorrect =
    Math.abs(
      state.period -
      expectedPeriod
    ) < 0.000001;


  const displacementCorrect =
    Math.abs(
      state.y -
      expectedY
    ) < 0.000001;


  return {

    omegaCorrect,

    periodCorrect,

    displacementCorrect,

    allCorrect:
      omegaCorrect &&
      periodCorrect &&
      displacementCorrect

  };

}


/* =========================================================
   95. FINAL CONSOLE MESSAGE
========================================================= */

console.log(
  "Circular Motion → SHM simulation loaded."
);


console.log(
  "SHM equation: y = A sin(ωt)"
);


console.log(
  "SHM displacement uses the Y-component."
);


/* =========================================================
   END OF SCRIPT.JS — PART 4 / FINAL
========================================================= */