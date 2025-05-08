export class Ingredient {
    /**
     * @param {bool} isFlour 
     * @param {string} name 
     */
    constructor(isFlour, name) {
        this.#isFlour = isFlour;
        this.#name = name;
    }

    /**@type {bool} */
    #isFlour;
    /**@type {string} */
    #name;

    grams;

    isFlour() {
        return this.#isFlour;
    }

    name() {
        return this.#name;
    }
}