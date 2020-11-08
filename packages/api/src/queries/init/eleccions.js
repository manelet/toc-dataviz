function eleccions (db) {
  return new Promise(async (resolve, reject) => {
    db
      .collection('thinkoclock')
      .aggregate([
        {
          $group: {
            _id: { eleccio: '$eleccio' },
            anys: { $addToSet: '$any' }
          }
        }
      ])
      .toArray((err, results) => {
        if (err) {
          return reject(err)
        }

        return resolve(results.map(({ anys, _id }) => ({ anys, nom: _id.eleccio })))
      })
  })
}

module.exports = eleccions
