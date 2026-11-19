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


// ==============================
// Home / Study Page Navigation
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById("home-page");
    const studyPage = document.getElementById("study-page");
    const homeReturnButton = document.getElementById("home-return");

    const domainCards = document.querySelectorAll(
        "[data-open-domain], [data-open-advanced]"
    );

    // 필수 HTML 요소 확인
    if (!homePage || !studyPage || !homeReturnButton) {
        console.warn("페이지 전환에 필요한 HTML 요소를 찾을 수 없습니다.");
        return;
    }

    // Home 카드 클릭 시 Study 화면 표시
    domainCards.forEach(card => {
        card.addEventListener("click", event => {
            event.preventDefault();

            const href = card.getAttribute("href");
            const targetId = href ? href.substring(1) : null;

            // Home 숨기기 / Study 표시
            homePage.hidden = true;
            studyPage.hidden = false;

            // 화면 전환 후 해당 학습 섹션으로 이동
            requestAnimationFrame(() => {
                const targetSection = targetId
                    ? document.getElementById(targetId)
                    : null;

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                } else {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            });
        });
    });

    // Home 버튼 클릭 시 Home 화면으로 복귀
    homeReturnButton.addEventListener("click", () => {
        studyPage.hidden = true;
        homePage.hidden = false;

        // URL에 남아 있는 해시 제거
        window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
        );

        // 페이지 최상단으로 이동
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
