import { useSelector } from 'react-redux'

import Page01 from './pages/Page01'
import Page02 from './pages/Page02'
import Page03 from './pages/Page03'
import Page04 from './pages/Page04'
import Page05 from './pages/Page05'

function App () {
  const step = useSelector(state => state.cart.data.step)

  switch (step) {
    case 1:
      return <Page01/>
    case 2:
      return <Page02/>
    case 3:
      return <Page03/>
    case 4:
      return <Page04/>
    case 5:
      return <Page05/>
    default:
      return <Page01/>
  }
}

export default App
