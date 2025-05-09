# Bayarcash Node for n8n

An n8n community node to integrate with Bayarcash payment processing API directly in your workflows.

This node enables easy access to Bayarcash payment gateway services in Malaysia and Southeast Asia, including FPX, DuitNow, QRIS, and other regional payment methods.

[N8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/installation/

## Prerequisites

- n8n v0.160.0 or newer
- Bayarcash account with API access
- Personal Access Token (PAT) from Bayarcash console

## Credentials

The node uses API Token authentication:

- **PAT Token**: Your Personal Access Token from Bayarcash
- **API URL**: Base URL for the Bayarcash API (defaults to `https://api.console.bayar.cash/v3`)

## Node Reference

### Payment Intent

| Operation | Description |
|-----------|-------------|
| Create | Create a new payment intent |
| Get Status | Check status of an existing payment intent (v3) |
| Delete | Delete a payment intent (v3) |

### Portal

| Operation | Description |
|-----------|-------------|
| List All Portals | Get a list of all available portals |
| Get Portal Channels | Get payment channels for a specific portal |

### Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction by ID | Retrieve transaction details (v3) |
| List Transactions | Get filtered transaction data (v3) |

## Supported Payment Channels

- FPX (Financial Process Exchange)
- FPX Line of Credit
- DuitNow Online Banking/Wallets
- DuitNow QR
- Boost PayFlex (BNPL)
- QRIS Indonesia Online Banking
- QRIS Indonesia eWallet
- NETS Singapore

## Example Usage

### Create Payment Intent

```
[Bayarcash] -> [HTTP Request]
               |
               v
          [Send Email]
```

### Process Transaction Webhook

```
[Webhook] -> [Bayarcash: Get Transaction by ID]
              |
              v
        [Update Database]
```

## Resources

- [Bayarcash API Documentation](https://api.webimpian.support/bayarcash)
- [Report Issues](https://github.com/username/n8n-nodes-bayarcash/issues)
