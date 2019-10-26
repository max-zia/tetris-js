/** 
 * Takes xpath expression as arg and returns array of matching elements. 
 */
function getElementsByXPath(xpath, parent)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
}

/** 
 * Pauses the current async function. 
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns coordinates for a specific tetromino type.
 */
function blockCoordinates(tetromino, x, y, size, gapSize) {
    var i = 0;
    var dx = 0;
    var gap = 0;
    var coordinates = [[], [], [], []];

    while (i < 4) {
        if (tetromino[i] < 4) {
            dx = (x + (size * tetromino[i]));
            gap = (gapSize * tetromino[i]);
            coordinates[i].push(dx + gap);
            coordinates[i].push(y);

        } else {
            dx = (x + (size * (tetromino[i] - 4 )));
            gap = (gapSize * (tetromino[i] - 4));
            coordinates[i].push(dx + gap);
            coordinates[i].push(y + size + gapSize);
        }
        i++;
    }
    return coordinates;
}

/**
 * Draws a specific set of coordinates to the screen.
 */
function drawCoordinates(type, coordinates, id, size) {
    // Set XML namespace
    var xmlns = "http://www.w3.org/2000/svg";

    // Set the ID for the group of rects that'll hold the Block 
    var g = document.createElementNS(xmlns, "g");
    g.setAttribute("id", id);
    document.getElementById("target").appendChild(g);

    coordinates.forEach(function(pair) {
        var square = document.createElementNS(xmlns, "rect");
        square.setAttribute("x", pair[0]);
        square.setAttribute("y", pair[1]);
        square.setAttribute("rx", 1);
        square.setAttribute("ry", 1);
        square.setAttribute("width", size);
        square.setAttribute("height", size);
        square.setAttribute("id", id);
        square.setAttribute("fill", type[4]);
        square.setAttribute("stroke-width", 1.25);
        square.setAttribute("stroke", "black");
        g.appendChild(square);
    });
}