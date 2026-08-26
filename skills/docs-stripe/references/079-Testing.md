# Testing

Source: https://docs.stripe.com/testing.md

# Testing
Simulate payments to test your integration.
Test your integration in a \*sandbox\* (A sandbox is an isolated test environment that allows you to test Stripe functionality in your account without affecting your live integration. Use sandboxes to safely experiment with new features and changes) by simulating transactions with test values—these transactions don’t move funds.
You can access your sandboxes using the account picker in the [Dashboard](https://dashboard.stripe.com/sandboxes).
Test cards act as “fake” credit cards, and allow you to simulate the following scenarios:
- Successful payments by [card brand](https://docs.stripe.com/testing.md#cards) or [country](https://docs.stripe.com/testing.md#international-cards)
- Card errors due to [declines](https://docs.stripe.com/testing.md#declined-payments), [fraud](https://docs.stripe.com/testing.md#fraud-prevention), or [invalid data](https://docs.stripe.com/testing.md#trigger-an-error-with-invalid-data)
- [Disputes](https://docs.stripe.com/testing.md#disputes) and [refunds](https://docs.stripe.com/testing.md#refunds)
- Authentication with [3D Secure](https://docs.stripe.com/testing.md#regulatory-cards) and [PINs](https://docs.stripe.com/testing.md#terminal)
You can also test non-card payments in a sandbox. Non-card payments are payment methods that aren’t credit or debit cards. Stripe supports various non-card payment options, such as digital wallets and bank transfers. [Each payment method](https://docs.stripe.com/testing.md#non-card-payments) has its own special values.
Don’t use testing environments to load test your integration because you might hit [rate limits](https://docs.stripe.com/testing.md#rate-limits). To load test your integration, see [load testing](https://docs.stripe.com/rate-limits.md#load-testing).
## How to use test cards
When you work with a test card, use [test API keys](https://docs.stripe.com/keys.md#obtain-api-keys) in all API calls. This is true whether you’re serving a payment form to test interactively or writing test code.
> #### Don't use real card details
>
> Don’t use real card details. The [Stripe Services Agreement](https://stripe.com/legal/ssa#1-your-stripe-account) prohibits testing in live mode using real payment method details. Use your test API keys and the card numbers below.
### Testing interactively
When testing interactively, use a card number, such as [4242 4242 4242 4242](https://docs.stripe.com/testing.md?testing-method=card-numbers#visa). Enter the card number in the Dashboard or in any payment form.
- Use a valid future date, such as \*\*12/34\*\*.
- Use any three-digit CVC (four digits for American Express cards).
- Use any value you like for other form fields.
### Test code
When writing test code, use a `PaymentMethod` such as [pm\_card\_visa](https://docs.stripe.com/testing.md?testing-method=payment-methods#visa) instead of a card number. We don’t recommend using card numbers directly in API calls or server-side code, even in testing environments. If you use them, your code might not be PCI-compliant when you go live. By default, a `PaymentMethod` isn’t attached to a \*Customer\* (Customer objects represent customers of your business. They let you reuse payment methods and give you the ability to track multiple payments).
```curl
curl https://api.stripe.com/v1/payment\_intents \
-u "<>:" \
-d amount=500 \
-d currency=gbp \
-d payment\_method=pm\_card\_visa \
-d "payment\_method\_types[]=card"
```
When you’re ready to take your integration live, replace your test publishable and secret [API keys](https://docs.stripe.com/keys.md) with live ones.
You can’t process live payments if your integration is still using your test API keys. Store live API keys in a secrets vault or environment variables. Don’t store keys in source code or configuration files checked into version control. To learn how to use live keys safely, see [Best practices for managing secret API keys](https://docs.stripe.com/keys-best-practices.md).
## Simulate a payment by card brand
To simulate a successful payment for a specific card brand, use test cards from the following list.
Cross-border fees are assessed based on the country of the card issuer. Cards where the issuer country isn’t the US (such as JCB and UnionPay) might be subject to a cross-border fee, even in testing environments.
#### Card numbers
| Brand | Number | CVC | Date |
| --- | --- | --- | --- |
| Visa | 4242424242424242 | Any 3 digits | Any future date |
| Visa (debit) | 4000056655665556 | Any 3 digits | Any future date |
| Mastercard | 5555555555554444 | Any 3 digits | Any future date |
| Mastercard (2-series) | 2223003122003222 | Any 3 digits | Any future date |
| Mastercard (debit) | 5200828282828210 | Any 3 digits | Any future date |
| Mastercard (prepaid) | 5105105105105100 | Any 3 digits | Any future date |
| American Express | 378282246310005 | Any 4 digits | Any future date |
| American Express | 371449635398431 | Any 4 digits | Any future date |
| Discover | 6011111111111117 | Any 3 digits | Any future date |
| Discover | 6011000990139424 | Any 3 digits | Any future date |
| Discover (debit) | 6011981111111113 | Any 3 digits | Any future date |
| Diners Club | 3056930009020004 | Any 3 digits | Any future date |
| Diners Club (14-digit card) | 36227206271667 | Any 3 digits | Any future date |
| BCcard and DinaCard | 6555900000604105 | Any 3 digits | Any future date |
| JCB | 3566002020360505 | Any 3 digits | Any future date |
| UnionPay | 6200000000000005 | Any 3 digits | Any future date |
| UnionPay (debit) | 6200000000000047 | Any 3 digits | Any future date |
| UnionPay (19-digit card) | 6205500000000000004 | Any 3 digits | Any future date |
#### PaymentMethods
| Brand | PaymentMethod |
| --- | --- |
| Visa | `pm\_card\_visa` |
| Visa (debit) | `pm\_card\_visa\_debit` |
| Mastercard | `pm\_card\_mastercard` |
| Mastercard (debit) | `pm\_card\_mastercard\_debit` |
| Mastercard (prepaid) | `pm\_card\_mastercard\_prepaid` |
| American Express | `pm\_card\_amex` |
| Discover | `pm\_card\_discover` |
| Diners Club | `pm\_card\_diners` |
| JCB | `pm\_card\_jcb` |
| UnionPay | `pm\_card\_unionpay` |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Brand | Token |
| --- | --- |
| Visa | `tok\_visa` |
| Visa (debit) | `tok\_visa\_debit` |
| Mastercard | `tok\_mastercard` |
| Mastercard (debit) | `tok\_mastercard\_debit` |
| Mastercard (prepaid) | `tok\_mastercard\_prepaid` |
| American Express | `tok\_amex` |
| Discover | `tok\_discover` |
| Diners Club | `tok\_diners` |
| JCB | `tok\_jcb` |
| UnionPay | `tok\_unionpay` |
Most Cartes Bancaires and eftpos cards are co-branded with either Visa or Mastercard. The test cards in the following table simulate successful payments with co-branded cards.
#### Card numbers
| Brand/Co-brand | Number | CVC | Date |
| --- | --- | --- | --- |
| Cartes Bancaires/Visa | 4000002500001001 | Any 3 digits | Any future date |
| Cartes Bancaires/Mastercard | 5555552500001001 | Any 3 digits | Any future date |
| eftpos Australia/Visa | 4000050360000001 | Any 3 digits | Any future date |
| eftpos Australia/Mastercard | 5555050360000080 | Any 3 digits | Any future date |
#### PaymentMethods
| Brand | PaymentMethod |
| --- | --- |
| Cartes Bancaires/Visa | `pm\_card\_visa\_cartesBancaires` |
| Cartes Bancaires/Mastercard | `pm\_card\_mastercard\_cartesBancaires` |
| eftpos Australia/Visa | `pm\_card\_visa\_debit\_eftposAuCoBranded` |
| eftpos Australia/Mastercard | `pm\_card\_mastercard\_debit\_eftposAuCoBranded` |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Brand | Token |
| --- | --- |
| Cartes Bancaires/Visa | `tok\_visa\_cartesBancaires` |
| Cartes Bancaires/Mastercard | `tok\_mastercard\_cartesBancaires` |
| eftpos Australia/Visa | `tok\_visa\_debit\_eftposAuCoBranded` |
| eftpos Australia/Mastercard | `tok\_mastercard\_debit\_eftposAuCoBranded` |
## Simulate a payment by country
To simulate successful payments from specific countries, use test cards from the following sections.
> \*Strong Customer Authentication\* (Strong Customer Authentication (SCA) is a regulatory requirement in effect as of September 14, 2019, that impacts many European online payments. It requires customers to use two-factor authentication like 3D Secure to verify their purchase) regulations require \*3D Secure\* (3D Secure (3DS) provides an additional layer of authentication for credit card transactions that protects businesses from liability for fraudulent card payments) authentication for online payments within the \*European Economic Area\* (The European Economic Area is a regional single market with free movement of labor, goods, and capital. It encompasses the European Union member states and three additional states that are part of the European Free Trade Association). The test cards in the Europe and Middle East section simulate a payment that succeeds without authentication. We also recommend testing authentication scenarios using [3D Secure test cards](https://docs.stripe.com/testing.md#regulatory-cards).
#### Card numbers
| Country | Number | Brand |
| --- | --- | --- |
| \*\*AMERICAS\*\* |
| United States (US) | 4242424242424242 | Visa |
| Argentina (AR) | 4000000320000021 | Visa |
| Brazil (BR) | 4000000760000002 | Visa |
| Canada (CA) | 4000001240000000 | Visa |
| Chile (CL) | 4000001520000001 | Visa |
| Colombia (CO) | 4000001700000003 | Visa |
| Costa Rica (CR) | 4000001880000005 | Visa |
| Ecuador (EC) | 4000002180000000 | Visa |
| Mexico (MX) | 4000004840008001 | Visa |
| Mexico (MX) | 5062210000000009 | Carnet |
| Panama (PA) | 4000005910000000 | Visa |
| Paraguay (PY) | 4000006000000066 | Visa |
| Peru (PE) | 4000006040000068 | Visa |
| Uruguay (UY) | 4000008580000003 | Visa |
| \*\*EUROPE and MIDDLE EAST\*\* |
| United Arab Emirates (AE) | 4000007840000001 | Visa |
| United Arab Emirates (AE) | 5200007840000022 | Mastercard |
| Austria (AT) | 4000000400000008 | Visa |
| Belgium (BE) | 4000000560000004 | Visa |
| Bulgaria (BG) | 4000001000000000 | Visa |
| Belarus (BY) | 4000001120000005 | Visa |
| Croatia (HR) | 4000001910000009 | Visa |
| Cyprus (CY) | 4000001960000008 | Visa |
| Czech Republic (CZ) | 4000002030000002 | Visa |
| Denmark (DK) | 4000002080000001 | Visa |
| Estonia (EE) | 4000002330000009 | Visa |
| Finland (FI) | 4000002460000001 | Visa |
| France (FR) | 4000002500000003 | Visa |
| Germany (DE) | 4000002760000016 | Visa |
| Gibraltar (GI) | 4000002920000005 | Visa |
| Greece (GR) | 4000003000000030 | Visa |
| Hungary (HU) | 4000003480000005 | Visa |
| Ireland (IE) | 4000003720000005 | Visa |
| Italy (IT) | 4000003800000008 | Visa |
| Latvia (LV) | 4000004280000005 | Visa |
| Liechtenstein (LI) | 4000004380000004 | Visa |
| Lithuania (LT) | 4000004400000000 | Visa |
| Luxembourg (LU) | 4000004420000006 | Visa |
| Malta (MT) | 4000004700000007 | Visa |
| Netherlands (NL) | 4000005280000002 | Visa |
| Norway (NO) | 4000005780000007 | Visa |
| Poland (PL) | 4000006160000005 | Visa |
| Portugal (PT) | 4000006200000007 | Visa |
| Romania (RO) | 4000006420000001 | Visa |
| Saudi Arabia (SA) | 4000006820000007 | Visa |
| Slovenia (SI) | 4000007050000006 | Visa |
| Slovakia (SK) | 4000007030000001 | Visa |
| Spain (ES) | 4000007240000007 | Visa |
| Sweden (SE) | 4000007520000008 | Visa |
| Switzerland (CH) | 4000007560000009 | Visa |
| United Kingdom (GB) | 4000008260000000 | Visa |
| United Kingdom (GB) | 4000058260000005 | Visa (debit) |
| United Kingdom (GB) | 5555558265554449 | Mastercard |
| \*\*ASIA PACIFIC\*\*
> To test subscriptions that require mandates and pre-debit notifications, see [India recurring payments](https://docs.stripe.com/india-recurring-payments.md?integration=paymentIntents-setupIntents#testing). |
| Australia (AU) | 4000000360000006 | Visa |
| China (CN) | 4000001560000002 | Visa |
| Hong Kong (HK) | 4000003440000004 | Visa |
| India (IN) | 4000003560000008 | Visa |
| Japan (JP) | 4000003920000003 | Visa |
| Japan (JP) | 3530111333300000 | JCB |
| Malaysia (MY) | 4000004580000002 | Visa |
| New Zealand (NZ) | 4000005540000008 | Visa |
| Singapore (SG) | 4000007020000003 | Visa |
| Taiwan (TW) | 4000001580000008 | Visa |
| Thailand (TH) | 4000007640000003 | Visa (credit) |
| Thailand (TH) | 4000057640000008 | Visa (debit) |
#### PaymentMethods
| Country | PaymentMethod | Brand |
| --- | --- | --- |
| \*\*AMERICAS\*\* |
| United States (US) | `pm\_card\_us` | Visa |
| Argentina (AR) | `pm\_card\_ar` | Visa |
| Brazil (BR) | `pm\_card\_br` | Visa |
| Canada (CA) | `pm\_card\_ca` | Visa |
| Chile (CL) | `pm\_card\_cl` | Visa |
| Colombia (CO) | `pm\_card\_co` | Visa |
| Costa Rica (CR) | `pm\_card\_cr` | Visa |
| Ecuador (EC) | `pm\_card\_ec` | Visa |
| Mexico (MX) | `pm\_card\_mx` | Visa |
| Panama (PA) | `pm\_card\_pa` | Visa |
| Paraguay (PY) | `pm\_card\_py` | Visa |
| Peru (PE) | `pm\_card\_pe` | Visa |
| Uruguay (UY) | `pm\_card\_uy` | Visa |
| \*\*EUROPE and MIDDLE EAST\*\*
> \*Strong Customer Authentication\* (Strong Customer Authentication (SCA) is a regulatory requirement in effect as of September 14, 2019, that impacts many European online payments. It requires customers to use two-factor authentication like 3D Secure to verify their purchase) regulations require \*3D Secure\* (3D Secure (3DS) provides an additional layer of authentication for credit card transactions that protects businesses from liability for fraudulent card payments) authentication for online payments within the \*European Economic Area\* (The European Economic Area is a regional single market with free movement of labor, goods, and capital. It encompasses the European Union member states and three additional states that are part of the European Free Trade Association). The test cards in this section simulate a payment that succeeds without authentication. We recommend also testing scenarios that involve authentication, using [3D Secure test cards](https://docs.stripe.com/testing.md#regulatory-cards). |
| United Arab Emirates (AE) | `pm\_card\_ae` | Visa |
| United Arab Emirates (AE) | `pm\_card\_ae\_mastercard` | Mastercard |
| Austria (AT) | `pm\_card\_at` | Visa |
| Belgium (BE) | `pm\_card\_be` | Visa |
| Bulgaria (BG) | `pm\_card\_bg` | Visa |
| Belarus (BY) | `pm\_card\_by` | Visa |
| Croatia (HR) | `pm\_card\_hr` | Visa |
| Cyprus (CY) | `pm\_card\_cy` | Visa |
| Czech Republic (CZ) | `pm\_card\_cz` | Visa |
| Denmark (DK) | `pm\_card\_dk` | Visa |
| Estonia (EE) | `pm\_card\_ee` | Visa |
| Finland (FI) | `pm\_card\_fi` | Visa |
| France (FR) | `pm\_card\_fr` | Visa |
| Germany (DE) | `pm\_card\_de` | Visa |
| Gibraltar (GI) | `pm\_card\_gi` | Visa |
| Greece (GR) | `pm\_card\_gr` | Visa |
| Hungary (HU) | `pm\_card\_hu` | Visa |
| Ireland (IE) | `pm\_card\_ie` | Visa |
| Italy (IT) | `pm\_card\_it` | Visa |
| Latvia (LV) | `pm\_card\_lv` | Visa |
| Liechtenstein (LI) | `pm\_card\_li` | Visa |
| Lithuania (LT) | `pm\_card\_lt` | Visa |
| Luxembourg (LU) | `pm\_card\_lu` | Visa |
| Malta (MT) | `pm\_card\_mt` | Visa |
| Netherlands (NL) | `pm\_card\_nl` | Visa |
| Norway (NO) | `pm\_card\_no` | Visa |
| Poland (PL) | `pm\_card\_pl` | Visa |
| Portugal (PT) | `pm\_card\_pt` | Visa |
| Romania (RO) | `pm\_card\_ro` | Visa |
| Slovenia (SI) | `pm\_card\_si` | Visa |
| Slovakia (SK) | `pm\_card\_sk` | Visa |
| Spain (ES) | `pm\_card\_es` | Visa |
| Sweden (SE) | `pm\_card\_se` | Visa |
| Switzerland (CH) | `pm\_card\_ch` | Visa |
| United Kingdom (GB) | `pm\_card\_gb` | Visa |
| United Kingdom (GB) | `pm\_card\_gb\_debit` | Visa (debit) |
| United Kingdom (GB) | `pm\_card\_gb\_mastercard` | Mastercard |
| \*\*ASIA PACIFIC\*\* 2
> To test subscriptions that require mandates and pre-debit notifications, see [India recurring payments](https://docs.stripe.com/india-recurring-payments.md?integration=paymentIntents-setupIntents#testing). |
| Australia (AU) | `pm\_card\_au` | Visa |
| China (CN) | `pm\_card\_cn` | Visa |
| Hong Kong (HK) | `pm\_card\_hk` | Visa |
| India (IN) | `pm\_card\_in` | Visa |
| Japan (JP) | `pm\_card\_jp` | Visa |
| Japan (JP) | `pm\_card\_jcb` | JCB |
| Malaysia (my) | `pm\_card\_my` | Visa |
| New Zealand (NZ) | `pm\_card\_nz` | Visa |
| Singapore (SG) | `pm\_card\_sg` | Visa |
| Taiwan (TW) | `pm\_card\_tw` | Visa |
| Thailand (TH) | `pm\_card\_th\_credit` | Visa (credit) |
| Thailand (TH) | `pm\_card\_th\_debit` | Visa (debit) |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Country | Token | Brand |
| --- | --- | --- |
| \*\*AMERICAS\*\* |
| United States (US) | `tok\_us` | Visa |
| Argentina (AR) | `tok\_ar` | Visa |
| Brazil (BR) | `tok\_br` | Visa |
| Canada (CA) | `tok\_ca` | Visa |
| Chile (CL) | `tok\_cl` | Visa |
| Colombia (CO) | `tok\_co` | Visa |
| Costa Rica (CR) | `tok\_cr` | Visa |
| Ecuador (EC) | `tok\_ec` | Visa |
| Mexico (MX) | `tok\_mx` | Visa |
| Panama (PA) | `tok\_pa` | Visa |
| Paraguay (PY) | `tok\_py` | Visa |
| Peru (PE) | `tok\_pe` | Visa |
| Uruguay (UY) | `tok\_uy` | Visa |
| \*\*EUROPE and MIDDLE EAST\*\* |
| United Arab Emirates (AE) | `tok\_ae` | Visa |
| United Arab Emirates (AE) | `tok\_ae\_mastercard` | Mastercard |
| Austria (AT) | `tok\_at` | Visa |
| Belgium (BE) | `tok\_be` | Visa |
| Bulgaria (BG) | `tok\_bg` | Visa |
| Belarus (BY) | `tok\_by` | Visa |
| Croatia (HR) | `tok\_hr` | Visa |
| Cyprus (CY) | `tok\_cy` | Visa |
| Czech Republic (CZ) | `tok\_cz` | Visa |
| Denmark (DK) | `tok\_dk` | Visa |
| Estonia (EE) | `tok\_ee` | Visa |
| Finland (FI) | `tok\_fi` | Visa |
| France (FR) | `tok\_fr` | Visa |
| Germany (DE) | `tok\_de` | Visa |
| Gibraltar (GI) | `tok\_gi` | Visa |
| Greece (GR) | `tok\_gr` | Visa |
| Hungary (HU) | `tok\_hu` | Visa |
| Ireland (IE) | `tok\_ie` | Visa |
| Italy (IT) | `tok\_it` | Visa |
| Latvia (LV) | `tok\_lv` | Visa |
| Liechtenstein (LI) | `tok\_li` | Visa |
| Lithuania (LT) | `tok\_lt` | Visa |
| Luxembourg (LU) | `tok\_lu` | Visa |
| Malta (MT) | `tok\_mt` | Visa |
| Netherlands (NL) | `tok\_nl` | Visa |
| Norway (NO) | `tok\_no` | Visa |
| Poland (PL) | `tok\_pl` | Visa |
| Portugal (PT) | `tok\_pt` | Visa |
| Romania (RO) | `tok\_ro` | Visa |
| Slovenia (SI) | `tok\_si` | Visa |
| Slovakia (SK) | `tok\_sk` | Visa |
| Spain (ES) | `tok\_es` | Visa |
| Sweden (SE) | `tok\_se` | Visa |
| Switzerland (CH) | `tok\_ch` | Visa |
| United Kingdom (GB) | `tok\_gb` | Visa |
| United Kingdom (GB) | `tok\_gb\_debit` | Visa (debit) |
| United Kingdom (GB) | `tok\_gb\_mastercard` | Mastercard |
| \*\*ASIA PACIFIC\*\*
> To test subscriptions that require mandates and pre-debit notifications, see [India recurring payments](https://docs.stripe.com/india-recurring-payments.md?integration=paymentIntents-setupIntents#testing). |
| Australia (AU) | `tok\_au` | Visa |
| China (CN) | `tok\_cn` | Visa |
| Hong Kong (HK) | `tok\_hk` | Visa |
| India (IN) | `tok\_in` | Visa |
| Japan (JP) | `tok\_jp` | Visa |
| Japan (JP) | `tok\_jcb` | JCB |
| Malaysia (my) | `tok\_my` | Visa |
| New Zealand (NZ) | `tok\_nz` | Visa |
| Singapore (SG) | `tok\_sg` | Visa |
| Taiwan (TW) | `tok\_tw` | Visa |
| Thailand (TH) | `tok\_th\_credit` | Visa (credit) |
| Thailand (TH) | `tok\_th\_debit` | Visa (debit) |
### Simulate customer location with email
When testing [Checkout Sessions](https://docs.stripe.com/payments/checkout.md), [Payment Links](https://docs.stripe.com/payment-links.md), or [pricing tables](https://docs.stripe.com/payments/checkout/pricing-table.md), you can simulate a customer’s geographic location by using a location-formatted email address. Add a `+location\_XX` suffix to the local part of any email address, where `XX` is a valid two-letter [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO\_3166-1\_alpha-2) country code.
For example, to simulate a customer located in the United States, pass `test+location\_US@example.com` as the `customer\_email` parameter when creating a Checkout Session and as the `prefilled\_email` [URL parameter](https://docs.stripe.com/payment-links/customize.md#customize-checkout-with-url-parameters) when creating a Payment Link.
When you visit the resulting Checkout Session URL, you see the same currency and payment methods that a customer in the specified country would see. Learn more about [testing with location-formatted emails](https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing.md#testing).
## Simulate an HSA or FSA card payment
Below are test card numbers for simulating transactions using a health savings account (HSA) and a flexible spending account (FSA). These accounts are commonly used for medical expenses, and testing with them ensures proper handling of healthcare-related transactions within your application.
#### Card numbers
| Brand/Type | Number | CVC | Date |
| --- | --- | --- | --- |
| Visa FSA | 4000051230000072 | Any 3 digits | Any future date |
| Visa HSA | 4000051230000072 | Any 3 digits | Any future date |
| Mastercard FSA | 5200828282828897 | Any 3 digits | Any future date |
#### PaymentMethods
| Brand/Type | PaymentMethod |
| --- | --- |
| Visa FSA | `pm\_card\_debit\_visaFsaProductCode` |
| Visa HSA | `pm\_card\_debit\_visaHsaProductCode` |
| Mastercard FSA | `pm\_card\_mastercard\_debit\_mastercardFsaProductCode` |
## Simulate a declined payment
To test your integration’s error-handling logic by simulating payments that the issuer declines for various reasons, use test cards from this section. These cards return a [card error](https://docs.stripe.com/error-handling.md#payment-errors) with the listed [error code](https://docs.stripe.com/error-codes.md) and [decline code](https://docs.stripe.com/declines/codes.md).
Provide a CVC when you test CVC behavior. Stripe skips the CVC check if you omit it, so the check can’t fail. To simulate an incorrect CVC, use the “Incorrect CVC decline” test card listed in the following table and provide any three-digit CVC.
#### Card numbers
| Description | Number | Error code | Decline code |
| --- | --- | --- | --- |
| Generic decline | 4000000000000002 | [card\_declined](https://docs.stripe.com/error-codes.md#card-declined) | [generic\_decline](https://docs.stripe.com/declines/codes.md#generic\_decline) |
| Insufficient funds decline | 4000000000009995 | [card\_declined](https://docs.stripe.com/error-codes.md#card-declined) | [insufficient\_funds](https://docs.stripe.com/declines/codes.md#insufficient\_funds) |
| Lost card decline | 4000000000009987 | [card\_declined](https://docs.stripe.com/error-codes.md#card-declined) | [lost\_card](https://docs.stripe.com/declines/codes.md#lost\_card) |
| Stolen card decline | 4000000000009979 | [card\_declined](https://docs.stripe.com/error-codes.md#card-declined) | [stolen\_card](https://docs.stripe.com/declines/codes.md#stolen\_card) |
| Expired card decline | 4000000000000069 | [expired\_card](https://docs.stripe.com/error-codes.md#expired-card) | n/a |
| Incorrect CVC decline | 4000000000000127 | [incorrect\_cvc](https://docs.stripe.com/declines/codes.md#incorrect\_cvc) | n/a |
| Processing error decline | 4000000000000119 | [processing\_error](https://docs.stripe.com/error-codes.md#processing-error) | n/a |
| Incorrect number decline | 4242424242424241 | [incorrect\_number](https://docs.stripe.com/declines/codes.md#incorrect\_number) | n/a |
| Exceeding velocity limit decline | 4000000000006975 | [card\_declined](https://docs.stripe.com/error-codes.md#card-declined) | [card\_velocity\_exceeded](https://docs.stripe.com/declines/codes.md#card\_velocity\_exceeded) |
You can’t attach cards that simulate issuer declines to a `Customer` object. To simulate a declined payment with an attached card, use the “Decline after attaching” test card listed in the following table.
| Description | Number | Details |
| --- | --- | --- |
| Decline after attaching | 4000000000000341 | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail. |
#### PaymentMethods
| Description | Number | Error code | Decline code |
| --- | --- | --- | --- |
| Generic decline | `pm\_card\_visa\_chargeDeclined` | `card\_declined` | `generic\_decline` |
| Insufficient funds decline | `pm\_card\_visa\_chargeDeclinedInsufficientFunds` | `card\_declined` | `insufficient\_funds` |
| Lost card decline | `pm\_card\_visa\_chargeDeclinedLostCard` | `card\_declined` | `lost\_card` |
| Stolen card decline | `pm\_card\_visa\_chargeDeclinedStolenCard` | `card\_declined` | `stolen\_card` |
| Expired card decline | `pm\_card\_chargeDeclinedExpiredCard` | `expired\_card` | n/a |
| Incorrect CVC decline | `pm\_card\_chargeDeclinedIncorrectCvc` | `incorrect\_cvc` | n/a |
| Processing error decline | `pm\_card\_chargeDeclinedProcessingError` | `processing\_error` | n/a |
| Exceeding velocity limit decline | `pm\_card\_visa\_chargeDeclinedVelocityLimitExceeded` | `card\_declined` | `card\_velocity\_exceeded` |
You can’t attach cards that simulate issuer declines to a `Customer` object. To simulate a declined payment with an attached card, use the “Decline after attaching” test card listed in the following table.
| Description | PaymentMethod | Details |
| --- | --- | --- |
| Decline after attaching | `pm\_card\_chargeCustomerFail` | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail. |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Description | Number | Error code | Decline code |
| --- | --- | --- | --- |
| Generic decline | `tok\_visa\_chargeDeclined` | `card\_declined` | `generic\_decline` |
| Insufficient funds decline | `tok\_visa\_chargeDeclinedInsufficientFunds` | `card\_declined` | `insufficient\_funds` |
| Insufficient debit funds decline | `tok\_visa\_debit\_chargeDeclinedInsufficientFunds` | `card\_declined` | `insufficient\_funds` |
| Lost card decline | `tok\_visa\_chargeDeclinedLostCard` | `card\_declined` | `lost\_card` |
| Stolen card decline | `tok\_visa\_chargeDeclinedStolenCard` | `card\_declined` | `stolen\_card` |
| Expired card decline | `tok\_chargeDeclinedExpiredCard` | `expired\_card` | n/a |
| Expired card decline | `tok\_visa\_chargeDeclinedExpiredCard` | `expired\_card` | n/a |
| Fraudulent card decline | `tok\_visa\_chargeDeclinedFraudulent` | `expired\_card` | n/a |
| Incorrect CVC decline | `tok\_chargeDeclinedIncorrectCvc` | `incorrect\_cvc` | n/a |
| Incorrect CVC decline | `tok\_visa\_chargeDeclinedIncorrectCvc` | `incorrect\_cvc` | n/a |
| Processing error decline | `tok\_chargeDeclinedProcessingError` | `processing\_error` | n/a |
| Processing error decline | `tok\_visa\_chargeDeclinedProcessingError` | `processing\_error` | n/a |
| Exceeding velocity limit decline | `tok\_visa\_chargeDeclinedVelocityLimitExceeded` | `card\_declined` | `card\_velocity\_exceeded` |
You can’t attach cards that simulate issuer declines to a `Customer` object. To simulate a declined payment with an attached card, use the “Decline after attaching” test card listed in the following table.
| Description | Token | Details |
| --- | --- | --- |
| Decline after attaching | `tok\_chargeCustomerFail` | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail. |
| Decline after attaching | `tok\_visa\_chargeCustomerFail` | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail. |
| Decline after attaching due to lost card | `tok\_visa\_chargeCustomerFailLostCard` | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail due to a lost card. |
| Decline after attaching due to stolen card | `tok\_visa\_chargeCustomerFailStolenCard` | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail due to a stolen card. |
## Fraud prevention
Stripe’s fraud prevention system, Radar, can block payments when they have a high risk level or fail verification checks. You can use the cards in this section to test your Radar settings. You can also use them to test how your integration responds to blocked payments.
Each card simulates specific risk factors. Your Radar settings determine which risk factors cause it to block a payment. Blocked payments result in [card errors with an error code of fraud](https://docs.stripe.com/error-handling.md).
To trigger a failed CVC check, include a CVC (any three-digit number). To trigger a failed postal code check, include any valid postal code. If you omit these fields, Radar skips those checks, so they can’t fail.
#### Card numbers
| Description | Number | Details |
| --- | --- | --- |
| Always blocked | 4100000000000019 | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/transaction-risk-prevention.md#high-risk)
Radar always blocks it. |
| Highest risk | 4000000000004954 | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/transaction-risk-prevention.md#high-risk)
Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md). |
| Elevated risk | 4000000000009235 | The charge has a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might [queue it for review](https://docs.stripe.com/radar/transaction-reviews.md). |
| High fraud dispute score | 4000008400000407 | This charge has a high fraud dispute score.
Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md). |
| High early fraud warning score | 4000008400000159 | This charge has a high early fraud warning score.
Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md). |
| Dynamic risk thresholds | 4000008400001017 | This charge triggers the Radar Dynamic risk thresholds control, when enabled.
Radar blocks the transaction if you enable the [Dynamic risk thresholds](https://docs.stripe.com/radar/risk-settings.md#dynamic-risk-thresholds). |
| Adaptive 3DS | 4000008405600003 | This charge triggers the Radar Adaptive 3DS risk control, when enabled.
If you enable Adaptive 3DS, Radar requests 3DS authentication when using this test card. |
| CVC check fails | 4000000000000101 | If you provide a CVC number, the CVC check fails.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| Postal code check fails | 4000000000000036 | If you provide a postal code, the postal code check fails.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| CVC check fails with elevated risk | 4000058400307872 | If you provide a CVC number, the CVC check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| Postal code check fails with elevated risk | 4000058400306072 | If you provide a postal code, the postal code check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Line1 check fails | 4000000000000028 | The address line 1 check fails.
The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes). |
| Address checks fail | 4000000000000010 | The address postal code check and address line 1 check both fail.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| Address unavailable | 4000000000000044 | The address postal code check and address line 1 check are both unavailable.
The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes). |
#### PaymentMethods
| Description | PaymentMethod | Details |
| --- | --- | --- |
| Always blocked | `pm\_card\_radarBlock` | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/transaction-risk-prevention.md#high-risk)
Radar always blocks it. |
| Highest risk | `pm\_card\_riskLevelHighest` | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/transaction-risk-prevention.md#high-risk)
Radar might block it depending on your settings. |
| Elevated risk | `pm\_card\_riskLevelElevated` | The charge has a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might [queue it for review](https://docs.stripe.com/radar/transaction-reviews.md). |
| High fraud dispute score | `pm\_card\_highFraudDisputeScore` | This charge has a high fraud dispute score.
Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md). |
| High early fraud warning score | `pm\_card\_highEfwScore` | This charge has a high early fraud warning score.
Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md). |
| Dynamic risk thresholds | `pm\_card\_radarDynamicRiskThreshold` | This charge triggers the Radar Dynamic risk thresholds control, when enabled.
Radar blocks the transaction if you enable the [Dynamic risk thresholds](https://docs.stripe.com/radar/risk-settings.md#dynamic-risk-thresholds). |
| Adaptive 3DS | `pm\_card\_adaptive3dsChallenge` | This charge triggers the Radar Adaptive 3DS risk control, when enabled.
If you enable Adaptive 3DS, Radar requests 3DS authentication when using this test card. |
| CVC check fails | `pm\_card\_cvcCheckFail` | If you provide a CVC number, the CVC check fails.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| Postal code check fails | `pm\_card\_avsZipFail` | If you provide a postal code, the postal code check fails.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| CVC check fails with elevated risk | `pm\_card\_cvcCheckFailElevatedRisk` | If you provide a CVC number, the CVC check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Postal code check fails with elevated risk | `pm\_card\_avsZipFailElevatedRisk` | If you provide a postal code, the postal code check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Line1 check fails | `pm\_card\_avsLine1Fail` | The address line 1 check fails.
The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes). |
| Address checks fail | `pm\_card\_avsFail` | The address postal code check and address line 1 check both fail.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| Address unavailable | `pm\_card\_avsUnchecked` | The address postal code check and address line 1 check are both unavailable.
The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes). |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Description | Token | Details |
| --- | --- | --- |
| Always blocked | `tok\_radarBlock` | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/transaction-risk-prevention.md#high-risk)
Radar always blocks it. |
| Highest risk | `tok\_riskLevelHighest` | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/transaction-risk-prevention.md#high-risk)
Radar might block it depending on your settings. |
| Elevated risk | `tok\_riskLevelElevated` | The charge has a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might [queue it for review](https://docs.stripe.com/radar/transaction-reviews.md). |
| High fraud dispute score | `tok\_highFraudDisputeScore` | This charge has a high fraud dispute score.
Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md). |
| High early fraud warning score | `tok\_highEfwScore` | This charge has a high early fraud warning score.
Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md). |
| Dynamic risk thresholds | `tok\_radarDynamicRiskThreshold` | This charge triggers the Radar Dynamic risk thresholds control, when enabled.
Radar blocks the transaction if you enable the [Dynamic risk thresholds](https://docs.stripe.com/radar/risk-settings.md#dynamic-risk-thresholds). |
| Adaptive 3DS | `tok\_adaptive3dsChallenge` | This charge triggers the Radar Adaptive 3DS risk control, when enabled.
If you enable Adaptive 3DS, Radar requests 3DS authentication when using this test card. |
| CVC check fails | `tok\_cvcCheckFail` | If you provide a CVC number, the CVC check fails.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| Postal code check fails | `tok\_avsZipFail` | If you provide a postal code, the postal code check fails.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| CVC check fails with elevated risk | `tok\_cvcCheckFailElevatedRisk` | If you provide a CVC number, the CVC check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Postal code check fails with elevated risk | `tok\_avsZipFailElevatedRisk` | If you provide a postal code, the postal code check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/transaction-risk-prevention.md#elevated-risk)
Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Line1 check fails | `tok\_avsLine1Fail` | The address line 1 check fails.
The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes). |
| Address checks fail | `tok\_avsFail` | The address postal code check and address line 1 check both fail.
Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks) |
| Address unavailable | `tok\_avsUnchecked` | The address postal code check and address line 1 check are both unavailable.
The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes). |
## Trigger an error with invalid data
To test errors resulting from invalid data, provide invalid details. You don’t need a special test card for this. Any invalid value works. For instance:
- [invalid\_expiry\_month](https://docs.stripe.com/declines/codes.md#invalid\_expiry\_month): Use an invalid month, such as \*\*13\*\*.
- [invalid\_expiry\_year](https://docs.stripe.com/declines/codes.md#invalid\_expiry\_year): Use a year up to 50 years in the past, such as \*\*95\*\*.
- [invalid\_cvc](https://docs.stripe.com/declines/codes.md#invalid\_cvc): Use a two-digit number, such as \*\*99\*\*.
- [incorrect\_number](https://docs.stripe.com/declines/codes.md#incorrect\_number): Use a card number that fails the [Luhn check](https://en.wikipedia.org/wiki/Luhn\_algorithm), such as `4242424242424241`.
## Simulate a dispute
To simulate a [disputed transaction](https://docs.stripe.com/disputes.md), use the test cards in this section. Then, to simulate winning or losing the dispute, provide [winning or losing evidence](https://docs.stripe.com/testing.md#evidence).
#### Card numbers
| Description | Number | Details |
| --- | --- | --- |
| Fraudulent | 4000000000000259 | With default account settings, charge succeeds, only to be disputed as [fraudulent](https://docs.stripe.com/disputes/categories.md). This type of dispute is [protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Not received | 4000000000002685 | With default account settings, charge succeeds, only to be disputed as [product not received](https://docs.stripe.com/disputes/categories.md). This type of dispute [isn’t protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Inquiry | 4000000000001976 | With default account settings, charge succeeds, only to be disputed as [an inquiry](https://docs.stripe.com/disputes/how-disputes-work.md#inquiries). |
| Warning | 4000000000005423 | With default account settings, charge succeeds, only to receive [an early fraud warning](https://docs.stripe.com/disputes/how-disputes-work.md#early-fraud-warnings). |
| Multiple disputes | 4000000404000079 | With default account settings, charge succeeds, only to be disputed [multiple times](https://docs.stripe.com/disputes/how-disputes-work.md#multiple-disputes). |
| Visa Compelling Evidence 3.0 | 4000000404000038 | With default account settings, charge succeeds, only to be disputed as a [Visa Compelling Evidence 3.0 eligible dispute](https://docs.stripe.com/disputes/api/visa-ce3.md#testing). |
| Visa compliance | 4000008400000779 | With default account settings, charge succeeds, only to be disputed as a [Visa compliance dispute](https://docs.stripe.com/disputes/api/visa-compliance.md#testing). |
| Mastercard compliance | 5105008400000002 | With default account settings, charge succeeds, only to be disputed as a [Mastercard compliance dispute](https://docs.stripe.com/disputes/api/mastercard-compliance.md#testing). |
| Smart disputes | 4000000001000043 | With default account settings, charge succeeds, only to be disputed as a [Smart Disputes](https://docs.stripe.com/disputes/smart-disputes.md) eligible dispute. |
#### PaymentMethods
| Description | PaymentMethod | Details |
| --- | --- | --- |
| Fraudulent | `pm\_card\_createDispute` | With default account settings, charge succeeds, only to be disputed as [fraudulent](https://docs.stripe.com/disputes/categories.md). This type of dispute is [protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Not received | `pm\_card\_createDisputeProductNotReceived` | With default account settings, charge succeeds, only to be disputed as [product not received](https://docs.stripe.com/disputes/categories.md). This type of dispute [isn’t protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Inquiry | `pm\_card\_createDisputeInquiry` | With default account settings, charge succeeds, only to be disputed as [an inquiry](https://docs.stripe.com/disputes/how-disputes-work.md#inquiries). |
| Warning | `pm\_card\_createIssuerFraudRecord` | With default account settings, charge succeeds, only to receive [an early fraud warning](https://docs.stripe.com/disputes/how-disputes-work.md#early-fraud-warnings). |
| Multiple disputes | `pm\_card\_createMultipleDisputes` | With default account settings, charge succeeds, only to be disputed [multiple times](https://docs.stripe.com/disputes/how-disputes-work.md#multiple-disputes). |
| Visa Compelling Evidence 3.0 | `pm\_card\_createCe3EligibleDispute` | With default account settings, charge succeeds, only to be disputed as a [Visa Compelling Evidence 3.0 eligible dispute](https://docs.stripe.com/disputes/api/visa-ce3.md#testing). |
| Visa compliance | `pm\_card\_createComplianceDispute` | With default account settings, charge succeeds, only to be disputed as a [Visa compliance dispute](https://docs.stripe.com/disputes/api/visa-compliance.md#testing). |
| Mastercard compliance | `pm\_card\_createMastercardComplianceDispute` | With default account settings, the charge succeeds, only to be disputed as a [Mastercard compliance dispute](https://docs.stripe.com/disputes/api/mastercard-compliance.md#testing). |
| Smart disputes | `pm\_card\_createAutoRepresentmentEligibleDispute` | With default account settings, charge succeeds, only to be disputed as a [Smart Disputes](https://docs.stripe.com/disputes/smart-disputes.md) eligible dispute. |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Description | Token | Details |
| --- | --- | --- |
| Fraudulent | `tok\_createDispute` | With default account settings, charge succeeds, only to be disputed as [fraudulent](https://docs.stripe.com/disputes/categories.md). This type of dispute is [protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Not received | `tok\_createDisputeProductNotReceived` | With default account settings, charge succeeds, only to be disputed as [product not received](https://docs.stripe.com/disputes/categories.md). This type of dispute [isn’t protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Inquiry | `tok\_createDisputeInquiry` | With default account settings, charge succeeds, only to be disputed as [an inquiry](https://docs.stripe.com/disputes/how-disputes-work.md#inquiries). |
| Warning | `tok\_createIssuerFraudRecord` | With default account settings, charge succeeds, only to receive [an early fraud warning](https://docs.stripe.com/disputes/how-disputes-work.md#early-fraud-warnings). |
| Multiple disputes | `tok\_createMultipleDisputes` | With default account settings, charge succeeds, only to be disputed [multiple times](https://docs.stripe.com/disputes/how-disputes-work.md#multiple-disputes). |
| Visa Compelling Evidence 3.0 | `tok\_createCe3EligibleDispute` | With default account settings, charge succeeds, only to be disputed as a [Visa Compelling Evidence 3.0 eligible dispute](https://docs.stripe.com/disputes/api/visa-ce3.md#testing). |
| Visa compliance | `tok\_createComplianceDispute` | With default account settings, charge succeeds, only to be disputed as a [Visa compliance dispute](https://docs.stripe.com/disputes/api/visa-compliance.md#testing). |
| Mastercard compliance | `tok\_createMastercardComplianceDispute` | With default account settings, the charge succeeds, only to be disputed as a [Mastercard compliance dispute](https://docs.stripe.com/disputes/api/mastercard-compliance.md#testing). |
| Smart disputes | `tok\_createAutoRepresentmentEligibleDispute` | With default account settings, charge succeeds, only to be disputed as a [Smart Disputes](https://docs.stripe.com/disputes/smart-disputes.md) eligible dispute. |
### Evidence
To simulate winning or losing the dispute, respond with one of the evidence values from the table below.
- If you [respond using the API](https://docs.stripe.com/disputes/api.md), pass the value from the table as [uncategorized\_text](https://docs.stripe.com/api/disputes/update.md#update\_dispute-evidence-uncategorized\_text).
- If you [respond in the Dashboard](https://docs.stripe.com/disputes/responding.md) or in [Connect embedded components](https://docs.stripe.com/connect/supported-embedded-components/disputes-list.md), enter the value from the table in the \*\*Additional information\*\* field. Then, click \*\*Submit evidence\*\*.
| Evidence | Description |
| --- | --- |
| `winning\_evidence` | Closes the dispute as won and credits your account for the amount of the charge and related fees. |
| `losing\_evidence` | Closes the dispute as lost without crediting your account. For inquiries, this closes the inquiry without escalation. |
| `escalate\_inquiry\_evidence` | Escalates the inquiry to a chargeback. This transitions the inquiry to a full dispute and debits your account for the amount of the dispute and related fees. |
### Dispute prevention
[Dispute prevention](https://docs.stripe.com/disputes/prevention.md) helps resolve or block disputes before they become chargebacks. To simulate prevented disputes in test mode, use the test cards in this section. If your account has [Dispute Resolution or Dispute Deflection](https://dashboard.stripe.com/settings/disputes) enabled, the dispute on the transaction is either blocked or resolved. Otherwise, the transaction is successfully disputed.
#### Card numbers
| Description | Number | Details |
| --- | --- | --- |
| Visa Rapid Dispute Resolution | 4000000404004816 | Charge succeeds, then Visa RDR prevents the dispute if the account is enrolled in Dispute Resolution. Otherwise, creates a dispute. |
| Verifi CE3 block | 4000000404005649 | Charge succeeds, then Compelling Evidence 3.0 blocks the dispute if the account is enrolled in Dispute Deflection. Otherwise, creates a dispute. |
| Ethoca alert | 5105000300000018 | Charge succeeds, then Ethoca Alerts prevents the dispute if the account is enrolled in Dispute Resolution. Otherwise, creates a dispute. |
#### PaymentMethods
| Description | PaymentMethod | Details |
| --- | --- | --- |
| Visa Rapid Dispute Resolution | `pm\_card\_createRapidDisputeResolutionDispute` | Charge succeeds, then Visa RDR prevents the dispute if the account is enrolled in Dispute Resolution. Otherwise, creates a dispute. |
| Verifi CE3 block | `pm\_card\_createCe3BlockDispute` | Charge succeeds, then Compelling Evidence 3.0 blocks the dispute if the account is enrolled in Dispute Deflection. Otherwise, creates a dispute. |
| Ethoca alert | `pm\_card\_createEthocaAlert` | Charge succeeds, then Ethoca Alerts prevents the dispute if the account is enrolled in Dispute Resolution. Otherwise, creates a dispute. |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Description | Token | Details |
| --- | --- | --- |
| Visa Rapid Dispute Resolution | `tok\_createRapidDisputeResolutionDispute` | Charge succeeds, then Visa RDR prevents the dispute if the account is enrolled in Dispute Resolution. Otherwise, creates a dispute. |
| Verifi CE3 block | `tok\_createCe3BlockDispute` | Charge succeeds, then Compelling Evidence 3.0 blocks the dispute if the account is enrolled in Dispute Deflection. Otherwise, creates a dispute. |
| Ethoca alert | `tok\_createEthocaAlert` | Charge succeeds, then Ethoca Alerts prevents the dispute if the account is enrolled in Dispute Resolution. Otherwise, creates a dispute. |
## Simulate an asynchronous refund
In live mode, refunds are asynchronous: a refund can appear to succeed and later fail, or can appear as `pending` at first and later succeed. To simulate refunds with those behaviors, use the test cards in this section. With all other test cards, refunds succeed immediately and don’t change status after that.
#### Card numbers
| Description | Number | Details |
| --- | --- | --- |
| Asynchronous success | 4000000000007726 | The charge succeeds. If you initiate a refund, its status begins as `pending`. Some time later, its status transitions to `succeeded` and sends a `refund.updated` [event](https://docs.stripe.com/api/events/types.md#event\_types-refund.updated). |
| Asynchronous failure | 4000000000005126 | The charge succeeds. If you initiate a refund, its status begins as `succeeded`. Some time later, its status transitions to `failed` and sends a `refund.failed` [event](https://docs.stripe.com/api/events/types.md#event\_types-refund.failed). |
#### PaymentMethods
| Description | PaymentMethod | Details |
| --- | --- | --- |
| Asynchronous success | `pm\_card\_pendingRefund` | The charge succeeds. If you initiate a refund, its status begins as `pending`. Some time later, its status transitions to `succeeded` and sends a `refund.updated` [event](https://docs.stripe.com/api/events/types.md#event\_types-refund.updated). |
| Asynchronous failure | `pm\_card\_refundFail` | The charge succeeds. If you initiate a refund, its status begins as `succeeded`. Some time later, its status transitions to `failed` and sends a `refund.failed` [event](https://docs.stripe.com/api/events/types.md#event\_types-refund.failed). |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Description | Token | Details |
| --- | --- | --- |
| Asynchronous success | `tok\_pendingRefund` | The charge succeeds. If you initiate a refund, its status begins as `pending`. Some time later, its status transitions to `succeeded` and sends a `refund.updated` [event](https://docs.stripe.com/api/events/types.md#event\_types-refund.updated). |
| Asynchronous failure | `tok\_refundFail` | The charge succeeds. If you initiate a refund, its status begins as `succeeded`. Some time later, its status transitions to `failed` and sends a `refund.failed` [event](https://docs.stripe.com/api/events/types.md#event\_types-refund.failed). |
You can cancel a card refund only by using the Dashboard. In live mode, you can cancel a card refund within a short but nonspecific period of time. Testing environments simulate that period by allowing you to cancel a card refund within 30 minutes.
## Send funds to your available balance
To send the funds from a test transaction directly to your available balance, use the test cards in this section. Other test cards send funds from a successful payment to your pending balance.
#### Card numbers
| Description | Number | Details |
| --- | --- | --- |
| Bypass pending balance | 4000000000000077 | The US charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |
| Bypass pending balance | 4000003720000278 | The international charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |
#### PaymentMethods
| Description | PaymentMethod | Details |
| --- | --- | --- |
| Bypass pending balance | `pm\_card\_bypassPending` | The US charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |
| Bypass pending balance | `pm\_card\_bypassPendingInternational` | The international charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| Description | Token | Details |
| --- | --- | --- |
| Bypass pending balance | `tok\_bypassPending` | The US charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |
| Bypass pending balance | `tok\_bypassPendingInternational` | The international charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |
## Test 3D Secure authentication
3D Secure requires an additional layer of authentication for credit card transactions. The test cards in this section allow you to simulate triggering authentication in different payment flows.
Only cards in this section effectively test your 3D Secure integration by simulating defined 3DS behavior, such as a challenge flow or an unsupported card. Other Stripe testing cards might still trigger 3DS, but we return `attempt\_acknowledged` to bypass the additional steps since 3DS testing isn’t the objective for those cards.
> #### Dashboard not supported
>
> 3D Secure redirects won’t occur for payments created directly in the Stripe Dashboard. Instead, use your integration’s own frontend or an API call.
### Authentication and setup
To simulate payment flows that include authentication, use the test cards in this section. Some of these cards can also be [set up](https://docs.stripe.com/payments/save-and-reuse.md) for future payments, or have already been.
#### Card numbers
| Description | Number | Details |
| --- | --- | --- |
| Authenticate unless set up | 4000002500003155 | This card requires authentication for off-session payments unless you [set it up](https://docs.stripe.com/payments/save-and-reuse.md) for future payments. After you set it up, off-session payments no longer require authentication. However, on-session payments with this card always require authentication. |
| Always authenticate | 4000002760003184 | This card requires authentication on all transactions, regardless of how the card is set up. |
| Already set up | 4000003800000446 | This card is already set up for off-session use. It requires authentication for [one-time](https://docs.stripe.com/payments/accept-a-payment.md?platform=web) and other [on-session](https://docs.stripe.com/payments/existing-customers.md?platform=web&ui=elements) payments. However, all \*off-session payments\* (A payment is described as off-session if it occurs without the direct involvement of the customer, using previously-collected payment information) succeed as if the card has been previously [set up](https://docs.stripe.com/payments/save-and-reuse.md). |
| Insufficient funds | 4000008260003178 | This card requires authentication for [one-time payments](https://docs.stripe.com/payments/accept-a-payment.md?platform=web). All payments are declined with an `insufficient\_funds` failure code even after being successfully authenticated or previously [set up](https://docs.stripe.com/payments/save-and-reuse.md). |
#### PaymentMethods
| Description | PaymentMethod | Details |
| --- | --- | --- |
| Authenticate unless set up | `pm\_card\_authenticationRequiredOnSetup` | This card requires authentication for every payment unless you [set it up](https://docs.stripe.com/payments/save-and-reuse.md) for future payments. After you set it up, it no longer requires authentication. |
| Always authenticate | `pm\_card\_authenticationRequired` | This card requires authentication on all transactions, regardless of how the card is set up. |
| Already set up | `pm\_card\_authenticationRequiredSetupForOffSession` | This card is already set up for off-session use. It requires authentication for [one-time](https://docs.stripe.com/payments/accept-a-payment.md?platform=web) and other [on-session](https://docs.stripe.com/payments/existing-customers.md?platform=web&ui=elements) payments. However, all off-session payments succeed as if the card has been previously [set up](https://docs.stripe.com/payments/save-and-reuse.md). |
| Insufficient funds | `pm\_card\_authenticationRequiredChargeDeclinedInsufficientFunds` | This card requires authentication for [one-time payments](https://docs.stripe.com/payments/accept-a-payment.md?platform=web). All payments are declined with an `insufficient\_funds` failure code even after being successfully authenticated or previously [set up](https://docs.stripe.com/payments/save-and-reuse.md). |
### Support and availability
Stripe requests authentication when required by regulation or when triggered by your Radar rules or custom code. Even if authentication is requested, it can’t always be performed—for instance, the customer’s card might not be enrolled, or an error might occur. Use the test cards in this section to simulate various combinations of these factors.
All 3DS references indicate [3D Secure 2](https://stripe.com/guides/3d-secure-2).
#### Card numbers
| 3D Secure usage | Outcome | Number | Details |
| --- | --- | --- | --- |
| 3DS Required | OK | 4000000000003220 | 3D Secure authentication must be completed for the payment to be successful. By default, your Radar rules request 3D Secure authentication for this card. Ireland-issued (`IE`). |
| 3DS Required | OK | 4000008400000027 | 3D Secure authentication must be completed for the payment to be successful. By default, your Radar rules request 3D Secure authentication for this card. US-issued (`US`). |
| 3DS Required | Declined | 4000008400001629 | 3D Secure authentication is required, but payments are declined with a `card\_declined` failure code after authentication. By default, your Radar rules request 3D Secure authentication for this card. |
| 3DS Required | Error | 4000008400001280 | 3D Secure authentication is required, but the 3D Secure lookup request fails with a processing error. Payments are declined with a `card\_declined` failure code. By default, your Radar rules request 3D Secure authentication for this card. |
| 3DS Supported | OK | 4000000000003055 | 3D Secure authentication might still be performed, but isn’t required. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| 3DS Supported | Error | 4000000000003097 | 3D Secure authentication might still be performed, but isn’t required. However, attempts to perform 3D Secure result in a processing error. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| 3DS Supported | Unenrolled | 4242424242424242 | 3D Secure is supported for this card, but this card isn’t enrolled in 3D Secure. Even if your Radar rules request 3D Secure, the customer won’t be prompted to authenticate. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| 3DS Not supported | 378282246310005 | 3D Secure isn’t supported on this card and can’t be invoked. The PaymentIntent or SetupIntent proceeds without performing authentication. |
| 3DS Frictionless flow | OK | 4000000032200000 | 3D Secure authentication is required on all transactions, regardless of how the card is set up. The authentication proceeds through a frictionless flow, and succeeds. |
#### PaymentMethods
| 3D Secure usage | Outcome | PaymentMethod | Details |
| --- | --- | --- | --- |
| Required | OK | `pm\_card\_threeDSecure2Required` | 3D Secure authentication must be completed for the payment to be successful. By default, your Radar rules request 3D Secure authentication for this card. |
| Required | Declined | `pm\_card\_threeDSecureRequiredChargeDeclined` | 3D Secure authentication is required, but payments are declined with a `card\_declined` failure code after authentication. By default, your Radar rules request 3D Secure authentication for this card. |
| Required | Error | `pm\_card\_threeDSecureRequiredProcessingError` | 3D Secure authentication is required, but the 3D Secure lookup request fails with a processing error. Payments are declined with a `card\_declined` failure code. By default, your Radar rules request 3D Secure authentication for this card. |
| Supported | OK | `pm\_card\_threeDSecureOptional` | 3D Secure authentication might still be performed, but isn’t required. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Supported | Error | `pm\_card\_threeDSecureOptionalProcessingError` | 3D Secure authentication might still be performed, but isn’t required. However, attempts to perform 3D Secure result in a processing error. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Supported | Unenrolled | `pm\_card\_visa` | 3D Secure is supported for this card, but this card isn’t enrolled in 3D Secure. Even if your Radar rules request 3D Secure, the customer won’t be prompted to authenticate. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Not supported | | `pm\_card\_amex\_threeDSecureNotSupported` | 3D Secure isn’t supported on this card and can’t be invoked. The PaymentIntent or SetupIntent proceeds without performing authentication. |
#### Tokens
Most integrations don’t use tokens anymore, but we make test tokens such as [tok\_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.
| 3D Secure usage | Outcome | Token | Details |
| --- | --- | --- | --- |
| Required | OK | `tok\_threeDSecure2Required` | 3D Secure authentication must be completed for the payment to be successful. By default, your Radar rules request 3D Secure authentication for this card. |
| Required | Declined | `tok\_threeDSecureRequiredChargeDeclined` | 3D Secure authentication is required, but payments are declined with a `card\_declined` failure code after authentication. By default, your Radar rules request 3D Secure authentication for this card. |
| Required | Error | `tok\_threeDSecureRequiredProcessingError` | 3D Secure authentication is required, but the 3D Secure lookup request fails with a processing error. Payments are declined with a `card\_declined` failure code. By default, your Radar rules request 3D Secure authentication for this card. |
| Supported | OK | `tok\_threeDSecureOptional` | 3D Secure authentication might still be performed, but isn’t required. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Supported | Error | `tok\_threeDSecureOptionalProcessingError` | 3D Secure authentication might still be performed, but isn’t required. However, attempts to perform 3D Secure result in a processing error. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Supported | Unenrolled | `tok\_visa` | 3D Secure is supported for this card, but this card isn’t enrolled in 3D Secure. Even if your Radar rules request 3D Secure, the customer won’t be prompted to authenticate. By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Not supported | | `tok\_amex\_threeDSecureNotSupported` | 3D Secure isn’t supported on this card and can’t be invoked. The PaymentIntent proceeds without performing authentication. |
### 3D Secure mobile challenge flows
In a mobile payment, several challenge flows for authentication—where the customer has to interact with prompts in the UI—are available. Use the test cards in this section to trigger a specific challenge flow for test purposes. These cards aren’t useful in browser-based payment forms or in API calls. In those environments, they work but don’t trigger any special behavior. Because they’re not useful in API calls, we don’t provide any `PaymentMethod` or `Token` values to test with.
| Challenge flow | Number | Details |
| --- | --- | --- |
| Out of band | 4000582600000094 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with Out of Band UI. |
| One time passcode | 4000582600000045 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with One Time Passcode UI. |
| Single select | 4000582600000102 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with single-select UI. |
| Multi select | 4000582600000110 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with multi-select UI. |
## Simulate a captcha challenge
To prevent fraud, Stripe might display a captcha challenge to the user on the payment page. Use the test cards below to simulate this flow.
| Description | Number | Details |
| --- | --- | --- |
| Captcha challenge | 4000000000001208 | The charge succeeds if the user correctly answers the captcha challenge. |
| Captcha challenge | 4000000000003725 | The charge succeeds if the user correctly answers the captcha challenge. |
## Simulate an in-person payment with a PIN
Use the test cards in this section to simulate successful in-person payments where a PIN is involved. There are many other options for testing in-person payments, including a simulated reader and physical test cards. See [Test Stripe Terminal](https://docs.stripe.com/terminal/references/testing.md) for more information.
#### Card numbers
| Description | Number | Details |
| --- | --- | --- |
| Offline PIN | 4001007020000002 | This card simulates a payment where the cardholder is prompted for and enters an \*offline PIN\* (Offline PIN is a card verification method for EMV chip cards. These cards store the PIN securely on the chip itself, so PIN verification can occur without a network connection). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `offline\_pin`. |
| Offline PIN retry | 4000008260000075 | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their \*offline PIN\* (Offline PIN is a card verification method for EMV chip cards. These cards store the PIN securely on the chip itself, so PIN verification can occur without a network connection). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `offline\_pin`. |
| Online PIN | 4001000360000005 | This card simulates a payment where the cardholder is prompted for and enters an \*online PIN\* (Online PIN is a card verification method for EMV chip cards. These cards require the terminal to contact the issuer over a network connection to verify the PIN). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `online\_pin`. |
| Online PIN retry | 4000002760000008 | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their \*online PIN\* (Online PIN is a card verification method for EMV chip cards. These cards require the terminal to contact the issuer over a network connection to verify the PIN). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `online\_pin`. |
#### PaymentMethods
| Description | Number | Details |
| --- | --- | --- |
| Offline PIN | `offline\_pin\_cvm` | This card simulates a payment where the cardholder is prompted for and enters an \*offline PIN\* (Offline PIN is a card verification method for EMV chip cards. These cards store the PIN securely on the chip itself, so PIN verification can occur without a network connection). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `offline\_pin`. |
| Offline PIN retry | `offline\_pin\_sca\_retry` | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their \*offline PIN\* (Offline PIN is a card verification method for EMV chip cards. These cards store the PIN securely on the chip itself, so PIN verification can occur without a network connection). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `offline\_pin`. |
| Online PIN | `online\_pin\_cvm` | This card simulates a payment where the cardholder is prompted for and enters an \*online PIN\* (Online PIN is a card verification method for EMV chip cards. These cards require the terminal to contact the issuer over a network connection to verify the PIN). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `online\_pin`. |
| Online PIN retry | `online\_pin\_sca\_retry` | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their \*online PIN\* (Online PIN is a card verification method for EMV chip cards. These cards require the terminal to contact the issuer over a network connection to verify the PIN). The resulting charge has [cardholder\_verification\_method](https://docs.stripe.com/api/charges/object.md#charge\_object-payment\_method\_details-card\_present-receipt-cardholder\_verification\_method) set to `online\_pin`. |
## Test a webhook or event destination
To test your webhook endpoint or [event destination](https://docs.stripe.com/event-destinations.md), choose one of these two options:
1. Perform actions in a sandbox that send legitimate events to your event destination. For example, to trigger the [charge.succeeded](https://docs.stripe.com/api.md#event\_types-charge.succeeded) event, you can use a [test card that produces a successful charge](https://docs.stripe.com/testing.md#cards).
2. [Trigger events using the Stripe CLI](https://docs.stripe.com/webhooks.md#test-webhook) or [using Stripe for Visual Studio Code](https://docs.stripe.com/stripe-vscode.md#webhooks).
## Rate limits
If your requests in your testing environments begin to receive `429` HTTP errors, make them less frequently. These errors come from our [rate limiter](https://docs.stripe.com/rate-limits.md), which is more strict in testing environments than in live mode.
We don’t recommend load testing your integration using the Stripe API in testing environments. Because the load limiter is stricter in testing environments, you might see errors that you wouldn’t see in production. See [load testing](https://docs.stripe.com/rate-limits.md#load-testing) for an alternative approach.
## Test a non-card payment method
When you use a test non-card payment method, use [test API keys](https://docs.stripe.com/keys.md#obtain-api-keys) in all API calls. This is true whether you’re serving a payment form you can test interactively or writing test code.
Different payment methods have different test procedures:
#### ACH Direct Debit
Learn how to test scenarios with instant verifications using [Financial Connections](https://docs.stripe.com/financial-connections/testing.md#web-how-to-use-test-accounts).
### Send transaction emails in a sandbox
After you collect the bank account details and accept a mandate, send the mandate confirmation and microdeposit verification emails in a \*sandbox\* (A sandbox is an isolated test environment that allows you to test Stripe functionality in your account without affecting your live integration. Use sandboxes to safely experiment with new features and changes).
If your domain is \*\*{domain}\*\* and your username is \*\*{username}\*\*, use the following email format to send test transaction emails: \*\*{username}+test\\_email@{domain}\*\*.
For example, if your domain is \*\*example.com\*\* and your username is \*\*info\*\*, use the format \*\*info+test\\_email@example.com\*\* for testing ACH Direct Debit payments. This format ensures that emails route correctly. If you don’t include the \*\*+test\\_email\*\* suffix, we won’t send the email.
> You must [set up your Stripe account](https://docs.stripe.com/get-started/account/set-up.md) before you can trigger these emails while testing.
### Test account numbers
Stripe provides several test account numbers and corresponding tokens you can use to make sure your integration for manually-entered bank accounts is ready for production.
| Account number | Token | Routing number | Behavior |
| --- | --- | --- | --- |
| `000123456789` | `pm\_usBankAccount\_success` | `110000000` | The payment succeeds. |
| `000111111113` | `pm\_usBankAccount\_accountClosed` | `110000000` | The payment fails because the account is closed. |
| `000000004954` | `pm\_usBankAccount\_riskLevelHighest` | `110000000` | The payment is blocked by Radar due to a [high risk of fraud](https://docs.stripe.com/radar/transaction-risk-prevention.md#high-risk). |
| `000111111116` | `pm\_usBankAccount\_noAccount` | `110000000` | The payment fails because no account is found. |
| `000222222227` | `pm\_usBankAccount\_insufficientFunds` | `110000000` | The payment fails due to insufficient funds. |
| `000333333335` | `pm\_usBankAccount\_debitNotAuthorized` | `110000000` | The payment fails because debits aren’t authorized. |
| `000444444440` | `pm\_usBankAccount\_invalidCurrency` | `110000000` | The payment fails due to invalid currency. |
| `000666666661` | `pm\_usBankAccount\_failMicrodeposits` | `110000000` | The payment fails to send microdeposits. |
| `000555555559` | `pm\_usBankAccount\_dispute` | `110000000` | The payment triggers a dispute. |
| `000000000009` | `pm\_usBankAccount\_processing` | `110000000` | The payment stays in processing indefinitely. Useful for testing [PaymentIntent cancellation](https://docs.stripe.com/api/payment\_intents/cancel.md). |
| `000777777771` | `pm\_usBankAccount\_weeklyLimitExceeded` | `110000000` | The payment fails due to payment amount causing the account to exceed its weekly payment volume limit. |
| `000888888885` | | `110000000` | The payment fails because of a deactivated [tokenized account number](https://docs.stripe.com/financial-connections/tokenized-account-numbers.md). |
Before test transactions can complete, you need to verify all test accounts that automatically succeed or fail the payment. To do so, use the test microdeposit amounts or descriptor codes below.
### Test microdeposit amounts and descriptor codes
To mimic different scenarios, use these microdeposit amounts \*or\* 0.01 descriptor code values.
| Microdeposit values | 0.01 descriptor code values | Scenario |
| --- | --- | --- |
| `32` and `45` | SM11AA | Simulates verifying the account. |
| `10` and `11` | SM33CC | Simulates exceeding the number of allowed verification attempts. |
| `40` and `41` | SM44DD | Simulates a microdeposit timeout. |
### Test settlement behavior
Test transactions settle instantly and are added to your available test balance. This behavior differs from livemode, where transactions can take [multiple days](https://docs.stripe.com/testing.md#timing) to settle in your available balance.
#### SEPA Direct Debit
Create a test `PaymentIntent` that either succeeds or fails by doing the following:
1. Create a test \*PaymentMethod\* (PaymentMethods represent your customer's payment instruments, used with the Payment Intents or Setup Intents APIs) with a test account number.
2. Use the resulting `PaymentMethod` in a `confirmSepaDebitPayment` request to create the test charge.
### AT
| Account Number | Token | Description |
| --- | --- | --- |
| AT611904300234573201 | pm\_sepaDebit\_success\_at | The PaymentIntent status transitions from `processing` to `succeeded`. |
| AT321904300235473204 | pm\_sepaDebit\_successDelayed\_at | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| AT861904300235473202 | pm\_sepaDebit\_failed\_at | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| AT051904300235473205 | pm\_sepaDebit\_failedDelayed\_at | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| AT591904300235473203 | pm\_sepaDebit\_disputed\_at | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| AT981904300000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_at | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| AT601904300000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_at | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| AT981904300002222227 | pm\_sepaDebit\_insufficientFunds\_at | The payment fails with an `insufficient\_funds` failure code. |
### BE
| Account Number | Token | Description |
| --- | --- | --- |
| BE62510007547061 | pm\_sepaDebit\_success\_be | The PaymentIntent status transitions from `processing` to `succeeded`. |
| BE78510007547064 | pm\_sepaDebit\_successDelayed\_be | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| BE68539007547034 | pm\_sepaDebit\_failed\_be | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| BE51510007547065 | pm\_sepaDebit\_failedDelayed\_be | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| BE08510007547063 | pm\_sepaDebit\_disputed\_be | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| BE90510000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_be | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| BE52510000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_be | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| BE90510002222227 | pm\_sepaDebit\_insufficientFunds\_be | The payment fails with an `insufficient\_funds` failure code. |
### HR
| Account Number | Token | Description |
| --- | --- | --- |
| HR7624020064583467589 | pm\_sepaDebit\_success\_hr | The PaymentIntent status transitions from `processing` to `succeeded`. |
| HR6323600002337876649 | pm\_sepaDebit\_successDelayed\_hr | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| HR2725000096983499248 | pm\_sepaDebit\_failed\_hr | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| HR6723600004878117427 | pm\_sepaDebit\_failedDelayed\_hr | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| HR8724840081455523553 | pm\_sepaDebit\_disputed\_hr | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| HR7424020060000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_hr | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| HR3624020060000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_hr | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| HR7424020060002222227 | pm\_sepaDebit\_insufficientFunds\_hr | The payment fails with an `insufficient\_funds` failure code. |
### EE
| Account Number | Token | Description |
| --- | --- | --- |
| EE382200221020145685 | pm\_sepaDebit\_success\_ee | The PaymentIntent status transitions from `processing` to `succeeded`. |
| EE222200221020145682 | pm\_sepaDebit\_successDelayed\_ee | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| EE762200221020145680 | pm\_sepaDebit\_failed\_ee | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| EE922200221020145683 | pm\_sepaDebit\_failedDelayed\_ee | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| EE492200221020145681 | pm\_sepaDebit\_disputed\_ee | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| EE672200000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_ee | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| EE292200000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_ee | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| EE672200000002222227 | pm\_sepaDebit\_insufficientFunds\_ee | The payment fails with an `insufficient\_funds` failure code. |
### FI
| Account Number | Token | Description |
| --- | --- | --- |
| FI2112345600000785 | pm\_sepaDebit\_success\_fi | The PaymentIntent status transitions from `processing` to `succeeded`. |
| FI3712345600000788 | pm\_sepaDebit\_successDelayed\_fi | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| FI9112345600000786 | pm\_sepaDebit\_failed\_fi | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| FI1012345600000789 | pm\_sepaDebit\_failedDelayed\_fi | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| FI6412345600000787 | pm\_sepaDebit\_disputed\_fi | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| FI6712345600343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_fi | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| FI2912345600121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_fi | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| FI6712345602222227 | pm\_sepaDebit\_insufficientFunds\_fi | The payment fails with an `insufficient\_funds` failure code. |
### FR
| Account Number | Token | Description |
| --- | --- | --- |
| FR1420041010050500013M02606 | pm\_sepaDebit\_success\_fr | The PaymentIntent status transitions from `processing` to `succeeded`. |
| FR3020041010050500013M02609 | pm\_sepaDebit\_successDelayed\_fr | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| FR8420041010050500013M02607 | pm\_sepaDebit\_failed\_fr | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| FR7920041010050500013M02600 | pm\_sepaDebit\_failedDelayed\_fr | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| FR5720041010050500013M02608 | pm\_sepaDebit\_disputed\_fr | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| FR9720041010050000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_fr | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| FR5920041010050000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_fr | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| FR9720041010050000002222227 | pm\_sepaDebit\_insufficientFunds\_fr | The payment fails with an `insufficient\_funds` failure code. |
### DE
| Account Number | Token | Description |
| --- | --- | --- |
| DE89370400440532013000 | pm\_sepaDebit\_success\_de | The PaymentIntent status transitions from `processing` to `succeeded`. |
| DE08370400440532013003 | pm\_sepaDebit\_successDelayed\_de | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| DE62370400440532013001 | pm\_sepaDebit\_failed\_de | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| DE78370400440532013004 | pm\_sepaDebit\_failedDelayed\_de | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| DE35370400440532013002 | pm\_sepaDebit\_disputed\_de | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| DE65370400440000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_de | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| DE27370400440000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_de | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| DE65370400440002222227 | pm\_sepaDebit\_insufficientFunds\_de | The payment fails with an `insufficient\_funds` failure code. |
### GI
| Account Number | Token | Description |
| --- | --- | --- |
| GI60MPFS599327643783385 | pm\_sepaDebit\_success\_gi | The PaymentIntent status transitions from `processing` to `succeeded`. |
| GI08RRNW626436291644533 | pm\_sepaDebit\_successDelayed\_gi | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| GI41SAFA461293238477751 | pm\_sepaDebit\_failed\_gi | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| GI50LROG772261344693297 | pm\_sepaDebit\_failedDelayed\_gi | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| GI26KJBC361883934534696 | pm\_sepaDebit\_disputed\_gi | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| GI14NWBK000000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_gi | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| GI73NWBK000000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_gi | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| GI14NWBK000000002222227 | pm\_sepaDebit\_insufficientFunds\_gi | The payment fails with an `insufficient\_funds` failure code. |
### IE
| Account Number | Token | Description |
| --- | --- | --- |
| IE29AIBK93115212345678 | pm\_sepaDebit\_success\_ie | The PaymentIntent status transitions from `processing` to `succeeded`. |
| IE24AIBK93115212345671 | pm\_sepaDebit\_successDelayed\_ie | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| IE02AIBK93115212345679 | pm\_sepaDebit\_failed\_ie | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| IE94AIBK93115212345672 | pm\_sepaDebit\_failedDelayed\_ie | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| IE51AIBK93115212345670 | pm\_sepaDebit\_disputed\_ie | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| IE10AIBK93115200343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_ie | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| IE69AIBK93115200121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_ie | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| IE10AIBK93115202222227 | pm\_sepaDebit\_insufficientFunds\_ie | The payment fails with an `insufficient\_funds` failure code. |
### LI
| Account Number | Token | Description |
| --- | --- | --- |
| LI0508800636123378777 | pm\_sepaDebit\_success\_li | The PaymentIntent status transitions from `processing` to `succeeded`. |
| LI4408800387787111369 | pm\_sepaDebit\_successDelayed\_li | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| LI1208800143823175626 | pm\_sepaDebit\_failed\_li | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| LI4908800356441975566 | pm\_sepaDebit\_failedDelayed\_li | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| LI7708800125525347723 | pm\_sepaDebit\_disputed\_li | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| LI2408800000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_li | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| LI8308800000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_li | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| LI2408800000002222227 | pm\_sepaDebit\_insufficientFunds\_li | The payment fails with an `insufficient\_funds` failure code. |
### LT
| Account Number | Token | Description |
| --- | --- | --- |
| LT121000011101001000 | pm\_sepaDebit\_success\_lt | The PaymentIntent status transitions from `processing` to `succeeded`. |
| LT281000011101001003 | pm\_sepaDebit\_successDelayed\_lt | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| LT821000011101001001 | pm\_sepaDebit\_failed\_lt | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| LT981000011101001004 | pm\_sepaDebit\_failedDelayed\_lt | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| LT551000011101001002 | pm\_sepaDebit\_disputed\_lt | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| LT591000000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_lt | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| LT211000000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_lt | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| LT591000000002222227 | pm\_sepaDebit\_insufficientFunds\_lt | The payment fails with an `insufficient\_funds` failure code. |
### LU
| Account Number | Token | Description |
| --- | --- | --- |
| LU280019400644750000 | pm\_sepaDebit\_success\_lu | The PaymentIntent status transitions from `processing` to `succeeded`. |
| LU440019400644750003 | pm\_sepaDebit\_successDelayed\_lu | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| LU980019400644750001 | pm\_sepaDebit\_failed\_lu | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| LU170019400644750004 | pm\_sepaDebit\_failedDelayed\_lu | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| LU710019400644750002 | pm\_sepaDebit\_disputed\_lu | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| LU900010000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_lu | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| LU520010000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_lu | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| LU900010000002222227 | pm\_sepaDebit\_insufficientFunds\_lu | The payment fails with an `insufficient\_funds` failure code. |
### NL
| Account Number | Token | Description |
| --- | --- | --- |
| NL39RABO0300065264 | pm\_sepaDebit\_success\_nl | The PaymentIntent status transitions from `processing` to `succeeded`. |
| NL55RABO0300065267 | pm\_sepaDebit\_successDelayed\_nl | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| NL91ABNA0417164300 | pm\_sepaDebit\_failed\_nl | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| NL28RABO0300065268 | pm\_sepaDebit\_failedDelayed\_nl | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| NL82RABO0300065266 | pm\_sepaDebit\_disputed\_nl | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| NL27RABO0000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_nl | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| NL86RABO0000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_nl | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| NL27RABO0002222227 | pm\_sepaDebit\_insufficientFunds\_nl | The payment fails with an `insufficient\_funds` failure code. |
### NO
| Account Number | Token | Description |
| --- | --- | --- |
| NO9386011117947 | pm\_sepaDebit\_success\_no | The PaymentIntent status transitions from `processing` to `succeeded`. |
| NO8886011117940 | pm\_sepaDebit\_successDelayed\_no | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| NO6686011117948 | pm\_sepaDebit\_failed\_no | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| NO6186011117941 | pm\_sepaDebit\_failedDelayed\_no | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| NO3986011117949 | pm\_sepaDebit\_disputed\_no | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| NO0586010343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_no | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| NO6486010121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_no | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| NO0586012222227 | pm\_sepaDebit\_insufficientFunds\_no | The payment fails with an `insufficient\_funds` failure code. |
### PT
| Account Number | Token | Description |
| --- | --- | --- |
| PT50000201231234567890154 | pm\_sepaDebit\_success\_pt | The PaymentIntent status transitions from `processing` to `succeeded`. |
| PT66000201231234567890157 | pm\_sepaDebit\_successDelayed\_pt | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| PT23000201231234567890155 | pm\_sepaDebit\_failed\_pt | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| PT39000201231234567890158 | pm\_sepaDebit\_failedDelayed\_pt | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| PT93000201231234567890156 | pm\_sepaDebit\_disputed\_pt | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| PT05000201230000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_pt | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| PT64000201230000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_pt | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| PT05000201230000002222227 | pm\_sepaDebit\_insufficientFunds\_pt | The payment fails with an `insufficient\_funds` failure code. |
### ES
| Account Number | Token | Description |
| --- | --- | --- |
| ES0700120345030000067890 | pm\_sepaDebit\_success\_es | The PaymentIntent status transitions from `processing` to `succeeded`. |
| ES2300120345030000067893 | pm\_sepaDebit\_successDelayed\_es | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| ES9121000418450200051332 | pm\_sepaDebit\_failed\_es | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| ES9300120345030000067894 | pm\_sepaDebit\_failedDelayed\_es | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| ES5000120345030000067892 | pm\_sepaDebit\_disputed\_es | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| ES1700120345000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_es | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| ES7600120345000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_es | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| ES1700120345000002222227 | pm\_sepaDebit\_insufficientFunds\_es | The payment fails with an `insufficient\_funds` failure code. |
### SE
| Account Number | Token | Description |
| --- | --- | --- |
| SE3550000000054910000003 | pm\_sepaDebit\_success\_se | The PaymentIntent status transitions from `processing` to `succeeded`. |
| SE5150000000054910000006 | pm\_sepaDebit\_successDelayed\_se | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| SE0850000000054910000004 | pm\_sepaDebit\_failed\_se | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| SE2450000000054910000007 | pm\_sepaDebit\_failedDelayed\_se | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| SE7850000000054910000005 | pm\_sepaDebit\_disputed\_se | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| SE2850000000000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_se | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| SE8750000000000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_se | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| SE2850000000000002222227 | pm\_sepaDebit\_insufficientFunds\_se | The payment fails with an `insufficient\_funds` failure code. |
### CH
| Account Number | Token | Description |
| --- | --- | --- |
| CH9300762011623852957 | pm\_sepaDebit\_success\_ch | The PaymentIntent status transitions from `processing` to `succeeded`. |
| CH8656663438253651553 | pm\_sepaDebit\_successDelayed\_ch | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| CH5362200119938136497 | pm\_sepaDebit\_failed\_ch | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| CH1843597160341964438 | pm\_sepaDebit\_failedDelayed\_ch | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| CH1260378413965193069 | pm\_sepaDebit\_disputed\_ch | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| CH1800762000000343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_ch | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| CH7700762000000121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_ch | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| CH1800762000002222227 | pm\_sepaDebit\_insufficientFunds\_ch | The payment fails with an `insufficient\_funds` failure code. |
### GB
| Account Number | Token | Description |
| --- | --- | --- |
| GB82WEST12345698765432 | pm\_sepaDebit\_success\_gb | The PaymentIntent status transitions from `processing` to `succeeded`. |
| GB98WEST12345698765435 | pm\_sepaDebit\_successDelayed\_gb | The PaymentIntent status transitions from `processing` to `succeeded` after at least three minutes. |
| GB55WEST12345698765433 | pm\_sepaDebit\_failed\_gb | The PaymentIntent status transitions from `processing` to `requires\_payment\_method`. |
| GB71WEST12345698765436 | pm\_sepaDebit\_failedDelayed\_gb | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` after at least three minutes. |
| GB28WEST12345698765434 | pm\_sepaDebit\_disputed\_gb | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| GB70WEST12345600343434 | pm\_sepaDebit\_exceedsWeeklyVolumeLimit\_gb | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to payment amount causing account to exceed its weekly payment volume limit. |
| GB32WEST12345600121212 | pm\_sepaDebit\_exceedsWeeklyTransactionLimit\_gb | The payment fails with a `charge\_exceeds\_weekly\_limit` failure code due to payment amount exceeding account's transaction volume limit. |
| GB70WEST12345602222227 | pm\_sepaDebit\_insufficientFunds\_gb | The payment fails with an `insufficient\_funds` failure code. |
#### BACS Direct Debit
There are several [test bank account numbers](https://docs.stripe.com/keys.md#test-live-modes) you can use in a \*sandbox\* (A sandbox is an isolated test environment that allows you to test Stripe functionality in your account without affecting your live integration. Use sandboxes to safely experiment with new features and changes) to make sure this integration is ready. You can also use the corresponding token to skip manually entering bank account details.
| Sort code | Account number | Token | Description |
| --- | --- | --- | --- |
| `108800` | `00012345` | `pm\_bacsDebit\_success` | The payment succeeds and the PaymentIntent transitions from `processing` to `succeeded`. |
| `108800` | `90012345` | `pm\_bacsDebit\_successDelayed` | The payment succeeds after three minutes and the PaymentIntent transitions from `processing` to `succeeded`. |
| `108800` | `33333335` | `pm\_bacsDebit\_debitNotAuthorized` | The payment is accepted but then immediately fails with a `debit\_not\_authorized` failure code and the PaymentIntent transitions from `processing` to `requires\_payment\_method`. The Mandate becomes `inactive` and the PaymentMethod can’t be used again. |
| `108800` | `93333335` | `pm\_bacsDebit\_debitNotAuthorizedDelayed` | The payment fails after three minutes with a `debit\_not\_authorized` failure code and the PaymentIntent transitions from `processing` to `requires\_payment\_method`. The Mandate becomes `inactive` and the PaymentMethod can’t be used again. |
| `108800` | `22222227` | `pm\_bacsDebit\_insufficientFunds` | The payment fails with an `insufficient\_funds` failure code and the PaymentIntent transitions from `processing` to `requires\_payment\_method`. The Mandate remains `active` and the PaymentMethod can be used again. |
| `108800` | `92222227` | `pm\_bacsDebit\_insufficientFundsDelayed` | The payment fails after three minutes with an `insufficient\_funds` failure code and the PaymentIntent transitions from `processing` to `requires\_payment\_method`. The Mandate remains `active` and the PaymentMethod can be used again. |
| `108800` | `55555559` | `pm\_bacsDebit\_dispute` | The payment succeeds after three minutes and the PaymentIntent transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| `108800` | `00033333` | `pm\_bacsDebit\_mandateRefused` | Payment Method creation succeeds, but the Mandate is refused by the customer’s bank and immediately transitions to `inactive`. |
| `108800` | `00044444` | — | The request to set up Bacs Direct Debit fails immediately due to an invalid account number and the customer is prompted to update their information before submitting. Payment details aren’t collected, so no synthetic token corresponds to this scenario. |
| `108800` | `34343434` | `pm\_bacsDebit\_exceedsWeeklyLimit` | The payment fails with a `charge\_exceeds\_source\_limit` failure code due to the payment amount causing the account to exceed its weekly payment volume limit. |
| `108800` | `12121212` | `pm\_bacsDebit\_exceedsTransactionLimit` | The payment fails with a `charge\_exceeds\_transaction\_limit` failure code due to the payment amount exceeding the account’s transaction volume limit. |
You can test using any of the account numbers provided above. However, because Bacs Direct Debit payments take several days to process, use the test account numbers that operate on a three-minute delay to better simulate the behavior of live payments.
> By default, Stripe automatically sends [emails](https://docs.stripe.com/payments/payment-methods/bacs-debit.md#debit-notifications) to the customer when payment details are initially collected and each time a debit will be made on their account. These notifications aren’t sent in sandboxes.
#### AU BECS Direct Debit
You can create a test `PaymentIntent` that either succeeds or fails by doing the following:
Create a test \*PaymentMethod\* (PaymentMethods represent your customer's payment instruments, used with the Payment Intents or Setup Intents APIs) with the test `BSB 000000` and a test account number from the list below. Use the resulting `PaymentMethod` in a `confirmAuBecsDebitPayment` request to create the test charge.
### Test account numbers
| BSB Number | Account number | Token | Description |
| --- | --- | --- | --- |
| `000000` | `000123456` | `pm\_auBecsDebit\_success` | The PaymentIntent status transitions from `processing` to `succeeded`. The mandate status remains `active`. |
| `000000` | `900123456` | `pm\_auBecsDebit\_successDelayed` | The PaymentIntent status transitions from `processing` to `succeeded` (with a three-minute delay). The mandate status remains `active`. |
| `000000` | `111111113` | `pm\_auBecsDebit\_accountClosed` | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` with an `account\_closed` failure code. The mandate status becomes `inactive`. |
| `000000` | `111111116` | `pm\_auBecsDebit\_noAccount` | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` with a `no\_account` failure code. The mandate status becomes `inactive`. |
| `000000` | `222222227` | `pm\_auBecsDebit\_referToCustomer` | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` with a `refer\_to\_customer` failure code. The mandate status remains `active`. |
| `000000` | `922222227` | `pm\_auBecsDebit\_referToCustomerDelayed` | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` with a `refer\_to\_customer` failure code (with a three-minute delay). The mandate status remains `active`. |
| `000000` | `333333335` | `pm\_auBecsDebit\_debitNotAuthorized` | The PaymentIntent status transitions from `processing` to `requires\_payment\_method` with a `debit\_not\_authorized` failure code. The mandate status becomes `inactive`. |
| `000000` | `666666660` | `pm\_auBecsDebit\_dispute` | The PaymentIntent status transitions from `processing` to `succeeded`, but a dispute is immediately created. |
| `000000` | `343434343` | `pm\_auBecsDebit\_exceedsWeeklyLimit` | The PaymentIntent fails with a `charge\_exceeds\_source\_limit` error due to the payment amount causing the account to exceed its weekly payment volume limit. |
| `000000` | `121212121` | `pm\_auBecsDebit\_exceedsTransactionLimit` | The PaymentIntent fails with a `charge\_exceeds\_transaction\_limit` error due to the payment amount exceeding the account’s transaction volume limit. |
#### Others
With other payment methods, testing information is included with the documentation. [Find your payment method](https://docs.stripe.com/payments/payment-methods/overview.md) and read the associated guide to accept and test payments.
## Test Link
> Don’t store real user data in \*sandbox\* (A sandbox is an isolated test environment that allows you to test Stripe functionality in your account without affecting your live integration. Use sandboxes to safely experiment with new features and changes) Link accounts. Treat them as if they’re publicly available, because these test accounts are associated with your publishable key.
Currently, Link only works with credit cards, debit cards, and qualified US bank account purchases. Link requires [domain registration](https://docs.stripe.com/payments/payment-methods/pmd-registration.md).
You can create sandbox accounts for Link using any valid email address. The following table shows the fixed one-time passcode values that Stripe accepts for authenticating sandbox accounts:
| Value | Outcome |
| --- | --- |
| Any other 6 digits not listed below | Success |
| 000001 | Error, code invalid |
| 000002 | Error, code expired |
| 000003 | Error, max attempts exceeded |
### Multiple funding sources
As Stripe adds additional funding source support, you don’t need to update your integration. Stripe automatically supports them with the same transaction settlement time and guarantees as card and bank account payments.
## Test a redirect-based flow
To test your integration’s redirect-handling logic by simulating a payment that uses a redirect flow (for example, iDEAL), use a supported payment method that [requires redirects](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#additional-api-supportability).
To create a test `PaymentIntent` that either succeeds or fails:
1. Go to the [payment methods settings in the Dashboard](https://dashboard.stripe.com/settings/payment\_methods) and enable a supported payment method by clicking \*\*Turn on\*\* in your testing environment.
2. Collect payment details.
3. Submit the payment to Stripe.
4. Authorize or fail the test payment.
Make sure that the page (corresponding to `return\_url`) on your website provides the status of the payment.
## See also
- [Testing your Connect integration](https://docs.stripe.com/connect/testing.md)
- [Testing your Billing integration](https://docs.stripe.com/billing/testing.md)
- [Testing your Terminal integration](https://docs.stripe.com/terminal/references/testing.md)
- [Load testing](https://docs.stripe.com/rate-limits.md#load-testing)
