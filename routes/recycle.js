var express = require('express');
var router = express.Router();
const db = require('../db')

router.get('/', async function(req, res, next) {
    const getCatgoriesQuery = `
    SELECT * FROM subCategories`
    var categories = await db.query(getCatgoriesQuery);
    var categoriesData = {};
    var newStructure = [];

    categories.forEach(category => {
      console.log(category.name)
      if(categoriesData[category.categoryparent] === undefined){
        categoriesData[category.categoryparent] = [category.name]
      }else{
        console.log(categoriesData[category.categoryparent])
        categoriesData[category.categoryparent].push(category.name)
      }
    });
    Object.entries(categoriesData).forEach(([catergory,subCategories])=>{
      let tempObj = {};
      tempObj.name = catergory
      tempObj.subCategories = subCategories
      newStructure.push(tempObj)
    })
    console.log(newStructure)
    res.json({data: newStructure})
});

module.exports = router;
