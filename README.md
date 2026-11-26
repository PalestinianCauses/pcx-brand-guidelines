# PCX brand guidelines

The PCX brand guidelines: the brand's colours, type, logo and rules, written once as values.

Other PCX projects read the brand from here. The design system package builds its parts from these values, and the live documentation shows them. A value is changed here and nowhere else.

## What it holds

The parts arrive one at a time:

| Part                      | Status    |
| ------------------------- | --------- |
| Colours and greys         | Available |
| Shades and tints          | Available |
| Fills of a main button    | Available |
| Fonts                     | Available |
| Logo                      | Available |
| Type scale                | Available |
| Shape, lines and spacing  | Available |
| Hard shadow               | Available |
| Icons                     | Available |
| Motion                    | Available |
| Story, strategy and voice | Available |
| The look                  | Available |

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

## Shades and tints

`src/shades.ts` gives each of the four brand colours a scale of steps, named as the slate is: from 50, the lightest, to 950, the darkest. The lighter steps are tints, and the darker steps are shades.

A brand colour itself does not change. It is one step of its own scale: purple 900, blue 500, pink 400 and yellow 100. A function makes every other step. Such a step has the hue of the colour, the lightness of the step, and as much of the colour's strength as a screen can show. A test holds every value.

| Step | Purple    | Blue      | Pink      | Yellow    | Words |
| ---- | --------- | --------- | --------- | --------- | ----- |
| 50   | `#f0f0ff` | `#e9f3ff` | `#ffecf2` | `#fff2c6` | Ink   |
| 100  | `#e1e1ff` | `#d4e7ff` | `#ffd9e6` | `#ffd84d` | Ink   |
| 200  | `#cbcbff` | `#b2d4ff` | `#ffbad3` | `#f4ce40` | Ink   |
| 300  | `#b6b4ff` | `#90c1ff` | `#ff99c1` | `#e1ba21` | Ink   |
| 400  | `#9c96f9` | `#60a7ff` | `#ff4fa3` | `#c4a100` | Ink   |
| 500  | `#857edd` | `#1f8bff` | `#eb3a92` | `#a88900` | Ink   |
| 600  | `#6e65c3` | `#0072dc` | `#ce117a` | `#8c7200` | White |
| 700  | `#584da8` | `#005cb3` | `#a90062` | `#715b00` | White |
| 800  | `#43368f` | `#00468c` | `#84004c` | `#574600` | White |
| 900  | `#2e1a72` | `#003267` | `#610036` | `#3e3100` | White |
| 950  | `#1b0052` | `#001a3c` | `#37001c` | `#221a00` | White |

One rule gives the words on a step, in all four scales: a step of 600 or darker takes white words, and a lighter step takes ink words, in the darkest grey. `getWords` gives that colour. A test measures every step of every scale, and each reaches 4.5.

The rule is for the four brand scales. `getWordsOn` gives the words on any colour by measure: white or ink, whichever stands out more. One of the two always reaches 4.5. On every step of the four scales, the measure and the rule give the same colour.

The measure allows ink words on the blue and on the pink themselves, but small words are hard to read there. So a small part, such as a button or a badge, takes blue 600 or pink 600 with white words.

```ts
import { getWords, SHADES } from "@pcx.agency/brand-guidelines";

const fill = SHADES.blue[600];
const words = getWords(600);
```

`src/oklch.ts` reads and writes a colour as a person sees it: how light it is, how strong it is, and its hue. That is OKLCH, the space in which Tailwind CSS writes its colours. `getShades` makes the scale of any colour with it, and the test of the slate reads Tailwind's own values with it.

The fill of a main button is in `src/fills.ts`. Not here: which step any other part uses. The design system decides that, part by part. Not here yet: tints for badges and messages, a ground in a brand colour, the colours of a chart and the values for print.

## Fills of a main button

`src/fills.ts` says which step of a brand colour fills a main button, and which step it takes under the pointer.

| Colour | Fill                  | Under the pointer     | Words | Stands out from the darkest grey | Stands out from the lightest grey |
| ------ | --------------------- | --------------------- | ----- | -------------------------------- | --------------------------------- |
| Purple | Purple 600, `#6e65c3` | Purple 700, `#584da8` | White | Yes                              | Yes                               |
| Blue   | Blue 600, `#0072dc`   | Blue 700, `#005cb3`   | White | Yes                              | Yes                               |
| Pink   | Pink 600, `#ce117a`   | Pink 700, `#a90062`   | White | Yes                              | Yes                               |
| Yellow | Yellow 100, `#ffd84d` | Yellow 200, `#f4ce40` | Ink   | Yes                              | No                                |

A fill is step 600 of its scale: the first step that takes white words. Under the pointer it is one step darker. Yellow is the exception. A yellow that is dark enough for white words is no yellow any more, so a yellow button keeps the brand's own yellow, with ink words. `COLORS_PALE` names it.

Blue is the main button of a view. It is the brand's colour of an action, and `COLOR_ACTION` names it.

A fill stands out from a grey when the two reach a contrast of 3. The yellow fill reaches 1.2 against the lightest grey, so a yellow button belongs on the dark ground. Under the pointer, the purple and the pink fill fall a little under 3 against the darkest grey, at 2.8 and 2.6. The white words and the hard shadow carry the button there.

```ts
import { FILLS } from "@pcx.agency/brand-guidelines";

const { color, colorHover, words } = FILLS.blue;
```

Not here: the quiet kinds of a button, when a page uses which of the four colours, and a colour for a thing that deletes.

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

`src/type.ts` holds the type scale: nine steps, from the one big line of a page down to code. The three large headings and the label are shown in capitals. Their words are still written in sentence case. A sub-heading and all other text are shown as they are written.

| Step        | Used for                   | Font           | Weight       | Shown in   | Phone | Laptop | Line height | Letter spacing |
| ----------- | -------------------------- | -------------- | ------------ | ---------- | ----- | ------ | ----------- | -------------- |
| Display     | The one big line of a page | Gilroy         | Heavy 950    | Capitals   | 54    | 98     | 92 percent  | -0.032 em      |
| Title       | Page titles                | Gilroy         | Heavy 950    | Capitals   | 46    | 88     | 94 percent  | -0.032 em      |
| Heading     | Section headings           | Gilroy         | Heavy 950    | Capitals   | 38    | 80     | 96 percent  | -0.032 em      |
| Sub-heading | Block and card titles      | Gilroy         | Bold 700     | As written | 24    | 24     | 120 percent | -0.02 em       |
| Body        | Reading text               | Gilroy         | Medium 500   | As written | 16    | 18     | 160 percent | None           |
| Note        | Small supporting text      | Gilroy         | Medium 500   | As written | 15    | 15     | 150 percent | None           |
| Button      | The words of a button      | Gilroy         | SemiBold 600 | As written | 15    | 15     | 20 pixels   | None           |
| Label       | Small labels               | JetBrains Mono | Medium 500   | Capitals   | 12    | 12     | 16 pixels   | 0.14 em        |
| Code        | Code and figures           | JetBrains Mono | Regular 400  | As written | 14    | 14     | 20 pixels   | None           |

Sizes are in pixels. The phone is a screen 375 pixels wide, and the laptop is one 1440 pixels wide. Between the two a size grows evenly with the screen, and `getSize` gives the size for any width. No text is smaller than 12 pixels. A line of reading text is at least one and a half times its size, and a test holds that.

Since v1.1.0 the scale follows the PCX website. Before, the headings were smaller, lighter and shown as written.

Since v1.1.1 a sub-heading is shown as written again. At its size, the heaviest weight in capitals is hard to read. Since v1.1.2 it is in weight 700.

Since v2.0.0 the key of that step is written with its hyphen, as its name is: `TYPE["sub-heading"]`. Before, the key was one word, without the hyphen. Code that reads the step by the older key moves to the new one. No value of the step changed.

Since v2.2.0 a button has a step of its own, in Gilroy and shown as written. Before, a button used the label step, and its small capitals in the code font were hard to read. The label step stays for small labels.

Not here: scales for slides, documents and print, and the rules for paragraphs.

## Shape, lines and spacing

`src/shape.ts` holds the shape: square corners, thin lines and spaces in steps of 4 pixels.

| Part                                    | Value                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Corners                                 | Square, on buttons, fields, cards and tags                                                                             |
| Thin line                               | 1 pixel, around blocks and between rows                                                                                |
| Thick line                              | 2 pixels, for emphasis                                                                                                 |
| Height of a button or a field           | 44 pixels in its default size, on every screen                                                                         |
| Sizes of a control                      | 28, 36, 44 and 52 pixels, named xs, sm, default and lg                                                                 |
| Focus                                   | The strong colour of the ground: white on dark, ink on light. A line of 1 pixel, with a soft ring of 1 pixel around it |
| Pointer over a part that can be pressed | The hand                                                                                                               |
| Room inside a card                      | 24 pixels                                                                                                              |
| Room between two cards                  | 16 pixels                                                                                                              |
| Room between a heading and what follows | 28 pixels                                                                                                              |
| Room above a section                    | 48 pixels on a phone, 96 pixels on a laptop                                                                            |
| Room below a section                    | 56 pixels on a phone, 96 pixels on a laptop                                                                            |

Every space and every height is a multiple of 4 pixels, and a test proves it. A button or a field is 44 pixels high in its default size, the height a finger needs.

A control has four sizes, under the names that ShadCN gives them. One size is 8 pixels higher than the one before it. The two smaller ones are for a dense screen that is used with a pointer, and the large one is for the one main action of a view. Both smaller ones stay above the 24 by 24 pixels that WCAG 2.2 asks of a part to press, at its level AA.

The focus is what a part looks like with the keyboard on it. The line of the part takes the strong colour of its ground: white on a dark ground, and ink on a light one. It is never a brand colour, so it is not taken for a part in one of them. It stands out from the fill of every main button but one. Against the yellow fill on a dark ground the white line reaches 1.2, and there it stands out from the dark ground around it. Around the line stands a soft ring of the same colour, at half its strength. A test measures the line and the soft ring on the darkest and on the lightest grey: a part that is not words needs a contrast of 3 or more. Where a device forces its own colours, an outline of 1 pixel stands around the part, 2 pixels away.

Before v2.3.0 the focus was a ring in the brand's blue, 2 pixels thick and 2 pixels away. On a blue button it was hard to tell from the button: the two reach 1.2. The name `ringFocus` is still there, with those values. It is marked as deprecated, and it leaves with the next major version.

Between a phone and a laptop, the room around a section grows evenly with the screen, as a size does. `getScaled` gives a value for any width.

Since v1.1.0 the room follows the PCX website too. The names `sectionPhone` and `sectionLaptop` are still there, and they hold the room above a section. They are marked as deprecated, and they leave with the next major version.

Not here: layers, breakpoints, and the colours of lines. The hard shadow has its own file.

## Hard shadow

`src/shadow.ts` says what a hard shadow is. The look says where one may stand.

| Part                                      | Value                                                       |
| ----------------------------------------- | ----------------------------------------------------------- |
| The band                                  | To the right of a part and below it, 6 pixels wide          |
| Its lines                                 | 1 pixel wide, 4 pixels from one to the next, at 135 degrees |
| Lines on a dark ground                    | Slate 300, `#cad5e2`                                        |
| Lines on a light ground                   | Ink, `#020618`                                              |
| Lines beside a pale part on a dark ground | Slate 500, `#62748e`                                        |
| A pressed part                            | It moves 6 pixels, into the place of its shadow             |
| No shadow                                 | While a part is pressed, with the keyboard on it, or off    |

A hard shadow is a band of slanted lines, not a solid block. Its lines are thin lines, one unit apart. The design system draws the margins of a page with lines at the same angle, twice as far apart.

A pale part is one that takes ink words, such as a yellow button. Light lines would not stand out from it, so the lines beside it are darker on a dark ground. `getLines` gives the colour of the lines beside any part.

The focus and the hard shadow never meet: a part with the keyboard on it has no shadow.

Tests measure the lines against both grounds, and against the fill of every main button. Each pair reaches 3 at rest. Under the pointer, the lines fall a little under 3 against the purple and the pink fill on a light ground, at 2.8 and 2.6. The lines still stand out from the ground there, and so does the button.

Not here: a hard shadow on a ground in a brand colour.

## Icons

`src/icons.ts` names the icons of the brand.

| Part                                                                       | Value                        |
| -------------------------------------------------------------------------- | ---------------------------- |
| Icons for normal work                                                      | Lucide, `https://lucide.dev` |
| Icons for a section with animated icons, or with icons in three dimensions | Iconly, `https://iconly.pro` |
| An icon in a control                                                       | 16 pixels wide and high      |
| An icon in the smallest size of a control                                  | 14 pixels wide and high      |

An icon in a part stands for what the part does, and a screen reader passes it by. A button with an icon alone has a name that a screen reader says.

Not here yet: how Iconly is used, and the icons of the sections of a page.

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

## The look

One file, `src/look.ts`, says what PCX looks like as a whole. The other chapters hold values, such as a colour or a weight. This one holds the rules that those values follow.

| Part              | What it holds                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------- |
| The traits        | For each of the four traits of the personality, the rules of the look that follow from it |
| The grounds       | Their order: mostly dark, then light, then a brand colour                                 |
| The relatives     | What the look is close to, what it is not, and what is its own                            |
| The illustrations | What an illustration is: it has a meaning, and it is made by rules                        |

The traits of the look are the traits of the personality in `src/strategy.ts`, in the same order. A test holds every line, so a line changes only on purpose. Other tests tie a line to the value that it names: the weight of the large type, and the square corner.

Not here: how PCX speaks and writes, which belongs to a system for copywriting and proofreading. Not here yet: how the four brand colours are used on a page, and the rules for drawing an illustration.

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
