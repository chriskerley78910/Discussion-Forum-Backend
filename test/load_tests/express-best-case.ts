const express = require('express')
const app = express()
const port = 3000


// System Specs Core i5 5th gen 2C/4T @ 2.3ghz

/**
 * Autocannon load test results:
 * 
 * autocannon http://localhost:3000/ -d 10 -c 30 -m GET
 * avg 7355 req / sec @ 11ms p99
 *
 * Artillary load test results:
 * max 1023 requests / sec @ 376ms p99
 *
 */
app.get('/', (req, res) => {
  res.end('')
})


/**
 * Autocannon load test results:
 * 
 * autocannon http://localhost:3000/ -d 10 -c 30 -m POST
 * avg 4716 req / sec @ 11ms p99
 * 
 * Artillary load test results:
 * max 798 req / sec @ 889ms p99
 */
app.post('/', (req, res) => {
  res.end('')
})


/**
 * Autocannon load test results:
 * 
 * autocannon http://localhost:3000/load -d 10 -c 30 -m GET
 * avg 1553 req / sec @ 37ms p99
 *
 * Artillary load test results:
 * Failed many requests @ 4583ms p99
 *
 */
app.get('/load', (req, res) => {
  const rounds = 100
  let val = 0
  for(let i = 0; i < rounds; i++)
    for(let j = 0; j < rounds; j++)
      for(let k = 0; k < rounds; k++)
        val = 1

  res.end('')
})




app.listen(port, () => {
  console.log(`Express best case test. ${port}`)
})