// playwright-mcp-example.js
// Node.js에서 실행 가능한 Playwright 예시 코드

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://dhlottery.co.kr/common.do?method=main');

  // 네트워크 요청 중 JSON 응답 캡처
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('getGameInfoAll')) {
      try {
        const data = await response.json();
        console.log('JSON Data:', data);
      } catch (e) {
        // 파싱 에러 무시
      }
    }
  });

  try {
    await page.waitForSelector('#speetto2000', { timeout: 10000 });

    // DOM에서 필요한 정보 추출
    const infos = await page.$$eval('#speetto2000', (nodes) =>
      nodes.map((el) => {
        const text = el.innerText.trim();
        const img = el.querySelector('div.img_area > img');
        const imgSrc = img ? img.src : null;
        const tag = el.outerHTML;

        // ul 텍스트 분리
        let text1 = null,
          text2 = null,
          text3 = null;
        const ul1 = el.querySelector('div:nth-child(4) > a > ul:nth-child(1)');
        const ul2 = el.querySelector('div:nth-child(4) > a > ul:nth-child(2)');
        const ul3 = el.querySelector('div:nth-child(4) > a > ul:nth-child(3)');
        if (ul1) text1 = ul1.innerText.trim();
        if (ul2) text2 = ul2.innerText.trim();
        if (ul3) text3 = ul3.innerText.trim();

        // 판매점 입고율 날짜와 퍼센트
        let storeRateDate = null;
        let storeRatePercent = null;
        const dateEl = el.querySelector(
          'div:nth-child(6) > a > ul > li:nth-child(1) > span'
        );
        if (dateEl)
          storeRateDate = dateEl.innerText.replace(/ 기준.*/, '').trim();
        const percentEl = el.querySelector(
          'div:nth-child(6) > a > ul > li:nth-child(2) > span > em'
        );
        if (percentEl) storeRatePercent = percentEl.innerText.trim() + ' %';

        return {
          text,
          imgSrc,
          tag,
          text1,
          text2,
          text3,
          storeRateDate,
          storeRatePercent,
        };
      })
    );

    // infos 가공
    const resultArr = infos.map((info) => {
      // title 추출 (strong 태그 텍스트, span 제거)
      let title = null;
      const strongMatch = info.tag.match(/<strong[^>]*>(.*?)<\/strong>/s);
      if (strongMatch) {
        title = strongMatch[1].replace(/<span[^>]*>|<\/span>/g, '').trim();
      }

      // 등위, 금액, 매수 배열로 분리
      const ranksArr = info.text1
        ? info.text1.split('\n').filter((_, i) => i % 2 === 0)
        : [];
      const amounts = info.text2 ? info.text2.split('\n') : [];
      const counts = info.text3 ? info.text3.split('\n') : [];
      const ranks = [];

      for (
        let i = 0;
        i < Math.min(ranksArr.length, amounts.length, counts.length);
        i++
      ) {
        ranks.push({
          rank: ranksArr[i],
          amount: amounts[i],
          count: counts[i],
        });
      }

      return {
        title,
        ranks,
        img: info.imgSrc,
        storeRateDate: info.storeRateDate,
        storeRatePercent: info.storeRatePercent,
      };
    });

    if (resultArr.length > 0) {
      console.log('최종 결과:', resultArr);
      fs.writeFileSync(
        'result.json',
        JSON.stringify(resultArr, null, 2),
        'utf-8'
      );
      console.log('result.json 파일로 저장되었습니다.');
    }
  } catch (e) {
    console.log('지정한 경로의 텍스트를 찾을 수 없습니다.', e);
  }

  await browser.close();
})();
