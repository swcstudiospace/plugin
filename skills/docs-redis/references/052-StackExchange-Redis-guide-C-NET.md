# StackExchange.Redis guide (C#/.NET)

Source: https://redis.io/docs/latest/develop/clients/dotnet/index.html.md

# StackExchange.Redis guide (C#/.NET)
```json metadata
{
"title": "StackExchange.Redis guide (C#/.NET)",
"description": "Connect your .NET application to a Redis database",
"categories": ["docs","develop","stack","oss","rs","rc","oss","kubernetes","clients"],
"tableOfContents": {"sections":[{"id":"install","title":"Install"},{"id":"connect-and-test","title":"Connect and test"},{"id":"more-information","title":"More information"}]}
,
"codeExamples": [{"codetabsId":"landing-stepimport","description":"Foundational: Import required SE.Redis namespaces for Redis client functionality","difficulty":"beginner","id":"import","languages":[{"id":"dotnet-Sync (SE-Redis)","panelId":"panel\_Csharp-Sync (SERedis)\_landing-stepimport"},{"id":"dotnet-Async (SE-Redis)","panelId":"panel\_Csharp-Async (SERedis)\_landing-stepimport"}]},{"codetabsId":"landing-stepconnect","description":"Foundational: Connect to a Redis server and establish a client connection","difficulty":"beginner","id":"connect","languages":[{"id":"dotnet-Sync (SE-Redis)","panelId":"panel\_Csharp-Sync (SERedis)\_landing-stepconnect"},{"id":"dotnet-Async (SE-Redis)","panelId":"panel\_Csharp-Async (SERedis)\_landing-stepconnect"}]},{"codetabsId":"landing-stepset\_get\_string","description":"Foundational: Set and retrieve string values using SET and GET commands","difficulty":"beginner","id":"set\_get\_string","languages":[{"id":"dotnet-Sync (SE-Redis)","panelId":"panel\_Csharp-Sync (SERedis)\_landing-stepset\_get\_string"},{"id":"dotnet-Async (SE-Redis)","panelId":"panel\_Csharp-Async (SERedis)\_landing-stepset\_get\_string"}]},{"codetabsId":"landing-stepset\_get\_hash","description":"Foundational: Store and retrieve hash data structures using HSET and HGETALL","difficulty":"beginner","id":"set\_get\_hash","languages":[{"id":"dotnet-Sync (SE-Redis)","panelId":"panel\_Csharp-Sync (SERedis)\_landing-stepset\_get\_hash"},{"id":"dotnet-Async (SE-Redis)","panelId":"panel\_Csharp-Async (SERedis)\_landing-stepset\_get\_hash"}]}]
}
```## Code Examples Legend
The code examples below show how to perform the same operations in different programming languages and client libraries:
- \*\*Redis CLI\*\*: Command-line interface for Redis
- \*\*C# (Synchronous)\*\*: StackExchange.Redis synchronous client
- \*\*C# (Asynchronous)\*\*: StackExchange.Redis asynchronous client
- \*\*Go\*\*: go-redis client
- \*\*Java (Synchronous - Jedis)\*\*: Jedis synchronous client
- \*\*Java (Asynchronous - Lettuce)\*\*: Lettuce asynchronous client
- \*\*Java (Reactive - Lettuce)\*\*: Lettuce reactive/streaming client
- \*\*JavaScript (Node.js)\*\*: node-redis client
- \*\*PHP\*\*: Predis client
- \*\*Python\*\*: redis-py client
- \*\*Rust (Synchronous)\*\*: redis-rs synchronous client
- \*\*Rust (Asynchronous)\*\*: redis-rs asynchronous client
Each code example demonstrates the same basic operation across different languages. The specific syntax and patterns vary based on the language and client library, but the underlying Redis commands and behavior remain consistent.
---
[StackExchange.Redis](https://github.com/StackExchange/StackExchange.Redis) is the main
.NET client for Redis. It provides an API for the core Redis data types and commands.
A separate library,
[NRedisStack](https://github.com/redis/NRedisStack), builds upon `StackExchange.Redis` with
support for an extended set of data types and features, such as [JSON](https://redis.io/docs/latest/develop/data-types/json),
[Redis search](https://redis.io/docs/latest/develop/ai/search-and-query),
[probabilistic data types](https://redis.io/docs/latest/develop/data-types/probabilistic), and
[Time series](https://redis.io/docs/latest/develop/data-types/timeseries).
The sections below explain how to install `StackExchange.Redis` and connect your application
to a Redis database. See the [NRedisStack guide](https://redis.io/docs/latest/develop/clients/dotnet/nredisstack) for information about installing and using `NRedisStack` to access the extended feature set.
`StackExchange.Redis` requires a running Redis server. For production apps,
provision a hosted Redis resource such as [Redis Cloud](https://redis.io/docs/latest/operate/rc)
or [Azure Managed Redis](https://learn.microsoft.com/en-us/azure/redis/overview).
For local development and testing, you can also run Redis Open Source locally.
See [Install Redis Open Source](https://redis.io/docs/latest/operate/oss\_and\_stack/install/)
for installation instructions.
You can also access Redis with an object-mapping client interface. See
[Redis OM for .NET](https://redis.io/docs/latest/integrate/redisom-for-net)
for more information.
## Install
Using the `dotnet` CLI, run:
```bash
dotnet add package StackExchange.Redis
```
## Connect and test
Add the following imports to your source file:
Foundational: Import required SE.Redis namespaces for Redis client functionality
\*\*Difficulty:\*\* Beginner
\*\*Available in:\*\* C, C#, C#, Go, Java, Java (Synchronous - Jedis), JavaScript (Node.js), JavaScript (Node.js), PHP, Python, Ruby, Rust (Asynchronous), Rust (Synchronous)
##### C
```c
// The following comment is required to make the example interactive.
//%cflags:-lhiredis
#include
#include
#include
int main() {
// The `redisContext` type represents the connection
// to the Redis server. Here, we connect to the
// default host and port.
redisContext \*c = redisConnect("127.0.0.1", 6379);
// Check if the context is null or if a specific
// error occurred.
if (c == NULL || c->err) {
if (c != NULL) {
printf("Error: %s\n", c->errstr);
// handle error
} else {
printf("Can't allocate redis context\n");
}
exit(1);
}
// Set a string key.
redisReply \*reply = redisCommand(c, "SET foo bar");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Get the key we have just stored.
reply = redisCommand(c, "GET foo");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Close the connection.
redisFree(c);
}
```
##### C#
```csharp
using StackExchange.Redis;
```
##### C#
```csharp
using StackExchange.Redis;
```
##### C#
```csharp
using StackExchange.Redis;
```
##### C#
```csharp
using StackExchange.Redis;
```
##### Go
```go
import (
"context"
"fmt"
"github.com/redis/go-redis/v9"
)
```
##### Java
```java
import io.lettuce.core.\*;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
```
##### Java (Synchronous - Jedis)
```java
import redis.clients.jedis.RedisClient;
import java.util.HashMap;
import java.util.Map;
```
##### JavaScript (Node.js)
```javascript
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
await client.set('key', 'value');
const value = await client.get('key');
console.log(value);
await client.hSet('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
})
let userSession = await client.hGetAll('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
await client.quit();
```
##### JavaScript (Node.js)
```javascript
import { Redis } from 'ioredis';
const redis = new Redis();
await redis.set('key', 'value');
const value = await redis.get('key');
console.log(value); // >>> value
await redis.hset('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
});
const userSession = await redis.hgetall('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
/\* >>>
{
"surname": "Smith",
"name": "John",
"company": "Redis",
"age": "29"
}
\*/
redis.disconnect();
```
##### JavaScript (Node.js)
```javascript
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
await client.set('key', 'value');
const value = await client.get('key');
console.log(value);
await client.hSet('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
})
let userSession = await client.hGetAll('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
await client.quit();
```
##### JavaScript (Node.js)
```javascript
import { Redis } from 'ioredis';
const redis = new Redis();
await redis.set('key', 'value');
const value = await redis.get('key');
console.log(value); // >>> value
await redis.hset('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
});
const userSession = await redis.hgetall('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
/\* >>>
{
"surname": "Smith",
"name": "John",
"company": "Redis",
"age": "29"
}
\*/
redis.disconnect();
```
##### PHP
```php
 'tcp',
'host' => '127.0.0.1',
'port' => 6379,
'password' => '',
'database' => 0,
]);
echo $r->set('foo', 'bar'), PHP\_EOL;
// >>> OK
echo $r->get('foo'), PHP\_EOL;
// >>> bar
$r->hset('user-session:123', 'name', 'John');
$r->hset('user-session:123', 'surname', 'Smith');
$r->hset('user-session:123', 'company', 'Redis');
$r->hset('user-session:123', 'age', 29);
echo var\_export($r->hgetall('user-session:123')), PHP\_EOL;
/\* >>>
array (
'name' => 'John',
'surname' => 'Smith',
'company' => 'Redis',
'age' => '29',
)
\*/
```
##### Python
```python
import redis
r = redis.Redis(host='localhost', port=6379, decode\_responses=True)
r.set('foo', 'bar')
# True
r.get('foo')
# bar
r.hset('user-session:123', mapping={
'name': 'John',
"surname": 'Smith',
"company": 'Redis',
"age": 29
})
# True
r.hgetall('user-session:123')
# {'surname': 'Smith', 'name': 'John', 'company': 'Redis', 'age': '29'}
r.close()
```
##### Ruby
```ruby
require 'redis'
r = Redis.new
r.set 'foo', 'bar'
value = r.get('foo')
puts value
r.hset 'user-session:123', 'name', 'John'
r.hset 'user-session:123', 'surname', 'Smith'
r.hset 'user-session:123', 'company', 'Redis'
r.hset 'user-session:123', 'age', 29
hash\_value = r.hgetall('user-session:123')
puts hash\_value
r.close()
```
##### Rust (Asynchronous)
```rust
use redis::AsyncCommands;
```
##### Rust (Synchronous)
```rust
use redis::Commands;
```
Connect to localhost on port 6379. The client supports both synchronous and asynchronous commands.
Foundational: Connect to a Redis server and establish a client connection
\*\*Difficulty:\*\* Beginner
\*\*Available in:\*\* C, C#, C#, Go, Java, Java (Synchronous - Jedis), JavaScript (Node.js), JavaScript (Node.js), PHP, Python, Ruby, Rust (Asynchronous), Rust (Synchronous)
##### C
```c
// The following comment is required to make the example interactive.
//%cflags:-lhiredis
#include
#include
#include
int main() {
// The `redisContext` type represents the connection
// to the Redis server. Here, we connect to the
// default host and port.
redisContext \*c = redisConnect("127.0.0.1", 6379);
// Check if the context is null or if a specific
// error occurred.
if (c == NULL || c->err) {
if (c != NULL) {
printf("Error: %s\n", c->errstr);
// handle error
} else {
printf("Can't allocate redis context\n");
}
exit(1);
}
// Set a string key.
redisReply \*reply = redisCommand(c, "SET foo bar");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Get the key we have just stored.
reply = redisCommand(c, "GET foo");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Close the connection.
redisFree(c);
}
```
##### C#
```csharp
var muxer = await ConnectionMultiplexer.ConnectAsync("localhost:6379");
var db = muxer.GetDatabase();
```
##### C#
```csharp
var muxer = ConnectionMultiplexer.Connect("localhost:6379");
var db = muxer.GetDatabase();
```
##### C#
```csharp
var muxer = await ConnectionMultiplexer.ConnectAsync("localhost:6379");
var db = muxer.GetDatabase();
```
##### C#
```csharp
var muxer = ConnectionMultiplexer.Connect("localhost:6379");
var db = muxer.GetDatabase();
```
##### Go
```go
rdb := redis.NewClient(&redis.Options{
Addr: "localhost:6379",
Password: "", // no password
DB: 0, // use default DB
Protocol: 2,
})
ctx := context.Background()
```
##### Java
```java
RedisURI uri = RedisURI.Builder
.redis("localhost", 6379)
.build();
RedisClient client = RedisClient.create(uri);
StatefulRedisConnection connection = client.connect();
RedisCommands commands = connection.sync();
```
##### Java (Synchronous - Jedis)
```java
RedisClient jedis = new RedisClient("redis://localhost:6379");
```
##### JavaScript (Node.js)
```javascript
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
```
##### JavaScript (Node.js)
```javascript
import { Redis } from 'ioredis';
const redis = new Redis();
```
##### JavaScript (Node.js)
```javascript
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
```
##### JavaScript (Node.js)
```javascript
import { Redis } from 'ioredis';
const redis = new Redis();
```
##### PHP
```php
 'tcp',
'host' => '127.0.0.1',
'port' => 6379,
'password' => '',
'database' => 0,
]);
```
##### Python
```python
import redis
r = redis.Redis(host='localhost', port=6379, decode\_responses=True)
```
##### Ruby
```ruby
require 'redis'
r = Redis.new
```
##### Rust (Asynchronous)
```rust
let mut r = match redis::Client::open("redis://127.0.0.1") {
Ok(client) => {
match client.get\_multiplexed\_async\_connection().await {
Ok(conn) => conn,
Err(e) => {
println!("Failed to connect to Redis: {e}");
return;
}
}
},
Err(e) => {
println!("Failed to create Redis client: {e}");
return;
}
};
```
##### Rust (Synchronous)
```rust
let mut r = match redis::Client::open("redis://127.0.0.1") {
Ok(client) => {
match client.get\_connection() {
Ok(conn) => conn,
Err(e) => {
println!("Failed to connect to Redis: {e}");
return;
}
}
},
Err(e) => {
println!("Failed to create Redis client: {e}");
return;
}
};
```
You can test the connection by storing and retrieving a simple string.
Foundational: Set and retrieve string values using SET and GET commands
\*\*Difficulty:\*\* Beginner
\*\*Available in:\*\* C, C#, C#, Go, Java, Java (Synchronous - Jedis), JavaScript (Node.js), JavaScript (Node.js), PHP, Python, Ruby, Rust (Asynchronous), Rust (Synchronous)
##### C
```c
// The following comment is required to make the example interactive.
//%cflags:-lhiredis
#include
#include
#include
int main() {
// The `redisContext` type represents the connection
// to the Redis server. Here, we connect to the
// default host and port.
redisContext \*c = redisConnect("127.0.0.1", 6379);
// Check if the context is null or if a specific
// error occurred.
if (c == NULL || c->err) {
if (c != NULL) {
printf("Error: %s\n", c->errstr);
// handle error
} else {
printf("Can't allocate redis context\n");
}
exit(1);
}
// Set a string key.
redisReply \*reply = redisCommand(c, "SET foo bar");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Get the key we have just stored.
reply = redisCommand(c, "GET foo");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Close the connection.
redisFree(c);
}
```
##### C#
```csharp
await db.StringSetAsync("foo", "bar");
string? fooResult = await db.StringGetAsync("foo");
Console.WriteLine(fooResult); // >>> bar
```
##### C#
```csharp
db.StringSet("foo", "bar");
Console.WriteLine(db.StringGet("foo")); // >>> bar
```
##### C#
```csharp
await db.StringSetAsync("foo", "bar");
string? fooResult = await db.StringGetAsync("foo");
Console.WriteLine(fooResult); // >>> bar
```
##### C#
```csharp
db.StringSet("foo", "bar");
Console.WriteLine(db.StringGet("foo")); // >>> bar
```
##### Go
```go
err := rdb.Set(ctx, "foo", "bar", 0).Err()
if err != nil {
panic(err)
}
val, err := rdb.Get(ctx, "foo").Result()
if err != nil {
panic(err)
}
fmt.Println("foo", val) // >>> foo bar
```
##### Java
```java
commands.set("foo", "bar");
String result = commands.get("foo");
System.out.println(result); // >>> bar
```
##### Java (Synchronous - Jedis)
```java
String res1 = jedis.set("bike:1", "Deimos");
System.out.println(res1); // >>> OK
String res2 = jedis.get("bike:1");
System.out.println(res2); // >>> Deimos
```
##### JavaScript (Node.js)
```javascript
await client.set('key', 'value');
const value = await client.get('key');
console.log(value);
```
##### JavaScript (Node.js)
```javascript
await redis.set('key', 'value');
const value = await redis.get('key');
console.log(value); // >>> value
```
##### JavaScript (Node.js)
```javascript
await client.set('key', 'value');
const value = await client.get('key');
console.log(value);
```
##### JavaScript (Node.js)
```javascript
await redis.set('key', 'value');
const value = await redis.get('key');
console.log(value); // >>> value
```
##### PHP
```php
echo $r->set('foo', 'bar'), PHP\_EOL;
// >>> OK
echo $r->get('foo'), PHP\_EOL;
// >>> bar
```
##### Python
```python
r.set('foo', 'bar')
# True
r.get('foo')
# bar
```
##### Ruby
```ruby
r.set 'foo', 'bar'
value = r.get('foo')
puts value
```
##### Rust (Asynchronous)
```rust
if let Ok(res) = r.set("foo", "bar").await {
let res: String = res;
println!("{res}"); // >>> OK
} else {
println!("Error setting foo");
}
match r.get("foo").await {
Ok(res) => {
let res: String = res;
println!("{res}"); // >>> bar
},
Err(e) => {
println!("Error getting foo: {e}");
return;
}
};
```
##### Rust (Synchronous)
```rust
if let Ok(res) = r.set("foo", "bar") {
let res: String = res;
println!("{res}"); // >>> OK
} else {
println!("Error setting foo");
}
match r.get("foo") {
Ok(res) => {
let res: String = res;
println!("{res}"); // >>> bar
},
Err(e) => {
println!("Error getting foo: {e}");
return;
}
};
```
Store and retrieve a HashMap.
Foundational: Store and retrieve hash data structures using HSET and HGETALL
\*\*Difficulty:\*\* Beginner
\*\*Available in:\*\* C, C#, C#, Go, Java, Java (Synchronous - Jedis), JavaScript (Node.js), JavaScript (Node.js), PHP, Python, Ruby, Rust (Asynchronous), Rust (Synchronous)
##### C
```c
// The following comment is required to make the example interactive.
//%cflags:-lhiredis
#include
#include
#include
int main() {
// The `redisContext` type represents the connection
// to the Redis server. Here, we connect to the
// default host and port.
redisContext \*c = redisConnect("127.0.0.1", 6379);
// Check if the context is null or if a specific
// error occurred.
if (c == NULL || c->err) {
if (c != NULL) {
printf("Error: %s\n", c->errstr);
// handle error
} else {
printf("Can't allocate redis context\n");
}
exit(1);
}
// Set a string key.
redisReply \*reply = redisCommand(c, "SET foo bar");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Get the key we have just stored.
reply = redisCommand(c, "GET foo");
printf("Reply: %s\n", reply->str);
freeReplyObject(reply);
// Close the connection.
redisFree(c);
}
```
##### C#
```csharp
var hash = new HashEntry[] {
new HashEntry("name", "John"),
new HashEntry("surname", "Smith"),
new HashEntry("company", "Redis"),
new HashEntry("age", "29"),
};
await db.HashSetAsync("user-session:123", hash);
var hashFields = await db.HashGetAllAsync("user-session:123");
Console.WriteLine(String.Join("; ", hashFields));
// >>> name: John; surname: Smith; company: Redis; age: 29
```
##### C#
```csharp
var hash = new HashEntry[] {
new HashEntry("name", "John"),
new HashEntry("surname", "Smith"),
new HashEntry("company", "Redis"),
new HashEntry("age", "29"),
};
db.HashSet("user-session:123", hash);
var hashFields = db.HashGetAll("user-session:123");
Console.WriteLine(String.Join("; ", hashFields));
// >>> name: John; surname: Smith; company: Redis; age: 29
```
##### C#
```csharp
var hash = new HashEntry[] {
new HashEntry("name", "John"),
new HashEntry("surname", "Smith"),
new HashEntry("company", "Redis"),
new HashEntry("age", "29"),
};
await db.HashSetAsync("user-session:123", hash);
var hashFields = await db.HashGetAllAsync("user-session:123");
Console.WriteLine(String.Join("; ", hashFields));
// >>> name: John; surname: Smith; company: Redis; age: 29
```
##### C#
```csharp
var hash = new HashEntry[] {
new HashEntry("name", "John"),
new HashEntry("surname", "Smith"),
new HashEntry("company", "Redis"),
new HashEntry("age", "29"),
};
db.HashSet("user-session:123", hash);
var hashFields = db.HashGetAll("user-session:123");
Console.WriteLine(String.Join("; ", hashFields));
// >>> name: John; surname: Smith; company: Redis; age: 29
```
##### Go
```go
hashFields := []string{
"model", "Deimos",
"brand", "Ergonom",
"type", "Enduro bikes",
"price", "4972",
}
res1, err := rdb.HSet(ctx, "bike:1", hashFields).Result()
if err != nil {
panic(err)
}
fmt.Println(res1) // >>> 4
res2, err := rdb.HGet(ctx, "bike:1", "model").Result()
if err != nil {
panic(err)
}
fmt.Println(res2) // >>> Deimos
res3, err := rdb.HGet(ctx, "bike:1", "price").Result()
if err != nil {
panic(err)
}
fmt.Println(res3) // >>> 4972
res4, err := rdb.HGetAll(ctx, "bike:1").Result()
if err != nil {
panic(err)
}
fmt.Println(res4)
// >>> map[brand:Ergonom model:Deimos price:4972 type:Enduro bikes]
```
##### Java
```java
import io.lettuce.core.\*;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
public class ConnectBasicTest {
public void connectBasic() {
RedisURI uri = RedisURI.Builder
.redis("localhost", 6379)
.build();
RedisClient client = RedisClient.create(uri);
StatefulRedisConnection connection = client.connect();
RedisCommands commands = connection.sync();
commands.set("foo", "bar");
String result = commands.get("foo");
System.out.println(result); // >>> bar
connection.close();
client.shutdown();
}
}
```
##### Java (Synchronous - Jedis)
```java
Map hash = new HashMap<>();
hash.put("name", "John");
hash.put("surname", "Smith");
hash.put("company", "Redis");
hash.put("age", "29");
Long res3 = jedis.hset("user-session:123", hash);
System.out.println(res3); // >>> 4
Map res4 = jedis.hgetAll("user-session:123");
System.out.println(res4);
// >>> {name=John, surname=Smith, company=Redis, age=29}
```
##### JavaScript (Node.js)
```javascript
await client.hSet('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
})
let userSession = await client.hGetAll('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
```
##### JavaScript (Node.js)
```javascript
await redis.hset('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
});
const userSession = await redis.hgetall('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
/\* >>>
{
"surname": "Smith",
"name": "John",
"company": "Redis",
"age": "29"
}
\*/
```
##### JavaScript (Node.js)
```javascript
await client.hSet('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
})
let userSession = await client.hGetAll('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
```
##### JavaScript (Node.js)
```javascript
await redis.hset('user-session:123', {
name: 'John',
surname: 'Smith',
company: 'Redis',
age: 29
});
const userSession = await redis.hgetall('user-session:123');
console.log(JSON.stringify(userSession, null, 2));
/\* >>>
{
"surname": "Smith",
"name": "John",
"company": "Redis",
"age": "29"
}
\*/
```
##### PHP
```php
$r->hset('user-session:123', 'name', 'John');
$r->hset('user-session:123', 'surname', 'Smith');
$r->hset('user-session:123', 'company', 'Redis');
$r->hset('user-session:123', 'age', 29);
echo var\_export($r->hgetall('user-session:123')), PHP\_EOL;
/\* >>>
array (
'name' => 'John',
'surname' => 'Smith',
'company' => 'Redis',
'age' => '29',
)
\*/
```
##### Python
```python
import redis
r = redis.Redis(host='localhost', port=6379, decode\_responses=True)
r.set('foo', 'bar')
# True
r.get('foo')
# bar
r.hset('user-session:123', mapping={
'name': 'John',
"surname": 'Smith',
"company": 'Redis',
"age": 29
})
# True
r.hgetall('user-session:123')
# {'surname': 'Smith', 'name': 'John', 'company': 'Redis', 'age': '29'}
r.close()
```
##### Ruby
```ruby
require 'redis'
r = Redis.new
r.set 'foo', 'bar'
value = r.get('foo')
puts value
r.hset 'user-session:123', 'name', 'John'
r.hset 'user-session:123', 'surname', 'Smith'
r.hset 'user-session:123', 'company', 'Redis'
r.hset 'user-session:123', 'age', 29
hash\_value = r.hgetall('user-session:123')
puts hash\_value
r.close()
```
##### Rust (Asynchronous)
```rust
let hash\_fields = [
("model", "Deimos"),
("brand", "Ergonom"),
("type", "Enduro bikes"),
("price", "4972"),
];
if let Ok(res) = r.hset\_multiple("bike:1", &hash\_fields).await {
let res: String = res;
println!("{res}"); // >>> OK
} else {
println!("Error setting bike:1");
}
match r.hget("bike:1", "model").await {
Ok(res) => {
let res: String = res;
println!("{res}"); // >>> Deimos
},
Err(e) => {
println!("Error getting bike:1 model: {e}");
return;
}
}
match r.hget("bike:1", "price").await {
Ok(res) => {
let res: String = res;
println!("{res}"); // >>> 4972
},
Err(e) => {
println!("Error getting bike:1 price: {e}");
return;
}
}
match r.hgetall("bike:1").await {
Ok(res) => {
let res: Vec<(String, String)> = res;
for (key, value) in res {
println!("{key}: {value}");
}
// >>> model: Deimos
// >>> brand: Ergonom
// >>> type: Enduro bikes
// >>> price: 4972
},
Err(e) => {
println!("Error getting bike:1: {e}");
return;
}
```
##### Rust (Synchronous)
```rust
let hash\_fields = [
("model", "Deimos"),
("brand", "Ergonom"),
("type", "Enduro bikes"),
("price", "4972"),
];
if let Ok(res) = r.hset\_multiple("bike:1", &hash\_fields) {
let res: String = res;
println!("{res}"); // >>> OK
} else {
println!("Error setting bike:1");
}
match r.hget("bike:1", "model") {
Ok(res) => {
let res: String = res;
println!("{res}"); // >>> Deimos
},
Err(e) => {
println!("Error getting bike:1 model: {e}");
return;
}
}
match r.hget("bike:1", "price") {
Ok(res) => {
let res: String = res;
println!("{res}"); // >>> 4972
},
Err(e) => {
println!("Error getting bike:1 price: {e}");
return;
}
}
match r.hgetall("bike:1") {
Ok(res) => {
let res: Vec<(String, String)> = res;
for (key, value) in res {
println!("{key}: {value}");
}
// >>> model: Deimos
// >>> brand: Ergonom
// >>> type: Enduro bikes
// >>> price: 4972
},
Err(e) => {
println!("Error getting bike:1: {e}");
return;
}
}
```
## More information
See the other pages in this section for more information and examples.
