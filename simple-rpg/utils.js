const id = id => document.getElementById(id);


function gridDistance(x1, y1, x2, y2) {
    const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    return distance;
}

function gridDistanceBetweenBoxes(x1, y1, w1, h1, x2, y2, w2, h2) {
    return gridDistance(x1, y1, x2, y2);
    // let minDist = 1000;
    // for (let x1i = x1; x1i < x1 + w1; x1i++) {
    //     for (let y1i = y1; y1i < y1 + h1; y1i++) {
    //         for (let x2i = x2; x2i < x2 + w2; x2i++) {
    //             for (let y2i = y2; y2i < y2 + h2; y2i++) {
    //                 const dist = gridDistance(x1i, y1i, x2i, y2i)
    //                 // console.log(dist);
    //                 minDist = Math.min(minDist, dist);
    //             }
    //         }
    //     }
    // }
    // console.log(minDist);
    // return minDist;
}

function drawTextWithBox(ctx, text, x, y, {font, textFill, textStroke, boxFill, boxStroke}) {
    if (!textFill) textFill = 'white';
    if (!textStroke) textStroke = 'white';
    if (!boxFill) boxFill = 'grey';
    if (!boxStroke) boxStroke = 'grey';

    ctx.save();
    ctx.font = font;

    const textMetrics = ctx.measureText(text)
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    const textPadding = 2;
    // draw box
    ctx.fillStyle = boxFill;
    ctx.strokeStyle = boxStroke;
    ctx.beginPath();
    ctx.roundRect(
        x - textWidth / 2 - textPadding, y - textHeight / 2 - textPadding,
        textWidth + textPadding, textHeight + textPadding,
        3
    );
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // draw text
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = textFill;
    ctx.strokeStyle = textStroke;
    ctx.fillText(text, x, y);
    
    ctx.restore();
}


const sizeToBlocks = {
    "tiny": 0.5,
    "small": 1,
    "medium": 1,
    "large": 2,
    "huge": 3
}

export { id, gridDistance, gridDistanceBetweenBoxes, drawTextWithBox, sizeToBlocks };