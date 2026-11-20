/*
  utm-persistence.js
  Keeps campaign parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term)
  for the whole browser session and fills matching hidden fields on any page.

  Why: visitors often land on page A with UTMs and submit a form on page B. Without this,
  the form only sees "direct".

  Status:  Ready to test
  Usage:   <input type="hidden" name="utm_source"> (and any other utm_* you want)
           <script src=".../utm-persistence.js" defer></script>
  Notes:   - Runs in the browser (ES2017). sessionStorage only: cleared when the tab closes.
           - Values are allow-listed here AND must be allow-listed again on the server
             (see cloudpages/security.md): the browser is not a trusted source.
           - Last-touch within the session: a new UTM in the URL replaces the stored one.
*/
(() => {
  "use strict";

  const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const STORAGE_KEY = "sfmc_utms";
  const SAFE = /^[A-Za-z0-9_.-]{1,50}$/;

  function readStorage() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};   // storage blocked (privacy mode, embedded iframe): keep working without it
    }
  }

  function writeStorage(data) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  }

  const params = new URLSearchParams(window.location.search);
  const stored = readStorage();
  let changed = false;

  KEYS.forEach((key) => {
    const value = params.get(key);
    if (value && SAFE.test(value)) {
      stored[key] = value;
      changed = true;
    }
  });

  if (changed) writeStorage(stored);

  KEYS.forEach((key) => {
    if (!stored[key]) return;
    document.querySelectorAll(`input[type=hidden][name="${key}"]`).forEach((input) => {
      if (!input.value || input.value === "direct") input.value = stored[key];
    });
  });
})();
