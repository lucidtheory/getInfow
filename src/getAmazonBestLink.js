const SerpApi = require('google-search-results-nodejs');
const fs = require('fs');
const love = require('./lists/printful-categories.json');
const missedNodes = require('./lists/missedNodes');
// const timer = ms => new Promise(res => setTimeout(res, ms));

const search = new SerpApi.GoogleSearch('ceb8e373e9e029ded69bc145dfc9144b36c5ac9a2ccb40e3347c88e70bb51cf0');

const getBestSellerLinks = async (index, categories) => {
    if (index === categories.length) {
        console.log('complete!');
        process.exit(0);
        return;
    }
    const category = categories[index];
    search.json({ q: `amazon best sellers ${category.category}` }, (res) => {
        const match = res.organic_results.find(
            result => result.link.includes('/zgbs/')
              && (result.title.toLowerCase().includes(category.product.toLowerCase()
              || result.snippet.toLowerCase().includes(category.product.toLowerCase()))
              ),
        );
        if (match) {
            console.log(`found it! ${match.link}`);
            fs.appendFileSync('src/results/lostAndFoundLinks.txt', `${match.link}\n`);
        } else {
            console.log(`no match for ${category.product} appending it's browse node to src/results/stillMissedNodes.txt`);
            fs.appendFileSync('src/results/stillMissedNodes.txt', `${category.browseNode}\n`);
        }

        getBestSellerLinks(index + 1, categories);
    });
};

const findMissedLinks = () => {
    missedNodes.forEach(node => console.log(love.find(c => c.browseNode == node).product));

    // getBestSellerLinks(0, missedList);
};

// getBestSellerLinks(0);

findMissedLinks();
