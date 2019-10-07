var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/', async function(req, res, next) {
    const getCatgoriesQuery = `
    SELECT *
    FROM categories FULL JOIN sub_categories 
    ON categories.id = sub_categories.category_id
    `
    var categories = await db.query(getCatgoriesQuery);
    var categoriesData = {};
    var newStructure = [];
    console.log(categories)
    categories.forEach(category => {
      // console.log(category.name)
      if(categoriesData[category.cat_name] === undefined){
        categoriesData[category.cat_name] = [category.category_id,{name: category.sub_name, sub_id: category.id}]
      }else{
        // console.log(categoriesData[category.categoryparent])
        categoriesData[category.cat_name].push({name: category.sub_name, sub_id: category.id})
      }
    });
    Object.entries(categoriesData).forEach(([category,subCategories])=>{
      let tempObj = {};
      tempObj.name = category     
      tempObj.category_id = subCategories.shift();
      tempObj.sub_categories = subCategories

      newStructure.push(tempObj)
    })
    console.log('newStructure',newStructure)
    res.json(newStructure)
});

module.exports = router;
