# List Apps

Source: https://docs.parallel.ai/service-api/apps/list-apps.md

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.parallel.ai/llms.txt
> Use this file to discover all available pages before exploring further.
# List Apps
> List all apps for the authenticated organization
## OpenAPI
````yaml https://api.parallel.ai/account/service/openapi.json get /service/v1/apps
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
/service/v1/apps:
get:
tags:
- Apps
summary: List Apps
description: List all apps for the authenticated organization
operationId: list\_apps\_service\_v1\_apps\_get
responses:
'200':
description: Successful Response
content:
application/json:
schema:
$ref: '#/components/schemas/GetAppsForOrgResponseModel'
security:
- BearerAuth: []
components:
schemas:
GetAppsForOrgResponseModel:
properties:
apps:
items:
$ref: '#/components/schemas/AppItem'
type: array
title: Apps
description: List of apps
type: object
required:
- apps
title: GetAppsForOrgResponseModel
description: Model for getting apps for organization response.
AppItem:
properties:
app\_name:
type: string
title: App Name
description: App name
org\_name:
type: string
title: Org Name
description: Organization name
app\_id:
type: string
title: App Id
description: App ID
org\_id:
type: string
title: Org Id
description: Organization ID
type: object
required:
- app\_name
- org\_name
- app\_id
- org\_id
title: AppItem
description: Model for an application item.
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
