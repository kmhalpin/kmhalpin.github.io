import { Grid } from "@material-ui/core";
import GlslCanvas from "./components/GlslCanvas";
import Form from "./components/Form";
import { fragment, vertex, state, dispatch, form } from './shader/SimpleOperations'

function App() {
  return (
    <Grid container justifyContent="center" alignItems="center" spacing={2}>
      <Grid item>
        <GlslCanvas shader={{fragment, vertex}} />
      </Grid>
      <Grid item xs={10} sm={10} md={10} lg={6} xl={4}>
        <Form form={form} state={state} dispatch={dispatch} />
      </Grid>
    </Grid>
  );
}

export default App;
