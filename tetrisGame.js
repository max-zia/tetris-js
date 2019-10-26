/** 
 * Represents a Tetris game.
 *
 * Game loop involves one of every block falling from the top until obstructed,
 * or until it contacts bottom. Blocks can be moved left, right, and down, 
 * and rotated.
 *  
 */

class TetrisGame {
	
	/** Constructs a new TetrisGame instance. */
	constructor() {
		this.exit = false;
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

				await sleep(250);
				if (!(this.currentBlock.obstruction())) {
					this.currentBlock.descend();
				} else {
					atBottom = true;
				}
			}

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