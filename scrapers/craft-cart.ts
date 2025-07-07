/* eslint-disable @typescript-eslint/no-explicit-any */

const config = require('./configs/craft-cart').config;
const scraper = require('./scraper');

(async () => {
  const items = await scraper.scrapeItems(config);
  scraper.saveItems(items, config);
  console.log('Scraped Item Count:', items.length);
})();
