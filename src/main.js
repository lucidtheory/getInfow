
const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');

puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: 'a9ff25bbd91b50a49ce85a659ee53a08', // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
        },
        visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
    }),
);

// puppeteer usage as normal
puppeteer.launch({ headless: true }).then(async (browser) => {
    const page = await browser.newPage();
    await page.goto('https://www.merchantwords.com/login');
    await page.type('input[name="email"]', 'es.etrenne@gmail.com');
    await page.type('input[name="password"]', 'jj4AyY$d9XcK9St');
    await page.solveRecaptchas();

    await Promise.all([
        page.waitForNavigation(),
        page.click('#submitButton'),
    ]);

    await page.screenshot({ path: 'response.png', fullPage: true });
    await browser.close();
});
