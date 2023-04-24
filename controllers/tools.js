import { Profile } from "../models/profile.js";
import { Tool } from "../models/tool.js";
import { ToolType } from "../models/toolType.js";
import { Review } from "../models/review.js";

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
    let checkArr = [req.body.name, req.body.instructions, req.body.imgSrc, req.body.imgOwner, req.body.imgOwnerLink]
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

function show (req, res) {
  Tool.findById(req.params.toolId)
  .populate('author')
  .populate('type')
  .then (tool => {
    res.render('tools/show', {
      title: 'Tool Details',
      tool,
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect('/tools')
  })
}

function edit (req, res) {
  ToolType.find({})
  .then (toolTypes => {
    Tool.findById(req.params.toolId)
    .populate('type')
    .then (tool => {
      res.render('tools/edit', {
        title: 'Edit Tool',
        tool,
        blankError: false,
        duplicateError: false,
        toolTypes
      })
    })
    .catch (err => {
      console.log(err)
      res.redirect('/tools')
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect(`/tools/${tool._id}`)
  })
}

function update (req, res) {
  req.body.name = req.body.name.toUpperCase()
  let checkArr = [req.body.name, req.body.instructions, req.body.imgSrc, req.body.imgOwner, req.body.imgOwnerLink]
  ToolType.find({})
  .then (toolTypes => {
    Tool.findOne({name: req.body.name})
    .then (duplicateTool => {
      if (duplicateTool && !duplicateTool._id.equals(req.params.toolId)) {
        Tool.findById(req.params.toolId)
        .populate('type')
        .then (tool => {
          res.render('tools/edit', {
            title: 'Edit Tool',
            tool,
            blankError: false,
            duplicateError: true,
            toolTypes
          })
        })
        .catch (err => {
          console.log(err)
          res.redirect('/tools')
        })
      } else {
        Tool.findById(req.params.toolId)
        .then (tool => {
          if (checkArr.includes('')) {
            res.render('tools/edit', {
              title: 'Edit Tool',
              tool,
              blankError: true,
              duplicateError: false,
              toolTypes
            })
          } else if (tool.author.equals(req.user.profile._id)){
            tool.updateOne(req.body)
            .then (() => {
              res.redirect(`/tools/${tool._id}`)
            })
            .catch (err => {
              console.log(err)
              res.redirect(`/tools/${tool._id}`)
            })
          }
        })
        .catch (err => {
          console.log(err)
          res.redirect('/tools')
        })
      }
    })
    .catch (err => {
      console.log(err)
      res.redirect('/tools')
    })
  })
}

function deleteTool (req, res) {
  Tool.findById(req.params.toolId)
  .then (tool => {
    if (tool.author.equals(req.user.profile._id)) {
      tool.deleteOne()
      .then (() => {
        Profile.findById(req.user.profile._id)
        .then (profile => {
          profile.createdTools.remove(tool._id)
          profile.save()
          .then (() => {
            res.redirect('/tools')
          })
          .catch (err => {
            console.log(err)
            res.redirect(`/tools/${tool._id}`)
          })
        })
        .catch (err => {
          console.log(err)
          res.redirect(`/tools/${tool._id}`)
        })
      })
      .catch (err => {
        console.log(err)
        res.redirect(`/tools/${tool._id}`)
      })
    }
  })
  .catch (err => {
    console.log(err)
    res.redirect('/tools')
  })
}

function reviewsIndex (req, res) {
  Tool.findById(req.params.toolId)
  .then (tool => {
    res.render('reviews/index', {
      title: 'Reviews',
      tool,
    })
  })
}

export {
  index,
  newTool as new,
  create,
  show,
  edit,
  update,
  deleteTool as delete,
  reviewsIndex,
}