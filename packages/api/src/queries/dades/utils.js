const { percentatge, CSV_TITLES } = require('../../lib/utils')

const calcularPercentatges = data =>
  data.map(c => {
    const { votants, censElectoral, votsValids, votsBlancs, votsCandidatures, votsNuls } = c.totals
    c.totals.percentatgeVotants = percentatge(votants, censElectoral)
    c.totals.percentatgeValids = percentatge(votsValids, votants)
    c.totals.percentatgeCandidatures = percentatge(votsCandidatures, votants)
    c.totals.percentatgeNuls = percentatge(votsNuls, votants)
    c.totals.percentatgeBlancs = percentatge(votsBlancs, votants)

    c.partits = c.partits.map(p => {
      p.percentatgeValids = percentatge(p.vots, c.totals.votsValids)
      p.percentatgeCens = percentatge(p.vots, c.totals.censElectoral)
      return p
    })

    return c
  })

const createAggregate = (level, municipi, eleccio) => {
  const totals = getAggregateTotalFields()
  const aggregate = [
    {
      $group: {
        _id: getIdByLevel(level, eleccio),
        ...totals,
        partits: {
          $push: {
            sigles: '$sigles',
            nom: '$denominacio',
            percentatgeValids: '$percentatgeVotsValids',
            // percentatgeCens: '$percentatgeVotsCens',
            vots: { $sum: '$votsPartit' }
          }
        }
      }
    },
    {
      $project: {
        partits: {
          $filter: {
            input: '$partits',
            as: 'partit',
            cond: { $gt: ['$$partit.sigles', null] }
          }
        },
        totals: CSV_TITLES.totals.reduce((acc, curr) => {
          acc[curr] = '$' + curr
          return acc
        }, {})
      }
    }
  ]

  if (level !== 'municipis') {
    aggregate.unshift({ $match: { nom: municipi } })
  }

  return aggregate
}

const getIdByLevel = (level, eleccio) => {
  let _id = { any: '$anyEleccio' }
  if (level === 'municipis') {
    _id.municipi = '$codiMunicipi'
  } else {
    _id.seccio = '$seccio'
    _id.districte = '$districte'
    _id.eleccio = '$eleccio'
    _id.any = '$any'
  }

  return _id
}

const getAggregateTotalFields = () =>
  CSV_TITLES.totals.reduce((acc, curr) => {
    if (!curr.includes('percentatge')) {
      acc[curr] = { $sum: `$${curr}` }
    }
    return acc
  }, {})

module.exports = {
  createAggregate,
  calcularPercentatges
}
