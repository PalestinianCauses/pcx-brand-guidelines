# PCX brand guidelines

The PCX brand guidelines: the brand's colours, type, logo and rules, written once as values.

Other PCX projects read the brand from here. The design system package builds its parts from these values, and the live documentation shows them. A value is changed here and nowhere else.

## What it holds

The parts arrive one at a time:

| Part                      | Status  |
| ------------------------- | ------- |
| Colours and greys         | Planned |
| Fonts                     | Planned |
| Logo                      | Planned |
| Type scale                | Planned |
| Shape, lines and spacing  | Planned |
| Motion                    | Planned |
| Story, strategy and voice | Planned |

## How to run it

There is nothing to run. The repository holds values, not a page.

```bash
pnpm install
```

## How to test it

One command runs all checks:

```bash
pnpm check
```

The checks are the development kit's: format, lint, types, tests, guards and the security audit.

## How to release it

A maintainer approves every release. It is prepared as a draft on GitHub, with its notes. Once it is approved, it is published with:

```bash
pnpm release v1.2.4
```

The development kit guards a release: its version, its notes and its commit.

## The kit's files

`kit/`, `.github/`, `.coderabbit.yaml`, `.prettierrc.json`, `.npmrc`, `.nvmrc` and `.gitignore` are copies from the PCX development kit. A change to them is made in the kit first.
