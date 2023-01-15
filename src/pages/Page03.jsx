import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, ListGroup, ListGroupItem, Row } from 'reactstrap'

import { cartActions } from '../store/cart'
import Layout from '../components/layout/Layout'
import CascoCard from '../components/layout/CascoCard'

export default () => {
  const cartData = useSelector(state => state.cart.data)
  const dispatch = useDispatch()

  const goBack = () => {
    dispatch(cartActions.update({step: 2}))
  }

  const goNext = () => {
    dispatch(cartActions.update({step: 4}))
  }

  return (
    <Layout>
      <CascoCard>
        <Row>
          <Col>
            <h4>ДАННИ ЗА МПС</h4>
            <ListGroup>
              <ListGroupItem>
                <Row>
                  <Col>РЕГИСТРАЦИОНЕН НОМЕР</Col>
                  <Col>{cartData.vehicle.reg_no || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>НОМЕР НА ТАЛОН</Col>
                  <Col>{cartData.vehicle.cert_no || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>МАРКА</Col>
                  <Col>{cartData.vehicle.brand || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>МОДЕЛ</Col>
                  <Col>{cartData.vehicle.model || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>НОМЕР НА ШАСИ</Col>
                  <Col>{cartData.vehicle.chassis || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ВИД МПС</Col>
                  <Col>{cartData.vehicle.vehicle_type || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>БРОЙ МЕСТА</Col>
                  <Col>{cartData.vehicle.seats_num || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ЦВЯТ</Col>
                  <Col>{cartData.vehicle.vehicle_color || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ВИД БОЯ</Col>
                  <Col>{cartData.vehicle.vehicle_paint_type || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ВИД РЕГИСТРАЦИЯ</Col>
                  <Col>{cartData.vehicle.vehicle_reg_type || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ПРЕДНАЗНАЧЕНИЕ</Col>
                  <Col>{cartData.vehicle.vehicle_usage || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ВИД ГОРИВО</Col>
                  <Col>{cartData.vehicle.vehicle_fuel_type || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>КУБАТУРА</Col>
                  <Col>{cartData.vehicle.ccm_ton || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>МОЩНОСТ (К. С.)</Col>
                  <Col>{cartData.vehicle.engine_power || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ОБЩО ТЕГЛО (КГ.)</Col>
                  <Col>{cartData.vehicle.tonage || ''}</Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col>ДАТА НА ПЪРВА РЕГИСТРАЦИЯ</Col>
                  <Col>{cartData.vehicle.first_reg || ''}</Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <div className="row">
          <div className="col-12 mt-3 d-flex justify-content-between">
            <Button color="secondary" onClick={goBack}>
              <i className="fas fa-chevron-left"></i> Назад
            </Button>
            <Button color="primary" onClick={goNext}>
              Продължи <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        </div>
      </CascoCard>
    </Layout>
  )
}
