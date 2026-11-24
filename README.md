# PCX brand guidelines

The PCX brand guidelines: the brand's colours, type, logo and rules, written once as values.

Other PCX projects read the brand from here. The design system package builds its parts from these values, and the live documentation shows them. A value is changed here and nowhere else.

## What it holds

The parts arrive one at a time:

| Part                      | Status    |
| ------------------------- | --------- |
| Colours and greys         | Available |
| Fonts                     | Available |
| Logo                      | Available |
| Type scale                | Available |
| Shape, lines and spacing  | Available |
| Motion                    | Available |
| Story, strategy and voice | Available |

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

A contrast is shown to a person with `getContrastShown`: with one digit after the point, rounded down to the nearest one that ends in an even digit or in 5. So 9.34 is shown as 9.2, and 14.56 as 14.5. It is rounded down and never up, so a shown contrast is never more than the measured one. Both limits, 4.5 and 3.0, lie on that grid, so a shown contrast reaches a limit exactly when the measured one does.

## Fonts

`src/fonts.ts` holds the two fonts.

| Font           | Kind      | Weights                                  | License                   | Free to share |
| -------------- | --------- | ---------------------------------------- | ------------------------- | ------------- |
| Gilroy         | Sans      | Ten, from Thin at 100 to Heavy at 950    | Commercial                | No            |
| JetBrains Mono | Monospace | Four, from Regular at 400 to Bold at 700 | SIL Open Font License 1.1 | Yes           |

This repository holds no font file. Gilroy is a commercial font, so its files are never in a public repository, and a test fails when any font file is added here. A project that shows the brand loads the font files from its own place.

## Logo

The logo is one mark, with no wordmark and no second version. `assets/logo/pcx-mark.svg` is its file, and `src/logo.ts` holds the same drawing as a path, with the mark's rules. A test compares the two.

| Rule         | Value                                                                 |
| ------------ | --------------------------------------------------------------------- |
| Grid         | 2290 by 1106 units                                                    |
| Colour       | White, or the darkest grey                                            |
| Clear space  | A quarter of the mark's height, on every side                         |
| Least height | 16 pixels on a screen, 5 millimetres in print                         |
| Under that   | PCX is written in Gilroy, and the mark is left out                    |
| Misuse       | Eight rules, such as never stretching, rotating or outlining the mark |

Not here yet: what may stand beside the mark, the mark beside words, the mark beside a partner's logo, and the mark as a lit object. They are planned for a later version.

## Type scale

`src/type.ts` holds the type scale: eight steps, from the one big line of a page down to code. The three large headings and the label are shown in capitals. Their words are still written in sentence case. A sub-heading and all other text are shown as they are written.

| Step        | Used for                   | Font           | Weight        | Shown in   | Phone | Laptop | Line height | Letter spacing |
| ----------- | -------------------------- | -------------- | ------------- | ---------- | ----- | ------ | ----------- | -------------- |
| Display     | The one big line of a page | Gilroy         | Heavy 950     | Capitals   | 54    | 98     | 92 percent  | -0.032 em      |
| Title       | Page titles                | Gilroy         | Heavy 950     | Capitals   | 46    | 88     | 94 percent  | -0.032 em      |
| Heading     | Section headings           | Gilroy         | Heavy 950     | Capitals   | 38    | 80     | 96 percent  | -0.032 em      |
| Sub-heading | Block and card titles      | Gilroy         | ExtraBold 800 | As written | 24    | 24     | 120 percent | -0.02 em       |
| Body        | Reading text               | Gilroy         | Medium 500    | As written | 16    | 18     | 160 percent | None           |
| Note        | Small supporting text      | Gilroy         | Medium 500    | As written | 15    | 15     | 150 percent | None           |
| Label       | Labels and buttons         | JetBrains Mono | Medium 500    | Capitals   | 12    | 12     | 16 pixels   | 0.14 em        |
| Code        | Code and figures           | JetBrains Mono | Regular 400   | As written | 14    | 14     | 20 pixels   | None           |

Sizes are in pixels. The phone is a screen 375 pixels wide, and the laptop is one 1440 pixels wide. Between the two a size grows evenly with the screen, and `getSize` gives the size for any width. No text is smaller than 12 pixels. A line of reading text is at least one and a half times its size, and a test holds that.

Since v1.1.0 the scale follows the PCX website. Before, the headings were smaller, lighter and shown as written.

Since v1.1.1 a sub-heading is shown as written again, in weight 800. At its size, the heaviest weight in capitals is hard to read.

Not here: scales for slides, documents and print, and the rules for paragraphs.

## Shape, lines and spacing

`src/shape.ts` holds the shape: square corners, thin lines and spaces in steps of 4 pixels.

| Part                                    | Value                                                         |
| --------------------------------------- | ------------------------------------------------------------- |
| Corners                                 | Square, on buttons, fields, cards and tags                    |
| Thin line                               | 1 pixel, around blocks and between rows                       |
| Thick line                              | 2 pixels, for emphasis                                        |
| Height of a button or a field           | 44 pixels, on every screen                                    |
| Focus ring                              | The brand's blue, 2 pixels thick, 2 pixels away from the part |
| Room inside a card                      | 24 pixels                                                     |
| Room between two cards                  | 16 pixels                                                     |
| Room between a heading and what follows | 28 pixels                                                     |
| Room above a section                    | 48 pixels on a phone, 96 pixels on a laptop                   |
| Room below a section                    | 56 pixels on a phone, 96 pixels on a laptop                   |

Every space and every height is a multiple of 4 pixels, and a test proves it. A button or a field is 44 pixels high, the height a finger needs. Another test measures the focus ring on the darkest and on the lightest grey: a part that is not words needs a contrast of 3 or more.

Between a phone and a laptop, the room around a section grows evenly with the screen, as a size does. `getScaled` gives a value for any width.

Since v1.1.0 the room follows the PCX website too. The names `sectionPhone` and `sectionLaptop` are still there, and they hold the room above a section. They are marked as deprecated, and they leave with the next major version.

Not here: shadows and layers, breakpoints, and the colours of lines.

## Motion

`src/motion.ts` holds the motion: quick and plain. Things move a short way and settle at once.

| Part                                                  | Value                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| Small moves: the pointer over a button, a press       | 100 milliseconds                                           |
| Medium moves: a tab that switches, a panel that opens | 200 milliseconds                                           |
| Large moves: the entrance of a part                   | 400 milliseconds                                           |
| Start and stop                                        | A fast start and a soft stop: `cubic-bezier(0.2, 0, 0, 1)` |
| Distance of an entrance                               | 8 pixels up                                                |
| Wait between two parts that enter                     | 40 milliseconds                                            |
| A device that is set to reduce motion                 | Gets no motion                                             |

`getEntranceTime` gives the time until the last of several parts has entered. Seven parts settle after 640 milliseconds. A test keeps that under 1000 milliseconds, the wait that breaks a visitor's flow of thought. Another keeps a small move within 100 milliseconds, the time that feels instant.

Not here: longer times for large intro animations, and separate curves for entering and leaving.

## Story, strategy and voice

Three files hold the brand's words. A test holds every one of them, so a word changes only on purpose.

| File              | What it holds                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/story.ts`    | Three parts: how PalestinianCauses began, what was built on the way, and the question that led to PCX                                        |
| `src/strategy.ts` | The positioning in one line, the mission and the vision, five values, who PCX serves, what it sells in order, and four traits of personality |
| `src/voice.ts`    | The one reader the content speaks to, five voice principles, two layers of language, where each layer speaks, and the words never used       |

The positioning is one line: "Digital systems built to perform beyond launch."

The brand's own words follow the voice. Tests prove that they use none of the 43 words the voice leaves out, that they carry no exclamation mark, and that most of their sentences stay under 15 words.

Not here: a guide on how to use the guidelines as a whole, and the rules of writing beyond the voice.

## How to install it

```bash
pnpm add @pcx.agency/brand-guidelines
```

## How to use it

Every value is imported by its name:

```ts
import { COLORS, getSize, TYPE } from "@pcx.agency/brand-guidelines";

const blue = COLORS.blue.value;
const size = getSize(TYPE.display, 1024);
```

The types come with the package. The logo's file is at `@pcx.agency/brand-guidelines/assets/logo/pcx-mark.svg`.

## How to run it

There is nothing to run. The repository holds values, not a page.

```bash
pnpm install
```

The package is built into the folder `build` with:

```bash
pnpm build
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

The development kit guards a release: its version, its notes and its commit. The release then publishes the package to npm under the same version. `package.json` names no version, because the version lives on GitHub.

## Terms of use

All rights reserved. The repository is public so that the PCX brand can be read. It grants no licence to copy, change, share or use its contents, and that includes the PCX name, the logo, the brand's values and its words. The file `LICENSE` holds the terms.

## The kit's files

`kit/`, `.github/`, `.coderabbit.yaml`, `.prettierrc.json`, `.npmrc`, `.nvmrc` and `.gitignore` are copies from the PCX development kit. A change to them is made in the kit first.
