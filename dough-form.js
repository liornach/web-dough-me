import { Ingredient } from "./ingredient.js";

class DoughInput extends HTMLElement {
    constructor () {
        super();
    }

    connectedCallback() {
        const ingredientName = this.getAttribute('ingredientName');
        const placeHolder = this.getAttribute('placeholder');
    
        const shadow = this.attachShadow({ mode: 'open' });
    
        const label = document.createElement('label');
        label.setAttribute('for', 'input');
        label.textContent = ingredientName;
    
        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('value', placeHolder);
        input.setAttribute('id', 'input');
    
        const wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'wrapper');
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        
        const styles = this.getAttribute('styles');
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', styles);

        shadow.appendChild(link);
        shadow.appendChild(wrapper);
    }
    

    getInputAndClear() {
        /**@type {HTMLInputElement} */
        const input = this.shadowRoot.getElementById('input');
        const value = input.value;
        input.value = 0;
        return value;
    }

    ingredientName() {
        return this.getAttribute('ingredientName');
    }
}

customElements.define('dough-input', DoughInput);

class DoughForm extends HTMLElement {
    constructor () {
        super();
        /**@type {[Ingredient]} */
        this.baseIngredients = [
            new Ingredient(false, 'water'),
            new Ingredient(true, 'white flour'),
            new Ingredient(false, 'oil')];
    }

    connectedCallback() {
        const form = document.createElement('form');
        form.setAttribute('id', 'form');

        const styles = this.getAttribute('styles');
        this.baseIngredients.forEach(i=> {
            const input = document.createElement('dough-input');
            input.setAttribute('ingredientName', i.name());
            input.setAttribute('placeHolder', '0');
            input.setAttribute('styles', styles);
            form.appendChild(input);
        })

        const button = document.createElement('button');
        button.innerHTML = this.getAttribute('button-value');

        form.onsubmit = event => {
            event.preventDefault();
            console.log('submitting');
            /**@type {HTMLCollectionOf<DoughInput>} */
            const inputs = form.getElementsByTagName('dough-input');
            for (const i of inputs) {
                const value = i.getInputAndClear();
                console.log(`name : ${i.ingredientName()}, value : ${value}`);
            }
        }

        form.appendChild(button);
        const shadow = this.attachShadow( {mode:'open'} );

        const link = document.createElement('link');
        link.setAttribute('ret', 'stylesheet');
        link.setAttribute('href', styles);

        shadow.appendChild(link);
        shadow.appendChild(form);
    }
}

customElements.define('dough-form', DoughForm);