const id = id => document.getElementById(id);


function gridDistance(x1, y1, x2, y2) {
    const distance = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    return distance;
}

// function gridItemToPointDistance(item, x, y) {}

const sizeToBlocks = {
    "tiny": 0.5,
    "small": 1,
    "medium": 1,
    "large": 2,
    "huge": 3
}

export { id, gridDistance, sizeToBlocks };