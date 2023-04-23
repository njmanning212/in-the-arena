import { ToolType } from "../models/toolType.js";
import { Profile } from "../models/profile.js";

function newToolType (req, res) {
  res.render('toolTypes/new', {
    title: 'Add Tool Type',
    blankError: false,
    duplicateError: false,
  })
}

function create (req, res) {
  req.body.name = req.body.name.toUpperCase()
  let checkArr = [req.body.name, req.body.description]
  if (checkArr.includes('')) {
    res.render('toolTypes/new', {
      title: 'Add Tool Type',
      blankError: true,
      duplicateError: false,
    })
  } else {
    ToolType.findOne({name: req.body.name})
    .then (duplicateToolType => {
      if (duplicateToolType) {
        res.render('toolTypes/new', {
          title: 'Add Tool Type',
          blankError: false,
          duplicateError: true,
        })
      } else {
        if (req.user.profile._id) {     
          req.body.author = req.user.profile._id
          ToolType.create(req.body)
          .then (toolType => {
            Profile.findById(req.user.profile._id)
            .then (profile => {
              profile.createdToolTypes.push(toolType._id)
              profile.save()
              .then (() => {
                res.redirect('/toolTypes')
              })
              .catch(err => {
                console.log(err)
                res.redirect('/toolTypes/new')
              })
            })
            .catch(err => {
              console.log(err)
              res.redirect('/toolTypes/new')
            })
          })
          .catch (err => {
            console.log(err)
            res.redirect('/toolTypes/new')
          })
        } 
      }
    })
  }
}

function index (req, res) {
  ToolType.find({})
  .then (toolTypes => {
    res.render('toolTypes/index', {
      title: 'Tool Types',
      toolTypes,
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect('/')
  })
}

function show (req, res) {
  ToolType.findById(req.params.toolTypeId)
  .populate('author')
  .then (toolType => {
    res.render('toolTypes/show', {
      title: toolType.name,
      toolType,
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect('/toolTypes')
  })
}

function edit (req, res) {
  ToolType.findById(req.params.toolTypeId)
  .then (toolType => {
    res.render('toolTypes/edit', {
      title: `Edit ${toolType.name}`,
      toolType,
      blankError: false,
      duplicateError: false,
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect('/toolTypes')
  })
}

function update (req, res) {
  req.body.name = req.body.name.toUpperCase()
  let checkArr = [req.body.name, req.body.description]
  ToolType.findOne({name: req.body.name})
  .then (duplicateToolType => {
    if (duplicateToolType && !duplicateToolType._id.equals(req.params.toolTypeId)) {
      ToolType.findById(req.params.toolTypeId)
      .then (toolType => {
        res.render('toolTypes/edit', {
          title: `Edit ${toolType.name}`,
          toolType,
          blankError: false,
          duplicateError: true,
        })
      })
      .catch (err => {
        console.log(err)
        res.redirect('/toolTypes')
      })
    } else {
      ToolType.findById(req.params.toolTypeId)
      .then (toolType => {
        if (checkArr.includes('')) {
          res.render('toolTypes/edit', {
            title: `Edit ${toolType.name}`,
            toolType,
            blankError: true,
            duplicateError: false,
          })
        } else if (toolType.author.equals(req.user.profile._id)) {
          toolType.updateOne(req.body)
          .then (() => {
            res.redirect(`/toolTypes/${toolType._id}`)
          })
          .catch (err => {
            console.log(err)
            res.redirect(`/toolTypes/${toolType._id}/edit`)
          })
        }
      })
      .catch (err => {
        console.log(err)
        res.redirect('/toolTypes')
      })
    }
  })
}

function deleteToolType (req, res) {
  ToolType.findById(req.params.toolTypeId)
  .then (toolType => {
    if(toolType.author.equals(req.user.profile._id)) {
      Profile.findById(req.user.profile._id)
      .then (profile => {
        profile.createdToolTypes.remove(toolType._id)
        profile.save()
        .then (() => {
          toolType.deleteOne()
          .then (() => {
            res.redirect('/toolTypes')
          })
          .catch (err => {
            console.log(err)
            res.redirect(`/toolTypes/${toolType._id}`)
          })
        })
        .catch (err => {
        console.log(err)
        res.redirect(`/toolTypes/${toolType._id}`)
        })
      })
      .catch (err => {
        console.log(err)
        res.redirect(`/toolTypes/${toolType._id}`)
      })
    }
  })
}

export {
  newToolType as new,
  create,
  index,
  show,
  edit,
  update,
  deleteToolType as delete,
}