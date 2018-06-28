import express from 'express';
import mpesa from 'mpesa-node';

const mpesaApi = new mpesa({
  consumerKey: 'xuzPSNGt2SigXELARtBfJOYhQAdUuKqy', // obtain this from daraja portal
  consumerSecret: 'qbCvhb4M0Kwgc10h', // get from daraja portal
  environment: 'sandbox'
});

const router = express.Router();

/*
When a customer makes payment to our till or Paybill number,
Mpesa will first send the transaction details on this validation URL.

N/B : Validation on the short code is not enabled by default. To enable validation,
apparently you have to write to safaricom : mpesabusiness@Safaricom.co.ke and 
cc APIfeedback@Safaricom.co.ke and ask them to activate the same.
*/

router.post('/validation', function(req, res) {
  /* 
Here we need to parse the json format and do the business logic e.g. 
we can use the Bill Reference number or mobile phone of the customer 
to search for a matching record on our database. 
*/

  // Expected Validation Response -- Sample
  /*
{
  "TransactionType":"",
  "TransID":"LGR219G3EY",
  "TransTime":"20170727104247",
  "TransAmount":"10.00",
  "BusinessShortCode":"600134",
  "BillRefNumber":"xyz",
  "InvoiceNumber":"",
  "OrgAccountBalance":"",
  "ThirdPartyTransID":"",
  "MSISDN":"254708374149",
  "FirstName":"John",
  "MiddleName":"Doe",
  "LastName":""
}
*/

  const success = true;

  if (success) {
    console.log('Transaction Accepted');
    return res.json({
      ResultCode: 0,
      ResultDesc: 'Success',
      ThirdPartyTransID: 0
    });
  }

  console.log('Transaction Rejected');
  return res.json({
    ResultCode: 1,
    ResultDesc: 'Failed',
    ThirdPartyTransID: 0
  });
});

/* The confirmation URL will be called back by Safaricom when 
a customer transaction is finalized on their side. Therefore, 
we need to get the json input from the Mpesa API and do something with the 
transaction details. Maybe save this data to the database ?
*/

router.post('/confirmation', function(req, res, next) {
  //Expected Confirmation Response -- Sample
  /*
{
  "TransactionType":"",
  "TransID":"LGR219G3EY",
  "TransTime":"20170727104247",
  "TransAmount":"10.00",
  "BusinessShortCode":"600134",
  "BillRefNumber":"xyz",
  "InvoiceNumber":"",
  "OrgAccountBalance":"49197.00",
  "ThirdPartyTransID":"1234567890",
  "MSISDN":"254708374149",
  "FirstName":"",
  "MiddleName":"",
  "LastName":""
}
*/
  return res.json({});
});

router.post('/register', async function(req, res) {
  /*
  N:B To test on local host, an http tunnelling client will be required to
  the http listener on your local host to make the services accessible over the internet.

  Ngrok and LocalTunnel are examples of http tunnelling clients that you could use to get a public IP 
  and make your local host accessible over the internet.

  Here I used Ngrok. Make sure you change the urls accordingly

  NB: You only need to register this once
  */
  try {
    const response = await mpesaApi.c2bRegister(
      'https://6bcc86e2.ngrok.io/api/mpesa/confirmation',
      'https://6bcc86e2.ngrok.io/api/mpesa/validation',
      601411,
      'Completed'
    );
    return res.json(response.data);
  } catch (err) {
    console.log('Error:', err);
    // return res.json(err);
  }
});

//  Initiate a C2B transaction between an end-user and a business (paybill or till number)
router.post('/simulate', async function(req, res) {
  const msisdn = 254708374149; // testing no. obtained from daraja portal
  const amount = 100; // amount to be sent
  const billRefNumber = Math.random()
    .toString(35)
    .substr(2, 7); // sample confirmation code
  const commandId = 'CustomerPayBillOnline';
  const shortCode = 601411; // Sample till/paybill no. Obtained from daraja portal

  try {
    const response = await mpesaApi.c2bSimulate(
      msisdn,
      amount,
      billRefNumber,
      commandId,
      shortCode
    );
    return res.json(response.data);
  } catch (err) {
    console.log('Error:', err);
    // return res.json(err);
  }
});

export default router;
