# PCX coding style

This is the coding style of PCX. It is a house style, not a list of best practices. All PCX code follows it, so the code reads as written by one hand, and CodeRabbit reviews against it.

The rules live in this file, in the PCX dev kit. A project holds a copy of the file. Where a copy and the kit differ, the kit is right.

## Which code the rules hold for

The rules are written for TypeScript and JavaScript. For Python this holds:

- The rules on names hold: full words, the describing word last, and `is` for a yes-or-no value. Python writes its names its own way: snake_case for values and functions, UPPER_SNAKE_CASE for constants.
- The rules about TypeScript's own syntax and tools do not hold: the form of a function, `type` over `interface`, `<Fragment>`, no loop statement, strict TypeScript and ESLint.
- A Python file or folder that other code imports is named in snake_case, such as `prompt_log.py`, because Python can't import a name with a hyphen. Other files and folders keep the hyphens.
- The sections on words, on format, on tests and leftovers, and on branches, commits and pull requests hold for every language.
- The section on packages and versions holds too, with one difference: PNPM installs JavaScript packages only. No rule is set yet for Python packages. PCX's Python code uses only what comes with Python.

## Names

- A name is written in full words: `request`, `response`, `maximumRetries`. No short-hand names. A caught error is `error`, an event is `event`, a position is `index`.
- In a camel case or Pascal Case name, a word does not end in d, f, h, k or l when the next word starts with a capital letter. When a name would break this, change the word order or pick another word: `retryFetch`, `LayoutDashboard`. The rule holds for every camel case and Pascal Case name that a project chooses, such as a variable, a function, a component, a type and a property. A name that a library fixes is not chosen, so it stays as the library writes it.
- The describing word comes after the thing: `headersMerged`, `countriesSorted`, `navigationFiltered`, `URL_BASE`, `HEADERS_DEFAULT`.
- A yes-or-no value starts with `is`, also when a library's value gets a clearer name: `isPending` becomes `isSignInPending`.
- The item of a list is the singular of the list, `mosque` of `mosques`, or `element` when there is no better word.
- Acronyms stay in capitals: `serverURL`.
- A name that a library fixes stays as the library writes it, such as `req`, `params`, `props` or `t`. This covers a name taken apart from a library's object, the page props of Next.JS and the component names of ShadCN.
- Files and folders are in lower case with hyphens: `use-mobile.tsx`. Components are in Pascal Case. Constants are in UPPER_SNAKE_CASE.
- Compound words are split with a hyphen: `market-place.tsx`, `MarketPlace`, the route `/un-authorized`, `in-valid`, `re-send`, `un-limited`.

## Names for kinds of things

- A component is the feature and then its kind: `MosquesTable`, `ServicesList`, `SectionHeader`. Where that order would break the tall-letter rule, the kind comes first: `LayoutDashboard`.
- A props type is the component name and `Props`.
- A schema ends in `Schema`, a router in `Router` and a Payload collection in `Collection`.
- A server function is a verb and the thing: `getMosques`, `createMosque`, `deleteVisitor`.
- A handler is `onSubmit` or `onChange`.
- Stored fields are in snake_case: `first_name`, `pricing_from`.

## Functions and flow

- Every named function, component and hook is `const name = function name() {}`. Callbacks inside are arrow functions.
- A file exports its main thing as default on its own last line, and helpers as `export const`.
- Types use `type`, not `interface`.
- A function returns early. An `if` that fits on one line has no braces.
- A result gets a name first and is then returned.
- A default is given with `||`.
- JSX uses `<Fragment>`, not the short form.
- There is no enum, no `for` or `while` loop and no `==`.

## Files and layout

- `"use client"` or `"use server"` comes first, then an empty line.
- Imports are sorted: packages first, then the project's own files.
- Then constants, types and functions, with the main one last.
- An empty line separates the steps inside a function.
- Comments are few and short and sit on their own line. Sections of JSX are labelled, such as `{/* Header */}`.
- A string with `?` or `=` in it is built from a list with `join`.
- Folders are `app`, `components`, `components/ui`, `hooks`, `lib` and `server`. Parts used by one page sit next to it in `_components`. A folder of components has an index file that exports them.
- No file carries a REVIEWED marker, in code or in `package.json`.
- Every repository has a README that says what it is, how to run it, how to test it and how to release it. One command runs all its checks. A change that makes the README wrong also corrects it.

## Words

- Messages for the user live in one file as `errors` and `successes`, each with a title and a description.
- A sentence ends with a period.
- Product names and terms are written the house way: AirBnB, Next.JS, ShadCN, PNPM, and camel case and Pascal Case with spaces. A command or package name that a tool fixes stays as the tool writes it.
- Everything in a repository is written for a public reader: issues, pull requests, commits, comments and documents. It is professional and in plain words. It names no person, quotes no conversation and points to no private document.
- That rule is about how the work is written up. It does not cover what a project publishes on purpose as its own content. A brand's story may name its founders and quote a customer, once the owner has decided so.

## Numbers

- A number that is chosen ends in an even digit or in 5: `0.25`, `16`, `v1.2.4`. This holds most of all for decimals.
- A number that is measured, or that a standard or a tool sets, stays as it is.

## Format, packages and versions

- Prettier formats every text file it can read: TypeScript, JavaScript, JSON, CSS, Markdown, YAML, HTML, Vue, SVG files and the lock file. Only installed packages and build output are left out.
- Prettier's settings are the house settings: double quotes, semicolons, trailing commas, two spaces, lines up to 80 characters and sorted Tailwind classes. A pull request with unformatted code can't be merged.
- ESLint lints with the house rule set: AirBnB and Prettier, plus PCX's own rules. A project that uses Next.JS adds the rules of Next.JS in its own `eslint.config.mjs`. A lint error blocks a merge. A rule is switched off only for one line, in this form: `/* eslint-disable-next-line no-unused-vars */`.
- JavaScript code is written in TypeScript with strict checking on. Imports from `src` use the `@/` path.
- Packages are installed with PNPM, at an exact version. `package.json` holds no `^` and no other version specifier. The lock file is committed. The Node version and the PNPM version are pinned.
- A new dependency needs a reason in the pull request. A package with a known security hole is not added.
- No secret goes into code, commits, issues, pull requests or logs. `.env` files stay out of git. Secrets live only in the settings of GitHub or the host, and a maintainer adds them.
- A version has three numbers. A fix raises the last, a new feature the middle, and a change that breaks existing use the first. Every release has notes in plain words.

## Tests and leftovers

- A bug fix comes with a test that fails on the old code and passes on the new code. New behaviour comes with a test of that behaviour.
- A pull request carries no commented-out code, no unused files, no console output and no TODO without a linked issue.

## Branches, commits and pull requests

- One task is one branch and one pull request. A pull request changes nothing outside its brief.
- A branch name is in lower case with hyphens and starts with what is being done: `building-avatar-component`.
- A commit message starts with New, Update, Fix or Docs, then a colon, then "Enhance through" and what was done, with file and code names in backticks. An example: ``Fix: Enhance through fixing `defaultValue` field in `Hotels` collection``. One commit holds one small change.
- A pull request title follows the commit style. Its description has a summary, the testing and the limitations, and it closes its issue.
