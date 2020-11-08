const eleccions = require('./eleccions')
const municipis = require('./municipis')

async function init () {
  const { db } = this

  return Promise.all([
    eleccions(db),
    municipis(db)
  ])
    .then(([eleccions, municipis]) => ({ eleccions, municipis }))
}

module.exports = init
