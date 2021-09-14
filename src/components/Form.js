import { useState } from "react";
import { withRedux } from "../redux";

function Form(props) {
  const [state, setState] = useState(props.state);

  props.store.dispatch({
    type: 'UPDATE',
    ...props.dispatch(state, props.store.getState())
  });

  return props.form(state, setState);
}

export default withRedux(Form);