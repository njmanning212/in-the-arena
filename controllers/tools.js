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

function reviewsIndex(req, res) {
  Tool.findById(req.params.toolId)
  .populate('reviews')
  .populate({
    path: 'reviews',
    populate: {
      path: 'author',
      model: 'Profile'
    }
  })
  .then((tool) => {
    res.render('reviews/index', {
      title: 'Reviews',
      tool,
    })
  })
  .catch((err) => {
    console.log(err)
    res.redirect('/tools')
  })
}


function newReview (req, res) {
  Tool.findById(req.params.toolId)
  .then (tool => {
    res.render('reviews/new', {
      title: 'Add Review',
      tool,
      blankError: false,
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect('/tools')
  })
}

function createReview (req, res) {
  req.body.author = req.user.profile._id
  req.body.tool = req.params.toolId
  Tool.findById(req.params.toolId)
  .then (tool => {
    if (req.body.content === '') {
      res.render('reviews/new', {
        title: 'Add Review',
        tool,
        blankError: true,
      })
    } else {
      Review.create(req.body)
      .then (review => {
        tool.reviews.push(review._id)
        tool.save()
        .then (tool => {
          Profile.findById(req.user.profile._id)
          .then (profile => {
            profile.reviews.push(review._id)
            profile.save()
            .then (() => {
              Review.find({tool: tool._id})
              .then (reviews => {
                let sum = 0
                reviews.forEach(review => {
                  sum += review.rating
                })
                let avg = sum / reviews.length
                tool.averageRating = Math.floor(avg)
                tool.save()
                .then (() => {
                  res.redirect(`/tools/${tool._id}/reviews`)
                })
                .catch (err => {
                  console.log(err)
                  res.redirect(`/tools/${tool._id}/reviews/new`)
                })
              })
            })
            .catch (err => {
              console.log(err)
              res.redirect(`/tools/${tool._id}/reviews/new`)
            })
          })
          .catch (err => {
            console.log(err)
            res.redirect(`/tools/${tool._id}/reviews/new`)
          })
        })
        .catch (err => {
          console.log(err)
          res.redirect(`/tools/${tool._id}/reviews/new`)
        })
      })
      .catch (err => {
        console.log(err)
        res.redirect(`/tools/${tool._id}/reviews/new`)
      })
    }
  })
  .catch (err => {
    console.log(err)
    res.redirect(`/tools/${tool._id}/reviews/new`)
  })
}

function editReview (req, res) {
  Tool.findById(req.params.toolId)
  .then (tool => {
    Review.findById(req.params.reviewId)
    .populate('author')
    .then (review => {
      if (review.author.equals(req.user.profile._id)) {
        res.render('reviews/edit', {
          title: 'Edit Review',
          review,
          tool,
          blankError: false,
        })
      }
    })
    .catch (err => {
      console.log(err)
      res.redirect(`/tools/${tool._id}/reviews`)
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect(`/tools/${tool._id}/reviews`)
  })
}

function updateReview (req, res) {
  Tool.findById(req.params.toolId)
  .then (tool => {
    Review.findById(req.params.reviewId)
    .then (review => {
      if (req.body.content === '') {
        res.render('reviews/edit', {
          title: 'Edit Review',
          review,
          tool,
          blankError: true,
        })
      } else if (review.author.equals(req.user.profile._id)) {
        review.updateOne(req.body)
        .then (() => {
          Review.find({tool: tool._id})
          .then (reviews => {
            let sum = 0
            reviews.forEach(review => {
              sum += review.rating
            })
            let avg = sum / reviews.length
            tool.averageRating = Math.floor(avg)
            tool.save()
            .then (() => {
              res.redirect(`/tools/${tool._id}/reviews`)
            })
            .catch (err => {
              console.log(err)
              res.redirect(`/tools/${tool._id}/reviews`)
            })
          })
        })
        .catch (err => {
          console.log(err)
          res.redirect(`/tools/${tool._id}/reviews`)
        })
      }
    })
    .catch (err => {
      console.log(err)
      res.redirect(`/tools/${tool._id}/reviews`)
    })
  })
  .catch (err => {
    console.log(err)
    res.redirect(`/tools/${tool._id}/reviews`)
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
  newReview,
  createReview,
  editReview,
  updateReview,
}