# Web Crypto API | Node.js v26.5.0 Documentation

Source: https://nodejs.org/api/webcrypto.html

## Web Crypto API[#](#web-crypto-api)

History

| Version | Changes |
| --- | --- |
| v25.9.0 | TurboSHAKE and KangarooTwelve algorithms are now supported. |
| v24.8.0 | KMAC algorithms are now supported. |
| v24.8.0 | Argon2 algorithms are now supported. |
| v24.7.0 | AES-OCB algorithm is now supported. |
| v24.7.0 | ML-KEM algorithms are now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |
| v24.7.0 | SHA-3 algorithms are now supported. |
| v24.7.0 | SHAKE algorithms are now supported. |
| v24.7.0 | ML-DSA algorithms are now supported. |
| v23.5.0, v22.13.0, v20.19.3 | Algorithms `Ed25519` and `X25519` are now stable. |
| v20.0.0, v18.17.0 | Arguments are now coerced and validated as per their WebIDL definitions like in other Web Crypto API implementations. |
| v19.0.0 | No longer experimental except for the `Ed25519`, `Ed448`, `X25519`, and `X448` algorithms. |
| v18.4.0, v16.17.0 | Removed proprietary `'node.keyObject'` import/export format. |
| v18.4.0, v16.17.0 | Removed proprietary `'NODE-DSA'`, `'NODE-DH'`, and `'NODE-SCRYPT'` algorithms. |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, `'Ed448'`, `'X25519'`, and `'X448'` algorithms. |
| v18.4.0, v16.17.0 | Removed proprietary `'NODE-ED25519'` and `'NODE-ED448'` algorithms. |
| v18.4.0, v16.17.0 | Removed proprietary `'NODE-X25519'` and `'NODE-X448'` named curves from the `'ECDH'` algorithm. |

[Stability: 2](documentation.html#stability-index) - Stable

Node.js provides an implementation of the [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/) standard.

Use `globalThis.crypto` or `require('node:crypto').webcrypto` to access this
module.

```
const { subtle } = globalThis.crypto;

(async function() {

  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const enc = new TextEncoder();
  const message = enc.encode('I love cupcakes');

  const digest = await subtle.sign({
    name: 'HMAC',
  }, key, message);

})();

jscopy
```

### Modern Algorithms in the Web Cryptography API[#](#modern-algorithms-in-the-web-cryptography-api)

Stability: 1.1 - Active development

Node.js provides an implementation of the following features from the
[Modern Algorithms in the Web Cryptography API](https://wicg.github.io/webcrypto-modern-algos/)
WICG proposal:

Algorithms:

- `'AES-OCB'`[1](#user-content-fn-openssl30)
- `'Argon2d'`[2](#user-content-fn-openssl32)
- `'Argon2i'`[2](#user-content-fn-openssl32)
- `'Argon2id'`[2](#user-content-fn-openssl32)
- `'ChaCha20-Poly1305'`
- `'cSHAKE128'`
- `'cSHAKE256'`
- `'KMAC128'`[1](#user-content-fn-openssl30)
- `'KMAC256'`[1](#user-content-fn-openssl30)
- `'KT128'`
- `'KT256'`
- `'ML-DSA-44'`[3](#user-content-fn-openssl35)
- `'ML-DSA-65'`[3](#user-content-fn-openssl35)
- `'ML-DSA-87'`[3](#user-content-fn-openssl35)
- `'ML-KEM-512'`[3](#user-content-fn-openssl35)
- `'ML-KEM-768'`[3](#user-content-fn-openssl35)
- `'ML-KEM-1024'`[3](#user-content-fn-openssl35)
- `'SHA3-256'`
- `'SHA3-384'`
- `'SHA3-512'`
- `'TurboSHAKE128'`
- `'TurboSHAKE256'`

Key Formats:

- `'raw-public'`
- `'raw-secret'`
- `'raw-seed'`

Methods:

- [`subtle.decapsulateBits()`](#subtledecapsulatebitsdecapsulationalgorithm-decapsulationkey-ciphertext)
- [`subtle.decapsulateKey()`](#subtledecapsulatekeydecapsulationalgorithm-decapsulationkey-ciphertext-sharedkeyalgorithm-extractable-keyusages)
- [`subtle.encapsulateBits()`](#subtleencapsulatebitsencapsulationalgorithm-encapsulationkey)
- [`subtle.encapsulateKey()`](#subtleencapsulatekeyencapsulationalgorithm-encapsulationkey-sharedkeyalgorithm-extractable-keyusages)
- [`subtle.getPublicKey()`](#subtlegetpublickeykey-keyusages)
- [`SubtleCrypto.supports()`](#static-method-subtlecryptosupportsoperation-algorithm-lengthoradditionalalgorithm)

### Secure Curves in the Web Cryptography API[#](#secure-curves-in-the-web-cryptography-api)

Stability: 1.1 - Active development

Node.js provides an implementation of the following features from the
[Secure Curves in the Web Cryptography API](https://wicg.github.io/webcrypto-secure-curves/)
WICG proposal:

Algorithms:

- `'Ed448'`
- `'X448'`

### Examples[#](#examples)

#### Generating keys[#](#generating-keys)

The [`<SubtleCrypto>`](webcrypto.html#class-subtlecrypto) class can be used to generate symmetric (secret) keys
or asymmetric key pairs (public key and private key).

##### AES keys[#](#aes-keys)

```
const { subtle } = globalThis.crypto;

async function generateAesKey(length = 256) {
  const key = await subtle.generateKey({
    name: 'AES-CBC',
    length,
  }, true, ['encrypt', 'decrypt']);

  return key;
}

jscopy
```

##### ECDSA key pairs[#](#ecdsa-key-pairs)

```
const { subtle } = globalThis.crypto;

async function generateEcKey(namedCurve = 'P-521') {
  const {
    publicKey,
    privateKey,
  } = await subtle.generateKey({
    name: 'ECDSA',
    namedCurve,
  }, true, ['sign', 'verify']);

  return { publicKey, privateKey };
}

jscopy
```

##### Ed25519/X25519 key pairs[#](#ed25519x25519-key-pairs)

```
const { subtle } = globalThis.crypto;

async function generateEd25519Key() {
  return subtle.generateKey({
    name: 'Ed25519',
  }, true, ['sign', 'verify']);
}

async function generateX25519Key() {
  return subtle.generateKey({
    name: 'X25519',
  }, true, ['deriveKey']);
}

jscopy
```

##### HMAC keys[#](#hmac-keys)

```
const { subtle } = globalThis.crypto;

async function generateHmacKey(hash = 'SHA-256') {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return key;
}

jscopy
```

##### RSA key pairs[#](#rsa-key-pairs)

```
const { subtle } = globalThis.crypto;
const publicExponent = new Uint8Array([1, 0, 1]);

async function generateRsaKey(modulusLength = 2048, hash = 'SHA-256') {
  const {
    publicKey,
    privateKey,
  } = await subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength,
    publicExponent,
    hash,
  }, true, ['sign', 'verify']);

  return { publicKey, privateKey };
}

jscopy
```

#### Encryption and decryption[#](#encryption-and-decryption)

```
const crypto = globalThis.crypto;

async function aesEncrypt(plaintext) {
  const ec = new TextEncoder();
  const key = await generateAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const ciphertext = await crypto.subtle.encrypt({
    name: 'AES-CBC',
    iv,
  }, key, ec.encode(plaintext));

  return {
    key,
    iv,
    ciphertext,
  };
}

async function aesDecrypt(ciphertext, key, iv) {
  const dec = new TextDecoder();
  const plaintext = await crypto.subtle.decrypt({
    name: 'AES-CBC',
    iv,
  }, key, ciphertext);

  return dec.decode(plaintext);
}

jscopy
```

#### Exporting and importing keys[#](#exporting-and-importing-keys)

```
const { subtle } = globalThis.crypto;

async function generateAndExportHmacKey(format = 'jwk', hash = 'SHA-512') {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return subtle.exportKey(format, key);
}

async function importHmacKey(keyData, format = 'jwk', hash = 'SHA-512') {
  const key = await subtle.importKey(format, keyData, {
    name: 'HMAC',
    hash,
  }, true, ['sign', 'verify']);

  return key;
}

jscopy
```

#### Wrapping and unwrapping keys[#](#wrapping-and-unwrapping-keys)

```
const { subtle } = globalThis.crypto;

async function generateAndWrapHmacKey(format = 'jwk', hash = 'SHA-512') {
  const [
    key,
    wrappingKey,
  ] = await Promise.all([
    subtle.generateKey({
      name: 'HMAC', hash,
    }, true, ['sign', 'verify']),
    subtle.generateKey({
      name: 'AES-KW',
      length: 256,
    }, true, ['wrapKey', 'unwrapKey']),
  ]);

  const wrappedKey = await subtle.wrapKey(format, key, wrappingKey, 'AES-KW');

  return { wrappedKey, wrappingKey };
}

async function unwrapHmacKey(
  wrappedKey,
  wrappingKey,
  format = 'jwk',
  hash = 'SHA-512') {

  const key = await subtle.unwrapKey(
    format,
    wrappedKey,
    wrappingKey,
    'AES-KW',
    { name: 'HMAC', hash },
    true,
    ['sign', 'verify']);

  return key;
}

jscopy
```

#### Sign and verify[#](#sign-and-verify)

```
const { subtle } = globalThis.crypto;

async function sign(key, data) {
  const ec = new TextEncoder();
  const signature =
    await subtle.sign('RSASSA-PKCS1-v1_5', key, ec.encode(data));
  return signature;
}

async function verify(key, signature, data) {
  const ec = new TextEncoder();
  const verified =
    await subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signature,
      ec.encode(data));
  return verified;
}

jscopy
```

#### Deriving bits and keys[#](#deriving-bits-and-keys)

```
const { subtle } = globalThis.crypto;

async function pbkdf2(pass, salt, iterations = 1000, length = 256) {
  const ec = new TextEncoder();
  const key = await subtle.importKey(
    'raw',
    ec.encode(pass),
    'PBKDF2',
    false,
    ['deriveBits']);
  const bits = await subtle.deriveBits({
    name: 'PBKDF2',
    hash: 'SHA-512',
    salt: ec.encode(salt),
    iterations,
  }, key, length);
  return bits;
}

async function pbkdf2Key(pass, salt, iterations = 1000, length = 256) {
  const ec = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    ec.encode(pass),
    'PBKDF2',
    false,
    ['deriveKey']);
  const key = await subtle.deriveKey({
    name: 'PBKDF2',
    hash: 'SHA-512',
    salt: ec.encode(salt),
    iterations,
  }, keyMaterial, {
    name: 'AES-GCM',
    length,
  }, true, ['encrypt', 'decrypt']);
  return key;
}

jscopy
```

#### Digest[#](#digest)

```
const { subtle } = globalThis.crypto;

async function digest(data, algorithm = 'SHA-512') {
  const ec = new TextEncoder();
  const digest = await subtle.digest(algorithm, ec.encode(data));
  return digest;
}

jscopy
```

#### Checking for runtime algorithm support[#](#checking-for-runtime-algorithm-support)

[`SubtleCrypto.supports()`](#static-method-subtlecryptosupportsoperation-algorithm-lengthoradditionalalgorithm) allows feature detection in Web Crypto API,
which can be used to detect whether a given algorithm identifier
(including its parameters) is supported for the given operation.

This example derives a key from a password using Argon2, if available,
or PBKDF2, otherwise; and then encrypts and decrypts some text with it
using AES-OCB, if available, and AES-GCM, otherwise.

```
const { SubtleCrypto, crypto } = globalThis;

const password = 'correct horse battery staple';
const derivationAlg =
  SubtleCrypto.supports?.('importKey', 'Argon2id') ?
    'Argon2id' :
    'PBKDF2';
const encryptionAlg =
  SubtleCrypto.supports?.('importKey', 'AES-OCB') ?
    'AES-OCB' :
    'AES-GCM';
const passwordKey = await crypto.subtle.importKey(
  derivationAlg === 'Argon2id' ? 'raw-secret' : 'raw',
  new TextEncoder().encode(password),
  derivationAlg,
  false,
  ['deriveKey'],
);
const nonce = crypto.getRandomValues(new Uint8Array(16));
const derivationParams =
  derivationAlg === 'Argon2id' ?
    {
      nonce,
      parallelism: 4,
      memory: 2 ** 21,
      passes: 1,
    } :
    {
      salt: nonce,
      iterations: 100_000,
      hash: 'SHA-256',
    };
const key = await crypto.subtle.deriveKey(
  {
    name: derivationAlg,
    ...derivationParams,
  },
  passwordKey,
  {
    name: encryptionAlg,
    length: 256,
  },
  false,
  ['encrypt', 'decrypt'],
);
const plaintext = 'Hello, world!';
const iv = crypto.getRandomValues(new Uint8Array(12));
const encrypted = await crypto.subtle.encrypt(
  { name: encryptionAlg, iv },
  key,
  new TextEncoder().encode(plaintext),
);
const decrypted = new TextDecoder().decode(await crypto.subtle.decrypt(
  { name: encryptionAlg, iv },
  key,
  encrypted,
));

mjscopy
```

### Algorithm matrix[#](#algorithm-matrix)

The following tables detail the algorithms supported by the Node.js Web
Crypto API implementation and the APIs supported for each:

#### Key Management APIs[#](#key-management-apis)

| Algorithm | [`subtle.generateKey()`](#subtlegeneratekeyalgorithm-extractable-keyusages) | [`subtle.exportKey()`](#subtleexportkeyformat-key) | [`subtle.importKey()`](#subtleimportkeyformat-keydata-algorithm-extractable-keyusages) | [`subtle.getPublicKey()`](#subtlegetpublickeykey-keyusages) |
| --- | --- | --- | --- | --- |
| `'AES-CBC'` | ✔ | ✔ | ✔ |  |
| `'AES-CTR'` | ✔ | ✔ | ✔ |  |
| `'AES-GCM'` | ✔ | ✔ | ✔ |  |
| `'AES-KW'` | ✔ | ✔ | ✔ |  |
| `'AES-OCB'` | ✔ | ✔ | ✔ |  |
| `'Argon2d'` |  |  | ✔ |  |
| `'Argon2i'` |  |  | ✔ |  |
| `'Argon2id'` |  |  | ✔ |  |
| `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |
| `'Ed448'`[5](#user-content-fn-secure-curves) | ✔ | ✔ | ✔ | ✔ |
| `'HKDF'` |  |  | ✔ |  |
| `'HMAC'` | ✔ | ✔ | ✔ |  |
| `'KMAC128'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |
| `'KMAC256'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |
| `'ML-DSA-44'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ | ✔ |
| `'ML-DSA-65'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ | ✔ |
| `'ML-DSA-87'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ | ✔ |
| `'ML-KEM-512'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ | ✔ |
| `'ML-KEM-768'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ | ✔ |
| `'ML-KEM-1024'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ | ✔ |
| `'PBKDF2'` |  |  | ✔ |  |
| `'RSA-OAEP'` | ✔ | ✔ | ✔ | ✔ |
| `'RSA-PSS'` | ✔ | ✔ | ✔ | ✔ |
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ | ✔ |
| `'X25519'` | ✔ | ✔ | ✔ | ✔ |
| `'X448'`[5](#user-content-fn-secure-curves) | ✔ | ✔ | ✔ | ✔ |

#### Crypto Operation APIs[#](#crypto-operation-apis)

**Column Legend:**

- **Encryption**: [`subtle.encrypt()`](#subtleencryptalgorithm-key-data) / [`subtle.decrypt()`](#subtledecryptalgorithm-key-data)
- **Signatures and MAC**: [`subtle.sign()`](#subtlesignalgorithm-key-data) / [`subtle.verify()`](#subtleverifyalgorithm-key-signature-data)
- **Key or Bits Derivation**: [`subtle.deriveBits()`](#subtlederivebitsalgorithm-basekey-length) / [`subtle.deriveKey()`](#subtlederivekeyalgorithm-basekey-derivedkeytype-extractable-keyusages)
- **Key Wrapping**: [`subtle.wrapKey()`](#subtlewrapkeyformat-key-wrappingkey-wrapalgorithm) / [`subtle.unwrapKey()`](#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgorithm-unwrappedkeyalgorithm-extractable-keyusages)
- **Key Encapsulation**: [`subtle.encapsulateBits()`](#subtleencapsulatebitsencapsulationalgorithm-encapsulationkey) / [`subtle.decapsulateBits()`](#subtledecapsulatebitsdecapsulationalgorithm-decapsulationkey-ciphertext) /
  [`subtle.encapsulateKey()`](#subtleencapsulatekeyencapsulationalgorithm-encapsulationkey-sharedkeyalgorithm-extractable-keyusages) / [`subtle.decapsulateKey()`](#subtledecapsulatekeydecapsulationalgorithm-decapsulationkey-ciphertext-sharedkeyalgorithm-extractable-keyusages)
- **Digest**: [`subtle.digest()`](#subtledigestalgorithm-data)

| Algorithm | Encryption | Signatures and MAC | Key or Bits Derivation | Key Wrapping | Key Encapsulation | Digest |
| --- | --- | --- | --- | --- | --- | --- |
| `'AES-CBC'` | ✔ |  |  | ✔ |  |  |
| `'AES-CTR'` | ✔ |  |  | ✔ |  |  |
| `'AES-GCM'` | ✔ |  |  | ✔ |  |  |
| `'AES-KW'` |  |  |  | ✔ |  |  |
| `'AES-OCB'` | ✔ |  |  | ✔ |  |  |
| `'Argon2d'` |  |  | ✔ |  |  |  |
| `'Argon2i'` |  |  | ✔ |  |  |  |
| `'Argon2id'` |  |  | ✔ |  |  |  |
| `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos) | ✔ |  |  | ✔ |  |  |
| `'cSHAKE128'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'cSHAKE256'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'ECDH'` |  |  | ✔ |  |  |  |
| `'ECDSA'` |  | ✔ |  |  |  |  |
| `'Ed25519'` |  | ✔ |  |  |  |  |
| `'Ed448'`[5](#user-content-fn-secure-curves) |  | ✔ |  |  |  |  |
| `'HKDF'` |  |  | ✔ |  |  |  |
| `'HMAC'` |  | ✔ |  |  |  |  |
| `'KMAC128'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |  |
| `'KMAC256'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |  |
| `'KT128'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'KT256'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'ML-DSA-44'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |  |
| `'ML-DSA-65'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |  |
| `'ML-DSA-87'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |  |
| `'ML-KEM-512'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |  |
| `'ML-KEM-768'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |  |
| `'ML-KEM-1024'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |  |
| `'PBKDF2'` |  |  | ✔ |  |  |  |
| `'RSA-OAEP'` | ✔ |  |  | ✔ |  |  |
| `'RSA-PSS'` |  | ✔ |  |  |  |  |
| `'RSASSA-PKCS1-v1_5'` |  | ✔ |  |  |  |  |
| `'SHA-1'` |  |  |  |  |  | ✔ |
| `'SHA-256'` |  |  |  |  |  | ✔ |
| `'SHA-384'` |  |  |  |  |  | ✔ |
| `'SHA-512'` |  |  |  |  |  | ✔ |
| `'SHA3-256'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'SHA3-384'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'SHA3-512'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'TurboSHAKE128'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'TurboSHAKE256'`[4](#user-content-fn-modern-algos) |  |  |  |  |  | ✔ |
| `'X25519'` |  |  | ✔ |  |  |  |
| `'X448'`[5](#user-content-fn-secure-curves) |  |  | ✔ |  |  |  |

### Class: `Crypto`[#](#class-crypto)

Added in: v15.0.0

`globalThis.crypto` is an instance of the `Crypto`
class. `Crypto` is a singleton that provides access to the remainder of the
crypto API.

#### `crypto.subtle`[#](#cryptosubtle)

Added in: v15.0.0

- Type: [`<SubtleCrypto>`](webcrypto.html#class-subtlecrypto)

Provides access to the `SubtleCrypto` API.

#### `crypto.getRandomValues(typedArray)`[#](#cryptogetrandomvaluestypedarray)

Added in: v15.0.0

- `typedArray` [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- Returns: [`<Buffer>`](buffer.html#class-buffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

Generates cryptographically strong random values. The given `typedArray` is
filled with random values, and a reference to `typedArray` is returned.

The given `typedArray` must be an integer-based instance of [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray),
i.e. `Float32Array` and `Float64Array` are not accepted.

An error will be thrown if the given `typedArray` is larger than 65,536 bytes.

#### `crypto.randomUUID()`[#](#cryptorandomuuid)

Added in: v16.7.0

- Returns: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

Generates a random [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4 UUID. The UUID is generated using a
cryptographic pseudorandom number generator.

### Class: `CryptoKey`[#](#class-cryptokey)

Added in: v15.0.0

#### `cryptoKey.algorithm`[#](#cryptokeyalgorithm)

Added in: v15.0.0

- Type: [`<KeyAlgorithm>`](webcrypto.html#class-keyalgorithm) | [`<RsaHashedKeyAlgorithm>`](webcrypto.html#class-rsahashedkeyalgorithm) | [`<EcKeyAlgorithm>`](webcrypto.html#class-eckeyalgorithm) | [`<AesKeyAlgorithm>`](webcrypto.html#class-aeskeyalgorithm) | [`<HmacKeyAlgorithm>`](webcrypto.html#class-hmackeyalgorithm) | `<KmacKeyAlgorithm>`

An object detailing the algorithm for which the key can be used along with
additional algorithm-specific parameters.

Read-only.

#### `cryptoKey.extractable`[#](#cryptokeyextractable)

Added in: v15.0.0

- Type: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)

When `true`, the [`<CryptoKey>`](webcrypto.html#class-cryptokey) can be extracted using either [`subtle.exportKey()`](#subtleexportkeyformat-key) or [`subtle.wrapKey()`](#subtlewrapkeyformat-key-wrappingkey-wrapalgorithm).

Read-only.

#### `cryptoKey.type`[#](#cryptokeytype)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) One of `'secret'`, `'private'`, or `'public'`.

A string identifying whether the key is a symmetric (`'secret'`) or
asymmetric (`'private'` or `'public'`) key.

#### `cryptoKey.usages`[#](#cryptokeyusages)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[]

An array of strings identifying the operations for which the
key may be used.

The possible usages are:

- `'encrypt'` - Enable using the key with [`subtle.encrypt()`](#subtleencryptalgorithm-key-data)
- `'decrypt'` - Enable using the key with [`subtle.decrypt()`](#subtledecryptalgorithm-key-data)
- `'sign'` - Enable using the key with [`subtle.sign()`](#subtlesignalgorithm-key-data)
- `'verify'` - Enable using the key with [`subtle.verify()`](#subtleverifyalgorithm-key-signature-data)
- `'deriveKey'` - Enable using the key with [`subtle.deriveKey()`](#subtlederivekeyalgorithm-basekey-derivedkeytype-extractable-keyusages)
- `'deriveBits'` - Enable using the key with [`subtle.deriveBits()`](#subtlederivebitsalgorithm-basekey-length)
- `'encapsulateBits'` - Enable using the key with [`subtle.encapsulateBits()`](#subtleencapsulatebitsencapsulationalgorithm-encapsulationkey)
- `'decapsulateBits'` - Enable using the key with [`subtle.decapsulateBits()`](#subtledecapsulatebitsdecapsulationalgorithm-decapsulationkey-ciphertext)
- `'encapsulateKey'` - Enable using the key with [`subtle.encapsulateKey()`](#subtleencapsulatekeyencapsulationalgorithm-encapsulationkey-sharedkeyalgorithm-extractable-keyusages)
- `'decapsulateKey'` - Enable using the key with [`subtle.decapsulateKey()`](#subtledecapsulatekeydecapsulationalgorithm-decapsulationkey-ciphertext-sharedkeyalgorithm-extractable-keyusages)
- `'wrapKey'` - Enable using the key with [`subtle.wrapKey()`](#subtlewrapkeyformat-key-wrappingkey-wrapalgorithm)
- `'unwrapKey'` - Enable using the key with [`subtle.unwrapKey()`](#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgorithm-unwrappedkeyalgorithm-extractable-keyusages)

Valid key usages depend on the key algorithm (identified by
`cryptokey.algorithm.name`).

**Column Legend:**

- **Encryption**: [`subtle.encrypt()`](#subtleencryptalgorithm-key-data) / [`subtle.decrypt()`](#subtledecryptalgorithm-key-data)
- **Signatures and MAC**: [`subtle.sign()`](#subtlesignalgorithm-key-data) / [`subtle.verify()`](#subtleverifyalgorithm-key-signature-data)
- **Key or Bits Derivation**: [`subtle.deriveBits()`](#subtlederivebitsalgorithm-basekey-length) / [`subtle.deriveKey()`](#subtlederivekeyalgorithm-basekey-derivedkeytype-extractable-keyusages)
- **Key Wrapping**: [`subtle.wrapKey()`](#subtlewrapkeyformat-key-wrappingkey-wrapalgorithm) / [`subtle.unwrapKey()`](#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgorithm-unwrappedkeyalgorithm-extractable-keyusages)
- **Key Encapsulation**: [`subtle.encapsulateBits()`](#subtleencapsulatebitsencapsulationalgorithm-encapsulationkey) / [`subtle.decapsulateBits()`](#subtledecapsulatebitsdecapsulationalgorithm-decapsulationkey-ciphertext) /
  [`subtle.encapsulateKey()`](#subtleencapsulatekeyencapsulationalgorithm-encapsulationkey-sharedkeyalgorithm-extractable-keyusages) / [`subtle.decapsulateKey()`](#subtledecapsulatekeydecapsulationalgorithm-decapsulationkey-ciphertext-sharedkeyalgorithm-extractable-keyusages)

| Supported Key Algorithm | Encryption | Signatures and MAC | Key or Bits Derivation | Key Wrapping | Key Encapsulation |
| --- | --- | --- | --- | --- | --- |
| `'AES-CBC'` | ✔ |  |  | ✔ |  |
| `'AES-CTR'` | ✔ |  |  | ✔ |  |
| `'AES-GCM'` | ✔ |  |  | ✔ |  |
| `'AES-KW'` |  |  |  | ✔ |  |
| `'AES-OCB'` | ✔ |  |  | ✔ |  |
| `'Argon2d'` |  |  | ✔ |  |  |
| `'Argon2i'` |  |  | ✔ |  |  |
| `'Argon2id'` |  |  | ✔ |  |  |
| `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos) | ✔ |  |  | ✔ |  |
| `'ECDH'` |  |  | ✔ |  |  |
| `'ECDSA'` |  | ✔ |  |  |  |
| `'Ed25519'` |  | ✔ |  |  |  |
| `'Ed448'`[5](#user-content-fn-secure-curves) |  | ✔ |  |  |  |
| `'HKDF'` |  |  | ✔ |  |  |
| `'HMAC'` |  | ✔ |  |  |  |
| `'KMAC128'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |
| `'KMAC256'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |
| `'ML-DSA-44'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |
| `'ML-DSA-65'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |
| `'ML-DSA-87'`[4](#user-content-fn-modern-algos) |  | ✔ |  |  |  |
| `'ML-KEM-512'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |
| `'ML-KEM-768'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |
| `'ML-KEM-1024'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |
| `'PBKDF2'` |  |  | ✔ |  |  |
| `'RSA-OAEP'` | ✔ |  |  | ✔ |  |
| `'RSA-PSS'` |  | ✔ |  |  |  |
| `'RSASSA-PKCS1-v1_5'` |  | ✔ |  |  |  |
| `'X25519'` |  |  | ✔ |  |  |
| `'X448'`[5](#user-content-fn-secure-curves) |  |  | ✔ |  |  |

### Class: `CryptoKeyPair`[#](#class-cryptokeypair)

Added in: v15.0.0

The `CryptoKeyPair` is a simple dictionary object with `publicKey` and
`privateKey` properties, representing an asymmetric key pair.

#### `cryptoKeyPair.privateKey`[#](#cryptokeypairprivatekey)

Added in: v15.0.0

- Type: [`<CryptoKey>`](webcrypto.html#class-cryptokey) A [`<CryptoKey>`](webcrypto.html#class-cryptokey) whose `type` will be `'private'`.

#### `cryptoKeyPair.publicKey`[#](#cryptokeypairpublickey)

Added in: v15.0.0

- Type: [`<CryptoKey>`](webcrypto.html#class-cryptokey) A [`<CryptoKey>`](webcrypto.html#class-cryptokey) whose `type` will be `'public'`.

### Class: `SubtleCrypto`[#](#class-subtlecrypto)

Added in: v15.0.0

#### Static method: `SubtleCrypto.supports(operation, algorithm[, lengthOrAdditionalAlgorithm])`[#](#static-method-subtlecryptosupportsoperation-algorithm-lengthoradditionalalgorithm)

Added in: v24.7.0

Stability: 1.1 - Active development

- `operation` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) "encrypt", "decrypt", "sign", "verify", "digest", "generateKey", "deriveKey", "deriveBits", "importKey", "exportKey", "getPublicKey", "wrapKey", "unwrapKey", "encapsulateBits", "encapsulateKey", "decapsulateBits", or "decapsulateKey"
- `algorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)
- `lengthOrAdditionalAlgorithm` [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) | [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type) Depending on the operation this is either ignored, the value of the length argument when operation is "deriveBits", the algorithm of key to be derived when operation is "deriveKey", the algorithm of key to be exported before wrapping when operation is "wrapKey", the algorithm of key to be imported after unwrapping when operation is "unwrapKey", or the algorithm of key to be imported after en/decapsulating a key when operation is "encapsulateKey" or "decapsulateKey". **Default:** `null` when operation is "deriveBits", `undefined` otherwise.
- Returns: [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) Indicating whether the implementation supports the given operation

Allows feature detection in Web Crypto API,
which can be used to detect whether a given algorithm identifier
(including its parameters) is supported for the given operation.

See [Checking for runtime algorithm support](#checking-for-runtime-algorithm-support) for an example use of this method.

#### `subtle.decapsulateBits(decapsulationAlgorithm, decapsulationKey, ciphertext)`[#](#subtledecapsulatebitsdecapsulationalgorithm-decapsulationkey-ciphertext)

Added in: v24.7.0

Stability: 1.1 - Active development

- `decapsulationAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)
- `decapsulationKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `ciphertext` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) upon success.

A message recipient uses their asymmetric private key to decrypt an
"encapsulated key" (ciphertext), thereby recovering a temporary symmetric
key (represented as [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)) which is then used to decrypt a message.

The algorithms currently supported include:

- `'ML-KEM-512'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-768'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-1024'`[4](#user-content-fn-modern-algos)

#### `subtle.decapsulateKey(decapsulationAlgorithm, decapsulationKey, ciphertext, sharedKeyAlgorithm, extractable, keyUsages)`[#](#subtledecapsulatekeydecapsulationalgorithm-decapsulationkey-ciphertext-sharedkeyalgorithm-extractable-keyusages)

Added in: v24.7.0

Stability: 1.1 - Active development

- `decapsulationAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)
- `decapsulationKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `ciphertext` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- `sharedKeyAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<HmacImportParams>`](webcrypto.html#class-hmacimportparams) | [`<AesDerivedKeyParams>`](webcrypto.html#class-aesderivedkeyparams) | `<KmacImportParams>`
- `extractable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `keyUsages` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] See [Key usages](#cryptokeyusages).
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with [`<CryptoKey>`](webcrypto.html#class-cryptokey) upon success.

A message recipient uses their asymmetric private key to decrypt an
"encapsulated key" (ciphertext), thereby recovering a temporary symmetric
key (represented as [`<CryptoKey>`](webcrypto.html#class-cryptokey)) which is then used to decrypt a message.

The algorithms currently supported include:

- `'ML-KEM-512'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-768'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-1024'`[4](#user-content-fn-modern-algos)

#### `subtle.decrypt(algorithm, key, data)`[#](#subtledecryptalgorithm-key-data)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | AES-OCB algorithm is now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |

- `algorithm` [`<RsaOaepParams>`](webcrypto.html#class-rsaoaepparams) | [`<AesCtrParams>`](webcrypto.html#class-aesctrparams) | [`<AesCbcParams>`](webcrypto.html#class-aescbcparams) | `<AeadParams>`
- `key` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `data` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) upon success.

Using the method and parameters specified in `algorithm` and the keying
material provided by `key`, this method attempts to decipher the
provided `data`. If successful, the returned promise will be resolved with
an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the plaintext result.

The algorithms currently supported include:

- `'AES-CBC'`
- `'AES-CTR'`
- `'AES-GCM'`
- `'AES-OCB'`[4](#user-content-fn-modern-algos)
- `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos)
- `'RSA-OAEP'`

#### `subtle.deriveBits(algorithm, baseKey[, length])`[#](#subtlederivebitsalgorithm-basekey-length)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.8.0 | Argon2 algorithms are now supported. |
| v22.5.0, v20.17.0, v18.20.5 | The length parameter is now optional for `'ECDH'`, `'X25519'`, and `'X448'`. |
| v18.4.0, v16.17.0 | Added `'X25519'`, and `'X448'` algorithms. |

- `algorithm` [`<EcdhKeyDeriveParams>`](webcrypto.html#class-ecdhkeyderiveparams) | [`<HkdfParams>`](webcrypto.html#class-hkdfparams) | [`<Pbkdf2Params>`](webcrypto.html#class-pbkdf2params) | `<Argon2Params>`
- `baseKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `length` [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<null>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#null_type) **Default:** `null`
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) upon success.

Using the method and parameters specified in `algorithm` and the keying
material provided by `baseKey`, this method attempts to generate
`length` bits.

When `length` is not provided or `null` the maximum number of bits for a given
algorithm is generated. This is allowed for the `'ECDH'`, `'X25519'`, and `'X448'`[5](#user-content-fn-secure-curves)
algorithms, for other algorithms `length` is required to be a number.

If successful, the returned promise will be resolved with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
containing the generated data.

The algorithms currently supported include:

- `'Argon2d'`[4](#user-content-fn-modern-algos)
- `'Argon2i'`[4](#user-content-fn-modern-algos)
- `'Argon2id'`[4](#user-content-fn-modern-algos)
- `'ECDH'`
- `'HKDF'`
- `'PBKDF2'`
- `'X25519'`
- `'X448'`[5](#user-content-fn-secure-curves)

#### `subtle.deriveKey(algorithm, baseKey, derivedKeyType, extractable, keyUsages)`[#](#subtlederivekeyalgorithm-basekey-derivedkeytype-extractable-keyusages)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.8.0 | Argon2 algorithms are now supported. |
| v18.4.0, v16.17.0 | Added `'X25519'`, and `'X448'` algorithms. |

- `algorithm` [`<EcdhKeyDeriveParams>`](webcrypto.html#class-ecdhkeyderiveparams) | [`<HkdfParams>`](webcrypto.html#class-hkdfparams) | [`<Pbkdf2Params>`](webcrypto.html#class-pbkdf2params) | `<Argon2Params>`
- `baseKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `derivedKeyType` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<HmacImportParams>`](webcrypto.html#class-hmacimportparams) | [`<AesDerivedKeyParams>`](webcrypto.html#class-aesderivedkeyparams) | `<KmacImportParams>`
- `extractable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `keyUsages` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] See [Key usages](#cryptokeyusages).
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [`<CryptoKey>`](webcrypto.html#class-cryptokey) upon success.

Using the method and parameters specified in `algorithm`, and the keying
material provided by `baseKey`, this method attempts to generate
a new [`<CryptoKey>`](webcrypto.html#class-cryptokey) based on the method and parameters in `derivedKeyType`.

Calling this method is equivalent to calling [`subtle.deriveBits()`](#subtlederivebitsalgorithm-basekey-length) to
generate raw keying material, then passing the result into the
[`subtle.importKey()`](#subtleimportkeyformat-keydata-algorithm-extractable-keyusages) method using the `derivedKeyType`, `extractable`, and
`keyUsages` parameters as input.

The algorithms currently supported include:

- `'Argon2d'`[4](#user-content-fn-modern-algos)
- `'Argon2i'`[4](#user-content-fn-modern-algos)
- `'Argon2id'`[4](#user-content-fn-modern-algos)
- `'ECDH'`
- `'HKDF'`
- `'PBKDF2'`
- `'X25519'`
- `'X448'`[5](#user-content-fn-secure-curves)

#### `subtle.digest(algorithm, data)`[#](#subtledigestalgorithm-data)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v25.9.0 | TurboSHAKE and KangarooTwelve algorithms are now supported. |
| v24.7.0 | SHA-3 algorithms are now supported. |
| v24.7.0 | SHAKE algorithms are now supported. |

- `algorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | `<CShakeParams>` | `<TurboShakeParams>` | `<KangarooTwelveParams>`
- `data` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) upon success.

Using the method identified by `algorithm`, this method attempts to
generate a digest of `data`. If successful, the returned promise is resolved
with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the computed digest.

If `algorithm` is provided as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), it must be one of:

- `'cSHAKE128'`[4](#user-content-fn-modern-algos)
- `'cSHAKE256'`[4](#user-content-fn-modern-algos)
- `'KT128'`[4](#user-content-fn-modern-algos)
- `'KT256'`[4](#user-content-fn-modern-algos)
- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)
- `'TurboSHAKE128'`[4](#user-content-fn-modern-algos)
- `'TurboSHAKE256'`[4](#user-content-fn-modern-algos)

If `algorithm` is provided as an [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object), it must have a `name` property
whose value is one of the above.

#### `subtle.encapsulateBits(encapsulationAlgorithm, encapsulationKey)`[#](#subtleencapsulatebitsencapsulationalgorithm-encapsulationkey)

Added in: v24.7.0

Stability: 1.1 - Active development

- `encapsulationAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)
- `encapsulationKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with {EncapsulatedBits} upon success.

Uses a message recipient's asymmetric public key to encrypt a temporary symmetric key.
This encrypted key is the "encapsulated key" represented as {EncapsulatedBits}.

The algorithms currently supported include:

- `'ML-KEM-512'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-768'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-1024'`[4](#user-content-fn-modern-algos)

#### `subtle.encapsulateKey(encapsulationAlgorithm, encapsulationKey, sharedKeyAlgorithm, extractable, keyUsages)`[#](#subtleencapsulatekeyencapsulationalgorithm-encapsulationkey-sharedkeyalgorithm-extractable-keyusages)

Added in: v24.7.0

Stability: 1.1 - Active development

- `encapsulationAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)
- `encapsulationKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `sharedKeyAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<HmacImportParams>`](webcrypto.html#class-hmacimportparams) | [`<AesDerivedKeyParams>`](webcrypto.html#class-aesderivedkeyparams) | `<KmacImportParams>`
- `extractable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `keyUsages` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] See [Key usages](#cryptokeyusages).
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with {EncapsulatedKey} upon success.

Uses a message recipient's asymmetric public key to encrypt a temporary symmetric key.
This encrypted key is the "encapsulated key" represented as {EncapsulatedKey}.

The algorithms currently supported include:

- `'ML-KEM-512'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-768'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-1024'`[4](#user-content-fn-modern-algos)

#### `subtle.encrypt(algorithm, key, data)`[#](#subtleencryptalgorithm-key-data)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | AES-OCB algorithm is now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |

- `algorithm` [`<RsaOaepParams>`](webcrypto.html#class-rsaoaepparams) | [`<AesCtrParams>`](webcrypto.html#class-aesctrparams) | [`<AesCbcParams>`](webcrypto.html#class-aescbcparams) | `<AeadParams>`
- `key` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `data` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) upon success.

Using the method and parameters specified by `algorithm` and the keying
material provided by `key`, this method attempts to encipher `data`.
If successful, the returned promise is resolved with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
containing the encrypted result.

The algorithms currently supported include:

- `'AES-CBC'`
- `'AES-CTR'`
- `'AES-GCM'`
- `'AES-OCB'`[4](#user-content-fn-modern-algos)
- `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos)
- `'RSA-OAEP'`

#### `subtle.exportKey(format, key)`[#](#subtleexportkeyformat-key)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v26.1.0 | Added JWK format support for ML-KEM key types. |
| v24.8.0 | KMAC algorithms are now supported. |
| v24.7.0 | ML-KEM algorithms are now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |
| v24.7.0 | ML-DSA algorithms are now supported. |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, `'Ed448'`, `'X25519'`, and `'X448'` algorithms. |
| v15.9.0 | Removed `'NODE-DSA'` JWK export. |

- `format` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[4](#user-content-fn-modern-algos),
  `'raw-public'`[4](#user-content-fn-modern-algos), or `'raw-seed'`[4](#user-content-fn-modern-algos).
- `key` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object) upon success.

Exports the given key into the specified format, if supported.

If the [`<CryptoKey>`](webcrypto.html#class-cryptokey) is not extractable, the returned promise will reject.

When `format` is either `'pkcs8'` or `'spki'` and the export is successful,
the returned promise will be resolved with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the
exported key data.

When `format` is `'jwk'` and the export is successful, the returned promise
will be resolved with a JavaScript object conforming to the [JSON Web Key](https://tools.ietf.org/html/rfc7517)
specification.

| Supported Key Algorithm | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` | `'raw-secret'` | `'raw-public'` | `'raw-seed'` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `'AES-CBC'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-CTR'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-GCM'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-KW'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-OCB'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'Ed448'`[5](#user-content-fn-secure-curves) | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'HMAC'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'KMAC128'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'KMAC256'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'ML-DSA-44'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-DSA-65'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-DSA-87'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-KEM-512'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-KEM-768'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-KEM-1024'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'RSA-OAEP'` | ✔ | ✔ | ✔ |  |  |  |  |
| `'RSA-PSS'` | ✔ | ✔ | ✔ |  |  |  |  |
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ |  |  |  |  |

#### `subtle.getPublicKey(key, keyUsages)`[#](#subtlegetpublickeykey-keyusages)

Added in: v24.7.0

Stability: 1.1 - Active development

- `key` [`<CryptoKey>`](webcrypto.html#class-cryptokey) A private key from which to derive the corresponding public key.
- `keyUsages` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] See [Key usages](#cryptokeyusages).
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [`<CryptoKey>`](webcrypto.html#class-cryptokey) upon success.

Derives the public key from a given private key.

#### `subtle.generateKey(algorithm, extractable, keyUsages)`[#](#subtlegeneratekeyalgorithm-extractable-keyusages)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.8.0 | KMAC algorithms are now supported. |
| v24.7.0 | ML-KEM algorithms are now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |
| v24.7.0 | ML-DSA algorithms are now supported. |

- `algorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<RsaHashedKeyGenParams>`](webcrypto.html#class-rsahashedkeygenparams) | [`<EcKeyGenParams>`](webcrypto.html#class-eckeygenparams) | [`<HmacKeyGenParams>`](webcrypto.html#class-hmackeygenparams) | [`<AesKeyGenParams>`](webcrypto.html#class-aeskeygenparams) | `<KmacKeyGenParams>`

- `extractable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `keyUsages` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] See [Key usages](#cryptokeyusages).
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [`<CryptoKey>`](webcrypto.html#class-cryptokey) | [`<CryptoKeyPair>`](webcrypto.html#class-cryptokeypair) upon success.

Using the parameters provided in `algorithm`, this method
attempts to generate new keying material. Depending on the algorithm used
either a single [`<CryptoKey>`](webcrypto.html#class-cryptokey) or a [`<CryptoKeyPair>`](webcrypto.html#class-cryptokeypair) is generated.

The [`<CryptoKeyPair>`](webcrypto.html#class-cryptokeypair) (public and private key) generating algorithms supported
include:

- `'ECDH'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`[5](#user-content-fn-secure-curves)
- `'ML-DSA-44'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-65'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-87'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-512'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-768'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-1024'`[4](#user-content-fn-modern-algos)
- `'RSA-OAEP'`
- `'RSA-PSS'`
- `'RSASSA-PKCS1-v1_5'`
- `'X25519'`
- `'X448'`[5](#user-content-fn-secure-curves)

The [`<CryptoKey>`](webcrypto.html#class-cryptokey) (secret key) generating algorithms supported include:

- `'AES-CBC'`
- `'AES-CTR'`
- `'AES-GCM'`
- `'AES-KW'`
- `'AES-OCB'`[4](#user-content-fn-modern-algos)
- `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos)
- `'HMAC'`
- `'KMAC128'`[4](#user-content-fn-modern-algos)
- `'KMAC256'`[4](#user-content-fn-modern-algos)

#### `subtle.importKey(format, keyData, algorithm, extractable, keyUsages)`[#](#subtleimportkeyformat-keydata-algorithm-extractable-keyusages)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v26.1.0 | Added JWK format support for ML-KEM key types. |
| v25.9.0 | Importing ML-DSA and ML-KEM PKCS#8 keys without a seed is no longer supported. |
| v24.8.0 | KMAC algorithms are now supported. |
| v24.7.0 | ML-KEM algorithms are now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |
| v24.7.0 | ML-DSA algorithms are now supported. |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, `'Ed448'`, `'X25519'`, and `'X448'` algorithms. |
| v15.9.0 | Removed `'NODE-DSA'` JWK import. |

- `format` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[4](#user-content-fn-modern-algos),
  `'raw-public'`[4](#user-content-fn-modern-algos), or `'raw-seed'`[4](#user-content-fn-modern-algos).
- `keyData` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer) | [`<Object>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)

- `algorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<RsaHashedImportParams>`](webcrypto.html#class-rsahashedimportparams) | [`<EcKeyImportParams>`](webcrypto.html#class-eckeyimportparams) | [`<HmacImportParams>`](webcrypto.html#class-hmacimportparams) | `<KmacImportParams>`

- `extractable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `keyUsages` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] See [Key usages](#cryptokeyusages).
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [`<CryptoKey>`](webcrypto.html#class-cryptokey) upon success.

This method attempts to interpret the provided `keyData`
as the given `format` to create a [`<CryptoKey>`](webcrypto.html#class-cryptokey) instance using the provided `algorithm`, `extractable`, and `keyUsages` arguments. If the import is
successful, the returned promise will be resolved with a [`<CryptoKey>`](webcrypto.html#class-cryptokey)
representation of the key material.

If importing KDF algorithm keys, `extractable` must be `false`.

The algorithms currently supported include:

| Supported Key Algorithm | `'spki'` | `'pkcs8'` | `'jwk'` | `'raw'` | `'raw-secret'` | `'raw-public'` | `'raw-seed'` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `'AES-CBC'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-CTR'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-GCM'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-KW'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'AES-OCB'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'Argon2d'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |  |  |
| `'Argon2i'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |  |  |
| `'Argon2id'`[4](#user-content-fn-modern-algos) |  |  |  |  | ✔ |  |  |
| `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'ECDH'` | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'ECDSA'` | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'Ed25519'` | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'Ed448'`[5](#user-content-fn-secure-curves) | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'HKDF'` |  |  |  | ✔ | ✔ |  |  |
| `'HMAC'` |  |  | ✔ | ✔ | ✔ |  |  |
| `'KMAC128'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'KMAC256'`[4](#user-content-fn-modern-algos) |  |  | ✔ |  | ✔ |  |  |
| `'ML-DSA-44'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-DSA-65'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-DSA-87'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-KEM-512'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-KEM-768'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'ML-KEM-1024'`[4](#user-content-fn-modern-algos) | ✔ | ✔ | ✔ |  |  | ✔ | ✔ |
| `'PBKDF2'` |  |  |  | ✔ | ✔ |  |  |
| `'RSA-OAEP'` | ✔ | ✔ | ✔ |  |  |  |  |
| `'RSA-PSS'` | ✔ | ✔ | ✔ |  |  |  |  |
| `'RSASSA-PKCS1-v1_5'` | ✔ | ✔ | ✔ |  |  |  |  |
| `'X25519'` | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |
| `'X448'`[5](#user-content-fn-secure-curves) | ✔ | ✔ | ✔ | ✔ |  | ✔ |  |

#### `subtle.sign(algorithm, key, data)`[#](#subtlesignalgorithm-key-data)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.8.0 | KMAC algorithms are now supported. |
| v24.7.0 | ML-DSA algorithms are now supported. |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, and `'Ed448'` algorithms. |

- `algorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<RsaPssParams>`](webcrypto.html#class-rsapssparams) | [`<EcdsaParams>`](webcrypto.html#class-ecdsaparams) | `<ContextParams>` | `<KmacParams>`
- `key` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `data` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) upon success.

Using the method and parameters given by `algorithm` and the keying material
provided by `key`, this method attempts to generate a cryptographic
signature of `data`. If successful, the returned promise is resolved with
an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the generated signature.

The algorithms currently supported include:

- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`[5](#user-content-fn-secure-curves)
- `'HMAC'`
- `'KMAC128'`[4](#user-content-fn-modern-algos)
- `'KMAC256'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-44'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-65'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-87'`[4](#user-content-fn-modern-algos)
- `'RSA-PSS'`
- `'RSASSA-PKCS1-v1_5'`

#### `subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages)`[#](#subtleunwrapkeyformat-wrappedkey-unwrappingkey-unwrapalgorithm-unwrappedkeyalgorithm-extractable-keyusages)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | AES-OCB algorithm is now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |

- `format` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[4](#user-content-fn-modern-algos),
  `'raw-public'`[4](#user-content-fn-modern-algos), or `'raw-seed'`[4](#user-content-fn-modern-algos).
- `wrappedKey` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- `unwrappingKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)

- `unwrapAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<RsaOaepParams>`](webcrypto.html#class-rsaoaepparams) | [`<AesCtrParams>`](webcrypto.html#class-aesctrparams) | [`<AesCbcParams>`](webcrypto.html#class-aescbcparams) | `<AeadParams>`
- `unwrappedKeyAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<RsaHashedImportParams>`](webcrypto.html#class-rsahashedimportparams) | [`<EcKeyImportParams>`](webcrypto.html#class-eckeyimportparams) | [`<HmacImportParams>`](webcrypto.html#class-hmacimportparams) | `<KmacImportParams>`

- `extractable` [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type)
- `keyUsages` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)[] See [Key usages](#cryptokeyusages).
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [`<CryptoKey>`](webcrypto.html#class-cryptokey) upon success.

In cryptography, "wrapping a key" refers to exporting and then encrypting the
keying material. This method attempts to decrypt a wrapped
key and create a [`<CryptoKey>`](webcrypto.html#class-cryptokey) instance. It is equivalent to calling [`subtle.decrypt()`](#subtledecryptalgorithm-key-data) first on the encrypted key data (using the `wrappedKey`,
`unwrapAlgorithm`, and `unwrappingKey` arguments as input) then passing the results
to the [`subtle.importKey()`](#subtleimportkeyformat-keydata-algorithm-extractable-keyusages) method using the `unwrappedKeyAlgorithm`,
`extractable`, and `keyUsages` arguments as inputs. If successful, the returned
promise is resolved with a [`<CryptoKey>`](webcrypto.html#class-cryptokey) object.

The wrapping algorithms currently supported include:

- `'AES-CBC'`
- `'AES-CTR'`
- `'AES-GCM'`
- `'AES-KW'`
- `'AES-OCB'`[4](#user-content-fn-modern-algos)
- `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos)
- `'RSA-OAEP'`

The unwrapped key algorithms supported include:

- `'AES-CBC'`
- `'AES-CTR'`
- `'AES-GCM'`
- `'AES-KW'`
- `'AES-OCB'`[4](#user-content-fn-modern-algos)
- `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos)
- `'ECDH'`
- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`[5](#user-content-fn-secure-curves)
- `'HMAC'`
- `'KMAC128'`[4](#user-content-fn-modern-algos)
- `'KMAC256'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-44'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-65'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-87'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-512'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-768'`[4](#user-content-fn-modern-algos)
- `'ML-KEM-1024'`[4](#user-content-fn-modern-algos)
- `'RSA-OAEP'`
- `'RSA-PSS'`
- `'RSASSA-PKCS1-v1_5'`
- `'X25519'`
- `'X448'`[5](#user-content-fn-secure-curves)

#### `subtle.verify(algorithm, key, signature, data)`[#](#subtleverifyalgorithm-key-signature-data)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.8.0 | KMAC algorithms are now supported. |
| v24.7.0 | ML-DSA algorithms are now supported. |
| v18.4.0, v16.17.0 | Added `'Ed25519'`, and `'Ed448'` algorithms. |

- `algorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<RsaPssParams>`](webcrypto.html#class-rsapssparams) | [`<EcdsaParams>`](webcrypto.html#class-ecdsaparams) | `<ContextParams>` | `<KmacParams>`
- `key` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `signature` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- `data` [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with a [`<boolean>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#boolean_type) upon success.

Using the method and parameters given in `algorithm` and the keying material
provided by `key`, this method attempts to verify that `signature` is
a valid cryptographic signature of `data`. The returned promise is resolved
with either `true` or `false`.

The algorithms currently supported include:

- `'ECDSA'`
- `'Ed25519'`
- `'Ed448'`[5](#user-content-fn-secure-curves)
- `'HMAC'`
- `'KMAC128'`[4](#user-content-fn-modern-algos)
- `'KMAC256'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-44'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-65'`[4](#user-content-fn-modern-algos)
- `'ML-DSA-87'`[4](#user-content-fn-modern-algos)
- `'RSA-PSS'`
- `'RSASSA-PKCS1-v1_5'`

#### `subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm)`[#](#subtlewrapkeyformat-key-wrappingkey-wrapalgorithm)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | AES-OCB algorithm is now supported. |
| v24.7.0 | ChaCha20-Poly1305 algorithm is now supported. |

- `format` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'raw'`, `'pkcs8'`, `'spki'`, `'jwk'`, `'raw-secret'`[4](#user-content-fn-modern-algos),
  `'raw-public'`[4](#user-content-fn-modern-algos), or `'raw-seed'`[4](#user-content-fn-modern-algos).
- `key` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `wrappingKey` [`<CryptoKey>`](webcrypto.html#class-cryptokey)
- `wrapAlgorithm` [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm) | [`<RsaOaepParams>`](webcrypto.html#class-rsaoaepparams) | [`<AesCtrParams>`](webcrypto.html#class-aesctrparams) | [`<AesCbcParams>`](webcrypto.html#class-aescbcparams) | `<AeadParams>`
- Returns: [`<Promise>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfills with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) upon success.

In cryptography, "wrapping a key" refers to exporting and then encrypting the
keying material. This method exports the keying material into
the format identified by `format`, then encrypts it using the method and
parameters specified by `wrapAlgorithm` and the keying material provided by
`wrappingKey`. It is the equivalent to calling [`subtle.exportKey()`](#subtleexportkeyformat-key) using
`format` and `key` as the arguments, then passing the result to the
[`subtle.encrypt()`](#subtleencryptalgorithm-key-data) method using `wrappingKey` and `wrapAlgorithm` as inputs. If
successful, the returned promise will be resolved with an [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
containing the encrypted key data.

The wrapping algorithms currently supported include:

- `'AES-CBC'`
- `'AES-CTR'`
- `'AES-GCM'`
- `'AES-KW'`
- `'AES-OCB'`[4](#user-content-fn-modern-algos)
- `'ChaCha20-Poly1305'`[4](#user-content-fn-modern-algos)
- `'RSA-OAEP'`

### Algorithm parameters[#](#algorithm-parameters)

The algorithm parameter objects define the methods and parameters used by
the various [`<SubtleCrypto>`](webcrypto.html#class-subtlecrypto) methods. While described here as "classes", they
are simple JavaScript dictionary objects.

#### Class: `Algorithm`[#](#class-algorithm)

Added in: v15.0.0

##### `Algorithm.name`[#](#algorithmname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

#### Class: `AeadParams`[#](#class-aeadparams)

Added in: v15.0.0

##### `aeadParams.additionalData`[#](#aeadparamsadditionaldata)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type)

Extra input that is not encrypted but is included in the authentication
of the data. The use of `additionalData` is optional.

##### `aeadParams.iv`[#](#aeadparamsiv)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

The initialization vector must be unique for every encryption operation using a
given key.

##### `aeadParams.name`[#](#aeadparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'AES-GCM'`, `'AES-OCB'`, or `'ChaCha20-Poly1305'`.

##### `aeadParams.tagLength`[#](#aeadparamstaglength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The size in bits of the generated authentication tag.

#### Class: `AesDerivedKeyParams`[#](#class-aesderivedkeyparams)

Added in: v15.0.0

##### `aesDerivedKeyParams.name`[#](#aesderivedkeyparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, `'AES-OCB'`, or `'AES-KW'`

##### `aesDerivedKeyParams.length`[#](#aesderivedkeyparamslength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length of the AES key to be derived. This must be either `128`, `192`,
or `256`.

#### Class: `AesCbcParams`[#](#class-aescbcparams)

Added in: v15.0.0

##### `aesCbcParams.iv`[#](#aescbcparamsiv)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

Provides the initialization vector. It must be exactly 16-bytes in length
and should be unpredictable and cryptographically random.

##### `aesCbcParams.name`[#](#aescbcparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'AES-CBC'`.

#### Class: `AesCtrParams`[#](#class-aesctrparams)

Added in: v15.0.0

##### `aesCtrParams.counter`[#](#aesctrparamscounter)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

The initial value of the counter block. This must be exactly 16 bytes long.

The `AES-CTR` method uses the rightmost `length` bits of the block as the
counter and the remaining bits as the nonce.

##### `aesCtrParams.length`[#](#aesctrparamslength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) The number of bits in the `aesCtrParams.counter` that are
  to be used as the counter.

##### `aesCtrParams.name`[#](#aesctrparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'AES-CTR'`.

#### Class: `AesKeyAlgorithm`[#](#class-aeskeyalgorithm)

Added in: v15.0.0

##### `aesKeyAlgorithm.length`[#](#aeskeyalgorithmlength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length of the AES key in bits.

##### `aesKeyAlgorithm.name`[#](#aeskeyalgorithmname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

#### Class: `AesKeyGenParams`[#](#class-aeskeygenparams)

Added in: v15.0.0

##### `aesKeyGenParams.length`[#](#aeskeygenparamslength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length of the AES key to be generated. This must be either `128`, `192`,
or `256`.

##### `aesKeyGenParams.name`[#](#aeskeygenparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'AES-CBC'`, `'AES-CTR'`, `'AES-GCM'`, or
  `'AES-KW'`

#### Class: `Argon2Params`[#](#class-argon2params)

Added in: v24.8.0

##### `argon2Params.associatedData`[#](#argon2paramsassociateddata)

Added in: v24.8.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

Represents the optional associated data.

##### `argon2Params.memory`[#](#argon2paramsmemory)

Added in: v24.8.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Represents the memory size in kibibytes. It must be at least 8 times the degree of parallelism.

##### `argon2Params.name`[#](#argon2paramsname)

Added in: v24.8.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'Argon2d'`, `'Argon2i'`, or `'Argon2id'`.

##### `argon2Params.nonce`[#](#argon2paramsnonce)

Added in: v24.8.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

Represents the nonce, which is a salt for password hashing applications.

##### `argon2Params.parallelism`[#](#argon2paramsparallelism)

Added in: v24.8.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Represents the degree of parallelism.

##### `argon2Params.passes`[#](#argon2paramspasses)

Added in: v24.8.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Represents the number of passes.

##### `argon2Params.secretValue`[#](#argon2paramssecretvalue)

Added in: v24.8.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

Represents the optional secret value.

##### `argon2Params.version`[#](#argon2paramsversion)

Added in: v24.8.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

Represents the Argon2 version number. The default and currently only defined version is `19` (`0x13`).

#### Class: `ContextParams`[#](#class-contextparams)

Added in: v24.7.0

##### `contextParams.name`[#](#contextparamsname)

Added in: v24.7.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'Ed448'`[5](#user-content-fn-secure-curves), `'ML-DSA-44'`[4](#user-content-fn-modern-algos),
  `'ML-DSA-65'`[4](#user-content-fn-modern-algos), or `'ML-DSA-87'`[4](#user-content-fn-modern-algos).

##### `contextParams.context`[#](#contextparamscontext)

Added in: v24.7.0History

| Version | Changes |
| --- | --- |
| v24.8.0 | Non-empty context is now supported. |

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type)

The `context` member represents the optional context data to associate with
the message.

#### Class: `CShakeParams`[#](#class-cshakeparams)

Added in: v24.7.0History

| Version | Changes |
| --- | --- |
| v25.9.0 | Renamed `cShakeParams.length` to `cShakeParams.outputLength`. |

##### `cShakeParams.name`[#](#cshakeparamsname)

Added in: v24.7.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'cSHAKE128'`[4](#user-content-fn-modern-algos) or `'cSHAKE256'`[4](#user-content-fn-modern-algos).

##### `cShakeParams.outputLength`[#](#cshakeparamsoutputlength)

Added in: v25.9.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) represents the requested output length in bits.

##### `cShakeParams.functionName`[#](#cshakeparamsfunctionname)

Added in: v24.7.0History

| Version | Changes |
| --- | --- |
| v26.4.0 | Named cSHAKE variants are now accepted. |

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type)

The `functionName` member represents the NIST function-name byte string used to
domain-separate functions built on top of cSHAKE. Accepted values are:

- empty or `undefined`, in which case cSHAKE is equivalent to plain SHAKE
- the ASCII byte sequence `'KMAC'`
- the ASCII byte sequence `'TupleHash'`
- the ASCII byte sequence `'ParallelHash'`

##### `cShakeParams.customization`[#](#cshakeparamscustomization)

Added in: v24.7.0History

| Version | Changes |
| --- | --- |
| v26.4.0 | Non-empty customization is now supported. |

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type)

The `customization` member represents the customization data. Accepted
values are:

- empty or `undefined`, in which case cSHAKE is equivalent to plain SHAKE
- up to 512 bytes of arbitrary data

#### Class: `EcdhKeyDeriveParams`[#](#class-ecdhkeyderiveparams)

Added in: v15.0.0

##### `ecdhKeyDeriveParams.name`[#](#ecdhkeyderiveparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'ECDH'`, `'X25519'`, or `'X448'`[5](#user-content-fn-secure-curves).

##### `ecdhKeyDeriveParams.public`[#](#ecdhkeyderiveparamspublic)

Added in: v15.0.0

- Type: [`<CryptoKey>`](webcrypto.html#class-cryptokey)

ECDH key derivation operates by taking as input one party's private key and
another party's public key -- using both to generate a common shared secret.
The `ecdhKeyDeriveParams.public` property is set to the other party's public
key.

#### Class: `EcdsaParams`[#](#class-ecdsaparams)

Added in: v15.0.0

##### `ecdsaParams.hash`[#](#ecdsaparamshash)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | SHA-3 algorithms are now supported. |

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)

If represented as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)

If represented as an [`<Algorithm>`](webcrypto.html#class-algorithm), the object's `name` property
must be one of the above listed values.

##### `ecdsaParams.name`[#](#ecdsaparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'ECDSA'`.

#### Class: `EcKeyAlgorithm`[#](#class-eckeyalgorithm)

Added in: v15.0.0

##### `ecKeyAlgorithm.name`[#](#eckeyalgorithmname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

##### `ecKeyAlgorithm.namedCurve`[#](#eckeyalgorithmnamedcurve)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

#### Class: `EcKeyGenParams`[#](#class-eckeygenparams)

Added in: v15.0.0

##### `ecKeyGenParams.name`[#](#eckeygenparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'ECDSA'` or `'ECDH'`.

##### `ecKeyGenParams.namedCurve`[#](#eckeygenparamsnamedcurve)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'P-256'`, `'P-384'`, `'P-521'`.

#### Class: `EcKeyImportParams`[#](#class-eckeyimportparams)

Added in: v15.0.0

##### `ecKeyImportParams.name`[#](#eckeyimportparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'ECDSA'` or `'ECDH'`.

##### `ecKeyImportParams.namedCurve`[#](#eckeyimportparamsnamedcurve)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'P-256'`, `'P-384'`, `'P-521'`.

#### Class: `EncapsulatedBits`[#](#class-encapsulatedbits)

Added in: v24.7.0

A temporary symmetric secret key (represented as [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)) for message encryption
and the ciphertext (that can be transmitted to the message recipient along with the
message) encrypted by this shared key. The recipient uses their private key to determine
what the shared key is which then allows them to decrypt the message.

##### `encapsulatedBits.ciphertext`[#](#encapsulatedbitsciphertext)

Added in: v24.7.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

##### `encapsulatedBits.sharedKey`[#](#encapsulatedbitssharedkey)

Added in: v24.7.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

#### Class: `EncapsulatedKey`[#](#class-encapsulatedkey)

Added in: v24.7.0

A temporary symmetric secret key (represented as [`<CryptoKey>`](webcrypto.html#class-cryptokey)) for message encryption
and the ciphertext (that can be transmitted to the message recipient along with the
message) encrypted by this shared key. The recipient uses their private key to determine
what the shared key is which then allows them to decrypt the message.

##### `encapsulatedKey.ciphertext`[#](#encapsulatedkeyciphertext)

Added in: v24.7.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

##### `encapsulatedKey.sharedKey`[#](#encapsulatedkeysharedkey)

Added in: v24.7.0

- Type: [`<CryptoKey>`](webcrypto.html#class-cryptokey)

#### Class: `HkdfParams`[#](#class-hkdfparams)

Added in: v15.0.0

##### `hkdfParams.hash`[#](#hkdfparamshash)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | SHA-3 algorithms are now supported. |

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)

If represented as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)

If represented as an [`<Algorithm>`](webcrypto.html#class-algorithm), the object's `name` property
must be one of the above listed values.

##### `hkdfParams.info`[#](#hkdfparamsinfo)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

Provides application-specific contextual input to the HKDF algorithm.
This can be zero-length but must be provided.

##### `hkdfParams.name`[#](#hkdfparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'HKDF'`.

##### `hkdfParams.salt`[#](#hkdfparamssalt)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

The salt value significantly improves the strength of the HKDF algorithm.
It should be random or pseudorandom and should be the same length as the
output of the digest function (for instance, if using `'SHA-256'` as the
digest, the salt should be 256-bits of random data).

#### Class: `HmacImportParams`[#](#class-hmacimportparams)

Added in: v15.0.0

##### `hmacImportParams.hash`[#](#hmacimportparamshash)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | SHA-3 algorithms are now supported. |

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)

If represented as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)

If represented as an [`<Algorithm>`](webcrypto.html#class-algorithm), the object's `name` property
must be one of the above listed values.

##### `hmacImportParams.length`[#](#hmacimportparamslength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The optional number of bits in the HMAC key. This is optional and should
be omitted for most cases.

##### `hmacImportParams.name`[#](#hmacimportparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'HMAC'`.

#### Class: `HmacKeyAlgorithm`[#](#class-hmackeyalgorithm)

Added in: v15.0.0

##### `hmacKeyAlgorithm.hash`[#](#hmackeyalgorithmhash)

Added in: v15.0.0

- Type: [`<Algorithm>`](webcrypto.html#class-algorithm)

##### `hmacKeyAlgorithm.length`[#](#hmackeyalgorithmlength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length of the HMAC key in bits.

##### `hmacKeyAlgorithm.name`[#](#hmackeyalgorithmname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

#### Class: `HmacKeyGenParams`[#](#class-hmackeygenparams)

Added in: v15.0.0

##### `hmacKeyGenParams.hash`[#](#hmackeygenparamshash)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | SHA-3 algorithms are now supported. |

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)

If represented as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)

If represented as an [`<Algorithm>`](webcrypto.html#class-algorithm), the object's `name` property
must be one of the above listed values.

##### `hmacKeyGenParams.length`[#](#hmackeygenparamslength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The number of bits to generate for the HMAC key. If omitted,
the length will be determined by the hash algorithm used.
This is optional and should be omitted for most cases.

##### `hmacKeyGenParams.name`[#](#hmackeygenparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'HMAC'`.

#### Class: `KeyAlgorithm`[#](#class-keyalgorithm)

Added in: v15.0.0

##### `keyAlgorithm.name`[#](#keyalgorithmname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

#### Class: `KangarooTwelveParams`[#](#class-kangarootwelveparams)

Added in: v25.9.0

##### `kangarooTwelveParams.customization`[#](#kangarootwelveparamscustomization)

Added in: v25.9.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type)

The optional customization string for KangarooTwelve.

##### `kangarooTwelveParams.name`[#](#kangarootwelveparamsname)

Added in: v25.9.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'KT128'`[4](#user-content-fn-modern-algos) or `'KT256'`[4](#user-content-fn-modern-algos).

##### `kangarooTwelveParams.outputLength`[#](#kangarootwelveparamsoutputlength)

Added in: v25.9.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) represents the requested output length in bits.

#### Class: `KmacImportParams`[#](#class-kmacimportparams)

Added in: v24.8.0

##### `kmacImportParams.length`[#](#kmacimportparamslength)

Added in: v24.8.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The optional number of bits in the KMAC key. This is optional and should
be omitted for most cases.

##### `kmacImportParams.name`[#](#kmacimportparamsname)

Added in: v24.8.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'KMAC128'` or `'KMAC256'`.

#### Class: `KmacKeyAlgorithm`[#](#class-kmackeyalgorithm)

Added in: v24.8.0

##### `kmacKeyAlgorithm.length`[#](#kmackeyalgorithmlength)

Added in: v24.8.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length of the KMAC key in bits.

##### `kmacKeyAlgorithm.name`[#](#kmackeyalgorithmname)

Added in: v24.8.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

#### Class: `KmacKeyGenParams`[#](#class-kmackeygenparams)

Added in: v24.8.0

##### `kmacKeyGenParams.length`[#](#kmackeygenparamslength)

Added in: v24.8.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The number of bits to generate for the KMAC key. If omitted,
the length will be determined by the KMAC algorithm used.
This is optional and should be omitted for most cases.

##### `kmacKeyGenParams.name`[#](#kmackeygenparamsname)

Added in: v24.8.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'KMAC128'` or `'KMAC256'`.

#### Class: `KmacParams`[#](#class-kmacparams)

Added in: v24.8.0History

| Version | Changes |
| --- | --- |
| v25.9.0 | Renamed `kmacParams.length` to `kmacParams.outputLength`. |

##### `kmacParams.algorithm`[#](#kmacparamsalgorithm)

Added in: v24.8.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'KMAC128'` or `'KMAC256'`.

##### `kmacParams.outputLength`[#](#kmacparamsoutputlength)

Added in: v25.9.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) represents the requested output length in bits.

##### `kmacParams.customization`[#](#kmacparamscustomization)

Added in: v24.8.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type)

The `customization` member represents the optional customization string.

#### Class: `Pbkdf2Params`[#](#class-pbkdf2params)

Added in: v15.0.0

##### `pbkdf2Params.hash`[#](#pbkdf2paramshash)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | SHA-3 algorithms are now supported. |

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)

If represented as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)

If represented as an [`<Algorithm>`](webcrypto.html#class-algorithm), the object's `name` property
must be one of the above listed values.

##### `pbkdf2Params.iterations`[#](#pbkdf2paramsiterations)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The number of iterations the PBKDF2 algorithm should make when deriving bits.

##### `pbkdf2Params.name`[#](#pbkdf2paramsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'PBKDF2'`.

##### `pbkdf2Params.salt`[#](#pbkdf2paramssalt)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

Should be at least 16 random or pseudorandom bytes.

#### Class: `RsaHashedImportParams`[#](#class-rsahashedimportparams)

Added in: v15.0.0

##### `rsaHashedImportParams.hash`[#](#rsahashedimportparamshash)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | SHA-3 algorithms are now supported. |

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)

If represented as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)

If represented as an [`<Algorithm>`](webcrypto.html#class-algorithm), the object's `name` property
must be one of the above listed values.

##### `rsaHashedImportParams.name`[#](#rsahashedimportparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, or
  `'RSA-OAEP'`.

#### Class: `RsaHashedKeyAlgorithm`[#](#class-rsahashedkeyalgorithm)

Added in: v15.0.0

##### `rsaHashedKeyAlgorithm.hash`[#](#rsahashedkeyalgorithmhash)

Added in: v15.0.0

- Type: [`<Algorithm>`](webcrypto.html#class-algorithm)

##### `rsaHashedKeyAlgorithm.modulusLength`[#](#rsahashedkeyalgorithmmoduluslength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length in bits of the RSA modulus.

##### `rsaHashedKeyAlgorithm.name`[#](#rsahashedkeyalgorithmname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type)

##### `rsaHashedKeyAlgorithm.publicExponent`[#](#rsahashedkeyalgorithmpublicexponent)

Added in: v15.0.0

- Type: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

The RSA public exponent.

#### Class: `RsaHashedKeyGenParams`[#](#class-rsahashedkeygenparams)

Added in: v15.0.0

##### `rsaHashedKeyGenParams.hash`[#](#rsahashedkeygenparamshash)

Added in: v15.0.0History

| Version | Changes |
| --- | --- |
| v24.7.0 | SHA-3 algorithms are now supported. |

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) | [`<Algorithm>`](webcrypto.html#class-algorithm)

If represented as a [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type), the value must be one of:

- `'SHA-1'`
- `'SHA-256'`
- `'SHA-384'`
- `'SHA-512'`
- `'SHA3-256'`[4](#user-content-fn-modern-algos)
- `'SHA3-384'`[4](#user-content-fn-modern-algos)
- `'SHA3-512'`[4](#user-content-fn-modern-algos)

If represented as an [`<Algorithm>`](webcrypto.html#class-algorithm), the object's `name` property
must be one of the above listed values.

##### `rsaHashedKeyGenParams.modulusLength`[#](#rsahashedkeygenparamsmoduluslength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length in bits of the RSA modulus. As a best practice, this should be
at least `2048`.

##### `rsaHashedKeyGenParams.name`[#](#rsahashedkeygenparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be one of `'RSASSA-PKCS1-v1_5'`, `'RSA-PSS'`, or
  `'RSA-OAEP'`.

##### `rsaHashedKeyGenParams.publicExponent`[#](#rsahashedkeygenparamspublicexponent)

Added in: v15.0.0

- Type: [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

The RSA public exponent. This must be a [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) containing a big-endian,
unsigned integer that must fit within 32-bits. The [`<Uint8Array>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) may contain an
arbitrary number of leading zero-bits. The value must be a prime number. Unless
there is reason to use a different value, use `new Uint8Array([1, 0, 1])`
(65537) as the public exponent.

#### Class: `RsaOaepParams`[#](#class-rsaoaepparams)

Added in: v15.0.0

##### `rsaOaepParams.label`[#](#rsaoaepparamslabel)

Added in: v15.0.0

- Type: [`<ArrayBuffer>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [`<TypedArray>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [`<DataView>`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [`<Buffer>`](buffer.html#class-buffer)

An additional collection of bytes that will not be encrypted, but will be bound
to the generated ciphertext.

The `rsaOaepParams.label` parameter is optional.

##### `rsaOaepParams.name`[#](#rsaoaepparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) must be `'RSA-OAEP'`.

#### Class: `RsaPssParams`[#](#class-rsapssparams)

Added in: v15.0.0

##### `rsaPssParams.name`[#](#rsapssparamsname)

Added in: v15.0.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'RSA-PSS'`.

##### `rsaPssParams.saltLength`[#](#rsapssparamssaltlength)

Added in: v15.0.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type)

The length (in bytes) of the random salt to use.

#### Class: `TurboShakeParams`[#](#class-turboshakeparams)

Added in: v25.9.0

##### `turboShakeParams.domainSeparation`[#](#turboshakeparamsdomainseparation)

Added in: v25.9.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) | [`<undefined>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#undefined_type)

The optional domain separation byte (0x01-0x7f). Defaults to `0x1f`.

##### `turboShakeParams.name`[#](#turboshakeparamsname)

Added in: v25.9.0

- Type: [`<string>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#string_type) Must be `'TurboSHAKE128'`[4](#user-content-fn-modern-algos) or `'TurboSHAKE256'`[4](#user-content-fn-modern-algos).

##### `turboShakeParams.outputLength`[#](#turboshakeparamsoutputlength)

Added in: v25.9.0

- Type: [`<number>`](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures#number_type) represents the requested output length in bits.

1. Requires OpenSSL >= 3.0 [↩](#user-content-fnref-openssl30) [↩2](#user-content-fnref-openssl30-2) [↩3](#user-content-fnref-openssl30-3)
2. Requires OpenSSL >= 3.2 [↩](#user-content-fnref-openssl32) [↩2](#user-content-fnref-openssl32-2) [↩3](#user-content-fnref-openssl32-3)
3. Requires OpenSSL >= 3.5 [↩](#user-content-fnref-openssl35) [↩2](#user-content-fnref-openssl35-2) [↩3](#user-content-fnref-openssl35-3) [↩4](#user-content-fnref-openssl35-4) [↩5](#user-content-fnref-openssl35-5) [↩6](#user-content-fnref-openssl35-6)
4. See [Modern Algorithms in the Web Cryptography API](#modern-algorithms-in-the-web-cryptography-api) [↩](#user-content-fnref-modern-algos) [↩2](#user-content-fnref-modern-algos-2) [↩3](#user-content-fnref-modern-algos-3) [↩4](#user-content-fnref-modern-algos-4) [↩5](#user-content-fnref-modern-algos-5) [↩6](#user-content-fnref-modern-algos-6) [↩7](#user-content-fnref-modern-algos-7) [↩8](#user-content-fnref-modern-algos-8) [↩9](#user-content-fnref-modern-algos-9) [↩10](#user-content-fnref-modern-algos-10) [↩11](#user-content-fnref-modern-algos-11) [↩12](#user-content-fnref-modern-algos-12) [↩13](#user-content-fnref-modern-algos-13) [↩14](#user-content-fnref-modern-algos-14) [↩15](#user-content-fnref-modern-algos-15) [↩16](#user-content-fnref-modern-algos-16) [↩17](#user-content-fnref-modern-algos-17) [↩18](#user-content-fnref-modern-algos-18) [↩19](#user-content-fnref-modern-algos-19) [↩20](#user-content-fnref-modern-algos-20) [↩21](#user-content-fnref-modern-algos-21) [↩22](#user-content-fnref-modern-algos-22) [↩23](#user-content-fnref-modern-algos-23) [↩24](#user-content-fnref-modern-algos-24) [↩25](#user-content-fnref-modern-algos-25) [↩26](#user-content-fnref-modern-algos-26) [↩27](#user-content-fnref-modern-algos-27) [↩28](#user-content-fnref-modern-algos-28) [↩29](#user-content-fnref-modern-algos-29) [↩30](#user-content-fnref-modern-algos-30) [↩31](#user-content-fnref-modern-algos-31) [↩32](#user-content-fnref-modern-algos-32) [↩33](#user-content-fnref-modern-algos-33) [↩34](#user-content-fnref-modern-algos-34) [↩35](#user-content-fnref-modern-algos-35) [↩36](#user-content-fnref-modern-algos-36) [↩37](#user-content-fnref-modern-algos-37) [↩38](#user-content-fnref-modern-algos-38) [↩39](#user-content-fnref-modern-algos-39) [↩40](#user-content-fnref-modern-algos-40) [↩41](#user-content-fnref-modern-algos-41) [↩42](#user-content-fnref-modern-algos-42) [↩43](#user-content-fnref-modern-algos-43) [↩44](#user-content-fnref-modern-algos-44) [↩45](#user-content-fnref-modern-algos-45) [↩46](#user-content-fnref-modern-algos-46) [↩47](#user-content-fnref-modern-algos-47) [↩48](#user-content-fnref-modern-algos-48) [↩49](#user-content-fnref-modern-algos-49) [↩50](#user-content-fnref-modern-algos-50) [↩51](#user-content-fnref-modern-algos-51) [↩52](#user-content-fnref-modern-algos-52) [↩53](#user-content-fnref-modern-algos-53) [↩54](#user-content-fnref-modern-algos-54) [↩55](#user-content-fnref-modern-algos-55) [↩56](#user-content-fnref-modern-algos-56) [↩57](#user-content-fnref-modern-algos-57) [↩58](#user-content-fnref-modern-algos-58) [↩59](#user-content-fnref-modern-algos-59) [↩60](#user-content-fnref-modern-algos-60) [↩61](#user-content-fnref-modern-algos-61) [↩62](#user-content-fnref-modern-algos-62) [↩63](#user-content-fnref-modern-algos-63) [↩64](#user-content-fnref-modern-algos-64) [↩65](#user-content-fnref-modern-algos-65) [↩66](#user-content-fnref-modern-algos-66) [↩67](#user-content-fnref-modern-algos-67) [↩68](#user-content-fnref-modern-algos-68) [↩69](#user-content-fnref-modern-algos-69) [↩70](#user-content-fnref-modern-algos-70) [↩71](#user-content-fnref-modern-algos-71) [↩72](#user-content-fnref-modern-algos-72) [↩73](#user-content-fnref-modern-algos-73) [↩74](#user-content-fnref-modern-algos-74) [↩75](#user-content-fnref-modern-algos-75) [↩76](#user-content-fnref-modern-algos-76) [↩77](#user-content-fnref-modern-algos-77) [↩78](#user-content-fnref-modern-algos-78) [↩79](#user-content-fnref-modern-algos-79) [↩80](#user-content-fnref-modern-algos-80) [↩81](#user-content-fnref-modern-algos-81) [↩82](#user-content-fnref-modern-algos-82) [↩83](#user-content-fnref-modern-algos-83) [↩84](#user-content-fnref-modern-algos-84) [↩85](#user-content-fnref-modern-algos-85) [↩86](#user-content-fnref-modern-algos-86) [↩87](#user-content-fnref-modern-algos-87) [↩88](#user-content-fnref-modern-algos-88) [↩89](#user-content-fnref-modern-algos-89) [↩90](#user-content-fnref-modern-algos-90) [↩91](#user-content-fnref-modern-algos-91) [↩92](#user-content-fnref-modern-algos-92) [↩93](#user-content-fnref-modern-algos-93) [↩94](#user-content-fnref-modern-algos-94) [↩95](#user-content-fnref-modern-algos-95) [↩96](#user-content-fnref-modern-algos-96) [↩97](#user-content-fnref-modern-algos-97) [↩98](#user-content-fnref-modern-algos-98) [↩99](#user-content-fnref-modern-algos-99) [↩100](#user-content-fnref-modern-algos-100) [↩101](#user-content-fnref-modern-algos-101) [↩102](#user-content-fnref-modern-algos-102) [↩103](#user-content-fnref-modern-algos-103) [↩104](#user-content-fnref-modern-algos-104) [↩105](#user-content-fnref-modern-algos-105) [↩106](#user-content-fnref-modern-algos-106) [↩107](#user-content-fnref-modern-algos-107) [↩108](#user-content-fnref-modern-algos-108) [↩109](#user-content-fnref-modern-algos-109) [↩110](#user-content-fnref-modern-algos-110) [↩111](#user-content-fnref-modern-algos-111) [↩112](#user-content-fnref-modern-algos-112) [↩113](#user-content-fnref-modern-algos-113) [↩114](#user-content-fnref-modern-algos-114) [↩115](#user-content-fnref-modern-algos-115) [↩116](#user-content-fnref-modern-algos-116) [↩117](#user-content-fnref-modern-algos-117) [↩118](#user-content-fnref-modern-algos-118) [↩119](#user-content-fnref-modern-algos-119) [↩120](#user-content-fnref-modern-algos-120) [↩121](#user-content-fnref-modern-algos-121) [↩122](#user-content-fnref-modern-algos-122) [↩123](#user-content-fnref-modern-algos-123) [↩124](#user-content-fnref-modern-algos-124) [↩125](#user-content-fnref-modern-algos-125) [↩126](#user-content-fnref-modern-algos-126) [↩127](#user-content-fnref-modern-algos-127) [↩128](#user-content-fnref-modern-algos-128) [↩129](#user-content-fnref-modern-algos-129) [↩130](#user-content-fnref-modern-algos-130) [↩131](#user-content-fnref-modern-algos-131) [↩132](#user-content-fnref-modern-algos-132) [↩133](#user-content-fnref-modern-algos-133) [↩134](#user-content-fnref-modern-algos-134) [↩135](#user-content-fnref-modern-algos-135) [↩136](#user-content-fnref-modern-algos-136) [↩137](#user-content-fnref-modern-algos-137) [↩138](#user-content-fnref-modern-algos-138) [↩139](#user-content-fnref-modern-algos-139) [↩140](#user-content-fnref-modern-algos-140) [↩141](#user-content-fnref-modern-algos-141) [↩142](#user-content-fnref-modern-algos-142) [↩143](#user-content-fnref-modern-algos-143) [↩144](#user-content-fnref-modern-algos-144) [↩145](#user-content-fnref-modern-algos-145) [↩146](#user-content-fnref-modern-algos-146) [↩147](#user-content-fnref-modern-algos-147) [↩148](#user-content-fnref-modern-algos-148) [↩149](#user-content-fnref-modern-algos-149) [↩150](#user-content-fnref-modern-algos-150) [↩151](#user-content-fnref-modern-algos-151) [↩152](#user-content-fnref-modern-algos-152) [↩153](#user-content-fnref-modern-algos-153) [↩154](#user-content-fnref-modern-algos-154) [↩155](#user-content-fnref-modern-algos-155) [↩156](#user-content-fnref-modern-algos-156) [↩157](#user-content-fnref-modern-algos-157) [↩158](#user-content-fnref-modern-algos-158) [↩159](#user-content-fnref-modern-algos-159) [↩160](#user-content-fnref-modern-algos-160) [↩161](#user-content-fnref-modern-algos-161) [↩162](#user-content-fnref-modern-algos-162) [↩163](#user-content-fnref-modern-algos-163) [↩164](#user-content-fnref-modern-algos-164) [↩165](#user-content-fnref-modern-algos-165) [↩166](#user-content-fnref-modern-algos-166)
5. See [Secure Curves in the Web Cryptography API](#secure-curves-in-the-web-cryptography-api) [↩](#user-content-fnref-secure-curves) [↩2](#user-content-fnref-secure-curves-2) [↩3](#user-content-fnref-secure-curves-3) [↩4](#user-content-fnref-secure-curves-4) [↩5](#user-content-fnref-secure-curves-5) [↩6](#user-content-fnref-secure-curves-6) [↩7](#user-content-fnref-secure-curves-7) [↩8](#user-content-fnref-secure-curves-8) [↩9](#user-content-fnref-secure-curves-9) [↩10](#user-content-fnref-secure-curves-10) [↩11](#user-content-fnref-secure-curves-11) [↩12](#user-content-fnref-secure-curves-12) [↩13](#user-content-fnref-secure-curves-13) [↩14](#user-content-fnref-secure-curves-14) [↩15](#user-content-fnref-secure-curves-15) [↩16](#user-content-fnref-secure-curves-16) [↩17](#user-content-fnref-secure-curves-17) [↩18](#user-content-fnref-secure-curves-18) [↩19](#user-content-fnref-secure-curves-19) [↩20](#user-content-fnref-secure-curves-20)
