import { Router } from 'express'
import { isLoggedIn } from '../middleware/middleware.js'
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

router.get('/', profilesCtrl.index)
router.get('/search', profilesCtrl.search)
router.get('/:profileId', profilesCtrl.show)
router.get('/:profileId/createdTools', isLoggedIn, profilesCtrl.createdToolsIndex)
router.get('/:profileId/createdToolTypes', isLoggedIn, profilesCtrl.createdToolsTypesIndex)
router.get('/:profileId/toolReviews', isLoggedIn, profilesCtrl.toolReviewsIndex)
router.post('/:profileId/favoriteTools/:toolId', isLoggedIn, profilesCtrl.addFavoriteTool)
router.delete('/:profileId/favoriteTools/:toolId', isLoggedIn, profilesCtrl.removeFavoriteTool)

export {
  router
}