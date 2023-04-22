import { Router } from 'express'
import * as toolTypesCtrl from '../controllers/toolTypes.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/', toolTypesCtrl.index)
router.get('/new', isLoggedIn, toolTypesCtrl.new)
router.get('/:toolTypeId', toolTypesCtrl.show)
router.get('/:toolTypeId/edit', isLoggedIn, toolTypesCtrl.edit)
router.post('/', isLoggedIn, toolTypesCtrl.create)
router.put('/:toolTypeId', isLoggedIn, toolTypesCtrl.update)

export {
  router
}
