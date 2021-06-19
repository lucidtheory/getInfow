const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const bestAsins = require('./lists/bestAsins');
const saveAllResults = require('./saveAllWordResults');

puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: 'a9ff25bbd91b50a49ce85a659ee53a08',
        },
        visualFeedback: true,
    }),
);
puppeteer.use(AdblockerPlugin({
    blockTrackers: true,
}));


puppeteer.launch({ headless: false }).then(async (browser) => {
    // Handle Logging In
    console.log('initializing...');
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(500000);
    await page.goto('https://www.merchantwords.com/login');

    await page.type('input[name="email"]', 'es.etrenne@gmail.com');
    await page.type('input[name="password"]', 'jj4AyY$d9XcK9St');

    await page.solveRecaptchas();

    await Promise.all([
        page.waitForNavigation(),
        page.click('#submitButton'),
    ]);

    // Get All the Necessary Info Per Asin
    const searches = [
        'https://www.merchantwords.com/search/us/bible/sort-highest/in-books/vol-5000-1000000/',
        'https://www.merchantwords.com/search/us/jesus/sort-highest/in-books/vol-5000-1000000/',
        'https://www.merchantwords.com/search/us/christian/sort-highest/in-books/vol-5000-1000000/',
        'https://www.merchantwords.com/search/us/religious/sort-highest/in-books/vol-5000-1000000/',
        'https://www.merchantwords.com/search/us/faith/sort-highest/in-books/vol-5000-1000000/',
        'https://www.merchantwords.com/search/us/god/sort-highest/in-books/vol-5000-1000000/',
        'https://www.merchantwords.com/search/us/spiritual/sort-highest/in-books/vol-5000-1000000/',
    ];
    for (let i = 0; i < searches.length; i++) {
        console.log(`working on search ${i + 1} of ${searches.length}...`);
        try {
            await page.goto(searches[i]);
        } catch (error) {
            console.log(`error navigating for asin ${i} retrying...`);
            await page.goto(searches[i]);
        }

        await saveAllResults(page, 1);
    }

    await browser.close();
});

// '1250178606', '1878424319', '0062976583', '1641526270', '059331817X'

// const getMedianBSR = () => {
//     const vals = [];
//     const bookResults = [...document.querySelectorAll('.xtaqv-result')]
//         .filter(e => e.innerHTML.includes('in Books'));
//
//     bookResults.forEach((e) => {
//         const rank = [...e.children].find(c => c.className === 'extension-rank').innerText.replace(/[#,]/g, '');
//         vals.push(Number(rank));
//     });
//
//     const mid = Math.floor(vals.length / 2);
//     const median = vals.length % 2 !== 0 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
//     return median;
// };
