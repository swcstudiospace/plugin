# node-redis guide (JavaScript)

Source: https://redis.io/docs/latest/develop/clients/nodejs/index.html.md

# node-redis guide (JavaScript)
```json metadata
{
"title": "node-redis guide (JavaScript)",
"description": "Connect your Node.js/JavaScript application to a Redis database",
"categories": ["docs","develop","stack","oss","rs","rc","oss","kubernetes","clients"],
"tableOfContents": {"sections":[{"id":"install","title":"Install"},{"id":"connect-and-test","title":"Connect and test"},{"id":"more-information","title":"More information"}]}
,
"codeExamples": []
}
```
[`node-redis`](https://github.com/redis/node-redis) is the Redis client for Node.js/JavaScript.
The sections below explain how to install `node-redis` and connect your application
to a Redis database.
node-redis is the recommended client library for Node.js/JavaScript,
but we also support and document our older JavaScript client
[`ioredis`](https://redis.io/docs/latest/develop/clients/ioredis). See
[Migrate from ioredis](https://redis.io/docs/latest/develop/clients/nodejs/migration)
if you are interested in converting an existing `ioredis` project to `node-redis`.
`node-redis` requires a running Redis server. See [here](https://redis.io/docs/latest/operate/oss\_and\_stack/install/) for Redis Open Source installation instructions.
You can also access Redis with an object-mapping client interface. See
[RedisOM for Node.js](https://redis.io/docs/latest/integrate/redisom-for-node-js)
for more information.
## Install
To install node-redis, run:
```bash
npm install redis
```
## Connect and test
Connect to localhost on port 6379.
Store and retrieve a simple string.
Store and retrieve a map.
To connect to a different host or port, use a connection string in the format `redis[s]://[[username][:password]@][host][:port][/db-number]`:
```js
createClient({
url: 'redis://alice:foobared@awesome.redis.server:6380'
});
```
To check if the client is connected and ready to send commands, use `client.isReady`, which returns a Boolean. `client.isOpen` is also available. This returns `true` when the client's underlying socket is open, and `false` when it isn't (for example, when the client is still connecting or reconnecting after a network error).
When you have finished using a connection, close it with `client.quit()`.
## More information
The [`node-redis` website](https://redis.js.org/) has more examples.
The [Github repository](https://github.com/redis/node-redis) also has useful
information, including a guide to the
[connection configuration options](https://github.com/redis/node-redis/blob/master/docs/client-configuration.md) you can use.
See also the other pages in this section for more information and examples:
