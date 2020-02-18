import React, { Component, Fragment } from 'react';
import '../../style/common/modal.css';

class Modal extends Component {
  render() {
    return (
      <Fragment>
          {
              this.props.show && 
              <div className="backdrop">
                  <div className="modal">
                      {this.props.children}
                      <div className="modal_footer">
                      <button onClick={this.props.onClose}> Close </button>
                      </div>
                  </div>
              </div>
          }
      </Fragment>

  );
    
  }
}


export default Modal;