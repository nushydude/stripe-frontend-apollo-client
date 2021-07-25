import gql from "graphql-tag";
import * as React from "react";
import { Mutation } from "react-apollo";
import { CardElement, injectStripe } from "react-stripe-elements";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
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
  state = { name: "", amount: 0, currency: "aud" };

  render() {
    console.log("state:", this.state);

    return (
      <Mutation mutation={CREATE_PURCHASE_MUTATION}>
        {(createPurchase) => (
          <div
            style={{
              margin: "0 auto",
              padding: 20,
              border: "1px solid #777",
              maxWidth: 400,
              borderRadius: 5,
              background: "#eee"
            }}
          >
            <Typography variant="h6" gutterBottom>
              Create Purchase Form
            </Typography>

            <form
              noValidate
              autoComplete="off"
              onSubmit={async (e) => {
                e.preventDefault();
                const { amount, currency, name } = this.state;

                let token;

                try {
                  token = await this.props.stripe.createToken({
                    name
                  });
                } catch (error) {
                  console.log("createToken error:", error.message);

                  return;
                }

                console.log("token:", token.token.id);

                const variables = {
                  input: {
                    amount: parseFloat(amount),
                    currency,
                    token: token.token.id
                  }
                };

                console.log("variables:", variables);

                try {
                  const createPurchaseResult = await createPurchase({
                    variables
                  });

                  console.log("createPurchaseResult:", createPurchaseResult);
                } catch (error) {
                  console.log("createPurchase error:", error);
                }
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="name">
                  <div>Name</div>

                  <input
                    style={{ width: "100%" }}
                    type="text"
                    required
                    id="name"
                    name="name"
                    autoComplete="name"
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label>
                  Amount
                  <div style={{ display: "flex" }}>
                    <select
                      style={{ marginRight: 10 }}
                      name="currency"
                      id="currency"
                      onChange={(e) =>
                        this.setState({ currency: e.target.value })
                      }
                    >
                      <option value="aud">AUD</option>
                      <option value="gbp">GBP</option>
                      <option value="usd">USD</option>
                    </select>

                    <input
                      style={{ width: "100%" }}
                      type="number"
                      required
                      id="amount"
                      name="amount"
                      onChange={(e) =>
                        this.setState({ amount: e.target.value })
                      }
                    />
                  </div>
                </label>
              </div>

              <div>
                <label>Card Details</label>

                <CardElement />
              </div>

              <Button
                variant="outlined"
                style={{ marginTop: 20 }}
                type="submit"
              >
                Pay
              </Button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}

export const Form = injectStripe(FormComponent);
