import Character from "./character.js";

class Enemy extends Character{
    constructor(name, level, options) {
        super(name, level, options);
        this.turnFunction = options.turnFunction;
        this.enabled = false;
    }
    setTurnFunction(turnFunction) {
        this.turnFunction = this.turnFunction;
    }
    takeTurn() {
        // console.log(`${this.name}'s turn`)
        this.turnFunction(this);
    }
}

export default Enemy;