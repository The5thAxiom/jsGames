class Action {
    /*
    type: melee, rangedSingleTarget, rangedAOE
    effect: target => void
    */
    constructor(name, options) {
        this.name = name;
        this.description = options.description;
        this.type = options.type;
        this.range = options.range;
        this.effect = options.effect;
        this.maxUses = options.maxUses;
        this.currentUses = options.currentUses || options.maxUses;
        this.isValidTarget = options.isValidTarget ?? ((character, target) => true);
        this.targetSize = options.targetSize ?? 1;
        this.maxUses = options.maxUses;
        this.remainingUses = this.maxUses;
    }
}

export default Action;