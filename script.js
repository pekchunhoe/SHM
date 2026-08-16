/* =========================================================
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   FINAL SCRIPT.JS
   PART 1 — STATE, CONSTANTS, CONTROLS, PHYSICS

   Main equation:

       y = A sin(ωt)

   where:

       A = amplitude
       ω = angular frequency
       t = time

       ω = 2πf
       T = 1/f

   IMPORTANT:
   SHM uses the Y-COMPONENT of circular motion.

       x = A cos(ωt)     → position on circle only

       y = A sin(ωt)     → SHM displacement
========================================================= */


/* =========================================================
   1. GLOBAL CONSTANTS
========================================================= */

const TWO_PI = 2 * Math.PI;


/*
   Number of complete periods displayed on the
   sinusoidal graph.

   The graph will ALWAYS contain a complete number
   of oscillations.

   Example:

       1 → one complete period
       2 → two complete periods
       3 → three complete periods
       4 → four complete periods
*/

const GRAPH_PERIODS = 2;


/*
   Same grid spacing used by both:

       Circular Motion
       SHM

   This makes the two panels visually aligned.
*/

const GRID_SIZE = 25;


/* =========================================================
   2. SIMULATION STATE
========================================================= */

const state = {

    /*
       Physical parameters
    */

    amplitude: 100,

    frequency: 0.5,

    omega:
        TWO_PI * 0.5,

    period:
        1 / 0.5,


    /*
       Time
    */

    time: 0,


    /*
       Angular position

           θ = ωt
    */

    theta: 0,


    /*
       SHM quantities
    */

    y: 0,

    velocity: 0,

    acceleration: 0,


    /*
       Animation
    */

    playing: false,

    animationId: null,

    lastTimestamp: null,


    /*
       Display options
    */

    showYComponent: true

};


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
   6. DISPLAY REFERENCES
========================================================= */

const amplitudeValue =
    document.getElementById(
        "amplitudeValue"
    );

const frequencyValue =
    document.getElementById(
        "frequencyValue"
    );

const valueAmplitude =
    document.getElementById(
        "valueAmplitude"
    );

const valueFrequency =
    document.getElementById(
        "valueFrequency"
    );

const valueOmega =
    document.getElementById(
        "valueOmega"
    );

const valuePeriod =
    document.getElementById(
        "valuePeriod"
    );

const valueTheta =
    document.getElementById(
        "valueTheta"
    );

const valueY =
    document.getElementById(
        "valueY"
    );

const simulationStatus =
    document.getElementById(
        "simulationStatus"
    );


/* =========================================================
   7. PANEL REFERENCES
========================================================= */

const formulaToggle =
    document.getElementById(
        "formulaToggle"
    );

const formulaContent =
    document.getElementById(
        "formulaContent"
    );

const formulaArrow =
    document.getElementById(
        "formulaArrow"
    );

const conceptToggle =
    document.getElementById(
        "conceptToggle"
    );

const conceptContent =
    document.getElementById(
        "conceptContent"
    );

const conceptArrow =
    document.getElementById(
        "conceptArrow"
    );


/* =========================================================
   8. NUMBER FORMATTER
========================================================= */

function formatNumber(
    value,
    decimals = 2
) {

    if (
        !Number.isFinite(value)
    ) {

        return "0";

    }


    return Number(value)
        .toFixed(decimals);

}


/* =========================================================
   9. NORMALIZE ANGLE
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
   10. READ CONTROLS
========================================================= */

function readControls() {

    /*
       Amplitude
    */

    if (amplitudeSlider) {

        const A =
            parseFloat(
                amplitudeSlider.value
            );


        if (
            Number.isFinite(A)
        ) {

            state.amplitude =
                Math.max(
                    0.001,
                    A
                );

        }

    }


    /*
       Frequency
    */

    if (frequencySlider) {

        const f =
            parseFloat(
                frequencySlider.value
            );


        if (
            Number.isFinite(f)
        ) {

            state.frequency =
                Math.max(
                    0.001,
                    f
                );

        }

    }


    /*
       Angular frequency

           ω = 2πf
    */

    state.omega =
        TWO_PI *
        state.frequency;


    /*
       Period

           T = 1/f
    */

    state.period =
        1 /
        state.frequency;

}


/* =========================================================
   11. CALCULATE SHM
========================================================= */

function calculateSHM() {

    /*
       Angular position:

           θ = ωt
    */

    state.theta =
        state.omega *
        state.time;


    /*
       SHM displacement:

           y = A sin(ωt)

       THIS IS THE Y-COMPONENT.

       Do NOT replace this with cos().
    */

    state.y =
        state.amplitude *
        Math.sin(
            state.theta
        );


    /*
       SHM velocity:

           v = Aω cos(ωt)
    */

    state.velocity =
        state.amplitude *
        state.omega *
        Math.cos(
            state.theta
        );


    /*
       SHM acceleration:

           a = -ω²y
    */

    state.acceleration =
        -state.omega *
        state.omega *
        state.y;

}


/* =========================================================
   12. UPDATE NUMERICAL DISPLAYS
========================================================= */

function updateDisplays() {

    const degrees =
        normalizeAngle(
            state.theta
        ) *
        180 /
        Math.PI;


    /* -----------------------------------------
       Main controls
    ----------------------------------------- */

    if (amplitudeValue) {

        amplitudeValue.textContent =
            `${formatNumber(
                state.amplitude,
                0
            )} px`;

    }


    if (frequencyValue) {

        frequencyValue.textContent =
            `${formatNumber(
                state.frequency,
                2
            )} Hz`;

    }


    /* -----------------------------------------
       Physics values
    ----------------------------------------- */

    if (valueAmplitude) {

        valueAmplitude.textContent =
            `${formatNumber(
                state.amplitude,
                0
            )} px`;

    }


    if (valueFrequency) {

        valueFrequency.textContent =
            `${formatNumber(
                state.frequency,
                2
            )} Hz`;

    }


    if (valueOmega) {

        valueOmega.textContent =
            `${formatNumber(
                state.omega,
                2
            )} rad/s`;

    }


    if (valuePeriod) {

        valuePeriod.textContent =
            `${formatNumber(
                state.period,
                2
            )} s`;

    }


    if (valueTheta) {

        valueTheta.textContent =
            `${formatNumber(
                degrees,
                0
            )}°`;

    }


    if (valueY) {

        valueY.textContent =
            `${formatNumber(
                state.y,
                1
            )} px`;

    }


    /* -----------------------------------------
       Additional displays
    ----------------------------------------- */

    const amplitudeDisplay =
        document.getElementById(
            "amplitudeDisplay"
        );

    const angleDisplay =
        document.getElementById(
            "angleDisplay"
        );

    const yDisplay =
        document.getElementById(
            "yDisplay"
        );


    if (amplitudeDisplay) {

        amplitudeDisplay.textContent =
            `${formatNumber(
                state.amplitude,
                0
            )} px`;

    }


    if (angleDisplay) {

        angleDisplay.textContent =
            `${formatNumber(
                degrees,
                0
            )}°`;

    }


    if (yDisplay) {

        yDisplay.textContent =
            `${formatNumber(
                state.y,
                1
            )} px`;

    }


    /* -----------------------------------------
       Status
    ----------------------------------------- */

    if (simulationStatus) {

        simulationStatus.textContent =
            state.playing
                ? "Running"
                : "Paused";

    }


    /* -----------------------------------------
       Play button
    ----------------------------------------- */

    if (playButton) {

        playButton.textContent =
            state.playing
                ? "⏸ Pause"
                : "▶ Play";

    }

}


/* =========================================================
   13. RESIZE CANVAS
========================================================= */

function resizeCanvas(
    canvas,
    ctx
) {

    if (
        !canvas ||
        !ctx
    ) {

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
                rect.width *
                dpr
            )
        );


    const height =
        Math.max(
            1,
            Math.round(
                rect.height *
                dpr
            )
        );


    canvas.width =
        width;

    canvas.height =
        height;


    /*
       Draw using CSS-pixel coordinates.
    */

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
   14. RESIZE ALL CANVASES
========================================================= */

function resizeAll() {

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
   15. SHARED AMPLITUDE SCALE
========================================================= */

/*
   This function is extremely important.

   Both the Circular Motion panel and SHM panel
   use EXACTLY the same amplitude scale.

   Therefore:

       Circular +A
           =
       SHM +A

       Circular 0
           =
       SHM 0

       Circular -A
           =
       SHM -A
*/

function getAmplitudePixels() {

    /*
       Use the circular canvas as the reference
       because it determines the physical circle size.
    */

    if (
        !circularCanvas
    ) {

        return 100;

    }


    const width =
        circularCanvas.clientWidth;

    const height =
        circularCanvas.clientHeight;


    const circularSize =
        Math.min(
            width,
            height
        );


    /*
       Maximum circle radius.
    */

    const maximumRadius =
        circularSize *
        0.36;


    /*
       Maximum slider value.
    */

    const sliderMax =
        amplitudeSlider
            ? parseFloat(
                amplitudeSlider.max
            ) || 150
            : 150;


    /*
       Physical amplitude → pixels.
    */

    return (
        maximumRadius *
        state.amplitude /
        sliderMax
    );

}


/* =========================================================
   16. DRAW ARROW
========================================================= */

function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color = "#16a34a",
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
        dx / length;

    const uy =
        dy / length;


    const head =
        9;


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


    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );

    ctx.lineTo(
        x2 -
        ux * head -
        uy * 5,

        y2 -
        uy * head +
        ux * 5
    );

    ctx.lineTo(
        x2 -
        ux * head +
        uy * 5,

        y2 -
        uy * head -
        ux * 5
    );

    ctx.closePath();

    ctx.fillStyle =
        color;

    ctx.fill();

}


/* =========================================================
   END OF PART 1
========================================================= */

/* =========================================================
   CIRCULAR MOTION → SHM
   PART 2 — CIRCULAR MOTION DRAWING
========================================================= */


/* =========================================================
   17. DRAW GRID
========================================================= */

function drawGrid(
    ctx,
    width,
    height,
    centerX,
    centerY
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Grid
    */

    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth =
        1;


    /*
       Vertical grid lines
    */

    for (
        let x = centerX % GRID_SIZE;
        x <= width;
        x += GRID_SIZE
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


    /*
       Horizontal grid lines
    */

    for (
        let y = centerY % GRID_SIZE;
        y <= height;
        y += GRID_SIZE
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


    /*
       Negative-side grid lines
    */

    for (
        let x =
            centerX -
            GRID_SIZE;
        x >= 0;
        x -= GRID_SIZE
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
        let y =
            centerY -
            GRID_SIZE;
        y >= 0;
        y -= GRID_SIZE
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


    ctx.restore();

}


/* =========================================================
   18. DRAW AXES
========================================================= */

function drawAxes(
    ctx,
    width,
    height,
    centerX,
    centerY
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Horizontal axis
    */

    ctx.beginPath();

    ctx.moveTo(
        0,
        centerY
    );

    ctx.lineTo(
        width,
        centerY
    );

    ctx.strokeStyle =
        "#64748b";

    ctx.lineWidth =
        1.5;

    ctx.stroke();


    /*
       Vertical axis
    */

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        0
    );

    ctx.lineTo(
        centerX,
        height
    );

    ctx.stroke();


    /*
       X-axis arrow
    */

    ctx.beginPath();

    ctx.moveTo(
        width - 10,
        centerY
    );

    ctx.lineTo(
        width - 20,
        centerY - 5
    );

    ctx.lineTo(
        width - 20,
        centerY + 5
    );

    ctx.closePath();

    ctx.fillStyle =
        "#64748b";

    ctx.fill();


    /*
       Y-axis arrow
    */

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        10
    );

    ctx.lineTo(
        centerX - 5,
        20
    );

    ctx.lineTo(
        centerX + 5,
        20
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   19. DRAW GRID LABELS
========================================================= */

function drawGridLabels(
    ctx,
    width,
    height,
    centerX,
    centerY,
    radius
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "12px Arial";


    /*
       +A
    */

    ctx.textAlign =
        "left";

    ctx.fillText(
        "+A",
        centerX + 8,
        centerY - radius - 6
    );


    /*
       -A
    */

    ctx.fillText(
        "−A",
        centerX + 8,
        centerY + radius + 15
    );


    /*
       0
    */

    ctx.fillText(
        "0",
        centerX + 8,
        centerY - 7
    );


    /*
       Y label
    */

    ctx.fillStyle =
        "#475569";

    ctx.font =
        "bold 13px Arial";

    ctx.fillText(
        "Y",
        centerX + 8,
        20
    );


    ctx.restore();

}


/* =========================================================
   20. DRAW CIRCULAR PATH
========================================================= */

function drawCircularPath(
    ctx,
    centerX,
    centerY,
    radius
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        TWO_PI
    );


    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth =
        2;

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   21. DRAW Y COMPONENT LINE
========================================================= */

function drawYComponent(
    ctx,
    centerX,
    centerY,
    particleX,
    particleY
) {

    if (!ctx) {
        return;
    }


    if (
        !state.showYComponent
    ) {

        return;

    }


    ctx.save();


    /*
       Vertical projection from
       circular particle to X-axis.
    */

    ctx.beginPath();

    ctx.moveTo(
        particleX,
        particleY
    );

    ctx.lineTo(
        particleX,
        centerY
    );


    ctx.strokeStyle =
        "#16a34a";

    ctx.lineWidth =
        3;

    ctx.setLineDash([
        6,
        5
    ]);

    ctx.stroke();


    ctx.setLineDash([]);


    /*
       Horizontal guide from the
       circular particle toward the
       vertical SHM reference.

       This makes the Y-component
       visually obvious.
    */

    ctx.beginPath();

    ctx.moveTo(
        particleX,
        particleY
    );

    ctx.lineTo(
        centerX,
        particleY
    );


    ctx.strokeStyle =
        "#16a34a";

    ctx.lineWidth =
        2;

    ctx.setLineDash([
        4,
        4
    ]);

    ctx.stroke();


    ctx.setLineDash([]);


    ctx.restore();

}


/* =========================================================
   22. DRAW CIRCULAR PARTICLE
========================================================= */

function drawCircularParticle(
    ctx,
    x,
    y
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Outer glow
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        15,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "rgba(37, 99, 235, 0.15)";

    ctx.fill();


    /*
       Main particle
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        9,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#2563eb";

    ctx.fill();


    /*
       White outline
    */

    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth =
        2.5;

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   23. DRAW CENTRE POINT
========================================================= */

function drawCentrePoint(
    ctx,
    x,
    y
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        5,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#334155";

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   24. DRAW ANGLE ARC
========================================================= */

function drawAngleArc(
    ctx,
    centerX,
    centerY,
    radius,
    angle
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Canvas angle is clockwise because
       the Y-axis points downward.

       We use:

           x = A cos θ
           y = A sin θ

       for the physical coordinates,
       then convert Y to canvas coordinates.
    */

    const canvasAngle =
        -angle;


    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius * 0.28,
        0,
        canvasAngle,
        canvasAngle < 0
    );


    ctx.strokeStyle =
        "#f59e0b";

    ctx.lineWidth =
        3;

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   25. DRAW CIRCULAR MOTION
========================================================= */

function drawCircularMotion() {

    if (
        !circularCanvas ||
        !circularCtx
    ) {

        return;

    }


    const width =
        circularCanvas.clientWidth;

    const height =
        circularCanvas.clientHeight;


    /*
       Clear
    */

    circularCtx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
       Background
    */

    circularCtx.fillStyle =
        "#ffffff";

    circularCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
       Centre

       Slightly lower than exact
       centre so the title has space.
    */

    const centerX =
        width / 2;

    const centerY =
        height / 2 +
        8;


    /*
       SAME amplitude scale used by SHM
    */

    const radius =
        getAmplitudePixels();


    /*
       Grid
    */

    drawGrid(
        circularCtx,
        width,
        height,
        centerX,
        centerY
    );


    /*
       Axes
    */

    drawAxes(
        circularCtx,
        width,
        height,
        centerX,
        centerY
    );


    /*
       Circular path
    */

    drawCircularPath(
        circularCtx,
        centerX,
        centerY,
        radius
    );


    /*
       Physical coordinates:

           x = A cos θ
           y = A sin θ
    */

    const physicalX =
        radius *
        Math.cos(
            state.theta
        );


    const physicalY =
        radius *
        Math.sin(
            state.theta
        );


    /*
       Canvas coordinates:

       positive mathematical Y
       points upward.

       Therefore canvas Y is:

           centerY - physicalY
    */

    const particleX =
        centerX +
        physicalX;


    const particleY =
        centerY -
        physicalY;


    /*
       Y-component projection
    */

    drawYComponent(
        circularCtx,
        centerX,
        centerY,
        particleX,
        particleY
    );


    /*
       Centre point
    */

    drawCentrePoint(
        circularCtx,
        centerX,
        centerY
    );


    /*
       Angle arc
    */

    drawAngleArc(
        circularCtx,
        centerX,
        centerY,
        radius,
        state.theta
    );


    /*
       Circular particle
    */

    drawCircularParticle(
        circularCtx,
        particleX,
        particleY
    );


    /* =====================================================
       TITLE
    ===================================================== */

    circularCtx.save();


    circularCtx.fillStyle =
        "#172033";

    circularCtx.font =
        "bold 16px Arial";

    circularCtx.textAlign =
        "center";

    circularCtx.fillText(
        "Circular Motion",
        centerX,
        22
    );


    /* =====================================================
       EQUATION
    ===================================================== */

    circularCtx.fillStyle =
        "#2563eb";

    circularCtx.font =
        "bold 14px Arial";

    circularCtx.fillText(
        "y = A sin(ωt)",
        centerX,
        height - 12
    );


    /* =====================================================
       Y-COMPONENT LABEL
    ===================================================== */

    if (
        state.showYComponent
    ) {

        circularCtx.fillStyle =
            "#16a34a";

        circularCtx.font =
            "bold 13px Arial";

        circularCtx.textAlign =
            "left";

        circularCtx.fillText(
            "Y-component",
            12,
            42
        );

    }


    circularCtx.restore();


    /*
       Grid labels
    */

    drawGridLabels(
        circularCtx,
        width,
        height,
        centerX,
        centerY,
        radius
    );

}


/* =========================================================
   26. DRAW Y DISPLACEMENT INDICATOR
========================================================= */

function drawYDisplacementIndicator(
    ctx,
    centerX,
    centerY,
    particleY
) {

    if (!ctx) {
        return;
    }


    if (
        !state.showYComponent
    ) {

        return;

    }


    /*
       Don't draw tiny arrow.
    */

    if (
        Math.abs(
            particleY -
            centerY
        ) < 2
    ) {

        return;

    }


    const arrowX =
        centerX -
        35;


    drawArrow(
        ctx,

        arrowX,
        centerY,

        arrowX,
        particleY,

        "#16a34a",
        3
    );


    ctx.save();


    ctx.fillStyle =
        "#16a34a";

    ctx.font =
        "bold 13px Arial";

    ctx.textAlign =
        "right";


    ctx.fillText(
        "y",
        arrowX - 8,
        (
            centerY +
            particleY
        ) / 2
    );


    ctx.restore();

}


/* =========================================================
   27. END PART 2
========================================================= */

/* =========================================================
   CIRCULAR MOTION → SHM
   PART 3 — SHM PANEL + SINUSOIDAL GRAPH
========================================================= */


/* =========================================================
   28. DRAW SHM GRID
========================================================= */

function drawSHMGrid(
    ctx,
    width,
    height,
    centerX,
    centerY
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth =
        1;


    /*
       Vertical grid lines
    */

    for (
        let x = centerX;
        x <= width;
        x += GRID_SIZE
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
        let x =
            centerX -
            GRID_SIZE;
        x >= 0;
        x -= GRID_SIZE
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


    /*
       Horizontal grid lines
    */

    for (
        let y = centerY;
        y <= height;
        y += GRID_SIZE
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


    for (
        let y =
            centerY -
            GRID_SIZE;
        y >= 0;
        y -= GRID_SIZE
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


    ctx.restore();

}


/* =========================================================
   29. DRAW SHM AXES
========================================================= */

function drawSHMAxes(
    ctx,
    width,
    height,
    centerX,
    centerY
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Equilibrium axis y = 0
    */

    ctx.beginPath();

    ctx.moveTo(
        0,
        centerY
    );

    ctx.lineTo(
        width,
        centerY
    );

    ctx.strokeStyle =
        "#64748b";

    ctx.lineWidth =
        1.5;

    ctx.stroke();


    /*
       Vertical reference axis
    */

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        0
    );

    ctx.lineTo(
        centerX,
        height
    );

    ctx.stroke();


    /*
       Y-axis arrow
    */

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        8
    );

    ctx.lineTo(
        centerX - 5,
        18
    );

    ctx.lineTo(
        centerX + 5,
        18
    );

    ctx.closePath();

    ctx.fillStyle =
        "#64748b";

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   30. DRAW SHM AMPLITUDE MARKERS
========================================================= */

function drawSHMAmplitudeMarkers(
    ctx,
    centerX,
    centerY,
    amplitudePixels
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       +A marker
    */

    const topY =
        centerY -
        amplitudePixels;


    ctx.beginPath();

    ctx.moveTo(
        centerX - 12,
        topY
    );

    ctx.lineTo(
        centerX + 12,
        topY
    );

    ctx.strokeStyle =
        "#dc2626";

    ctx.lineWidth =
        3;

    ctx.stroke();


    /*
       -A marker
    */

    const bottomY =
        centerY +
        amplitudePixels;


    ctx.beginPath();

    ctx.moveTo(
        centerX - 12,
        bottomY
    );

    ctx.lineTo(
        centerX + 12,
        bottomY
    );

    ctx.stroke();


    /*
       Labels
    */

    ctx.fillStyle =
        "#dc2626";

    ctx.font =
        "bold 13px Arial";

    ctx.textAlign =
        "left";


    ctx.fillText(
        "+A",
        centerX + 18,
        topY + 5
    );


    ctx.fillText(
        "−A",
        centerX + 18,
        bottomY + 5
    );


    /*
       y = 0
    */

    ctx.fillStyle =
        "#475569";

    ctx.fillText(
        "y = 0",
        centerX + 18,
        centerY + 5
    );


    ctx.restore();

}


/* =========================================================
   31. DRAW SHM PARTICLE
========================================================= */

function drawSHMParticle(
    ctx,
    centerX,
    particleY
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Vertical reference line
    */

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        0
    );

    ctx.lineTo(
        centerX,
        ctx.canvas.clientHeight
    );

    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth =
        3;

    ctx.stroke();


    /*
       Particle glow
    */

    ctx.beginPath();

    ctx.arc(
        centerX,
        particleY,
        16,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "rgba(22, 163, 74, 0.15)";

    ctx.fill();


    /*
       Particle
    */

    ctx.beginPath();

    ctx.arc(
        centerX,
        particleY,
        10,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#16a34a";

    ctx.fill();


    /*
       Outline
    */

    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth =
        3;

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   32. DRAW SHM DISPLACEMENT ARROW
========================================================= */

function drawSHMDisplacement(
    ctx,
    centerX,
    centerY,
    particleY
) {

    if (!ctx) {
        return;
    }


    if (
        !state.showYComponent
    ) {

        return;

    }


    if (
        Math.abs(
            particleY -
            centerY
        ) < 2
    ) {

        return;

    }


    const arrowX =
        centerX -
        35;


    drawArrow(
        ctx,

        arrowX,
        centerY,

        arrowX,
        particleY,

        "#16a34a",
        4
    );


    ctx.save();


    ctx.fillStyle =
        "#16a34a";

    ctx.font =
        "bold 14px Arial";

    ctx.textAlign =
        "right";


    ctx.fillText(
        "y",
        arrowX - 8,
        (
            centerY +
            particleY
        ) / 2
    );


    ctx.restore();

}


/* =========================================================
   33. DRAW SHM PANEL
========================================================= */

function drawSHM() {

    if (
        !shmCanvas ||
        !shmCtx
    ) {

        return;

    }


    const width =
        shmCanvas.clientWidth;

    const height =
        shmCanvas.clientHeight;


    /*
       Clear
    */

    shmCtx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
       Background
    */

    shmCtx.fillStyle =
        "#ffffff";

    shmCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
       Centre

       Same vertical reference
       concept as circular motion.
    */

    const centerX =
        width / 2;

    const centerY =
        height / 2 +
        8;


    /*
       SAME amplitude scale
       as circular motion.
    */

    const amplitudePixels =
        getAmplitudePixels();


    /*
       Grid
    */

    drawSHMGrid(
        shmCtx,
        width,
        height,
        centerX,
        centerY
    );


    /*
       Axes
    */

    drawSHMAxes(
        shmCtx,
        width,
        height,
        centerX,
        centerY
    );


    /*
       +A / -A
    */

    drawSHMAmplitudeMarkers(
        shmCtx,
        centerX,
        centerY,
        amplitudePixels
    );


    /*
       SHM displacement

           y = A sin(ωt)

       Convert the physical displacement
       into the SAME pixel scale used
       by the circular motion.
    */

    const particleY =
        centerY -
        (
            state.y /
            state.amplitude
        ) *
        amplitudePixels;


    /*
       Handle zero amplitude safely.
    */

    const safeParticleY =
        state.amplitude > 0
            ? particleY
            : centerY;


    /*
       Displacement arrow
    */

    drawSHMDisplacement(
        shmCtx,
        centerX,
        centerY,
        safeParticleY
    );


    /*
       SHM particle
    */

    drawSHMParticle(
        shmCtx,
        centerX,
        safeParticleY
    );


    /* =====================================================
       TITLE
    ===================================================== */

    shmCtx.save();


    shmCtx.fillStyle =
        "#172033";

    shmCtx.font =
        "bold 16px Arial";

    shmCtx.textAlign =
        "center";

    shmCtx.fillText(
        "Simple Harmonic Motion",
        centerX,
        22
    );


    /* =====================================================
       EQUATION
    ===================================================== */

    shmCtx.fillStyle =
        "#2563eb";

    shmCtx.font =
        "bold 14px Arial";

    shmCtx.fillText(
        "y = A sin(ωt)",
        centerX,
        height - 12
    );


    /*
       Current displacement
    */

    shmCtx.fillStyle =
        "#16a34a";

    shmCtx.font =
        "bold 13px Arial";

    shmCtx.textAlign =
        "left";

    shmCtx.fillText(
        `y = ${formatNumber(
            state.y,
            1
        )}`,
        12,
        42
    );


    shmCtx.restore();

}


/* =========================================================
   34. GRAPH TIME WINDOW
========================================================= */

/*
   IMPORTANT:

   The graph does NOT use a fixed time window.

   Instead:

       graph duration
       =
       number of periods × period

   Therefore the graph ALWAYS contains
   a complete number of oscillations.

   Example:

       f = 0.5 Hz

       T = 2 s

       2 periods = 4 s


       f = 1 Hz

       T = 1 s

       2 periods = 2 s


       f = 2 Hz

       T = 0.5 s

       2 periods = 1 s
*/

function getGraphDuration() {

    return (
        GRAPH_PERIODS *
        state.period
    );

}


/* =========================================================
   35. GRAPH SINE FUNCTION
========================================================= */

function getGraphY(
    t
) {

    /*
       y = A sin(ωt)
    */

    return (
        state.amplitude *
        Math.sin(
            state.omega *
            t
        )
    );

}


/* =========================================================
   36. DRAW GRAPH GRID
========================================================= */

function drawGraphGrid(
    ctx,
    width,
    height,
    left,
    right,
    centerY
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth =
        1;


    /*
       Vertical grid

       The horizontal spacing is divided
       according to the displayed periods.
    */

    const graphWidth =
        right - left;


    const periodWidth =
        graphWidth /
        GRAPH_PERIODS;


    /*
       Major vertical divisions:

       0, T, 2T, ...
    */

    for (
        let i = 0;
        i <= GRAPH_PERIODS;
        i++
    ) {

        const x =
            left +
            i *
            periodWidth;


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


    /*
       Smaller vertical grid
    */

    for (
        let i = 0;
        i <= GRAPH_PERIODS * 4;
        i++
    ) {

        const x =
            left +
            (
                i /
                (GRAPH_PERIODS * 4)
            ) *
            graphWidth;


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


    /*
       Horizontal grid
    */

    for (
        let y = centerY;
        y <= height;
        y += GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(
            left,
            y
        );

        ctx.lineTo(
            right,
            y
        );

        ctx.stroke();

    }


    for (
        let y =
            centerY -
            GRID_SIZE;
        y >= 0;
        y -= GRID_SIZE
    ) {

        ctx.beginPath();

        ctx.moveTo(
            left,
            y
        );

        ctx.lineTo(
            right,
            y
        );

        ctx.stroke();

    }


    ctx.restore();

}


/* =========================================================
   37. DRAW GRAPH AXIS
========================================================= */

function drawGraphAxes(
    ctx,
    width,
    height,
    left,
    right,
    centerY
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       y = 0 axis
    */

    ctx.beginPath();

    ctx.moveTo(
        left,
        centerY
    );

    ctx.lineTo(
        right,
        centerY
    );

    ctx.strokeStyle =
        "#475569";

    ctx.lineWidth =
        1.5;

    ctx.stroke();


    /*
       Left vertical axis
    */

    ctx.beginPath();

    ctx.moveTo(
        left,
        0
    );

    ctx.lineTo(
        left,
        height
    );

    ctx.stroke();


    /*
       X-axis arrow
    */

    ctx.beginPath();

    ctx.moveTo(
        right,
        centerY
    );

    ctx.lineTo(
        right - 10,
        centerY - 5
    );

    ctx.lineTo(
        right - 10,
        centerY + 5
    );

    ctx.closePath();

    ctx.fillStyle =
        "#475569";

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   38. DRAW COMPLETE SINE WAVE
========================================================= */

function drawSineWave(
    ctx,
    width,
    height,
    left,
    right,
    centerY,
    amplitudePixels
) {

    if (!ctx) {
        return;

    }


    const graphWidth =
        right - left;


    const duration =
        getGraphDuration();


    /*
       Use a dense sampling resolution.

       The graph is based on the same equation
       used by the physics engine:

           y = A sin(ωt)
    */

    const samples =
        Math.max(
            300,
            Math.floor(
                graphWidth * 2
            )
        );


    ctx.save();


    ctx.beginPath();


    for (
        let i = 0;
        i <= samples;
        i++
    ) {

        /*
           Convert pixel position
           into graph time.
        */

        const ratio =
            i / samples;


        const t =
            ratio *
            duration;


        /*
           Physics displacement
        */

        const y =
            getGraphY(
                t
            );


        /*
           Convert physical y
           into canvas y.

           Positive y = upward.
        */

        const canvasY =
            centerY -
            (
                y /
                state.amplitude
            ) *
            amplitudePixels;


        const canvasX =
            left +
            ratio *
            graphWidth;


        if (i === 0) {

            ctx.moveTo(
                canvasX,
                canvasY
            );

        } else {

            ctx.lineTo(
                canvasX,
                canvasY
            );

        }

    }


    ctx.strokeStyle =
        "#2563eb";

    ctx.lineWidth =
        3;

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   39. GET CURRENT GRAPH POSITION
========================================================= */

/*
   The graph point MUST be calculated from
   the SAME phase used by the circular motion.

   This prevents the point from drifting
   away from the sine curve.
*/

function getCurrentGraphPosition(
    left,
    right
) {

    const graphWidth =
        right - left;


    const duration =
        getGraphDuration();


    /*
       Current phase inside the displayed graph.

       Since the graph contains GRAPH_PERIODS
       complete periods, use modulo duration.
    */

    const graphTime =
        (
            state.time %
            duration
        );


    /*
       Time ratio:

           0 → 1
    */

    const ratio =
        graphTime /
        duration;


    /*
       X position
    */

    const x =
        left +
        ratio *
        graphWidth;


    /*
       Current displacement

           y = A sin(ωt)
    */

    const y =
        getGraphY(
            graphTime
        );


    return {
        x,
        y,
        ratio,
        graphTime
    };

}


/* =========================================================
   40. DRAW CURRENT GRAPH POINT
========================================================= */

function drawGraphPoint(
    ctx,
    x,
    y
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Glow
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        14,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "rgba(220, 38, 38, 0.15)";

    ctx.fill();


    /*
       Point
    */

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        7,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#dc2626";

    ctx.fill();


    ctx.strokeStyle =
        "#ffffff";

    ctx.lineWidth =
        2;

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   41. DRAW GRAPH POINT GUIDE
========================================================= */

function drawGraphPointGuide(
    ctx,
    x,
    y,
    centerY,
    left
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Vertical guide
    */

    ctx.beginPath();

    ctx.moveTo(
        x,
        centerY
    );

    ctx.lineTo(
        x,
        y
    );

    ctx.strokeStyle =
        "#dc2626";

    ctx.lineWidth =
        1.5;

    ctx.setLineDash([
        5,
        4
    ]);

    ctx.stroke();

    ctx.setLineDash([]);


    /*
       Horizontal guide
    */

    ctx.beginPath();

    ctx.moveTo(
        left,
        y
    );

    ctx.lineTo(
        x,
        y
    );

    ctx.strokeStyle =
        "rgba(220, 38, 38, 0.35)";

    ctx.stroke();

    ctx.restore();

}


/* =========================================================
   42. DRAW GRAPH PERIOD LABELS
========================================================= */

function drawGraphPeriodLabels(
    ctx,
    left,
    right,
    height
) {

    if (!ctx) {
        return;
    }


    const graphWidth =
        right - left;


    const periodWidth =
        graphWidth /
        GRAPH_PERIODS;


    ctx.save();


    ctx.fillStyle =
        "#475569";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";


    for (
        let i = 0;
        i <= GRAPH_PERIODS;
        i++
    ) {

        const x =
            left +
            i *
            periodWidth;


        let label;


        if (i === 0) {

            label = "0";

        } else {

            label =
                i === 1
                    ? "T"
                    : `${i}T`;

        }


        ctx.fillText(
            label,
            x,
            height - 28
        );

    }


    /*
       Period information
    */

    ctx.fillStyle =
        "#2563eb";

    ctx.font =
        "bold 13px Arial";


    ctx.fillText(
        `${GRAPH_PERIODS} complete periods`,
        (
            left +
            right
        ) / 2,
        height - 8
    );


    ctx.restore();

}


/* =========================================================
   43. DRAW SINUSOIDAL GRAPH
========================================================= */

function drawGraph() {

    if (
        !graphCanvas ||
        !graphCtx
    ) {

        return;

    }


    const width =
        graphCanvas.clientWidth;

    const height =
        graphCanvas.clientHeight;


    /*
       Clear
    */

    graphCtx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
       Background
    */

    graphCtx.fillStyle =
        "#ffffff";

    graphCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
       Graph margins
    */

    const left =
        45;

    const right =
        width - 20;


    /*
       Centre line

       Use a little more room for
       the title.
    */

    const centerY =
        height / 2;


    /*
       SAME amplitude scale
       as circular motion and SHM.
    */

    const amplitudePixels =
        getAmplitudePixels();


    /*
       Grid
    */

    drawGraphGrid(
        graphCtx,
        width,
        height,
        left,
        right,
        centerY
    );


    /*
       Axes
    */

    drawGraphAxes(
        graphCtx,
        width,
        height,
        left,
        right,
        centerY
    );


    /*
       Sine curve
    */

    drawSineWave(
        graphCtx,
        width,
        height,
        left,
        right,
        centerY,
        amplitudePixels
    );


    /*
       Current graph point
    */

    const point =
        getCurrentGraphPosition(
            left,
            right
        );


    /*
       Convert point displacement
       to graph pixel position.
    */

    const pointY =
        centerY -
        (
            point.y /
            state.amplitude
        ) *
        amplitudePixels;


    /*
       Guide lines
    */

    drawGraphPointGuide(
        graphCtx,
        point.x,
        pointY,
        centerY,
        left
    );


    /*
       Moving point
    */

    drawGraphPoint(
        graphCtx,
        point.x,
        pointY
    );


    /*
       Period labels
    */

    drawGraphPeriodLabels(
        graphCtx,
        left,
        right,
        height
    );


    /* =====================================================
       TITLE
    ===================================================== */

    graphCtx.save();


    graphCtx.fillStyle =
        "#172033";

    graphCtx.font =
        "bold 16px Arial";

    graphCtx.textAlign =
        "center";

    graphCtx.fillText(
        "Displacement–Time Graph",
        width / 2,
        20
    );


    /* =====================================================
       EQUATION
    ===================================================== */

    graphCtx.fillStyle =
        "#2563eb";

    graphCtx.font =
        "bold 14px Arial";

    graphCtx.fillText(
        "y = A sin(ωt)",
        width / 2,
        40
    );


    /*
       Y-axis label
    */

    graphCtx.save();

    graphCtx.translate(
        15,
        centerY
    );

    graphCtx.rotate(
        -Math.PI / 2
    );

    graphCtx.fillStyle =
        "#475569";

    graphCtx.font =
        "bold 12px Arial";

    graphCtx.textAlign =
        "center";

    graphCtx.fillText(
        "Displacement y",
        0,
        0
    );

    graphCtx.restore();


    graphCtx.restore();

}


/* =========================================================
   44. DRAW ALL
========================================================= */

function drawAll() {

    calculateSHM();

    drawCircularMotion();

    drawSHM();

    drawGraph();

    updateDisplays();

}


/* =========================================================
   END OF PART 3
========================================================= */

/* =========================================================
   CIRCULAR MOTION → SHM
   PART 4 — CONTROLS, ANIMATION, RESET, INITIALIZATION
========================================================= */


/* =========================================================
   45. UPDATE SLIDER LABELS
========================================================= */

function updateSliderLabels() {

    if (amplitudeSlider) {

        const value =
            parseFloat(
                amplitudeSlider.value
            );

        if (amplitudeValue) {

            amplitudeValue.textContent =
                `${formatNumber(
                    value,
                    0
                )} px`;

        }

    }


    if (frequencySlider) {

        const value =
            parseFloat(
                frequencySlider.value
            );

        if (frequencyValue) {

            frequencyValue.textContent =
                `${formatNumber(
                    value,
                    2
                )} Hz`;

        }

    }

}


/* =========================================================
   46. AMPLITUDE SLIDER
========================================================= */

function handleAmplitudeChange() {

    if (
        !amplitudeSlider
    ) {

        return;

    }


    const newAmplitude =
        parseFloat(
            amplitudeSlider.value
        );


    if (
        !Number.isFinite(
            newAmplitude
        )
    ) {

        return;

    }


    /*
       Only amplitude changes.

       The phase θ remains unchanged.

       Therefore the particle does not suddenly
       jump to another position.
    */

    state.amplitude =
        Math.max(
            0.001,
            newAmplitude
        );


    /*
       Recalculate SHM immediately.
    */

    calculateSHM();


    updateDisplays();

    drawAll();

}


/* =========================================================
   47. FREQUENCY SLIDER
========================================================= */

function handleFrequencyChange() {

    if (
        !frequencySlider
    ) {

        return;

    }


    const newFrequency =
        parseFloat(
            frequencySlider.value
        );


    if (
        !Number.isFinite(
            newFrequency
        )
    ) {

        return;

    }


    /*
       IMPORTANT:

       We preserve the CURRENT PHASE.

       The old simulation may be at:

           θ = 120°

       Changing frequency must NOT reset
       θ back to zero.

       Therefore:

           θ = ωt

       is maintained directly.

       We change ω, then calculate an
       equivalent time:

           t = θ / ω
    */

    const currentPhase =
        normalizeAngle(
            state.theta
        );


    state.frequency =
        Math.max(
            0.001,
            newFrequency
        );


    state.omega =
        TWO_PI *
        state.frequency;


    state.period =
        1 /
        state.frequency;


    /*
       Rebuild time so the current phase
       remains exactly the same.
    */

    state.time =
        currentPhase /
        state.omega;


    /*
       Recalculate.
    */

    calculateSHM();


    updateDisplays();

    drawAll();

}


/* =========================================================
   48. PLAY / PAUSE
========================================================= */

function togglePlay() {

    if (
        state.playing
    ) {

        pauseSimulation();

    } else {

        startSimulation();

    }

}


/* =========================================================
   49. START SIMULATION
========================================================= */

function startSimulation() {

    if (
        state.playing
    ) {

        return;

    }


    state.playing =
        true;


    state.lastTimestamp =
        null;


    if (simulationStatus) {

        simulationStatus.textContent =
            "Running";

    }


    if (playButton) {

        playButton.textContent =
            "⏸ Pause";

    }


    /*
       Start ONE animation loop.
    */

    state.animationId =
        requestAnimationFrame(
            animationLoop
        );

}


/* =========================================================
   50. PAUSE SIMULATION
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

    }


    state.animationId =
        null;


    if (simulationStatus) {

        simulationStatus.textContent =
            "Paused";

    }


    if (playButton) {

        playButton.textContent =
            "▶ Play";

    }

}


/* =========================================================
   51. ANIMATION LOOP
========================================================= */

function animationLoop(
    timestamp
) {

    /*
       Stop if simulation has been paused.
    */

    if (
        !state.playing
    ) {

        return;

    }


    /*
       First frame.

       Avoid a huge time jump.
    */

    if (
        state.lastTimestamp === null
    ) {

        state.lastTimestamp =
            timestamp;

    }


    /*
       Elapsed real time in seconds.
    */

    let dt =
        (
            timestamp -
            state.lastTimestamp
        ) / 1000;


    state.lastTimestamp =
        timestamp;


    /*
       Protect against browser tab switching
       or a long frame.
    */

    dt =
        Math.min(
            dt,
            0.05
        );


    /*
       Advance time.

           θ = ωt

       is calculated from the updated time.
    */

    state.time +=
        dt;


    /*
       Keep time numerically small.

       We can safely wrap it around the
       current graph duration.

       Because the graph contains complete
       periods, wrapping does NOT cause a
       visible phase discontinuity.
    */

    const graphDuration =
        getGraphDuration();


    if (
        graphDuration > 0 &&
        state.time >= graphDuration
    ) {

        state.time =
            state.time %
            graphDuration;

    }


    /*
       Update physics.
    */

    calculateSHM();


    /*
       Redraw everything.

       Circular motion
       SHM
       sine graph
       moving graph point
       numerical values
    */

    drawAll();


    /*
       Continue animation.
    */

    state.animationId =
        requestAnimationFrame(
            animationLoop
        );

}


/* =========================================================
   52. RESET SIMULATION
========================================================= */

function resetSimulation() {

    /*
       Pause first.
    */

    pauseSimulation();


    /*
       Reset time.
    */

    state.time =
        0;


    /*
       Reset phase.

           θ = 0

       Therefore:

           y = A sin(0)
           y = 0
    */

    state.theta =
        0;


    /*
       Reset controls to their HTML defaults.

       If your HTML has:

           amplitudeSlider value="100"

           frequencySlider value="0.5"

       these values will be restored.
    */

    if (
        amplitudeSlider
    ) {

        amplitudeSlider.value =
            amplitudeSlider.defaultValue ||
            100;

    }


    if (
        frequencySlider
    ) {

        frequencySlider.value =
            frequencySlider.defaultValue ||
            0.5;

    }


    /*
       Read the restored controls.
    */

    readControls();


    /*
       Calculate initial physics.
    */

    calculateSHM();


    /*
       Update interface.
    */

    updateSliderLabels();

    updateDisplays();


    /*
       Draw initial state.
    */

    drawAll();

}


/* =========================================================
   53. TOGGLE Y COMPONENT
========================================================= */

function handleYComponentToggle() {

    if (
        !yComponentToggle
    ) {

        return;

    }


    /*
       Support checkbox.

       Checked = show Y component.
    */

    if (
        yComponentToggle.type ===
        "checkbox"
    ) {

        state.showYComponent =
            yComponentToggle.checked;

    } else {

        /*
           If a button is used instead,
           toggle the current state.
        */

        state.showYComponent =
            !state.showYComponent;

    }


    drawAll();

}


/* =========================================================
   54. FORMULA PANEL
========================================================= */

function setupFormulaPanel() {

    if (
        !formulaToggle ||
        !formulaContent
    ) {

        return;

    }


    formulaToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                formulaContent.classList
                    .contains(
                        "open"
                    );


            if (isOpen) {

                formulaContent.classList
                    .remove(
                        "open"
                    );


                if (formulaArrow) {

                    formulaArrow.textContent =
                        "▼";

                }

            } else {

                formulaContent.classList
                    .add(
                        "open"
                    );


                if (formulaArrow) {

                    formulaArrow.textContent =
                        "▲";

                }

            }

        }
    );

}


/* =========================================================
   55. CONCEPT PANEL
========================================================= */

function setupConceptPanel() {

    if (
        !conceptToggle ||
        !conceptContent
    ) {

        return;

    }


    conceptToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                conceptContent.classList
                    .contains(
                        "open"
                    );


            if (isOpen) {

                conceptContent.classList
                    .remove(
                        "open"
                    );


                if (conceptArrow) {

                    conceptArrow.textContent =
                        "▼";

                }

            } else {

                conceptContent.classList
                    .add(
                        "open"
                    );


                if (conceptArrow) {

                    conceptArrow.textContent =
                        "▲";

                }

            }

        }
    );

}


/* =========================================================
   56. KEYBOARD CONTROLS
========================================================= */

function setupKeyboardControls() {

    document.addEventListener(
        "keydown",
        (event) => {

            /*
               Spacebar:
               Play / Pause
            */

            if (
                event.code ===
                "Space"
            ) {

                /*
                   Don't interfere with text inputs.
                */

                const tag =
                    document.activeElement
                        ?.tagName
                        ?.toLowerCase();


                if (
                    tag === "input" ||
                    tag === "textarea" ||
                    tag === "button"
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
                event.key === "r" ||
                event.key === "R"
            ) {

                resetSimulation();

            }

        }
    );

}


/* =========================================================
   57. CONNECT CONTROLS
========================================================= */

function setupControls() {

    /*
       Amplitude
    */

    if (
        amplitudeSlider
    ) {

        amplitudeSlider.addEventListener(
            "input",
            handleAmplitudeChange
        );

    }


    /*
       Frequency
    */

    if (
        frequencySlider
    ) {

        frequencySlider.addEventListener(
            "input",
            handleFrequencyChange
        );

    }


    /*
       Play button
    */

    if (
        playButton
    ) {

        playButton.addEventListener(
            "click",
            togglePlay
        );

    }


    /*
       Reset button
    */

    if (
        resetButton
    ) {

        resetButton.addEventListener(
            "click",
            resetSimulation
        );

    }


    /*
       Y-component checkbox/button
    */

    if (
        yComponentToggle
    ) {

        yComponentToggle.addEventListener(
            "change",
            handleYComponentToggle
        );


        yComponentToggle.addEventListener(
            "click",
            () => {

                /*
                   Only use click fallback for
                   non-checkbox controls.
                */

                if (
                    yComponentToggle.type !==
                    "checkbox"
                ) {

                    handleYComponentToggle();

                }

            }
        );

    }


    /*
       Formula panel
    */

    setupFormulaPanel();


    /*
       Concept panel
    */

    setupConceptPanel();


    /*
       Keyboard
    */

    setupKeyboardControls();

}


/* =========================================================
   58. RESIZE EVENT
========================================================= */

let resizeTimer = null;


window.addEventListener(
    "resize",
    () => {

        /*
           Avoid excessive redraws during
           continuous resizing.
        */

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    resizeAll();

                },
                100
            );

    }
);


/* =========================================================
   59. INITIALIZE
========================================================= */

function initializeSimulation() {

    /*
       Read HTML slider values.
    */

    readControls();


    /*
       Initial state.
    */

    state.time =
        0;

    state.theta =
        0;

    state.playing =
        false;


    /*
       Initial physics.
    */

    calculateSHM();


    /*
       Setup controls.
    */

    setupControls();


    /*
       Setup canvas dimensions.
    */

    resizeAll();


    /*
       Update slider displays.
    */

    updateSliderLabels();

    updateDisplays();


    /*
       Final initial drawing.
    */

    drawAll();

}


/* =========================================================
   60. START AFTER PAGE LOAD
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
   END OF FINAL SCRIPT.JS
========================================================= */