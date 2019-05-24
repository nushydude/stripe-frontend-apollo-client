import * as React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { Form } from './Form';

export function App() {
  return (
    <StripeProvider apiKey="pk_test_lxc27AhWHDYnTehbwADA9UJ700Lyr0YbQX">
      <Elements>
        <Form />
      </Elements>
    </StripeProvider>
  );
}
