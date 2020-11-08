const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

const getKey = ({ query, path }) => {
  const values = Object.values(query)
  return path.slice(1).toUpperCase() + (values.length ? '/' : '') + Object.values(query).join('/')
}

const percentatge = (a, b) => Number(((a * 100) / b).toFixed(2))

const compose = (...fns) =>
  fns.reduceRight((prevFn, nextFn) =>
    (...args) => nextFn(prevFn(...args)),
  value => value
  )

const CSV_TITLES = {
  totals: [
    'censElectoral',
    'votants',
    'percentatgeVotants',
    'abstencio',
    'percentatgeAbstencio',
    'votsNuls',
    'percentatgeNuls',
    'votsBlancs',
    'percentatgeBlancs',
    'votsCandidatures',
    'percentatgeCandidatures',
    'votsValids',
    'percentatgeValids'
  ],
  partits: [
    'sigles',
    'denominacio',
    'votsPartit',
    'percentatgeVotsValids',
    'percentatgeVotsCens'
  ]
}

module.exports = {
  CSV_TITLES,
  percentatge,
  compose,
  isDev,
  getKey
}
