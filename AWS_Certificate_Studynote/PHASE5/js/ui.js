document.addEventListener("DOMContentLoaded", () => {
  const layout = document.querySelector(".layout");
  const toggle = document.querySelector("#sidebar-toggle");
  const icon = document.querySelector("#sidebar-toggle-icon");

  if (!layout || !toggle || !icon) {
    console.error("사이드바 요소를 찾을 수 없습니다.");
    return;
  }

  toggle.addEventListener("click", () => {
    const collapsed = layout.classList.toggle("sidebar-collapsed");

    if (collapsed) {
      // 목차가 접힌 상태: >>
      icon.innerHTML = `
        <path d="m9 5 7 7-7 7 M3 5l7 7-7 7"></path>
      `;

      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "목차 펼치기");
      toggle.setAttribute("title", "목차 펼치기");

    } else {
      // 목차가 펼쳐진 상태: <<
      icon.innerHTML = `
        <path d="M15 5 8 12l7 7 M21 5l-7 7 7 7"></path>
      `;

      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "목차 접기");
      toggle.setAttribute("title", "목차 접기");
    }
  });
});
