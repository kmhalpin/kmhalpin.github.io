import React from 'react';

const ReduxContext = React.createContext(null);

export const withRedux = Component => props => (
  <ReduxContext.Consumer>
    {store => <Component {...props} store={store} />}
  </ReduxContext.Consumer>
);

export default ReduxContext;
