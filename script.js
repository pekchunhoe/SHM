/* =========================================================
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   FINAL CLEAN SCRIPT

   Physics:

       θ = ωt

       ω = 2πf

       y = A sin θ

       therefore

       y = A sin(ωt)

   IMPORTANT:
   ONLY THE Y-COMPONENT IS USED FOR SHM.
========================================================= */


/* =========================================================
   1. GLOBAL STATE
========================================================= */

const state = {

    amplitude: 100,

    frequency: 0.5,

    omega: 2 * Math.PI * 0.5,

    period: 2,

    time: 0,

    theta: 0,

    y: 0,

    velocity: 0,

    acceleration: 0,

    playing: false,

    animationId: null,

    lastTimestamp: null,

    showYComponent: true

};


/* =========================================================
   2. CONSTANTS
========================================================= */

const TWO_PI = 2 * Math.PI;


/*
   The graph deliberately uses a FIXED time window.

   This is important.

   We do NOT use:

       visibleTime = 2 * period

   because that would always display exactly two cycles.

   Instead, frequency changes the number of cycles
   visible on the same time axis.
*/

const GRAPH_TIME_WINDOW = 4;


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

const simulationStatus =
    document.getElementById("simulationStatus");


/* =========================================================
   6. COLLAPSIBLE PANELS
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
   7. FORMAT NUMBER
========================================================= */

function formatNumber(value, decimals = 2) {

    if (!Number.isFinite(value)) {
        return "0";
    }

    return Number(value).toFixed(decimals);

}


/* =========================================================
   8. NORMALIZE ANGLE
========================================================= */

function normalizeAngle(angle) {

    let result =
        angle % TWO_PI;

    if (result < 0) {
        result += TWO_PI;
    }

    return result;

}


/* =========================================================
   9. READ SLIDER VALUES
========================================================= */

function readControls() {

    if (amplitudeSlider) {

        const A =
            parseFloat(
                amplitudeSlider.value
            );

        if (Number.isFinite(A)) {
            state.amplitude =
                Math.max(1, A);
        }

    }


    if (frequencySlider) {

        const f =
            parseFloat(
                frequencySlider.value
            );

        if (Number.isFinite(f)) {
            state.frequency =
                Math.max(0.01, f);
        }

    }


    /*
       ω = 2πf
    */

    state.omega =
        TWO_PI *
        state.frequency;


    /*
       T = 1/f
    */

    state.period =
        1 /
        state.frequency;

}


/* =========================================================
   10. CALCULATE SHM
========================================================= */

function calculateSHM() {

    /*
       θ = ωt
    */

    state.theta =
        state.omega *
        state.time;


    /*
       IMPORTANT:

       Y-COMPONENT ONLY

       y = A sin(θ)
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

       a = -ω²y
    */

    state.acceleration =
        -state.omega *
        state.omega *
        state.y;

}


/* =========================================================
   11. UPDATE NUMERICAL DISPLAYS
========================================================= */

function updateDisplays() {

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
                normalizeAngle(
                    state.theta
                ) *
                180 /
                Math.PI,
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


    /*
       Circular-panel displays
    */

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
                normalizeAngle(
                    state.theta
                ) *
                180 /
                Math.PI,
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


    /*
       Status
    */

    if (simulationStatus) {

        simulationStatus.textContent =
            state.playing
                ? "Running"
                : "Paused";

    }


    /*
       Play button
    */

    if (playButton) {

        playButton.textContent =
            state.playing
                ? "⏸ Pause"
                : "▶ Play";

    }

}


/* =========================================================
   12. CANVAS RESIZE
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
       Make drawing coordinates correspond
       to CSS pixels.
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
   13. RESIZE ALL
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
   14. DRAW ARROW
========================================================= */

function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    lineColor = "#16a34a",
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


    if (length < 1) {
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
        lineColor;

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
        lineColor;

    ctx.fill();

}


/* =========================================================
   15. CIRCULAR MOTION
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
    */

    const cx =
        width / 2;

    const cy =
        height / 2;


    /*
       Radius is directly proportional
       to amplitude.

       A changes → circle changes size.
    */

    const maximumRadius =
        Math.min(
            width,
            height
        ) * 0.36;


    /*
       Slider maximum = 150 in your HTML.

       Use it as the physical reference.
    */

    const sliderMax =
        amplitudeSlider
            ? parseFloat(
                amplitudeSlider.max
            ) || 150
            : 150;


    const radius =
        maximumRadius *
        state.amplitude /
        sliderMax;


    /* -------------------------------------------------------
       GRID
    ------------------------------------------------------- */

    circularCtx.strokeStyle =
        "#f1f5f9";

    circularCtx.lineWidth =
        1;


    for (
        let x = 0;
        x < width;
        x += 25
    ) {

        circularCtx.beginPath();

        circularCtx.moveTo(
            x,
            0
        );

        circularCtx.lineTo(
            x,
            height
        );

        circularCtx.stroke();

    }


    for (
        let y = 0;
        y < height;
        y += 25
    ) {

        circularCtx.beginPath();

        circularCtx.moveTo(
            0,
            y
        );

        circularCtx.lineTo(
            width,
            y
        );

        circularCtx.stroke();

    }


    /* -------------------------------------------------------
       AXES
    ------------------------------------------------------- */

    circularCtx.strokeStyle =
        "#94a3b8";

    circularCtx.lineWidth =
        1.5;


    circularCtx.beginPath();

    circularCtx.moveTo(
        10,
        cy
    );

    circularCtx.lineTo(
        width - 10,
        cy
    );

    circularCtx.stroke();


    circularCtx.beginPath();

    circularCtx.moveTo(
        cx,
        10
    );

    circularCtx.lineTo(
        cx,
        height - 10
    );

    circularCtx.stroke();


    /* -------------------------------------------------------
       CIRCLE
    ------------------------------------------------------- */

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


    /*
       Current angle
    */

    const theta =
        normalizeAngle(
            state.theta
        );


    /*
       Circular position:

       x = A cosθ
       y = A sinθ

       x is ONLY used for locating
       the particle.

       SHM uses the Y-component.
    */

    const particleX =
        cx +
        radius *
        Math.cos(theta);


    /*
       Canvas Y is inverted.

       Positive mathematical y
       points upward.
    */

    const particleY =
        cy -
        radius *
        Math.sin(theta);


    /* -------------------------------------------------------
       RADIUS VECTOR
    ------------------------------------------------------- */

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


    /* -------------------------------------------------------
       Y COMPONENT
    ------------------------------------------------------- */

    if (
        state.showYComponent
    ) {

        /*
           Projection line.
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

        circularCtx.setLineDash([
            6,
            4
        ]);

        circularCtx.strokeStyle =
            "#16a34a";

        circularCtx.lineWidth =
            2;

        circularCtx.stroke();

        circularCtx.setLineDash([]);


        /*
           Actual Y displacement.

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


        /*
           Y label
        */

        circularCtx.fillStyle =
            "#15803d";

        circularCtx.font =
            "bold 14px Arial";

        circularCtx.textAlign =
            "left";


        circularCtx.fillText(
            `y = ${formatNumber(
                state.y,
                1
            )}`,
            cx + 12,
            (
                cy +
                particleY
            ) / 2
        );

    }


    /* -------------------------------------------------------
       PARTICLE
    ------------------------------------------------------- */

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


    /* -------------------------------------------------------
       CENTRE
    ------------------------------------------------------- */

    circularCtx.beginPath();

    circularCtx.arc(
        cx,
        cy,
        5,
        0,
        TWO_PI
    );

    circularCtx.fillStyle =
        "#111827";

    circularCtx.fill();


    /* -------------------------------------------------------
       LABELS
    ------------------------------------------------------- */

    circularCtx.font =
        "bold 13px Arial";

    circularCtx.textAlign =
        "left";


    circularCtx.fillStyle =
        "#dc2626";

    circularCtx.fillText(
        "P",
        particleX + 12,
        particleY - 10
    );


    circularCtx.fillStyle =
        "#111827";

    circularCtx.fillText(
        "O",
        cx + 8,
        cy + 18
    );


    /*
       A label
    */

    circularCtx.fillStyle =
        "#2563eb";

    circularCtx.textAlign =
        "center";

    circularCtx.fillText(
        "A",
        cx +
        radius * 0.55,
        cy -
        radius * 0.55
    );


    /*
       Phase angle
    */

    circularCtx.strokeStyle =
        "#f59e0b";

    circularCtx.lineWidth =
        3;


    const arcRadius =
        Math.min(
            radius * 0.28,
            40
        );


    circularCtx.beginPath();

    circularCtx.arc(
        cx,
        cy,
        arcRadius,
        0,
        -theta,
        true
    );

    circularCtx.stroke();


    circularCtx.fillStyle =
        "#d97706";

    circularCtx.font =
        "bold 14px Arial";

    circularCtx.fillText(
        "θ",
        cx + 20,
        cy - 10
    );


    /*
       Phase information
    */

    circularCtx.fillStyle =
        "#475569";

    circularCtx.font =
        "12px Arial";

    circularCtx.textAlign =
        "left";


    circularCtx.fillText(
        `θ = ${formatNumber(
            theta * 180 / Math.PI,
            0
        )}°`,
        12,
        20
    );


    circularCtx.fillText(
        `A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        12,
        38
    );


    circularCtx.fillText(
        `f = ${formatNumber(
            state.frequency,
            2
        )} Hz`,
        12,
        56
    );

}


/* =========================================================
   16. DRAW SHM
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


    shmCtx.clearRect(
        0,
        0,
        width,
        height
    );


    shmCtx.fillStyle =
        "#ffffff";

    shmCtx.fillRect(
        0,
        0,
        width,
        height
    );


    const cx =
        width / 2;

    const cy =
        height / 2;


    /*
       Use the SAME amplitude scale
       as circular motion.
    */

    const sliderMax =
        amplitudeSlider
            ? parseFloat(
                amplitudeSlider.max
            ) || 150
            : 150;


    const maximumAmplitude =
        Math.min(
            width,
            height
        ) * 0.38;


    const amplitudePixels =
        maximumAmplitude *
        state.amplitude /
        sliderMax;


    /* -------------------------------------------------------
       TITLE
    ------------------------------------------------------- */

    shmCtx.fillStyle =
        "#172033";

    shmCtx.font =
        "bold 15px Arial";

    shmCtx.textAlign =
        "center";

    shmCtx.fillText(
        "Y-component → SHM",
        cx,
        20
    );


    /* -------------------------------------------------------
       SHM LINE
    ------------------------------------------------------- */

    shmCtx.beginPath();

    shmCtx.moveTo(
        cx,
        cy -
        maximumAmplitude
    );

    shmCtx.lineTo(
        cx,
        cy +
        maximumAmplitude
    );

    shmCtx.strokeStyle =
        "#cbd5e1";

    shmCtx.lineWidth =
        5;

    shmCtx.stroke();


    /* -------------------------------------------------------
       EQUILIBRIUM
    ------------------------------------------------------- */

    shmCtx.beginPath();

    shmCtx.moveTo(
        cx - 65,
        cy
    );

    shmCtx.lineTo(
        cx + 65,
        cy
    );

    shmCtx.setLineDash([
        5,
        4
    ]);

    shmCtx.strokeStyle =
        "#64748b";

    shmCtx.lineWidth =
        2;

    shmCtx.stroke();

    shmCtx.setLineDash([]);


    /* -------------------------------------------------------
       CURRENT Y POSITION
    ------------------------------------------------------- */

    /*
       state.y is physical displacement.

       Convert it to the visual scale.

       IMPORTANT:
       y / A × displayedAmplitude

       This keeps the SHM particle synchronized
       with the circular motion.
    */

    const visualY =
        state.amplitude === 0
            ? 0
            :
            (
                state.y /
                state.amplitude
            ) *
            amplitudePixels;


    const particleY =
        cy -
        visualY;


    /* -------------------------------------------------------
       Y DISPLACEMENT ARROW
    ------------------------------------------------------- */

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


    /* -------------------------------------------------------
       +A MARKER
    ------------------------------------------------------- */

    shmCtx.beginPath();

    shmCtx.moveTo(
        cx - 10,
        cy -
        amplitudePixels
    );

    shmCtx.lineTo(
        cx + 10,
        cy -
        amplitudePixels
    );

    shmCtx.strokeStyle =
        "#dc2626";

    shmCtx.lineWidth =
        3;

    shmCtx.stroke();


    /* -------------------------------------------------------
       -A MARKER
    ------------------------------------------------------- */

    shmCtx.beginPath();

    shmCtx.moveTo(
        cx - 10,
        cy +
        amplitudePixels
    );

    shmCtx.lineTo(
        cx + 10,
        cy +
        amplitudePixels
    );

    shmCtx.stroke();


    /* -------------------------------------------------------
       PARTICLE
    ------------------------------------------------------- */

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


    /* -------------------------------------------------------
       LABELS
    ------------------------------------------------------- */

    shmCtx.textAlign =
        "left";

    shmCtx.font =
        "bold 13px Arial";


    shmCtx.fillStyle =
        "#dc2626";

    shmCtx.fillText(
        "+A",
        cx + 18,
        cy -
        amplitudePixels +
        5
    );


    shmCtx.fillText(
        "−A",
        cx + 18,
        cy +
        amplitudePixels +
        5
    );


    shmCtx.fillStyle =
        "#64748b";

    shmCtx.fillText(
        "y = 0",
        cx + 18,
        cy + 5
    );


    shmCtx.fillStyle =
        "#15803d";

    shmCtx.fillText(
        `y = ${formatNumber(
            state.y,
            1
        )}`,
        cx + 20,
        particleY - 12
    );


    /* -------------------------------------------------------
       EQUATION
    ------------------------------------------------------- */

    shmCtx.fillStyle =
        "#2563eb";

    shmCtx.font =
        "bold 15px Arial";

    shmCtx.textAlign =
        "center";

    shmCtx.fillText(
        "y = A sin(ωt)",
        cx,
        height - 12
    );

}


/* =========================================================
   17. DRAW GRAPH
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


    graphCtx.clearRect(
        0,
        0,
        width,
        height
    );


    graphCtx.fillStyle =
        "#ffffff";

    graphCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
       Graph boundaries
    */

    const left = 50;

    const right =
        width - 18;

    const top = 35;

    const bottom =
        height - 45;


    const graphWidth =
        right - left;

    const graphHeight =
        bottom - top;


    const centreY =
        (
            top +
            bottom
        ) / 2;


    /*
       -------------------------------------------------------
       IMPORTANT AMPLITUDE FIX
       -------------------------------------------------------

       We DO NOT divide by state.amplitude.

       Instead, use a fixed physical scale based
       on the maximum possible slider amplitude.

       Therefore:

           A = 50  → shorter wave

           A = 100 → medium wave

           A = 150 → taller wave
    */

    const sliderMax =
        amplitudeSlider
            ? parseFloat(
                amplitudeSlider.max
            ) || 150
            : 150;


    const maximumGraphAmplitude =
        graphHeight * 0.40;


    const pixelsPerUnit =
        maximumGraphAmplitude /
        sliderMax;


    const currentAmplitudePixels =
        state.amplitude *
        pixelsPerUnit;


    /* =====================================================
       GRID
    ===================================================== */

    graphCtx.strokeStyle =
        "#e2e8f0";

    graphCtx.lineWidth =
        1;


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


    /* =====================================================
       AXES
    ===================================================== */

    graphCtx.strokeStyle =
        "#64748b";

    graphCtx.lineWidth =
        1.5;


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
       AMPLITUDE MARKERS
    ===================================================== */

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
        currentAmplitudePixels +
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
        currentAmplitudePixels +
        4
    );


    /* =====================================================
       SINE WAVE
    ===================================================== */

    /*
       FIXED TIME WINDOW

       This is the second major fix.

       We use:

           0 → 4 seconds

       regardless of frequency.

       Therefore:

           frequency ↑
           → more cycles
           → graph becomes compressed

           frequency ↓
           → fewer cycles
           → graph becomes stretched
    */

    const visibleTime =
        GRAPH_TIME_WINDOW;


    graphCtx.beginPath();


    const samples = 1000;


    for (
        let i = 0;
        i <= samples;
        i++
    ) {

        const t =
            (
                i /
                samples
            ) *
            visibleTime;


        /*
           THE ACTUAL PHYSICS EQUATION

               y = A sin(ωt)
        */

        const y =
            state.amplitude *
            Math.sin(
                state.omega *
                t
            );


        /*
           Convert physical displacement
           into graph pixels.

           A is NOT cancelled.
        */

        const screenY =
            centreY -
            y *
            pixelsPerUnit;


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


    graphCtx.strokeStyle =
        "#2563eb";

    graphCtx.lineWidth =
        3;

    graphCtx.stroke();


    /* =====================================================
       CURRENT TIME
    ===================================================== */

    /*
       Keep graph marker inside
       the displayed 4-second window.
    */

    const graphTime =
        state.time %
        visibleTime;


    const currentX =
        left +
        (
            graphTime /
            visibleTime
        ) *
        graphWidth;


    /*
       Same Y equation.
    */

    const currentY =
        centreY -
        state.y *
        pixelsPerUnit;


    /* -----------------------------------------------------
       CURRENT TIME LINE
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       CURRENT POINT
    ----------------------------------------------------- */

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


    /* =====================================================
       TIME AXIS LABELS
    ===================================================== */

    graphCtx.fillStyle =
        "#475569";

    graphCtx.font =
        "12px Arial";

    graphCtx.textAlign =
        "center";


    /*
       Show 0, 1, 2, 3, 4 seconds.
    */

    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const x =
            left +
            (
                i /
                visibleTime
            ) *
            graphWidth;


        graphCtx.fillText(
            `${i} s`,
            x,
            bottom + 18
        );

    }


    /* =====================================================
       TITLES
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
        top + 16
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
   18. DRAW EVERYTHING
========================================================= */

function drawAll() {

    drawCircularMotion();

    drawSHM();

    drawGraph();

}


/* =========================================================
   19. PLAY
========================================================= */

function playSimulation() {

    /*
       Prevent multiple animation loops.
    */

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
   20. PAUSE
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


    updateDisplays();

}


/* =========================================================
   21. TOGGLE PLAY
========================================================= */

function togglePlay() {

    if (state.playing) {

        pauseSimulation();

    } else {

        playSimulation();

    }

}


/* =========================================================
   22. ANIMATION LOOP
========================================================= */

function animationLoop(timestamp) {

    if (!state.playing) {
        return;
    }


    /*
       First frame:
       establish timestamp without
       jumping forward.
    */

    if (
        state.lastTimestamp === null
    ) {

        state.lastTimestamp =
            timestamp;

    }


    let dt =
        (
            timestamp -
            state.lastTimestamp
        ) / 1000;


    state.lastTimestamp =
        timestamp;


    /*
       Protect against large jumps.
    */

    dt =
        Math.min(
            dt,
            0.05
        );


    /*
       ADVANCE REAL TIME

           t = t + dt
    */

    state.time +=
        dt;


    /*
       Recalculate:

           θ = ωt

           y = A sin(ωt)
    */

    calculateSHM();


    /*
       Update all three visualizations
       using the SAME state.
    */

    updateDisplays();

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
   23. AMPLITUDE SLIDER
========================================================= */

if (amplitudeSlider) {

    amplitudeSlider.addEventListener(
        "input",
        () => {

            readControls();

            /*
               Keep current phase/time.

               Only amplitude changes.

               Therefore:

                   y = A sin(ωt)

               changes immediately.
            */

            calculateSHM();

            updateDisplays();

            drawAll();

        }
    );

}


/* =========================================================
   24. FREQUENCY SLIDER
========================================================= */

if (frequencySlider) {

    frequencySlider.addEventListener(
        "input",
        () => {

            readControls();

            /*
               Frequency changes:

                   ω = 2πf

                   T = 1/f

               Therefore the particle rotates
               at a different speed and the
               graph changes its horizontal shape.
            */

            calculateSHM();

            updateDisplays();

            drawAll();

        }
    );

}


/* =========================================================
   25. PLAY BUTTON

   IMPORTANT:

   THERE IS ONLY ONE CLICK HANDLER.

   This fixes the previous problem where
   two handlers caused Play → Pause immediately.
========================================================= */

if (playButton) {

    playButton.addEventListener(
        "click",
        togglePlay
    );

}


/* =========================================================
   26. RESET
========================================================= */

function resetSimulation() {

    pauseSimulation();


    state.time =
        0;


    state.theta =
        0;


    state.y =
        0;


    state.velocity =
        0;


    state.acceleration =
        0;


    readControls();


    calculateSHM();

    updateDisplays();

    drawAll();

}


/* =========================================================
   27. RESET BUTTON
========================================================= */

if (resetButton) {

    resetButton.addEventListener(
        "click",
        resetSimulation
    );

}


/* =========================================================
   28. Y-COMPONENT TOGGLE
========================================================= */

if (yComponentToggle) {

    state.showYComponent =
        yComponentToggle.checked;


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
   29. FORMULA PANEL
========================================================= */

if (
    formulaToggle &&
    formulaContent
) {

    formulaToggle.addEventListener(
        "click",
        () => {

            const hidden =
                formulaContent.style.display ===
                "none";


            if (hidden) {

                formulaContent.style.display =
                    "";

                if (formulaArrow) {
                    formulaArrow.textContent =
                        "▼";
                }

            } else {

                formulaContent.style.display =
                    "none";

                if (formulaArrow) {
                    formulaArrow.textContent =
                        "▶";
                }

            }

        }
    );

}


/* =========================================================
   30. CONCEPT PANEL
========================================================= */

if (
    conceptToggle &&
    conceptContent
) {

    conceptToggle.addEventListener(
        "click",
        () => {

            const hidden =
                conceptContent.style.display ===
                "none";


            if (hidden) {

                conceptContent.style.display =
                    "";

                if (conceptArrow) {
                    conceptArrow.textContent =
                        "▼";
                }

            } else {

                conceptContent.style.display =
                    "none";

                if (conceptArrow) {
                    conceptArrow.textContent =
                        "▶";
                }

            }

        }
    );

}


/* =========================================================
   31. KEYBOARD CONTROL
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           Don't interfere with sliders.
        */

        if (
            event.target &&
            event.target.tagName ===
            "INPUT"
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

            togglePlay();

        }


        /*
           R = RESET
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
   32. WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        resizeAll();

    }
);


/* =========================================================
   33. VISIBILITY CHANGE
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            /*
               Do not create a huge time jump
               when returning to the page.
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
   34. INITIALIZATION
========================================================= */

function initialize() {

    /*
       Read actual HTML slider values.
    */

    readControls();


    /*
       Initial state:

           t = 0

           θ = 0

           y = A sin(0)

           y = 0
    */

    state.time =
        0;


    calculateSHM();


    /*
       Size canvases.
    */

    resizeAll();


    /*
       Draw initial frame.
    */

    updateDisplays();

    drawAll();

}


/* =========================================================
   35. START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

} else {

    initialize();

}


/* =========================================================
   36. DEBUG ACCESS
========================================================= */

window.shmSimulation = {

    state,

    play:
        playSimulation,

    pause:
        pauseSimulation,

    reset:
        resetSimulation,

    getValues() {

        return {

            A:
                state.amplitude,

            f:
                state.frequency,

            omega:
                state.omega,

            T:
                state.period,

            theta:
                state.theta,

            y:
                state.y,

            velocity:
                state.velocity,

            acceleration:
                state.acceleration

        };

    }

};


/* =========================================================
   END
========================================================= */