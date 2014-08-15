[![NPM version](https://badge.fury.io/js/react-combobox.svg)](http://badge.fury.io/js/react-combobox) [![Build Status](https://travis-ci.org/jmreidy/react-combobox.svg?branch=master)](https://travis-ci.org/jmreidy/react-combobox) [![Sauce Test Status](https://saucelabs.com/buildstatus/rzrsharp_oss)](https://saucelabs.com/u/rzrsharp_oss) [![david-dm-status-badge](https://david-dm.org/jmreidy/react-combobox.svg)](https://david-dm.org/jmreidy/react-combobox#info=dependencies&view=table)
 [![david-dm-status-badge](https://david-dm.org/jmreidy/react-combobox/dev-status.svg)](https://david-dm.org/jmreidy/react-combobox#info=devDependencies&view=table)
react-autocomplete (combobox)
=============================

[WAI-ARIA][wai-aria] accessible [React][react] autocomplete component (combobox).

This implementation is almost entirely derived from [rpflorence/react-autocomplete](https://github.com/rpflorence/react-autocomplete), but has
changed enough to earn its own repo. But it's totally a WIP and shouldn't be used for production yet.

Installation
------------

`npm install react-combobox`

WIP
---

This is not production ready, but I welcome use-cases opened in the
issues :)

Demo
----

http://rackt.github.io/react-autocomplete/example/

Usage
-----

```js
var Autocomplete = require('react-autocomplete');

// its actually called a combobox, but noboby searches for that
var Combobox = Autocomplete.Combobox;
var Option = Autocomplete.Option;

var comboboxinItUp = (

  // Just like <select><option/></select>, this component is a
  // composite component. This gives you complete control over
  // What is displayed inside the <Option>s as well as allowing
  // you to render whatever you want inside, like a "no results"
  // message that isn't interactive like the <Options> are.

  // Start with the <Combobox/> and give it some handlers.

  <Combobox
    onInput={handleInput}
    onSelect={handleSelect}
    autocomplete="both"
  >

    // `onInput` is called when the user is typing, it gets passed the
    // value from the input. This is your chance to filter the Options
    // and redraw. More realistically, you'd make a request to get data
    // and then redraw when it lands.
    //
    // `onSelect` is called when the user makes a selection, you probably
    // want to reset the Options to your full dataset again, or maybe
    // deal with the value and then clear it out if this is used to
    // populate a list.
    //
    // `autocomplete` defaults to 'both'. 'inline' will autocomplete the
    // first matched Option into the input value, 'list' will display a
    // list of choices, and of course, both does both.

    // When this option is selected, `onSelect` will be called with the
    // value `"foo"`.
    <Option value="foo">Foo</Option>

    // `label` is the text to display in the input when the Option is
    // selected. It defaults to the content of the Option just like a
    // real <option>. (Maybe the value should too, now that I'm writing
    // this, but it doesn't yet)
    <Option value="bar" label="not bar at all">Bar</Option>
  </Combobox>
);
```

This is not realistic code, check out the examples directory for a real
implementation.

  [wai-aria]:http://www.w3.org/TR/wai-aria/roles#combobox
  [react]:http://facebook.github.io/react/

