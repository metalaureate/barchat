/**
 * BarsController
 *
 * @description :: Server-side logic for managing bars
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var winston=require('winston');

module.exports = {
  hello: function (req, res) {
    winston.info(req.query);
    return res.send("Hi there!");
  }
};

