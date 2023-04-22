import { Router } from 'express'
import * as toolTypesCtrl from '../controllers/toolTypes.js'
import { isLoggedIn } from '../middleware/middleware.js'

const router = Router()

router.get('/new', isLoggedIn, toolTypesCtrl.new)

export {
  router
}
