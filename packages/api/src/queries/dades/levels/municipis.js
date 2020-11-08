module.exports = data => {
  const dataMap = new Map()

  for (let i = 0; i < data.length; i++) {
    const currentData = data[i]
    const key = currentData._id.municipi + ':' + currentData._id

    if (!dataMap.has(key)) {
      // create element in array with default current values
      dataMap.set(key, currentData)
    } else {
      // update map by values
      const values = dataMap.get(key)

      values.partits = values.partits
        .map(partit => {
          const dataFound = currentData.partits.find(p => p.sigles === partit.sigles)

          if (dataFound) {
            return { ...partit, vots: partit.vots + dataFound.vots }
          } else {
            return { ...partit }
          }
        })
        .sort((a, b) => b.vots > a.vots ? 1 : -1)

      values.totals = Object.keys(values.totals).reduce((totals, total) => {
        if (totals[total] && currentData.totals[total]) {
          totals[total] = totals[total] + currentData.totals[total]
        } else if (!totals[total] && currentData.totals[total]) {
          totals[total] = currentData.totals[total]
        }

        return totals
      }, values.totals)

      dataMap.set(key, values)
    }
  }

  return Array.from(dataMap.values())
}
