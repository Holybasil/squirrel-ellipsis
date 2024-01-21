[![npm downloads](https://img.shields.io/npm/dw/squirrel-ellipsis)](https://www.npmjs.com/package/squirrel-ellipsis)
[![npm version](https://img.shields.io/npm/v/squirrel-ellipsis.svg)](https://www.npmjs.com/package/squirrel-ellipsis)

# squirrel-ellipsis

an Expandable Multiline Text Component designed for React

## Preview

```jsx
import SquirrelEllipsis from "squirrel-ellipsis";

...

const EXAMPLE_TEXT =
  "Roughly a year ago I moved into my new apartment. One of the reasons I picked this apartment was age of the building. The construction was finished in 2015, which ensured pretty good thermal isolation for winters as well as small nice things like Ethernet ports in each room. However, there was one part of my apartment that was too new and too smart for me. ";

<SquirrelEllipsis
  text={EXAMPLE_TEXT}
  maxLine={2}
  action={
    <a
      style={{
        fontWeight: 400,
        color: "#5b5b5b",
        textDecorationLine: "underline",
      }}
    >
      More
    </a>
  }
  basedOn="words"
  onReflow={handleReflow}
/>;
```

## Features

- multiline Text Ellipsis: Supports the display of multiline text and allows customization of the maximum number of lines shown.

- Automatic Punctuation Removal at Ellipsis: When text is truncated, the component automatically removes any punctuation marks at the end of the visible text.

- Expandable Content with Customizable Ellipsis and Button: Users can expand the text to view the full content. The component supports customization of both the ellipsis indicator and the expand button.

- Responsive Design: Implemented using ResizeObserver for responsive behavior, ensuring the component adjusts to varying container sizes.

- Reflow Callback: On reaching its final display state, the component calls a reflow function. This feature can be integrated with react-virtualized's CellMeasurer to achieve a virtual list with variable row heights.

## Options

| key         | desc                                                              | type                                              | defaultValue        |
| ----------- | ----------------------------------------------------------------- | ------------------------------------------------- | ------------------- |
| text        | just text                                                         | string                                            | -                   |
| maxLine     | max count of lines allowed, ”null“ for no ellipsis                | number                                            | -                   |
| basedOn     | "word" or "letter", the default value is based on text            | string                                            | -                   |
| ellipsis    | the ellipsis indicator                                            | ReactNode \| string                               | &thinsp;...&thinsp; |
| action      | the expend button                                                 | ReactNode \| string                               | more                |
| trimEndPunc | remove any punctuation marks at the end of the text when ellipsis | boolean                                           | true                |
| onReflow    | the callback func when the final state is determined              | (clamped: boolean, displayedText: string) => void | -                   |

## Install

With yarn:

    yarn add squirrel-ellipsis

With npm:

    npm install --save squirrel-ellipsis

## Examples

## Development

For dependencies,

```sh
yarn run bootstrap

```

Then

```sh
yarn run start
cd site
yarn run dev
```
