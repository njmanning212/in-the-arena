import { Router } from 'express'
import * as toolsCtrl from '../controllers/tools.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/', toolsCtrl.index)
router.get('/new', isLoggedIn, toolsCtrl.new)
router.get('/:toolId', toolsCtrl.show)
router.get('/:toolId/edit', isLoggedIn, toolsCtrl.edit)
router.get('/:toolId/reviews', toolsCtrl.reviewsIndex)
router.get('/:toolId/reviews/new', isLoggedIn, toolsCtrl.newReview)
router.get('/:toolId/reviews/:reviewId/edit', isLoggedIn, toolsCtrl.editReview)
router.post('/', isLoggedIn, toolsCtrl.create)
router.post('/:toolId/reviews', isLoggedIn, toolsCtrl.createReview)
router.put('/:toolId', isLoggedIn, toolsCtrl.update)
router.put('/:toolId/reviews/:reviewId', isLoggedIn, toolsCtrl.updateReview)
router.delete('/:toolId', isLoggedIn, toolsCtrl.delete)


export {
  router
}
