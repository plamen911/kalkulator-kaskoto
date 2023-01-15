import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap'

import { cartActions } from '../store/cart'
import Requester from '../utils/Requester'
import { formatCurrency } from '../utils/utils'
import Layout from '../components/layout/Layout'

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

  return (
    <Layout>
      {loading ? (
        <MyClipLoader loading={loading}/>
      ) : (
        <>
          <div className="row">
            <div className="col-12 rounded" style={{backgroundColor: '#8b2131', color: 'white'}}>
              <div className="mb-1 mt-2 mb-3">
                <div className="form-group">
                  <label htmlFor="priceSelect" className="form-label">
                    Изберете на каква стойност да застраховате автомобила си и вижте цената
                  </label>
                  <select
                    id="priceSelect"
                    className="form-control"
                    onChange={handleChange}
                    value={(cartData.selected_price && cartData.selected_price.insurance_amount) || ''}
                  >
                    <option value={null}>Изберете</option>
                    {cartData && cartData.initial_data && cartData.initial_data.amounts && cartData.initial_data.amounts.map((item, index) => (
                      <option value={item.insurance_amount} key={index}>
                        {formatCurrency(item.insurance_amount)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {cartData && cartData.selected_price ? (
            <div className="row">
              <div className="col-12 mt-4">
                <h4 style={{color: '#8b2131'}} className="text-center">
                  Застрахователна стойност: {formatCurrency(cartData.selected_price.insurance_amount)}
                </h4>
                <table className="table mt-3">
                  <thead>
                  <tr>
                    <th scope="col">Начин на обезщетяване</th>
                    <th scope="col">Стандартна цена</th>
                    <th scope="col">
                      <h5 className="mb-0">
                        Цена с {cartData && cartData.initial_data && +cartData.initial_data.discount_percents}% ОТСТЪПКА
                      </h5>
                    </th>
                    <th scope="col">{` `}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>
                      По Експертна оценка {' '}
                      <span id="expert-evaluation">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      style={{color: '#f0ad4e'}}
                    />
                  </span>
                    </td>
                    <td>{formatCurrency(cartData.selected_price.expert_evaluation.standard_price)}</td>
                    <td>
                      <h5 style={{color: '#8b2131'}} className="mb-0">
                    <span className="pulse rounded">
                      {formatCurrency(cartData.selected_price.expert_evaluation.discount_price)}
                    </span>
                      </h5>
                    </td>
                    <td>
                      <Button
                        color="primary"
                        onClick={() => chooseOffer('expert_evaluation')}
                      >
                        Избери <i className="fas fa-chevron-right"></i>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      C право на Доверен сервиз {' '}
                      <span id="trusted-service">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      style={{color: '#f0ad4e'}}
                    />
                  </span>
                    </td>
                    <td>{formatCurrency(cartData.selected_price.trusted_service.standard_price)}</td>
                    <td>
                      <h5 style={{color: '#8b2131'}} className="mb-0">
                    <span className="pulse rounded">
                      {formatCurrency(cartData.selected_price.trusted_service.discount_price)}
                    </span>
                      </h5>
                    </td>
                    <td>
                      <Button
                        color="primary"
                        onClick={() => chooseOffer('trusted_service')}
                      >
                        Избери <i className="fas fa-chevron-right"></i>
                      </Button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div className="text-muted text-center sm mt-3">
                  * В посочените цени не е включен 2% данък върху застрахователните премии.
                </div>
              </div>
              <ReactTooltip
                style={{width: '300px', color: 'black'}}
                variant="warning"
                anchorId="expert-evaluation"
                place="top"
                content="Застрахователната компания оценява щетите по автомобила и изплаща обезщетение в брой или по банков път. Клиентът сам се договаря и разплаща с избран от него сервиз за ремонт на автомобила."
              />
              <ReactTooltip
                style={{width: '300px', color: 'black'}}
                variant="warning"
                anchorId="trusted-service"
                place="top"
                content="Застрахователната компания се разплаща директно с автосервиза, който ремонтира автомобила. В този случай няма риск за клиента обезщетението да не е достатъчно за покриване на щетите."
              />
            </div>
          ) : null}
        </>
      )}
    </Layout>
  )
}
