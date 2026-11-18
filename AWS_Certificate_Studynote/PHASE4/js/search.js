
/*
 * search.js
 * AWS 학습 노트 검색 기능
 */

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("site-search");
    const searchResults = document.getElementById("search-results");

    // 검색창 또는 결과 영역이 없으면 실행하지 않음
    if (!searchInput || !searchResults) {
        console.warn("검색창 또는 검색 결과 영역을 찾을 수 없습니다.");
        return;
    }

    // main 내부의 각 학습 주제를 검색 대상으로 설정
    const sections = Array.from(
        document.querySelectorAll("main section[id]")
    );

    // 검색 대상 데이터 생성
    const searchData = sections.map(section => {
        const title = section.querySelector("h2.t");

        return {
            id: section.id,
            title: title ? title.textContent.trim() : section.id,
            content: section.textContent.trim()
        };
    });

    // 검색어 정규화
    function normalize(text) {
        return text
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
    }

    // 검색 결과에 표시할 본문 일부 생성
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

    // 검색 결과 화면 출력
    function renderResults(results, keywords) {
        searchResults.replaceChildren();

        const count = document.createElement("p");
        count.className = "search-count";
        count.textContent = `검색 결과 ${results.length}개`;

        searchResults.appendChild(count);

        if (results.length === 0) {
            const message = document.createElement("p");
            message.className = "search-empty";
            message.textContent = "검색 결과가 없습니다.";

            searchResults.appendChild(message);
            return;
        }

        results.forEach(item => {
            const link = document.createElement("a");
            link.href = `#${item.id}`;
            link.className = "search-result";

            const title = document.createElement("strong");
            title.textContent = item.title;

            const snippet = document.createElement("p");
            snippet.textContent = createSnippet(
                item.content,
                keywords
            );

            link.appendChild(title);
            link.appendChild(snippet);

            // 결과 클릭 시 검색 결과 영역 초기화
            link.addEventListener("click", () => {
                searchInput.value = "";
                searchResults.replaceChildren();
            });

            searchResults.appendChild(link);
        });
    }

    // 검색 실행
    function search(query) {
        const normalizedQuery = normalize(query);

        searchResults.replaceChildren();

        if (!normalizedQuery) {
            return;
        }

        // 공백을 기준으로 검색어 분리
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

        // 제목에 검색어가 포함된 결과를 우선 표시
        results.sort((a, b) => {
            const aMatch = keywords.some(keyword =>
                normalize(a.title).includes(keyword)
            );

            const bMatch = keywords.some(keyword =>
                normalize(b.title).includes(keyword)
            );

            return Number(bMatch) - Number(aMatch);
        });

        // 검색 결과 출력
        renderResults(results, keywords);
    }

    // 검색창 입력 이벤트
    searchInput.addEventListener("input", () => {
        search(searchInput.value);
    });

    // ESC 키를 누르면 검색 초기화
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            searchInput.value = "";
            searchResults.replaceChildren();
            searchInput.blur();
        }
    });

    console.log(
        `검색 기능이 준비되었습니다. 검색 대상: ${searchData.length}개 주제`
    );
});
