import { Router } from 'express'
import * as toolsCtrl from '../controllers/tools.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/', toolsCtrl.index)


export {
  router
}
