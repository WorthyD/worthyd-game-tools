const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

import { ItemConfig, ItemOutput, ScraperConfig } from './configs/config.model';

export const downloadImage = async (url, filepath) => {
  try {
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading the image:', error);
  }
};

export const scrapeItems = async (configs: ScraperConfig, saveImages = true): Promise<ItemOutput[]> => {
  const items: ItemOutput[] = [];
  for (const itemConfig of configs.items) {
    const item = await scrapeItem(itemConfig, configs, saveImages);

    if (item !== null) {
      items.push(item);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return items;
};

export const scrapeItem = async (
  config: ItemConfig,
  baseConfig: ScraperConfig,
  saveImages = true
): Promise<ItemOutput | null> => {
  try {
    console.log(`--------------------------------`);
    console.log(`Scraping item: ${config.itemId}`);
    const response = await axios.get(`${baseConfig.baseUrl}${config.itemUrl}`);

    const $ = cheerio.load(response.data);

    const itemBox = $('#infoboxtable');

    const itemName = itemBox.find('tr:eq(0) td').text().trim();
    const itemDescription = itemBox.find('tr:eq(2) td').text().trim();
    const itemImageUrl = itemBox.find('tr:eq(1) td').find('.image img').attr('src');
    const ingredientElements = itemBox.find('td:contains("Ingredients")').parents('tr').find('td:eq(1) span');

    const ingredients: { id: string; quantity: number }[] = [];
    ingredientElements.map((_, element) => {
      const ingredientName = $(element).find('a').attr('href').split('/').pop()?.toLowerCase();
      const ingredientQuantityText = $(element).text().trim();
      const quantityMatch = ingredientQuantityText.match(/\((\d+)\)/);

      ingredients.push({
        id: ingredientName,
        quantity: parseInt(quantityMatch[1])
      });
    });

    // TODO: Setup proper item id
    console.log(`Item Name: ${itemName}`);
    console.log(`Description: ${itemDescription}`);
    console.log(`Image URL: ${itemImageUrl}`);
    console.log(`Ingredients: ${JSON.stringify(ingredients)}`);

    if (saveImages) {
      console.log(`Downloading Image: ${itemImageUrl}`);
      await downloadImage(`${baseConfig.baseUrl}${itemImageUrl}`, `${baseConfig.imagePath}${config.itemId}.png`);
    }

    console.log(`--------------------------------`);
    return {
      id: config.itemId,
      name: itemName,
      description: itemDescription,
      imageUrl: `${baseConfig.assetPath}${config.itemId}.png`,
      links: [ ...(config.extraLinks || []), { text: 'Wiki Link', url: `${baseConfig.baseUrl}${config.itemUrl}` }],
      categories: config.categories,
      tags: config.tags,
      ingredients: ingredients
    };
  } catch (error) {
    console.error(`Error fetching ${config.itemUrl}:`, error);
  }
  return null;
};

export const saveItems = (items: ItemOutput[], baseConfig: ScraperConfig) => {
  fs.writeFileSync(baseConfig.configOutputPath, `export const items = ${JSON.stringify(items, null, 2)};`);
};
