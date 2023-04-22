import { Router } from 'express'
import * as toolTypesCtrl from '../controllers/toolTypes.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/', toolTypesCtrl.index)
router.get('/new', isLoggedIn, toolTypesCtrl.new)
router.get('/:toolTypeId', toolTypesCtrl.show)
router.post('/', isLoggedIn, toolTypesCtrl.create)

export {
  router
}
