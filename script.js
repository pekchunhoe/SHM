/* =========================================================
   SHM SIMULATION
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   PHYSICS MODEL

       y = A sin(ωt)

       ω = 2πf

       T = 1/f

   IMPORTANT:
   The SHM is produced by the Y-component
   of the circular motion.

   This is a clean replacement for the
   previous script.js.
========================================================= */


/* =========================================================
   1. CONSTANTS
========================================================= */

const TWO_PI = 2 * Math.PI;

/*
   Number of complete periods shown
   on the displacement-time graph.

   Change to 1, 2, 3... if desired.
*/
const GRAPH_PERIODS = 2;


/*
   Physical amplitude range.

   These values should match the
   amplitude slider in index.html.
*/
const MIN_AMPLITUDE = 50;
const MAX_AMPLITUDE = 150;


/*
   Frequency range.
*/
const MIN_FREQUENCY = 0.1;
const MAX_FREQUENCY = 2.0;


/*
   Common grid spacing.

   Both circular-motion and SHM
   canvases use the same grid spacing.
*/
const GRID_SIZE = 25;


/* =========================================================
   2. CANVAS ELEMENTS
========================================================= */

const circularCanvas =
    document.getElementById("circularCanvas");

const shmCanvas =
    document.getElementById("shmCanvas");

const graphCanvas =
    document.getElementById("graphCanvas");


/* =========================================================
   3. CANVAS CONTEXTS
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
   4. CONTROL ELEMENTS
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
   5. DISPLAY ELEMENTS
========================================================= */

const amplitudeDisplay =
    document.getElementById("amplitudeDisplay");

const frequencyDisplay =
    document.getElementById("frequencyDisplay");

const omegaDisplay =
    document.getElementById("omegaDisplay");

const periodDisplay =
    document.getElementById("periodDisplay");

const angleDisplay =
    document.getElementById("angleDisplay");

const yDisplay =
    document.getElementById("yDisplay");


/*
   Optional elements.

   The simulation will still work if
   some of these do not exist.
*/

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
   6. SIMULATION STATE
========================================================= */

const state = {

    /*
       Amplitude A

       This is also the radius of
       the circular motion.
    */
    amplitude: 100,


    /*
       Frequency f
    */
    frequency: 0.5,


    /*
       Angular frequency ω
    */
    omega: TWO_PI * 0.5,


    /*
       Period T
    */
    period: 2,


    /*
       Time t
    */
    time: 0,


    /*
       Phase angle θ

           θ = ωt
    */
    theta: 0,


    /*
       Circular-motion coordinates

           x = A cos θ
           y = A sin θ
    */
    x: 100,
    y: 0,


    /*
       Animation state
    */
    playing: false,
    animationId: null,
    lastTimestamp: null,


    /*
       Show Y-component projection
    */
    showYComponent: true

};


/* =========================================================
   7. CANVAS SIZE VARIABLES
========================================================= */

let circularWidth = 0;
let circularHeight = 0;

let shmWidth = 0;
let shmHeight = 0;

let graphWidth = 0;
let graphHeight = 0;


/* =========================================================
   8. NUMBER FORMAT
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

    return Number(value).toFixed(
        decimals
    );
}


/* =========================================================
   9. ANGLE FORMAT
========================================================= */

function formatAngle(
    radians
) {

    let degrees =
        radians * 180 / Math.PI;

    degrees =
        ((degrees % 360) + 360) % 360;

    return `${formatNumber(
        degrees,
        0
    )}°`;
}


/* =========================================================
   10. READ SLIDER VALUES
========================================================= */

function readControls() {

    /*
       AMPLITUDE
    */

    if (amplitudeSlider) {

        const value =
            parseFloat(
                amplitudeSlider.value
            );

        if (
            Number.isFinite(value)
        ) {

            state.amplitude =
                Math.max(
                    MIN_AMPLITUDE,
                    Math.min(
                        MAX_AMPLITUDE,
                        value
                    )
                );

        }
    }


    /*
       FREQUENCY
    */

    if (frequencySlider) {

        const value =
            parseFloat(
                frequencySlider.value
            );

        if (
            Number.isFinite(value)
        ) {

            state.frequency =
                Math.max(
                    MIN_FREQUENCY,
                    Math.min(
                        MAX_FREQUENCY,
                        value
                    )
                );

        }
    }


    /*
       ANGULAR FREQUENCY

           ω = 2πf
    */

    state.omega =
        TWO_PI *
        state.frequency;


    /*
       PERIOD

           T = 1/f
    */

    state.period =
        state.frequency > 0
            ? 1 / state.frequency
            : 0;


    /*
       Y-COMPONENT TOGGLE
    */

    if (yComponentToggle) {

        state.showYComponent =
            yComponentToggle.checked;

    }


    calculateMotion();

}


/* =========================================================
   11. CALCULATE MOTION
========================================================= */

function calculateMotion() {

    /*
       Phase:

           θ = ωt
    */

    state.theta =
        state.omega *
        state.time;


    /*
       Keep θ within one revolution.

       This does NOT change the physical
       motion because sin/cos are periodic.
    */

    const displayTheta =
        state.theta % TWO_PI;


    /*
       Circular motion:

           x = A cos θ

           y = A sin θ

       The Y component is used for SHM.
    */

    state.x =
        state.amplitude *
        Math.cos(
            displayTheta
        );

    state.y =
        state.amplitude *
        Math.sin(
            displayTheta
        );

}


/* =========================================================
   12. GET DISPLAY PHASE
========================================================= */

function getDisplayTheta() {

    let theta =
        state.theta % TWO_PI;

    if (
        theta < 0
    ) {
        theta += TWO_PI;
    }

    return theta;

}


/* =========================================================
   13. GET GRAPH DURATION
========================================================= */

function getGraphDuration() {

    /*
       Exactly GRAPH_PERIODS complete periods.

           duration = nT
    */

    if (
        state.period <= 0
    ) {
        return 1;
    }

    return (
        GRAPH_PERIODS *
        state.period
    );

}


/* =========================================================
   14. SHM EQUATION
========================================================= */

function getSHMDisplacement(
    time
) {

    /*
       THE CENTRAL PHYSICS EQUATION

           y = A sin(ωt)

       This function is used by the graph.

       The circular-motion particle uses
       the same equation for its Y-coordinate.

       Therefore they can never become
       physically inconsistent.
    */

    return (
        state.amplitude *
        Math.sin(
            state.omega *
            time
        )
    );

}


/* =========================================================
   15. CLEAR CANVAS
========================================================= */

function clearCanvas(
    ctx,
    width,
    height
) {

    if (!ctx) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

}


/* =========================================================
   16. DRAW COMMON GRID
========================================================= */

function drawGrid(
    ctx,
    width,
    height
) {

    if (!ctx) {
        return;
    }

    /*
       IMPORTANT:

       Grid coordinates are based on the
       canvas centre.

       Therefore the horizontal x-axis
       is always exactly at 50% height.
    */

    const centerX =
        width / 2;

    const centerY =
        height / 2;


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
        let x = centerX - GRID_SIZE;
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
        let y = centerY - GRID_SIZE;
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
   17. DRAW ARROW
========================================================= */

function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    width = 3
) {

    if (!ctx) {
        return;
    }


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


    const angle =
        Math.atan2(
            dy,
            dx
        );


    const head =
        9;


    ctx.save();

    ctx.strokeStyle =
        color;

    ctx.fillStyle =
        color;

    ctx.lineWidth =
        width;

    ctx.lineCap =
        "round";

    ctx.lineJoin =
        "round";


    /*
       Shaft
    */

    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.stroke();


    /*
       Arrow head
    */

    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );

    ctx.lineTo(
        x2 -
        head *
        Math.cos(
            angle - Math.PI / 6
        ),
        y2 -
        head *
        Math.sin(
            angle - Math.PI / 6
        )
    );

    ctx.lineTo(
        x2 -
        head *
        Math.cos(
            angle + Math.PI / 6
        ),
        y2 -
        head *
        Math.sin(
            angle + Math.PI / 6
        )
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();

}


/* =========================================================
   18. UPDATE DISPLAY VALUES
========================================================= */

function updateDisplays() {

    const A =
        state.amplitude;

    const f =
        state.frequency;

    const omega =
        state.omega;

    const T =
        state.period;

    const theta =
        getDisplayTheta();

    const y =
        state.y;


    /*
       Amplitude
    */

    if (amplitudeDisplay) {

        amplitudeDisplay.textContent =
            `A = ${formatNumber(
                A,
                0
            )}`;

    }

    if (amplitudeValue) {

        amplitudeValue.textContent =
            formatNumber(
                A,
                0
            );

    }

    if (valueAmplitude) {

        valueAmplitude.textContent =
            formatNumber(
                A,
                0
            );

    }


    /*
       Frequency
    */

    if (frequencyDisplay) {

        frequencyDisplay.textContent =
            `f = ${formatNumber(
                f,
                2
            )} Hz`;

    }

    if (frequencyValue) {

        frequencyValue.textContent =
            formatNumber(
                f,
                2
            );

    }

    if (valueFrequency) {

        valueFrequency.textContent =
            `${formatNumber(
                f,
                2
            )} Hz`;

    }


    /*
       Angular frequency
    */

    if (omegaDisplay) {

        omegaDisplay.textContent =
            `ω = ${formatNumber(
                omega,
                2
            )} rad/s`;

    }

    if (valueOmega) {

        valueOmega.textContent =
            `${formatNumber(
                omega,
                2
            )} rad/s`;

    }


    /*
       Period
    */

    if (periodDisplay) {

        periodDisplay.textContent =
            `T = ${formatNumber(
                T,
                2
            )} s`;

    }

    if (valuePeriod) {

        valuePeriod.textContent =
            `${formatNumber(
                T,
                2
            )} s`;

    }


    /*
       Phase angle
    */

    if (angleDisplay) {

        angleDisplay.textContent =
            `θ = ${formatAngle(
                theta
            )}`;

    }

    if (valueTheta) {

        valueTheta.textContent =
            formatAngle(
                theta
            );

    }


    /*
       Displacement
    */

    if (yDisplay) {

        yDisplay.textContent =
            `y = ${formatNumber(
                y,
                1
            )}`;

    }

    if (valueY) {

        valueY.textContent =
            `${formatNumber(
                y,
                1
            )}`;

    }

}


/* =========================================================
   19. SET CANVAS RESOLUTION
========================================================= */

function setupCanvas(
    canvas,
    ctx,
    width,
    height
) {

    if (
        !canvas ||
        !ctx
    ) {
        return;
    }


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        Math.round(
            width * dpr
        );

    canvas.height =
        Math.round(
            height * dpr
        );


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
   20. RESIZE ALL CANVASES
========================================================= */

function resizeAllCanvases() {

    /*
       CIRCULAR MOTION
    */

    if (circularCanvas) {

        circularWidth =
            circularCanvas.clientWidth ||
            400;

        circularHeight =
            circularCanvas.clientHeight ||
            circularWidth;


        setupCanvas(
            circularCanvas,
            circularCtx,
            circularWidth,
            circularHeight
        );

    }


    /*
       SHM
    */

    if (shmCanvas) {

        shmWidth =
            shmCanvas.clientWidth ||
            400;

        shmHeight =
            shmCanvas.clientHeight ||
            shmWidth;


        setupCanvas(
            shmCanvas,
            shmCtx,
            shmWidth,
            shmHeight
        );

    }


    /*
       GRAPH

       IMPORTANT:
       Do NOT assume graphCanvas is square.
    */

    if (graphCanvas) {

        graphWidth =
            graphCanvas.clientWidth ||
            700;

        graphHeight =
            graphCanvas.clientHeight ||
            350;


        setupCanvas(
            graphCanvas,
            graphCtx,
            graphWidth,
            graphHeight
        );

    }


    drawAll();

}


/* =========================================================
   END OF PART 1
========================================================= */

/* =========================================================
   PART 2 — CIRCULAR MOTION
========================================================= */


/* =========================================================
   21. DRAW CIRCULAR MOTION
========================================================= */

function drawCircularMotion() {

    if (
        !circularCtx ||
        circularWidth <= 0 ||
        circularHeight <= 0
    ) {
        return;
    }


    /* -----------------------------------------------------
       Clear canvas
    ----------------------------------------------------- */

    clearCanvas(
        circularCtx,
        circularWidth,
        circularHeight
    );


    /* -----------------------------------------------------
       Centre of circular motion

       IMPORTANT:
       The horizontal x-axis is at exactly
       half the canvas height.
    ----------------------------------------------------- */

    const centerX =
        circularWidth / 2;

    const centerY =
        circularHeight / 2;


    /* -----------------------------------------------------
       Radius

           R = A
    ----------------------------------------------------- */

    const radius =
        Math.min(
            state.amplitude,
            Math.min(
                circularWidth,
                circularHeight
            ) * 0.42
        );


    /*
       Use the same scale factor for the
       actual circular position.

       This allows the amplitude slider
       to visibly change the radius while
       keeping the circle inside the canvas.
    */

    const scale =
        state.amplitude !== 0
            ? radius /
              state.amplitude
            : 1;


    const circularX =
        state.x * scale;

    const circularY =
        state.y * scale;


    const particleX =
        centerX +
        circularX;

    const particleY =
        centerY -
        circularY;


    /* =====================================================
       GRID
    ===================================================== */

    drawGrid(
        circularCtx,
        circularWidth,
        circularHeight
    );


    /* =====================================================
       X-AXIS
    ===================================================== */

    circularCtx.save();

    circularCtx.strokeStyle =
        "#64748b";

    circularCtx.lineWidth =
        2;


    circularCtx.beginPath();

    circularCtx.moveTo(
        0,
        centerY
    );

    circularCtx.lineTo(
        circularWidth,
        centerY
    );

    circularCtx.stroke();


    /* =====================================================
       Y-AXIS
    ===================================================== */

    circularCtx.beginPath();

    circularCtx.moveTo(
        centerX,
        0
    );

    circularCtx.lineTo(
        centerX,
        circularHeight
    );

    circularCtx.stroke();

    circularCtx.restore();


    /* =====================================================
       CIRCULAR PATH
    ===================================================== */

    circularCtx.save();

    circularCtx.beginPath();

    circularCtx.arc(
        centerX,
        centerY,
        radius,
        0,
        TWO_PI
    );


    circularCtx.strokeStyle =
        "#2563eb";

    circularCtx.lineWidth =
        3;

    circularCtx.stroke();

    circularCtx.restore();


    /* =====================================================
       RADIUS VECTOR
    ===================================================== */

    /*
       The radius vector is always:

           R = A

       in the physics model.

       Its screen length is scaled only
       to keep it inside the canvas.
    */

    drawArrow(
        circularCtx,
        centerX,
        centerY,
        particleX,
        particleY,
        "#dc2626",
        3
    );


    /* =====================================================
       RADIUS LABEL
    ===================================================== */

    const radiusLabelX =
        centerX +
        circularX * 0.55;

    const radiusLabelY =
        centerY +
        circularY * 0.55;


    circularCtx.save();

    circularCtx.fillStyle =
        "#dc2626";

    circularCtx.font =
        "bold 13px Arial";

    circularCtx.textAlign =
        "center";

    circularCtx.fillText(
        `A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        radiusLabelX,
        radiusLabelY - 8
    );

    circularCtx.restore();


    /* =====================================================
       PARTICLE
    ===================================================== */

    circularCtx.save();

    circularCtx.beginPath();

    circularCtx.arc(
        particleX,
        particleY,
        8,
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

    circularCtx.restore();


    /* =====================================================
       Y-COMPONENT PROJECTION
    ===================================================== */

    /*
       THIS IS THE IMPORTANT PART.

       The SHM is generated from the
       vertical Y-component:

           y = A sin θ

       A horizontal dashed line projects
       the circular particle onto the
       vertical Y-axis.
    */

    if (
        state.showYComponent
    ) {

        circularCtx.save();

        circularCtx.setLineDash([
            6,
            5
        ]);

        circularCtx.strokeStyle =
            "#16a34a";

        circularCtx.lineWidth =
            2;


        circularCtx.beginPath();

        circularCtx.moveTo(
            particleX,
            particleY
        );

        circularCtx.lineTo(
            centerX,
            particleY
        );

        circularCtx.stroke();


        circularCtx.setLineDash([]);

        circularCtx.restore();


        /* -------------------------------------------------
           Projected Y point
        ------------------------------------------------- */

        circularCtx.save();

        circularCtx.beginPath();

        circularCtx.arc(
            centerX,
            particleY,
            6,
            0,
            TWO_PI
        );


        circularCtx.fillStyle =
            "#16a34a";

        circularCtx.fill();

        circularCtx.restore();


        /* -------------------------------------------------
           Y displacement arrow
        ------------------------------------------------- */

        drawArrow(
            circularCtx,
            centerX,
            centerY,
            centerX,
            particleY,
            "#16a34a",
            3
        );


        /* -------------------------------------------------
           Y displacement label
        ------------------------------------------------- */

        circularCtx.save();

        circularCtx.fillStyle =
            "#16a34a";

        circularCtx.font =
            "bold 13px Arial";

        circularCtx.textAlign =
            "left";


        let yLabelY =
            (
                centerY +
                particleY
            ) / 2;


        if (
            Math.abs(
                state.y
            ) < 15
        ) {

            yLabelY =
                centerY - 10;

        }


        circularCtx.fillText(
            `y = ${formatNumber(
                state.y,
                1
            )}`,
            centerX + 10,
            yLabelY
        );


        circularCtx.restore();

    }


    /* =====================================================
       CENTRE POINT
    ===================================================== */

    circularCtx.save();

    circularCtx.beginPath();

    circularCtx.arc(
        centerX,
        centerY,
        5,
        0,
        TWO_PI
    );


    circularCtx.fillStyle =
        "#172033";

    circularCtx.fill();

    circularCtx.restore();


    /* =====================================================
       ANGLE ARC
    ===================================================== */

    if (
        radius > 20
    ) {

        const displayTheta =
            getDisplayTheta();


        circularCtx.save();

        circularCtx.beginPath();


        /*
           Canvas Y direction is downward,
           therefore physical positive θ
           is represented using -θ.
        */

        circularCtx.arc(
            centerX,
            centerY,
            Math.min(
                38,
                radius * 0.35
            ),
            0,
            -displayTheta,
            false
        );


        circularCtx.strokeStyle =
            "#7c3aed";

        circularCtx.lineWidth =
            2;

        circularCtx.stroke();

        circularCtx.restore();


        /* -------------------------------------------------
           Angle label
        ------------------------------------------------- */

        circularCtx.save();

        circularCtx.fillStyle =
            "#7c3aed";

        circularCtx.font =
            "bold 12px Arial";

        circularCtx.textAlign =
            "center";


        circularCtx.fillText(
            `θ = ${formatAngle(
                displayTheta
            )}`,
            centerX + 48,
            centerY - 22
        );


        circularCtx.restore();

    }


    /* =====================================================
       AXIS LABELS
    ===================================================== */

    circularCtx.save();

    circularCtx.fillStyle =
        "#475569";

    circularCtx.font =
        "bold 13px Arial";


    circularCtx.textAlign =
        "right";

    circularCtx.fillText(
        "x",
        circularWidth - 8,
        centerY - 8
    );


    circularCtx.textAlign =
        "center";

    circularCtx.fillText(
        "y",
        centerX + 15,
        16
    );


    circularCtx.restore();


    /* =====================================================
       TITLE
    ===================================================== */

    circularCtx.save();

    circularCtx.fillStyle =
        "#172033";

    circularCtx.font =
        "bold 15px Arial";

    circularCtx.textAlign =
        "center";

    circularCtx.fillText(
        "Uniform Circular Motion",
        centerX,
        22
    );

    circularCtx.restore();


    /* =====================================================
       PHYSICS INFORMATION
    ===================================================== */

    circularCtx.save();

    circularCtx.fillStyle =
        "#475569";

    circularCtx.font =
        "12px Arial";

    circularCtx.textAlign =
        "left";


    circularCtx.fillText(
        `R = A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        10,
        circularHeight - 30
    );


    circularCtx.fillText(
        `y = A sin(θ)`,
        10,
        circularHeight - 12
    );


    circularCtx.restore();

}


/* =========================================================
   22. DRAW SHM MOTION DIAGRAM
========================================================= */

function drawSHM() {

    if (
        !shmCtx ||
        shmWidth <= 0 ||
        shmHeight <= 0
    ) {
        return;
    }


    /* -----------------------------------------------------
       Clear
    ----------------------------------------------------- */

    clearCanvas(
        shmCtx,
        shmWidth,
        shmHeight
    );


    /* -----------------------------------------------------
       Centre

       x-axis is exactly at 50% height.
    ----------------------------------------------------- */

    const centerX =
        shmWidth / 2;

    const centerY =
        shmHeight / 2;


    /* =====================================================
       GRID
    ===================================================== */

    drawGrid(
        shmCtx,
        shmWidth,
        shmHeight
    );


    /* =====================================================
       AXES
    ===================================================== */

    shmCtx.save();

    shmCtx.strokeStyle =
        "#64748b";

    shmCtx.lineWidth =
        2;


    /*
       Horizontal x-axis
    */

    shmCtx.beginPath();

    shmCtx.moveTo(
        0,
        centerY
    );

    shmCtx.lineTo(
        shmWidth,
        centerY
    );

    shmCtx.stroke();


    /*
       Vertical y-axis
    */

    shmCtx.beginPath();

    shmCtx.moveTo(
        centerX,
        0
    );

    shmCtx.lineTo(
        centerX,
        shmHeight
    );

    shmCtx.stroke();


    shmCtx.restore();


    /* =====================================================
       SHM AMPLITUDE SCALE
    ===================================================== */

    /*
       Use the same visual scaling concept
       as the circular motion.

       This means increasing A visibly
       increases the SHM range.
    */

    const maxRadius =
        Math.min(
            shmWidth,
            shmHeight
        ) * 0.42;


    const shmScale =
        state.amplitude !== 0
            ? maxRadius /
              state.amplitude
            : 1;


    const visualAmplitude =
        state.amplitude *
        shmScale;


    /* =====================================================
       +A LINE
    ===================================================== */

    const topY =
        centerY -
        visualAmplitude;


    const bottomY =
        centerY +
        visualAmplitude;


    shmCtx.save();

    shmCtx.strokeStyle =
        "#dc2626";

    shmCtx.lineWidth =
        2;


    shmCtx.beginPath();

    shmCtx.moveTo(
        centerX - 14,
        topY
    );

    shmCtx.lineTo(
        centerX + 14,
        topY
    );

    shmCtx.stroke();


    /*
       -A line
    */

    shmCtx.beginPath();

    shmCtx.moveTo(
        centerX - 14,
        bottomY
    );

    shmCtx.lineTo(
        centerX + 14,
        bottomY
    );

    shmCtx.stroke();


    shmCtx.restore();


    /* =====================================================
       +A / -A LABELS
    ===================================================== */

    shmCtx.save();

    shmCtx.fillStyle =
        "#dc2626";

    shmCtx.font =
        "bold 13px Arial";

    shmCtx.textAlign =
        "left";


    shmCtx.fillText(
        `+A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        centerX + 20,
        topY + 5
    );


    shmCtx.fillText(
        `−A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        centerX + 20,
        bottomY + 5
    );


    shmCtx.restore();


    /* =====================================================
       CURRENT SHM POSITION
    ===================================================== */

    /*
       Use exactly the same Y-component:

           y = A sin(ωt)
    */

    const currentY =
        centerY -
        state.y *
        shmScale;


    /* =====================================================
       CURRENT DISPLACEMENT ARROW
    ===================================================== */

    drawArrow(
        shmCtx,
        centerX,
        centerY,
        centerX,
        currentY,
        "#16a34a",
        3
    );


    /* =====================================================
       CURRENT PARTICLE
    ===================================================== */

    shmCtx.save();

    shmCtx.beginPath();

    shmCtx.arc(
        centerX,
        currentY,
        8,
        0,
        TWO_PI
    );


    shmCtx.fillStyle =
        "#16a34a";

    shmCtx.fill();


    shmCtx.strokeStyle =
        "#ffffff";

    shmCtx.lineWidth =
        2;

    shmCtx.stroke();

    shmCtx.restore();


    /* =====================================================
       CURRENT y LABEL
    ===================================================== */

    shmCtx.save();

    shmCtx.fillStyle =
        "#16a34a";

    shmCtx.font =
        "bold 13px Arial";

    shmCtx.textAlign =
        "left";


    let currentLabelY =
        currentY - 12;


    if (
        currentLabelY <
        40
    ) {

        currentLabelY =
            currentY + 22;

    }


    shmCtx.fillText(
        `y = ${formatNumber(
            state.y,
            1
        )}`,
        centerX + 18,
        currentLabelY
    );


    shmCtx.restore();


    /* =====================================================
       EQUATION
    ===================================================== */

    shmCtx.save();

    shmCtx.fillStyle =
        "#2563eb";

    shmCtx.font =
        "bold 14px Arial";

    shmCtx.textAlign =
        "center";


    shmCtx.fillText(
        "y = A sin(ωt)",
        centerX,
        22
    );


    shmCtx.restore();


    /* =====================================================
       AXIS LABELS
    ===================================================== */

    shmCtx.save();

    shmCtx.fillStyle =
        "#475569";

    shmCtx.font =
        "bold 13px Arial";


    shmCtx.textAlign =
        "right";

    shmCtx.fillText(
        "x",
        shmWidth - 8,
        centerY - 8
    );


    shmCtx.textAlign =
        "center";

    shmCtx.fillText(
        "y",
        centerX + 15,
        16
    );


    shmCtx.restore();


    /* =====================================================
       TITLE
    ===================================================== */

    shmCtx.save();

    shmCtx.fillStyle =
        "#172033";

    shmCtx.font =
        "bold 15px Arial";

    shmCtx.textAlign =
        "center";

    shmCtx.fillText(
        "Simple Harmonic Motion",
        centerX,
        shmHeight - 12
    );

    shmCtx.restore();

}


/* =========================================================
   23. DRAW ALL MOTION DIAGRAMS
========================================================= */

function drawMotionDiagrams() {

    drawCircularMotion();

    drawSHM();

}


/* =========================================================
   END OF PART 2
========================================================= */

/* =========================================================
   PART 3 — DISPLACEMENT-TIME GRAPH
========================================================= */


/* =========================================================
   24. GRAPH AREA
========================================================= */

function getGraphArea() {

    /*
       Leave space for:
       - title
       - y-axis labels
       - x-axis labels
    */

    const left =
        55;

    const right =
        graphWidth - 20;

    const top =
        45;

    const bottom =
        graphHeight - 45;


    return {

        left: left,

        right: right,

        top: top,

        bottom: bottom,

        width:
            right - left,

        height:
            bottom - top,

        /*
           ZERO LINE

           Exactly halfway vertically.
        */

        zeroY:
            top +
            (
                bottom - top
            ) / 2

    };

}


/* =========================================================
   25. GRAPH VISUAL AMPLITUDE
========================================================= */

function getGraphVisualAmplitude(
    area
) {

    /*
       IMPORTANT:

       The graph must visibly change height
       when A changes.

       Therefore the amplitude is mapped
       directly into the available graph height.
    */

    const maximumVisualAmplitude =
        area.height * 0.40;


    const amplitudeRange =
        MAX_AMPLITUDE -
        MIN_AMPLITUDE;


    if (
        amplitudeRange <= 0
    ) {

        return maximumVisualAmplitude;

    }


    /*
       Normalize A between 0 and 1.
    */

    const normalized =
        (
            state.amplitude -
            MIN_AMPLITUDE
        ) /
        amplitudeRange;


    /*
       Keep some minimum visible height.
    */

    const minimumVisualAmplitude =
        area.height * 0.15;


    return (
        minimumVisualAmplitude +
        normalized *
        (
            maximumVisualAmplitude -
            minimumVisualAmplitude
        )
    );

}


/* =========================================================
   26. CONVERT TIME → GRAPH X
========================================================= */

function timeToGraphX(
    time,
    area,
    duration
) {

    if (
        duration <= 0
    ) {

        return area.left;

    }


    /*
       Clamp time to graph range.

       This prevents the graph point from
       leaving the graph.
    */

    const normalized =
        Math.max(
            0,
            Math.min(
                1,
                time / duration
            )
        );


    return (
        area.left +
        normalized *
        area.width
    );

}


/* =========================================================
   27. CONVERT DISPLACEMENT → GRAPH Y
========================================================= */

function displacementToGraphY(
    displacement,
    area,
    visualAmplitude
) {

    /*
       Normalize:

           displacement / A
    */

    const normalized =
        state.amplitude !== 0
            ? displacement /
              state.amplitude
            : 0;


    /*
       Screen Y is inverted.

       Positive displacement
       goes UP.

       Negative displacement
       goes DOWN.
    */

    return (
        area.zeroY -
        normalized *
        visualAmplitude
    );

}


/* =========================================================
   28. DRAW GRAPH GRID
========================================================= */

function drawGraphGrid(
    ctx,
    area,
    duration
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
       Vertical grid.

       Use the same spacing concept
       as the circular-motion grid.
    */

    const verticalSpacing =
        Math.max(
            25,
            area.width /
            (
                GRAPH_PERIODS *
                4
            )
        );


    for (
        let x = area.left;
        x <= area.right;
        x += verticalSpacing
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            area.top
        );

        ctx.lineTo(
            x,
            area.bottom
        );

        ctx.stroke();

    }


    /*
       Horizontal grid.

       Use GRID_SIZE where possible.
    */

    const horizontalSpacing =
        GRID_SIZE;


    for (
        let y =
            area.zeroY;
        y <= area.bottom;
        y += horizontalSpacing
    ) {

        ctx.beginPath();

        ctx.moveTo(
            area.left,
            y
        );

        ctx.lineTo(
            area.right,
            y
        );

        ctx.stroke();

    }


    for (
        let y =
            area.zeroY -
            horizontalSpacing;
        y >= area.top;
        y -= horizontalSpacing
    ) {

        ctx.beginPath();

        ctx.moveTo(
            area.left,
            y
        );

        ctx.lineTo(
            area.right,
            y
        );

        ctx.stroke();

    }


    ctx.restore();

}


/* =========================================================
   29. DRAW GRAPH AXES
========================================================= */

function drawGraphAxes(
    ctx,
    area
) {

    if (!ctx) {
        return;
    }


    ctx.save();

    ctx.strokeStyle =
        "#475569";

    ctx.lineWidth =
        2;


    /*
       Horizontal axis.

       THIS IS THE SHM EQUILIBRIUM AXIS.
    */

    ctx.beginPath();

    ctx.moveTo(
        area.left,
        area.zeroY
    );

    ctx.lineTo(
        area.right,
        area.zeroY
    );

    ctx.stroke();


    /*
       Vertical axis.
    */

    ctx.beginPath();

    ctx.moveTo(
        area.left,
        area.top
    );

    ctx.lineTo(
        area.left,
        area.bottom
    );

    ctx.stroke();


    /*
       Arrow on x-axis.
    */

    drawArrow(
        ctx,
        area.left,
        area.zeroY,
        area.right,
        area.zeroY,
        "#475569",
        2
    );


    /*
       Arrow on y-axis.
    */

    drawArrow(
        ctx,
        area.left,
        area.zeroY,
        area.left,
        area.top,
        "#475569",
        2
    );


    ctx.restore();

}


/* =========================================================
   30. DRAW SINE WAVE
========================================================= */

function drawGraphWave(
    ctx,
    area,
    duration,
    visualAmplitude
) {

    if (!ctx) {
        return;
    }


    /*
       Number of samples.

       More samples = smoother sine wave.
    */

    const samples =
        Math.max(
            500,
            Math.floor(
                area.width * 2
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
           Time across the graph.

           The graph always covers:

               0 → GRAPH_PERIODS × T
        */

        const time =
            (
                i /
                samples
            ) *
            duration;


        /*
           THE SAME SHM EQUATION:

               y = A sin(ωt)
        */

        const displacement =
            getSHMDisplacement(
                time
            );


        /*
           Convert to screen coordinates.
        */

        const x =
            timeToGraphX(
                time,
                area,
                duration
            );


        const y =
            displacementToGraphY(
                displacement,
                area,
                visualAmplitude
            );


        if (
            i === 0
        ) {

            ctx.moveTo(
                x,
                y
            );

        } else {

            ctx.lineTo(
                x,
                y
            );

        }

    }


    /*
       Wave appearance.
    */

    ctx.strokeStyle =
        "#2563eb";

    ctx.lineWidth =
        3;

    ctx.lineJoin =
        "round";

    ctx.lineCap =
        "round";

    ctx.stroke();

    ctx.restore();

}


/* =========================================================
   31. DRAW GRAPH AMPLITUDE LABELS
========================================================= */

function drawGraphAmplitudeLabels(
    ctx,
    area,
    visualAmplitude
) {

    if (!ctx) {
        return;
    }


    const positiveY =
        area.zeroY -
        visualAmplitude;


    const negativeY =
        area.zeroY +
        visualAmplitude;


    ctx.save();


    /*
       +A
    */

    ctx.fillStyle =
        "#dc2626";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "right";


    ctx.fillText(
        `+A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        area.left - 7,
        positiveY + 4
    );


    /*
       0
    */

    ctx.fillStyle =
        "#475569";

    ctx.fillText(
        "0",
        area.left - 7,
        area.zeroY + 4
    );


    /*
       -A
    */

    ctx.fillStyle =
        "#dc2626";

    ctx.fillText(
        `−A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        area.left - 7,
        negativeY + 4
    );


    ctx.restore();

}


/* =========================================================
   32. DRAW PERIOD MARKERS
========================================================= */

function drawGraphPeriodMarkers(
    ctx,
    area,
    duration
) {

    if (!ctx) {
        return;
    }


    ctx.save();

    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth =
        1;

    ctx.setLineDash([
        4,
        5
    ]);


    /*
       Draw vertical lines at:

           0
           T
           2T
           3T...
    */

    for (
        let i = 0;
        i <= GRAPH_PERIODS;
        i++
    ) {

        const time =
            i *
            state.period;


        const x =
            timeToGraphX(
                time,
                area,
                duration
            );


        ctx.beginPath();

        ctx.moveTo(
            x,
            area.top
        );

        ctx.lineTo(
            x,
            area.bottom
        );

        ctx.stroke();

    }


    ctx.setLineDash([]);

    ctx.restore();


    /*
       Period labels.
    */

    ctx.save();

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "bold 11px Arial";

    ctx.textAlign =
        "center";


    for (
        let i = 0;
        i <= GRAPH_PERIODS;
        i++
    ) {

        const time =
            i *
            state.period;


        const x =
            timeToGraphX(
                time,
                area,
                duration
            );


        let label;


        if (
            i === 0
        ) {

            label =
                "0";

        } else if (
            i === 1
        ) {

            label =
                "T";

        } else {

            label =
                `${i}T`;

        }


        ctx.fillText(
            label,
            x,
            area.top - 8
        );

    }


    ctx.restore();

}


/* =========================================================
   33. DRAW CURRENT GRAPH POINT
========================================================= */

function drawGraphCurrentPoint(
    ctx,
    area,
    duration,
    visualAmplitude
) {

    if (!ctx) {
        return;
    }


    /*
       Current time must wrap around the
       displayed graph duration.

       This guarantees the point always
       remains ON the displayed graph.
    */

    let graphTime =
        state.time %
        duration;


    if (
        graphTime < 0
    ) {

        graphTime +=
            duration;

    }


    /*
       Current X position.
    */

    const currentX =
        timeToGraphX(
            graphTime,
            area,
            duration
        );


    /*
       IMPORTANT:

       Use the SAME equation as the wave.

           y = A sin(ωt)
    */

    const currentDisplacement =
        getSHMDisplacement(
            state.time
        );


    /*
       Current graph Y.
    */

    const currentY =
        displacementToGraphY(
            currentDisplacement,
            area,
            visualAmplitude
        );


    /* =====================================================
       VERTICAL TIME LINE
    ===================================================== */

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(
        currentX,
        area.top
    );

    ctx.lineTo(
        currentX,
        area.bottom
    );


    ctx.strokeStyle =
        "#f59e0b";

    ctx.lineWidth =
        1.5;

    ctx.setLineDash([
        5,
        4
    ]);

    ctx.stroke();

    ctx.setLineDash([]);

    ctx.restore();


    /* =====================================================
       CURRENT DISPLACEMENT LINE
    ===================================================== */

    ctx.save();

    ctx.beginPath();

    ctx.moveTo(
        currentX,
        area.zeroY
    );

    ctx.lineTo(
        currentX,
        currentY
    );


    ctx.strokeStyle =
        "#16a34a";

    ctx.lineWidth =
        2;

    ctx.setLineDash([
        4,
        3
    ]);

    ctx.stroke();

    ctx.setLineDash([]);

    ctx.restore();


    /* =====================================================
       CURRENT POINT
    ===================================================== */

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        currentX,
        currentY,
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


    /* =====================================================
       CURRENT y LABEL
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#16a34a";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";


    let labelY =
        currentY - 12;


    if (
        labelY <
        area.top + 15
    ) {

        labelY =
            currentY + 20;

    }


    ctx.fillText(
        `y = ${formatNumber(
            currentDisplacement,
            1
        )}`,
        currentX,
        labelY
    );


    ctx.restore();

}


/* =========================================================
   34. DRAW GRAPH LABELS
========================================================= */

function drawGraphLabels(
    ctx,
    area
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /*
       Equation
    */

    ctx.fillStyle =
        "#2563eb";

    ctx.font =
        "bold 15px Arial";

    ctx.textAlign =
        "left";


    ctx.fillText(
        "y = A sin(ωt)",
        area.left + 8,
        area.top + 18
    );


    /*
       Live amplitude
    */

    ctx.fillStyle =
        "#dc2626";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "right";


    ctx.fillText(
        `A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        area.right,
        area.top + 17
    );


    /*
       Frequency
    */

    ctx.fillStyle =
        "#475569";

    ctx.font =
        "12px Arial";


    ctx.fillText(
        `f = ${formatNumber(
            state.frequency,
            2
        )} Hz`,
        area.right,
        area.top + 33
    );


    /*
       Period
    */

    ctx.fillText(
        `T = ${formatNumber(
            state.period,
            2
        )} s`,
        area.right,
        area.top + 49
    );


    /*
       x-axis label
    */

    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 13px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "time, t",
        (
            area.left +
            area.right
        ) / 2,
        area.bottom + 35
    );


    /*
       y-axis label
    */

    ctx.save();

    ctx.translate(
        15,
        (
            area.top +
            area.bottom
        ) / 2
    );


    ctx.rotate(
        -Math.PI / 2
    );


    ctx.fillText(
        "displacement, y",
        0,
        0
    );


    ctx.restore();


    ctx.restore();

}


/* =========================================================
   35. DRAW TIME LABELS
========================================================= */

function drawGraphTimeLabels(
    ctx,
    area,
    duration
) {

    if (!ctx) {
        return;
    }


    ctx.save();

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "11px Arial";

    ctx.textAlign =
        "center";


    /*
       Half-period intervals.

       This makes the graph easier to read:

           0
           T/2
           T
           3T/2
           2T
    */

    const intervals =
        GRAPH_PERIODS * 2;


    for (
        let i = 0;
        i <= intervals;
        i++
    ) {

        const time =
            (
                i /
                intervals
            ) *
            duration;


        const x =
            timeToGraphX(
                time,
                area,
                duration
            );


        ctx.fillText(
            `${formatNumber(
                time,
                2
            )} s`,
            x,
            area.bottom + 18
        );

    }


    ctx.restore();

}


/* =========================================================
   36. DRAW COMPLETE GRAPH
========================================================= */

function drawGraph() {

    if (
        !graphCtx ||
        graphWidth <= 0 ||
        graphHeight <= 0
    ) {

        return;

    }


    /*
       Clear.
    */

    clearCanvas(
        graphCtx,
        graphWidth,
        graphHeight
    );


    /*
       Get graph dimensions.
    */

    const area =
        getGraphArea();


    /*
       EXACTLY complete periods.
    */

    const duration =
        getGraphDuration();


    /*
       Visual amplitude.

       This changes whenever the
       amplitude slider changes.
    */

    const visualAmplitude =
        getGraphVisualAmplitude(
            area
        );


    /* -----------------------------------------------------
       Grid
    ----------------------------------------------------- */

    drawGraphGrid(
        graphCtx,
        area,
        duration
    );


    /* -----------------------------------------------------
       Axes
    ----------------------------------------------------- */

    drawGraphAxes(
        graphCtx,
        area
    );


    /* -----------------------------------------------------
       Period markers
    ----------------------------------------------------- */

    drawGraphPeriodMarkers(
        graphCtx,
        area,
        duration
    );


    /* -----------------------------------------------------
       Sine wave
    ----------------------------------------------------- */

    drawGraphWave(
        graphCtx,
        area,
        duration,
        visualAmplitude
    );


    /* -----------------------------------------------------
       Current point
    ----------------------------------------------------- */

    drawGraphCurrentPoint(
        graphCtx,
        area,
        duration,
        visualAmplitude
    );


    /* -----------------------------------------------------
       +A / -A labels
    ----------------------------------------------------- */

    drawGraphAmplitudeLabels(
        graphCtx,
        area,
        visualAmplitude
    );


    /* -----------------------------------------------------
       Labels
    ----------------------------------------------------- */

    drawGraphLabels(
        graphCtx,
        area
    );


    /* -----------------------------------------------------
       Time labels
    ----------------------------------------------------- */

    drawGraphTimeLabels(
        graphCtx,
        area,
        duration
    );

}


/* =========================================================
   END OF PART 3
========================================================= */

/* =========================================================
   PART 4 — ANIMATION, CONTROLS & INITIALIZATION
========================================================= */


/* =========================================================
   37. UPDATE PHYSICS
========================================================= */

function updatePhysics(
    deltaTime
) {

    if (
        !state.playing
    ) {

        return;

    }


    /*
       Advance time.

           t = t + Δt
    */

    state.time +=
        deltaTime;


    /*
       Keep time manageable.

       We wrap after the graph duration
       because the graph itself contains
       a fixed number of complete periods.
    */

    const duration =
        getGraphDuration();


    if (
        duration > 0 &&
        state.time >= duration
    ) {

        state.time =
            state.time %
            duration;

    }


    /*
       Recalculate:

           θ = ωt

           x = A cos θ

           y = A sin θ
    */

    calculateMotion();

}


/* =========================================================
   38. DRAW EVERYTHING
========================================================= */

function drawAll() {

    /*
       Circular motion
    */

    drawCircularMotion();


    /*
       SHM motion
    */

    drawSHM();


    /*
       Displacement-time graph
    */

    drawGraph();


    /*
       Numerical displays
    */

    updateDisplays();

}


/* =========================================================
   39. ANIMATION LOOP
========================================================= */

function animationLoop(
    timestamp
) {

    /*
       First frame after starting.
    */

    if (
        state.lastTimestamp === null
    ) {

        state.lastTimestamp =
            timestamp;

    }


    /*
       Convert milliseconds
       to seconds.
    */

    let deltaTime =
        (
            timestamp -
            state.lastTimestamp
        ) / 1000;


    state.lastTimestamp =
        timestamp;


    /*
       Avoid a huge jump if the browser
       temporarily stops rendering.
    */

    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    /*
       Physics update.
    */

    updatePhysics(
        deltaTime
    );


    /*
       Redraw.

       All three visualizations are
       therefore updated from the same
       state.time.
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
   40. START ANIMATION
========================================================= */

function startAnimation() {

    if (
        state.animationId !== null
    ) {

        return;

    }


    state.lastTimestamp =
        null;


    state.animationId =
        requestAnimationFrame(
            animationLoop
        );

}


/* =========================================================
   41. PLAY / PAUSE
========================================================= */

function togglePlay() {

    state.playing =
        !state.playing;


    /*
       Prevent a large time jump when
       Play is pressed after being paused.
    */

    if (
        state.playing
    ) {

        state.lastTimestamp =
            null;

    }


    updatePlayButton();

}


/* =========================================================
   42. UPDATE PLAY BUTTON
========================================================= */

function updatePlayButton() {

    if (
        !playButton
    ) {

        return;

    }


    if (
        state.playing
    ) {

        playButton.textContent =
            "Pause";


        playButton.setAttribute(
            "aria-label",
            "Pause simulation"
        );


        if (
            simulationStatus
        ) {

            simulationStatus.textContent =
                "Running";

        }

    } else {

        playButton.textContent =
            "Play";


        playButton.setAttribute(
            "aria-label",
            "Play simulation"
        );


        if (
            simulationStatus
        ) {

            simulationStatus.textContent =
                "Paused";

        }

    }

}


/* =========================================================
   43. RESET
========================================================= */

function resetSimulation() {

    /*
       Pause.
    */

    state.playing =
        false;


    /*
       Reset to t = 0.

       Therefore:

           θ = 0

           x = A

           y = 0
    */

    state.time =
        0;


    state.theta =
        0;


    /*
       Re-read current slider values.

       This means Reset does NOT change the
       user's chosen amplitude/frequency.
    */

    readControls();


    calculateMotion();


    updatePlayButton();

    drawAll();

}


/* =========================================================
   44. AMPLITUDE INPUT
========================================================= */

function handleAmplitudeInput() {

    if (
        !amplitudeSlider
    ) {

        return;

    }


    const value =
        parseFloat(
            amplitudeSlider.value
        );


    if (
        !Number.isFinite(value)
    ) {

        return;

    }


    /*
       Update A immediately.
    */

    state.amplitude =
        Math.max(
            MIN_AMPLITUDE,
            Math.min(
                MAX_AMPLITUDE,
                value
            )
        );


    /*
       Recalculate the same phase
       with the new amplitude.

       Thus:

           x = A cos θ

           y = A sin θ
    */

    calculateMotion();


    /*
       Redraw immediately.

       This is important.

       The graph height changes while
       the slider is being dragged.
    */

    drawAll();

}


/* =========================================================
   45. FREQUENCY INPUT
========================================================= */

function handleFrequencyInput() {

    if (
        !frequencySlider
    ) {

        return;

    }


    const value =
        parseFloat(
            frequencySlider.value
        );


    if (
        !Number.isFinite(value)
    ) {

        return;

    }


    /*
       Update frequency.
    */

    state.frequency =
        Math.max(
            MIN_FREQUENCY,
            Math.min(
                MAX_FREQUENCY,
                value
            )
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
        state.frequency > 0
            ? 1 /
              state.frequency
            : 0;


    /*
       Keep the current time.

       The phase therefore changes naturally:

           θ = ωt
    */

    calculateMotion();


    /*
       The graph duration changes automatically:

           duration = GRAPH_PERIODS × T
    */

    drawAll();

}


/* =========================================================
   46. Y-COMPONENT TOGGLE
========================================================= */

function handleYComponentToggle() {

    if (
        yComponentToggle
    ) {

        state.showYComponent =
            yComponentToggle.checked;

    }


    drawAll();

}


/* =========================================================
   47. SETUP CONTROLS
========================================================= */

function setupControls() {

    /*
       PLAY
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
       RESET
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
       AMPLITUDE

       "input" is used instead of only
       "change" so the graph responds
       continuously while dragging.
    */

    if (
        amplitudeSlider
    ) {

        amplitudeSlider.addEventListener(
            "input",
            handleAmplitudeInput
        );


        amplitudeSlider.addEventListener(
            "change",
            handleAmplitudeInput
        );

    }


    /*
       FREQUENCY
    */

    if (
        frequencySlider
    ) {

        frequencySlider.addEventListener(
            "input",
            handleFrequencyInput
        );


        frequencySlider.addEventListener(
            "change",
            handleFrequencyInput
        );

    }


    /*
       Y COMPONENT
    */

    if (
        yComponentToggle
    ) {

        yComponentToggle.addEventListener(
            "change",
            handleYComponentToggle
        );

    }


    /*
       KEYBOARD CONTROLS

       SPACE = Play/Pause
       R     = Reset
    */

    document.addEventListener(
        "keydown",
        function(event) {

            const activeElement =
                document.activeElement;

            const tag =
                activeElement
                    ? activeElement.tagName
                    : "";


            if (
                event.code === "Space" &&
                tag !== "INPUT" &&
                tag !== "TEXTAREA"
            ) {

                event.preventDefault();

                togglePlay();

            }


            if (
                (
                    event.key === "r" ||
                    event.key === "R"
                ) &&
                tag !== "INPUT" &&
                tag !== "TEXTAREA"
            ) {

                resetSimulation();

            }

        }
    );

}


/* =========================================================
   48. RESIZE HANDLER
========================================================= */

let resizeTimer =
    null;


function handleResize() {

    clearTimeout(
        resizeTimer
    );


    resizeTimer =
        setTimeout(
            function() {

                resizeAllCanvases();

            },
            100
        );

}


/* =========================================================
   49. WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    handleResize
);


/* =========================================================
   50. PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    function() {

        /*
           If the browser stops updating the
           page, reset the timestamp so that
           the next frame does not jump forward.
        */

        if (
            document.hidden
        ) {

            state.lastTimestamp =
                null;

        }

    }
);


/* =========================================================
   51. INITIALIZE STATE
========================================================= */

function initializeState() {

    /*
       Read initial slider values.
    */

    readControls();


    /*
       Initial position:

           θ = 0

           x = A

           y = 0
    */

    state.time =
        0;

    state.theta =
        0;


    calculateMotion();


    updateDisplays();

}


/* =========================================================
   52. INITIALIZE SIMULATION
========================================================= */

function initializeSimulation() {

    /*
       1. Read initial values
    */

    initializeState();


    /*
       2. Connect buttons/sliders
    */

    setupControls();


    /*
       3. Set canvas sizes
    */

    resizeAllCanvases();


    /*
       4. Draw initial frame
    */

    drawAll();


    /*
       5. Start animation engine

       The simulation starts paused,
       but the animation loop keeps
       rendering the current state.
    */

    startAnimation();

}


/* =========================================================
   53. DOM READY
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
   END OF NEW CLEAN SCRIPT.JS
========================================================= */