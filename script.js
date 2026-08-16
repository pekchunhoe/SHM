/* =========================================================
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION
   NEW COMPLETE SCRIPT.JS
   PART 1 — SETUP + PHYSICS ENGINE

   Main relationship:

       y = A sin(ωt)

   IMPORTANT:
   SHM displacement uses the Y-component only.

       y = A sin θ

   Circular motion:

       x = A cos θ
       y = A sin θ

   Canvas Y-coordinate is inverted when drawing.
========================================================= */


/* =========================================================
   1. CONSTANTS
========================================================= */

const TWO_PI = Math.PI * 2;


/*
   Number of complete periods displayed
   on the displacement-time graph.
*/

const GRAPH_PERIODS = 2;


/*
   Grid spacing.

   Circular-motion and SHM grids use
   the same spacing.
*/

const GRID_SIZE = 25;


/*
   Default values
*/

const DEFAULT_AMPLITUDE = 100;
const DEFAULT_FREQUENCY = 0.5;


/*
   Minimum safe values
*/

const MIN_AMPLITUDE = 1;
const MIN_FREQUENCY = 0.01;


/* =========================================================
   2. CANVAS ELEMENTS
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
   5. DISPLAY ELEMENTS
========================================================= */

const simulationStatus =
    document.getElementById(
        "simulationStatus"
    );

const amplitudeValue =
    document.getElementById(
        "amplitudeValue"
    );

const frequencyValue =
    document.getElementById(
        "frequencyValue"
    );


/*
   Circular / general displays
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


/*
   Physics value displays
*/

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


/* =========================================================
   6. COLLAPSIBLE PANELS
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
   7. SIMULATION STATE
========================================================= */

const state = {

    /*
       Amplitude A
    */

    amplitude:
        DEFAULT_AMPLITUDE,


    /*
       Frequency f
    */

    frequency:
        DEFAULT_FREQUENCY,


    /*
       Angular frequency

           ω = 2πf
    */

    omega:
        TWO_PI *
        DEFAULT_FREQUENCY,


    /*
       Period

           T = 1/f
    */

    period:
        1 /
        DEFAULT_FREQUENCY,


    /*
       Phase angle θ
    */

    theta:
        0,


    /*
       Simulation time
    */

    time:
        0,


    /*
       Current SHM displacement
    */

    y:
        0,


    /*
       Circular X-component

           x = A cos θ
    */

    x:
        DEFAULT_AMPLITUDE,


    /*
       Y-component before canvas
       coordinate inversion

           yPhysics = A sin θ
    */

    yPhysics:
        0,


    /*
       Whether simulation is playing
    */

    playing:
        false,


    /*
       Animation timestamp
    */

    lastTimestamp:
        null,


    /*
       requestAnimationFrame ID
    */

    animationId:
        null,


    /*
       Show Y-component
    */

    showYComponent:
        true

};


/* =========================================================
   8. CANVAS DIMENSION VARIABLES
========================================================= */

let circularSize = 0;

let shmSize = 0;

let graphWidth = 0;

let graphHeight = 0;


/* =========================================================
   9. RESIZE CANVAS — HIGH DPI
========================================================= */

function resizeCanvas(
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


    /*
       CSS size
    */

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;


    /*
       Internal pixel resolution
    */

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
   10. RESIZE ALL CANVASES
========================================================= */

function resizeAll() {

    /*
       Circular canvas
    */

    if (
        circularCanvas &&
        circularCtx
    ) {

        circularSize =
            Math.min(
                circularCanvas.clientWidth,
                circularCanvas.clientHeight
            );


        resizeCanvas(
            circularCanvas,
            circularCtx,
            circularSize,
            circularSize
        );

    }


    /*
       SHM canvas

       Keep exactly the same square
       dimension as circular motion.
    */

    if (
        shmCanvas &&
        shmCtx
    ) {

        shmSize =
            Math.min(
                shmCanvas.clientWidth,
                shmCanvas.clientHeight
            );


        resizeCanvas(
            shmCanvas,
            shmCtx,
            shmSize,
            shmSize
        );

    }


    /*
       Graph canvas

       Graph is wider than tall.
    */

    if (
        graphCanvas &&
        graphCtx
    ) {

        graphWidth =
            graphCanvas.clientWidth;

        graphHeight =
            graphCanvas.clientHeight;


        resizeCanvas(
            graphCanvas,
            graphCtx,
            graphWidth,
            graphHeight
        );

    }


    /*
       Redraw immediately after resizing.
    */

    drawAll();

}


/* =========================================================
   11. READ CONTROLS
========================================================= */

function readControls() {

    /*
       Amplitude
    */

    if (
        amplitudeSlider
    ) {

        const A =
            parseFloat(
                amplitudeSlider.value
            );


        if (
            Number.isFinite(A)
        ) {

            state.amplitude =
                Math.max(
                    MIN_AMPLITUDE,
                    A
                );

        }

    }


    /*
       Frequency
    */

    if (
        frequencySlider
    ) {

        const f =
            parseFloat(
                frequencySlider.value
            );


        if (
            Number.isFinite(f)
        ) {

            state.frequency =
                Math.max(
                    MIN_FREQUENCY,
                    f
                );

        }

    }


    /*
       Recalculate ω and T.
    */

    state.omega =
        TWO_PI *
        state.frequency;


    state.period =
        1 /
        state.frequency;


    /*
       Y-component checkbox
    */

    if (
        yComponentToggle &&
        yComponentToggle.type ===
        "checkbox"
    ) {

        state.showYComponent =
            yComponentToggle.checked;

    }


    calculateSHM();

}


/* =========================================================
   12. NORMALIZE ANGLE
========================================================= */

function normalizeAngle(
    angle
) {

    let result =
        angle % TWO_PI;


    if (
        result < 0
    ) {

        result +=
            TWO_PI;

    }


    return result;

}


/* =========================================================
   13. CALCULATE PHYSICS
========================================================= */

function calculateSHM() {

    /*
       Angular phase:

           θ = ωt

       This is the SINGLE phase used by
       circular motion, SHM and graph.
    */

    state.theta =
        normalizeAngle(
            state.omega *
            state.time
        );


    /*
       Circular X-component:

           x = A cos θ
    */

    state.x =
        state.amplitude *
        Math.cos(
            state.theta
        );


    /*
       Circular Y-component:

           y = A sin θ
    */

    state.yPhysics =
        state.amplitude *
        Math.sin(
            state.theta
        );


    /*
       SHM displacement.

       IMPORTANT:
       We use the Y-component ONLY.

           y = A sin(ωt)
    */

    state.y =
        state.yPhysics;

}


/* =========================================================
   14. GET AMPLITUDE PIXELS
========================================================= */

function getAmplitudePixels() {

    /*
       The amplitude is a physical length.

       We need to ensure that the complete
       circular radius fits inside the canvas.
    */

    if (
        circularSize <= 0
    ) {

        return state.amplitude;

    }


    /*
       Leave enough room around the circle
       for labels and radius A.
    */

    const maximumRadius =
        Math.max(
            10,
            circularSize * 0.34
        );


    /*
       Scale the physical amplitude into
       a visually suitable radius.

       This keeps the circular diagram
       inside its square canvas.
    */

    const referenceAmplitude =
        150;


    const scale =
        maximumRadius /
        referenceAmplitude;


    return Math.min(
        state.amplitude *
        scale,

        maximumRadius
    );

}


/* =========================================================
   15. GET CIRCULAR GEOMETRY
========================================================= */

function getCircularGeometry() {

    const size =
        circularSize > 0
            ? circularSize
            : 300;


    /*
       EXACT centre.

       This centre becomes the reference
       for the circular motion.
    */

    const centerX =
        size / 2;

    const centerY =
        size / 2;


    /*
       Radius corresponding to A.
    */

    const radius =
        getAmplitudePixels();


    /*
       Circular particle.

       Physics:

           x = A cos θ
           y = A sin θ

       Canvas:

           screenY = centerY - y
    */

    const particleX =
        centerX +
        radius *
        Math.cos(
            state.theta
        );


    const particleY =
        centerY -
        radius *
        Math.sin(
            state.theta
        );


    return {

        size,

        centerX,

        centerY,

        radius,

        particleX,

        particleY

    };

}


/* =========================================================
   16. GET SHARED VERTICAL REFERENCE
========================================================= */

/*
   THIS IS IMPORTANT FOR ALIGNMENT.

   Circular motion:
       centreY = circularSize / 2

   SHM:
       centreY = shmSize / 2

   Graph:
       graphZeroY is calculated from the same
       normalized vertical position.

   Therefore the physical equilibrium line
   represents the same y = 0 level.
*/

function getSharedVerticalRatio() {

    return 0.5;

}


/* =========================================================
   17. GET GRAPH ZERO LINE
========================================================= */

function getGraphZeroY() {

    if (graphHeight <= 0) {
        return 0;
    }

    const top = 48;
    const bottom = graphHeight - 42;

    /*
       The equilibrium axis is the exact
       vertical centre of the graph plotting area.
    */

    return (
        top +
        (bottom - top) / 2
    );
}


/* =========================================================
   18. GET GRAPH AREA
========================================================= */

function getGraphArea() {

    const left =
        45;

    const right =
        Math.max(
            left + 50,
            graphWidth - 20
        );


    /*
       Leave space for title and
       period labels.
    */

    const top =
        48;

    const bottom =
        Math.max(
            top + 50,
            graphHeight - 42
        );


    return {

        left,

        right,

        top,

        bottom,

        width:
            right - left,

        height:
            bottom - top,

        zeroY:
            getGraphZeroY()

    };

}


/* =========================================================
   19. GRAPH DURATION
========================================================= */

/*
   Always show a complete number of periods.

       duration = N × T

   where:

       T = 1/f
*/

function getGraphDuration() {

    return (
        GRAPH_PERIODS *
        state.period
    );

}


/* =========================================================
   20. GRAPH DISPLACEMENT
========================================================= */

function getGraphY(
    t
) {

    /*
       The graph uses EXACTLY the same
       physics equation as the circular motion.

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
   21. FORMAT NUMBER
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


    return Number(
        value
    ).toFixed(
        decimals
    );

}


/* =========================================================
   22. FORMAT ANGLE
========================================================= */

function formatAngle(
    radians
) {

    const degrees =
        radians *
        180 /
        Math.PI;


    return `${formatNumber(
        degrees,
        0
    )}°`;

}


/* =========================================================
   23. UPDATE DISPLAY VALUES
========================================================= */

function updateDisplays() {

    /*
       Slider labels
    */

    if (
        amplitudeValue
    ) {

        amplitudeValue.textContent =
            `${formatNumber(
                state.amplitude,
                0
            )} px`;

    }


    if (
        frequencyValue
    ) {

        frequencyValue.textContent =
            `${formatNumber(
                state.frequency,
                2
            )} Hz`;

    }


    /*
       Circular information
    */

    if (
        amplitudeDisplay
    ) {

        amplitudeDisplay.textContent =
            `${formatNumber(
                state.amplitude,
                0
            )} px`;

    }


    if (
        angleDisplay
    ) {

        angleDisplay.textContent =
            formatAngle(
                state.theta
            );

    }


    if (
        yDisplay
    ) {

        yDisplay.textContent =
            `${formatNumber(
                state.y,
                1
            )} px`;

    }


    /*
       Physics values
    */

    if (
        valueAmplitude
    ) {

        valueAmplitude.textContent =
            `${formatNumber(
                state.amplitude,
                0
            )} px`;

    }


    if (
        valueFrequency
    ) {

        valueFrequency.textContent =
            `${formatNumber(
                state.frequency,
                2
            )} Hz`;

    }


    if (
        valueOmega
    ) {

        valueOmega.textContent =
            `${formatNumber(
                state.omega,
                2
            )} rad/s`;

    }


    if (
        valuePeriod
    ) {

        valuePeriod.textContent =
            `${formatNumber(
                state.period,
                2
            )} s`;

    }


    if (
        valueTheta
    ) {

        valueTheta.textContent =
            formatAngle(
                state.theta
            );

    }


    if (
        valueY
    ) {

        valueY.textContent =
            `${formatNumber(
                state.y,
                1
            )} px`;

    }

}


/* =========================================================
   24. CLEAR CANVAS
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
   25. ARROW FUNCTION
========================================================= */

function drawArrow(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color = "#2563eb",
    lineWidth = 3
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
        length < 0.1
    ) {

        return;

    }


    const head =
        Math.min(
            12,
            length * 0.25
        );


    const angle =
        Math.atan2(
            dy,
            dx
        );


    ctx.save();


    ctx.strokeStyle =
        color;

    ctx.fillStyle =
        color;

    ctx.lineWidth =
        lineWidth;

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
   26. DRAW GRID
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


    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth =
        1;


    /*
       Vertical lines
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
       Horizontal lines
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
   END OF PART 1
========================================================= */

/* =========================================================
   PART 2 — CIRCULAR MOTION DRAWING
========================================================= */


/* =========================================================
   27. DRAW CIRCULAR MOTION
========================================================= */

function drawCircularMotion() {

    if (
        !circularCtx ||
        circularSize <= 0
    ) {
        return;
    }


    const ctx =
        circularCtx;

    const geometry =
        getCircularGeometry();

    const {
        size,
        centerX,
        centerY,
        radius,
        particleX,
        particleY
    } = geometry;


    /* -----------------------------------------------------
       Clear canvas
    ----------------------------------------------------- */

    clearCanvas(
        ctx,
        size,
        size
    );


    /* -----------------------------------------------------
       Grid

       The centre of the grid is exactly the
       centre of circular motion.
    ----------------------------------------------------- */

    drawGrid(
        ctx,
        size,
        size,
        centerX,
        centerY
    );


    /* -----------------------------------------------------
       Main horizontal axis
    ----------------------------------------------------- */

    ctx.save();

    ctx.strokeStyle =
        "#64748b";

    ctx.lineWidth =
        1.5;

    ctx.beginPath();

    ctx.moveTo(
        0,
        centerY
    );

    ctx.lineTo(
        size,
        centerY
    );

    ctx.stroke();


    /* -----------------------------------------------------
       Main vertical axis
    ----------------------------------------------------- */

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        0
    );

    ctx.lineTo(
        centerX,
        size
    );

    ctx.stroke();

    ctx.restore();


    /* -----------------------------------------------------
       Axis labels
    ----------------------------------------------------- */

    ctx.save();

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "bold 12px Arial";

    ctx.fillText(
        "x",
        size - 15,
        centerY - 8
    );

    ctx.fillText(
        "y",
        centerX + 8,
        16
    );

    ctx.restore();


    /* =====================================================
       CIRCULAR PATH
    ===================================================== */

    ctx.save();

    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth =
        2;

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius,
        0,
        TWO_PI
    );

    ctx.stroke();

    ctx.restore();


    /* =====================================================
       RADIUS A
       
       This is the important new feature.

       The radius from the centre to the particle
       represents the amplitude A.

           R = A
    ===================================================== */

    ctx.save();

    ctx.strokeStyle =
        "#ef4444";

    ctx.lineWidth =
        3;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        centerX,
        centerY
    );

    ctx.lineTo(
        particleX,
        particleY
    );

    ctx.stroke();


    /* -----------------------------------------------------
       Radius label A
    ----------------------------------------------------- */

    const radiusMidX =
        (
            centerX +
            particleX
        ) / 2;

    const radiusMidY =
        (
            centerY +
            particleY
        ) / 2;


    /*
       Slight perpendicular offset so that
       the label does not sit directly on
       the radius line.
    */

    const dx =
        particleX -
        centerX;

    const dy =
        particleY -
        centerY;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    let labelX =
        radiusMidX + 7;

    let labelY =
        radiusMidY - 7;


    if (
        length > 0
    ) {

        labelX =
            radiusMidX -
            (dy / length) * 8 +
            5;

        labelY =
            radiusMidY +
            (dx / length) * 8 -
            5;

    }


    ctx.fillStyle =
        "#dc2626";

    ctx.font =
        "bold 16px Arial";

    ctx.fillText(
        "A",
        labelX,
        labelY
    );


    ctx.restore();


    /* =====================================================
       Y-COMPONENT PROJECTION
    ===================================================== */

    if (
        state.showYComponent
    ) {

        /*
           Horizontal projection line from
           particle to the vertical axis.

           This shows the Y-coordinate.

           IMPORTANT:

           It is NOT the X-component.

           The vertical displacement is:

               y = A sin θ
        */

        ctx.save();

        ctx.setLineDash([
            6,
            5
        ]);

        ctx.strokeStyle =
            "#16a34a";

        ctx.lineWidth =
            2;


        ctx.beginPath();

        ctx.moveTo(
            particleX,
            particleY
        );

        ctx.lineTo(
            centerX,
            particleY
        );

        ctx.stroke();


        ctx.restore();


        /* -------------------------------------------------
           Vertical Y displacement

           From equilibrium to particle.

           This visually represents:

               y = A sin θ
        ------------------------------------------------- */

        ctx.save();

        ctx.strokeStyle =
            "#16a34a";

        ctx.lineWidth =
            3;

        ctx.lineCap =
            "round";


        ctx.beginPath();

        ctx.moveTo(
            centerX,
            centerY
        );

        ctx.lineTo(
            centerX,
            particleY
        );

        ctx.stroke();


        ctx.restore();


        /* -------------------------------------------------
           Y label
        ------------------------------------------------- */

        ctx.save();

        ctx.fillStyle =
            "#15803d";

        ctx.font =
            "bold 14px Arial";


        const yLabelX =
            centerX + 10;


        const yLabelY =
            (
                centerY +
                particleY
            ) / 2;


        ctx.fillText(
            "y",
            yLabelX,
            yLabelY
        );


        ctx.restore();

    }


    /* =====================================================
       PARTICLE
    ===================================================== */

    ctx.save();


    /*
       Outer particle
    */

    ctx.beginPath();

    ctx.arc(
        particleX,
        particleY,
        9,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#2563eb";

    ctx.fill();


    /*
       White centre
    */

    ctx.beginPath();

    ctx.arc(
        particleX,
        particleY,
        3,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    ctx.restore();


    /* =====================================================
       CENTRE POINT
    ===================================================== */

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        5,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#172033";

    ctx.fill();


    ctx.restore();


    /* =====================================================
       O LABEL
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 13px Arial";

    ctx.fillText(
        "O",
        centerX + 8,
        centerY + 17
    );

    ctx.restore();


    /* =====================================================
       ANGLE ARC
       
       θ is measured from +X axis.
    ===================================================== */

    ctx.save();

    /*
       Only draw the angle when radius is
       large enough to see clearly.
    */

    if (
        radius > 20
    ) {

        const angleRadius =
            Math.min(
                32,
                radius * 0.35
            );


        ctx.strokeStyle =
            "#7c3aed";

        ctx.lineWidth =
            2;


        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            angleRadius,
            0,
            -state.theta,
            true
        );

        ctx.stroke();


        /* -------------------------------------------------
           θ label
        ------------------------------------------------- */

        const labelAngle =
            -state.theta / 2;


        const thetaLabelX =
            centerX +
            (
                angleRadius + 10
            ) *
            Math.cos(
                labelAngle
            );


        const thetaLabelY =
            centerY +
            (
                angleRadius + 10
            ) *
            Math.sin(
                labelAngle
            );


        ctx.fillStyle =
            "#7c3aed";

        ctx.font =
            "bold 13px Arial";


        ctx.fillText(
            "θ",
            thetaLabelX,
            thetaLabelY
        );

    }

    ctx.restore();


    /* =====================================================
       RADIUS VALUE LABEL
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#dc2626";

    ctx.font =
        "bold 12px Arial";


    ctx.fillText(
        `A = ${formatNumber(
            state.amplitude,
            0
        )}`,
        10,
        size - 12
    );


    ctx.restore();


    /* =====================================================
       PHASE INFORMATION
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#475569";

    ctx.font =
        "12px Arial";


    ctx.fillText(
        `θ = ${formatAngle(
            state.theta
        )}`,
        10,
        18
    );


    ctx.restore();

}


/* =========================================================
   28. DRAW SHM MOTION
========================================================= */

function drawSHM() {

    if (
        !shmCtx ||
        shmSize <= 0
    ) {
        return;
    }


    const ctx =
        shmCtx;

    const size =
        shmSize;


    const centerX =
        size / 2;

    const centerY =
        size / 2;


    /*
       Use exactly the same amplitude
       scaling as circular motion.
    */

    const radius =
        getAmplitudePixels();


    /*
       SHM particle position.

       Physics:

           y = A sin θ

       Canvas:

           screenY = centerY - y
    */

    const particleY =
        centerY -
        radius *
        Math.sin(
            state.theta
        );


    /* -----------------------------------------------------
       Clear
    ----------------------------------------------------- */

    clearCanvas(
        ctx,
        size,
        size
    );


    /* -----------------------------------------------------
       Grid

       Same GRID_SIZE and same centre position
       as circular motion.
    ----------------------------------------------------- */

    drawGrid(
        ctx,
        size,
        size,
        centerX,
        centerY
    );


    /* -----------------------------------------------------
       Horizontal equilibrium axis
    ----------------------------------------------------- */

    ctx.save();

    ctx.strokeStyle =
        "#64748b";

    ctx.lineWidth =
        1.5;


    ctx.beginPath();

    ctx.moveTo(
        0,
        centerY
    );

    ctx.lineTo(
        size,
        centerY
    );

    ctx.stroke();


    ctx.restore();


    /* -----------------------------------------------------
       SHM vertical equilibrium line
    ----------------------------------------------------- */

    ctx.save();

    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        centerX,
        0
    );

    ctx.lineTo(
        centerX,
        size
    );

    ctx.stroke();


    ctx.restore();


    /* =====================================================
       AMPLITUDE LIMITS
    ===================================================== */

    ctx.save();

    ctx.setLineDash([
        5,
        5
    ]);

    ctx.strokeStyle =
        "#cbd5e1";

    ctx.lineWidth =
        1.5;


    /*
       +A
    */

    ctx.beginPath();

    ctx.moveTo(
        centerX - 20,
        centerY - radius
    );

    ctx.lineTo(
        centerX + 20,
        centerY - radius
    );

    ctx.stroke();


    /*
       -A
    */

    ctx.beginPath();

    ctx.moveTo(
        centerX - 20,
        centerY + radius
    );

    ctx.lineTo(
        centerX + 20,
        centerY + radius
    );

    ctx.stroke();


    ctx.restore();


    /* =====================================================
       SHM PARTICLE PATH
    ===================================================== */

    ctx.save();

    ctx.strokeStyle =
        "#bfdbfe";

    ctx.lineWidth =
        3;

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        centerY - radius
    );

    ctx.lineTo(
        centerX,
        centerY + radius
    );

    ctx.stroke();

    ctx.restore();


    /* =====================================================
       Y DISPLACEMENT VECTOR
    ===================================================== */

    if (
        state.showYComponent
    ) {

        drawArrow(
            ctx,

            centerX,
            centerY,

            centerX,
            particleY,

            "#16a34a",
            3
        );


        /* -------------------------------------------------
           y label
        ------------------------------------------------- */

        ctx.save();

        ctx.fillStyle =
            "#15803d";

        ctx.font =
            "bold 14px Arial";


        const yMid =
            (
                centerY +
                particleY
            ) / 2;


        ctx.fillText(
            `y = ${formatNumber(
                state.y,
                1
            )}`,
            centerX + 12,
            yMid
        );


        ctx.restore();

    }


    /* =====================================================
       SHM PARTICLE
    ===================================================== */

    ctx.save();


    ctx.beginPath();

    ctx.arc(
        centerX,
        particleY,
        9,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#2563eb";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        centerX,
        particleY,
        3,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    ctx.restore();


    /* =====================================================
       EQUILIBRIUM POINT
    ===================================================== */

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        5,
        0,
        TWO_PI
    );

    ctx.fillStyle =
        "#172033";

    ctx.fill();


    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 12px Arial";


    ctx.fillText(
        "0",
        centerX + 10,
        centerY + 4
    );


    ctx.restore();


    /* =====================================================
       +A LABEL
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "bold 12px Arial";


    ctx.fillText(
        "+A",
        centerX + 25,
        centerY - radius + 4
    );


    ctx.fillText(
        "-A",
        centerX + 25,
        centerY + radius + 4
    );


    ctx.restore();


    /* =====================================================
       SHM EQUATION
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#2563eb";

    ctx.font =
        "bold 13px Arial";


    ctx.fillText(
        "y = A sin(ωt)",
        10,
        18
    );


    ctx.restore();

}


/* =========================================================
   29. DRAW SHARED CENTRE MARKER
========================================================= */

function drawCentreMarker(
    ctx,
    x,
    y
) {

    if (!ctx) {
        return;
    }


    ctx.save();

    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth =
        1;


    ctx.beginPath();

    ctx.moveTo(
        x - 6,
        y
    );

    ctx.lineTo(
        x + 6,
        y
    );

    ctx.moveTo(
        x,
        y - 6
    );

    ctx.lineTo(
        x,
        y + 6
    );

    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   END OF PART 2
========================================================= */

/* =========================================================
   PART 3 — DISPLACEMENT-TIME GRAPH
========================================================= */


/* =========================================================
   30. GRAPH COORDINATE SYSTEM
========================================================= */

function getGraphCoordinates() {

    const area =
        getGraphArea();


    /*
       Graph displays:

           0 → GRAPH_PERIODS × T

       Therefore the horizontal scale changes
       automatically when frequency changes.
    */

    const duration =
        getGraphDuration();


    return {

        area,

        duration

    };

}


/* =========================================================
   31. CONVERT TIME → GRAPH X
========================================================= */

function timeToGraphX(
    t,
    area,
    duration
) {

    if (
        duration <= 0
    ) {

        return area.left;

    }


    /*
       t = 0
       → left edge

       t = duration
       → right edge
    */

    const fraction =
        t /
        duration;


    return (
        area.left +
        fraction *
        area.width
    );

}


/* =========================================================
   32. CONVERT DISPLACEMENT → GRAPH Y
========================================================= */

function displacementToGraphY(
    displacement,
    area
) {

    /*
       IMPORTANT:

       Canvas Y increases downward.

       Physics Y increases upward.

       Therefore:

           positive y
           → moves upward

           negative y
           → moves downward
    */


    /*
       Vertical amplitude scale.

       The graph reserves enough space for
       +A and -A.
    */

    const availableHeight =
        Math.min(
            area.height * 0.42,
            140
        );


    /*
       Convert physical displacement
       into screen pixels.

       This is dynamically based on A.
    */

    const scale =
        state.amplitude > 0
            ? availableHeight /
              state.amplitude
            : 1;


    return (
        area.zeroY -
        displacement *
        scale
    );

}


/* =========================================================
   33. DRAW GRAPH BACKGROUND GRID
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


    /* -----------------------------------------------------
       Vertical grid lines
    ----------------------------------------------------- */

    /*
       Use one grid line for each quarter-period.

       This makes:

           0
           T/4
           T/2
           3T/4
           T

       clearly visible.

       Since GRAPH_PERIODS = 2,
       the graph shows complete cycles.
    */

    const subdivisions =
        GRAPH_PERIODS * 4;


    for (
        let i = 0;
        i <= subdivisions;
        i++
    ) {

        const t =
            (
                i /
                subdivisions
            ) *
            duration;


        const x =
            timeToGraphX(
                t,
                area,
                duration
            );


        ctx.strokeStyle =
            "#e5e7eb";

        ctx.lineWidth =
            1;


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


    /* -----------------------------------------------------
       Horizontal grid lines
    ----------------------------------------------------- */

    /*
       Create symmetrical horizontal
       displacement divisions.
    */

    const horizontalLines =
        8;


    for (
        let i = 0;
        i <= horizontalLines;
        i++
    ) {

        const fraction =
            i /
            horizontalLines;


        const y =
            area.top +
            fraction *
            area.height;


        ctx.strokeStyle =
            "#e5e7eb";

        ctx.lineWidth =
            1;


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
   34. DRAW GRAPH AXES
========================================================= */

function drawGraphAxes(
    ctx,
    area,
    duration
) {

    if (!ctx) {
        return;
    }


    const zeroY =
        area.zeroY;


    ctx.save();


    /* =====================================================
       Y = 0 EQUILIBRIUM AXIS

       THIS IS THE IMPORTANT ALIGNMENT LINE.

       Circular motion:

           centreY = 50%

       Graph:

           zeroY = 50%

       Therefore the equilibrium position
       is vertically aligned.
    ===================================================== */

    ctx.strokeStyle =
        "#475569";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        area.left,
        zeroY
    );

    ctx.lineTo(
        area.right,
        zeroY
    );

    ctx.stroke();


    /* =====================================================
       Y-AXIS
    ===================================================== */

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


    ctx.restore();


    /* =====================================================
       Y AXIS LABEL
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#334155";

    ctx.font =
        "bold 13px Arial";


    ctx.fillText(
        "y",
        area.left - 28,
        area.top + 5
    );


    ctx.restore();


    /* =====================================================
       TIME AXIS LABEL
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#334155";

    ctx.font =
        "bold 13px Arial";


    ctx.fillText(
        "t",
        area.right + 6,
        zeroY + 5
    );


    ctx.restore();


    /* =====================================================
       +A / -A LABELS
    ===================================================== */

    const topY =
        displacementToGraphY(
            state.amplitude,
            area
        );


    const bottomY =
        displacementToGraphY(
            -state.amplitude,
            area
        );


    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "bold 12px Arial";


    ctx.fillText(
        "+A",
        area.left - 32,
        topY + 4
    );


    ctx.fillText(
        "-A",
        area.left - 32,
        bottomY + 4
    );


    /* =====================================================
       TIME LABELS
    ===================================================== */

    const totalPeriods =
        GRAPH_PERIODS;


    for (
        let i = 0;
        i <= totalPeriods;
        i++
    ) {

        const t =
            i *
            state.period;


        const x =
            timeToGraphX(
                t,
                area,
                duration
            );


        ctx.fillStyle =
            "#64748b";

        ctx.font =
            "11px Arial";


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


        /*
           Centre the label under
           the corresponding point.
        */

        const textWidth =
            ctx.measureText(
                label
            ).width;


        ctx.fillText(
            label,
            x - textWidth / 2,
            area.bottom + 18
        );

    }


    /* =====================================================
       QUARTER PERIOD LABELS
    ===================================================== */

    ctx.fillStyle =
        "#94a3b8";

    ctx.font =
        "10px Arial";


    for (
        let periodIndex = 0;
        periodIndex < GRAPH_PERIODS;
        periodIndex++
    ) {

        const quarterValues = [
            0.25,
            0.5,
            0.75
        ];


        quarterValues.forEach(
            fraction => {

                const t =
                    (
                        periodIndex +
                        fraction
                    ) *
                    state.period;


                const x =
                    timeToGraphX(
                        t,
                        area,
                        duration
                    );


                let label;


                if (
                    fraction === 0.25
                ) {

                    label =
                        "T/4";

                } else if (
                    fraction === 0.5
                ) {

                    label =
                        "T/2";

                } else {

                    label =
                        "3T/4";

                }


                const textWidth =
                    ctx.measureText(
                        label
                    ).width;


                ctx.fillText(
                    label,
                    x -
                    textWidth / 2,
                    area.bottom + 31
                );

            }
        );

    }

}


/* =========================================================
   35. DRAW SINE WAVE
========================================================= */

function drawSineWave(
    ctx,
    area,
    duration
) {

    if (!ctx) {
        return;
    }


    /*
       Use many samples to make the curve smooth.
    */

    const samples =
        Math.max(
            500,
            Math.floor(
                area.width * 2
            )
        );


    ctx.save();


    ctx.strokeStyle =
        "#2563eb";

    ctx.lineWidth =
        3;

    ctx.lineCap =
        "round";

    ctx.lineJoin =
        "round";


    ctx.beginPath();


    for (
        let i = 0;
        i <= samples;
        i++
    ) {

        /*
           Time corresponding to this
           graph position.
        */

        const fraction =
            i /
            samples;


        const t =
            fraction *
            duration;


        /*
           EXACT SAME EQUATION
           AS CIRCULAR MOTION:

               y = A sin(ωt)
        */

        const displacement =
            getGraphY(
                t
            );


        const x =
            timeToGraphX(
                t,
                area,
                duration
            );


        const y =
            displacementToGraphY(
                displacement,
                area
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


    ctx.stroke();


    ctx.restore();

}


/* =========================================================
   36. DRAW GRAPH POINT
========================================================= */

function drawGraphPoint(
    ctx,
    area
) {

    if (!ctx) {
        return;
    }


    const duration =
        getGraphDuration();


    /*
       IMPORTANT:

       The point uses the CURRENT simulation
       phase.

           y = A sin(ωt)

       Therefore it is always on the same
       mathematical curve as the circular
       Y-component.
    */

    /*
       Keep the current time inside the
       displayed graph range.

       This allows the graph to show
       exactly two complete periods while
       the point moves continuously.
    */

    const graphTime =
        state.time %
        duration;


    const pointX =
        timeToGraphX(
            graphTime,
            area,
            duration
        );


    const displacement =
        getGraphY(
            graphTime
        );


    const pointY =
        displacementToGraphY(
            displacement,
            area
        );


    /* =====================================================
       VERTICAL PROJECTION TO y = 0
    ===================================================== */

    ctx.save();

    ctx.setLineDash([
        5,
        5
    ]);

    ctx.strokeStyle =
        "#16a34a";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        pointX,
        area.zeroY
    );

    ctx.lineTo(
        pointX,
        pointY
    );

    ctx.stroke();


    ctx.restore();


    /* =====================================================
       MOVING POINT
    ===================================================== */

    ctx.save();


    ctx.beginPath();

    ctx.arc(
        pointX,
        pointY,
        7,
        0,
        TWO_PI
    );


    ctx.fillStyle =
        "#ef4444";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        pointX,
        pointY,
        2.5,
        0,
        TWO_PI
    );


    ctx.fillStyle =
        "#ffffff";

    ctx.fill();


    ctx.restore();


    /* =====================================================
       POINT LABEL
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#dc2626";

    ctx.font =
        "bold 12px Arial";


    ctx.fillText(
        "y",
        pointX + 9,
        pointY - 9
    );


    ctx.restore();

}


/* =========================================================
   37. DRAW CURRENT TIME MARKER
========================================================= */

function drawTimeMarker(
    ctx,
    area
) {

    if (!ctx) {
        return;
    }


    const duration =
        getGraphDuration();


    const graphTime =
        state.time %
        duration;


    const x =
        timeToGraphX(
            graphTime,
            area,
            duration
        );


    ctx.save();


    ctx.setLineDash([
        3,
        5
    ]);

    ctx.strokeStyle =
        "#f59e0b";

    ctx.lineWidth =
        1.5;


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


    ctx.restore();

}


/* =========================================================
   38. DRAW GRAPH
========================================================= */

function drawGraph() {

    if (
        !graphCtx ||
        graphWidth <= 0 ||
        graphHeight <= 0
    ) {

        return;

    }


    const ctx =
        graphCtx;


    const area =
        getGraphArea();


    const duration =
        getGraphDuration();


    /* -----------------------------------------------------
       Clear
    ----------------------------------------------------- */

    clearCanvas(
        ctx,
        graphWidth,
        graphHeight
    );


    /* -----------------------------------------------------
       Background grid
    ----------------------------------------------------- */

    drawGraphGrid(
        ctx,
        area,
        duration
    );


    /* -----------------------------------------------------
       Axes
    ----------------------------------------------------- */

    drawGraphAxes(
        ctx,
        area,
        duration
    );


    /* -----------------------------------------------------
       Sine wave
    ----------------------------------------------------- */

    drawSineWave(
        ctx,
        area,
        duration
    );


    /* -----------------------------------------------------
       Moving time marker
    ----------------------------------------------------- */

    drawTimeMarker(
        ctx,
        area
    );


    /* -----------------------------------------------------
       Moving graph point
    ----------------------------------------------------- */

    drawGraphPoint(
        ctx,
        area
    );


    /* =====================================================
       GRAPH TITLE / EQUATION
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#2563eb";

    ctx.font =
        "bold 13px Arial";


    ctx.fillText(
        "y = A sin(ωt)",
        area.left + 8,
        area.top - 20
    );


    ctx.restore();


    /* =====================================================
       FREQUENCY INFORMATION
    ===================================================== */

    ctx.save();

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "11px Arial";


    ctx.fillText(
        `f = ${formatNumber(
            state.frequency,
            2
        )} Hz`,
        area.right - 70,
        area.top - 20
    );


    ctx.restore();

}


/* =========================================================
   39. DRAW ALL SIMULATIONS
========================================================= */

function drawAll() {

    /*
       Make sure physics values are current.
    */

    calculateSHM();


    /*
       Update numerical displays.
    */

    updateDisplays();


    /*
       Draw circular motion.
    */

    drawCircularMotion();


    /*
       Draw vertical SHM.
    */

    drawSHM();


    /*
       Draw displacement-time graph.
    */

    drawGraph();

}


/* =========================================================
   END OF PART 3
========================================================= */

/* =========================================================
   PART 4 — ANIMATION + CONTROLS + INITIALIZATION
========================================================= */


/* =========================================================
   40. UPDATE SIMULATION TIME
========================================================= */

function updateSimulation(
    deltaTime
) {

    if (!state.playing) {
        return;
    }


    /*
       Advance time.

           θ = ωt

       The circular motion and SHM graph
       therefore remain synchronized.
    */

    state.time +=
        deltaTime;


    /*
       Keep time reasonably small to prevent
       numerical values from becoming unnecessarily
       large during long simulations.
    */

    const cyclePeriod =
        state.period;


    if (
        cyclePeriod > 0 &&
        state.time > 100000
    ) {

        state.time =
            state.time %
            cyclePeriod;

    }


    calculateSHM();

}


/* =========================================================
   41. ANIMATION LOOP
========================================================= */

function animationLoop(
    timestamp
) {

    /*
       First frame
    */

    if (
        state.lastTimestamp === null
    ) {

        state.lastTimestamp =
            timestamp;

    }


    /*
       Time difference in seconds.
    */

    let deltaTime =
        (
            timestamp -
            state.lastTimestamp
        ) / 1000;


    state.lastTimestamp =
        timestamp;


    /*
       Prevent a very large time jump
       after the browser tab has been inactive.
    */

    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    updateSimulation(
        deltaTime
    );


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
   42. START ANIMATION LOOP
========================================================= */

function startAnimationLoop() {

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
   43. STOP ANIMATION LOOP
========================================================= */

function stopAnimationLoop() {

    if (
        state.animationId !== null
    ) {

        cancelAnimationFrame(
            state.animationId
        );

    }


    state.animationId =
        null;

    state.lastTimestamp =
        null;

}


/* =========================================================
   44. PLAY / PAUSE
========================================================= */

function togglePlay() {

    state.playing =
        !state.playing;


    if (
        state.playing
    ) {

        /*
           Reset timestamp so the first frame
           does not create a huge deltaTime.
        */

        state.lastTimestamp =
            null;


        updatePlayButton();


    } else {

        updatePlayButton();

    }

}


/* =========================================================
   45. UPDATE PLAY BUTTON
========================================================= */

function updatePlayButton() {

    if (!playButton) {
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
   46. RESET SIMULATION
========================================================= */

function resetSimulation() {

    /*
       Stop movement.
    */

    state.playing =
        false;


    /*
       Reset time and phase.
    */

    state.time =
        0;

    state.theta =
        0;


    /*
       Read the CURRENT slider values.

       This means Reset does not unexpectedly
       change the user's chosen amplitude/frequency.
    */

    readControls();


    /*
       Update button.
    */

    updatePlayButton();


    /*
       Redraw immediately.
    */

    drawAll();

}


/* =========================================================
   47. AMPLITUDE SLIDER
========================================================= */

function handleAmplitudeInput() {

    if (!amplitudeSlider) {
        return;
    }


    const newAmplitude =
        parseFloat(
            amplitudeSlider.value
        );


    if (
        Number.isFinite(
            newAmplitude
        )
    ) {

        state.amplitude =
            Math.max(
                MIN_AMPLITUDE,
                newAmplitude
            );

    }


    /*
       IMPORTANT:

       Changing amplitude must immediately
       change:

       1. Circular radius
       2. SHM amplitude
       3. Sine-wave height
       4. Graph moving point
    */

    calculateSHM();

    updateDisplays();

    drawAll();

}


/* =========================================================
   48. FREQUENCY SLIDER
========================================================= */

function handleFrequencyInput() {

    if (!frequencySlider) {
        return;
    }


    const newFrequency =
        parseFloat(
            frequencySlider.value
        );


    if (
        Number.isFinite(
            newFrequency
        )
    ) {

        state.frequency =
            Math.max(
                MIN_FREQUENCY,
                newFrequency
            );

    }


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
       IMPORTANT:

       The phase remains based on the
       CURRENT simulation time:

           θ = ωt

       Therefore the graph and circular
       particle remain synchronized.
    */

    calculateSHM();

    updateDisplays();

    drawAll();

}


/* =========================================================
   49. Y COMPONENT TOGGLE
========================================================= */

function handleYComponentToggle() {

    if (
        yComponentToggle &&
        yComponentToggle.type ===
        "checkbox"
    ) {

        state.showYComponent =
            yComponentToggle.checked;

    }


    drawAll();

}


/* =========================================================
   50. ADD EVENT LISTENERS
========================================================= */

function setupControls() {

    /* -----------------------------------------------------
       Play button
    ----------------------------------------------------- */

    if (
        playButton
    ) {

        playButton.addEventListener(
            "click",
            togglePlay
        );

    }


    /* -----------------------------------------------------
       Reset button
    ----------------------------------------------------- */

    if (
        resetButton
    ) {

        resetButton.addEventListener(
            "click",
            resetSimulation
        );

    }


    /* -----------------------------------------------------
       Amplitude

       input = real-time response
       change = compatibility
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Frequency
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       Y-component checkbox
    ----------------------------------------------------- */

    if (
        yComponentToggle
    ) {

        yComponentToggle.addEventListener(
            "change",
            handleYComponentToggle
        );

    }


    /* -----------------------------------------------------
       Keyboard shortcuts
    ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            /*
               Spacebar = play/pause
            */

            if (
                event.code ===
                "Space"
            ) {

                /*
                   Avoid interfering with text
                   inputs.
                */

                const tag =
                    document.activeElement
                        ?.tagName;


                if (
                    tag !== "INPUT" &&
                    tag !== "TEXTAREA" &&
                    tag !== "BUTTON"
                ) {

                    event.preventDefault();

                    togglePlay();

                }

            }


            /*
               R = reset
            */

            if (
                event.key === "r" ||
                event.key === "R"
            ) {

                const tag =
                    document.activeElement
                        ?.tagName;


                if (
                    tag !== "INPUT" &&
                    tag !== "TEXTAREA"
                ) {

                    resetSimulation();

                }

            }

        }
    );

}


/* =========================================================
   51. COLLAPSIBLE PANEL
========================================================= */

function setupCollapsiblePanel(
    toggle,
    content,
    arrow
) {

    if (
        !toggle ||
        !content
    ) {

        return;

    }


    toggle.addEventListener(
        "click",
        () => {

            const isOpen =
                content.classList.contains(
                    "open"
                );


            if (
                isOpen
            ) {

                content.classList.remove(
                    "open"
                );


                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                if (
                    arrow
                ) {

                    arrow.textContent =
                        "▼";

                }

            } else {

                content.classList.add(
                    "open"
                );


                toggle.setAttribute(
                    "aria-expanded",
                    "true"
                );


                if (
                    arrow
                ) {

                    arrow.textContent =
                        "▲";

                }

            }

        }
    );

}


/* =========================================================
   52. SETUP COLLAPSIBLE PANELS
========================================================= */

function setupPanels() {

    setupCollapsiblePanel(
        formulaToggle,
        formulaContent,
        formulaArrow
    );


    setupCollapsiblePanel(
        conceptToggle,
        conceptContent,
        conceptArrow
    );

}


/* =========================================================
   53. WINDOW RESIZE
========================================================= */

let resizeTimer =
    null;


function handleResize() {

    /*
       Debounce resize events so the canvas
       is not resized hundreds of times while
       dragging the browser window.
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


/* =========================================================
   54. RESPONSIVE RESIZE LISTENER
========================================================= */

window.addEventListener(
    "resize",
    handleResize
);


/* =========================================================
   55. VISIBILITY CHANGE
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
           Prevent a huge time jump if the
           browser pauses the animation while
           the tab is hidden.
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
   56. INITIALIZE STATE FROM HTML
========================================================= */

function initializeState() {

    /*
       Read slider values.
    */

    readControls();


    /*
       If Y toggle exists, respect its
       initial HTML state.
    */

    if (
        yComponentToggle &&
        yComponentToggle.type ===
        "checkbox"
    ) {

        state.showYComponent =
            yComponentToggle.checked;

    }


    /*
       Initial phase:

           θ = 0

       Therefore:

           y = A sin(0)
             = 0

       and

           x = A cos(0)
             = A

       So the particle begins on the
       positive X-axis.
    */

    state.time =
        0;

    state.theta =
        0;


    calculateSHM();


    updateDisplays();


    updatePlayButton();

}


/* =========================================================
   57. STARTUP
========================================================= */

function initializeSimulation() {

    initializeState();

    setupControls();

    setupPanels();

    resizeAll();

    drawAll();

    startAnimationLoop();

}


/* =========================================================
   58. DOM READY
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
   END OF COMPLETE SCRIPT.JS
========================================================= */