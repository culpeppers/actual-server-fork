import express from 'express';
import { inspect } from 'util';
import https from 'https';
import { SecretName, secretsService } from '../services/secrets-service.js';

import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': SecretName.plaid_clientID,
      'PLAID-SECRET': SecretName.plaid_secret,
    },
  },
});
const plaidClient = new PlaidApi(configuration);

const app = express();
export { app as handlers };
app.use(express.json());

app.post('/createlinktoken', async (req, res) => {
//   let configured = false;

  try {
    const response = await plaidClient.linkTokenCreate(
      {
        user: {
          client_user_id: 'actual-user-id',
        },
        client_name: 'Actual Budget',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      },
      (error, linkTokenCreateResponse) => {
        if (error != null) {
          console.error(error);
          return res.json({
            error: error,
          });
        }
        res.json(linkTokenCreateResponse);
      },
    );
    const linkToken = response.data.link_token;
  } catch (error) {
    console.error(error);
  }

//   res.send({
//     status: 'ok',
//     data: {
//       configured: configured,
//     },
//   });
});
