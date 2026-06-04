import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import { store } from './store'
import './index.css'
import App from './App'
import Branding from './components/Branding'

ReactDOM.createRoot(document.getElementById('insurance-kaskoto')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Branding/>
      <App/>
    </Provider>
  </React.StrictMode>,
)
