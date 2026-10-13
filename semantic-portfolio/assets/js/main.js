// Small progressive enhancement; the pages remain navigable without JavaScript.
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});

const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    if (!form.reportValidity()) {
      status.textContent = "Please check the highlighted fields and try again.";
      return;
    }
    status.textContent = "Thanks — this demo form is validated, but it is not connected to a message service yet.";
  });
}
