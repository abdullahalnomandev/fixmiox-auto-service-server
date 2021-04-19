const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectID;
const port = 5000 || process.env.PORT;
const cors = require('cors')

app.use(cors())
app.use(express.json())
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { application } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ez7qy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log(err);
  const bookingCollection = client.db("autoService").collection("bookingData");
  const reviewCollection = client.db("autoService").collection("reviewData");
  const serviceCollection = client.db("autoService").collection("services");
  const adminCollection = client.db("autoService").collection("admin");


  //Book List
  app.post('/addBookingList', (req, res) => {
    const bookingData = req.body;
    bookingCollection.insertOne(bookingData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/getBookingList', (req, res) => {
    bookingCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/getAllBookList', (req, res) => {
    bookingCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  // Review
  app.post('/addReview', (req, res) => {

    const review = req.body;
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/getReview', (req, res) => {
    reviewCollection.find({})

      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //Add Service

  app.post('/addService', (req, res) => {
    const addService = req.body;
    serviceCollection.insertOne(addService)

      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.get('/getAllServices', (req, res) => {
    serviceCollection.find({})
      .toArray((err, service) => {
        res.send(service)
      })
  })


  app.post('/makeAdmin', (req, res) => {

    const makeAdmin = req.body;
    adminCollection.insertOne(makeAdmin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.post('/adminList', (req, res) => {

    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, document) => {
        res.send(document.length > 0)
      })


  })


  app.delete('/delete/:id', (req, res) => {

    const deleted = req.params.id;
    serviceCollection.deleteOne({ _id: ObjectId(deleted) })

      .then((err, result => {

        res.send(result.deletedCount > 0)
      }))

  })


});


app.listen(port, () => {
  console.log(` app listening at port :${port}`)
})