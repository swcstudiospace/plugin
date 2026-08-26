# PostgreSQL: Documentation: 18: 32.18. LDAP Lookup of Connection Parameters

Source: https://www.postgresql.org/docs/current/libpq-ldap.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/libpq-ldap.html "PostgreSQL 18 - 32.18. LDAP Lookup of Connection Parameters")
([18](/docs/18/libpq-ldap.html "PostgreSQL 18 - 32.18. LDAP Lookup of Connection Parameters"))
/
[17](/docs/17/libpq-ldap.html "PostgreSQL 17 - 32.18. LDAP Lookup of Connection Parameters")
/
[16](/docs/16/libpq-ldap.html "PostgreSQL 16 - 32.18. LDAP Lookup of Connection Parameters")
/
[15](/docs/15/libpq-ldap.html "PostgreSQL 15 - 32.18. LDAP Lookup of Connection Parameters")
/
[14](/docs/14/libpq-ldap.html "PostgreSQL 14 - 32.18. LDAP Lookup of Connection Parameters")

Development Versions:
[19](/docs/19/libpq-ldap.html "PostgreSQL 19 - 32.18. LDAP Lookup of Connection Parameters")
/
[devel](/docs/devel/libpq-ldap.html "PostgreSQL devel - 32.18. LDAP Lookup of Connection Parameters")

Unsupported versions:
[13](/docs/13/libpq-ldap.html "PostgreSQL 13 - 32.18. LDAP Lookup of Connection Parameters")
/
[12](/docs/12/libpq-ldap.html "PostgreSQL 12 - 32.18. LDAP Lookup of Connection Parameters")
/
[11](/docs/11/libpq-ldap.html "PostgreSQL 11 - 32.18. LDAP Lookup of Connection Parameters")
/
[10](/docs/10/libpq-ldap.html "PostgreSQL 10 - 32.18. LDAP Lookup of Connection Parameters")
/
[9.6](/docs/9.6/libpq-ldap.html "PostgreSQL 9.6 - 32.18. LDAP Lookup of Connection Parameters")
/
[9.5](/docs/9.5/libpq-ldap.html "PostgreSQL 9.5 - 32.18. LDAP Lookup of Connection Parameters")
/
[9.4](/docs/9.4/libpq-ldap.html "PostgreSQL 9.4 - 32.18. LDAP Lookup of Connection Parameters")
/
[9.3](/docs/9.3/libpq-ldap.html "PostgreSQL 9.3 - 32.18. LDAP Lookup of Connection Parameters")
/
[9.2](/docs/9.2/libpq-ldap.html "PostgreSQL 9.2 - 32.18. LDAP Lookup of Connection Parameters")
/
[9.1](/docs/9.1/libpq-ldap.html "PostgreSQL 9.1 - 32.18. LDAP Lookup of Connection Parameters")
/
[9.0](/docs/9.0/libpq-ldap.html "PostgreSQL 9.0 - 32.18. LDAP Lookup of Connection Parameters")
/
[8.4](/docs/8.4/libpq-ldap.html "PostgreSQL 8.4 - 32.18. LDAP Lookup of Connection Parameters")
/
[8.3](/docs/8.3/libpq-ldap.html "PostgreSQL 8.3 - 32.18. LDAP Lookup of Connection Parameters")
/
[8.2](/docs/8.2/libpq-ldap.html "PostgreSQL 8.2 - 32.18. LDAP Lookup of Connection Parameters")

## 32.18. LDAP Lookup of Connection Parameters [#](#LIBPQ-LDAP)

If libpq has been compiled with LDAP support (option `--with-ldap` for `configure`) it is possible to retrieve connection options like `host` or `dbname` via LDAP from a central server. The advantage is that if the connection parameters for a database change, the connection information doesn't have to be updated on all client machines.

LDAP connection parameter lookup uses the connection service file `pg_service.conf` (see [Section 32.17](libpq-pgservice.html "32.17. The Connection Service File")). A line in a `pg_service.conf` stanza that starts with `ldap://` will be recognized as an LDAP URL and an LDAP query will be performed. The result must be a list of `keyword = value` pairs which will be used to set connection options. The URL must conform to [RFC 1959](https://datatracker.ietf.org/doc/html/rfc1959) and be of the form

```
ldap://[hostname[:port]]/search_base?attribute?search_scope?filter
```

where *`hostname`* defaults to `localhost` and *`port`* defaults to 389.

Processing of `pg_service.conf` is terminated after a successful LDAP lookup, but is continued if the LDAP server cannot be contacted. This is to provide a fallback with further LDAP URL lines that point to different LDAP servers, classical `keyword = value` pairs, or default connection options. If you would rather get an error message in this case, add a syntactically incorrect line after the LDAP URL.

A sample LDAP entry that has been created with the LDIF file

```
version:1
dn:cn=mydatabase,dc=mycompany,dc=com
changetype:add
objectclass:top
objectclass:device
cn:mydatabase
description:host=dbserver.mycompany.com
description:port=5439
description:dbname=mydb
description:user=mydb_user
description:sslmode=require
```

might be queried with the following LDAP URL:

```
ldap://ldap.mycompany.com/dc=mycompany,dc=com?description?one?(cn=mydatabase)
```

You can also mix regular service file entries with LDAP lookups. A complete example for a stanza in `pg_service.conf` would be:

```
# only host and port are stored in LDAP, specify dbname and user explicitly
[customerdb]
dbname=customer
user=appuser
ldap://ldap.acme.com/cn=dbserver,cn=hosts?pgconnectinfo?base?(objectclass=*)
```

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/libpq-ldap.html/)
to report a documentation issue.
