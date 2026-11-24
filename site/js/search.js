
/*
 * search.js
 * AWS 학습 노트 통합 검색 기능
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // 1. 검색 대상 데이터 수집
    // ==============================

    const sections = Array.from(
        document.querySelectorAll(
            "#study-page main section[id][data-domain][data-level]"
        )
    );

    const searchData = sections.map(section => {
        const title = section.querySelector("h2.t");

        return {
            id: section.id,
            title: title ? title.textContent.trim() : section.id,
            content: section.textContent.trim(),
            domain: section.dataset.domain,
            level: section.dataset.level
        };
    });

    // ==============================
    // 2. 검색어 정규화
    // ==============================

    function normalize(text) {
        return text
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    // ==============================
    // 3. 검색 결과 미리보기 생성
    // ==============================

    function createSnippet(content, keywords) {
        const normalizedContent = normalize(content);

        let matchIndex = -1;

        for (const keyword of keywords) {
            const index = normalizedContent.indexOf(keyword);

            if (index !== -1) {
                matchIndex = index;
                break;
            }
        }

        if (matchIndex === -1) {
            return content.slice(0, 100) + "...";
        }

        const start = Math.max(0, matchIndex - 35);
        const end = Math.min(content.length, matchIndex + 85);

        return (
            (start > 0 ? "..." : "") +
            content.slice(start, end) +
            (end < content.length ? "..." : "")
        );
    }

    // ==============================
    // 4. 검색 결과 출력
    // ==============================

    function renderResults(results, keywords, resultsContainer, searchInput) {

        resultsContainer.replaceChildren();

        const count = document.createElement("p");
        count.className = "search-count";
        count.textContent = `검색 결과 ${results.length}개`;

        resultsContainer.appendChild(count);

        if (results.length === 0) {
            const message = document.createElement("p");
            message.className = "search-empty";
            message.textContent = "검색 결과가 없습니다.";

            resultsContainer.appendChild(message);
            return;
        }

        results.forEach(item => {

            const link = document.createElement("a");
            link.href = `#${item.id}`;
            link.className = "search-result";

            // 학습 주제 제목
            const title = document.createElement("strong");
            title.textContent = item.title;

            // 소속 도메인 및 학습 수준
            const meta = document.createElement("span");
            meta.className = "search-meta";

            const levelLabel = item.level === "advanced"
                ? "Advanced Topics"
                : "기본 학습";

            meta.textContent =
                `Domain ${item.domain} · ${levelLabel}`;

            // 검색어가 포함된 본문 일부
            const snippet = document.createElement("p");
            snippet.textContent = createSnippet(
                item.content,
                keywords
            );

            link.appendChild(title);
            link.appendChild(meta);
            link.appendChild(snippet);

            // 결과 클릭 시 해당 검색창 초기화
            link.addEventListener("click", () => {
                searchInput.value = "";
                resultsContainer.replaceChildren();
            });

            resultsContainer.appendChild(link);
        });
    }

    // ==============================
    // 5. 검색 실행
    // ==============================

    function search(query, resultsContainer, searchInput) {

        const normalizedQuery = normalize(query);

        resultsContainer.replaceChildren();

        if (!normalizedQuery) {
            return;
        }

        const keywords = normalizedQuery.split(" ");

        // 모든 검색어가 포함된 주제만 추출
        const results = searchData.filter(item => {

            const searchableText = normalize(
                item.title + " " + item.content
            );

            return keywords.every(keyword =>
                searchableText.includes(keyword)
            );
        });

        // 제목에 검색어가 포함된 결과 우선 표시
        results.sort((a, b) => {

            const aMatch = keywords.some(keyword =>
                normalize(a.title).includes(keyword)
            );

            const bMatch = keywords.some(keyword =>
                normalize(b.title).includes(keyword)
            );

            return Number(bMatch) - Number(aMatch);
        });

        renderResults(
            results,
            keywords,
            resultsContainer,
            searchInput
        );
    }

    // ==============================
    // 6. 검색창 초기화 함수
    // ==============================

    function initializeSearch(inputId, resultsId) {

        const searchInput = document.getElementById(inputId);
        const searchResults = document.getElementById(resultsId);

        if (!searchInput || !searchResults) {
            console.warn(
                `${inputId} 또는 ${resultsId} 요소를 찾을 수 없습니다.`
            );
            return;
        }

        // 검색창 입력 이벤트
        searchInput.addEventListener("input", () => {
            search(
                searchInput.value,
                searchResults,
                searchInput
            );
        });

        // ESC 키를 누르면 검색 초기화
        searchInput.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                searchInput.value = "";
                searchResults.replaceChildren();
                searchInput.blur();
            }
        });
    }

    // ==============================
    // 7. Home / Study 검색창 연결
    // ==============================

    initializeSearch(
        "home-site-search",
        "home-search-results"
    );

    initializeSearch(
        "site-search",
        "search-results"
    );

    console.log(
        `통합 검색 기능이 준비되었습니다. 검색 대상: ${searchData.length}개 주제`
    );

});
