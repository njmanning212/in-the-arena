import { Profile } from "../models/profile.js";
import { Tool } from "../models/Tool.js";
import { ToolType } from "../models/toolType.js";

function index (req, res) {
  Tool.find({})
  .then (tools => {
    res.render('tools/index', {
      title: 'Tools',
      tools,
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect('/')
  })
}

function newTool (req, res) {
  ToolType.find({})
  .then (toolTypes => {
    res.render('tools/new', {
      title: 'Add Tool',
      toolTypes,
      blankError: false, 
      duplicateError: false,
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect('/tools')
  })
}

export {
  index,
  newTool as new,
}