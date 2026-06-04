import axios from 'axios'

// Defaults to the direct backend (WordPress embed / local). On Cloudflare the
// VITE_API_URL build env var points this at the same-origin proxy (/api/kaskoto).
const API_URL = import.meta.env.VITE_API_URL || 'https://daike.eu/api/kaskoto'
//const API_URL = 'http://localhost:3000/api/kaskoto'

axios.defaults.headers.post['Content-Type'] = 'application/json'

const loadInitialData = async () => (
  (await axios.get(API_URL)).data
)

const getVehicle = async (reg_no, reg_cert_no) => (
  (await axios.post(API_URL + '/vehicle', {
    reg_no, reg_cert_no
  })).data
)

const placeOrder = async payload => (
  (await axios.post(API_URL + '/order', payload)).data
)
export default {
  loadInitialData,
  getVehicle,
  placeOrder
}