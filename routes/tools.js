import { Router } from 'express'
import * as toolsCtrl from '../controllers/tools.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/', toolsCtrl.index)
router.get('/new', isLoggedIn, toolsCtrl.new)
router.post('/', isLoggedIn, toolsCtrl.create)


export {
  router
}
