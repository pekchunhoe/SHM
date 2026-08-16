/* =========================================================
   SHM SIMULATION
   CIRCULAR MOTION → SIMPLE HARMONIC MOTION

   Physics:

       x = A cos(ωt)

       y = A sin(ωt)

       ω = 2πf

       T = 1/f

   IMPORTANT:
   SHM is generated from the Y-component.
========================================================= */


/* =========================================================
   1. CONSTANTS
========================================================= */

const TWO_PI =
    Math.PI * 2;


/*
   Graph displays complete periods.
*/

const GRAPH_PERIODS =
    2;


/*
   Minimum / maximum amplitude.
   These should match the HTML slider.
*/

const MIN_AMPLITUDE =
    50;

const MAX_AMPLITUDE =
    150;


/*
   Frequency range.
*/

const MIN_FREQUENCY =
    0.1;

const MAX_FREQUENCY =
    2;


/*
   Grid spacing.
*/

const GRID_SIZE =
    25;


/* =========================================================
   2. DOM ELEMENTS
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
   4. CONTROLS
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
   7. CANVAS DIMENSIONS
========================================================= */

let circularSize =
    0;

let shmSize =
    0;

let graphWidth =
    0;

let graphHeight =
    0;


/* =========================================================
   8. SIMULATION STATE
========================================================= */

const state = {

    /*
       Physical quantities
    */

    amplitude:
        100,

    frequency:
        0.5,

    omega:
        TWO_PI * 0.5,

    period:
        2,

    theta:
        0,

    time:
        0,

    x:
        100,

    y:
        0,


    /*
       Animation
    */

    playing:
        false,

    animationId:
        null,

    lastTimestamp:
        null,


    /*
       Display
    */

    showYComponent:
        true

};


/* =========================================================
   9. FORMAT NUMBER
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
   10. FORMAT ANGLE
========================================================= */

function formatAngle(
    radians
) {

    let degrees =
        radians *
        180 /
        Math.PI;


    /*
       Keep the angle between
       0° and 360°.
    */

    degrees =
        (
            degrees % 360 +
            360
        ) % 360;


    return `${formatNumber(
        degrees,
        0
    )}°`;

}


/* =========================================================
   11. READ SLIDER VALUES
========================================================= */

function readControls() {

    /* -----------------------------------------------------
       Amplitude
    ----------------------------------------------------- */

    if (
        amplitudeSlider
    ) {

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


    /* -----------------------------------------------------
       Frequency
    ----------------------------------------------------- */

    if (
        frequencySlider
    ) {

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


    /* -----------------------------------------------------
       Angular frequency

           ω = 2πf
    ----------------------------------------------------- */

    state.omega =
        TWO_PI *
        state.frequency;


    /* -----------------------------------------------------
       Period

           T = 1/f
    ----------------------------------------------------- */

    state.period =
        state.frequency > 0
            ? 1 /
              state.frequency
            : 0;


    /* -----------------------------------------------------
       Y-component display
    ----------------------------------------------------- */

    if (
        yComponentToggle
    ) {

        state.showYComponent =
            yComponentToggle.checked;

    }


    calculateSHM();

}


/* =========================================================
   12. CALCULATE SHM
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
       Keep theta manageable.
    */

    state.theta =
        state.theta %
        TWO_PI;


    if (
        state.theta < 0
    ) {

        state.theta +=
            TWO_PI;

    }


    /*
       Circular motion coordinates:

           x = A cos θ

           y = A sin θ
    */

    state.x =
        state.amplitude *
        Math.cos(
            state.theta
        );


    state.y =
        state.amplitude *
        Math.sin(
            state.theta
        );

}


/* =========================================================
   13. GET AMPLITUDE IN PIXELS
========================================================= */

function getAmplitudePixels() {

    /*
       The amplitude slider itself is already
       expressed in pixels.

       Therefore:

           radius = A

       directly.
    */

    return state.amplitude;

}


/* =========================================================
   14. CLEAR CANVAS
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


    /*
       White background.
    */

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
   15. DRAW GRID
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
   16. CIRCULAR GEOMETRY
========================================================= */

function getCircularGeometry() {

    const size =
        circularSize;


    const centerX =
        size / 2;

    const centerY =
        size / 2;


    /*
       Radius = current amplitude.

       Therefore changing A changes
       the circular radius.
    */

    const radius =
        getAmplitudePixels();


    /*
       Canvas coordinates:

           x = A cos θ

           y = A sin θ

       Canvas Y is downward, therefore
       positive physical y is subtracted.
    */

    const particleX =
        centerX +
        state.x;


    const particleY =
        centerY -
        state.y;


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
   17. GET SHM GRAPH Y
========================================================= */

function getGraphY(
    t
) {

    /*
       The displacement-time graph MUST use
       the exact same equation as the
       circular-motion Y-component:

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
   18. GRAPH TIME WINDOW
========================================================= */

function getGraphDuration() {

    /*
       Show exactly two complete periods.

           duration = 2T
    */

    return (
        GRAPH_PERIODS *
        state.period
    );

}


/* =========================================================
   19. GRAPH AREA
========================================================= */

function getGraphArea() {

    const width =
        graphWidth;

    const height =
        graphHeight;


    const left =
        55;

    const right =
        width - 20;

    const top =
        35;

    const bottom =
        height - 45;


    /*
       IMPORTANT:

       The graph equilibrium axis must
       align with the circular-motion
       horizontal x-axis.

       Circular x-axis:

           circularSize / 2

       Graph x-axis:

           graphHeight / 2
    */

    const zeroY =
        height / 2;


    return {

        left,

        right,

        top,

        bottom,

        width:
            right - left,

        height:
            bottom - top,

        zeroY

    };

}


/* =========================================================
   20. TIME → GRAPH X
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


    return (
        area.left +
        (
            t /
            duration
        ) *
        area.width
    );

}


/* =========================================================
   21. DISPLACEMENT → GRAPH Y
========================================================= */

function displacementToGraphY(
    displacement,
    area
) {

    /*
       Maximum visual amplitude.

       This determines how large the
       graph can become on screen.
    */

    const maxVisualAmplitude =
        Math.min(
            area.height * 0.40,
            area.zeroY -
            area.top -
            10,
            area.bottom -
            area.zeroY -
            10
        );


    /*
       Convert physical displacement
       relative to current A.

       Because:

           displacement / A
           
       ranges from -1 to +1.
    */

    const normalized =
        state.amplitude !== 0
            ? displacement /
              state.amplitude
            : 0;


    /*
       IMPORTANT:

       amplitude is now visually tied
       to the current slider value.

       A = MIN → smaller wave
       A = MAX → larger wave
    */

    const amplitudeRatio =
        (
            state.amplitude -
            MIN_AMPLITUDE
        ) /
        (
            MAX_AMPLITUDE -
            MIN_AMPLITUDE
        );


    const visualAmplitude =
        maxVisualAmplitude *
        (
            0.30 +
            0.70 *
            Math.max(
                0,
                Math.min(
                    1,
                    amplitudeRatio
                )
            )
        );


    return (
        area.zeroY -
        normalized *
        visualAmplitude
    );

}


/* =========================================================
   22. DRAW ARROW
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


    const headLength =
        9;


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


    ctx.beginPath();

    ctx.moveTo(
        x2,
        y2
    );

    ctx.lineTo(
        x2 -
        headLength *
        Math.cos(
            angle -
            Math.PI / 6
        ),
        y2 -
        headLength *
        Math.sin(
            angle -
            Math.PI / 6
        )
    );

    ctx.lineTo(
        x2 -
        headLength *
        Math.cos(
            angle +
            Math.PI / 6
        ),
        y2 -
        headLength *
        Math.sin(
            angle +
            Math.PI / 6
        )
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


/* =========================================================
   23. UPDATE NUMERICAL DISPLAYS
========================================================= */

function updateDisplays() {

    /*
       Amplitude
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
        valueAmplitude
    ) {

        valueAmplitude.textContent =
            `${formatNumber(
                state.amplitude,
                0
            )} px`;

    }


    /*
       Frequency
    */

    if (
        valueFrequency
    ) {

        valueFrequency.textContent =
            `${formatNumber(
                state.frequency,
                2
            )} Hz`;

    }


    /*
       Angular frequency
    */

    if (
        valueOmega
    ) {

        valueOmega.textContent =
            `${formatNumber(
                state.omega,
                2
            )} rad/s`;

    }


    /*
       Period
    */

    if (
        valuePeriod
    ) {

        valuePeriod.textContent =
            `${formatNumber(
                state.period,
                2
            )} s`;

    }


    /*
       Angle
    */

    if (
        angleDisplay
    ) {

        angleDisplay.textContent =
            formatAngle(
                state.theta
            );

    }


    if (
        valueTheta
    ) {

        valueTheta.textContent =
            formatAngle(
                state.theta
            );

    }


    /*
       Y displacement
    */

    if (
        yDisplay
    ) {

        yDisplay.textContent =
            `${formatNumber(
                state.y,
                1
            )} px`;

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


    /*
       Update slider labels if they exist.
    */

    if (
        amplitudeSlider
    ) {

        const amplitudeValue =
            document.getElementById(
                "amplitudeValue"
            );


        if (
            amplitudeValue
        ) {

            amplitudeValue.textContent =
                formatNumber(
                    state.amplitude,
                    0
                );

        }

    }


    if (
        frequencySlider
    ) {

        const frequencyValue =
            document.getElementById(
                "frequencyValue"
            );


        if (
            frequencyValue
        ) {

            frequencyValue.textContent =
                formatNumber(
                    state.frequency,
                    1
                );

        }

    }

}


/* =========================================================
   24. RESIZE CANVASES
========================================================= */

function resizeCanvas(
    canvas,
    ctx,
    size
) {

    if (
        !canvas ||
        !ctx ||
        size <= 0
    ) {

        return;

    }


    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        Math.round(
            size * dpr
        );

    canvas.height =
        Math.round(
            size * dpr
        );


    /*
       CSS dimensions remain logical pixels.
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
   25. RESIZE ALL
========================================================= */

function resizeAll() {

    if (
        circularCanvas
    ) {

        circularSize =
            circularCanvas.clientWidth;


        if (
            circularSize <= 0
        ) {

            circularSize =
                400;

        }


        resizeCanvas(
            circularCanvas,
            circularCtx,
            circularSize
        );

    }


    if (
        shmCanvas
    ) {

        shmSize =
            shmCanvas.clientWidth;


        if (
            shmSize <= 0
        ) {

            shmSize =
                400;

        }


        resizeCanvas(
            shmCanvas,
            shmCtx,
            shmSize
        );

    }


    if (
        graphCanvas
    ) {

        graphWidth =
            graphCanvas.clientWidth;

        graphHeight =
            graphCanvas.clientHeight;


        if (
            graphWidth <= 0
        ) {

            graphWidth =
                600;

        }


        if (
            graphHeight <= 0
        ) {

            graphHeight =
                300;

        }


        const dpr =
            window.devicePixelRatio ||
            1;


        graphCanvas.width =
            Math.round(
                graphWidth * dpr
            );

        graphCanvas.height =
            Math.round(
                graphHeight * dpr
            );


        graphCtx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    }


    drawAll();

}


/* =========================================================
   26. DRAW ALL
========================================================= */

function drawAll() {

    calculateSHM();

    updateDisplays();

    drawCircularMotion();

    drawSHM();

    drawGraph();

}


/* =========================================================
   END OF PART 1
========================================================= */

/* =========================================================
   PART 2 — CIRCULAR MOTION + SHM DRAWING
========================================================= */


/* =========================================================
   27. DRAW CIRCULAR MOTION
========================================================= */

function drawCircularMotion() {

    if (
        !circularCanvas ||
        !circularCtx ||
        circularSize <= 0
    ) {
        return;
    }


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
       Clear
    ----------------------------------------------------- */

    clearCanvas(
        circularCtx,
        size,
        size
    );


    /* -----------------------------------------------------
       Grid

       The x-axis is exactly:

           y = centerY
           = size / 2
    ----------------------------------------------------- */

    drawGrid(
        circularCtx,
        size,
        size,
        centerX,
        centerY
    );


    /* =====================================================
       X AND Y AXES
    ===================================================== */

    circularCtx.save();

    circularCtx.strokeStyle =
        "#64748b";

    circularCtx.lineWidth =
        2;


    /*
       X-axis
    */

    circularCtx.beginPath();

    circularCtx.moveTo(
        0,
        centerY
    );

    circularCtx.lineTo(
        size,
        centerY
    );

    circularCtx.stroke();


    /*
       Y-axis
    */

    circularCtx.beginPath();

    circularCtx.moveTo(
        centerX,
        0
    );

    circularCtx.lineTo(
        centerX,
        size
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
       Radius vector:

           R = A

       from centre to particle.
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

    const radiusAngle =
        state.theta;


    const radiusLabelX =
        centerX +
        radius *
        0.55 *
        Math.cos(
            radiusAngle
        );


    const radiusLabelY =
        centerY -
        radius *
        0.55 *
        Math.sin(
            radiusAngle
        );


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
       The SHM comes from the Y-component.

       Therefore draw a horizontal projection
       from the particle to the Y-axis.

              particle ●
                       |
                       |
                       ●
                     Y-axis

       The vertical coordinate represents:

           y = A sin θ
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
           Y-component point on Y-axis
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
           Y label
        ------------------------------------------------- */

        circularCtx.save();

        circularCtx.fillStyle =
            "#16a34a";

        circularCtx.font =
            "bold 13px Arial";

        circularCtx.textAlign =
            "left";


        const yLabelY =
            centerY -
            state.y *
            0.5;


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

        circularCtx.save();

        circularCtx.beginPath();

        /*
           Canvas angle is inverted vertically.

           The physical angle is θ,
           while canvas coordinates use
           negative Y.
        */

        circularCtx.arc(
            centerX,
            centerY,
            Math.min(
                35,
                radius * 0.35
            ),
            0,
            -state.theta,
            state.theta > 0
        );


        circularCtx.strokeStyle =
            "#7c3aed";

        circularCtx.lineWidth =
            2;

        circularCtx.stroke();

        circularCtx.restore();


        /* -------------------------------------------------
           θ label
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
                state.theta
            )}`,
            centerX + 45,
            centerY - 20
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
        size - 8,
        centerY - 8
    );


    circularCtx.textAlign =
        "center";

    circularCtx.fillText(
        "y",
        centerX + 15,
        15
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

}


/* =========================================================
   28. DRAW SHM REPRESENTATION
========================================================= */

function drawSHM() {

    if (
        !shmCanvas ||
        !shmCtx ||
        shmSize <= 0
    ) {
        return;
    }


    const size =
        shmSize;


    const centerX =
        size / 2;

    const centerY =
        size / 2;


    const amplitude =
        getAmplitudePixels();


    /* -----------------------------------------------------
       Clear
    ----------------------------------------------------- */

    clearCanvas(
        shmCtx,
        size,
        size
    );


    /* -----------------------------------------------------
       Grid

       SAME GRID SYSTEM as circular motion.
    ----------------------------------------------------- */

    drawGrid(
        shmCtx,
        size,
        size,
        centerX,
        centerY
    );


    /* =====================================================
       X-AXIS
    ===================================================== */

    shmCtx.save();

    shmCtx.strokeStyle =
        "#64748b";

    shmCtx.lineWidth =
        2;


    shmCtx.beginPath();

    shmCtx.moveTo(
        0,
        centerY
    );

    shmCtx.lineTo(
        size,
        centerY
    );

    shmCtx.stroke();


    /* =====================================================
       Y-AXIS
    ===================================================== */

    shmCtx.beginPath();

    shmCtx.moveTo(
        centerX,
        0
    );

    shmCtx.lineTo(
        centerX,
        size
    );

    shmCtx.stroke();


    shmCtx.restore();


    /* =====================================================
       SHM EQUILIBRIUM LINE
    ===================================================== */

    shmCtx.save();

    shmCtx.setLineDash([
        7,
        5
    ]);

    shmCtx.strokeStyle =
        "#94a3b8";

    shmCtx.lineWidth =
        1.5;


    shmCtx.beginPath();

    shmCtx.moveTo(
        0,
        centerY
    );

    shmCtx.lineTo(
        size,
        centerY
    );

    shmCtx.stroke();


    shmCtx.setLineDash([]);

    shmCtx.restore();


    /* =====================================================
       SHM POSITION LINE
    ===================================================== */

    /*
       A vertical representation is used.

       The current displacement is:

           y = A sin θ

       Therefore the moving point moves
       vertically.
    */

    const particleY =
        centerY -
        state.y;


    /* -----------------------------------------------------
       Current displacement arrow
    ----------------------------------------------------- */

    drawArrow(
        shmCtx,
        centerX,
        centerY,
        centerX,
        particleY,
        "#16a34a",
        3
    );


    /* =====================================================
       MAXIMUM AMPLITUDE MARKERS
    ===================================================== */

    const topY =
        centerY -
        amplitude;

    const bottomY =
        centerY +
        amplitude;


    shmCtx.save();

    shmCtx.strokeStyle =
        "#dc2626";

    shmCtx.lineWidth =
        2;


    /*
       +A marker
    */

    shmCtx.beginPath();

    shmCtx.moveTo(
        centerX - 12,
        topY
    );

    shmCtx.lineTo(
        centerX + 12,
        topY
    );

    shmCtx.stroke();


    /*
       -A marker
    */

    shmCtx.beginPath();

    shmCtx.moveTo(
        centerX - 12,
        bottomY
    );

    shmCtx.lineTo(
        centerX + 12,
        bottomY
    );

    shmCtx.stroke();


    shmCtx.restore();


    /* =====================================================
       LIVE AMPLITUDE LABELS
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
        )} px`,
        centerX + 18,
        topY + 4
    );


    shmCtx.fillText(
        `−A = ${formatNumber(
            state.amplitude,
            0
        )} px`,
        centerX + 18,
        bottomY + 4
    );


    shmCtx.restore();


    /* =====================================================
       CURRENT PARTICLE
    ===================================================== */

    shmCtx.save();

    shmCtx.beginPath();

    shmCtx.arc(
        centerX,
        particleY,
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
       CURRENT Y VALUE
    ===================================================== */

    shmCtx.save();

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
        )} px`,
        centerX + 18,
        particleY - 10
    );


    shmCtx.restore();


    /* =====================================================
       PHASE INFORMATION
    ===================================================== */

    shmCtx.save();

    shmCtx.fillStyle =
        "#7c3aed";

    shmCtx.font =
        "bold 13px Arial";

    shmCtx.textAlign =
        "center";


    shmCtx.fillText(
        `θ = ${formatAngle(
            state.theta
        )}`,
        centerX,
        size - 22
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
        size - 8,
        centerY - 8
    );


    shmCtx.textAlign =
        "center";

    shmCtx.fillText(
        "y",
        centerX + 15,
        15
    );


    shmCtx.restore();


    /* =====================================================
       DIRECTION INDICATOR
    ===================================================== */

    let directionText;


    /*
       dy/dt = Aω cos θ

       Therefore:

       cos θ > 0 → moving upward
       cos θ < 0 → moving downward
    */

    const velocitySign =
        Math.cos(
            state.theta
        );


    if (
        Math.abs(
            velocitySign
        ) < 0.01
    ) {

        directionText =
            "Turning point";

    } else if (
        velocitySign > 0
    ) {

        directionText =
            "Moving upward";

    } else {

        directionText =
            "Moving downward";

    }


    shmCtx.save();

    shmCtx.fillStyle =
        "#475569";

    shmCtx.font =
        "12px Arial";

    shmCtx.textAlign =
        "center";

    shmCtx.fillText(
        directionText,
        centerX,
        size - 7
    );


    shmCtx.restore();

}


/* =========================================================
   29. DRAW GRAPH GRID
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
        "#e2e8f0";

    ctx.lineWidth =
        1;


    /* -----------------------------------------------------
       Horizontal grid

       Always symmetric around y = 0.
    ----------------------------------------------------- */

    const horizontalLines =
        4;


    const maxVisualAmplitude =
        Math.min(
            area.height * 0.40,
            area.zeroY -
            area.top -
            10,
            area.bottom -
            area.zeroY -
            10
        );


    for (
        let i = -2;
        i <= 2;
        i++
    ) {

        const y =
            area.zeroY -
            (
                i / 2
            ) *
            maxVisualAmplitude;


        if (
            y >= area.top &&
            y <= area.bottom
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

    }


    /* -----------------------------------------------------
       Vertical grid

       Exactly 2 complete periods.
    ----------------------------------------------------- */

    const verticalDivisions =
        GRAPH_PERIODS * 4;


    for (
        let i = 0;
        i <= verticalDivisions;
        i++
    ) {

        const x =
            area.left +
            (
                i /
                verticalDivisions
            ) *
            area.width;


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


    ctx.restore();

}


/* =========================================================
   30. DRAW GRAPH AXES
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
        "#64748b";

    ctx.lineWidth =
        2;


    /*
       IMPORTANT:

       Graph x-axis is EXACTLY at:

           graphHeight / 2

       This is the same relative position
       as the circular-motion x-axis:

           circularSize / 2
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


    /* -----------------------------------------------------
       Vertical axis
    ----------------------------------------------------- */

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

}


/* =========================================================
   31. DRAW GRAPH AMPLITUDE SCALE
========================================================= */

function getGraphVisualAmplitude(
    area
) {

    const maximum =
        Math.min(
            area.height * 0.40,
            area.zeroY -
            area.top -
            10,
            area.bottom -
            area.zeroY -
            10
        );


    /*
       Map slider amplitude to visual height.

       Current slider:

           50 → 150

       Low A:
           smaller wave

       High A:
           taller wave
    */

    const ratio =
        (
            state.amplitude -
            MIN_AMPLITUDE
        ) /
        (
            MAX_AMPLITUDE -
            MIN_AMPLITUDE
        );


    const clampedRatio =
        Math.max(
            0,
            Math.min(
                1,
                ratio
            )
        );


    /*
       Keep a small visible amplitude
       even at minimum slider value.
    */

    return (
        maximum *
        (
            0.30 +
            0.70 *
            clampedRatio
        )
    );

}


/* =========================================================
   32. DRAW GRAPH AMPLITUDE LABELS
========================================================= */

function drawGraphAmplitudeLabels(
    ctx,
    area,
    visualAmplitude
) {

    if (!ctx) {
        return;
    }


    const plusY =
        area.zeroY -
        visualAmplitude;


    const minusY =
        area.zeroY +
        visualAmplitude;


    ctx.save();

    ctx.fillStyle =
        "#475569";

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "right";


    /*
       LIVE +A VALUE
    */

    ctx.fillText(
        `+A = ${formatNumber(
            state.amplitude,
            0
        )} px`,
        area.left - 8,
        plusY + 4
    );


    /*
       ZERO
    */

    ctx.fillText(
        "0",
        area.left - 8,
        area.zeroY + 4
    );


    /*
       LIVE -A VALUE
    */

    ctx.fillText(
        `−A = ${formatNumber(
            state.amplitude,
            0
        )} px`,
        area.left - 8,
        minusY + 4
    );


    ctx.restore();

}


/* =========================================================
   33. DRAW GRAPH SINE WAVE
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


    const samples =
        1000;


    ctx.save();

    ctx.beginPath();


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
            duration;


        /*
           PHYSICS EQUATION

               y = A sin(ωt)
        */

        const displacement =
            getGraphY(
                t
            );


        /*
           Convert physical displacement
           into normalized value:

               y / A

           → range -1 to +1.
        */

        const normalized =
            state.amplitude !== 0
                ? displacement /
                  state.amplitude
                : 0;


        /*
           Visual amplitude changes with
           the amplitude slider.
        */

        const screenY =
            area.zeroY -
            normalized *
            visualAmplitude;


        const screenX =
            timeToGraphX(
                t,
                area,
                duration
            );


        if (
            i === 0
        ) {

            ctx.moveTo(
                screenX,
                screenY
            );

        } else {

            ctx.lineTo(
                screenX,
                screenY
            );

        }

    }


    ctx.strokeStyle =
        "#2563eb";

    ctx.lineWidth =
        3;

    ctx.lineCap =
        "round";

    ctx.lineJoin =
        "round";

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
   34. DRAW CURRENT GRAPH POINT
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
       Keep the displayed graph time inside
       the visible graph interval.
    */

    const graphTime =
        state.time %
        duration;


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
       Current displacement.

           y = A sin(ωt)

       This is EXACTLY the same Y-component
       used by the circular motion.
    */

    const currentDisplacement =
        state.y;


    /*
       Normalize displacement:

           y / A
    */

    const normalized =
        state.amplitude !== 0
            ? currentDisplacement /
              state.amplitude
            : 0;


    /*
       Convert to screen coordinate.
    */

    const currentY =
        area.zeroY -
        normalized *
        visualAmplitude;


    /* =====================================================
       VERTICAL TIME INDICATOR
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
       CURRENT GRAPH POINT
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
       CURRENT y VALUE
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


    /*
       Prevent label from leaving
       the top of the graph.
    */

    if (
        labelY <
        area.top + 14
    ) {

        labelY =
            currentY + 22;

    }


    ctx.fillText(
        `y = ${formatNumber(
            currentDisplacement,
            1
        )} px`,
        currentX,
        labelY
    );


    ctx.restore();

}


/* =========================================================
   35. DRAW GRAPH TIME LABELS
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
        "#475569";

    ctx.font =
        "12px Arial";

    ctx.textAlign =
        "center";


    /*
       Because the graph shows exactly
       GRAPH_PERIODS complete periods,
       label every half period.
    */

    const numberOfIntervals =
        GRAPH_PERIODS * 2;


    for (
        let i = 0;
        i <= numberOfIntervals;
        i++
    ) {

        const t =
            (
                i /
                numberOfIntervals
            ) *
            duration;


        const x =
            timeToGraphX(
                t,
                area,
                duration
            );


        ctx.fillText(
            `${formatNumber(
                t,
                2
            )} s`,
            x,
            area.bottom + 18
        );

    }


    ctx.restore();

}


/* =========================================================
   36. DRAW GRAPH PERIOD MARKERS
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
        3,
        5
    ]);


    /*
       Mark each complete period.

           0
           T
           2T
    */

    for (
        let i = 0;
        i <= GRAPH_PERIODS;
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


    /* =====================================================
       T LABELS
    ===================================================== */

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

        const t =
            i *
            state.period;


        const x =
            timeToGraphX(
                t,
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
   37. DRAW GRAPH TITLE AND EQUATION
========================================================= */

function drawGraphLabels(
    ctx,
    area
) {

    if (!ctx) {
        return;
    }


    ctx.save();


    /* -----------------------------------------------------
       Equation
    ----------------------------------------------------- */

    ctx.fillStyle =
        "#2563eb";

    ctx.font =
        "bold 14px Arial";

    ctx.textAlign =
        "left";


    ctx.fillText(
        "y = A sin(ωt)",
        area.left + 8,
        area.top + 16
    );


    /* -----------------------------------------------------
       Live A
    ----------------------------------------------------- */

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
        )} px`,
        area.right,
        area.top + 15
    );


    /* -----------------------------------------------------
       Frequency
    ----------------------------------------------------- */

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
        area.top + 30
    );


    /* -----------------------------------------------------
       Period
    ----------------------------------------------------- */

    ctx.fillText(
        `T = ${formatNumber(
            state.period,
            2
        )} s`,
        area.right,
        area.top + 45
    );


    /* -----------------------------------------------------
       X-axis title
    ----------------------------------------------------- */

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
        area.bottom + 37
    );


    /* -----------------------------------------------------
       Y-axis title
    ----------------------------------------------------- */

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
   38. DRAW COMPLETE GRAPH
========================================================= */

function drawGraph() {

    if (
        !graphCanvas ||
        !graphCtx ||
        graphWidth <= 0 ||
        graphHeight <= 0
    ) {

        return;

    }


    /* =====================================================
       CLEAR
    ===================================================== */

    clearCanvas(
        graphCtx,
        graphWidth,
        graphHeight
    );


    /* =====================================================
       GRAPH AREA
    ===================================================== */

    const area =
        getGraphArea();


    /* =====================================================
       COMPLETE PERIOD DURATION
    ===================================================== */

    const duration =
        getGraphDuration();


    /*
       Safety check.
    */

    if (
        duration <= 0
    ) {

        return;

    }


    /* =====================================================
       CURRENT VISUAL AMPLITUDE
    ===================================================== */

    const visualAmplitude =
        getGraphVisualAmplitude(
            area
        );


    /* =====================================================
       GRID
    ===================================================== */

    drawGraphGrid(
        graphCtx,
        area,
        duration
    );


    /* =====================================================
       AXES
    ===================================================== */

    drawGraphAxes(
        graphCtx,
        area
    );


    /* =====================================================
       PERIOD MARKERS
    ===================================================== */

    drawGraphPeriodMarkers(
        graphCtx,
        area,
        duration
    );


    /* =====================================================
       SINE WAVE
    ===================================================== */

    drawGraphWave(
        graphCtx,
        area,
        duration,
        visualAmplitude
    );


    /* =====================================================
       LIVE GRAPH POINT
    ===================================================== */

    drawGraphCurrentPoint(
        graphCtx,
        area,
        duration,
        visualAmplitude
    );


    /* =====================================================
       LIVE AMPLITUDE ON Y-AXIS
    ===================================================== */

    drawGraphAmplitudeLabels(
        graphCtx,
        area,
        visualAmplitude
    );


    /* =====================================================
       GRAPH LABELS
    ===================================================== */

    drawGraphLabels(
        graphCtx,
        area
    );


    /* =====================================================
       TIME LABELS
    ===================================================== */

    drawGraphTimeLabels(
        graphCtx,
        area,
        duration
    );

}


/* =========================================================
   39. CHECK GRAPH / CIRCULAR AXIS ALIGNMENT
========================================================= */

function getAxisAlignmentRatio() {

    /*
       Circular x-axis:

           circularSize / 2
    */

    const circularAxisRatio =
        circularSize > 0
            ? 0.5
            : 0;


    /*
       Graph x-axis:

           graphHeight / 2
    */

    const graphAxisRatio =
        graphHeight > 0
            ? 0.5
            : 0;


    return {

        circular:
            circularAxisRatio,

        graph:
            graphAxisRatio,

        aligned:
            Math.abs(
                circularAxisRatio -
                graphAxisRatio
            ) < 0.001

    };

}


/* =========================================================
   END OF PART 3
========================================================= */

/* =========================================================
   PART 4 — CONTROLS + ANIMATION + INITIALIZATION
========================================================= */


/* =========================================================
   40. UPDATE SIMULATION
========================================================= */

function updateSimulation(
    deltaTime
) {

    if (
        !state.playing
    ) {

        return;

    }


    /*
       Advance simulation time.

           θ = ωt
    */

    state.time +=
        deltaTime;


    /*
       Prevent unnecessarily large
       time values.
    */

    if (
        state.period > 0 &&
        state.time > 100000
    ) {

        state.time =
            state.time %
            state.period;

    }


    /*
       Recalculate:

           θ = ωt

           y = A sin(θ)
    */

    calculateSHM();

}


/* =========================================================
   41. ANIMATION LOOP
========================================================= */

function animationLoop(
    timestamp
) {

    /*
       First frame.
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
       Prevent a huge jump if the
       browser was temporarily inactive.
    */

    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    /*
       Update physics.
    */

    updateSimulation(
        deltaTime
    );


    /*
       Redraw everything.

       This keeps:

       Circular motion
              ↓
       Y-component
              ↓
       SHM
              ↓
       Graph point

       synchronized.
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
   42. START ANIMATION
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
   43. PLAY / PAUSE
========================================================= */

function togglePlay() {

    state.playing =
        !state.playing;


    /*
       Reset timestamp when starting
       to prevent a large time jump.
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
   44. UPDATE PLAY BUTTON
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
   45. RESET SIMULATION
========================================================= */

function resetSimulation() {

    /*
       Stop animation.
    */

    state.playing =
        false;


    /*
       Reset phase/time.

           t = 0

           θ = 0

           y = A sin(0) = 0

           x = A cos(0) = A
    */

    state.time =
        0;

    state.theta =
        0;


    /*
       Keep current amplitude and frequency
       slider settings.
    */

    readControls();


    calculateSHM();


    updatePlayButton();

    updateDisplays();

    drawAll();

}


/* =========================================================
   46. AMPLITUDE SLIDER
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
       Update amplitude immediately.

           R = A

           y = A sin(ωt)
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
       IMPORTANT:

       Amplitude changes must immediately
       update the entire simulation.

       Circular radius
       SHM amplitude
       Graph height
       +A / -A labels
       Current graph point
    */

    calculateSHM();

    updateDisplays();

    drawAll();

}


/* =========================================================
   47. FREQUENCY SLIDER
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
       Keep the CURRENT time.

       Therefore the current phase changes
       naturally according to:

           θ = ωt
    */

    calculateSHM();

    updateDisplays();

    drawAll();

}


/* =========================================================
   48. Y COMPONENT TOGGLE
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
   49. SETUP CONTROLS
========================================================= */

function setupControls() {

    /* -----------------------------------------------------
       PLAY
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
       RESET
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
       AMPLITUDE

       "input" makes the graph respond
       continuously while dragging.
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
       FREQUENCY
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
       Y COMPONENT
    ----------------------------------------------------- */

    if (
        yComponentToggle
    ) {

        yComponentToggle.addEventListener(
            "change",
            handleYComponentToggle
        );

    }


    /* =====================================================
       KEYBOARD SHORTCUTS
    ===================================================== */

    document.addEventListener(
        "keydown",
        function(event) {

            const active =
                document.activeElement;


            const tag =
                active
                    ? active.tagName
                    : "";


            /*
               SPACE = Play / Pause
            */

            if (
                event.code ===
                "Space" &&
                tag !== "INPUT" &&
                tag !== "TEXTAREA" &&
                tag !== "BUTTON"
            ) {

                event.preventDefault();

                togglePlay();

            }


            /*
               R = Reset
            */

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
   50. COLLAPSIBLE PANEL FUNCTION
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
        function() {

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
   51. SETUP PANELS
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
   52. WINDOW RESIZE
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

                resizeAll();

            },
            100
        );

}


window.addEventListener(
    "resize",
    handleResize
);


/* =========================================================
   53. VISIBILITY CHANGE
========================================================= */

document.addEventListener(
    "visibilitychange",
    function() {

        /*
           If browser pauses the page,
           restart timing cleanly when
           animation resumes.
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
   54. INITIALIZE STATE
========================================================= */

function initializeState() {

    /*
       Read HTML slider values.
    */

    readControls();


    /*
       Read Y-component checkbox.
    */

    if (
        yComponentToggle
    ) {

        state.showYComponent =
            yComponentToggle.checked;

    }


    /*
       Start at:

           t = 0

           θ = 0

           x = A

           y = 0
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
   55. INITIALIZE SIMULATION
========================================================= */

function initializeSimulation() {

    initializeState();

    setupControls();

    setupPanels();

    resizeAll();

    drawAll();

    startAnimation();

}


/* =========================================================
   56. DOM READY
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