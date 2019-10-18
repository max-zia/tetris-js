/** 
 * A graphical tetromino. Characterised by a starting location (x, y), size,
 * type code (determines shape), and set of coordinates.   
 *
 * More info ...
 */

class Block {

	/** Constructs a new Block. */
	constructor(size, gapSize, x, y, id) {
		this.size = size;
		this.gapSize = gapSize;
		this.x = x;
		this.y = y;
		this.id = id;

		this.direction = 0;

		this.type = this.getType();
		this.coordinates = this.getCoordinates();
	}

	/** Returns the tetromino type code as 4-item array. */
	getType() {
		return [0, 1, 2, 6];
	}

	/** Uses a 4x4 matrix to hold the sets of coordinates needed for Block. */
	getCoordinates() {
		var i = 0;
		var dx = 0;
		var gap = 0;
		var coordinates = [[], [], [], []];

		while (i < 4) {
			if (this.type[i] < 4) {
				dx = (this.x + (this.size * this.type[i]));
				gap = (this.gapSize * this.type[i]);
				coordinates[i].push(dx + gap);
				coordinates[i].push(this.y);

			} else {
				dx = (this.x + (this.size * (this.type[i] - 4 )));
				gap = (this.gapSize * (this.type[i] - 4));
				coordinates[i].push(dx + gap);
				coordinates[i].push(this.y + this.size + this.gapSize);
			}
			i++;
		}

		return coordinates;
	}

	/** Draws the Block to the screen. */
	draw() {
		// Set XML namespace
		var xmlns = "http://www.w3.org/2000/svg";

		// Set the ID for the group of rects that'll hold the Block 
		var g = document.createElementNS(xmlns, "g");
		g.setAttribute("id", this.id);
		document.getElementById("target").appendChild(g);

		this.coordinates.forEach(function(pair) {
			var square = document.createElementNS(xmlns, "rect");
			square.setAttribute("x", pair[0]);
			square.setAttribute("y", pair[1]);
			square.setAttribute("rx", 2);
			square.setAttribute("ry", 2);
			square.setAttribute("width", this.size);
			square.setAttribute("height", this.size);
			square.setAttribute("id", this.id);
			g.appendChild(square);
		}, this);
	}

	/** Removes the Block from the screen. */
	hide() {
		var block = document.getElementById(this.id);
		block.parentNode.removeChild(block);
	}

	/** 
	 * Moves the Block one step in the Block's direction by adding
	 * the width of the Tetris game's cols to each x coordinate. 
	 * The Block cannot move left or right if doing so would exceed
	 * the left or right wall.
	 */
	move() {
		this.hide();

		if (this.direction == 1) {
			this.coordinates.forEach(function(pair) {
				pair[0] = pair[0] - (this.size + this.gapSize); 
			}, this);
		} else if (this.direction == 2) {
			this.coordinates.forEach(function(pair) {
				pair[0] = pair[0] + (this.size + this.gapSize); 
			}, this);
		}

		this.draw();
	}

	/** Sets the Block's direction (1 = left, 2 = right). */
	setDirection(Adirection) {
		this.direction = Adirection;
	}

	/** Rotates the Block 90 degrees clockwise. */
	rotate() {

		// Get width and height of Block
		var block = document.getElementById(this.id);
		var width = block.getBoundingClientRect().width
		var height = block.getBoundingClientRect().height

		// Get the coordinates of the Block's pivot 
		var px = []; var py = [];
		this.coordinates.forEach(function(pair) {
			px.push(pair[0]); py.push(pair[1]);
		});
		px = Math.min(...px) + (width / 2);
		py = Math.min(...py) + (height / 2);

		// Implement the rotation
		this.hide()

		this.coordinates.forEach(function(pair) {
			var tempx = pair[0];
			pair[0] = px + py - pair[1] - this.size;
			pair[1] = tempx + py - px;  
		}, this);

		this.draw();
	}

}
