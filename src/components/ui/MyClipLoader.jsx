import { useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader.js'

const override = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'white',
}

export default ({loading}) => {
  const [color, setColor] = useState('#ffffff')

  return (
    <ClipLoader
      color={color}
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  )
}
