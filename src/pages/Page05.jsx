import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, ListGroup, ListGroupItem, Row } from 'reactstrap'

import { cartActions } from '../store/cart'
import Layout from '../components/layout/Layout'
import CascoCard from '../components/layout/CascoCard'

export default () => {
  const cartData = useSelector(state => state.cart.data)
  const dispatch = useDispatch()

  const startOver = () => {
    dispatch(cartActions.clear())
  }

  return (
    <Layout>
      <CascoCard>
        <Row>
          <Col>
            <h4>
              <i className="far fa-thumbs-up"></i> ВАШАТА ПОРЪЧКА Е ПРИЕТА УСПЕШНО!
            </h4>
            <ListGroup>
              <ListGroupItem>
                НОМЕР НА ПОРЪЧКАТА:
                <strong className="company-color">{cartData.order.order_num}</strong>
              </ListGroupItem>
              <ListGroupItem>
                Екипът на
                <strong className="company-color">ЗБ "Дженерал Брокер Клуб" ООД</strong>
                Ви благодари за направения избор.
              </ListGroupItem>
              <ListGroupItem>
                Нашите експерти ще обработят заявката и ще се свържат с Вас по телефон или имейл за уточняване на
                плащане и доставка на полицата.
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <div className="row">
          <div className="col-12 mt-3">
            <Button color="primary" onClick={startOver}>
              <i className="fas fa-check"></i> ГОТОВО
            </Button>
          </div>
        </div>
      </CascoCard>
    </Layout>
  )
}
