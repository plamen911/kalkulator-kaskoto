import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    step: 1,
    initial_data: null,
    selected_price: null,
    insurance_id: '0',
    insurance_amount: '0',
    insurance_type: '',  // trusted_service | expert_evaluation
    discount_price: '0',
    standard_price: '0',
    // page 2
    reg_no: '',
    reg_cert_no: '',
    usage_id: '',
    wheel_position: '2',
    vehicle: null,
    // page 4
    client_names: '',
    id_number: '',
    address: '',
    phone: '',
    email: '',
    delivery_address: '',
    num_keys: '',
    num_alarm_controls: '',
    has_lost_keys: '0',
    past_theft: '0',
    future_pledge: '0',
    order: null
  }
}

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    update: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload
      }
    },
    clear: state => {
      state.data = {
        ...initialState.data
      }
    }
  },
})

export const cartActions = cart.actions

export default cart.reducer

