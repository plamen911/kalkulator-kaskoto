import axios from 'axios'

const API_URL = 'https://daike.eu/api/kaskoto'

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
