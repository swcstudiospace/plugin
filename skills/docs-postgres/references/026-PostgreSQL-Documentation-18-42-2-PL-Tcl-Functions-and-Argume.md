# PostgreSQL: Documentation: 18: 42.2. PL/Tcl Functions and Arguments

Source: https://www.postgresql.org/docs/current/pltcl-functions.html

July 16, 2026: [PostgreSQL 19 Beta 2 Released!](/about/news/postgresql-19-beta-2-released-3350/)

[Documentation](/docs/ "Documentation") → [PostgreSQL 18](/docs/18/index.html)

Supported Versions:
[Current](/docs/current/pltcl-functions.html "PostgreSQL 18 - 42.2. PL/Tcl Functions and Arguments")
([18](/docs/18/pltcl-functions.html "PostgreSQL 18 - 42.2. PL/Tcl Functions and Arguments"))
/
[17](/docs/17/pltcl-functions.html "PostgreSQL 17 - 42.2. PL/Tcl Functions and Arguments")
/
[16](/docs/16/pltcl-functions.html "PostgreSQL 16 - 42.2. PL/Tcl Functions and Arguments")
/
[15](/docs/15/pltcl-functions.html "PostgreSQL 15 - 42.2. PL/Tcl Functions and Arguments")
/
[14](/docs/14/pltcl-functions.html "PostgreSQL 14 - 42.2. PL/Tcl Functions and Arguments")

Development Versions:
[19](/docs/19/pltcl-functions.html "PostgreSQL 19 - 42.2. PL/Tcl Functions and Arguments")
/
[devel](/docs/devel/pltcl-functions.html "PostgreSQL devel - 42.2. PL/Tcl Functions and Arguments")

Unsupported versions:
[13](/docs/13/pltcl-functions.html "PostgreSQL 13 - 42.2. PL/Tcl Functions and Arguments")
/
[12](/docs/12/pltcl-functions.html "PostgreSQL 12 - 42.2. PL/Tcl Functions and Arguments")
/
[11](/docs/11/pltcl-functions.html "PostgreSQL 11 - 42.2. PL/Tcl Functions and Arguments")
/
[10](/docs/10/pltcl-functions.html "PostgreSQL 10 - 42.2. PL/Tcl Functions and Arguments")
/
[9.6](/docs/9.6/pltcl-functions.html "PostgreSQL 9.6 - 42.2. PL/Tcl Functions and Arguments")
/
[9.5](/docs/9.5/pltcl-functions.html "PostgreSQL 9.5 - 42.2. PL/Tcl Functions and Arguments")
/
[9.4](/docs/9.4/pltcl-functions.html "PostgreSQL 9.4 - 42.2. PL/Tcl Functions and Arguments")
/
[9.3](/docs/9.3/pltcl-functions.html "PostgreSQL 9.3 - 42.2. PL/Tcl Functions and Arguments")
/
[9.2](/docs/9.2/pltcl-functions.html "PostgreSQL 9.2 - 42.2. PL/Tcl Functions and Arguments")
/
[9.1](/docs/9.1/pltcl-functions.html "PostgreSQL 9.1 - 42.2. PL/Tcl Functions and Arguments")
/
[9.0](/docs/9.0/pltcl-functions.html "PostgreSQL 9.0 - 42.2. PL/Tcl Functions and Arguments")
/
[8.4](/docs/8.4/pltcl-functions.html "PostgreSQL 8.4 - 42.2. PL/Tcl Functions and Arguments")
/
[8.3](/docs/8.3/pltcl-functions.html "PostgreSQL 8.3 - 42.2. PL/Tcl Functions and Arguments")
/
[8.2](/docs/8.2/pltcl-functions.html "PostgreSQL 8.2 - 42.2. PL/Tcl Functions and Arguments")
/
[8.1](/docs/8.1/pltcl-functions.html "PostgreSQL 8.1 - 42.2. PL/Tcl Functions and Arguments")
/
[8.0](/docs/8.0/pltcl-functions.html "PostgreSQL 8.0 - 42.2. PL/Tcl Functions and Arguments")
/
[7.4](/docs/7.4/pltcl-functions.html "PostgreSQL 7.4 - 42.2. PL/Tcl Functions and Arguments")

## 42.2. PL/Tcl Functions and Arguments [#](#PLTCL-FUNCTIONS)

To create a function in the PL/Tcl language, use the standard [CREATE FUNCTION](sql-createfunction.html "CREATE FUNCTION") syntax:

```
CREATE FUNCTION funcname (argument-types) RETURNS return-type AS $$
    # PL/Tcl function body
$$ LANGUAGE pltcl;
```

PL/TclU is the same, except that the language has to be specified as `pltclu`.

The body of the function is simply a piece of Tcl script. When the function is called, the argument values are passed to the Tcl script as variables named `1` ... `n`. The result is returned from the Tcl code in the usual way, with a `return` statement. In a procedure, the return value from the Tcl code is ignored.

For example, a function returning the greater of two integer values could be defined as:

```
CREATE FUNCTION tcl_max(integer, integer) RETURNS integer AS $$
    if {$1 > $2} {return $1}
    return $2
$$ LANGUAGE pltcl STRICT;
```

Note the clause `STRICT`, which saves us from having to think about null input values: if a null value is passed, the function will not be called at all, but will just return a null result automatically.

In a nonstrict function, if the actual value of an argument is null, the corresponding `$n` variable will be set to an empty string. To detect whether a particular argument is null, use the function `argisnull`. For example, suppose that we wanted `tcl_max` with one null and one nonnull argument to return the nonnull argument, rather than null:

```
CREATE FUNCTION tcl_max(integer, integer) RETURNS integer AS $$
    if {[argisnull 1]} {
        if {[argisnull 2]} { return_null }
        return $2
    }
    if {[argisnull 2]} { return $1 }
    if {$1 > $2} {return $1}
    return $2
$$ LANGUAGE pltcl;
```

As shown above, to return a null value from a PL/Tcl function, execute `return_null`. This can be done whether the function is strict or not.

Composite-type arguments are passed to the function as Tcl arrays. The element names of the array are the attribute names of the composite type. If an attribute in the passed row has the null value, it will not appear in the array. Here is an example:

```
CREATE TABLE employee (
    name text,
    salary integer,
    age integer
);

CREATE FUNCTION overpaid(employee) RETURNS boolean AS $$
    if {200000.0 < $1(salary)} {
        return "t"
    }
    if {$1(age) < 30 && 100000.0 < $1(salary)} {
        return "t"
    }
    return "f"
$$ LANGUAGE pltcl;
```

PL/Tcl functions can return composite-type results, too. To do this, the Tcl code must return a list of column name/value pairs matching the expected result type. Any column names omitted from the list are returned as nulls, and an error is raised if there are unexpected column names. Here is an example:

```
CREATE FUNCTION square_cube(in int, out squared int, out cubed int) AS $$
    return [list squared [expr {$1 * $1}] cubed [expr {$1 * $1 * $1}]]
$$ LANGUAGE pltcl;
```

Output arguments of procedures are returned in the same way, for example:

```
CREATE PROCEDURE tcl_triple(INOUT a integer, INOUT b integer) AS $$
    return [list a [expr {$1 * 3}] b [expr {$2 * 3}]]
$$ LANGUAGE pltcl;

CALL tcl_triple(5, 10);
```

### Tip

The result list can be made from an array representation of the desired tuple with the `array get` Tcl command. For example:

```
CREATE FUNCTION raise_pay(employee, delta int) RETURNS employee AS $$
    set 1(salary) [expr {$1(salary) + $2}]
    return [array get 1]
$$ LANGUAGE pltcl;
```

PL/Tcl functions can return sets. To do this, the Tcl code should call `return_next` once per row to be returned, passing either the appropriate value when returning a scalar type, or a list of column name/value pairs when returning a composite type. Here is an example returning a scalar type:

```
CREATE FUNCTION sequence(int, int) RETURNS SETOF int AS $$
    for {set i $1} {$i < $2} {incr i} {
        return_next $i
    }
$$ LANGUAGE pltcl;
```

and here is one returning a composite type:

```
CREATE FUNCTION table_of_squares(int, int) RETURNS TABLE (x int, x2 int) AS $$
    for {set i $1} {$i < $2} {incr i} {
        return_next [list x $i x2 [expr {$i * $i}]]
    }
$$ LANGUAGE pltcl;
```

## Submit correction

If you see anything in the documentation that is not correct, does not match
your experience with the particular feature or requires further clarification,
please use
[this form](/account/comments/new/18/pltcl-functions.html/)
to report a documentation issue.
