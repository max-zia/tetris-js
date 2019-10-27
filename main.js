/**
 * A coordinator for the game. Characterised by methods for playing the game,
 * showing the menu, and replaying the game after quitting.
 */

class Main {

    /** Constructs a new instance of main game. */
    constructor() {
        this.game = new TetrisGame();
    }

    /** Plays the game. */
    play() {
        this.game.run();
    }
}

var main = new Main();
main.play();