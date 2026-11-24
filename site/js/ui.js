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
// + Domain Content Filtering
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById("home-page");
    const studyPage = document.getElementById("study-page");
    const homeReturnButton = document.getElementById("home-return");

    const studyMain = studyPage?.querySelector(".layout > main");
    const sidebarNav = document.getElementById("sidebar-nav");
    const searchResults = document.getElementById("search-results");
    const homeSearchResults = document.getElementById("home-search-results");

    const domainCards = document.querySelectorAll(
        "#home-page [data-open-domain], #home-page [data-open-advanced]"
    );

    if (
        !homePage ||
        !studyPage ||
        !homeReturnButton ||
        !studyMain ||
        !sidebarNav
    ) {
        console.warn("페이지 전환에 필요한 HTML 요소를 찾을 수 없습니다.");
        return;
    }

    // 학습 콘텐츠 전체 수집
    const studySections = Array.from(
        studyMain.querySelectorAll("section[id][data-domain][data-level]")
    );

    // 현재 모드에서 해당 섹션을 표시할지 판단
    function matchesMode(section, mode) {
        if (mode === "advanced") {
            return section.dataset.level === "advanced";
        }

        return section.dataset.domain === String(mode);
    }

    // Domain 또는 Advanced Topics에 맞춰 콘텐츠 필터링
    function applyFilter(mode) {

        // 1. 학습 콘텐츠 필터링
        studySections.forEach(section => {
            section.hidden = !matchesMode(section, mode);
        });

        // 2. 본문 그룹 제목 필터링
        const groupTitles = studyMain.querySelectorAll(".group");

        groupTitles.forEach(group => {
            let sibling = group.nextElementSibling;
            let hasVisibleSection = false;

            // 다음 그룹 제목이 나오기 전까지 확인
            while (
                sibling &&
                !sibling.classList.contains("group")
            ) {
                if (
                    sibling.matches("section[data-domain]") &&
                    !sibling.hidden
                ) {
                    hasVisibleSection = true;
                }

                sibling = sibling.nextElementSibling;
            }

            group.hidden = !hasVisibleSection;
        });

        // 3. 사이드바 목차 필터링
        const navHeadings = Array.from(sidebarNav.children)
            .filter(element => element.tagName === "H2");

        navHeadings.forEach(heading => {
            const list = heading.nextElementSibling;

            if (!list || list.tagName !== "UL") {
                return;
            }

            let visibleCount = 0;

            const items = list.querySelectorAll("li");

            items.forEach(item => {
                const link = item.querySelector("a[href^='#']");

                if (!link) {
                    item.hidden = true;
                    return;
                }

                const targetId = link.getAttribute("href").slice(1);
                const targetSection = document.getElementById(targetId);

                const visible = targetSection
                    ? matchesMode(targetSection, mode)
                    : false;

                item.hidden = !visible;

                if (visible) {
                    visibleCount++;
                }
            });

            // 표시할 목차가 없는 그룹은 제목과 목록 모두 숨김
            heading.hidden = visibleCount === 0;
            list.hidden = visibleCount === 0;
        });
    }

    // Home 카드 클릭
    domainCards.forEach(card => {
        card.addEventListener("click", event => {
            event.preventDefault();

            const targetId = card.getAttribute("href")?.slice(1);

            const mode = card.hasAttribute("data-open-advanced")
                ? "advanced"
                : card.dataset.openDomain;

            // 해당 모드에 맞는 콘텐츠 표시
            applyFilter(mode);

            // Home 숨기기 / Study 표시
            homePage.hidden = true;
            studyPage.hidden = false;

            // 선택한 학습 섹션으로 이동
            requestAnimationFrame(() => {
                const targetSection = targetId
                    ? document.getElementById(targetId)
                    : null;

                if (targetSection && !targetSection.hidden) {
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

   
    // ==============================
    // Home / Study 검색 결과 클릭
    // ==============================

    const searchContainers = [
        searchResults,
        homeSearchResults
    ].filter(Boolean);

    searchContainers.forEach(container => {

        container.addEventListener("click", event => {

            const link = event.target.closest("a.search-result");

            if (!link) {
                return;
            }

            const targetId = link.getAttribute("href")?.slice(1);

            const targetSection = targetId
                ? document.getElementById(targetId)
                : null;

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            // 검색 결과가 속한 학습 모드 확인
            const mode = targetSection.dataset.level === "advanced"
                ? "advanced"
                : targetSection.dataset.domain;

            // 해당 도메인 또는 Advanced Topics 필터 적용
            applyFilter(mode);

            // Home에서 검색했다면 Study 페이지로 전환
            homePage.hidden = true;
            studyPage.hidden = false;

            // 검색 결과에 해당하는 학습 내용으로 이동
            requestAnimationFrame(() => {

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            });

        });

    });

    

    // Home 버튼 클릭
    homeReturnButton.addEventListener("click", () => {
        studyPage.hidden = true;
        homePage.hidden = false;

        window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});
