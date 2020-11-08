// const convex = require('@turf/convex').default
const union = require('@turf/union').default
// const { polygon } = require('@turf/helpers')
// const cleanCoords = require('@turf/clean-coords').default
const simplify = require('@turf/simplify').default

const simplifyOptions = { tolerance: 0.001, highQuality: true, mutate: true }

async function geo ({ municipi = '080155', level = 'seccions' }) {
  const { db } = this
  const find = {}
  const geo = db.collection('geo')

  if (level !== 'municipis') {
    find['properties.municipi'] = municipi
  }

  return new Promise((resolve, reject) => {
    geo
      .find(find, { projection: { _id: 0 } })
      .toArray((err, results) => {
        if (err) {
          return reject(err)
        }

        let data

        if (level === 'municipis') {
          const groupByMunicipi = results.reduce((acc, curr) => {
            const { municipi } = curr.properties
            curr.id = Number(municipi.slice(2, 5))

            if (!acc[municipi]) {
              acc[municipi] = [curr]
            } else {
              acc[municipi].push(curr)
            }
            return acc
          }, {})

          data = Object
            .keys(groupByMunicipi)
            .reduce((acc, municipi) => {
              const features = groupByMunicipi[municipi]
              let feature

              for (let i = 0; i < features.length; i++) {
                if (features[ i + 1 ]) {
                  feature = union(feature || features[0], features[i + 1])
                } else if (i === 0) {
                  feature = features[0]
                }
              }

              // feature = cleanCoords(feature)
              feature = simplify(feature, simplifyOptions)

              feature.properties = { ...groupByMunicipi[municipi][0].properties }
              feature.id = Number(municipi.slice(2, 5))

              acc.push(feature)
              return acc
            }, []
            )
        }

        if (level === 'districtes') {
          const groupByDistricte = results.reduce((acc, curr) => {
            const { districte } = curr.properties
            if (!acc[districte]) {
              acc[districte] = [curr]
            } else {
              acc[districte].push(curr)
            }
            return acc
          }, {})

          data = Object
            .keys(groupByDistricte)
            .reduce((acc, districte) => {
              const features = groupByDistricte[districte]
              let feature

              if (features.length > 1) {
                for (let i = 0; i < features.length; i++) {
                  if (features[ i + 1 ]) {
                    feature = union(feature || features[0], features[i + 1])
                  }
                }
              } else {
                feature = { ...features[0] }
              }

              feature.properties = { ...groupByDistricte[districte][0].properties }
              feature.id = Number(feature.properties.municipi + feature.properties.districte)

              acc.push(feature)
              return acc
            }, []
            )
        }

        if (level === 'seccions') {
          data = results.map(f => {
            f.id = f.properties.mundissec
            return f
          })
        }

        return resolve(data)
      })
  })
}

module.exports = geo
