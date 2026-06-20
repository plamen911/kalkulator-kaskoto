import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faCheck, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { Button, ListGroup, ListGroupItem } from 'reactstrap'

import { cartActions } from '../store/cart'
import Requester from '../utils/Requester'
import { formatCurrency } from '../utils/utils'
import Layout from '../components/layout/Layout'
import {
  IconShieldCheck,
  IconUserShield,
  IconCarCrash,
  IconCarSuv,
  IconParking,
  IconCarCrane,
  IconCarGarage,
} from '@tabler/icons-react'

import 'react-tooltip/dist/react-tooltip.css'
import '../pulse.css'
import MyClipLoader from '../components/ui/MyClipLoader.jsx'

export default () => {
  const cartData = useSelector(state => state.cart.data)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData () {
      setLoading(true)
      const data = await Requester.loadInitialData()
      setLoading(false)

      if (data) {
        dispatch(cartActions.update({initial_data: data}))
      }
    }

    if (!cartData || !cartData.initial_data || cartData.initial_data.amounts.length === 0) {
      fetchData()
    }
  }, [])

  const handleChange = e => {
    const found = cartData.initial_data.amounts.filter(a => +a.insurance_amount === +e.target.value)

    let selectedPrice = null;
    if (typeof found[0] !== 'undefined') {
      selectedPrice = found[0]
    }

    dispatch(cartActions.update({selected_price: selectedPrice}))
  }

  const chooseOffer = insuranceType => {
    const payload = {
      step: 2,
      insurance_id: cartData.selected_price.insurance_id,
      insurance_amount: cartData.selected_price.insurance_amount,
      insurance_type: insuranceType,
      discount_price: cartData.selected_price[insuranceType].discount_price,
      standard_price: cartData.selected_price[insuranceType].standard_price,
    }

    dispatch(cartActions.update(payload))
  }

  const offers = [
    {
      type: 'expert_evaluation',
      label: 'По Експертна оценка',
      tooltipId: 'expert-evaluation',
      tooltip: 'Застрахователната компания оценява щетите по автомобила и изплаща обезщетение в брой или по банков път. Клиентът сам се договаря и разплаща с избран от него сервиз за ремонт на автомобила.',
    },
    {
      type: 'trusted_service',
      label: 'C право на Доверен сервиз',
      tooltipId: 'trusted-service',
      tooltip: 'Застрахователната компания се разплаща директно с автосервиза, който ремонтира автомобила. В този случай няма риск за клиента обезщетението да не е достатъчно за покриване на щетите.',
    },
  ]

  const features = [
    {Icon: IconUserShield, title: 'Без завишение', subtitle: 'за млад водач'},
    {Icon: IconCarCrash, title: 'Без завишение', subtitle: 'при щета'},
    {Icon: IconCarSuv, title: 'Без завишение', subtitle: 'за марки'},
    {Icon: IconParking, title: '3 щети на паркинг', subtitle: 'без документ'},
    {Icon: IconCarCrane, title: 'Пътна помощ', subtitle: 'до 100 км'},
    {Icon: IconCarGarage, title: 'Доверен сервиз', subtitle: 'в цялата страна'},
  ]

  const discountPercents = cartData && cartData.initial_data && +cartData.initial_data.discount_percents

  return (
    <Layout>
      {loading ? (
        <MyClipLoader loading={loading}/>
      ) : (
        <>
          <div className="row">
            <div className="col-12 rounded" style={{backgroundColor: '#8b2131', color: 'white'}}>
              <div className="mb-1 mt-2 mb-2">
                <div className="form-group">
                  <label htmlFor="priceSelect" className="form-label">
                    За лек автомобил до 9 места и товарен до 3.5 т.
                  </label>
                  <select
                    id="priceSelect"
                    className="form-select form-select-lg"
                    onChange={handleChange}
                    value={(cartData.selected_price && cartData.selected_price.insurance_amount) || ''}
                    style={{color: '#212529', backgroundColor: '#fff'}}
                  >
                    <option value={null} style={{color: '#212529', backgroundColor: '#fff'}}>Изберете стойност</option>
                    {cartData && cartData.initial_data && cartData.initial_data.amounts && cartData.initial_data.amounts.map((item, index) => (
                      <option value={item.insurance_amount} key={index} style={{color: '#212529', backgroundColor: '#fff'}}>
                        {formatCurrency(item.insurance_amount)}
                      </option>
                    ))}
                  </select>
                  {!cartData.selected_price ? (
                    <>
                      <hr className="my-2" style={{borderColor: 'rgba(255, 255, 255, 0.4)', opacity: 1}}/>
                      <div className="d-flex align-items-center justify-content-between">
                        <FontAwesomeIcon icon={faArrowUp} size="lg" className="ms-3 blink-up"/>
                        <span>Колко струва Вашето Каско?</span>
                        <FontAwesomeIcon icon={faArrowUp} size="lg" className="me-3 blink-up"/>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {!cartData.selected_price ? (
            <div className="mt-4">
              <div className="text-center">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center company-color"
                  style={{width: '92px', height: '92px', backgroundColor: 'rgba(139, 33, 49, 0.08)'}}
                >
                  <IconShieldCheck size={74} stroke={1.5}/>
                </div>
                <h4 className="fw-bold mt-2 mb-4">Пълно Каско</h4>
              </div>
              <div className="row g-3 text-center">
                {features.map((feature, index) => (
                  <div className="col-4" key={index}>
                    <div
                      className="rounded-circle d-inline-flex align-items-center justify-content-center company-color mb-2"
                      style={{width: '66px', height: '66px', backgroundColor: 'rgba(139, 33, 49, 0.08)'}}
                    >
                      <feature.Icon size={50} stroke={1.5}/>
                    </div>
                    <div className="fw-bold small lh-sm d-flex align-items-end justify-content-center" style={{minHeight: '2.5em'}}>{feature.title}</div>
                    <div className="text-muted small lh-sm">{feature.subtitle}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <div className="fw-bold company-color">Под 2 € на ден</div>
                <div className="text-muted small">Изберете няколко стойности и сравнете цените.</div>
              </div>
            </div>
          ) : null}
          {cartData && cartData.selected_price ? (
            <div className="row">
              <div className="col-12">
                <table className="table mt-3 d-none d-md-table">
                  <thead>
                    <tr>
                      <th scope="col">Начин на обезщетяване</th>
                      <th scope="col">Стандартна цена</th>
                      <th scope="col">
                        <h5 className="mb-0">
                          Цена с {discountPercents}% ОТСТЪПКА
                        </h5>
                      </th>
                      <th scope="col">{` `}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map(offer => (
                      <tr key={offer.type}>
                        <td>
                          <span className="fw-bolder company-color">{offer.label}</span> {` `}
                          <span id={offer.tooltipId}>
                            <FontAwesomeIcon
                              icon={faCircleInfo}
                              className="company-color"
                            />
                          </span>
                        </td>
                        <td>
                          {formatCurrency(cartData.selected_price[offer.type].standard_price)}
                        </td>
                        <td>
                          <h5 className="mb-0 company-color">
                            <span className="pulse rounded">
                              {formatCurrency(cartData.selected_price[offer.type].discount_price)}
                            </span>
                          </h5>
                        </td>
                        <td>
                          <Button
                            color="primary"
                            onClick={() => chooseOffer(offer.type)}
                            className="casco-btn"
                          >
                            Избери <i className="fas fa-chevron-right"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-md-none mt-3">
                  {offers.map(offer => (
                    <div key={offer.type} className="border rounded p-3 mb-3">
                      <div className="fw-bolder company-color mb-2">
                        {offer.label} {` `}
                        <span id={`${offer.tooltipId}-m`}>
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="company-color"
                          />
                        </span>
                      </div>
                      <div className="mb-1">
                        Стандартна цена: {formatCurrency(cartData.selected_price[offer.type].standard_price)}
                      </div>
                      <div className="mb-3">
                        {discountPercents}% ОТСТЪПКА: {` `}
                        <span className="pulse rounded company-color fw-bold">
                          {formatCurrency(cartData.selected_price[offer.type].discount_price)}
                        </span>
                      </div>
                      <Button
                        color="primary"
                        onClick={() => chooseOffer(offer.type)}
                        className="casco-btn w-100"
                      >
                        Избери <i className="fas fa-chevron-right"></i>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="text-muted text-center sm mt-3">
                  * В посочените цени е включен 2% данък върху застрахователните премии.
                </div>
                <ListGroup className="mt-4">
                  {cartData && cartData.initial_data && cartData.initial_data.documents.map((document, index) => (
                    <ListGroupItem
                      action
                      key={index}
                    >
                      <a href={document.href} target="_blank" className="company-color">
                        <FontAwesomeIcon icon={faCheck}/>
                        {` `}{document.text}
                      </a>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </div>
              {offers.map(offer => (
                [offer.tooltipId, `${offer.tooltipId}-m`].map(anchor => (
                  <ReactTooltip
                    key={anchor}
                    style={{width: '300px', color: 'black', backgroundColor: 'whitesmoke'}}
                    anchorId={anchor}
                    place="top"
                    content={offer.tooltip}
                  />
                ))
              ))}
            </div>
          ) : null}
        </>
      )}
    </Layout>
  )
}