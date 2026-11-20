/*
  fetch-json.js
  postJson(url, payload, options) -> Promise<{ ok, status, data, error }>
  Calls a JSON Code Resource (see ../ssjs/scripts/json-endpoint.ssjs) with a timeout,
  JSON parsing and one normalized result shape, so the UI code never deals with raw exceptions.

  Status:  Ready to test
  Usage:
    <script src=".../fetch-json.js" defer></script>
    <script>
      document.querySelector("#interest-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const result = await postJson(form.action, {
          email: form.email.value,
          topic: form.topic.value,
          website: form.website.value          // honeypot
        });
        form.querySelector(".status").textContent = result.ok
          ? "Thanks! You're on the list."
          : "Something went wrong. Please try again.";
      });
    </script>
  Notes:   Runs in the browser (ES2017). Same-origin calls are recommended (no CORS needed).
*/
(() => {
  "use strict";

  async function postJson(url, payload, { timeoutMs = 10000 } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin",
        signal: controller.signal
      });

      let data = null;
      try { data = await response.json(); } catch (e) { /* empty or non-JSON body */ }

      if (!response.ok) return { ok: false, status: response.status, data, error: "http_error" };
      if (data && data.ok === false) return { ok: false, status: response.status, data, error: data.error || "rejected" };
      return { ok: true, status: response.status, data, error: null };

    } catch (err) {
      const error = err.name === "AbortError" ? "timeout" : "network_error";
      return { ok: false, status: 0, data: null, error };
    } finally {
      clearTimeout(timer);
    }
  }

  window.postJson = postJson;
})();
