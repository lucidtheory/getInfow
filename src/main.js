const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const bestAsins = require('./bestAsins');
const saveAllResults = require('./saveAllResults');

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

const blockedResources = [
    // Assets
    '*/favicon.ico',
    '.css',
    '.jpg',
    '.jpeg',
    '.png',
    '.svg',
    '.woff',

    // Analytics and other fluff
    '*.optimizely.com',
    'everesttech.net',
    'userzoom.com',
    'doubleclick.net',
    'googleadservices.com',
    'adservice.google.com/*',
    'connect.facebook.com',
    'connect.facebook.net',
    'sp.analytics.yahoo.com',
];


puppeteer.launch({ headless: true }).then(async (browser) => {
    // Handle Logging In
    console.log('initializing...');
    const page = await browser.newPage();
    // eslint-disable-next-line
    await page._client.send('Network.setBlockedURLs', { urls: blockedResources });

    await page.goto('https://www.merchantwords.com/login');

    await page.type('input[name="email"]', 'es.etrenne@gmail.com');
    await page.type('input[name="password"]', 'jj4AyY$d9XcK9St');

    console.log('solving captcha...');
    await page.solveRecaptchas();

    await Promise.all([
        page.waitForNavigation(),
        page.click('#submitButton'),
    ]);

    // Get All the Necessary Info Per Asin
    for (let i = 0; i < bestAsins.length; i++) {
        console.log(`working on asin ${i + 1} of ${bestAsins.length}...`);
        await page.goto(`https://www.merchantwords.com/asin/us/${bestAsins[i]}/vol-1000-1000000/results-0-1000`);

        await saveAllResults(page, 1);
    }

    await browser.close();
});

// '1250178606', '1878424319', '0062976583', '1641526270', '059331817X'
