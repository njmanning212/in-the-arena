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

function show(req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    Tool.find({ author: profile._id })
      .populate('type')
      .then(tools => {
        Review.find({ author: profile._id })
          .populate('tool')
          .then(reviews => {
            ToolType.find({ author: profile._id })
              .then(toolTypes => {
                res.render('profiles/show', {
                  title: `${profile.name}'s Profile`,
                  profile,
                  tools,
                  reviews,
                  toolTypes
                });
              })
              .catch(err => {
                console.error(err);
                res.redirect(`/profiles/${req.params.profileId}`);
              });
          })
          .catch(err => {
            console.error(err);
            res.redirect(`/profiles/${req.params.profileId}`);
          });
      })
      .catch(err => {
        console.error(err);
        res.redirect(`/profiles/${req.params.profileId}`);
      });
  })
  .catch(err => {
    console.error(err);
    res.redirect('/');
  });
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

function createdToolsTypesIndex (req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    ToolType.find({author: profile._id})
    .then(toolTypes => {
      res.render('profiles/createdToolTypes', {
        title: `${profile.name}'s Tool Types`,
        toolTypes,
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

function toolReviewsIndex (req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    Review.find({author: profile._id})
    .populate('tool')
    .then(reviews => {
      res.render('profiles/toolReviews', {
        title: `${profile.name}'s Reviews`,
        reviews,
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

function addFavoriteTool (req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    if (profile.favoriteTools.length < 3) {
      profile.favoriteTools.push(req.params.toolId)
      profile.save()
      .then(() => {
        res.redirect(`/profiles/${profile._id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
    }
    else {
      res.redirect(`/profiles/${profile._id}`)
    }
  })
  .catch(err => {
    console.log(err)
    res.redirect('/')
  })
}

function removeFavoriteTool (req, res) {
  Profile.findById(req.params.profileId)
  .then(profile => {
    if (profile._id.equals(req.user.profile._id)) {
      profile.favoriteTools.remove(req.params.toolId)
      profile.save()
      .then(() => {
        res.redirect(`/profiles/${profile._id}`)
      })
      .catch(err => {
        console.log(err)
        res.redirect('/')
      })
    } else {
      throw new Error('Not Authorized')
    }
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
  toolReviewsIndex,
  addFavoriteTool,
  removeFavoriteTool,
  createdToolsTypesIndex,
}