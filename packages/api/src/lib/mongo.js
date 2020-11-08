const MongoClient = require('mongodb').MongoClient

const { MONGO_DB, MONGO_URL } = process.env

if (!MONGO_URL) {
  throw new Error('Missing URL for mongodb')
}

let client = null

module.exports = () => {
  if (client) {
    return client.db(MONGO_DB)
  }

  return new Promise((resolve, reject) => {
    return MongoClient.connect(MONGO_URL, { useNewUrlParser: true }, (err, res) => {
      if (err) {
        return reject(err)
      }

      client = res

      return resolve(client.db(MONGO_DB))
    })
  })
}
