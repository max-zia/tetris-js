/** 
 * Represents a Tetris game.
 */

class TetrisGame {
	
	/** 
     * Constructs a new TetrisGame instance. Every block that falls during
     * the game is added to the blocks array, while blockSet array ensures
     * any sequence of seven blocks includes all tetromino types.  
     */
	constructor() {
        this.exit = false;                  // true when the game is over
        this.lineClears = 0                 // line clear score
        this.tetrisClears = 0;              // tetris clear score

		this.blockSet = [0, 1, 2, 3, 4, 5, 6];
		this.currentBlock = 0;
		this.blocks = [];
		this.blocks.push(new Block(16, 2, 104, 10, getRandomInt(0, 6), 1));
	}

	/** Draws the board to the screen. */
	drawBoard() {
		// Set XML namespace
		var xmlns = "http://www.w3.org/2000/svg";

		// Set the ID for the board
		var g = document.createElementNS(xmlns, "g");
		g.setAttribute("id", "tetrisBoard");
		document.getElementById("target").appendChild(g);

		// Create the board
		var board = document.createElementNS(xmlns, "rect");
		board.setAttribute("x", 47);
		board.setAttribute("y", 7);
		board.setAttribute("width", 184);
		board.setAttribute("height", 364);
		board.setAttribute("fill", "none");
		board.setAttribute("stroke", "black");
		board.setAttribute("stroke-width", 1.25);
		g.appendChild(board);
	}

	/** Adds event listener to control user inputs. */
	activateInput() {
		document.addEventListener("keydown", function(e) {
			if (e.code == "KeyQ") {
				this.exit = true;

			} else if (e.code == "ArrowRight") {
				this.currentBlock.setDirection(2);
				this.currentBlock.move();

			} else if (e.code == "ArrowLeft") {
				this.currentBlock.setDirection(1);
                this.currentBlock.move();

            } else if (e.code == "KeyR") {
				this.currentBlock.rotate();
			}

		}.bind(this), false);
    }
    
    /** Checks to see whether a row is full of blocks. */
    rowFull(row) {
        var i = 0;
        var col = 50;
        var check = false;

        while (i < 11) {
            if (i === 10) {
                check = true;
                i = 11; 
            } else if ((getElementsByXPath(`//*[@x='${col}'][@y='${row}']`).length) > 0) {
                col = col + 18;
                i++;
            } else {
                i = 11;
            }
        }
        return check;
    }

    /** Clears a row of square. */
    clearRow(row) {
        var i = 0;
        var col = 50;

        while (i < 10) {
            var square = getElementsByXPath(`//*[@x='${col}'][@y='${row}']`)[0];
            square.parentNode.removeChild(square);
            col = col + 18;
            i++;
        }
    }

    /** Shifts everything above a given row down 1 row after line clear. */
    shiftDown(row) {
        while (row > 9) {
            var col = 50;
            var i = 0;

            while (i < 10) {
                var square = getElementsByXPath(`//*[@x='${col}'][@y='${row}']`)[0];
                if (square != null) {
                    square.setAttribute("x", col);
                    square.setAttribute("y", (row + 18)); 
                }
                col = col + 18;
                i++;
            }
            row = row - 18;
        }
    }

    /** Checks every line, clears it, and shifts the blocks down. */
    checkRows() {
        var row = 352
        var linesCleared = 0;
        
        while (row > 9) {
            if (this.rowFull(row)) {
                this.clearRow(row);
                this.shiftDown(row - 18);
                linesCleared++;
            } else {
                row = row - 18;
            }
        }
        return linesCleared;
    }

	/** Starts the game. */
	async run() {
		var atBottom = false;
		var blockId = 1;

		this.drawBoard();						// initialise board
		this.activateInput();					// initialise inputs
		this.currentBlock = this.blocks[0];		// initialise current block

		// game loop
		while (!(this.exit)) {

			this.currentBlock.draw();

			// drop loop
			while ((!(this.exit)) & (!(atBottom))) {
				atBottom = this.currentBlock.atBottom();

				await sleep(200);
				if (!(this.currentBlock.obstruction())) {
					this.currentBlock.descend();
				} else {
					atBottom = true;
				}
            }
            
            // check lines and update scoring
            var roundScore = this.checkRows();
            if (roundScore == 4) {
                tetrisClears++;
            }
            lineClears = lineClears + roundScore;

			// setup blocks for next drop loop
			if (this.blockSet.length == 0) {
				this.blockSet = [0, 1, 2, 3, 4, 5, 6];
			}

			var index = getRandomInt(0, (this.blockSet.length - 1));
			var blockType = this.blockSet[index];
			this.blockSet.splice(index, 1);

			blockId++;
			this.blocks.push(new Block(16, 2, 104, 10, blockType, blockId));
			this.currentBlock = this.blocks[this.blocks.length - 1];

			// restart drop loop
			atBottom = false;
		}

		// game loop exit
		if (this.exit) {
			console.log("Game Over");
		}
	}
}

var main = new TetrisGame();
main.run();