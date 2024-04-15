const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 8080;
//const PORT = 8080;
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV||'development']);


app.use(cors())
app.use(morgan(':method :url status::status :response-time ms'))
app.use(express.json());


morgan.token('id', (req) => { //creating id token
  return req.id
})



app.get('/', (req, res) => {
  res.send('App up and running')
})

app.get('/movies', (req, res) => {
  knex('movies')
    .select('*')
    .then((moviesdata) => {
      res.status(200).send(moviesdata)
    })
    .catch((err) => {
      res.status(404).send({
        message: 'No movies were found'
      });
    });
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params

  knex('movies')
    .select('*')
    .whereILike(`title`, `%${title}%`)
    .then((moviesData) => {
      res.status(200).send(moviesData)
    })
})


app.post('/movies', (req, res) => {
  const movie = {
    "title" : req.body.title,
  }
  knex('movies')
    .insert(movie)
    .then(() => {
      res.status(201).send({
        message: 'Movie was successfully added'
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Something went wrong. Movie not added.'
      })
    })
});

app.delete('/movies', (req, res) => {
  const movieName = req.body.title
  knex('movies')
    .where('title', movieName)
    .del()
    .then(() => {
      res.status(202).send({
        message: 'Your movies was deleted successfully.'
      })
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Something went wrong. Your movie was not deleted'
      });
    })
})


app.listen(PORT, () => {
  console.log(`Knex and Express apps are currently running on port ${PORT}`)
})