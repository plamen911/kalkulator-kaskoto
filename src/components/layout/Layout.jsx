export default props => (
  <div>
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="p-2">
          {props.children}
        </div>
      </div>
    </div>
  </div>
)
