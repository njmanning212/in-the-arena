import { Profile } from "../models/profile.js";
import { Tool } from "../models/Tool.js";
import { ToolType } from "../models/toolType.js";

function index (req, res) {
  Tool.find({})
  .populate('author')
  .populate('type')
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

function create (req, res) {
  ToolType.find({})
  .then (toolTypes => {
    req.body.name = req.body.name.toUpperCase()
    let checkArr = [req.body.name, req.body.instructions, req.body.imgSrc, req.body.imgAttribution]
    if (checkArr.includes('')) {
      res.render('tools/new', {
        title: 'Add Tool',
        toolTypes,
        blankError: true,
        duplicateError: false,
      })
    } else {
      Tool.findOne({name: req.body.name})
      .then (duplicateTool => {
        if (duplicateTool) {
          res.render('tools/new', {
            title: 'Add Tool',
            blankError: false,
            duplicateError: true,
            toolTypes,
          })
        } else {
          if (req.user.profile._id) {     
            req.body.author = req.user.profile._id
            Tool.create(req.body)
            .then (tool => {
              Profile.findById(req.user.profile._id)
              .then (profile => {
                profile.createdTools.push(tool._id)
                profile.save()
                .then (() => {
                  res.redirect('/tools')
                })
                .catch(err => {
                  console.log(err)
                  res.redirect('/tools/new')
                })
              })
              .catch(err => {
                console.log(err)
                res.redirect('/tools/new')
              })
            })
            .catch (err => {
              console.log(err)
              res.redirect('/tools/new')
            })
          }
        }
      })
      .catch(err => {
        console.log(err)
        res.redirect('/tools/new')
      })
    }
  })
}

export {
  index,
  newTool as new,
  create,
}