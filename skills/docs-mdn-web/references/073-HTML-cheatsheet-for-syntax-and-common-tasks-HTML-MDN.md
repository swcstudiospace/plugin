# HTML cheatsheet for syntax and common tasks - HTML | MDN

Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Cheatsheet

## [Inline elements](#inline_elements)

An "element" is a single part of a webpage. Some elements are large and hold smaller elements like containers. Some elements are small and are "nested" inside larger ones. By default, "inline elements" appear next to one another in a webpage. They take up only as much width as they need in a page and fit together horizontally like words in a sentence or books shelved side-by-side in a row. All inline elements can be placed within the `<body>` element.

Inline elements: usage and examples

| Usage | Element | Example |
| --- | --- | --- |
| A link | [`<a>`](/en-US/docs/Web/HTML/Reference/Elements/a) | ``` <a href="https://example.org"> A link to example.org</a>. ``` |
| An image | [`<img>`](/en-US/docs/Web/HTML/Reference/Elements/img) | ``` <img src="beast.png" width="50" /> ``` |
| An inline container | [`<span>`](/en-US/docs/Web/HTML/Reference/Elements/span) | ``` Used to group elements: for example, to <span style="color:blue">style them</span>. ``` |
| Emphasize text | [`<em>`](/en-US/docs/Web/HTML/Reference/Elements/em) | ``` <em>I'm posh</em>. ``` |
| Italic text | [`<i>`](/en-US/docs/Web/HTML/Reference/Elements/i) | ``` Mark a phrase in <i>italics</i>. ``` |
| Bold text | [`<b>`](/en-US/docs/Web/HTML/Reference/Elements/b) | ``` Bold <b>a word or phrase</b>. ``` |
| Important text | [`<strong>`](/en-US/docs/Web/HTML/Reference/Elements/strong) | ``` <strong>I'm important!</strong> ``` |
| Highlight text | [`<mark>`](/en-US/docs/Web/HTML/Reference/Elements/mark) | ``` <mark>Notice me!</mark> ``` |
| Strikethrough text | [`<s>`](/en-US/docs/Web/HTML/Reference/Elements/s) | ``` <s>I'm irrelevant.</s> ``` |
| Subscript | [`<sub>`](/en-US/docs/Web/HTML/Reference/Elements/sub) | ``` H<sub>2</sub>O ``` |
| Small text | [`<small>`](/en-US/docs/Web/HTML/Reference/Elements/small) | ``` Used to represent the <small>small print </small>of a document. ``` |
| Address | [`<address>`](/en-US/docs/Web/HTML/Reference/Elements/address) | ``` <address>Main street 67</address> ``` |
| Textual citation | [`<cite>`](/en-US/docs/Web/HTML/Reference/Elements/cite) | ``` For more monsters, see <cite>The Monster Book of Monsters</cite>. ``` |
| Superscript | [`<sup>`](/en-US/docs/Web/HTML/Reference/Elements/sup) | ``` x<sup>2</sup> ``` |
| Inline quotation | [`<q>`](/en-US/docs/Web/HTML/Reference/Elements/q) | ``` <q>Me?</q>, she said. ``` |
| A line break | [`<br>`](/en-US/docs/Web/HTML/Reference/Elements/br) | ``` Line 1<br />Line 2 ``` |
| A possible line break | [`<wbr>`](/en-US/docs/Web/HTML/Reference/Elements/wbr) | ``` <div style="width: 200px">   Llanfair<wbr />pwllgwyngyll<wbr />gogerychwyrndrobwllllantysiliogogogoch. </div> ``` |
| Date | [`<time>`](/en-US/docs/Web/HTML/Reference/Elements/time) | ``` Used to format the date. For example: <time datetime="2020-05-24"> published on 23-05-2020</time>. ``` |
| Code format | [`<code>`](/en-US/docs/Web/HTML/Reference/Elements/code) | ``` This text is in normal format, but <code>this text is in code format</code>. ``` |
| Audio | [`<audio>`](/en-US/docs/Web/HTML/Reference/Elements/audio) | ``` <audio controls>   <source src="/shared-assets/audio/t-rex-roar.mp3" type="audio/mpeg" /> </audio> ``` |
| Video | [`<video>`](/en-US/docs/Web/HTML/Reference/Elements/video) | ``` <video controls width="250"   src="/shared-assets/videos/flower.webm" >   <a href="/shared-assets/videos/flower.webm">Download WebM video</a> </video> ``` |

## [Block elements](#block_elements)

"Block elements," on the other hand, take up the entire width of a webpage. They also take up a full line of a webpage; they do not fit together side-by-side. Instead, they stack like paragraphs in an essay or toy blocks in a tower.

**Note:**
Because this cheat sheet is limited to a few elements representing specific structures or having special semantics, the [`div`](/en-US/docs/Web/HTML/Reference/Elements/div) element is intentionally not included — because the `div` element doesn't represent anything and doesn't have any special semantics.

| Usage | Element | Example |
| --- | --- | --- |
| A simple paragraph | [`<p>`](/en-US/docs/Web/HTML/Reference/Elements/p) | ``` <p>I'm a paragraph</p> <p>I'm another paragraph</p> ``` |
| An extended quotation | [`<blockquote>`](/en-US/docs/Web/HTML/Reference/Elements/blockquote) | ``` They said: <blockquote>The blockquote element indicates an extended quotation.</blockquote> ``` |
| Additional information | [`<details>`](/en-US/docs/Web/HTML/Reference/Elements/details) | ``` <details>   <summary>HTML Cheat Sheet</summary>   <p>Inline elements</p>   <p>Block elements</p> </details> ``` |
| An unordered list | [`<ul>`](/en-US/docs/Web/HTML/Reference/Elements/ul) | ``` <ul>   <li>I'm an item</li>   <li>I'm another item</li> </ul> ``` |
| An ordered list | [`<ol>`](/en-US/docs/Web/HTML/Reference/Elements/ol) | ``` <ol>   <li>I'm the first item</li>   <li>I'm the second item</li> </ol> ``` |
| A definition list | [`<dl>`](/en-US/docs/Web/HTML/Reference/Elements/dl) | ``` <dl>   <dt>A Term</dt>   <dd>Definition of a term</dd>   <dt>Another Term</dt>   <dd>Definition of another term</dd> </dl> ``` |
| A horizontal rule | [`<hr>`](/en-US/docs/Web/HTML/Reference/Elements/hr) | ``` before<hr />after ``` |
| Text Heading | [<h1>-<h6>](/en-US/docs/Web/HTML/Reference/Elements/Heading_Elements) | ``` <h1> This is Heading 1 </h1> <h2> This is Heading 2 </h2> <h3> This is Heading 3 </h3> <h4> This is Heading 4 </h4> <h5> This is Heading 5 </h5> <h6> This is Heading 6 </h6> ``` |
