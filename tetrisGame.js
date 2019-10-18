/** Represents a Tetris game. */

class TetrisGame {
	
	/** Constructs a new TetrisGame instance. */
	constructor() {
		this.exit = false;
		this.currentBlock = new Block(15, 2, 50, 50, "first block");
	}

	run() {
		this.currentBlock.draw();

		// add an event listener to document
		document.addEventListener("keydown", function(e) {
			if (e.code == "ArrowRight") {
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
}

var main = new TetrisGame();
main.run();