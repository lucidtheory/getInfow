const fs = require('fs');

const saveAllResults = async (page, pageNumber) => {
    // Grab all pieces of data per cell on this page of results
    console.log(`working on search page ${pageNumber}...`);

    // Grab all keywords separately
    const keywords = await page.$$eval('.keywords', keys => keys.map(key => key.innerText));

    // Get all info from table as a matrix
    const matrix = await page.evaluate(() => {
        const rows = document.querySelectorAll('#resultsTable > tbody > tr');
        return Array.from(rows, (row) => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns, column => column.innerText.replace(/,/g, ''));
        });
    });

    // Append data to csv
    for (let i = 0; i < keywords.length; i++) {
        console.log(`${keywords[i]},${matrix[i][2]},${matrix[i][6]}`);
        fs.appendFileSync(
            'src/results/bookResults.txt',
            `${keywords[i]},${matrix[i][2]},${matrix[i][6]}\n`,
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
