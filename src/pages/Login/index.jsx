import React from 'react';
import {ResponsiveGrid} from '@alifd/next';
import LoginBlock from './components/LoginBlock';

const {Cell} = ResponsiveGrid;

class Login extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      value: {}
    };

  }
  render() {
    return  (
      <ResponsiveGrid gap={20}>
        <Cell colSpan={12}>
          <LoginBlock  {...this.props}/>
        </Cell>
      </ResponsiveGrid>
    )
  }
}

export default Login;
