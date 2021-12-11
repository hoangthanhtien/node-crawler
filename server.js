const express = require('express')
const app = express()
const cors = require('cors')

// Connect to database

const mongoose = require('mongoose');
// const mongodbUrl = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongodb:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DATABASE}`
const mongodbUrl = `mongodb://mongodb:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DATABASE}`
console.log("mongodbUrl", mongodbUrl)
try {
  mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (error) {
  console.log(error)
}
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to the database");
});

// Setup queue
var queue = require('queue')
var Queue = queue({ results: [] })
Queue.start()

app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

verySlowFunction = (message) => {
  setTimeout(() => {
    console.log(message)
  }, 5000)
}

app.get('/test_queue', (req, res) => {
  const message = req.query.message
  const loopTimes = req.query.loopTimes
  for (let i = 0; i <= +loopTimes; i++) {
    Queue.push(verySlowFunction(message + i.toString()))
  }

  res.send("Done queue")
})

const port = process.env.PORT || 3060
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// Application level middlewares
const validateMiddleware = require('./app/middlewares/validate')

app.use(validateMiddleware.validateAccessToken)

// Setup Routes
const crawlCoinDeskRoute = require("./app/routers/crawl_news/coin_desk")
app.use('/crawl_coin_desk', crawlCoinDeskRoute)
