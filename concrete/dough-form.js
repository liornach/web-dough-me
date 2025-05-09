import { Ingredient } from "./ingredient";

class DoughForm extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const form = document.createElement('dynamic-form');

        /**@type {[Ingredient]} */
        const baseIngredients = this.getAttribute('base-ingredients');
        baseIngredients.forEach( ing => {
            const nameAttr = ing.name();
            
        });
    }
}