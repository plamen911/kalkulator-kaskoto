import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'

import { cartActions } from '../store/cart'
import Layout from '../components/layout/Layout'
import CascoCard from '../components/layout/CascoCard'
import Requester from '../utils/Requester.js'
import { parseErrors } from '../utils/utils.js'
import MyClipLoader from '../components/ui/MyClipLoader.jsx'

export default () => {
  const cartData = useSelector(state => state.cart.data)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [regNo, setRegNo] = useState(cartData.reg_no)
  const [regCertNo, setRegCertNo] = useState(cartData.reg_cert_no)
  const [usageId, setUsageId] = useState(cartData.usage_id)
  const [wheelPosition, setWheelPosition] = useState(cartData.wheel_position)

  const vehicleUsages = cartData && cartData.initial_data && cartData.initial_data.vehicle_usages

  const goBack = () => {
    dispatch(cartActions.update({step: 1}))
  }

  const goNext = async () => {
    setErrors({})

    if (regCertNo && regNo === cartData.reg_no && regCertNo === cartData.reg_cert_no) {
      dispatch(cartActions.update({
        step: 3,
        usage_id: usageId,
        wheel_position: wheelPosition,
      }))
    } else {
      setLoading(true)
      try {
        const vehicle = await Requester.getVehicle(regNo, regCertNo)
        setLoading(false)
        if (vehicle) {
          dispatch(cartActions.update({
            step: 3,
            reg_no: vehicle.reg_no,
            reg_cert_no: regCertNo,
            usage_id: usageId,
            wheel_position: wheelPosition,
            vehicle
          }))
        } else {
          setLoading(false)
          setErrors({reg_no: 'Error getting vehicle data...'})
        }
      } catch (err) {
        setLoading(false)
        setErrors(parseErrors(err))
      }
    }
  }

  return (
    <Layout>
      <CascoCard>
        {loading ? (
          <MyClipLoader loading={loading}/>
        ) : (
          <Form>
            <FormGroup>
              <Label for="reg_no">
                РЕГ. НОМЕР НА МПС
              </Label>
              <Input
                type="text"
                id="reg_no"
                name="reg_no"
                onChange={e => setRegNo(e.target.value)}
                value={regNo}
                maxLength="8"
                placeholder="Рег. номер на МПС"
                required={true}
                invalid={errors.hasOwnProperty('reg_no')}
              />
              <FormFeedback>
                {errors.reg_no}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="reg_cert_no">
                НОМЕР НА ТАЛОН
              </Label>
              <Input
                type="text"
                id="reg_cert_no"
                name="reg_cert_no"
                onChange={e => setRegCertNo(e.target.value)}
                value={regCertNo}
                maxLength="9"
                required={true}
                placeholder="Номер на талон"
              />
            </FormGroup>
            <FormGroup>
              <Label for="usage_id">
                ПРЕДНАЗНАЧЕНИЕ
              </Label>
              <Input
                type="select"
                id="usage_id"
                name="usage_id"
                onChange={e => setUsageId(e.target.value)}
                value={usageId}
                className="form-control"
              >
                <option value="">- Изберете -</option>
                {vehicleUsages && Object.keys(vehicleUsages).map(k => (
                  <option value={k} key={k}>
                    {vehicleUsages[k]}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <div className="d-flex justify-start">
              <Label for="wheel-position-yes" className="mr-3 mb-0">
                ДЕСЕН ВОЛАН?
              </Label>
              &nbsp; &nbsp;
              <div className="custom-control custom-radio custom-control-inline">
                <FormGroup
                  check
                  inline
                >
                  <Input
                    type="radio"
                    id="wheel-position-yes"
                    name="wheel_position"
                    value="1"
                    onChange={() => setWheelPosition('1')}
                    checked={'1' === wheelPosition}
                  />
                  <Label
                    for="wheel-position-yes"
                    check
                  >
                    ДА
                  </Label>
                </FormGroup>
                <FormGroup
                  check
                  inline
                >
                  <Input
                    type="radio"
                    id="wheel-position-no"
                    name="wheel_position"
                    value="2"
                    onChange={() => setWheelPosition('2')}
                    checked={'2' === wheelPosition}
                  />
                  <Label
                    for="wheel-position-no"
                    check
                  >
                    НЕ
                  </Label>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <div className="mt-3 d-flex justify-content-between">
                <Button color="secondary" onClick={goBack}>
                  <i className="fas fa-chevron-left"></i> Назад
                </Button>
                <Button color="primary" onClick={goNext}>
                  Продължи <i className="fas fa-chevron-right"></i>
                </Button>
              </div>
            </FormGroup>
          </Form>
        )}
      </CascoCard>
    </Layout>
  )
}
