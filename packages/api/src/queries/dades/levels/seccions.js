module.exports = data =>
  data.map(d => {
    d.partits = d.partits.sort((a, b) => b.vots > a.vots ? 1 : -1)
    return d
  })
