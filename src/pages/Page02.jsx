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
  const [cabriolet, setCabriolet] = useState(cartData.cabriolet)
  const [taxiTraining, setTaxiTraining] = useState(cartData.taxi_training)

  const vehicleUsages = cartData && cartData.initial_data && cartData.initial_data.vehicle_usages

  const goBack = () => {
    dispatch(cartActions.update({step: 1}))
  }

  const goNext = async () => {
    setErrors({})

    const validationErrors = {}
    const trimmedRegNo = (regNo || '').trim()
    const trimmedRegCertNo = (regCertNo || '').trim()

    // Bulgarian plate: 1-2 region letters + 4 digits + 2 letters (Latin or Cyrillic)
    if (!trimmedRegNo) {
      validationErrors.reg_no = 'Моля, въведете рег. номер на МПС.'
    } else if (!/^[A-ZА-Я]{1,2}\d{4}[A-ZА-Я]{2}$/i.test(trimmedRegNo)) {
      validationErrors.reg_no = 'Невалиден рег. номер на МПС.'
    }

    // Registration certificate (талон): exactly 9 digits
    if (!trimmedRegCertNo) {
      validationErrors.reg_cert_no = 'Моля, въведете номер на талон.'
    } else if (!/^\d{9}$/.test(trimmedRegCertNo)) {
      validationErrors.reg_cert_no = 'Номерът на талон трябва да съдържа 9 цифри.'
    }

    if (wheelPosition === '1') {
      validationErrors.wheel_position = 'Автомобили с десен волан не се застраховат по този продукт. Свържете се с нас за индивидуална оферта.'
    }

    if (cabriolet === '1') {
      validationErrors.cabriolet = 'Кабриолети не се застраховат по този продукт. Свържете се с нас за индивидуална оферта.'
    }

    if (taxiTraining === '1') {
      validationErrors.taxi_training = 'Такси и учебни автомобили не се застраховат по този продукт. Свържете се с нас за индивидуална оферта.'
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    if (regCertNo && regNo === cartData.reg_no && regCertNo === cartData.reg_cert_no) {
      dispatch(cartActions.update({
        step: 3,
        usage_id: usageId,
        wheel_position: wheelPosition,
        cabriolet: cabriolet,
        taxi_training: taxiTraining,
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
            cabriolet: cabriolet,
            taxi_training: taxiTraining,
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
                invalid={errors.hasOwnProperty('reg_cert_no')}
              />
              <FormFeedback>
                {errors.reg_cert_no}
              </FormFeedback>
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
            {errors.wheel_position && (
              <FormFeedback style={{ display: 'block' }}>
                {errors.wheel_position}
              </FormFeedback>
            )}
            <div className="d-flex justify-start mt-3">
              <Label for="cabriolet-yes" className="mr-3 mb-0">
                КАБРИОЛЕТ?
              </Label>
              &nbsp; &nbsp;
              <div className="custom-control custom-radio custom-control-inline">
                <FormGroup
                  check
                  inline
                >
                  <Input
                    type="radio"
                    id="cabriolet-yes"
                    name="cabriolet"
                    value="1"
                    onChange={() => setCabriolet('1')}
                    checked={'1' === cabriolet}
                  />
                  <Label
                    for="cabriolet-yes"
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
                    id="cabriolet-no"
                    name="cabriolet"
                    value="2"
                    onChange={() => setCabriolet('2')}
                    checked={'2' === cabriolet}
                  />
                  <Label
                    for="cabriolet-no"
                    check
                  >
                    НЕ
                  </Label>
                </FormGroup>
              </div>
            </div>
            {errors.cabriolet && (
              <FormFeedback style={{ display: 'block' }}>
                {errors.cabriolet}
              </FormFeedback>
            )}
            <div className="d-flex justify-start mt-3">
              <Label for="taxi-training-yes" className="mr-3 mb-0">
                ТАКСИ/УЧЕБЕН АВТОМОБИЛ?
              </Label>
              &nbsp; &nbsp;
              <div className="custom-control custom-radio custom-control-inline">
                <FormGroup
                  check
                  inline
                >
                  <Input
                    type="radio"
                    id="taxi-training-yes"
                    name="taxi_training"
                    value="1"
                    onChange={() => setTaxiTraining('1')}
                    checked={'1' === taxiTraining}
                  />
                  <Label
                    for="taxi-training-yes"
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
                    id="taxi-training-no"
                    name="taxi_training"
                    value="2"
                    onChange={() => setTaxiTraining('2')}
                    checked={'2' === taxiTraining}
                  />
                  <Label
                    for="taxi-training-no"
                    check
                  >
                    НЕ
                  </Label>
                </FormGroup>
              </div>
            </div>
            {errors.taxi_training && (
              <FormFeedback style={{ display: 'block' }}>
                {errors.taxi_training}
              </FormFeedback>
            )}
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