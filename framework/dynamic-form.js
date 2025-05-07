// dynamic-form.js
export class DynamicForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.fields = [];
  }

  connectedCallback() {
    const lang = this.getAttribute('lang') || 'en';
    const isHebrew = lang === 'he';
  
    const inputLabel = this.getAttribute('input-label') || (isHebrew ? 'שם שדה' : 'Field Name');
    const optionsAttr = this.getAttribute('options');
    let options = [
      { value: 'text', label: isHebrew ? 'טקסט' : 'Text' },
      { value: 'number', label: isHebrew ? 'מספר' : 'Number' }
    ];
    try {
      if (optionsAttr) {
        const parsed = JSON.parse(optionsAttr);
        if (Array.isArray(parsed)) options = parsed;
      }
    } catch (e) {
      console.warn('Invalid options JSON; using default options.');
    }
  
    const callbackName = this.getAttribute('submit-callback');
    this.submitCallback = (typeof window[callbackName] === 'function')
      ? window[callbackName]
      : (data) => console.warn(`Callback '${callbackName}' not found.`, data);
  
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: sans-serif;
          display: block;
          max-width: 500px;
          direction: ${isHebrew ? 'rtl' : 'ltr'};
          text-align: ${isHebrew ? 'right' : 'left'};
        }
        label, input, select, button {
          display: block;
          margin: 8px 0;
        }
        .error {
          color: red;
          font-size: 0.8em;
        }
      </style>
      <form id="form">
        <slot name="before-fields"></slot>
  
        <label id="nameLabel">${inputLabel}
          <input type="text" id="fieldNameInput" />
          <div class="error" id="nameError"></div>
        </label>
  
        <label>${isHebrew ? 'סוג שדה' : 'Field Type'}
          <select id="fieldTypeSelect">
            ${options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
        </label>
  
        <button type="button" id="addBtn">${isHebrew ? 'הוסף שדה' : 'Add Field'}</button>
        <div class="dynamic-fields" id="fieldsContainer"></div>
        <button type="button" id="submitBtn">${isHebrew ? 'שלח' : 'Submit'}</button>
  
        <slot name="after-fields"></slot>
      </form>
    `;
  
    this.shadowRoot.getElementById('addBtn')
      .addEventListener('click', () => this.addField());
  
    this.shadowRoot.getElementById('submitBtn')
      .addEventListener('click', () => this.submitForm());
  }

  validateFieldName(name) {
    const errorEl = this.shadowRoot.getElementById('nameError');
    errorEl.textContent = '';
  
    const isHebrew = this.getAttribute('lang') === 'he';
    let ret = true;
  
    if (!name) {
      errorEl.textContent = isHebrew ? 'חובה להזין שם שדה.' : 'Field name is required.';
      ret = false;
    } else {
      const valid = isHebrew
        ? /^[\u0590-\u05FF\w\s]+$/.test(name)
        : /^[\w\s]+$/.test(name);
  
      if (!valid) {
        errorEl.textContent = isHebrew
          ? 'רק אותיות (עברית), מספרים, רווחים וקווים תחתונים מותרים.'
          : 'Only letters, numbers, underscores, and spaces are allowed.';
        ret = false;
      } else if (this.fields.includes(name)) {
        errorEl.textContent = isHebrew
          ? `השדה "${name}" כבר קיים.`
          : `Field "${name}" already exists.`;
        ret = false;
      }
    }
  
    return ret;
  }


  addField() {
    const nameInput = this.shadowRoot.getElementById('fieldNameInput');
    const typeSelect = this.shadowRoot.getElementById('fieldTypeSelect');
    const name = nameInput.value.trim();
    const type = typeSelect.value;

    if (!this.validateFieldName(name)) return;

    this.fields.push(name);
    const container = this.shadowRoot.getElementById('fieldsContainer');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <label>${name}:
        <input name="${name}" type="${type}" />
      </label>
    `;
    container.appendChild(wrapper);
    nameInput.value = '';
  }

  submitForm() {
    const formData = {};
    const container = this.shadowRoot.getElementById('fieldsContainer');
    const inputs = container.querySelectorAll('input');

    inputs.forEach(input => {
      formData[input.name] = input.value;
    });

    this.submitCallback(formData);
  }
}

customElements.define('dynamic-form', DynamicForm);
