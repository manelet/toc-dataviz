const { compose } = require('../../lib/utils')
const createTransformFunction = require('./levels')
const { createAggregate, calcularPercentatges } = require('./utils')

async function dades ({ municipi = '080155', level = 'seccions', eleccio = 'municipals' }) {
  const { db } = this
  const transform = compose(calcularPercentatges, createTransformFunction(level))
  const dades = db.collection('thinkoclock')
  const aggregate = createAggregate(level, municipi, eleccio)
  const [districtes, anys, eleccionsAgg] = await Promise.all([
    dades.distinct('districte'),
    dades.distinct('any'),
    dades.aggregate([{ '$group': { '_id': { any: '$any', eleccio: '$eleccio' } } }])
  ])

  return new Promise((resolve, reject) => {
    dades
      .aggregate(aggregate)
      .toArray((err, results) => {
        if (err) {
          return reject(err)
        }

        const data = transform(results)

        eleccionsAgg.toArray((err, eleccions) => {
          if (err) {
            return reject(err)
          }

          const partits = eleccions.reduce((acc, e) => {
            const row = data.find(d => d._id.any === e._id.any)
            if (row) {
              if (!acc[e._id.eleccio]) {
                acc[e._id.eleccio] = { [e._id.any]: row.partits.map(partit => partit.sigles).sort() }
              } else {
                acc[e._id.eleccio][e._id.any] = row.partits.map(partit => partit.sigles).sort()
              }
            }
            // acc[any] = data.find(d => d._id.any === any).partits.map(partit => partit.sigles).sort()
            return acc
          }, {})

          const payload = { partits, anys, districtes, data }

          return resolve(payload)
        })
      })
  })
}

module.exports = dades
