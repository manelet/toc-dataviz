const dades = require('./dades')
const geo = require('./geo')
const init = require('./init')

const createQueries = ({ db, cache }) => {
  this.db = db
  this.cache = cache

  return {
    dades: dades.bind(this),
    geo: geo.bind(this),
    init: init.bind(this)
  }
}

module.exports = createQueries
