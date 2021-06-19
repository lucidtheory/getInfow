const puppeteer = require('puppeteer-extra');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const fs = require('fs');
const {
    abbreviationMap,
    // allVerses,
    verseQueries,
} = require('./lists/bibleData');

const objectFlip = obj => Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
}, {});

// Flip abbreviationMap keys & values
const flippedAbbrevs = objectFlip(abbreviationMap);

puppeteer.use(AdblockerPlugin({
    blockTrackers: true,
}));

// Get and save all verse text
puppeteer.launch({ headless: true }).then(async (browser) => {
    console.log('initializing...');
    const page = await browser.newPage();


    // Iterate through all verses links
    for (let i = 0; i < verseQueries.length; i++) {
        console.log(`working on verse ${i + 1} of ${verseQueries.length}...`);
        await page.goto(verseQueries[i]);

        // Get verse text from page
        const verseText = await page.$eval('.verse.ltrDirection', (elem) => {
            const child = document.querySelector('a.verseLink');
            elem.removeChild(child);

            return elem.innerText;
        });

        // Get associated verse
        const verse = verseQueries[i].split('=').pop();

        // Format associated verse
        const verseParts = verse.split('.');
        const book = flippedAbbrevs[verseParts[0]];
        const formattedVerse = `${book} ${verseParts[1]}:${verseParts[2]}`;

        // Append verseText with formattedVerse to results sheet
        fs.appendFileSync('src/results/bibleVerses.txt', `${verseText.replace(/(\r\n|\n|\r)/gm, ' ')} - ${formattedVerse}\n`);
    }

    await browser.close();
});

/*
const buildQueries = () => {
    const BIBLE_PREFIX = 'https://www.stepbible.org/?q=version=NHEB|reference=';
    const queryStrings = [];

    allVerses.forEach((v) => {
        const pieces = v.split(' ');
        let book = pieces[0];
        let verse;

        if (!pieces[1].includes(':')) {
            book += ` ${pieces[1]}`;
            if (!pieces[2].includes(':')) {
                book += ` ${pieces[2]}`;
                verse = pieces[3].replace(':', '.');
            } else {
                verse = pieces[2].replace(':', '.');
            }
        } else {
            verse = pieces[1].replace(':', '.');
        }

        const abbrv = abbreviationMap[book];
        const queryString = `${abbrv}.${verse}`;

        queryStrings.push(queryString);
    });

    queryStrings.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    queryStrings.forEach((q) => {
        fs.appendFileSync('src/results/bibleQueries.txt', `${BIBLE_PREFIX}${q}\n`);
    });
};


buildQueries();
*/
