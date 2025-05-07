export class Ingredient {
    #name;
    #isFlour;

    constructor(name, isFlour) {
        this.#name = name;
        this.#isFlour = isFlour;
    }

    isFlour() {
        return this.#isFlour;
    }

    name() {
        return this.#name;
    }
}