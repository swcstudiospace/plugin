# Affirm payments

Source: https://docs.stripe.com/payments/affirm.md

# Affirm payments
Offer your US, Canadian, and United Kingdom customers flexible financing while getting paid upfront with Affirm.
[Affirm](https://www.affirm.com/) is a popular payment method in the US, Canada, and the United Kingdom that gives your customers a way to split purchases over a series of payments. Pay in 4 interest-free installments or in monthly installments of up to 36 months.
Payment method family: Buy Now, Pay Later
Usability: Single-use
Access type: Instant provisional access
Payment confirmation timing: Immediate
Settlement timing: Up to 2 business days (T+2)
Pricing: https://stripe.com/en-us/pricing/local-payment-methods#affirm
## Eligibility and availability
### Account eligibility
Business location: CA, US; Preview: GB
Account type: ✓ Merchant, ✓ Platform/Marketplace (Connect)
Business model: ✗ B2B, ✓ B2C
Business category: View list of prohibited and restricted business categories
The following categories are prohibited from using Affirm in all countries or are subject to additional requirements.
- Business to business services
- Home improvement services, including contractors and special trade contractors
- Titled goods and auto loans, including entire cars, boats, and other motor vehicles (parts and services allowed)
- Professional services (including legal, consulting, and accounting)
- NFTs
- Pre-orders
Healthcare services are approved to use Affirm, however they’re subject to additional requirements. For the complete list of prohibited businesses and additional requirements, see [the Affirm Payment Terms](https://stripe.com/legal/affirm).
Your account might be reviewed after activation to confirm eligibility. In addition to meeting the criteria above, you must also provide a website that meets the following requirements in addition to the [Stripe account activation requirements](https://support.stripe.com/questions/business-website-for-account-activation-faq):
- Must be publicly accessible.
- Must display pricing in the local currency of the customer.
You can contact [Stripe support](https://support.stripe.com/) to appeal any Affirm capability restrictions.
Review the list of \*merchant category codes\* (A Merchant Category Code (MCC) is a four-digit number that classifies the type of goods or services a business offers) that are prohibited or restricted for Affirm.
- \*\*Prohibited\*\* MCCs are not supported by this payment method.
- \*\*Restricted\*\* MCCs may be supported, but require additional information at account creation.
| MCC | Description | Type |
| --- | --- | --- |
| 0780 | Landscaping Services | Restricted |
| 1520 | General Services | Restricted |
| 1711 | Heating, Plumbing, A/C | Restricted |
| 1731 | Electrical Services | Restricted |
| 1740 | Masonry, Stonework, and Plaster | Restricted |
| 1750 | Carpentry Services | Restricted |
| 1761 | Roofing/Siding, Sheet Metal | Restricted |
| 1771 | Concrete Work Services | Restricted |
| 1799 | Special Trade Services | Restricted |
| 4723 | TUI Travel - Germany | Prohibited |
| 4761 | OTA / Travel Package | Prohibited |
| 4815 | Software | Prohibited |
| 4829 | Money Orders - Wire Transfers | Prohibited |
| 4900 | Utilities | Prohibited |
| 5021 | Office and Commercial Furniture | Prohibited |
| 5046 | Commercial Equipment (Not Elsewhere Classified) | Prohibited |
| 5047 | Medical, Dental, Ophthalmic, and Hospital Equipment and Supplies | Prohibited |
| 5131 | Piece Goods, Notions, and Other Dry Goods | Prohibited |
| 5137 | Men's Women's and Children's Uniforms and Commercial Clothing | Prohibited |
| 5139 | Commercial Footwear | Prohibited |
| 5172 | Petroleum and Petroleum Products | Prohibited |
| 5262 | Marketplaces | Restricted |
| 5271 | Mobile Home Dealers | Restricted |
| 5542 | Automated Fuel Dispensers | Prohibited |
| 5551 | Boat Dealers | Restricted |
| 5552 | Electric Vehicle Charging | Prohibited |
| 5561 | Motorcycle Shops, Dealers | Restricted |
| 5571 | Motorcycle Shops and Dealers | Restricted |
| 5592 | Motor Homes Dealers | Restricted |
| 5598 | Snowmobile Dealers | Restricted |
| 5723 | Software | Prohibited |
| 5933 | Pawn Shops | Prohibited |
| 5935 | Wrecking and Salvage Yards | Prohibited |
| 5960 | Direct Marketing - Insurance Services | Prohibited |
| 5961 | Software | Restricted |
| 5963 | Door-To-Door Sales | Restricted |
| 5964 | Direct Marketing - Catalog Merchant | Restricted |
| 5966 | Direct Marketing - Outbound Telemarketing | Prohibited |
| 5967 | Adult Content and Services | Prohibited |
| 5968 | Direct Marketing - Subscription | Restricted |
| 5969 | Direct Marketing - Other | Prohibited |
| 5972 | Stamp and Coin Stores | Prohibited |
| 5983 | Fuel Dealers (Non Automotive) | Prohibited |
| 5993 | Cigar Stores and Stands | Prohibited |
| 6010 | Manual Cash Disburse | Prohibited |
| 6011 | Financial Service | Prohibited |
| 6012 | Financial Institutions | Prohibited |
| 6050 | Software | Prohibited |
| 6051 | Cryptocurrency exchanges and wallets | Prohibited |
| 6211 | Security Brokers/Dealers | Prohibited |
| 6300 | Insurance Underwriting, Premiums | Prohibited |
| 6381 | Software | Prohibited |
| 6399 | Software | Prohibited |
| 6529 | Software | Prohibited |
| 6530 | Software | Prohibited |
| 6531 | Software | Prohibited |
| 6532 | Software | Prohibited |
| 6533 | Software | Prohibited |
| 6534 | Software | Prohibited |
| 6535 | Software | Prohibited |
| 6536 | Software | Prohibited |
| 6537 | Software | Prohibited |
| 6538 | Software | Prohibited |
| 6540 | Non-FI, Stored Value Card Purchase/Load | Prohibited |
| 7276 | Tax Preparation Services | Restricted |
| 7277 | Counseling Services | Restricted |
| 7297 | Massage Parlors | Restricted |
| 7311 | Advertising Services | Prohibited |
| 7321 | Credit Reporting Agencies | Prohibited |
| 7322 | Financial Service | Prohibited |
| 7332 | Software | Prohibited |
| 7333 | Commercial Photography, Art and Graphics | Prohibited |
| 7361 | Employment/Temp Agencies | Prohibited |
| 7372 | Computer Programming | Prohibited |
| 7375 | Information Retrieval Services | Prohibited |
| 7392 | Consulting, Public Relations | Prohibited |
| 7393 | Detective Agencies | Prohibited |
| 7399 | Miscellaneous Business Services | Prohibited |
| 7511 | Truck Stops | Prohibited |
| 7524 | Software | Prohibited |
| 7778 | Software | Prohibited |
| 7800 | Government-Owned Lotteries (US Region only) | Prohibited |
| 7801 | Government Licensed On-line Casinos (On-Line Gambling) | Prohibited |
| 7802 | Government-Licensed Horse/Dog Racing | Prohibited |
| 7829 | Picture/Video Production | Prohibited |
| 7995 | Betting/Casino Gambling | Prohibited |
| 8111 | Legal Services, Attorneys | Restricted |
| 8220 | Colleges, Universities | Prohibited |
| 8241 | Correspondence Schools | Restricted |
| 8244 | Business/Secretarial Schools | Restricted |
| 8249 | Vocational/Trade Schools | Restricted |
| 8299 | Educational Services | Restricted |
| 8398 | Charitable and Social Service Organizations - Fundraising | Prohibited |
| 8651 | Political Organizations | Prohibited |
| 8661 | Religious Organizations | Prohibited |
| 8699 | Membership Organizations | Prohibited |
| 8734 | Testing Laboratories | Restricted |
| 8911 | Architectural/Surveying Services | Restricted |
| 8931 | Accounting/Bookkeeping Services | Restricted |
| 9211 | Court Costs | Prohibited |
| 9222 | Fines - Government Administrative Entities | Prohibited |
| 9223 | Bail and Bond Payments | Prohibited |
| 9311 | Tax Payments - Government Agencies | Prohibited |
| 9399 | Government Services (Not Elsewhere Classified) | Prohibited |
| 9401 | Software | Prohibited |
| 9402 | Postal Services - Government Only | Prohibited |
| 9405 | US Federal Govt Agencies or Departments | Prohibited |
| 9406 | Government-Owned Lotteries (Non-US region) | Prohibited |
| 9700 | Software | Prohibited |
| 9701 | Software | Prohibited |
| 9702 | Emergency Services (GCAS) | Prohibited |
| 9751 | Software | Prohibited |
| 9752 | Software | Prohibited |
| 9754 | Lodging - Hotels/Motels/Resorts (Continued) | Prohibited |
| 9950 | Intra-Company Purchases | Prohibited |
Stripe accounts in the following countries can accept Affirm payments with local currency settlement.
AMER: CA, US
EMEA: [Preview] GB
Customers in the following countries can use Affirm.
AMER: CA, US
EMEA: [Preview] GB
### Payment support
Buyer location: CA, US; Preview: GB
Presentment currency: USD, CAD
Preview currencies: GBP
Geographic coverage: ✓ Domestic, ✗ Crossborder
Transaction limits: Minimum amount: 35.00 USD
Maximum amount: 30,000.00 USD
> Affirm only supports domestic transactions, meaning you can only sell to customers in the same country as your business. If you’re using [Dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods.md), Stripe handles a customer’s payment method eligibility automatically. If you use [payment\_method\_types](https://docs.stripe.com/api/payment\_intents/object.md#payment\_intent\_object-payment\_method\_types), you must either configure your integration so that it only presents Affirm to eligible customers, or use dynamic payment methods.
### Payment options
### US
| Payment option | Description | Amount range |
| --- | --- | --- |
| Pay in 30 | Single payment in 30 days, interest-free | $35–$50 |
| Pay in 4 | 4 interest-free biweekly payments | $50–$700 |
| Monthly installments | 3 to 36 months, which might include interest | $100–$30,000 |
### GB
| Payment option | Description | Amount range |
| --- | --- | --- |
| Pay in 3 | 3 interest-free biweekly payments | £50–£700 |
| Monthly installments | 3 to 36 months, which might include interest | £100–£30,000 |
### CA
| Payment option | Description | Amount range |
| --- | --- | --- |
| Pay in 4 | 4 interest-free biweekly payments | CA$50–CA$700 |
| Monthly installments | 3 to 36 months, which might include interest | CA$100–CA$30,000 |
### Financing packages
Depending on the cart order size, Affirm presents customers with Pay in 30, Pay in 4, or monthly installment offers. Term lengths and cart ranges are determined by Affirm and might change at their discretion. Regardless of the underlying payment option selected, Stripe makes the full amount of the funds (minus fees) available to you upfront and Affirm collects the purchase amount from your customer, who repays Affirm directly.
Affirm supports two \*financing packages\* (A financing package is a configuration on your Stripe account to set the Affirm payment option terms for your buyers): Standard and Enhanced. By default, businesses get the Standard financing package. Businesses with Stripe Dashboard access can view or change their financing package on the [Payment methods settings page](https://dashboard.stripe.com/login?redirect=%2Fsettings%2Fpayment\_methods), except for connected accounts and platforms. Financing packages are identical across the available countries.
#### Standard
| Order minimum (USD, CAD, and GBP) | Order maximum (USD, CAD, and GBP) | Available payment options |
| --- | --- | --- |
| 35 (USD only) | 49.99 (USD only) | - Pay in 30 days - 0% APR (USD only) |
| 50 | 99.99 | - Pay in 4 - 0% APR
- Pay in 3 - 0% APR (UK only) |
| 100 | 499.99 | - Pay in 4 - 0% APR
- Pay in 3 - 0% APR (UK only)
- 6 months - interest bearing
- 12 months - interest bearing |
| 500 | 699.99 | - 3 months - 0% APR
- 6 months - interest bearing
- 12 months - interest bearing |
| 700 | 1,699.99 | - 6 months - 0% APR
- 12 months - interest bearing
- 18 months - interest bearing |
| 1,700 | 30,000 | - 6 months - 0% APR
- 12 months - interest bearing
- 36 months - interest bearing |
Rates vary from 10% to 36% APR, subject to eligibility. For example, a 800 USD purchase might cost 72.12 USD per month over 12 months at 15% APR. See [Affirm lending terms](http://affirm.com/disclosures) for more details. Platforms don’t qualify for the pay in 30 and monthly installments with 0% APR plans.
#### Enhanced
| Order minimum (USD, CAD, and GBP) | Order maximum (USD, CAD, and GBP) | Available payment options |
| --- | --- | --- |
| 35 (USD only) | 49.99 (USD only) | - Pay in 30 days - 0% APR (USD only) |
| 50 | 99.99 | - Pay in 4 - 0% APR |
| 100 | 499.99 | - Pay in 4 - 0% APR
- 6 months - 0% APR
- 12 months - interest bearing |
| 500 | 699.99 | - 3 months - 0% APR
- 6 months - 0% APR
- 12 months - interest bearing |
| 700 | 1,699.99 | - 6 months - 0% APR
- 12 months - 0% APR
- 18 months - interest bearing |
| 1,700 | 30,000 | - 6 months - 0% APR
- 12 months - 0% APR
- 36 months - interest bearing |
Rates vary from 10% to 36% APR, subject to eligibility. For example, a 800 USD purchase might cost 72.12 USD per month over 12 months at 15% APR. See [Affirm lending terms](http://affirm.com/disclosures) for more details. Platforms don’t qualify for the pay in 30 and monthly installments with 0% APR plans.
### Customer country filtering
Customer country filtering applies when you enable a dynamic payment method on the Payment Element or Checkout Session. Affirm only displays as a payment method option if the customer’s country is supported.
We determine the customer’s country in the following priority order:
1. Shipping address country: The two-letter country code, not the full name of the country.
2. Geocoded country: The country based on the client-side IP address.
## Capabilities
Recurring payments: ✗ Not supported
Payment authorizations:
✗ Extended authorizations
✗ Flexible extended authorizations
✗ Incremental authorizations
✗ Decremental authorizations
✗ Re-authorizations
Payment captures:
✓ Manual capture
✗ Partial capture
✗ Multi-capture
✗ Over-capture
Refunds:
✓ Partial refunds
✓ Full refunds
Submission window: 120 days
Processing time: 2 days
Disputes:
✗ Partial disputes
✓ Full disputes
### Refunds
You have up to 120 days from the original payment to submit a refund using the [Dashboard](https://dashboard.stripe.com/payments) or [Refunds API.](https://docs.stripe.com/api/refunds/create.md) This is the maximum the payment method allows-your return policy determines what you offer customers.
Refunds for Affirm payments are asynchronous and take up to 2 days to complete. Affirm refunds can’t be canceled.
#### Refund process
Affirm refunds are never processed as reversals. When you issue a refund, Affirm cancels any remaining scheduled payments and returns any amounts the customer has already paid, minus any interest paid. The customer sees the update reflected in their Affirm account.
#### Tracking refunds
You can view refund status in the [Dashboard](https://dashboard.stripe.com/payments). Open the payment and click \*\*View Details\*\* on the refund entry, or [retrieve the Refund object](https://docs.stripe.com/api/refunds/retrieve.md) and check its `status` field. Stripe also notifies you of the final refund status using the `refund.updated` or `refund.failed` \*webhook\* (A webhook is a real-time push notification sent to your application as a JSON payload through HTTPS requests) event. When a refund succeeds, the status of the [Refund](https://docs.stripe.com/api/refunds/object.md) object transitions to `succeeded`. If a refund fails, the status transitions to `failed`, Stripe returns the amount to your Stripe balance, and you must arrange an alternative way to provide your customer with a refund.
### Disputes
There’s no set time limit for customers to file Affirm disputes.
Affirm payments can only be disputed once.
#### Dispute process
1. \*\*Dispute opened\*\*: Affirm opens a dispute. Stripe immediately withholds the disputed amount from your balance. You have 15 calendar days to submit evidence.
2. \*\*Decision\*\*: Affirm reviews your evidence and issues a final decision within 60 calendar days of dispute creation.
#### Dispute notifications
When a Affirm dispute is opened, Stripe notifies you through:
- Email
- The [Stripe Dashboard](https://dashboard.stripe.com/disputes)
- A [`charge.dispute.created`](https://docs.stripe.com/api/events/types.md#event\_types-charge.dispute.created) webhook event
The dispute reason is available in the Dashboard and in the `reason` field of the [Dispute object](https://docs.stripe.com/api/disputes/object.md). The evidence submission deadline is available in the Dashboard and in the `evidence\_due\_by` field of the Dispute object.
#### Responding to disputes
You have 15 calendar days from dispute creation to submit evidence.
We request that you upload compelling evidence proving that you fulfilled the purchase order [using the Stripe Dashboard](https://docs.stripe.com/disputes/responding.md#respond). This evidence can include the:
- Tracking ID
- Shipping date
- Record of purchase for intangible goods, such as IP address or email receipt
- Record of purchase for services or physical goods, such as phone number or proof of receipt
- Record of refund (for purchases you’ve already refunded)
You can submit evidence and manage Affirm disputes in the [Dashboard](https://dashboard.stripe.com/disputes) or programmatically using the [Disputes API](https://docs.stripe.com/api/disputes/update.md). In the Dashboard, go to the \*\*Needs Response\*\* tab, click the disputed payment, then click \*\*Counter dispute\*\* to submit your evidence, or \*\*Accept dispute\*\* to accept the loss. To submit evidence through the API, upload supporting files using the [Files API](https://docs.stripe.com/api/files/create.md) and include the returned file IDs when you update the [Dispute Evidence object](https://docs.stripe.com/api/disputes/update.md).
#### Dispute outcomes
If Affirm resolves the dispute in your favor, Stripe returns the disputed amount to your Stripe balance.
If they rule in favor of the customer, the balance charge becomes permanent.
#### Fraud and liability
Customers must authenticate Affirm payments by logging into their Affirm account. This requirement helps reduce the risk of fraud or unrecognized payments. While Affirm covers losses incurred from customer fraud, Stripe might contact you on behalf of Affirm and request to stop or pause shipment before any losses are incurred. Comply promptly with these requests.
## Stripe product support
Products:
✓ Checkout
✓ Payment Links
✓ Payment Element
✗ Express Checkout Element
✗ Mobile Payment Element
✗ Managed Payments
✗ Billing
✓ Invoicing
✗ Adaptive Pricing
✓ Customer Portal
✗ Radar
✓ Terminal
✓ Connect
APIs:
✓ PaymentIntents
✗ PaymentIntents with setup\_future\_usage
✗ SetupIntents
✓ CheckoutSessions
### Affirm branding
Use the [Payment Method Messaging Element](https://docs.stripe.com/elements/payment-method-messaging.md) on your site to let customers know that you offer Affirm ahead of checkout. You must comply with Affirm’s [marketing compliance guides](https://docs.affirm.com/developers/docs/compliance\_and\_guidelines) and use the Affirm [guide](https://businesshub.affirm.com/hc/en-us/articles/10653174159636-Affirm-Marketing-Compliance-Guides) that relates to the Affirm payment options you offer your customers.
## Customer experience
#### 1. Select payment method
The customer selects Affirm at checkout.
#### 2. Redirect to Affirm
On desktop, the customer is redirected to Affirm site, where they create or log in to their account. On mobile, the customer is redirected to the Affirm app if they have it installed, or the Affirm site.
#### 3. Select a plan and authorize
The customer selects a payment plan and accepts the terms of the repayment plan within 12 hours.
#### 4. Payment Complete
The customer is returned to your site after the payment is authorized. Affirm collects repayment directly from the customer over time.
### Customer emails
After a customer uses Affirm to make a purchase, Affirm emails the customer with updates. These updates include information about the following events:
- Affirm confirms or denies a loan. Affirm sends these updates when the PaymentIntent succeeds or when Affirm denies the loan.
- A [refund](https://docs.stripe.com/refunds.md) completes.
- A payment is canceled, which results in Affirm canceling the loan.
- The customer completes a payment as part of the payment plan.
Affirm only sends email updates about Affirm’s loan issuance to your customer. Continue to separately send emails related to the purchase such as order confirmation and shipping updates.
### Transaction identifiers
After a customer completes an Affirm payment, the transactions that appear on the customer’s bank statement shows \*Affirm\* along with a merchant identifier that Affirm derives from your registered business information or the statement descriptor suffix you configured.
Set a custom [statement descriptor](https://docs.stripe.com/payments/payment-intents.md#dynamic-statement-descriptor) on the PaymentIntent before confirming the payment. If you don’t set one, the descriptor defaults to the [account level statement descriptor](https://docs.stripe.com/get-started/account/statement-descriptors.md). For connect scenarios, learn more about how [statement descriptors are set with Connect](https://docs.stripe.com/connect/statement-descriptors.md).
After the payment completes, expand `latest\_charge` on the PaymentIntent to retrieve the Affirm transaction ID from `latest\_charge.payment\_method\_details.affirm.transaction\_id`. Share it with customers to help them locate the payment in their Affirm account or when contacting Affirm support.
## Enable Affirm
If you use our front-end products, you can enable Affirm directly from your [payment method settings](https://dashboard.stripe.com/settings/payment\_methods). Stripe then automatically determines the most relevant payment methods to display to your customers.
If your integration requires manually listing payment methods, learn how to [manually configure Affirm as a payment](https://docs.stripe.com/payments/affirm/accept-a-payment.md).
