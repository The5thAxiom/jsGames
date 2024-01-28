import Character from "./character.js";

class Player extends Character {
    constructor(name, level, options) {
        super(name, level, options);
        this.enabled = true;
    }
}

export default Player;