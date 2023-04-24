import { Profile } from "../models/profile.js";
import { Tool } from "../models/tool.js";
import { ToolType } from "../models/toolType.js";
import { Review } from "../models/review.js";


function index (req, res) {
  Profile.find({})
  .then(profiles => {
      res.render('profiles/index', {
          title: 'Profiles',
          profiles
      })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}


function show (req, res) {
  Profile.findById(req.params.profileId)
  .populate('createdTools')
  .populate('reviews')
  .then(profile => {
    res.render('profiles/show', {
      title: `${profile.name}'s Profile`,
      profile
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function createdToolsIndex (req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    Tool.find({author: profile._id})
    .populate('type')
    .then(tools => {
      res.render('profiles/createdTools', {
        title: `${profile.name}'s Tools`,
        tools,
        profile
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

export {
  index,
  show,
  createdToolsIndex,
}