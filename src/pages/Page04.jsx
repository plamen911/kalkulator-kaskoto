import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Col,
  Form, FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  ListGroup,
  ListGroupItem,
  Row
} from 'reactstrap'

import { cartActions } from '../store/cart'
import Layout from '../components/layout/Layout'
import CascoCard from '../components/layout/CascoCard.jsx'
import MyClipLoader from '../components/ui/MyClipLoader.jsx'
import { parseErrors } from '../utils/utils.js'
import Requester from '../utils/Requester.js'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default () => {
  const cartData = useSelector(state => state.cart.data)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [clientNames, setClientNames] = useState(cartData.client_names)
  const [idNumber, setIdNumber] = useState(cartData.id_number)
  const [address, setAddress] = useState(cartData.address)
  const [phone, setPhone] = useState(cartData.phone)
  const [email, setEmail] = useState(cartData.email)
  const [deliveryAddress, setDeliveryAddress] = useState(cartData.email)
  const [numKeys, setNumKeys] = useState(cartData.num_keys)
  const [numAlarmControls, setNumAlarmControls] = useState(cartData.num_alarm_controls)
  const [hasLostKeys, setHasLostKeys] = useState(cartData.has_lost_keys)
  const [pastTheft, setPastTheft] = useState(cartData.past_theft)
  const [futurePledge, setFuturePledge] = useState(cartData.future_pledge)
  const [checkedAgreements, setCheckedAgreements] = useState({})

  const goBack = () => {
    dispatch(cartActions.update({
      step: 3,
      client_names: clientNames,
      id_number: idNumber,
      address: address,
      phone: phone,
      email: email,
      delivery_address: deliveryAddress,
      num_keys: numKeys,
      num_alarm_controls: numAlarmControls,
      has_lost_keys: hasLostKeys,
      past_theft: pastTheft,
      future_pledge: futurePledge
    }))
  }

  const goNext = async () => {
    setErrors({})

    // Agreements check
    const requiredAgreements = cartData.initial_data.agreements;
    const missingAgreements = requiredAgreements.filter((a, i) => typeof checkedAgreements[i] === 'undefined');

    if (missingAgreements.length > 0) {
      setErrors({missingAgreements})
      dispatch(cartActions.update({checked_agreements: checkedAgreements}))
      return
    }

    setLoading(true)

    try {

      const payload = {
        insurance_id: cartData.insurance_id,
        insurance_amount: +cartData.insurance_amount,
        insurance_type: cartData.insurance_type,
        discount_price: +cartData.discount_price,
        standard_price: +cartData.standard_price,
        vehicle_id: +cartData.vehicle.id,
        usage_id: +cartData.usage_id,
        wheel_position: +cartData.wheel_position,
        client_names: clientNames,
        id_number: idNumber,
        address: address,
        phone: phone,
        email: email,
        delivery_address: deliveryAddress,
        num_keys: numKeys,
        num_alarm_controls: numAlarmControls,
        has_lost_keys: hasLostKeys,
        past_theft: +pastTheft,
        future_pledge: +futurePledge
      }

      const order = await Requester.placeOrder(payload)
      setLoading(false)

      dispatch(cartActions.update({step: 5, order}))

    } catch (err) {
      setLoading(false)
      setErrors(parseErrors(err))
    }
  }

  const agreementHandler = e => {
    const idx = +e.target.value

    if (e.target.checked) {
      setCheckedAgreements(prevState => {
        return {
          ...prevState,
          [idx]: idx
        }
      })
    } else {
      setCheckedAgreements(prevState => {
        let modifiedState = {...prevState}
        delete modifiedState[idx]

        return modifiedState;
      })
    }
  }

  return (
    <Layout>
      <CascoCard>
        {loading ? (
          <MyClipLoader loading={loading}/>
        ) : (
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="client_names">
                    ??????????
                  </Label>
                  <Input
                    type="text"
                    id="client_names"
                    name="client_names"
                    onChange={e => setClientNames(e.target.value)}
                    value={clientNames}
                    placeholder="??????????"
                    required={true}
                    invalid={errors.hasOwnProperty('client_names')}
                  />
                  <FormFeedback>
                    {errors.client_names}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="id_number">
                    ??????
                  </Label>
                  <Input
                    type="number"
                    id="id_number"
                    name="id_number"
                    onChange={e => setIdNumber(e.target.value)}
                    value={idNumber}
                    placeholder="??????"
                    required={true}
                    invalid={errors.hasOwnProperty('id_number')}
                  />
                  <FormFeedback>
                    {errors.id_number}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="address">
                    ?????????? ???? ?????????? ??????????
                  </Label>
                  <Input
                    type="text"
                    id="address"
                    name="address"
                    onChange={e => setAddress(e.target.value)}
                    value={address}
                    placeholder="??????????"
                    required={true}
                    invalid={errors.hasOwnProperty('address')}
                  />
                  <FormFeedback>
                    {errors.address}
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">
                    ?????????????? ???? ????????????
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    onChange={e => setPhone(e.target.value)}
                    value={phone}
                    placeholder="??????????????"
                    required={true}
                    invalid={errors.hasOwnProperty('phone')}
                  />
                  <FormFeedback>
                    {errors.phone}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="email">
                    E-MAIL
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    placeholder="E-mail"
                    required={true}
                    invalid={errors.hasOwnProperty('email')}
                  />
                  <FormFeedback>
                    {errors.email}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="delivery_address">
                    ?????????? ???? ???????????????? ???? ????????????????
                  </Label>
                  <Input
                    type="text"
                    id="delivery_address"
                    name="delivery_address"
                    onChange={e => setDeliveryAddress(e.target.value)}
                    value={deliveryAddress}
                    placeholder="?????????? ???? ????????????????"
                    required={true}
                    invalid={errors.hasOwnProperty('delivery_address')}
                  />
                  <FormFeedback>
                    {errors.delivery_address}
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row className="border-bottom pb-3 mb-3">
              <Col>
                <h4><i className="fas fa-list"></i> ???????????????????????? ??????????</h4>
                <ListGroup>
                  <ListGroupItem>
                    <Row>
                      <Col sm={8} md={9}>
                        1. ???????? ??????????????, ?? ?????????? ?????????????????????? ?????? ??????????????
                      </Col>
                      <Col sm={4} md={3}>
                        <InputGroup>
                          <Input
                            type="number"
                            id="num_keys"
                            name="num_keys"
                            onChange={e => setNumKeys(e.target.value)}
                            value={numKeys}
                            placeholder="????. ??????????????"
                          />
                          <InputGroupText>
                            ????.
                          </InputGroupText>
                        </InputGroup>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col sm={8} md={9}>
                        2. ???????? ???????????????????????? ???? ???????????????????? ??????????????, ?? ?????????? ?????????????????????? ?????? ??????????????
                      </Col>
                      <Col sm={4} md={3}>
                        <InputGroup>
                          <Input
                            type="number"
                            id="num_alarm_controls"
                            name="num_alarm_controls"
                            onChange={e => setNumAlarmControls(e.target.value)}
                            value={numAlarmControls}
                            placeholder="????. ????????????????????????"
                          />
                          <InputGroupText>
                            ????.
                          </InputGroupText>
                        </InputGroup>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col sm={8} md={9}>
                        3. ???????????????? ???? ???? ?? ???? ???? ?????????????????? (??????????????) ?????????????? ??/?????? ???????????????????????????? ???? ???????????????????? ??-???? ??
                        ??????????????????????, ??/?????? ???????????????????????????? ???? ?????????????????????? ???? ???????
                      </Col>
                      <Col sm={4} md={3}>
                        <div className="custom-control custom-radio custom-control-inline">
                          <FormGroup
                            check
                            inline
                          >
                            <Input
                              type="radio"
                              id="has-lost-keys-yes"
                              name="has_lost_keys"
                              value="1"
                              onChange={() => setHasLostKeys('1')}
                              checked={'1' === hasLostKeys}
                            />
                            <Label
                              for="has-lost-keys-yes"
                              check
                            >
                              ????
                            </Label>
                          </FormGroup>
                          <FormGroup
                            check
                            inline
                          >
                            <Input
                              type="radio"
                              id="has-lost-keys-no"
                              name="has_lost_keys"
                              value="0"
                              onChange={() => setHasLostKeys('0')}
                              checked={'0' === hasLostKeys}
                            />
                            <Label
                              for="has-lost-keys-no"
                              check
                            >
                              ????
                            </Label>
                          </FormGroup>
                        </div>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col sm={8} md={9}>
                        4. ???????????????? ???? ???? ?? ?????? ???? ?? ???????? ???????????????????????????? ???????????????? ?????? ???? ?? ?????????? ?????????? ???? ???????????????? ?????
                      </Col>
                      <Col sm={4} md={3}>
                        <div className="custom-control custom-radio custom-control-inline">
                          <FormGroup
                            check
                            inline
                          >
                            <Input
                              type="radio"
                              id="past-theft-yes"
                              name="past_theft"
                              value="1"
                              onChange={() => setPastTheft('1')}
                              checked={'1' === pastTheft}
                            />
                            <Label
                              for="past-theft-yes"
                              check
                            >
                              ????
                            </Label>
                          </FormGroup>
                          <FormGroup
                            check
                            inline
                          >
                            <Input
                              type="radio"
                              id="past-theft-no"
                              name="past_theft"
                              value="0"
                              onChange={() => setPastTheft('0')}
                              checked={'0' === pastTheft}
                            />
                            <Label
                              for="past-theft-no"
                              check
                            >
                              ????
                            </Label>
                          </FormGroup>
                        </div>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row>
                      <Col sm={8} md={9}>
                        5. ???? ???????? ???? ?????? ?????????? ???? ?????????? ???? ???????????????????? ???? ????????????/?????????
                      </Col>
                      <Col sm={4} md={3}>
                        <div className="custom-control custom-radio custom-control-inline">
                          <FormGroup
                            check
                            inline
                          >
                            <Input
                              type="radio"
                              id="future-pledge-yes"
                              name="future_pledge"
                              value="1"
                              onChange={() => setFuturePledge('1')}
                              checked={'1' === futurePledge}
                            />
                            <Label
                              for="future-pledge-yes"
                              check
                            >
                              ????
                            </Label>
                          </FormGroup>
                          <FormGroup
                            check
                            inline
                          >
                            <Input
                              type="radio"
                              id="future-pledge-no"
                              name="future_pledge"
                              value="0"
                              onChange={() => setFuturePledge('0')}
                              checked={'0' === futurePledge}
                            />
                            <Label
                              for="future-pledge-no"
                              check
                            >
                              ????
                            </Label>
                          </FormGroup>
                        </div>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <ListGroup>
                  {cartData && cartData.initial_data && cartData.initial_data.agreements.map((item, i) => (
                    <ListGroupItem key={`list-group-${i}`}>
                      <div key={`wrap-${i}`} className="d-flex justify-content-start">
                        <FormGroup
                          check
                          inline
                          key={`form-group-${i}`}
                        >
                          <Input
                            type="checkbox"
                            key={`agreement-${i}`}
                            id={`agreement-${i}`}
                            onChange={agreementHandler}
                            checked={typeof checkedAgreements[i] !== 'undefined'}
                            value={i}
                            invalid={errors.hasOwnProperty('missingAgreements') && typeof errors.missingAgreements[i] !== 'undefined'}
                          />
                          <Label key={`label-${i}`} check className="d-none">
                            Agreement {i}
                          </Label>
                          <FormFeedback key={`feedback-${i}`} tooltip>
                            ???????????? ???? ???????????????? ???????????????????????? {i + 1}, ???? ???? ????????????????????.
                          </FormFeedback>
                        </FormGroup>
                        <div key={`agreement-wrapper-${i}`}>
                          <span key={`span-text-${i}`}>{item.text}{` `}</span>
                          {item.links && item.links.map((link, j) => (
                            <>
                              <a
                                href={link.href}
                                target="_blank"
                                key={`doc-${i}-${j}`}
                                className="company-color"
                                style={{marginRight: '10px'}}
                              >
                                <FontAwesomeIcon icon={faCheck}/>
                                {` `}{link.text}
                              </a>
                            </>
                          ))}
                        </div>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Col>
            </Row>
            <FormGroup>
              <div className="mt-3 d-flex justify-content-between">
                <Button color="secondary" onClick={goBack}>
                  <i className="fas fa-chevron-left"></i> ??????????
                </Button>
                <Button color="primary" onClick={goNext}>
                  ?????????????? <i className="fas fa-chevron-right"></i>
                </Button>
              </div>
            </FormGroup>
          </Form>
        )}
      </CascoCard>
    </Layout>
  )
}
