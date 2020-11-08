const createClient = require('redis').createClient

const { VERSION, REDIS_HOST, REDIS_PORT } = process.env

const defaultOpts = {
  version: VERSION,
  host: REDIS_HOST,
  port: Number(REDIS_PORT)
}

const createCache = (opts = {}) => {
  const version = opts.version || defaultOpts.version
  delete opts.version
  delete defaultOpts.version
  const cache = createClient({ ...defaultOpts, ...opts })

  cache.on('error', err => {
    console.error(err)
    throw err
  })

  const set = (key, value, ttl = undefined) =>
    cache.set(`${key}/${version}`, typeof value === 'object' ? JSON.stringify(value) : value, ttl)

  const get = key => {
    return new Promise((resolve, reject) =>
      cache.get(`${key}/${version}`, (err, res) => {
        if (err) return reject(err)
        return resolve(JSON.parse(res))
      })
    )
  }

  const flush = () =>
    new Promise(resolve =>
      cache.flushall('ASYNC', () => resolve())
    )

  const getKey = key => `${key}/${version}`

  return { set, get, flush, getKey }
}

module.exports = createCache
