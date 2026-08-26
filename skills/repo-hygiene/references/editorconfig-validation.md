# Programmatically validating a .editorconfig

From verifying `/root/src/repos/ai-cluster/.editorconfig` (Aug 2026) with a
throwaway Python checker. Three gotchas cost two failed runs before the
checker passed — encode them up front next time.

## Gotcha 1: the preamble breaks naive configparser

The spec REQUIRES `root = true` to sit **before** any section header, but
`configparser.read_string()` rejects keys outside a section
("File contains no section headers"). Real EditorConfig parsers accept it.

Fix: split lines at the first `[`, wrap the preamble in a synthetic section:

```python
cp = configparser.ConfigParser(strict=False)
preamble, body, seen = [], [], False
for ln in text.splitlines(keepends=True):
    if ln.lstrip().startswith("["):
        seen = True
    (body if seen else preamble).append(ln)
cp.read_string("[__preamble__]\n" + "".join(preamble) + "".join(body))
assert cp["__preamble__"]["root"].lower() == "true"
```

## Gotcha 2: fnmatch does not expand braces

`[*.{tf,hcl}]` is legal EditorConfig glob syntax but `fnmatch.fnmatch`
matches the literal braces. Expand manually, recursively:

```python
def expand(glob):
    m = re.search(r"\{([^}]+)\}", glob)
    if not m:
        return [glob]
    out = []
    for alt in m.group(1).split(","):
        out.extend(expand(glob[:m.start()] + alt + glob[m.end():]))
    return out

hits = [g for g in expand(glob) if fnmatch.fnmatch(sample_path, g)]
```

## Gotcha 3: check globs behaviorally, not syntactically

A shape heuristic like "'*' or '.' must appear in every section header" false-
positives on `[Makefile]` — a bare filename IS a legal, useful EC glob.
Instead assert each section selects at least one representative path (prefer
real repo files over synthetic ones):

- `[Makefile]` → sample `Makefile`
- `[*.sh]` → an actual `find . -name '*.sh' | head -1`
- `[*.{tf,...}]` → an actual terraform/packer file in the repo

## Other checks worth running

- Encoding: valid UTF-8, no CRLF bytes (`b"\r\n" not in raw`), ends with `\n`.
- Enum values per spec: charset {utf-8, utf-8-bom, utf-16be, utf-16le},
  end_of_line {lf, crlf, cr}, indent_style {space, tab}.
- Property names: core set is root/charset/end_of_line/insert_final_newline/
  trim_trailing_whitespace/indent_style/indent_size/tab_width/max_line_length;
  editorconfig-checker extras (shell_variant, binary_next_line,
  switch_case_indent) are fine to allow.

## Honest scope statement

There is no canonical lint command for a lone `.editorconfig`; a custom
checker is ad-hoc verification, and saying so beats implying a test suite
passed. If the project has `editorconfig-checker` available, prefer running
it. Also note: real-world tooling ignores unknown properties rather than
failing on them.
