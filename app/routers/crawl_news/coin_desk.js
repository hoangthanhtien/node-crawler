const express = require('express') 
const router = express.Router()
const coinDeskController = require('../../controllers/crawl_news/coin_desk')

router.get("/", coinDeskController.getCoinDeskNews)

module.exports = router 
