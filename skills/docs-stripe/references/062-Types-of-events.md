# Types of events

Source: https://docs.stripe.com/api/events/types.md

# Types of events
This is a list of all public snapshot events we currently send for /v1 resources, which is continually evolving and expanding.
Stripe events use the `resource.event` naming convention. Events that occur on subresources like `customer.subscription.updated` don’t trigger a corresponding event for the parent resource (`customer.updated`).
Stripe creates event types marked as \*\*Selection required\*\* only when at least one [webhook](https://docs.stripe.com/webhooks.md) is listening for it. A webhook set to listen to all events doesn’t satisfy this requirement and won’t generate \*\*Selection required\*\* event types.
## Event types
- `account.application.authorized`
`data.object` is one of: `application`
Occurs whenever a user authorizes an application. Sent to the related application only.
- `account.application.deauthorized`
`data.object` is one of: `application`
Occurs whenever a user deauthorizes an application. Sent to the related application only.
- `account.external\_account.created`
`data.object` is one of: `alipay\_account`, [`bank\_account`](https://docs.stripe.com/api#customer\_bank\_account\_object), `bitcoin\_receiver`, [`card`](https://docs.stripe.com/api#card\_object), [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object), `blockchain\_address`
Occurs whenever an external account is created.
- `account.external\_account.deleted`
`data.object` is one of: `alipay\_account`, [`bank\_account`](https://docs.stripe.com/api#customer\_bank\_account\_object), `bitcoin\_receiver`, [`card`](https://docs.stripe.com/api#card\_object), [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object), `blockchain\_address`
Occurs whenever an external account is deleted.
- `account.external\_account.updated`
`data.object` is one of: `alipay\_account`, [`bank\_account`](https://docs.stripe.com/api#customer\_bank\_account\_object), `bitcoin\_receiver`, [`card`](https://docs.stripe.com/api#card\_object), [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object), `blockchain\_address`
Occurs whenever an external account is updated.
- `account.updated`
`data.object` is one of: [`account`](https://docs.stripe.com/api#account\_object)
Occurs whenever an account status or property has changed.
- `application\_fee.created`
`data.object` is one of: [`application\_fee`](https://docs.stripe.com/api#application\_fee\_object)
Occurs whenever an application fee is created on a charge.
- `application\_fee.refund.updated`
`data.object` is one of: [`fee\_refund`](https://docs.stripe.com/api#fee\_refund\_object)
Occurs whenever an application fee refund is updated.
- `application\_fee.refunded`
`data.object` is one of: [`application\_fee`](https://docs.stripe.com/api#application\_fee\_object)
Occurs whenever an application fee is refunded, whether from refunding a charge or from [refunding the application fee directly](https://docs.stripe.com/api/events/types.md#fee\_refunds). This includes partial refunds.
- `balance\_settings.updated`
`data.object` is one of: [`balance\_settings`](https://docs.stripe.com/api#balance\_settings\_object)
Occurs whenever a balance settings status or property has changed.
- `balance.available`
`data.object` is one of: [`balance`](https://docs.stripe.com/api#balance\_object)
Occurs whenever your Stripe balance has been updated (e.g., when a charge is available to be paid out). By default, Stripe automatically transfers funds in your balance to your bank account on a daily basis. This event is not fired for negative transactions.
- `billing\_portal.configuration.created`
`data.object` is one of: [`billing\_portal.configuration`](https://docs.stripe.com/api#portal\_configuration\_object)
Occurs whenever a portal configuration is created.
- `billing\_portal.configuration.updated`
`data.object` is one of: [`billing\_portal.configuration`](https://docs.stripe.com/api#portal\_configuration\_object)
Occurs whenever a portal configuration is updated.
- `billing\_portal.session.created`
`data.object` is one of: [`billing\_portal.session`](https://docs.stripe.com/api#portal\_session\_object)
Occurs whenever a portal session is created.
- `billing.alert.triggered`
`data.object` is one of: `billing.alert\_triggered`
Occurs whenever your custom alert threshold is met.
- `billing.credit\_balance\_transaction.created`
`data.object` is one of: [`billing.credit\_balance\_transaction`](https://docs.stripe.com/api#billing\_credit\_balance\_transaction\_object)
Occurs when a credit balance transaction is created
- `billing.credit\_grant.created`
`data.object` is one of: [`billing.credit\_grant`](https://docs.stripe.com/api#billing\_credit\_grant\_object)
Occurs when a credit grant is created
- `billing.credit\_grant.updated`
`data.object` is one of: [`billing.credit\_grant`](https://docs.stripe.com/api#billing\_credit\_grant\_object)
Occurs when a credit grant is updated
- `billing.meter.created`
`data.object` is one of: [`billing.meter`](https://docs.stripe.com/api#billing\_meter\_object)
Occurs when a meter is created
- `billing.meter.deactivated`
`data.object` is one of: [`billing.meter`](https://docs.stripe.com/api#billing\_meter\_object)
Occurs when a meter is deactivated
- `billing.meter.reactivated`
`data.object` is one of: [`billing.meter`](https://docs.stripe.com/api#billing\_meter\_object)
Occurs when a meter is reactivated
- `billing.meter.updated`
`data.object` is one of: [`billing.meter`](https://docs.stripe.com/api#billing\_meter\_object)
Occurs when a meter is updated
- `capability.updated`
`data.object` is one of: [`capability`](https://docs.stripe.com/api#capability\_object)
Occurs whenever a capability has new requirements or a new status.
- `cash\_balance.funds\_available`
`data.object` is one of: [`cash\_balance`](https://docs.stripe.com/api#cash\_balance\_object)
Occurs whenever there is a positive remaining cash balance after Stripe automatically reconciles new funds into the cash balance. If you enabled manual reconciliation, this webhook will fire whenever there are new funds into the cash balance.
- `charge.captured`
`data.object` is one of: [`charge`](https://docs.stripe.com/api#charge\_object)
Occurs whenever a previously uncaptured charge is captured.
- `charge.dispute.closed`
`data.object` is one of: [`dispute`](https://docs.stripe.com/api#dispute\_object)
Occurs when a dispute is closed and the dispute status changes to `lost`, `warning\_closed`, or `won`.
- `charge.dispute.created`
`data.object` is one of: [`dispute`](https://docs.stripe.com/api#dispute\_object)
Occurs whenever a customer disputes a charge with their bank.
- `charge.dispute.funds\_reinstated`
`data.object` is one of: [`dispute`](https://docs.stripe.com/api#dispute\_object)
Occurs when funds are reinstated to your account after a dispute is closed. This includes [partially refunded payments](https://docs.stripe.com/disputes.md#disputes-on-partially-refunded-payments).
- `charge.dispute.funds\_withdrawn`
`data.object` is one of: [`dispute`](https://docs.stripe.com/api#dispute\_object)
Occurs when funds are removed from your account due to a dispute.
- `charge.dispute.updated`
`data.object` is one of: [`dispute`](https://docs.stripe.com/api#dispute\_object)
Occurs when the dispute is updated (usually with evidence).
- `charge.expired`
`data.object` is one of: [`charge`](https://docs.stripe.com/api#charge\_object)
Occurs whenever an uncaptured charge expires.
- `charge.failed`
`data.object` is one of: [`charge`](https://docs.stripe.com/api#charge\_object)
Occurs whenever a failed charge attempt occurs.
- `charge.pending`
`data.object` is one of: [`charge`](https://docs.stripe.com/api#charge\_object)
Occurs whenever a pending charge is created.
- `charge.refund.updated`
`data.object` is one of: [`refund`](https://docs.stripe.com/api#refund\_object)
Occurs whenever a refund is updated on selected payment methods. For updates on all refunds, listen to `refund.updated` instead.
- `charge.refunded`
`data.object` is one of: [`charge`](https://docs.stripe.com/api#charge\_object)
Occurs whenever a charge is refunded, including partial refunds. Listen to `refund.created` for information about the refund.
- `charge.succeeded`
`data.object` is one of: [`charge`](https://docs.stripe.com/api#charge\_object)
Occurs whenever a charge is successful.
- `charge.updated`
`data.object` is one of: [`charge`](https://docs.stripe.com/api#charge\_object)
Occurs whenever a charge description or metadata is updated, or upon an asynchronous capture.
- `checkout.session.async\_payment\_failed`
`data.object` is one of: [`checkout.session`](https://docs.stripe.com/api#checkout\_session\_object)
Occurs when a payment intent using a delayed payment method fails.
- `checkout.session.async\_payment\_succeeded`
`data.object` is one of: [`checkout.session`](https://docs.stripe.com/api#checkout\_session\_object)
Occurs when a payment intent using a delayed payment method finally succeeds.
- `checkout.session.completed`
`data.object` is one of: [`checkout.session`](https://docs.stripe.com/api#checkout\_session\_object)
Occurs when a Checkout Session has been successfully completed.
- `checkout.session.expired`
`data.object` is one of: [`checkout.session`](https://docs.stripe.com/api#checkout\_session\_object)
Occurs when a Checkout Session is expired.
- `climate.order.canceled`
`data.object` is one of: [`climate.order`](https://docs.stripe.com/api#climate\_order\_object)
Occurs when a Climate order is canceled.
- `climate.order.created`
`data.object` is one of: [`climate.order`](https://docs.stripe.com/api#climate\_order\_object)
Occurs when a Climate order is created.
- `climate.order.delayed`
`data.object` is one of: [`climate.order`](https://docs.stripe.com/api#climate\_order\_object)
Occurs when a Climate order is delayed.
- `climate.order.delivered`
`data.object` is one of: [`climate.order`](https://docs.stripe.com/api#climate\_order\_object)
Occurs when a Climate order is delivered.
- `climate.order.product\_substituted`
`data.object` is one of: [`climate.order`](https://docs.stripe.com/api#climate\_order\_object)
Occurs when a Climate order’s product is substituted for another.
- `climate.product.created`
`data.object` is one of: [`climate.product`](https://docs.stripe.com/api#climate\_product\_object)
Occurs when a Climate product is created.
- `climate.product.pricing\_updated`
`data.object` is one of: [`climate.product`](https://docs.stripe.com/api#climate\_product\_object)
Occurs when a Climate product is updated.
- `coupon.created`
`data.object` is one of: [`coupon`](https://docs.stripe.com/api#coupon\_object)
Occurs whenever a coupon is created.
- `coupon.deleted`
`data.object` is one of: [`coupon`](https://docs.stripe.com/api#coupon\_object)
Occurs whenever a coupon is deleted.
- `coupon.updated`
`data.object` is one of: [`coupon`](https://docs.stripe.com/api#coupon\_object)
Occurs whenever a coupon is updated.
- `credit\_note.created`
`data.object` is one of: [`credit\_note`](https://docs.stripe.com/api#credit\_note\_object)
Occurs whenever a credit note is created.
- `credit\_note.updated`
`data.object` is one of: [`credit\_note`](https://docs.stripe.com/api#credit\_note\_object)
Occurs whenever a credit note is updated.
- `credit\_note.voided`
`data.object` is one of: [`credit\_note`](https://docs.stripe.com/api#credit\_note\_object)
Occurs whenever a credit note is voided.
- `customer\_cash\_balance\_transaction.created`
`data.object` is one of: [`customer\_cash\_balance\_transaction`](https://docs.stripe.com/api#customer\_cash\_balance\_transaction\_object)
Occurs whenever a new customer cash balance transactions is created.
- `customer.created`
`data.object` is one of: [`customer`](https://docs.stripe.com/api#customer\_object)
Occurs whenever a new customer is created.
- `customer.deleted`
`data.object` is one of: [`customer`](https://docs.stripe.com/api#customer\_object)
Occurs whenever a customer is deleted.
- `customer.discount.created`
`data.object` is one of: [`discount`](https://docs.stripe.com/api#discount\_object)
Occurs whenever a coupon is attached to a customer.
- `customer.discount.deleted`
`data.object` is one of: [`discount`](https://docs.stripe.com/api#discount\_object)
Occurs whenever a coupon is removed from a customer.
- `customer.discount.updated`
`data.object` is one of: [`discount`](https://docs.stripe.com/api#discount\_object)
Occurs whenever a customer is switched from one coupon to another.
- `customer.source.created`
`data.object` is one of: `alipay\_account`, [`bank\_account`](https://docs.stripe.com/api#customer\_bank\_account\_object), `bitcoin\_receiver`, [`card`](https://docs.stripe.com/api#card\_object), [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever a new source is created for a customer.
- `customer.source.deleted`
`data.object` is one of: `alipay\_account`, [`bank\_account`](https://docs.stripe.com/api#customer\_bank\_account\_object), `bitcoin\_receiver`, [`card`](https://docs.stripe.com/api#card\_object), [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever a source is removed from a customer.
- `customer.source.expiring`
`data.object` is one of: [`card`](https://docs.stripe.com/api#card\_object), [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever a card or source will expire at the end of the month. This event only works with legacy integrations using Card or Source objects. If you use the PaymentMethod API, this event won’t occur.
- `customer.source.updated`
`data.object` is one of: `alipay\_account`, [`bank\_account`](https://docs.stripe.com/api#customer\_bank\_account\_object), `bitcoin\_receiver`, [`card`](https://docs.stripe.com/api#card\_object), [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever a source’s details are changed.
- `customer.subscription.created`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs whenever a customer is signed up for a new plan.
- `customer.subscription.deleted`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs whenever a customer’s subscription ends.
- `customer.subscription.paused`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs whenever a customer’s subscription is paused. Only applies when subscriptions enter `status=paused`, not when [payment collection](https://docs.stripe.com/billing/subscriptions/pause.md) is paused.
- `customer.subscription.pending\_update\_applied`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs whenever a customer’s subscription’s pending update is applied, and the subscription is updated.
- `customer.subscription.pending\_update\_expired`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs whenever a customer’s subscription’s pending update expires before the related invoice is paid.
- `customer.subscription.resumed`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs whenever a customer’s subscription is no longer paused. Only applies when a `status=paused` subscription is [resumed](https://docs.stripe.com/api/subscriptions/resume.md), not when [payment collection](https://docs.stripe.com/billing/subscriptions/pause.md) is resumed.
- `customer.subscription.trial\_will\_end`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs three days before a subscription’s trial period is scheduled to end, or immediately when a trial is ended early (for example, with `trial\_end=now` or when a Customer Portal plan change ends a trial). If a trial is shortened so that fewer than three days remain, this event can fire immediately, including during the same transaction that collects payment. Before sending payment-reminder communications from this webhook, check the subscription status and latest invoice to determine whether payment has already been collected.
- `customer.subscription.updated`
`data.object` is one of: [`subscription`](https://docs.stripe.com/api#subscription\_object)
Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active).
- `customer.tax\_id.created`
`data.object` is one of: [`tax\_id`](https://docs.stripe.com/api#tax\_id\_object)
Occurs whenever a tax ID is created for a customer.
- `customer.tax\_id.deleted`
`data.object` is one of: [`tax\_id`](https://docs.stripe.com/api#tax\_id\_object)
Occurs whenever a tax ID is deleted from a customer.
- `customer.tax\_id.updated`
`data.object` is one of: [`tax\_id`](https://docs.stripe.com/api#tax\_id\_object)
Occurs whenever a customer’s tax ID is updated.
- `customer.updated`
`data.object` is one of: [`customer`](https://docs.stripe.com/api#customer\_object)
Occurs whenever any property of a customer changes.
- `entitlements.active\_entitlement\_summary.updated`
`data.object` is one of: `entitlements.active\_entitlement\_summary`
Occurs whenever a customer’s entitlements change.
- `file.created`
`data.object` is one of: [`file`](https://docs.stripe.com/api#file\_object)
Occurs whenever a new Stripe-generated file is available for your account.
- `financial\_connections.account.account\_numbers\_updated`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when a Financial Connections account’s account numbers are updated.
- `financial\_connections.account.created`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when a new Financial Connections account is created.
- `financial\_connections.account.deactivated`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when a Financial Connections account’s status is updated from `active` to `inactive`.
- `financial\_connections.account.disconnected`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when a Financial Connections account is disconnected.
- `financial\_connections.account.expected\_deactivation\_date\_updated`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when a Financial Connections account’s `expected\_deactivation\_date` changes.
- `financial\_connections.account.reactivated`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when a Financial Connections account’s status is updated from `inactive` to `active`.
- `financial\_connections.account.refreshed\_balance`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when an Account’s `balance\_refresh` status transitions from `pending` to either `succeeded` or `failed`.
- `financial\_connections.account.refreshed\_ownership`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when an Account’s `ownership\_refresh` status transitions from `pending` to either `succeeded` or `failed`.
- `financial\_connections.account.refreshed\_transactions`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when an Account’s `transaction\_refresh` status transitions from `pending` to either `succeeded` or `failed`.
- `financial\_connections.account.upcoming\_account\_number\_expiry`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when an Account’s tokenized account number is about to expire.
- `financial\_connections.account.upcoming\_deactivation`
`data.object` is one of: [`financial\_connections.account`](https://docs.stripe.com/api#financial\_connections\_account\_object)
Occurs when a Financial Connections account is about to become `inactive`.
- `financial\_connections.authorization.expected\_deactivation\_date\_updated`
`data.object` is one of: [`financial\_connections.authorization`](https://docs.stripe.com/api#financial\_connections\_authorization\_object)
Occurs when a Financial Connections authorization’s `expected\_deactivation\_date` changes.
- `financial\_connections.authorization.upcoming\_deactivation`
`data.object` is one of: [`financial\_connections.authorization`](https://docs.stripe.com/api#financial\_connections\_authorization\_object)
Occurs when a Financial Connections authorization is about to become `inactive`.
- `identity.verification\_session.canceled`
`data.object` is one of: [`identity.verification\_session`](https://docs.stripe.com/api#identity\_verification\_session\_object)
Occurs whenever a VerificationSession is canceled
- `identity.verification\_session.created`
`data.object` is one of: [`identity.verification\_session`](https://docs.stripe.com/api#identity\_verification\_session\_object)
Occurs whenever a VerificationSession is created
- `identity.verification\_session.processing`
`data.object` is one of: [`identity.verification\_session`](https://docs.stripe.com/api#identity\_verification\_session\_object)
Occurs whenever a VerificationSession transitions to processing
- `identity.verification\_session.redacted` [requires explicit opt-in]
`data.object` is one of: [`identity.verification\_session`](https://docs.stripe.com/api#identity\_verification\_session\_object)
Occurs whenever a VerificationSession is redacted.
- `identity.verification\_session.requires\_input`
`data.object` is one of: [`identity.verification\_session`](https://docs.stripe.com/api#identity\_verification\_session\_object)
Occurs whenever a VerificationSession transitions to require user input
- `identity.verification\_session.verified`
`data.object` is one of: [`identity.verification\_session`](https://docs.stripe.com/api#identity\_verification\_session\_object)
Occurs whenever a VerificationSession transitions to verified
- `invoice\_payment.paid`
`data.object` is one of: [`invoice\_payment`](https://docs.stripe.com/api#invoice\_payment\_object)
Occurs when an InvoicePayment is successfully paid.
- `invoice.created`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever a new invoice is created. To learn how webhooks can be used with this event, and how they can affect it, see [Using Webhooks with Subscriptions](https://docs.stripe.com/subscriptions/webhooks.md).
- `invoice.deleted`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever a draft invoice is deleted. Note: This event is not sent for [invoice previews](https://docs.stripe.com/api/invoices/create\_preview.md).
- `invoice.finalization\_failed`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever a draft invoice cannot be finalized. See the invoice’s [last finalization error](https://docs.stripe.com/api/invoices/object.md#invoice\_object-last\_finalization\_error) for details.
- `invoice.finalized`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever a draft invoice is finalized and updated to be an open invoice.
- `invoice.marked\_uncollectible`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice is marked uncollectible.
- `invoice.overdue`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs X number of days after an invoice becomes due—where X is determined by Automations
- `invoice.overpaid`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs when an invoice transitions to paid with a non-zero amount\_overpaid.
- `invoice.paid`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice payment attempt succeeds or an invoice is marked as paid out-of-band.
- `invoice.payment\_action\_required`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice payment attempt requires further user action to complete.
- `invoice.payment\_attempt\_required`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs when an invoice requires a payment using a payment method that cannot be processed by Stripe.
- `invoice.payment\_failed`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice payment attempt fails, due to either a declined payment, including soft decline, or to the lack of a stored payment method.
- `invoice.payment\_succeeded`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice payment attempt succeeds.
- `invoice.sent`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice email is sent out.
- `invoice.upcoming`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs X number of days before a subscription is scheduled to create an invoice that is automatically charged—where X is determined by your [subscriptions settings](https://dashboard.stripe.com/account/billing/automatic). Note: The received `Invoice` object will not have an invoice ID.
- `invoice.updated`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice changes (e.g., the invoice amount).
- `invoice.voided`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs whenever an invoice is voided.
- `invoice.will\_be\_due`
`data.object` is one of: [`invoice`](https://docs.stripe.com/api#invoice\_object)
Occurs X number of days before an invoice becomes due—where X is determined by Automations
- `invoiceitem.created`
`data.object` is one of: [`invoiceitem`](https://docs.stripe.com/api#invoiceitem\_object)
Occurs whenever an invoice item is created.
- `invoiceitem.deleted`
`data.object` is one of: [`invoiceitem`](https://docs.stripe.com/api#invoiceitem\_object)
Occurs whenever an invoice item is deleted.
- `issuing\_authorization.created`
`data.object` is one of: [`issuing.authorization`](https://docs.stripe.com/api#issuing\_authorization\_object)
Occurs whenever an authorization is created.
- `issuing\_authorization.request` [requires explicit opt-in]
`data.object` is one of: [`issuing.authorization`](https://docs.stripe.com/api#issuing\_authorization\_object)
Represents a synchronous request for authorization, see [Using your integration to handle authorization requests](https://docs.stripe.com/issuing/purchases/authorizations.md#authorization-handling).
- `issuing\_authorization.updated`
`data.object` is one of: [`issuing.authorization`](https://docs.stripe.com/api#issuing\_authorization\_object)
Occurs whenever an authorization is updated.
- `issuing\_card.created`
`data.object` is one of: [`issuing.card`](https://docs.stripe.com/api#issuing\_card\_object)
Occurs whenever a card is created.
- `issuing\_card.updated`
`data.object` is one of: [`issuing.card`](https://docs.stripe.com/api#issuing\_card\_object)
Occurs whenever a card is updated.
- `issuing\_cardholder.created`
`data.object` is one of: [`issuing.cardholder`](https://docs.stripe.com/api#issuing\_cardholder\_object)
Occurs whenever a cardholder is created.
- `issuing\_cardholder.updated`
`data.object` is one of: [`issuing.cardholder`](https://docs.stripe.com/api#issuing\_cardholder\_object)
Occurs whenever a cardholder is updated.
- `issuing\_dispute.closed`
`data.object` is one of: [`issuing.dispute`](https://docs.stripe.com/api#issuing\_dispute\_object)
Occurs whenever a dispute is won, lost or expired.
- `issuing\_dispute.created`
`data.object` is one of: [`issuing.dispute`](https://docs.stripe.com/api#issuing\_dispute\_object)
Occurs whenever a dispute is created.
- `issuing\_dispute.funds\_reinstated`
`data.object` is one of: [`issuing.dispute`](https://docs.stripe.com/api#issuing\_dispute\_object)
Occurs whenever funds are reinstated to your account for an Issuing dispute.
- `issuing\_dispute.funds\_rescinded`
`data.object` is one of: [`issuing.dispute`](https://docs.stripe.com/api#issuing\_dispute\_object)
Occurs whenever funds are deducted from your account for an Issuing dispute.
- `issuing\_dispute.submitted`
`data.object` is one of: [`issuing.dispute`](https://docs.stripe.com/api#issuing\_dispute\_object)
Occurs whenever a dispute is submitted.
- `issuing\_dispute.updated`
`data.object` is one of: [`issuing.dispute`](https://docs.stripe.com/api#issuing\_dispute\_object)
Occurs whenever a dispute is updated.
- `issuing\_personalization\_design.activated`
`data.object` is one of: [`issuing.personalization\_design`](https://docs.stripe.com/api#issuing\_personalization\_design\_object)
Occurs whenever a personalization design is activated following the activation of the physical bundle that belongs to it.
- `issuing\_personalization\_design.deactivated`
`data.object` is one of: [`issuing.personalization\_design`](https://docs.stripe.com/api#issuing\_personalization\_design\_object)
Occurs whenever a personalization design is deactivated following the deactivation of the physical bundle that belongs to it.
- `issuing\_personalization\_design.rejected`
`data.object` is one of: [`issuing.personalization\_design`](https://docs.stripe.com/api#issuing\_personalization\_design\_object)
Occurs whenever a personalization design is rejected by design review.
- `issuing\_personalization\_design.updated`
`data.object` is one of: [`issuing.personalization\_design`](https://docs.stripe.com/api#issuing\_personalization\_design\_object)
Occurs whenever a personalization design is updated.
- `issuing\_token.created`
`data.object` is one of: [`issuing.token`](https://docs.stripe.com/api#issuing\_token\_object)
Occurs whenever an issuing digital wallet token is created.
- `issuing\_token.updated`
`data.object` is one of: [`issuing.token`](https://docs.stripe.com/api#issuing\_token\_object)
Occurs whenever an issuing digital wallet token is updated.
- `issuing\_transaction.created`
`data.object` is one of: [`issuing.transaction`](https://docs.stripe.com/api#issuing\_transaction\_object)
Occurs whenever an issuing transaction is created.
- `issuing\_transaction.purchase\_details\_receipt\_updated`
`data.object` is one of: [`issuing.transaction`](https://docs.stripe.com/api#issuing\_transaction\_object)
Occurs whenever an issuing transaction is updated with receipt data.
- `issuing\_transaction.updated`
`data.object` is one of: [`issuing.transaction`](https://docs.stripe.com/api#issuing\_transaction\_object)
Occurs whenever an issuing transaction is updated.
- `mandate.updated`
`data.object` is one of: [`mandate`](https://docs.stripe.com/api#mandate\_object)
Occurs whenever a Mandate is updated.
- `payment\_intent.amount\_capturable\_updated`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when a PaymentIntent has funds to be captured. Check the `amount\_capturable` property on the PaymentIntent to determine the amount that can be captured. You may capture the PaymentIntent with an `amount\_to\_capture` value up to the specified amount. [Learn more about capturing PaymentIntents.](https://docs.stripe.com/api/payment\_intents/capture.md)
- `payment\_intent.canceled`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when a PaymentIntent is canceled.
- `payment\_intent.created`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when a new PaymentIntent is created.
- `payment\_intent.partially\_funded`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when funds are applied to a customer\_balance PaymentIntent and the ‘amount\_remaining’ changes.
- `payment\_intent.payment\_failed`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when a PaymentIntent has failed the attempt to create a payment method or a payment.
- `payment\_intent.processing`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when a PaymentIntent has started processing.
- `payment\_intent.requires\_action`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when a PaymentIntent transitions to requires\_action state
- `payment\_intent.succeeded`
`data.object` is one of: [`payment\_intent`](https://docs.stripe.com/api#payment\_intent\_object)
Occurs when a PaymentIntent has successfully completed payment.
- `payment\_link.created`
`data.object` is one of: [`payment\_link`](https://docs.stripe.com/api#payment\_link\_object)
Occurs when a payment link is created.
- `payment\_link.updated`
`data.object` is one of: [`payment\_link`](https://docs.stripe.com/api#payment\_link\_object)
Occurs when a payment link is updated.
- `payment\_method.attached`
`data.object` is one of: [`payment\_method`](https://docs.stripe.com/api#payment\_method\_object)
Occurs whenever a new payment method is attached to a customer.
- `payment\_method.automatically\_updated`
`data.object` is one of: [`payment\_method`](https://docs.stripe.com/api#payment\_method\_object)
Occurs whenever a payment method’s details are automatically updated by the network.
- `payment\_method.detached`
`data.object` is one of: [`payment\_method`](https://docs.stripe.com/api#payment\_method\_object)
Occurs whenever a payment method is detached from a customer.
- `payment\_method.updated`
`data.object` is one of: [`payment\_method`](https://docs.stripe.com/api#payment\_method\_object)
Occurs whenever a payment method is updated via the [PaymentMethod update API](https://docs.stripe.com/api/payment\_methods/update.md).
- `payout.canceled`
`data.object` is one of: [`payout`](https://docs.stripe.com/api#payout\_object)
Occurs whenever a payout is canceled.
- `payout.created`
`data.object` is one of: [`payout`](https://docs.stripe.com/api#payout\_object)
Occurs whenever a payout is created.
- `payout.failed`
`data.object` is one of: [`payout`](https://docs.stripe.com/api#payout\_object)
Occurs whenever a payout attempt fails.
- `payout.paid`
`data.object` is one of: [`payout`](https://docs.stripe.com/api#payout\_object)
Occurs whenever a payout is \*expected\* to be available in the destination account. If the payout fails, a `payout.failed` notification is also sent, at a later time.
- `payout.reconciliation\_completed`
`data.object` is one of: [`payout`](https://docs.stripe.com/api#payout\_object)
Occurs whenever balance transactions paid out in an automatic payout can be queried.
- `payout.updated`
`data.object` is one of: [`payout`](https://docs.stripe.com/api#payout\_object)
Occurs whenever a payout is updated.
- `person.created`
`data.object` is one of: [`person`](https://docs.stripe.com/api#person\_object)
Occurs whenever a person associated with an account is created.
- `person.deleted`
`data.object` is one of: [`person`](https://docs.stripe.com/api#person\_object)
Occurs whenever a person associated with an account is deleted.
- `person.updated`
`data.object` is one of: [`person`](https://docs.stripe.com/api#person\_object)
Occurs whenever a person associated with an account is updated.
- `plan.created`
`data.object` is one of: [`plan`](https://docs.stripe.com/api#plan\_object)
Occurs whenever a plan is created.
- `plan.deleted`
`data.object` is one of: [`plan`](https://docs.stripe.com/api#plan\_object)
Occurs whenever a plan is deleted.
- `plan.updated`
`data.object` is one of: [`plan`](https://docs.stripe.com/api#plan\_object)
Occurs whenever a plan is updated.
- `price.created`
`data.object` is one of: [`price`](https://docs.stripe.com/api#price\_object)
Occurs whenever a price is created.
- `price.deleted`
`data.object` is one of: [`price`](https://docs.stripe.com/api#price\_object)
Occurs whenever a price is deleted.
- `price.updated`
`data.object` is one of: [`price`](https://docs.stripe.com/api#price\_object)
Occurs whenever a price is updated.
- `product.created`
`data.object` is one of: [`product`](https://docs.stripe.com/api#product\_object)
Occurs whenever a product is created.
- `product.deleted`
`data.object` is one of: [`product`](https://docs.stripe.com/api#product\_object)
Occurs whenever a product is deleted.
- `product.updated`
`data.object` is one of: [`product`](https://docs.stripe.com/api#product\_object)
Occurs whenever a product is updated.
- `promotion\_code.created`
`data.object` is one of: [`promotion\_code`](https://docs.stripe.com/api#promotion\_code\_object)
Occurs whenever a promotion code is created.
- `promotion\_code.updated`
`data.object` is one of: [`promotion\_code`](https://docs.stripe.com/api#promotion\_code\_object)
Occurs whenever a promotion code is updated.
- `quote.accepted`
`data.object` is one of: [`quote`](https://docs.stripe.com/api#quote\_object)
Occurs whenever a quote is accepted.
- `quote.canceled`
`data.object` is one of: [`quote`](https://docs.stripe.com/api#quote\_object)
Occurs whenever a quote is canceled.
- `quote.created`
`data.object` is one of: [`quote`](https://docs.stripe.com/api#quote\_object)
Occurs whenever a quote is created.
- `quote.finalized`
`data.object` is one of: [`quote`](https://docs.stripe.com/api#quote\_object)
Occurs whenever a quote is finalized.
- `quote.will\_expire`
`data.object` is one of: [`quote`](https://docs.stripe.com/api#quote\_object)
Occurs X number of days before a quote is scheduled to expire—where X is determined by Automations
- `radar.early\_fraud\_warning.created`
`data.object` is one of: [`radar.early\_fraud\_warning`](https://docs.stripe.com/api#early\_fraud\_warning\_object)
Occurs whenever an early fraud warning is created.
- `radar.early\_fraud\_warning.updated`
`data.object` is one of: [`radar.early\_fraud\_warning`](https://docs.stripe.com/api#early\_fraud\_warning\_object)
Occurs whenever an early fraud warning is updated.
- `refund.created`
`data.object` is one of: [`refund`](https://docs.stripe.com/api#refund\_object)
Occurs whenever a refund is created.
- `refund.failed`
`data.object` is one of: [`refund`](https://docs.stripe.com/api#refund\_object)
Occurs whenever a refund has failed.
- `refund.updated`
`data.object` is one of: [`refund`](https://docs.stripe.com/api#refund\_object)
Occurs whenever a refund is updated.
- `reporting.report\_run.failed`
`data.object` is one of: [`reporting.report\_run`](https://docs.stripe.com/api#reporting\_report\_run\_object)
Occurs whenever a requested `ReportRun` failed to complete.
- `reporting.report\_run.succeeded`
`data.object` is one of: [`reporting.report\_run`](https://docs.stripe.com/api#reporting\_report\_run\_object)
Occurs whenever a requested `ReportRun` completed successfully.
- `reporting.report\_type.updated` [requires explicit opt-in]
`data.object` is one of: [`reporting.report\_type`](https://docs.stripe.com/api#reporting\_report\_type\_object)
Occurs whenever a `ReportType` is updated (typically to indicate that a new day’s data has come available).
- `reserve.hold.created`
`data.object` is one of: [`reserve.hold`](https://docs.stripe.com/api#reserve\_hold\_object)
Occurs when a reserve hold is created.
- `reserve.hold.updated`
`data.object` is one of: [`reserve.hold`](https://docs.stripe.com/api#reserve\_hold\_object)
Occurs when a reserve hold is updated.
- `reserve.plan.created`
`data.object` is one of: [`reserve.plan`](https://docs.stripe.com/api#reserve\_plan\_object)
Occurs when a reserve plan is created.
- `reserve.plan.disabled`
`data.object` is one of: [`reserve.plan`](https://docs.stripe.com/api#reserve\_plan\_object)
Occurs when a reserve plan is disabled.
- `reserve.plan.expired`
`data.object` is one of: [`reserve.plan`](https://docs.stripe.com/api#reserve\_plan\_object)
Occurs when a reserve plan expires.
- `reserve.plan.updated`
`data.object` is one of: [`reserve.plan`](https://docs.stripe.com/api#reserve\_plan\_object)
Occurs when a reserve plan is updated.
- `reserve.release.created`
`data.object` is one of: [`reserve.release`](https://docs.stripe.com/api#reserve\_release\_object)
Occurs when a reserve release is created.
- `review.closed`
`data.object` is one of: [`review`](https://docs.stripe.com/api#review\_object)
Occurs whenever a review is closed. The review’s `reason` field indicates why: `approved`, `disputed`, `refunded`, `refunded\_as\_fraud`, or `canceled`.
- `review.opened`
`data.object` is one of: [`review`](https://docs.stripe.com/api#review\_object)
Occurs whenever a review is opened.
- `setup\_intent.canceled`
`data.object` is one of: [`setup\_intent`](https://docs.stripe.com/api#setup\_intent\_object)
Occurs when a SetupIntent is canceled.
- `setup\_intent.created`
`data.object` is one of: [`setup\_intent`](https://docs.stripe.com/api#setup\_intent\_object)
Occurs when a new SetupIntent is created.
- `setup\_intent.requires\_action`
`data.object` is one of: [`setup\_intent`](https://docs.stripe.com/api#setup\_intent\_object)
Occurs when a SetupIntent is in requires\_action state.
- `setup\_intent.setup\_failed`
`data.object` is one of: [`setup\_intent`](https://docs.stripe.com/api#setup\_intent\_object)
Occurs when a SetupIntent has failed the attempt to setup a payment method.
- `setup\_intent.succeeded`
`data.object` is one of: [`setup\_intent`](https://docs.stripe.com/api#setup\_intent\_object)
Occurs when an SetupIntent has successfully setup a payment method.
- `sigma.scheduled\_query\_run.created`
`data.object` is one of: [`scheduled\_query\_run`](https://docs.stripe.com/api#scheduled\_query\_run\_object)
Occurs whenever a Sigma scheduled query run finishes.
- `source.canceled`
`data.object` is one of: [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever a source is canceled.
- `source.chargeable`
`data.object` is one of: [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever a source transitions to chargeable.
- `source.failed`
`data.object` is one of: [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever a source fails.
- `source.mandate\_notification`
`data.object` is one of: [`source\_mandate\_notification`](https://docs.stripe.com/api#payment\_provider\_source\_mandate\_notification\_object)
Occurs whenever a source mandate notification method is set to manual.
- `source.refund\_attributes\_required`
`data.object` is one of: [`source`](https://docs.stripe.com/api#payment\_provider\_source\_object)
Occurs whenever the refund attributes are required on a receiver source to process a refund or a mispayment.
- `source.transaction.created`
`data.object` is one of: [`source\_transaction`](https://docs.stripe.com/api#payment\_provider\_source\_transaction\_object)
Occurs whenever a source transaction is created.
- `source.transaction.updated`
`data.object` is one of: [`source\_transaction`](https://docs.stripe.com/api#payment\_provider\_source\_transaction\_object)
Occurs whenever a source transaction is updated.
- `subscription\_schedule.aborted`
`data.object` is one of: [`subscription\_schedule`](https://docs.stripe.com/api#subscription\_schedule\_object)
Occurs whenever a subscription schedule is canceled due to the underlying subscription being canceled because of delinquency.
- `subscription\_schedule.canceled`
`data.object` is one of: [`subscription\_schedule`](https://docs.stripe.com/api#subscription\_schedule\_object)
Occurs whenever a subscription schedule is canceled.
- `subscription\_schedule.completed`
`data.object` is one of: [`subscription\_schedule`](https://docs.stripe.com/api#subscription\_schedule\_object)
Occurs whenever a new subscription schedule is completed.
- `subscription\_schedule.created`
`data.object` is one of: [`subscription\_schedule`](https://docs.stripe.com/api#subscription\_schedule\_object)
Occurs whenever a new subscription schedule is created.
- `subscription\_schedule.expiring`
`data.object` is one of: [`subscription\_schedule`](https://docs.stripe.com/api#subscription\_schedule\_object)
Occurs 7 days before a subscription schedule will expire.
- `subscription\_schedule.released`
`data.object` is one of: [`subscription\_schedule`](https://docs.stripe.com/api#subscription\_schedule\_object)
Occurs whenever a new subscription schedule is released.
- `subscription\_schedule.updated`
`data.object` is one of: [`subscription\_schedule`](https://docs.stripe.com/api#subscription\_schedule\_object)
Occurs whenever a subscription schedule is updated.
- `tax\_rate.created`
`data.object` is one of: [`tax\_rate`](https://docs.stripe.com/api#tax\_rate\_object)
Occurs whenever a new tax rate is created.
- `tax\_rate.updated`
`data.object` is one of: [`tax\_rate`](https://docs.stripe.com/api#tax\_rate\_object)
Occurs whenever a tax rate is updated.
- `tax.settings.updated`
`data.object` is one of: [`tax.settings`](https://docs.stripe.com/api#tax\_settings\_object)
Occurs whenever tax settings is updated.
- `terminal.reader.action\_failed`
`data.object` is one of: [`terminal.reader`](https://docs.stripe.com/api#terminal\_reader\_object)
Occurs whenever an action sent to a Terminal reader failed.
- `terminal.reader.action\_succeeded`
`data.object` is one of: [`terminal.reader`](https://docs.stripe.com/api#terminal\_reader\_object)
Occurs whenever an action sent to a Terminal reader was successful.
- `terminal.reader.action\_updated`
`data.object` is one of: [`terminal.reader`](https://docs.stripe.com/api#terminal\_reader\_object)
Occurs whenever an action sent to a Terminal reader is updated.
- `test\_helpers.test\_clock.advancing`
`data.object` is one of: [`test\_helpers.test\_clock`](https://docs.stripe.com/api#test\_clock\_object)
Occurs whenever a test clock starts advancing.
- `test\_helpers.test\_clock.created`
`data.object` is one of: [`test\_helpers.test\_clock`](https://docs.stripe.com/api#test\_clock\_object)
Occurs whenever a test clock is created.
- `test\_helpers.test\_clock.deleted`
`data.object` is one of: [`test\_helpers.test\_clock`](https://docs.stripe.com/api#test\_clock\_object)
Occurs whenever a test clock is deleted.
- `test\_helpers.test\_clock.internal\_failure`
`data.object` is one of: [`test\_helpers.test\_clock`](https://docs.stripe.com/api#test\_clock\_object)
Occurs whenever a test clock fails to advance its frozen time.
- `test\_helpers.test\_clock.ready`
`data.object` is one of: [`test\_helpers.test\_clock`](https://docs.stripe.com/api#test\_clock\_object)
Occurs whenever a test clock transitions to a ready status.
- `topup.canceled`
`data.object` is one of: [`topup`](https://docs.stripe.com/api#topup\_object)
Occurs whenever a top-up is canceled.
- `topup.created`
`data.object` is one of: [`topup`](https://docs.stripe.com/api#topup\_object)
Occurs whenever a top-up is created.
- `topup.failed`
`data.object` is one of: [`topup`](https://docs.stripe.com/api#topup\_object)
Occurs whenever a top-up fails.
- `topup.reversed`
`data.object` is one of: [`topup`](https://docs.stripe.com/api#topup\_object)
Occurs whenever a top-up is reversed.
- `topup.succeeded`
`data.object` is one of: [`topup`](https://docs.stripe.com/api#topup\_object)
Occurs whenever a top-up succeeds.
- `transfer.created`
`data.object` is one of: [`transfer`](https://docs.stripe.com/api#transfer\_object)
Occurs whenever a transfer is created.
- `transfer.reversed`
`data.object` is one of: [`transfer`](https://docs.stripe.com/api#transfer\_object)
Occurs whenever a transfer is reversed, including partial reversals.
- `transfer.updated`
`data.object` is one of: [`transfer`](https://docs.stripe.com/api#transfer\_object)
Occurs whenever a transfer’s description or metadata is updated.
