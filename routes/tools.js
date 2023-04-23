import { Router } from 'express'
import * as toolsCtrl from '../controllers/tools.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/', toolsCtrl.index)
router.get('/new', isLoggedIn, toolsCtrl.new)
router.get('/:toolId', toolsCtrl.show)
router.get('/:toolId/edit', isLoggedIn, toolsCtrl.edit)
router.post('/', isLoggedIn, toolsCtrl.create)
router.put('/:toolId', isLoggedIn, toolsCtrl.update)
router.delete('/:toolId', isLoggedIn, toolsCtrl.delete)


export {
  router
}
