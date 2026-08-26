# PostgreSQL: Documentation: 18: 20.12. Certificate Authentication

Source: https://www.postgresql.org/docs/current/auth-cert.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/auth-cert.html "PostgreSQL 18 - 20.12. Certificate Authentication")
([18](/docs/18/auth-cert.html "PostgreSQL 18 - 20.12. Certificate Authentication"))
/
[17](/docs/17/auth-cert.html "PostgreSQL 17 - 20.12. Certificate Authentication")
/
[16](/docs/16/auth-cert.html "PostgreSQL 16 - 20.12. Certificate Authentication")
/
[15](/docs/15/auth-cert.html "PostgreSQL 15 - 20.12. Certificate Authentication")
/
[14](/docs/14/auth-cert.html "PostgreSQL 14 - 20.12. Certificate Authentication")

Development Versions:
[19](/docs/19/auth-cert.html "PostgreSQL 19 - 20.12. Certificate Authentication")
/
[devel](/docs/devel/auth-cert.html "PostgreSQL devel - 20.12. Certificate Authentication")

Unsupported versions:
[13](/docs/13/auth-cert.html "PostgreSQL 13 - 20.12. Certificate Authentication")
/
[12](/docs/12/auth-cert.html "PostgreSQL 12 - 20.12. Certificate Authentication")
/
[11](/docs/11/auth-cert.html "PostgreSQL 11 - 20.12. Certificate Authentication")

## 20.12. Certificate Authentication [#](#AUTH-CERT)

This authentication method uses SSL client certificates to perform authentication. It is therefore only available for SSL connections; see [Section 18.9.2](ssl-tcp.html#SSL-OPENSSL-CONFIG "18.9.2. OpenSSL Configuration") for SSL configuration instructions. When using this authentication method, the server will require that the client provide a valid, trusted certificate. No password prompt will be sent to the client. The `cn` (Common Name) attribute of the certificate will be compared to the requested database user name, and if they match the login will be allowed. User name mapping can be used to allow `cn` to be different from the database user name.

The following configuration options are supported for SSL certificate authentication:

`map`
:   Allows for mapping between system and database user names. See [Section 20.2](auth-username-maps.html "20.2. User Name Maps") for details.

It is redundant to use the `clientcert` option with `cert` authentication because `cert` authentication is effectively `trust` authentication with `clientcert=verify-full`.

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/auth-cert.html/)
to report a documentation issue.
