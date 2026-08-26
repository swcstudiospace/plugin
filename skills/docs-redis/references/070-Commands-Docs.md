# Commands | Docs

Source: https://redis.io/docs/latest/commands

# Commands

Filter by group…
Array
Bloom filter
Bitmap
Cuckoo filter
Cluster management
Count-min sketch
Connection management
Generic
Geospatial indices
Hash
HyperLogLog
JSON
List
Pub/Sub
Scripting and functions
Redis Search
Server management
Set
Sorted set
Stream
String
Auto-suggest
T-digest
Time series
Top-k
Transactions
Vector set

by version

(all)
7.0
6.2
6.0
5.0
4.0
3.2
3.0
2.9
2.8
2.6
2.4
2.2
2.0
1.2
1.0
1.0
1.0
2.0
2.4
2.2
2.0
1.0
2.0
1.0
2.2
2.0
1.4
1.2
1.1
1.0
1.0
2.4
1.6
1.4
1.0
2.0

# Redis 8.8 Commands Reference

Complete list of all Redis commands available in version 8.8, organized by functional group

Learn more →

# Redis 8.6 Commands Reference

Complete list of all Redis commands available in version 8.6, organized by functional group

Learn more →

# Redis 8.4 Commands Reference

Complete list of all Redis commands available in version 8.4, organized by functional group

Learn more →

# Redis 8.2 Commands Reference

Complete list of all Redis commands available in version 8.2, organized by functional group

Learn more →

# Redis 8.0 Commands Reference

Complete list of all Redis commands available in version 8.0, organized by functional group

Learn more →

# Redis 7.4 Commands Reference

Complete list of all Redis commands available in version 7.4, organized by functional group

Learn more →

# Redis 7.2 Commands Reference

Complete list of all Redis commands available in version 7.2, organized by functional group

Learn more →

# Redis 6.2 Commands Reference

Complete list of all Redis commands available in version 6.2, organized by functional group

Learn more →

# ACL CAT

Lists the ACL categories, or the commands inside a category.

Learn more →

# ACL DELUSER

Deletes ACL users, and terminates their connections.

Learn more →

# ACL DRYRUN

Simulates the execution of a command by a user, without executing the command.

Learn more →

# ACL GENPASS

Generates a pseudorandom, secure password that can be used to identify ACL users.

Learn more →

# ACL GETUSER

Lists the ACL rules of a user.

Learn more →

# ACL LIST

Dumps the effective rules in ACL file format.

Learn more →

# ACL LOAD

Reloads the rules from the configured ACL file.

Learn more →

# ACL LOG

Lists recent security events generated due to ACL rules.

Learn more →

# ACL SAVE

Saves the effective ACL rules in the configured ACL file.

Learn more →

# ACL SETUSER

Creates and modifies an ACL user and its rules.

Learn more →

# ACL USERS

Lists all ACL users.

Learn more →

# ACL WHOAMI

Returns the authenticated username of the current connection.

Learn more →

# APPEND

Appends a string to the value of a key. Creates the key if it doesn't exist.

Learn more →

# ARCOUNT

Returns the number of non-empty elements in an array.

Learn more →

# ARDEL

Deletes elements at the specified indices in an array.

Learn more →

# ARDELRANGE

Deletes elements in one or more ranges.

Learn more →

# ARGET

Gets the value at an index in an array.

Learn more →

# ARGETRANGE

Gets values in a range of indices.

Learn more →

# ARGREP

Searches array elements in a range using textual predicates.

Learn more →

# ARINFO

Returns metadata about an array.

Learn more →

# ARINSERT

Inserts one or more values at consecutive indices.

Learn more →

# ARLASTITEMS

Returns the most recently inserted elements.

Learn more →

# ARLEN

Returns the length of an array (max index + 1).

Learn more →

# ARMGET

Gets values at multiple indices in an array.

Learn more →

# ARMSET

Sets multiple index-value pairs in an array.

Learn more →

# ARNEXT

Returns the next index ARINSERT would use.

Learn more →

# AROP

Performs aggregate operations on array elements in a range.

Learn more →

# ARRING

Inserts values into a ring buffer of specified size, wrapping and truncating as needed.

Learn more →

# ARSCAN

Iterates existing elements in a range, returning index-value pairs.

Learn more →

# ARSEEK

Sets the ARINSERT / ARRING cursor to a specific index.

Learn more →

# ARSET

Sets one or more contiguous values starting at an index in an array.

Learn more →

# ASKING

Signals that a cluster client is following an -ASK redirect.

Learn more →

# AUTH

Authenticates the connection.

Learn more →

# BF.ADD

Adds an item to a Bloom Filter

Learn more →

# BF.CARD

Returns the cardinality of a Bloom filter

Learn more →

# BF.EXISTS

Checks whether an item exists in a Bloom Filter

Learn more →

# BF.INFO

Returns information about a Bloom Filter

Learn more →

# BF.INSERT

Adds one or more items to a Bloom Filter. A filter will be created if it does not exist

Learn more →

# BF.LOADCHUNK

Restores a filter previously saved using SCANDUMP

Learn more →

# BF.MADD

Adds one or more items to a Bloom Filter. A filter will be created if it does not exist

Learn more →

# BF.MEXISTS

Checks whether one or more items exist in a Bloom Filter

Learn more →

# BF.RESERVE

Creates a new Bloom Filter

Learn more →

# BF.SCANDUMP

Begins an incremental save of the bloom filter

Learn more →

# BGREWRITEAOF

Asynchronously rewrites the append-only file to disk.

Learn more →

# BGSAVE

Asynchronously saves the database(s) to disk.

Learn more →

# BITCOUNT

Counts the number of set bits (population counting) in a string.

Learn more →

# BITFIELD

Performs arbitrary bitfield integer operations on strings.

Learn more →

# BITFIELD\_RO

Performs arbitrary read-only bitfield integer operations on strings.

Learn more →

# BITOP

Performs bitwise operations on multiple strings, and stores the result.

Learn more →

# BITPOS

Finds the first set (1) or clear (0) bit in a string.

Learn more →

# BLMOVE

Pops an element from a list, pushes it to another list and returns it. Blocks until an element is available otherwise. Deletes the list if the last element was moved.

Learn more →

# BLMPOP

Pops the first element from one of multiple lists. Blocks until an element is available otherwise. Deletes the list if the last element was popped.

Learn more →

# BLPOP

Removes and returns the first element in a list. Blocks until an element is available otherwise. Deletes the list if the last element was popped.

Learn more →

# BRPOP

Removes and returns the last element in a list. Blocks until an element is available otherwise. Deletes the list if the last element was popped.

Learn more →

# BRPOPLPUSH Deprecated Use BLMOVE with the RIGHT and LEFT arguments instead

Pops an element from a list, pushes it to another list and returns it. Block until an element is available otherwise. Deletes the list if the last element was popped.

Learn more →

# BZMPOP

Removes and returns a member by score from one or more sorted sets. Blocks until a member is available otherwise. Deletes the sorted set if the last element was popped.

Learn more →

# BZPOPMAX

Removes and returns the member with the highest score from one or more sorted sets. Blocks until a member available otherwise. Deletes the sorted set if the last element was popped.

Learn more →

# BZPOPMIN

Removes and returns the member with the lowest score from one or more sorted sets. Blocks until a member is available otherwise. Deletes the sorted set if the last element was popped.

Learn more →

# CF.ADD

Adds an item to a Cuckoo Filter

Learn more →

# CF.ADDNX

Adds an item to a Cuckoo Filter if the item did not exist previously.

Learn more →

# CF.COUNT

Return the number of times an item might be in a Cuckoo Filter

Learn more →

# CF.DEL

Deletes an item from a Cuckoo Filter

Learn more →

# CF.EXISTS

Checks whether one or more items exist in a Cuckoo Filter

Learn more →

# CF.INFO

Returns information about a Cuckoo Filter

Learn more →

# CF.INSERT

Adds one or more items to a Cuckoo Filter. A filter will be created if it does not exist

Learn more →

# CF.INSERTNX

Adds one or more items to a Cuckoo Filter if the items did not exist previously. A filter will be created if it does not exist

Learn more →

# CF.LOADCHUNK

Restores a filter previously saved using SCANDUMP

Learn more →

# CF.MEXISTS

Checks whether one or more items exist in a Cuckoo Filter

Learn more →

# CF.RESERVE

Creates a new Cuckoo Filter

Learn more →

# CF.SCANDUMP

Begins an incremental save of the bloom filter

Learn more →

# CLIENT CACHING

Instructs the server whether to track the keys in the next request.

Learn more →

# CLIENT GETNAME

Returns the name of the connection.

Learn more →

# CLIENT GETREDIR

Returns the client ID to which the connection's tracking notifications are redirected.

Learn more →

# CLIENT ID

Returns the unique client ID of the connection.

Learn more →

# CLIENT INFO

Returns information about the connection.

Learn more →

# CLIENT KILL

Terminates open connections.

Learn more →

# CLIENT LIST

Lists open connections.

Learn more →

# CLIENT NO-EVICT

Sets the client eviction mode of the connection.

Learn more →

# CLIENT NO-TOUCH

Controls whether commands sent by the client affect the LRU/LFU of accessed keys.

Learn more →

# CLIENT PAUSE

Suspends commands processing.

Learn more →

# CLIENT REPLY

Instructs the server whether to reply to commands.

Learn more →

# CLIENT SETINFO

Sets information specific to the client or connection.

Learn more →

# CLIENT SETNAME

Sets the connection name.

Learn more →

# CLIENT TRACKING

Controls server-assisted client-side caching for the connection.

Learn more →

# CLIENT TRACKINGINFO

Returns information about server-assisted client-side caching for the connection.

Learn more →

# CLIENT UNBLOCK

Unblocks a client blocked by a blocking command from a different connection.

Learn more →

# CLIENT UNPAUSE

Resumes processing commands from paused clients.

Learn more →

# CLUSTER ADDSLOTS

Assigns new hash slots to a node.

Learn more →

# CLUSTER ADDSLOTSRANGE

Assigns new hash slot ranges to a node.

Learn more →

# CLUSTER BUMPEPOCH

Advances the cluster config epoch.

Learn more →

# CLUSTER COUNT-FAILURE-REPORTS

Returns the number of active failure reports active for a node.

Learn more →

# CLUSTER COUNTKEYSINSLOT

Returns the number of keys in a hash slot.

Learn more →

# CLUSTER DELSLOTS

Sets hash slots as unbound for a node.

Learn more →

# CLUSTER DELSLOTSRANGE

Sets hash slot ranges as unbound for a node.

Learn more →

# CLUSTER FAILOVER

Forces a replica to perform a manual failover of its master.

Learn more →

# CLUSTER FLUSHSLOTS

Deletes all slots information from a node.

Learn more →

# CLUSTER FORGET

Removes a node from the nodes table.

Learn more →

# CLUSTER GETKEYSINSLOT

Returns the key names in a hash slot.

Learn more →

# CLUSTER INFO

Returns information about the state of a node.

Learn more →

# CLUSTER KEYSLOT

Returns the hash slot for a key.

Learn more →

# CLUSTER LINKS

Returns a list of all TCP links to and from peer nodes.

Learn more →

# CLUSTER MEET

Forces a node to handshake with another node.

Learn more →

# CLUSTER MIGRATION

Start, monitor, and cancel atomic slot migration tasks.

Learn more →

# CLUSTER MYID

Returns the ID of a node.

Learn more →

# CLUSTER MYSHARDID

Returns the shard ID of a node.

Learn more →

# CLUSTER NODES

Returns the cluster configuration for a node.

Learn more →

# CLUSTER REPLICAS

Lists the replica nodes of a master node.

Learn more →

# CLUSTER REPLICATE

Configure a node as replica of a master node.

Learn more →

# CLUSTER RESET

Resets a node.

Learn more →

# CLUSTER SAVECONFIG

Forces a node to save the cluster configuration to disk.

Learn more →

# CLUSTER SET-CONFIG-EPOCH

Sets the configuration epoch for a new node.

Learn more →

# CLUSTER SETSLOT

Binds a hash slot to a node.

Learn more →

# CLUSTER SHARDS

Returns the mapping of cluster slots to shards.

Learn more →

# CLUSTER SLAVES Deprecated Use CLUSTER REPLICAS instead

Lists the replica nodes of a master node.

Learn more →

# CLUSTER SLOT-STATS

Return an array of slot usage statistics for slots assigned to the current node.

Learn more →

# CLUSTER SLOTS Deprecated Use CLUSTER SHARDS instead

Returns the mapping of cluster slots to nodes.

Learn more →

# CMS.INCRBY

Increases the count of one or more items by increment

Learn more →

# CMS.INFO

Returns information about a sketch

Learn more →

# CMS.INITBYDIM

Initializes a Count-Min Sketch to dimensions specified by user

Learn more →

# CMS.INITBYPROB

Initializes a Count-Min Sketch to accommodate requested tolerances.

Learn more →

# CMS.MERGE

Merges several sketches into one sketch

Learn more →

# CMS.QUERY

Returns the count for one or more items in a sketch

Learn more →

# COMMAND

Returns detailed information about all commands.

Learn more →

# COMMAND COUNT

Returns a count of commands.

Learn more →

# COMMAND DOCS

Returns documentary information about one, multiple or all commands.

Learn more →

# COMMAND GETKEYS

Extracts the key names from an arbitrary command.

Learn more →

# COMMAND GETKEYSANDFLAGS

Extracts the key names and access flags for an arbitrary command.

Learn more →

# COMMAND INFO

Returns information about one, multiple or all commands.

Learn more →

# COMMAND LIST

Returns a list of command names.

Learn more →

# Commands

Learn more →

# CONFIG GET

Returns the effective values of configuration parameters.

Learn more →

# CONFIG RESETSTAT

Resets the server's statistics.

Learn more →

# CONFIG REWRITE

Persists the effective configuration to file.

Learn more →

# CONFIG SET

Sets configuration parameters in-flight.

Learn more →

# COPY

Copies the value of a key to a new key.

Learn more →

# DBSIZE

Returns the number of keys in the database.

Learn more →

# DECR

Decrements the integer value of a key by one. Uses 0 as initial value if the key doesn't exist.

Learn more →

# DECRBY

Decrements a number from the integer value of a key. Uses 0 as initial value if the key doesn't exist.

Learn more →

# DEL

Deletes one or more keys.

Learn more →

# DELEX

Conditionally removes the specified key based on value or hash digest comparison.

Learn more →

# DIGEST

Returns the hash digest of a string value as a hexadecimal string.

Learn more →

# DISCARD

Discards a transaction.

Learn more →

# DUMP

Returns a serialized representation of the value stored at a key.

Learn more →

# ECHO

Returns the given string.

Learn more →

# EVAL

Executes a server-side Lua script.

Learn more →

# EVAL\_RO

Executes a read-only server-side Lua script.

Learn more →

# EVALSHA

Executes a server-side Lua script by SHA1 digest.

Learn more →

# EVALSHA\_RO

Executes a read-only server-side Lua script by SHA1 digest.

Learn more →

# EXEC

Executes all commands in a transaction.

Learn more →

# EXISTS

Determines whether one or more keys exist.

Learn more →

# EXPIRE

Sets the expiration time of a key in seconds.

Learn more →

# EXPIREAT

Sets the expiration time of a key to a Unix timestamp.

Learn more →

# EXPIRETIME

Returns the expiration time of a key as a Unix timestamp.

Learn more →

# FAILOVER

Starts a coordinated failover from a server to one of its replicas.

Learn more →

# FCALL

Invokes a function.

Learn more →

# FCALL\_RO

Invokes a read-only function.

Learn more →

# FLUSHALL

Removes all keys from all databases.

Learn more →

# FLUSHDB

Remove all keys from the current database.

Learn more →

# FT.\_LIST

Returns a list of all existing indexes

Learn more →

# FT.AGGREGATE

Run a search query on an index and perform aggregate transformations on the results

Learn more →

# FT.ALIASADD

Adds an alias to the index

Learn more →

# FT.ALIASDEL

Deletes an alias from the index

Learn more →

# FT.ALIASUPDATE

Adds or updates an alias to the index

Learn more →

# FT.ALTER

Adds a new field to the index

Learn more →

# FT.CONFIG GET Deprecated Use CONFIG GET instead

Retrieves runtime configuration options

Learn more →

# FT.CONFIG SET Deprecated Use CONFIG SET instead

Sets runtime configuration options

Learn more →

# FT.CREATE

Creates an index with the given spec

Learn more →

# FT.CURSOR DEL

Deletes a cursor

Learn more →

# FT.CURSOR READ

Reads from a cursor

Learn more →

# FT.DICTADD

Adds terms to a dictionary

Learn more →

# FT.DICTDEL

Deletes terms from a dictionary

Learn more →

# FT.DICTDUMP

Dumps all terms in the given dictionary

Learn more →

# FT.DROPINDEX

Deletes the index

Learn more →

# FT.EXPLAIN

Returns the execution plan for a complex query

Learn more →

# FT.EXPLAINCLI

Returns the execution plan for a complex query

Learn more →

# FT.HYBRID

Performs hybrid search combining text search and vector similarity search

Learn more →

# FT.INFO

Returns information and statistics on the index

Learn more →

# FT.PROFILE

Performs a `FT.SEARCH`, `FT.HYBRID`, or `FT.AGGREGATE` command and collects performance information

Learn more →

# FT.SEARCH

Searches the index with a textual query, returning either documents or just ids

Learn more →

# FT.SPELLCHECK

Performs spelling correction on a query, returning suggestions for misspelled terms

Learn more →

# FT.SUGADD

Adds a suggestion string to an auto-complete suggestion dictionary

Learn more →

# FT.SUGDEL

Deletes a string from a suggestion index

Learn more →

# FT.SUGGET

Gets completion suggestions for a prefix

Learn more →

# FT.SUGLEN

Gets the size of an auto-complete suggestion dictionary

Learn more →

# FT.SYNDUMP

Dumps the contents of a synonym group

Learn more →

# FT.SYNUPDATE

Creates or updates a synonym group with additional terms

Learn more →

# FT.TAGVALS Deprecated

Returns the distinct tags indexed in a Tag field

Learn more →

# FUNCTION DELETE

Deletes a library and its functions.

Learn more →

# FUNCTION DUMP

Dumps all libraries into a serialized binary payload.

Learn more →

# FUNCTION FLUSH

Deletes all libraries and functions.

Learn more →

# FUNCTION KILL

Terminates a function during execution.

Learn more →

# FUNCTION LIST

Returns information about all libraries.

Learn more →

# FUNCTION LOAD

Creates a library.

Learn more →

# FUNCTION RESTORE

Restores all libraries from a payload.

Learn more →

# FUNCTION STATS

Returns information about a function during execution.

Learn more →

# GEOADD

Adds one or more members to a geospatial index. The key is created if it doesn't exist.

Learn more →

# GEODIST

Returns the distance between two members of a geospatial index.

Learn more →

# GEOHASH

Returns members from a geospatial index as geohash strings.

Learn more →

# GEOPOS

Returns the longitude and latitude of members from a geospatial index.

Learn more →

# GEORADIUS Deprecated Use GEOSEARCH and GEOSEARCHSTORE with the BYRADIUS argument instead

Queries a geospatial index for members within a distance from a coordinate, optionally stores the result.

Learn more →

# GEORADIUS\_RO Deprecated Use GEOSEARCH with the BYRADIUS argument instead

Returns members from a geospatial index that are within a distance from a coordinate.

Learn more →

# GEORADIUSBYMEMBER Deprecated Use GEOSEARCH and GEOSEARCHSTORE with the BYRADIUS and FROMMEMBER arguments instead

Queries a geospatial index for members within a distance from a member, optionally stores the result.

Learn more →

# GEORADIUSBYMEMBER\_RO Deprecated Use GEOSEARCH with the BYRADIUS and FROMMEMBER arguments instead

Returns members from a geospatial index that are within a distance from a member.

Learn more →

# GEOSEARCH

Queries a geospatial index for members inside an area of a box or a circle.

Learn more →

# GEOSEARCHSTORE

Queries a geospatial index for members inside an area of a box or a circle, optionally stores the result.

Learn more →

# GET

Returns the string value of a key.

Learn more →

# GETBIT

Returns a bit value by offset.

Learn more →

# GETDEL

Returns the string value of a key after deleting the key.

Learn more →

# GETEX

Returns the string value of a key after setting its expiration time.

Learn more →

# GETRANGE

Returns a substring of the string stored at a key.

Learn more →

# GETSET Deprecated Use SET with the GET argument instead

Returns the previous string value of a key after setting it to a new value.

Learn more →

# HDEL

Deletes one or more fields and their values from a hash. Deletes the hash if no fields remain.

Learn more →

# HELLO

Handshakes with the Redis server.

Learn more →

# HEXISTS

Determines whether a field exists in a hash.

Learn more →

# HEXPIRE

Set expiry for hash field using relative time to expire (seconds)

Learn more →

# HEXPIREAT

Set expiry for hash field using an absolute Unix timestamp (seconds)

Learn more →

# HEXPIRETIME

Returns the expiration time of a hash field as a Unix timestamp, in seconds.

Learn more →

# HGET

Returns the value of a field in a hash.

Learn more →

# HGETALL

Returns all fields and values in a hash.

Learn more →

# HGETDEL

Returns the value of a field and deletes it from the hash.

Learn more →

# HGETEX

Get the value of one or more fields of a given hash key, and optionally set their expiration.

Learn more →

# HINCRBY

Increments the integer value of a field in a hash by a number. Uses 0 as initial value if the field doesn't exist.

Learn more →

# HINCRBYFLOAT

Increments the floating point value of a field by a number. Uses 0 as initial value if the field doesn't exist.

Learn more →

# HKEYS

Returns all fields in a hash.

Learn more →

# HLEN

Returns the number of fields in a hash.

Learn more →

# HMGET

Returns the values of all fields in a hash.

Learn more →

# HMSET Deprecated Use HSET with multiple field-value pairs instead

Sets the values of multiple fields.

Learn more →

# HOTKEYS

A container for hotkeys tracking commands.

Learn more →

# HOTKEYS GET

Returns lists of top K hotkeys depending on metrics chosen in HOTKEYS START command.

Learn more →

# HOTKEYS RESET

Release the resources used for hotkey tracking.

Learn more →

# HOTKEYS START

Starts hotkeys tracking.

Learn more →

# HOTKEYS STOP

Stops hotkeys tracking.

Learn more →

# HPERSIST

Removes the expiration time for each specified field

Learn more →

# HPEXPIRE

Set expiry for hash field using relative time to expire (milliseconds)

Learn more →

# HPEXPIREAT

Set expiry for hash field using an absolute Unix timestamp (milliseconds)

Learn more →

# HPEXPIRETIME

Returns the expiration time of a hash field as a Unix timestamp, in msec.

Learn more →

# HPTTL

Returns the TTL in milliseconds of a hash field.

Learn more →

# HRANDFIELD

Returns one or more random fields from a hash.

Learn more →

# HSCAN

Iterates over fields and values of a hash.

Learn more →

# HSET

Creates or modifies the value of a field in a hash.

Learn more →

# HSETEX

Set the value of one or more fields of a given hash key, and optionally set their expiration.

Learn more →

# HSETNX

Sets the value of a field in a hash only when the field doesn't exist.

Learn more →

# HSTRLEN

Returns the length of the value of a field.

Learn more →

# HTTL

Returns the TTL in seconds of a hash field.

Learn more →

# HVALS

Returns all values in a hash.

Learn more →

# INCR

Increments the integer value of a key by one. Uses 0 as initial value if the key doesn't exist.

Learn more →

# INCRBY

Increments the integer value of a key by a number. Uses 0 as initial value if the key doesn't exist.

Learn more →

# INCRBYFLOAT

Increment the floating point value of a key by a number. Uses 0 as initial value if the key doesn't exist.

Learn more →

# INCREX

Increments the numeric value of a key by a number and sets its expiration time. Uses 0 as initial value if the key doesn't exist.

Learn more →

# INFO

Returns information and statistics about the server.

Learn more →

# JSON.ARRAPPEND

Append one or more json values into the array at path after the last element in it.

Learn more →

# JSON.ARRINDEX

Returns the index of the first occurrence of a JSON scalar value in the array at path

Learn more →

# JSON.ARRINSERT

Inserts the JSON scalar(s) value at the specified index in the array at path

Learn more →

# JSON.ARRLEN

Returns the length of the array at path

Learn more →

# JSON.ARRPOP

Removes and returns the element at the specified index in the array at path

Learn more →

# JSON.ARRTRIM

Trims the array at path to contain only the specified inclusive range of indices from start to stop

Learn more →

# JSON.CLEAR

Clears all values from an array or an object and sets numeric values to `0`

Learn more →

# JSON.DEBUG

Debugging container command

Learn more →

# JSON.DEBUG MEMORY

Reports the size in bytes of a key

Learn more →

# JSON.DEL

Deletes a value

Learn more →

# JSON.FORGET

Deletes a value

Learn more →

# JSON.GET

Gets the value at one or more paths in JSON serialized form

Learn more →

# JSON.MERGE

Merges a given JSON value into matching paths. Consequently, JSON values at matching paths are updated, deleted, or expanded with new children

Learn more →

# JSON.MGET

Returns the values at a path from one or more keys

Learn more →

# JSON.MSET

Sets or updates the JSON value of one or more keys

Learn more →

# JSON.NUMINCRBY

Increments the numeric value at path by a value

Learn more →

# JSON.NUMMULTBY

Multiplies the numeric value at path by a value

Learn more →

# JSON.OBJKEYS

Returns the key names of JSON objects at the paths matching a given path expression

Learn more →

# JSON.OBJLEN

Returns the number of keys in JSON objects at the paths matching a given path expression

Learn more →

# JSON.RESP

Returns the JSON value at path in Redis Serialization Protocol (RESP)

Learn more →

# JSON.SET

Sets or updates the JSON value at a path

Learn more →

# JSON.STRAPPEND

Appends a string to JSON strings at the paths matching a given path expression

Learn more →

# JSON.STRLEN

Returns the length of JSON strings at the paths matching a given path expression

Learn more →

# JSON.TOGGLE

Toggles a boolean value

Learn more →

# JSON.TYPE

Returns the type of the JSON value at path

Learn more →

# KEYS

Returns all key names that match a pattern.

Learn more →

# LASTSAVE

Returns the Unix timestamp of the last successful save to disk.

Learn more →

# LATENCY DOCTOR

Returns a human-readable latency analysis report.

Learn more →

# LATENCY GRAPH

Returns a latency graph for an event.

Learn more →

# LATENCY HISTOGRAM

Returns the cumulative distribution of latencies of a subset or all commands.

Learn more →

# LATENCY HISTORY

Returns timestamp-latency samples for an event.

Learn more →

# LATENCY LATEST

Returns the latest latency samples for all events.

Learn more →

# LATENCY RESET

Resets the latency data for one or more events.

Learn more →

# LCS

Finds the longest common substring.

Learn more →

# LINDEX

Returns an element from a list by its index.

Learn more →

# LINSERT

Inserts an element before or after another element in a list.

Learn more →

# LLEN

Returns the length of a list.

Learn more →

# LMOVE

Returns an element after popping it from one list and pushing it to another. Deletes the list if the last element was moved.

Learn more →

# LMPOP

Returns multiple elements from a list after removing them. Deletes the list if the last element was popped.

Learn more →

# LOLWUT

Displays computer art and the Redis version

Learn more →

# LPOP

Returns the first elements in a list after removing it. Deletes the list if the last element was popped.

Learn more →

# LPOS

Returns the index of matching elements in a list.

Learn more →

# LPUSH

Prepends one or more elements to a list. Creates the key if it doesn't exist.

Learn more →

# LPUSHX

Prepends one or more elements to a list only when the list exists.

Learn more →

# LRANGE

Returns a range of elements from a list.

Learn more →

# LREM

Removes elements from a list. Deletes the list if the last element was removed.

Learn more →

# LSET

Sets the value of an element in a list by its index.

Learn more →

# LTRIM

Removes elements from both ends a list. Deletes the list if all elements were trimmed.

Learn more →

# MEMORY DOCTOR

Outputs a memory problems report.

Learn more →

# MEMORY MALLOC-STATS

Returns the allocator statistics.

Learn more →

# MEMORY PURGE

Asks the allocator to release memory.

Learn more →

# MEMORY STATS

Returns details about memory usage.

Learn more →

# MEMORY USAGE

Estimates the memory usage of a key.

Learn more →

# MGET

Atomically returns the string values of one or more keys.

Learn more →

# MIGRATE

Atomically transfers a key from one Redis instance to another.

Learn more →

# MODULE LIST

Returns all loaded modules.

Learn more →

# MODULE LOAD

Loads a module.

Learn more →

# MODULE LOADEX

Loads a module using extended parameters.

Learn more →

# MODULE UNLOAD

Unloads a module.

Learn more →

# MONITOR

Listens for all requests received by the server in real-time.

Learn more →

# MOVE

Moves a key to another database.

Learn more →

# MSET

Atomically creates or modifies the string values of one or more keys.

Learn more →

# MSETEX

Atomically sets multiple string keys with a shared expiration in a single operation.

Learn more →

# MSETNX

Atomically modifies the string values of one or more keys only when all keys don't exist.

Learn more →

# MULTI

Starts a transaction.

Learn more →

# OBJECT ENCODING

Returns the internal encoding of a Redis object.

Learn more →

# OBJECT FREQ

Returns the logarithmic access frequency counter of a Redis object.

Learn more →

# OBJECT IDLETIME

Returns the time since the last access to a Redis object.

Learn more →

# OBJECT REFCOUNT

Returns the reference count of a value of a key.

Learn more →

# PERSIST

Removes the expiration time of a key.

Learn more →

# PEXPIRE

Sets the expiration time of a key in milliseconds.

Learn more →

# PEXPIREAT

Sets the expiration time of a key to a Unix milliseconds timestamp.

Learn more →

# PEXPIRETIME

Returns the expiration time of a key as a Unix milliseconds timestamp.

Learn more →

# PFADD

Adds elements to a HyperLogLog key. Creates the key if it doesn't exist.

Learn more →

# PFCOUNT

Returns the approximated cardinality of the set(s) observed by the HyperLogLog key(s).

Learn more →

# PFDEBUG

Internal commands for debugging HyperLogLog values.

Learn more →

# PFMERGE

Merges one or more HyperLogLog values into a single key.

Learn more →

# PFSELFTEST

An internal command for testing HyperLogLog values.

Learn more →

# PING

Returns the server's liveliness response.

Learn more →

# PSETEX Deprecated Use SET with the PX argument instead

Sets both string value and expiration time in milliseconds of a key. The key is created if it doesn't exist.

Learn more →

# PSUBSCRIBE

Listens for messages published to channels that match one or more patterns.

Learn more →

# PSYNC

An internal command used in replication.

Learn more →

# PTTL

Returns the expiration time in milliseconds of a key.

Learn more →

# PUBLISH

Posts a message to a channel.

Learn more →

# PUBSUB CHANNELS

Returns the active channels.

Learn more →

# PUBSUB NUMPAT

Returns a count of unique pattern subscriptions.

Learn more →

# PUBSUB NUMSUB

Returns a count of subscribers to channels.

Learn more →

# PUBSUB SHARDCHANNELS

Returns the active shard channels.

Learn more →

# PUBSUB SHARDNUMSUB

Returns the count of subscribers of shard channels.

Learn more →

# PUNSUBSCRIBE

Stops listening to messages published to channels that match one or more patterns.

Learn more →

# QUIT Deprecated Use just closing the connection instead

Closes the connection.

Learn more →

# RANDOMKEY

Returns a random key name from the database.

Learn more →

# READONLY

Enables read-only queries for a connection to a Redis Cluster replica node.

Learn more →

# READWRITE

Enables read-write queries for a connection to a Reids Cluster replica node.

Learn more →

# RENAME

Renames a key and overwrites the destination.

Learn more →

# RENAMENX

Renames a key only when the target key name doesn't exist.

Learn more →

# REPLCONF

An internal command for configuring the replication stream.

Learn more →

# REPLICAOF

Configures a server as replica of another, or promotes it to a master.

Learn more →

# RESET

Resets the connection.

Learn more →

# RESTORE

Creates a key from the serialized representation of a value.

Learn more →

# RESTORE-ASKING

An internal command for migrating keys in a cluster.

Learn more →

# ROLE

Returns the replication role.

Learn more →

# RPOP

Returns and removes the last elements of a list. Deletes the list if the last element was popped.

Learn more →

# RPOPLPUSH Deprecated Use LMOVE with the RIGHT and LEFT arguments instead

Returns the last element of a list after removing and pushing it to another list. Deletes the list if the last element was popped.

Learn more →

# RPUSH

Appends one or more elements to a list. Creates the key if it doesn't exist.

Learn more →

# RPUSHX

Appends an element to a list only when the list exists.

Learn more →

# SADD

Adds one or more members to a set. Creates the key if it doesn't exist.

Learn more →

# SAVE

Synchronously saves the database(s) to disk.

Learn more →

# SCAN

Iterates over the key names in the database.

Learn more →

# SCARD

Returns the number of members in a set.

Learn more →

# SCRIPT DEBUG

Sets the debug mode of server-side Lua scripts.

Learn more →

# SCRIPT EXISTS

Determines whether server-side Lua scripts exist in the script cache.

Learn more →

# SCRIPT FLUSH

Removes all server-side Lua scripts from the script cache.

Learn more →

# SCRIPT KILL

Terminates a server-side Lua script during execution.

Learn more →

# SCRIPT LOAD

Loads a server-side Lua script to the script cache.

Learn more →

# SDIFF

Returns the difference of multiple sets.

Learn more →

# SDIFFSTORE

Stores the difference of multiple sets in a key.

Learn more →

# SELECT

Changes the selected database.

Learn more →

# SET

Sets the string value of a key, ignoring its type. The key is created if it doesn't exist.

Learn more →

# SETBIT

Sets or clears the bit at offset of the string value. Creates the key if it doesn't exist.

Learn more →

# SETEX Deprecated Use SET with the EX argument instead

Sets the string value and expiration time of a key. Creates the key if it doesn't exist.

Learn more →

# SETNX Deprecated Use SET with the NX argument instead

Set the string value of a key only when the key doesn't exist.

Learn more →

# SETRANGE

Overwrites a part of a string value with another by an offset. Creates the key if it doesn't exist.

Learn more →

# SHUTDOWN

Synchronously saves the database(s) to disk and shuts down the Redis server.

Learn more →

# SINTER

Returns the intersect of multiple sets.

Learn more →

# SINTERCARD

Returns the number of members of the intersect of multiple sets.

Learn more →

# SINTERSTORE

Stores the intersect of multiple sets in a key.

Learn more →

# SISMEMBER

Determines whether a member belongs to a set.

Learn more →

# SLAVEOF Deprecated Use REPLICAOF instead

Sets a Redis server as a replica of another, or promotes it to being a master.

Learn more →

# SLOWLOG GET

Returns the slow log's entries.

Learn more →

# SLOWLOG LEN

Returns the number of entries in the slow log.

Learn more →

# SLOWLOG RESET

Clears all entries from the slow log.

Learn more →

# SMEMBERS

Returns all members of a set.

Learn more →

# SMISMEMBER

Determines whether multiple members belong to a set.

Learn more →

# SMOVE

Moves a member from one set to another.

Learn more →

# SORT

Sorts the elements in a list, a set, or a sorted set, optionally storing the result.

Learn more →

# SORT\_RO

Returns the sorted elements of a list, a set, or a sorted set.

Learn more →

# SPOP

Returns one or more random members from a set after removing them. Deletes the set if the last member was popped.

Learn more →

# SPUBLISH

Post a message to a shard channel

Learn more →

# SRANDMEMBER

Get one or multiple random members from a set

Learn more →

# SREM

Removes one or more members from a set. Deletes the set if the last member was removed.

Learn more →

# SSCAN

Iterates over members of a set.

Learn more →

# SSUBSCRIBE

Listens for messages published to shard channels.

Learn more →

# STRLEN

Returns the length of a string value.

Learn more →

# SUBSCRIBE

Listens for messages published to channels.

Learn more →

# SUBSTR Deprecated Use GETRANGE instead

Returns a substring from a string value.

Learn more →

# SUNION

Returns the union of multiple sets.

Learn more →

# SUNIONSTORE

Stores the union of multiple sets in a key.

Learn more →

# SUNSUBSCRIBE

Stops listening to messages posted to shard channels.

Learn more →

# SWAPDB

Swaps two Redis databases.

Learn more →

# SYNC

An internal command used in replication.

Learn more →

# TDIGEST.ADD

Adds one or more observations to a t-digest sketch

Learn more →

# TDIGEST.BYRANK

Returns, for each input rank, an estimation of the value (floating-point) with that rank

Learn more →

# TDIGEST.BYREVRANK

Returns, for each input reverse rank, an estimation of the value (floating-point) with that reverse rank

Learn more →

# TDIGEST.CDF

Returns, for each input value, an estimation of the fraction (floating-point) of (observations smaller than the given value + half the observations equal to the given value)

Learn more →

# TDIGEST.CREATE

Allocates memory and initializes a new t-digest sketch

Learn more →

# TDIGEST.INFO

Returns information and statistics about a t-digest sketch

Learn more →

# TDIGEST.MAX

Returns the maximum observation value from a t-digest sketch

Learn more →

# TDIGEST.MERGE

Merges multiple t-digest sketches into a single sketch

Learn more →

# TDIGEST.MIN

Returns the minimum observation value from a t-digest sketch

Learn more →

# TDIGEST.QUANTILE

Returns, for each input fraction, an estimation of the value (floating point) that is smaller than the given fraction of observations

Learn more →

# TDIGEST.RANK

Returns, for each input value (floating-point), the estimated rank of the value (the number of observations in the sketch that are smaller than the value + half the number of observations that are equal to the value)

Learn more →

# TDIGEST.RESET

Resets a t-digest sketch: empty the sketch and re-initializes it.

Learn more →

# TDIGEST.REVRANK

Returns, for each input value (floating-point), the estimated reverse rank of the value (the number of observations in the sketch that are larger than the value + half the number of observations that are equal to the value)

Learn more →

# TDIGEST.TRIMMED\_MEAN

Returns an estimation of the mean value from the sketch, excluding observation values outside the low and high cutoff quantiles

Learn more →

# TIME

Returns the server time.

Learn more →

# TOPK.ADD

Adds an item to a Top-k sketch. Multiple items can be added at the same time.

Learn more →

# TOPK.COUNT

Return the count for one or more items are in a sketch

Learn more →

# TOPK.INCRBY

Increases the count of one or more items by increment

Learn more →

# TOPK.INFO

Returns information about a sketch

Learn more →

# TOPK.LIST

Return full list of items in Top K list

Learn more →

# TOPK.QUERY

Checks whether one or more items are in a sketch

Learn more →

# TOPK.RESERVE

Initializes a TopK with specified parameters

Learn more →

# TOUCH

Returns the number of existing keys out of those specified after updating the time they were last accessed.

Learn more →

# TS.ADD

Append a sample to a time series

Learn more →

# TS.ALTER

Update the retention, chunk size, duplicate policy, and labels of an existing time series

Learn more →

# TS.CREATE

Create a new time series

Learn more →

# TS.CREATERULE

Create a compaction rule

Learn more →

# TS.DECRBY

Decrease the value of the sample with the maximum existing timestamp, or create a new sample with a value equal to the value of the sample with the maximum existing timestamp with a given decrement

Learn more →

# TS.DEL

Delete all samples between two timestamps for a given time series

Learn more →

# TS.DELETERULE

Delete a compaction rule

Learn more →

# TS.GET

Get the sample with the highest timestamp from a given time series

Learn more →

# TS.INCRBY

Increase the value of the sample with the maximum existing timestamp, or create a new sample with a value equal to the value of the sample with the maximum existing timestamp with a given increment

Learn more →

# TS.INFO

Returns information and statistics for a time series

Learn more →

# TS.MADD

Append new samples to one or more time series

Learn more →

# TS.MGET

Get the sample with the highest timestamp from each time series matching a specific filter

Learn more →

# TS.MRANGE

Query a range across multiple time series by filters in forward direction

Learn more →

# TS.MREVRANGE

Query a range across multiple time-series by filters in reverse direction

Learn more →

# TS.QUERYINDEX

Get all time series keys matching a filter list

Learn more →

# TS.RANGE

Query a range in forward direction

Learn more →

# TS.REVRANGE

Query a range in reverse direction

Learn more →

# TTL

Returns the expiration time in seconds of a key.

Learn more →

# TYPE

Determines the type of value stored at a key.

Learn more →

# UNLINK

Asynchronously deletes one or more keys.

Learn more →

# UNSUBSCRIBE

Stops listening to messages posted to channels.

Learn more →

# UNWATCH

Forgets about watched keys of a transaction.

Learn more →

# VADD

Add a new element to a vector set, or update its vector if it already exists.

Learn more →

# VCARD

Return the number of elements in a vector set.

Learn more →

# VDIM

Return the dimension of vectors in the vector set.

Learn more →

# VEMB

Return the vector associated with an element.

Learn more →

# VGETATTR

Retrieve the JSON attributes of elements.

Learn more →

# VINFO

Return information about a vector set.

Learn more →

# VISMEMBER

Check if an element exists in a vector set.

Learn more →

# VLINKS

Return the neighbors of an element at each layer in the HNSW graph.

Learn more →

# VRANDMEMBER

Return one or multiple random members from a vector set.

Learn more →

# VRANGE

Return elements in a lexicographical range

Learn more →

# VREM

Remove an element from a vector set.

Learn more →

# VSETATTR

Associate or remove the JSON attributes of elements.

Learn more →

# VSIM

Return elements by vector similarity.

Learn more →

# WAIT

Blocks until the asynchronous replication of all preceding write commands sent by the connection is completed.

Learn more →

# WAITAOF

Blocks until all of the preceding write commands sent by the connection are written to the append-only file of the master and/or replicas.

Learn more →

# WATCH

Monitors changes to keys to determine the execution of a transaction.

Learn more →

# XACK

Returns the number of messages that were successfully acknowledged by the consumer group member of a stream.

Learn more →

# XACKDEL

Acknowledges and conditionally deletes one or multiple entries for a stream consumer group.

Learn more →

# XADD

Appends a new message to a stream. Creates the key if it doesn't exist.

Learn more →

# XAUTOCLAIM

Changes, or acquires, ownership of messages in a consumer group, as if the messages were delivered to as consumer group member.

Learn more →

# XCFGSET

Sets the IDMP configuration parameters for a stream.

Learn more →

# XCLAIM

Changes, or acquires, ownership of a message in a consumer group, as if the message was delivered a consumer group member.

Learn more →

# XDEL

Returns the number of messages after removing them from a stream.

Learn more →

# XDELEX

Deletes one or multiple entries from the stream.

Learn more →

# XGROUP CREATE

Creates a consumer group.

Learn more →

# XGROUP CREATECONSUMER

Creates a consumer in a consumer group.

Learn more →

# XGROUP DELCONSUMER

Deletes a consumer from a consumer group.

Learn more →

# XGROUP DESTROY

Destroys a consumer group.

Learn more →

# XGROUP SETID

Sets the last-delivered ID of a consumer group.

Learn more →

# XIDMPRECORD

An internal command for setting IDMP metadata on an existing stream message.

Learn more →

# XINFO CONSUMERS

Returns a list of the consumers in a consumer group.

Learn more →

# XINFO GROUPS

Returns a list of the consumer groups of a stream.

Learn more →

# XINFO STREAM

Returns information about a stream.

Learn more →

# XLEN

Return the number of messages in a stream.

Learn more →

# XNACK

Releases pending messages back to the group's PEL without acknowledging them, making them available for re-delivery.

Learn more →

# XPENDING

Returns the information and entries from a stream consumer group's pending entries list.

Learn more →

# XRANGE

Returns the messages from a stream within a range of IDs.

Learn more →

# XREAD

Returns messages from multiple streams with IDs greater than the ones requested. Blocks until a message is available otherwise.

Learn more →

# XREADGROUP

Returns new or historical messages from a stream for a consumer in a group. Blocks until a message is available otherwise.

Learn more →

# XREVRANGE

Returns the messages from a stream within a range of IDs in reverse order.

Learn more →

# XSETID

An internal command for replicating stream values.

Learn more →

# XTRIM

Deletes messages from the beginning of a stream.

Learn more →

# ZADD

Adds one or more members to a sorted set, or updates their scores. Creates the key if it doesn't exist.

Learn more →

# ZCARD

Returns the number of members in a sorted set.

Learn more →

# ZCOUNT

Returns the count of members in a sorted set that have scores within a range.

Learn more →

# ZDIFF

Returns the difference between multiple sorted sets.

Learn more →

# ZDIFFSTORE

Stores the difference of multiple sorted sets in a key.

Learn more →

# ZINCRBY

Increments the score of a member in a sorted set.

Learn more →

# ZINTER

Returns the intersect of multiple sorted sets.

Learn more →

# ZINTERCARD

Returns the number of members of the intersect of multiple sorted sets.

Learn more →

# ZINTERSTORE

Stores the intersect of multiple sorted sets in a key.

Learn more →

# ZLEXCOUNT

Returns the number of members in a sorted set within a lexicographical range.

Learn more →

# ZMPOP

Returns the highest- or lowest-scoring members from one or more sorted sets after removing them. Deletes the sorted set if the last member was popped.

Learn more →

# ZMSCORE

Returns the score of one or more members in a sorted set.

Learn more →

# ZPOPMAX

Returns the highest-scoring members from a sorted set after removing them. Deletes the sorted set if the last member was popped.

Learn more →

# ZPOPMIN

Returns the lowest-scoring members from a sorted set after removing them. Deletes the sorted set if the last member was popped.

Learn more →

# ZRANDMEMBER

Returns one or more random members from a sorted set.

Learn more →

# ZRANGE

Returns members in a sorted set within a range of indexes.

Learn more →

# ZRANGEBYLEX Deprecated Use ZRANGE with the BYLEX argument instead

Returns members in a sorted set within a lexicographical range.

Learn more →

# ZRANGEBYSCORE Deprecated Use ZRANGE with the BYSCORE argument instead

Returns members in a sorted set within a range of scores.

Learn more →

# ZRANGESTORE

Stores a range of members from sorted set in a key.

Learn more →

# ZRANK

Returns the index of a member in a sorted set ordered by ascending scores.

Learn more →

# ZREM

Removes one or more members from a sorted set. Deletes the sorted set if all members were removed.

Learn more →

# ZREMRANGEBYLEX

Removes members in a sorted set within a lexicographical range. Deletes the sorted set if all members were removed.

Learn more →

# ZREMRANGEBYRANK

Removes members in a sorted set within a range of indexes. Deletes the sorted set if all members were removed.

Learn more →

# ZREMRANGEBYSCORE

Removes members in a sorted set within a range of scores. Deletes the sorted set if all members were removed.

Learn more →

# ZREVRANGE Deprecated Use ZRANGE with the REV argument instead

Returns members in a sorted set within a range of indexes in reverse order.

Learn more →

# ZREVRANGEBYLEX Deprecated Use ZRANGE with the REV and BYLEX arguments instead

Returns members in a sorted set within a lexicographical range in reverse order.

Learn more →

# ZREVRANGEBYSCORE Deprecated Use ZRANGE with the REV and BYSCORE arguments instead

Returns members in a sorted set within a range of scores in reverse order.

Learn more →

# ZREVRANK

Returns the index of a member in a sorted set ordered by descending scores.

Learn more →

# ZSCAN

Iterates over members and scores of a sorted set.

Learn more →

# ZSCORE

Returns the score of a member in a sorted set.

Learn more →

# ZUNION

Returns the union of multiple sorted sets.

Learn more →

# ZUNIONSTORE

Stores the union of multiple sorted sets in a key.

Learn more →

#

A

B

C

D

E

F

G

H

I

J

K

L

M

O

P

Q

R

S

T

U

V

W

X

Z
