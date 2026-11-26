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
| A field                   | Available |
| The other parts of a form | Available |
| A message                 | Available |
| A badge                   | Available |
| A card                    | Available |
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

### On a ground in a brand colour

A fill in a brand colour stands out from a ground when the two reach a contrast of 3. `getFillsClear` names the fills that do, by the name of the ground:

| Ground | Purple   | Blue     | Pink     | Yellow    |
| ------ | -------- | -------- | -------- | --------- |
| Dark   | Yes, 4.0 | Yes, 4.2 | Yes, 3.8 | Yes, 14.5 |
| Light  | Yes, 4.6 | Yes, 4.5 | Yes, 5.0 | No, 1.2   |
| Purple | No, 2.8  | No, 2.8  | No, 2.6  | Yes, 10.0 |
| Blue   | No, 1.4  | No, 1.2  | No, 1.5  | No, 2.4   |
| Pink   | No, 1.5  | No, 1.5  | No, 1.6  | No, 2.2   |
| Yellow | Yes, 3.5 | Yes, 3.4 | Yes, 3.8 | No, 1.0   |

No fill in a brand colour stands out from the blue or from the pink ground, and only the yellow one stands out from the purple ground. So the main button of a ground in a brand colour is no brand colour. It has the colour of the words on that ground: ink with white words on the blue, the pink and the yellow ground, and white with ink words on the purple one. Under the pointer it is the grey one step from its fill. `getMainFill` gives the main button of every ground:

| Ground | Fill      | Under the pointer | Words     | Against the ground |
| ------ | --------- | ----------------- | --------- | ------------------ |
| Dark   | `#0072dc` | `#005cb3`         | `#ffffff` | 4.2                |
| Light  | `#0072dc` | `#005cb3`         | `#ffffff` | 4.5                |
| Purple | `#ffffff` | `#e2e8f0`         | `#020618` | 13.8               |
| Blue   | `#020618` | `#1d293d`         | `#ffffff` | 5.8                |
| Pink   | `#020618` | `#1d293d`         | `#ffffff` | 6.6                |
| Yellow | `#020618` | `#1d293d`         | `#ffffff` | 14.5               |

A button in a brand colour belongs on a ground in a brand colour only where the first table says yes.

The quiet kinds of a button take a share of the colour of the words on such a ground. A secondary button takes 8 parts in a hundred of it at rest, and an outline and a ghost button take 12 under the pointer. Where the words on such a fill would fall under 4.5, a ground takes the next weaker share. `SHARES_QUIET` holds the shares.

Not here: when a page uses which of the four colours, and a colour for a thing that deletes.

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

On a ground in a brand colour the line of the focus has the colour of the words on that ground: white on purple, and ink on the other three. The main button of such a ground has that very colour, so nobody could see the line on its edge. There a line of 1 pixel stands around the part, 2 pixels away, in the colour of the line, with no soft ring. Against the ground that line reaches 13.8 on purple, 5.8 on blue, 6.6 on pink and 14.5 on yellow. `getFocusColor` gives the colour on any ground, and `isFocusAround` says where the line stands around a part.

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

On a ground in a brand colour the lines follow the words of the ground. Ink on the blue, the pink and the yellow ground, and the lines of a dark ground on the purple one. `getLinesOn` gives them by the name of the ground. Beside the main button of such a ground the lines have the colour of the button, or one close to it. The band still reads, because it is hatched and the button is not. The darker lines beside a pale part reach 2.8 against the purple ground, under the 3 that a part needs. The yellow button stands out from that ground itself, and the lines stand out from the button.

## A field

`src/field.ts` says what is a field's own. A field is a control that a person types in, with its label, its hint and its error. Its height is the height of a control, its corners are square, and its focus is the focus of every part.

| Part of a field           | Step of the type scale | What that is                        |
| ------------------------- | ---------------------- | ----------------------------------- |
| Label                     | Button                 | Gilroy at 15 pixels and weight 600  |
| Words that a person types | Body                   | Gilroy at 16 pixels, 18 on a laptop |
| Hint                      | Note                   | Gilroy at 15 pixels                 |
| Error                     | Note                   | Gilroy at 15 pixels                 |

A label is shown as it is written, in sentence case. The words in a field are never smaller than 16 pixels: under that, a phone zooms in on a field that takes the keyboard.

A field that is wrong is pink on a dark, on a light and on the purple ground. Its pink is the step nearest to 600 in which words can be read on that ground. On the blue, the pink and the yellow ground it has no colour. There its line has the colour of the words on the ground and is 1 pixel thicker. `getWrong` gives a wrong field on every ground:

| Ground | A field that is wrong | Against the ground | Its line |
| ------ | --------------------- | ------------------ | -------- |
| Dark   | Pink 500, `#eb3a92`   | 5.2                | 1 pixel  |
| Light  | Pink 600, `#ce117a`   | 5.0                | 1 pixel  |
| Purple | Pink 400, `#ff4fa3`   | 4.5                | 1 pixel  |
| Blue   | No colour             | 5.8                | 2 pixels |
| Pink   | No colour             | 6.6                | 2 pixels |
| Yellow | No colour             | 14.5               | 2 pixels |

A wrong field never rests on its colour. An icon and words say what is wrong, on every ground. Only its line and its error take the colour: its label and its hint keep theirs. On the three grounds with the pink, the pink can be told from the words of the ground at a contrast of 3 or more, and a test holds it.

Not here: the wording of an error. The colours of a warning and of a note are under a message.

## The other parts of a form

`src/form.ts` says what is their own for a ticking box, a radio, a switch and the list that a select opens. The rest follows the button and the field: a control that is off has the line and the fill of a field, the focus is the focus of every part, and a control that is wrong looks as a wrong field does.

A control that is on is a box that is ticked, the chosen radio and a switch that is on. It takes the fill of the main button of its ground, and its mark takes the words of that button. The mark is the tick, the dot or the thumb. So a control that is on is no one colour: it changes with its ground, as the main button does. `getOn` gives it on every ground:

| Ground | A control that is on | Against the ground | Its mark against it |
| ------ | -------------------- | ------------------ | ------------------- |
| Dark   | Blue 600, `#0072dc`  | 4.2                | 4.6                 |
| Light  | Blue 600, `#0072dc`  | 4.5                | 4.6                 |
| Purple | White, `#ffffff`     | 13.8               | 20.0                |
| Blue   | Ink, `#020618`       | 5.8                | 20.0                |
| Pink   | Ink, `#020618`       | 6.6                | 20.0                |
| Yellow | Ink, `#020618`       | 14.5               | 20.0                |

A fill and a mark need a contrast of 3 or more, and a test holds every pair. A control never rests on its colour: the tick, the dot and the place of the thumb say that it is on.

`FORM` holds the sizes and the shapes:

- A ticking box and a radio are 20 pixels, to stand beside words of 16 pixels and more. The tick is 14 pixels and the dot is 8.
- The track of a switch is 36 pixels by 20, as high as a ticking box, and its thumb is 14 pixels. The thumb stands 2 pixels from the line of the track.
- A ticking box and a switch are square, as every part of PCX is. A radio is round, the one round part: its shape is what tells it from a ticking box.
- The place of a press reaches past a small control: 12 pixels to each side and 8 above and below. With it the place is larger than the 24 pixels that a pointer needs.
- The list of a select has the colour of its ground and the line of a field, and it opens 4 pixels under the select. An item is 44 pixels high, as a finger needs. The pointed item has the fill of a quiet button under the pointer, and a line of 2 pixels at its start in the colour of the words on the ground. The chosen item has a tick.

Not here: how the list of a select moves in, and the look of a menu and of a dialog. The message of a whole form is under a message.

## A message

`src/message.ts` holds the message: a block that says what happened, or what to mind. It has an icon, a heading and words, and four kinds.

| Kind    | Icon of Lucide   | To a screen reader | Its colour                             |
| ------- | ---------------- | ------------------ | -------------------------------------- |
| Wrong   | `circle-alert`   | An alert           | The colour of a thing that is wrong    |
| Warning | `triangle-alert` | An alert           | Yellow, the brand's colour of a signal |
| Success | `circle-check`   | A status           | None                                   |
| Note    | `info`           | A status           | Blue                                   |

A message has a line of 2 pixels at its start, in the colour of its kind, and no box. Only that line and the icon take the colour: the heading and the words keep theirs. The icon is 20 pixels. A success has no colour, since the brand has none that says that a thing went well: its tick and its heading say it.

The heading is set in the step of a button's words, and the words in the step of a note. Both are 15 pixels, so the words are never larger than the heading. The heading leads by its weight and by the strong colour of its ground.

A kind takes its brand colour itself where that stands out from the ground, and the nearest darker step where it does not. On the blue, the pink and the yellow ground no kind has a colour, as a field that is wrong has none there. `getTint` gives the colour of the line and of the icon on every ground, with its contrast against that ground:

| Ground | Wrong                    | Warning                             | Success         | Note                             |
| ------ | ------------------------ | ----------------------------------- | --------------- | -------------------------------- |
| Dark   | Pink 500, `#eb3a92`, 5.2 | The brand's yellow, `#ffd84d`, 14.5 | No colour, 20.0 | The brand's blue, `#1f8bff`, 5.8 |
| Light  | Pink 600, `#ce117a`, 5.0 | Yellow 500, `#a88900`, 3.2          | No colour, 19.2 | The brand's blue, `#1f8bff`, 3.2 |
| Purple | Pink 400, `#ff4fa3`, 4.5 | The brand's yellow, `#ffd84d`, 10.0 | No colour, 13.8 | The brand's blue, `#1f8bff`, 4.0 |
| Blue   | No colour, 5.8           | No colour, 5.8                      | No colour, 5.8  | No colour, 5.8                   |
| Pink   | No colour, 6.6           | No colour, 6.6                      | No colour, 6.6  | No colour, 6.6                   |
| Yellow | No colour, 14.5          | No colour, 14.5                     | No colour, 14.5 | No colour, 14.5                  |

A line and an icon need a contrast of 3 or more, and a test holds every one. These colours are measured for a line and an icon. They are not measured for words, and no words take them. With no colour, the line and the icon have the colour of the words on the ground.

A message never rests on its colour: its icon and its heading say what kind it is. A message that is wrong or that warns is an alert, and a success and a note are a status. When a message comes onto a page that runs, a screen reader reads an alert at once, and a status when it is free.

Not here: a message that comes and goes at the edge of a page, a button inside a message, and the wording of a message.

## A badge

`src/badge.ts` holds the badge: one or two words that mark a state or a kind. It is 24 pixels high, with 8 pixels of room before and after its words, and it is not pressed. Its words are set in the step of a button's words, as the label of a field is.

A badge has five kinds: a plain one, which marks a kind of thing, and one for each kind of a message, which marks a state. A badge of a state has the icon of that state before its words, the icon that a message of that kind has, at 14 pixels. So a badge never rests on its colour: its icon and its words say the state. The words keep the colour of the words on the ground, whatever the kind is.

A plain badge has a quiet fill. `getQuiet` gives it on every ground, as a solid colour, with the contrast of the words on it:

| Ground | Quiet fill | Words on it |
| ------ | ---------- | ----------- |
| Dark   | `#1d293d`  | 14.6        |
| Light  | `#e2e8f0`  | 16.2        |
| Purple | `#3f2c7d`  | 11.2        |
| Blue   | `#1d80ed`  | 5.0         |
| Pink   | `#eb4998`  | 5.6         |
| Yellow | `#ebc749`  | 12.2        |

On the dark and on the light ground it is a step of the greys. On a ground in a brand colour it is the colour of the words at the share of a quiet button. `getBlend` writes one colour on another at a share as the one solid colour that a screen shows, so nothing shows through such a fill.

On the dark and on the light ground a badge of a state that has a colour has a soft fill in that colour, and a line of 1 pixel in the colour of its icon. The fill is one step of the scale of the colour: step 900 on the dark ground and step 100 on the light ground. A pale colour takes step 50 on the light ground, since its step 100 is the colour in full. A deep fill can't carry its colour alone on the dark ground, so the line carries it, and the light ground has the same line. `getBadge` gives the fill, the words, the icon and the line of every kind on every ground:

| Ground | Kind    | Soft fill             | Words on it | Icon and line                 | Against the fill | Against the ground |
| ------ | ------- | --------------------- | ----------- | ----------------------------- | ---------------- | ------------------ |
| Dark   | Wrong   | Pink 900, `#610036`   | 13.4        | Pink 500, `#eb3a92`           | 3.5              | 5.2                |
| Dark   | Warning | Yellow 900, `#3e3100` | 12.6        | The brand's yellow, `#ffd84d` | 9.2              | 14.5               |
| Dark   | Note    | Blue 900, `#003267`   | 12.6        | The brand's blue, `#1f8bff`   | 3.6              | 5.8                |
| Light  | Wrong   | Pink 100, `#ffd9e6`   | 15.6        | Pink 600, `#ce117a`           | 4.0              | 5.0                |
| Light  | Warning | Yellow 50, `#fff2c6`  | 18.0        | Yellow 500, `#a88900`         | 3.0              | 3.2                |
| Light  | Note    | Blue 100, `#d4e7ff`   | 16.0        | Blue 600, `#0072dc`           | 3.6              | 4.5                |

Words need a contrast of 4.5 or more, and an icon and a line need 3. A test holds every one. The icon takes the colour that a message of that kind has on the ground where that stands out from the fill, and the first darker step where it does not.

A success has no colour, as in a message, and a plain badge marks no state. Both have the quiet fill and no line, on every ground. On the purple ground a state keeps the quiet fill, and its icon alone has its colour: Pink 400 at 3.6, the brand's yellow at 8.0 and the brand's blue at 3.2. On the blue, the pink and the yellow ground no state has a colour, and the icon has the colour of the words.

Not here: a badge that can be pressed or removed, a number in a badge, and the wording of a badge.

## A card

`src/card.ts` holds the card: a square block with a head, a body and a foot.

A card is one element of a design, and it has one job. A card holds a piece of content that is one thing: mostly one that is pressed as a whole, such as a service or a case. What a card is not for:

- A card is no tool for laying out a page. Spacing, columns and sections are the work of the structure of a page.
- A page is not built from cards. Most content stands on its ground, in blocks that thin lines divide.
- A card does not stand inside a card.

A card has a thin line around it and a solid fill, on every ground. So the grid of a page does not show through it, and its words stand on what was measured. It has 24 pixels of room, and 24 pixels between its parts. Its heading is set in the step of a sub-heading and its words in the step of running text, so the words are never larger than the heading.

A card that can be pressed is one link as a whole. It has an arrow of 20 pixels after its heading, so that it shows without a pointer. Under the pointer its line takes the colour of the words on the ground, and its fill stays. `getCard` gives the fill, the line and the words on every ground, with the contrast of the heading and of the words on the fill, and of the line under the pointer against the ground:

| Ground | Fill      | Line      | Words     | Heading on the fill | Words on the fill | Line under the pointer |
| ------ | --------- | --------- | --------- | ------------------- | ----------------- | ---------------------- |
| Dark   | `#0f172b` | `#1d293d` | `#90a1b9` | 17.8                | 6.6               | `#ffffff`, 20.0        |
| Light  | `#ffffff` | `#cad5e2` | `#45556c` | 20.0                | 7.5               | `#020618`, 19.2        |
| Purple | `#3f2c7d` | `#4b3a86` | `#e8e6ef` | 11.2                | 9.0               | `#ffffff`, 13.8        |
| Blue   | `#1d80ed` | `#1970d1` | `#020618` | 5.0                 | 5.0               | `#020618`, 5.8         |
| Pink   | `#eb4998` | `#cc4087` | `#020618` | 5.6                 | 5.6               | `#020618`, 6.6         |
| Yellow | `#ebc749` | `#ccae42` | `#020618` | 12.2                | 12.2              | `#020618`, 14.5        |

On a ground in a brand colour the fill of a card is the quiet fill of that ground. Its line takes 14 parts of a hundred of white, or 20 of ink. On a ground with white words its words take 88 parts of a hundred of white. The line of a card at rest only parts it from the page, so it is not measured.

Not here: a picture in a card, and the look of a card with the keyboard on it, which is the focus of every part.

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
