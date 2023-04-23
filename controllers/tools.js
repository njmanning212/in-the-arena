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

export {
  index,
}