import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const HOST = 'http://192.168.1.7:3000';

export default class ControllerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socketList: [],
    };
  }

  componentDidMount() {
    axios.get('/api/controller')
        .then(({data}) => {
          this.setState({
            socketList: data.socketList,
          });
        });
  }

  render() {
    return (
      <div>
        {
          this.state.socketList && this.state.socketList.map((id) => {
            const url = `/controller/${id}`;
            return <Link key={id} to={url}>{url}</Link>;
          })
        }
      </div>
    )
  }
}