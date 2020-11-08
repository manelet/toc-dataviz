async function municipis (db) {
  return new Promise(async (resolve, reject) => {
    db
      .collection('municipis')
      .find()
      .toArray((err, data) => {
        if (err) {
          return reject(err)
        }

        return resolve(data)
      })
  })
}

module.exports = municipis
