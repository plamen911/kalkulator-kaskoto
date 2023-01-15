export const formatCurrency = number => {
  return new Intl.NumberFormat('bg-BG', {
    style: 'currency',
    currency: 'BGN',
    useGrouping: 'always'
  }).format(number)
}

export const parseErrors = err => {
  let errors = {}

  Object.entries(err.response.data.errors)
    .forEach(entry => errors[entry[0]] = entry[1][0])

  return errors
}
