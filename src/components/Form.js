import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const CREATE_PURCHASE_MUTATION = /* GraphQL */ gql`
  mutation CreatePurchase($input: CreatePurchaseInput!) {
    result: createPurchase(input: $input) {
      purchase {
        amount
      }
      error {
        message
      }
    }
  }
`;

class FormComponent extends React.Component {
  state = { name: '', amount: 0, currency: 'aud' };

  render() {
    return (
      <Mutation mutation={CREATE_PURCHASE_MUTATION}>
        {createPurchase => (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
              Create Purchase Form
            </Typography>

            <form
              noValidate
              autoComplete="off"
              onSubmit={async e => {
                e.preventDefault();
                const { amount, currency, name } = this.state;

                let token;

                try {
                  token = await this.props.stripe.createToken({
                    name,
                  });
                } catch (error) {
                  console.log('createToken error:', error.message);

                  return;
                }

                console.log('token:', token.token.id);

                const variables = {
                  input: {
                    amount: parseFloat(amount),
                    currency,
                    token: token.token.id,
                  },
                };

                console.log('variables:', variables);

                try {
                  const createPurchaseResult = await createPurchase({
                    variables,
                  });

                  console.log('createPurchaseResult:', createPurchaseResult);
                } catch (error) {
                  console.log('createPurchase error:', error);
                }
              }}
            >
              <TextField
                required
                id="name"
                name="name"
                label="Name"
                fullWidth
                autoComplete="name"
                onChange={e => this.setState({ name: e.target.value })}
              />

              <TextField
                required
                id="amount"
                name="amount"
                label="Amount"
                fullWidth
                autoComplete="amount"
                onChange={e => this.setState({ amount: e.target.value })}
              />

              <FormControl>
                <InputLabel htmlFor="currency">Age</InputLabel>
                <Select
                  value={this.state.currency}
                  onChange={e => this.setState({ name: e.target.value })}
                  inputProps={{
                    name: 'currency',
                    id: 'currency',
                  }}
                >
                  <MenuItem value="aud">AUD</MenuItem>
                  <MenuItem value="gbp">GBP</MenuItem>
                  <MenuItem value="usd">USD</MenuItem>
                </Select>
              </FormControl>

              <label>Credit Card Details</label>
              <CardElement />

              <button type="submit">Pay</button>
            </form>
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}

export const Form = injectStripe(FormComponent);
