/** 
 * A graphical tetromino. Characterised by a starting location (x, y), size,
 * type code (determines shape), and set of coordinates.   
 *
 * More info ...
 */

class Block {

	/** Constructs a new Block. */
	constructor(size, gapSize, x, y, blockType, id) {
		this.size = size;
		this.gapSize = gapSize;
		this.x = x;
		this.y = y;
		this.id = id;

		this.direction = 0;
		this.rotation = false;

		this.type = this.getType(blockType);
		this.coordinates = this.getCoordinates();
	}

	/** 
	 * Returns the tetromino type code as 4-item array. The type code returned
	 * is determined by the tetrisGame gameloop such that available block types
	 * are randomly cycled through.
	 */
	getType(blockType) {
		var typeCodes = [
			[0, 1, 2, 3, "#00FFFF"],
			[0, 1, 2, 6, "blue"],
			[0, 1, 2, 4, "orange"],
			[0, 1, 5, 6, "red"],
			[1, 2, 4, 5, "green"],
			[0, 1, 2, 5, "purple"],
			[0, 1, 4, 5, "yellow"]
		]

		return typeCodes[blockType];
	}

	/** Uses a 4x4 matrix to hold the sets of coordinates needed for Block. */
	getCoordinates() {
		return blockCoordinates(this.type, this.x, this.y, this.size, this.gapSize);
	}

	/** Draws the Block to the screen. */
	draw() {
        drawCoordinates(this.type, this.coordinates, this.id, this.size);
	}

	/** Removes the Block from the screen. */
	hide() {
		var block = document.getElementById(this.id);
		block.parentNode.removeChild(block);
    }

    /** Prints Block off-screen (for showing next block). */
    showNext() {
        var settings = {
            "#00FFFF": 242,
            "yellow": 260,
            "blue": 250,
            "orange": 250,
            "red": 250,
            "purple": 250,
            "green": 250
        }

        this.coordinates.forEach(function(pair) {
            pair[0] = pair[0] + settings[this.type[4]];
            pair[1] = pair[1] + 170;
        }, this);

        this.draw();
    }

    /** Resets coordinates back to starting position. */
    reset() {
        this.hide();
        this.x = 104;
        this.y = 10;
        this.coordinates = this.getCoordinates();
    }

	/** 
	 * Moves the Block one step in the Block's direction by adding
	 * the width of the Tetris game's cols to each x coordinate. 
	 * The Block cannot move left or right if doing so would exceed
	 * the left or right wall.
	 */
	move() {
		var xmax = Math.max(
			this.coordinates[0][0], 
			this.coordinates[1][0], 
			this.coordinates[2][0], 
			this.coordinates[3][0]
		);
		var xmin = Math.min(
			this.coordinates[0][0], 
			this.coordinates[1][0], 
			this.coordinates[2][0], 
			this.coordinates[3][0]
		);

		this.hide();

		if ((this.direction == 1) & (xmin != 50) & (!this.obstruction("left"))) {
			this.coordinates.forEach(function(pair) {
				pair[0] = pair[0] - (this.size + this.gapSize); 
			}, this);
		} else if ((this.direction == 2) & (xmax + 16 != 228) & (!this.obstruction("right"))) {
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

	/** Moves Block one step down if doing so would not pass bottom wall. */
	descend() {
		this.hide();

		this.coordinates.forEach(function(pair) {
			pair[1] = pair[1] + (this.size + this.gapSize);
		}, this);

		this.draw();
    }
    
    /** Causes Block to descend as far as it can without obstruction. */
    hardDrop() {
        var flag = true;
        
        while (flag) {
            var ymax = Math.max(
                this.coordinates[0][1], 
                this.coordinates[1][1], 
                this.coordinates[2][1], 
                this.coordinates[3][1]
            );
            if ((ymax < 315) & (!(this.obstruction("below")))) {
                this.hide();
                this.coordinates.forEach(function(pair) {
                    pair[1] = pair[1] + (this.size + this.gapSize);
                }, this);
                this.draw();
            } else {
                flag = false;
            }
        }
    }

	/** Rotates the Block 90 degrees clockwise. */
	rotate() {
        var overrotation = 0;
        var tPieceControl = 1;

        if (this.type[4] == "yellow") {
            // pass
        } else {
            // Get skew to ensure the Block aligns with 20x10 grid
            if (!(this.rotation)) {
                var skew = ((this.size + this.gapSize) / 2);
            } else {
                var skew = -((this.size + this.gapSize) / 2);
            }
            this.rotation = !(this.rotation);

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
                pair[0] = (px + py - pair[1] - this.size) + skew;
                pair[1] = (tempx + py - px) + skew;  

                if (pair[0] < 50) {
                    overrotation = 1;
                } else if (pair[0] > 228) {
                    overrotation = -1;
                }
            }, this);

            // Correct for overrotation
            if (overrotation != 0) {
                if (this.type[4] == "#00FFFF") {
                    tPieceControl = 2;
                }
                this.coordinates.forEach(function(pair) {
                    pair[0] = pair[0] + (overrotation * (tPieceControl * 18));
                });
            }

            this.draw();
        }
	}

	/** Returns true if block has hit the lowest col of the board. */
	atBottom() {
		var check = false;
		var ymax = Math.max(
			this.coordinates[0][1], 
			this.coordinates[1][1], 
			this.coordinates[2][1], 
			this.coordinates[3][1]
		);

		if (ymax == 334) {
			check = true;
		}

		return check;
	}

	/** 
	 * Checks to see whether an obstruction exists for the block. XPath queries
	 * are used to check for blocks with coordinates that would match the 
	 * position each square would move to. 
	 */
	obstruction(where) {
		var check = false;

		this.coordinates.forEach(function(pair) {
            if (where === "below") {
                var newx = pair[0];
                var newy = pair[1] + this.size + this.gapSize;
            } else if (where === "right") {
                var newx = pair[0] + this.size + this.gapSize;
                var newy = pair[1];
            } else {
                var newx = pair[0] - this.size - this.gapSize;
                var newy = pair[1];
            }

			var a = JSON.stringify(this.coordinates);
			var b = JSON.stringify([newx, newy]);

			if ((a.indexOf(b)) != -1) {
				// pass
			} else {
				if ((getElementsByXPath(`//*[@x='${newx}'][@y='${newy}']`).length) > 0) {
					check = true;
				}
			}
		}, this);

		return check;
	}
}
