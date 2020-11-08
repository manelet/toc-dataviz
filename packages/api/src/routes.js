const express = require('express')

const createQueries = require('./queries')
const { getKey } = require('./lib/utils')
const getDB = require('./lib/mongo')

const { USE_CACHE } = process.env
const noCache = ['export', 'download']

const router = express.Router()

const call = async (req, res, next) => {
  const db = await getDB()
  const method = req.path.slice(1)
  const queries = createQueries({ db, cache: req.cache })
  const caller = queries[method]

  if (caller && typeof caller === 'function') {
    try {
      const result = await caller(req.query)
      req.cache.set(req.key, result)
      return res.status(200).send(result)
    } catch (err) {
      next(err)
    }
  } else {
    return next(new Error(`Method is not a function: ${method}`))
  }
}

router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.use(async (req, res, next) => {
  req.key = getKey(req)

  const cached = await req.cache.get(req.key)

  if (Number(USE_CACHE || 1) && cached && !noCache.includes(req.path.slice(1))) {
    return res.status(200).send(cached)
  }

  return next()
})

router.get('*', call)

router.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send({ status: 'Error', error: err.toString() })
})

module.exports = router
