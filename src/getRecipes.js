const fetch = require('node-fetch');
const fs = require('fs');

const APP_ID = 'd76d82c2';
/* eslint-disable-next-line no-tabs */
const API_KEY = '249ebd73553dd763c89f79dc2e30a48e';
const BASE_URL = `https://api.edamam.com/search?app_id=${APP_ID}&app_key=${API_KEY}`;
const healthParams = [
    // 'immuno-supportive',
    'alcohol-free',
    'dairy-free',
    'egg-free',
    'gluten-free',
    'lupine-free',
    'low-sugar',
    // 'paleo',
    'peanut-free',
    'sesame-free',
    'soy-free',
    'tree-nut-free',
    'wheat-free',
    // 'pescatarian',
    // 'vegan',
    // 'vegetarian',
    // 'sugar-conscious',
];
const health = `health=${healthParams.join('&health=')}`;
// const mealType = 'mealType='; // lunch,dinner,breakfast,snack,teatime
// const dishType = 'dishType='; // drinks etc.
// const excluded = '' // list of foods to keep out
const to = 'to=100';
const querys = [
    // 'chicken', 'salmon', 'beef', 'liver', 'vegetarian', 'vegan', 'paleo', 'aip', 'poultry', 'shellfish',
    // 'avocado', 'fruit', 'meat', 'bacon', 'pork', 'duck', 'turkey', 'lamb', 'sausage', 'salami',
    // 'goat', 'prosciutto', 'ham', 'tuna', 'trout', 'halibut', 'mackerel', 'cod', 'sardine', 'herring',
    // 'carrot', 'beets', 'spinach', 'cabbage', 'sweet potato', 'broccoli', 'garlic', 'mushroom', 'kale', 'cucumber',
    // 'onion', 'squash', 'lettuce', 'chard', 'cauliflower', 'artichoke', 'asparagus', 'brussels', 'fennel', 'jicama',
    // 'apple', 'apricot', 'banana', 'strawberry', 'blueberry', 'coconut', 'date', 'grape', 'kiwi', 'pear',
    // 'mango', 'watermelon', 'pineapple', 'peach', 'pomegranate', 'dessert', 'tea', 'juice', 'smoothie', 'lemonade',
    // 'vegetable', 'veggie', 'fodmap', 'salad', 'bread', 'pancake', 'cookies', 'buscuits', 'drink', 'sandwich',
    // 'soup', 'american', 'asian', 'british', 'caribbean', 'chinese', 'french', 'indian', 'italian', 'japanese',
    'kosher', 'mediterranean', 'mexican', 'middle eastern', 'nordic', 'breakfast', 'lunch', 'dinner', 'snack', 'fish',
    // 'chicken', 'kosher'
];


const getRecipes = async () => {
    for (let i = 0; i < querys.length; i++) {
        const query = querys[i];
        const response = await fetch(
            `${BASE_URL}&q=${query}&${health}&${to}`,
        );
        const { hits } = await response.json();
        console.log(hits.length);
        for (let j = 0; j < hits.length; j++) {
            fs.appendFileSync(
                `src/results/recipes/${query}.json`,
                `${hits[j].recipe.label}\n`,
            );
        }
    }
};

getRecipes();
