import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { TweetComponent } from "./tweet";
import { CaptionComponent } from "./caption";
import { YouTubeComponent } from "./youtube";
import { ImageGrid } from "./image-grid";
import { CopyLinkButton } from "./copy-link-button";
import { CodeBlock } from "./code-block";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypePrettyCode from "rehype-pretty-code";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

function CustomLink(props) {
  let href = props.href;
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return <a {...props} />;
  }
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />;
}

function TableCell({ content }) {
  // If content is not a string, return as is
  if (typeof content !== "string") {
    return <>{content}</>;
  }

  // Regex to match backtick code `...` OR math $...$
  // Group 1: code content (inside backticks)
  // Group 2: math content (inside dollars)
  const regex = /`([^`]+)`|\$([^\$]+)\$/g;
  
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(content)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Inline Code
      parts.push(
        <code
          key={key++}
          className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-sm font-mono"
        >
          {match[1]}
        </code>
      );
    } else if (match[2]) {
      // Inline Math
      parts.push(<span key={key++}><InlineMath math={match[2]} /></span>);
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : <>{content}</>;
}

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>
      <TableCell content={header} />
    </th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>
          <TableCell content={cell} />
        </td>
      ))}
    </tr>
  ));
  return (
    <div className="overflow-x-auto w-full -mx-4 px-4 sm:mx-0 sm:px-0">
      <table>
        <thead>
          <tr className="text-left">{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function Strikethrough(props) {
  return <del {...props} />;
}

function Callout(props) {
  return (
    <div className="px-4 py-3 bg-[#F7F7F7] dark:bg-[#181818] rounded p-1 text-sm flex items-center text-neutral-900 dark:text-neutral-100 mb-8">
      <div className="flex items-center w-4 mr-4 flex-shrink-0">{props.emoji}</div>
      <div className="w-full callout leading-relaxed break-words">{props.children}</div>
    </div>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug, className: "group relative" },
      [
        React.createElement(CopyLinkButton, {
          key: `link-${slug}`,
          slug: slug,
        }),
      ],
      children
    );
  };
  Heading.displayName = `Heading${level}`;
  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  ImageGrid,
  a: CustomLink,
  StaticTweet: TweetComponent,
  Caption: CaptionComponent,
  YouTube: YouTubeComponent,
  pre: CodeBlock,
  Table,
  del: Strikethrough,
  Callout,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkMath],
          rehypePlugins: [
            rehypeKatex,
            [
              rehypePrettyCode,
              {
                theme: {
                  dark: "github-dark",
                  light: "github-light",
                },
              },
            ],
          ],
        },
      }}
    />
  );
}
