/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: Rushi Patel_ Student ID: N01539145_ Date: 11/26/2023__
*
*
******************************************************************************
**/ 
const Handlebars = require('handlebars');

Handlebars.registerHelper('space_fn', function(object, propertyName) {
    return object[propertyName];
});

module.exports = Handlebars;