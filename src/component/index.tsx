// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SquirrelEllipsisProps } from "./type";
import { createPortal } from "react-dom";

const agentStyle = {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: 0,
  overflow: "hidden",
  paddingTop: 0,
  paddingBottom: 0,
  border: "none",
};

const mirrorProps = [
  "box-sizing",
  "width",
  "font-size",
  "font-weight",
  "font-family",
  "font-style",
  "letter-spacing",
  "text-indent",
  "white-space",
  "word-break",
  "overflow-wrap",
  "padding-left",
  "padding-right",
];

function prevSibling(node, count) {
  while (node && count--) {
    node = node.previousElementSibling;
  }
  return node;
}

const SquirrelEllipsis = (props: SquirrelEllipsisProps) => {
  const {
    component: Component = "div",
    ellipsis = <>&thinsp;...&thinsp;</>,
    basedOn,
    maxLine: defaultMaxLine,
    text,
    className,
    action = "more",
    trimEndPunc = true,
    onReflow,
    ...rest
  } = props;

  const [truncatedText, setTruncatedText] = useState<string>(text);
  const [maxLine, setMaxLine] = useState<number>(defaultMaxLine);
  const [clamped, setClamped] = useState<boolean>(false);

  const units = useRef([]);
  const shadowRef = useRef<HTMLElement>();
  const targetRef = useRef();
  const ellipsisRef = useRef();
  const clampedHeightRef = useRef(0);

  const displayedText = useMemo(() => {
    let displayedText = (clamped ? truncatedText : text).trimEnd();
    if (trimEndPunc && clamped) {
      displayedText = displayedText.replace(/[.,;:!?，。；：！？]+$/, "");
    }
    return displayedText;
  }, [text, truncatedText, trimEndPunc, clamped]);

  useEffect(() => {
    setTruncatedText(text);
  }, [text]);

  useEffect(() => {
    setMaxLine(defaultMaxLine);
  }, [defaultMaxLine]);

  useEffect(() => {
    const handleSizeChanged = (entries) => {
      if (targetRef.current) {
        copyStyleToShadow();
        reflow({ basedOn, text, maxLine });
      }
    };
    const resizeObserver = new ResizeObserver(handleSizeChanged);
    resizeObserver.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        resizeObserver && resizeObserver.unobserve(targetRef.current);
      }
    };
  }, [basedOn, text, maxLine]);

  const copyStyleToShadow = () => {
    const targetStyle = window.getComputedStyle(targetRef.current);
    mirrorProps.forEach((key) => {
      shadowRef.current.style[key] = targetStyle[key];
    });
  };

  const reflow = (props) => {
    /* eslint-disable no-control-regex */
    const basedOn =
      props.basedOn ||
      (/^[\x00-\x7F]+$/.test(props.text) ? "words" : "letters");

    if (basedOn === "words") {
      units.current = props.text.split(/\b|(?=\W)/);
    } else if (basedOn === "letters") {
      units.current = Array.from(props.text);
    } else {
      // default
      units.current = props.text.split(/\b|(?=\W)/);
    }
    shadowRef.current.innerHTML = units.current
      .map((c) => {
        return `<span class='squirrel-ellipsis-unit'>${c}</span>`;
      })
      .join("");
    const ellipsisIndex = putEllipsis(calcIndexes());
    const nextClamped = ellipsisIndex > -1;
    const nextTruncatedText = nextClamped
      ? units.current.slice(0, ellipsisIndex).join("")
      : props.text;
    setClamped(nextClamped);
    setTruncatedText(nextTruncatedText);
    if (targetRef.current.offsetHeight <= clampedHeightRef.current) {
      onReflow(nextClamped, nextTruncatedText);
    }
  };

  // return the index of the first letter/word of each line
  // row count: maxLine + 1
  const calcIndexes = () => {
    const indexes = [0];
    let spanNode = shadowRef.current.firstElementChild;
    if (!spanNode) return indexes;

    let index = 0;
    let line = 1;
    let offsetTop = spanNode.offsetTop;
    while ((spanNode = spanNode.nextElementSibling)) {
      index++;
      if (spanNode.offsetTop > offsetTop) {
        line++;
        indexes.push(index);
        offsetTop = spanNode.offsetTop;
      }
      if (line > maxLine) {
        break;
      }
    }

    return indexes;
  };

  const putEllipsis = (indexes) => {
    // no ellipsis
    if (!maxLine || indexes.length <= maxLine) return -1;
    const lastIndex = indexes[maxLine];

    const truncatedUnits = units.current.slice(0, lastIndex);

    // the first ele of maxLine + 1 row
    const maxOffsetTop = shadowRef.current.children[lastIndex].offsetTop;
    clampedHeightRef.current = maxOffsetTop;
    shadowRef.current.innerHTML =
      truncatedUnits
        .map((c, i) => {
          return `<span class='squirrel-ellipsis-unit'>${c}</span>`;
        })
        .join("") +
      `<span class='squirrel-ellipsis-tail'>${ellipsisRef.current.innerHTML}</span>`;
    const ellipsisNode = shadowRef.current.lastElementChild;
    let lastTextNode = ellipsisNode.previousElementSibling;
    while (
      lastTextNode &&
      (ellipsisNode.offsetTop >= maxOffsetTop ||
        ellipsisNode.offsetTop > lastTextNode.offsetTop ||
        ellipsisNode.offsetHeight > lastTextNode.offsetHeight)
    ) {
      shadowRef.current.removeChild(lastTextNode);
      lastTextNode = ellipsisNode.previousElementSibling;
      truncatedUnits.pop();
    }
    return truncatedUnits.length;
  };

  const handleExpend = () => {
    setMaxLine(null);
  };

  return (
    <>
      <Component
        className={`squirrel-ellipsis ${
          clamped ? "squirrel-ellipsis-clamped" : ""
        } ${className || ""}`}
        ref={targetRef}
        {...rest}
      >
        {displayedText}
        {clamped && (
          <span className="squirrel-ellipsis-tail">
            <span className="squirrel-ellipsis-suffix">{ellipsis}</span>
            {action && (
              <span
                className="squirrel-ellipsis-action"
                style={{ cursor: "pointer" }}
                role="button"
                onClick={handleExpend}
              >
                {action}
              </span>
            )}
          </span>
        )}
      </Component>
      <>
        <div
          style={agentStyle}
          ref={shadowRef}
          aria-hidden="true"
          className={`squirrel-ellipsis-shadow ${className}`}
        ></div>

        <span style={agentStyle} ref={ellipsisRef}>
          <span className="squirrel-ellipsis-suffix">{ellipsis}</span>
          {action && <span className="squirrel-ellipsis-action">{action}</span>}
        </span>
      </>
    </>
  );
};

export default SquirrelEllipsis;
