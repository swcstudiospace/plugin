# Get Balance

Source: https://docs.parallel.ai/service-api/balance/get-balance.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# Get Balance
> Get the authenticated organization's prepaid credit balance
## OpenAPI
````yaml https://api.parallel.ai/account/service/openapi.json get /service/v1/balance
openapi: 3.1.0
info:
title: FastAPI
version: 0.1.0
servers:
- url: https://api.parallel.ai/account
description: Parallel Account API
security: []
tags:
- name: Apps
description: Application management endpoints
- name: Keys
description: API key management endpoints
- name: Balance
description: Organization balance endpoints
- name: Service
description: Service utility endpoints
paths:
/service/v1/balance:
get:
tags:
- Balance
summary: Get Balance
description: Get the authenticated organization's prepaid credit balance
operationId: get\_balance\_service\_v1\_balance\_get
responses:
'200':
description: Successful Response
content:
application/json:
schema:
$ref: '#/components/schemas/BalanceResponse'
security:
- BearerAuth: []
components:
schemas:
BalanceResponse:
properties:
org\_id:
type: string
title: Org Id
description: Organization ID
credit\_balance\_cents:
type: number
title: Credit Balance Cents
description: >-
Total available prepaid balance in cents (credits + prepaid
commits). Always 0 when will\_invoice is true.
pending\_debit\_balance\_cents:
type: number
title: Pending Debit Balance Cents
description: >-
Balance in cents currently held for inflight tasks plus charges not
yet synced to the billing provider. Always 0 when will\_invoice is
true.
will\_invoice:
type: boolean
title: Will Invoice
description: >-
True if this organization is billed by invoice (postpaid) rather
than from a prepaid credit balance. Invoice-only orgs cannot add
balance via this API.
type: object
required:
- org\_id
- credit\_balance\_cents
- pending\_debit\_balance\_cents
- will\_invoice
title: BalanceResponse
description: Balance response for service clients.
securitySchemes:
BearerAuth:
type: http
scheme: bearer
bearerFormat: JWT
description: >-
Send `Authorization: Bearer `. This must be an account API
access token minted via Parallel's OAuth device flow, not a standard API
key. See the [account API docs](/integrations/account-api).
````
