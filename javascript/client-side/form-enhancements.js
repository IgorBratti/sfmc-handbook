/*
  form-enhancements.js
  Progressive enhancement for CloudPage forms:
    - inline, accessible validation messages using the browser's Constraint Validation API
    - trims text values before submit
    - disables the submit button after the first valid submit (no double posts)

  Status:  Ready to test
  Usage:   <form data-enhance ...> ... </form>
           <script src=".../form-enhancements.js" defer></script>
  Notes:   Runs in the browser (ES2017). The server-side AMPscript validation is still the source of truth.
*/
(() => {
  "use strict";

  const MESSAGES = {
    valueMissing: "This field is required.",
    typeMismatch: "Please check the format.",
    patternMismatch: "Please check the format.",
    tooLong: "This value is too long."
  };

  function messageFor(field) {
    const v = field.validity;
    if (field.type === "checkbox" && v.valueMissing) return "Please tick this box to continue.";
    for (const key of Object.keys(MESSAGES)) {
      if (v[key]) return field.dataset[key] || MESSAGES[key];
    }
    return "";
  }

  function errorElementFor(field) {
    const id = `${field.id || field.name}-error`;
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("p");
      el.id = id;
      el.className = "field-error";
      el.setAttribute("aria-live", "polite");
      el.style.cssText = "color:#8a1c1c;font-size:13px;margin:-10px 0 14px;";
      const anchor = field.closest("label") || field;
      anchor.insertAdjacentElement("afterend", el);
      field.setAttribute("aria-describedby", id);
    }
    return el;
  }

  function validateField(field) {
    if (!field.willValidate || field.type === "hidden") return true;
    const msg = field.checkValidity() ? "" : messageFor(field);
    errorElementFor(field).textContent = msg;   // textContent: never inject HTML
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  function enhance(form) {
    form.setAttribute("novalidate", "");   // we show our own messages; the server validates anyway
    const fields = Array.from(form.elements).filter((el) => el.name && el.type !== "submit");

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      fields.forEach((f) => {
        if (["text", "email", "tel"].includes(f.type)) f.value = f.value.trim();
      });

      const invalid = fields.filter((f) => !validateField(f));
      if (invalid.length) {
        event.preventDefault();
        invalid[0].focus();
        return;
      }

      const button = form.querySelector("[type=submit]");
      if (button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = "Sending…";
      }
    });

    // Re-enable the button if the visitor comes back with the browser's Back button (bfcache).
    window.addEventListener("pageshow", () => {
      const button = form.querySelector("[type=submit]");
      if (button && button.disabled) {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
      }
    });
  }

  document.querySelectorAll("form[data-enhance]").forEach(enhance);
})();
