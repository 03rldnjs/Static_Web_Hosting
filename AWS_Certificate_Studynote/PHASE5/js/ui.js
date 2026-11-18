document.addEventListener("DOMContentLoaded", () => {
  const layout = document.querySelector(".layout");
  const toggle = document.querySelector("#sidebar-toggle");

  if (!layout || !toggle) return;

  toggle.addEventListener("click", () => {
    const collapsed = layout.classList.toggle("sidebar-collapsed");

    toggle.textContent = collapsed
      ? "목차 펼치기"
      : "목차 접기";

    toggle.setAttribute("aria-expanded", String(!collapsed));
  });
});
