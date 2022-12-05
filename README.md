# TCtooltip
TCtooltip is a simple, customizable, pure javascript tooltip plugin that works with any javascript code.

[View the example page here.](https://htmlpreview.github.io/?https://github.com/kevinahmadi/tctooltip/blob/main/example/index.html)

### Features
TCTooltip is lightweight and requires no additional frameworks or libraries.

The tooltip can be attached to any direction around the element, or can open in the classic method of hovering over an element.

TCTooltip also has some animations to enhance your tooltip-ing by fading and sliding into place.

Look below on how to initiate and how to customize.

### Initiating

To initiate, include the JS file into the `<head>` of your page.
  ```
  <script type="text/javascript" src="tctooltip.min.js"></script>
  ```
Then call the function.
  ```
  tctooltip();
  ```
Finally, add the trigger class (*default: tooltip*) to any element with a `title` attribute.
  ```
  <div class="image tooltip" title="This is information about the image!"></div>
  ```
  
### Customizing
The tooltip element contains two `<div>` elements: an outer transparent layer to provide a buffer between the element and the title content, and the inner layer that contains the text. The CSS for each element can be customized with the following:
```
tooltip({
  cssOuter = {  // outer, transparent layer
    // css goes here
  }
  cssInner = {  // inner, visible content layer
    // css goes here
  }
})
```

#### Outer Layer (transparent layer) Default CSS
```
tooltip({
  cssOuter : {
    padding:'3px',
    'background-color':'transparent',
    'z-index':1000,
    opacity:'0',
    display:'inline-block',
    position:'absolute'
  }
})
```

#### Inner Layer (visible layer) Default CSS
```
tooltip({
  cssInner : {
    padding:'8px',
    'background-color':'#000',
    color:'#fff',
    'font-size':'12px',
    'font-family':'arial, sans-serif',
    'text-align':'left',
    'border-radius':'8px',
    opacity:'1',
    'box-sizing':'border-box',
    display:'inline-block',
    position:'relative',
    top:'0px',
    bottom:'0px',
    left:'0px',
    right:'0px'
  }
})
```

#### Options
All of the below options can be changed through the initiation function's object.
```
tctooltip({
  [option] : [value]
})
```

`trigger` string, the classname of the element(s) that the tooltip will call itself on.

 `default: 'tooltip'`
 
 ---

`container` string, the classname of the outer layer of the tooltip box. Only change this if there is a conflict with another element on your page.

`default: 'tctooltip-box'`

---

`content` string, the classname of the inner layer of the tooltip box. Again, only change if there is a conflict.

`default: 'tctooltip-content'`

---



`position` string, the position that the tooltip will attach itself to the element.

`default: *cursor*`

`available options: *above*, *below*, *left*, *right*, *cursor*`

---

`skew` string, if the tooltip is attached to the `above` or `below` position, the skew option will cause it to attach either to the center, the left side, or the right side of the element.

`default: *default*`

`available options: *left*, *right*, *default*`

---

`openDelay` integer, value determines how many miliseconds the cursor must hover over the element before it triggers the tooltip.

`default: 0`

---

`closeDelay` integer, value determines how many miliseconds the tooltip stays open when the cursor leaves the element before it closes.

`default: 0`

---


`effectSpeed` integer, how many miliseconds the `fade` and `slide` effects will take to resolve.

`default: 500`

---

`fade` boolean true/false, if true, the tooltip will fade in and out when triggered.

`default: true`

---

`slide` boolean true/false, if true, the tooltip will do a little slide animation to place itself when triggered.

`default: true`

---

`slideAmount` string, how many pixels the slide animation will travel.

`default: '6px'`

