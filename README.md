# PCX brand guidelines

The PCX brand guidelines: the brand's colours, type, logo and rules, written once as values.

Other PCX projects read the brand from here. The design system package builds its parts from these values, and the live documentation shows them. A value is changed here and nowhere else.

## What it holds

The parts arrive one at a time:

| Part                      | Status    |
| ------------------------- | --------- |
| Colours and greys         | Available |
| Fonts                     | Available |
| Logo                      | Planned   |
| Type scale                | Planned   |
| Shape, lines and spacing  | Planned   |
| Motion                    | Planned   |
| Story, strategy and voice | Planned   |

## Colours

`src/colors.ts` holds the four brand colours and the greys.

| Colour | Name              | Role      | Value     | Words on the darkest grey | Words on the lightest grey |
| ------ | ----------------- | --------- | --------- | ------------------------- | -------------------------- |
| Purple | Deep Tech Purple  | Structure | `#2e1a72` | No                        | Yes                        |
| Blue   | Electric Blue     | Action    | `#1f8bff` | Yes                       | No                         |
| Pink   | Digital Pink      | Creative  | `#ff4fa3` | Yes                       | No                         |
| Yellow | Innovation Yellow | Signal    | `#ffd84d` | Yes                       | No                         |

The greys are the slate of Tailwind CSS 4, from 50 to 950, as hex values. A test compares them with Tailwind's own list. That is why `tailwindcss` is installed, for the tests only.

`src/contrast.ts` measures the contrast between two colours, with the formula of WCAG 2. A colour can carry words on a ground when the contrast is 4.5 or more. A test measures each brand colour on the darkest and on the lightest grey, so the two last columns of the table can't be wrong.

## Fonts

`src/fonts.ts` holds the two fonts.

| Font           | Kind      | Weights                                  | License                   | Free to share |
| -------------- | --------- | ---------------------------------------- | ------------------------- | ------------- |
| Gilroy         | Sans      | Ten, from Thin at 100 to Heavy at 950    | Commercial                | No            |
| JetBrains Mono | Monospace | Four, from Regular at 400 to Bold at 700 | SIL Open Font License 1.1 | Yes           |

This repository holds no font file. Gilroy is a commercial font, so its files are never in a public repository, and a test fails when any font file is added here. A project that shows the brand loads the font files from its own place.

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
