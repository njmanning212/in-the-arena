import { ToolType } from "../models/toolType.js";

function newToolType (req, res) {
  res.render('toolTypes/new', {
    title: 'Add Tool Type',
    error: false,
  })
}


export {
  newToolType as new,
}