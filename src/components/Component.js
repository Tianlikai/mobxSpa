import React from 'react';
import autoBind from 'utils/autoBind'; // eslint-disable-line

export default class Component extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return null;
  }
}
