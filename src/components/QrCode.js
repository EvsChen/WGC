import React from 'react';
import PropTypes from 'proptypes';

class QrCode extends React.Component {
  static propTypes = {
    url: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  }

  componentDidUpdate(prevProps) {
    if (this.props.url && prevProps.url !== this.props.url) {
      const QRCode = window.QRCode;
      new QRCode('qr', {
        width: this.props.width || 200,
        height: this.props.height || 200,
      }).makeCode(this.props.url);
    }
  }

  render() {
    return <div id="qr"></div>;
  }
}

export default QrCode;
