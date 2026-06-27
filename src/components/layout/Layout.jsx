export default props => (
  <div translate="no" className="notranslate">
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="p-2">
          {props.children}
        </div>
      </div>
    </div>
  </div>
)
