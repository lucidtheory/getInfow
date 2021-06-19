const fs = require('fs');

const saveAllResults = async (page, pageNumber) => {
    // Grab all pieces of data per cell on this page of results
    console.log(`working on search page ${pageNumber}...`);
    const keywords = await page.$$eval('.keywords', keys => keys.map(key => key.innerText));
    const searchRank = await page.$$eval('td[data-title="Search Rank"]', ranks => ranks.map(rank => rank.innerText.replace(/,/g, '')));
    const searchVolume = await page.$$eval('td[data-title="Amazon Search Volume"]', vols => vols.map(vol => vol.innerText.replace(/,/g, '')));
    const resultCount = await page.$$eval('td[data-title="Results"]', counts => counts.map(count => count.innerText.replace(/,/g, '')));
    const reviewCount = await page.$$eval('td[data-title="Reviews"]', counts => counts.map(count => count.innerText.replace(/,/g, '')));
    const amazonsChoice = await page.$$eval('td[data-title="Amazon\'s Choice"]', results => results.map(res => res.innerText.replace(/,/g, '')));

    // append this page of results to the csv file
    for (let i = 0; i < keywords.length; i++) {
        fs.appendFileSync(
            'src/results/christianResults.txt',
            `${keywords[i]},${searchRank[i]},${searchVolume[i]},${resultCount[i]},${reviewCount[i]},${amazonsChoice[i]}\n`,
        );
    }

    // go to the next page if there is one and save those results
    const nextPage = await page.evaluate(() => document.querySelector('a[aria-label="Next"]'));
    if (nextPage) {
        const element = await page.$('a[aria-label="Next"]');
        const href = await page.evaluate(el => el.href, element);
        await Promise.all([
            page.waitForNavigation(),
            page.goto(href),
        ]);
        await saveAllResults(page, pageNumber + 1);
    }
};

module.exports = saveAllResults;
