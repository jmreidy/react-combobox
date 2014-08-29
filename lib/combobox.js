/** @jsx React.DOM */

var React = require('react/addons');
var cloneWithProps = React.addons.cloneWithProps;
var guid = 0;
var k = function(){};
var addClass = require('./add-class');
var ComboboxOption = require('./option');

var Combobox = React.createClass({

  propTypes: {

    /**
     * Defaults to 'both'. 'inline' will autocomplete the first matched Option
     * into the input value, 'list' will display a list of choices, and of
     * course, both does both.
    */
    autocomplete: React.PropTypes.oneOf(['both', 'inline', 'list']),

    /**
     * Called when the combobox receives user input, this is your chance to
     * filter the data and rerender the options.
     *
     * Signature:
     *
     * ```js
     * function(userInput){}
     * ```
    */
    onInput: React.PropTypes.func,

    /**
     * Called when the combobox receives a selection. You probably want to reset
     * the options to the full list at this point.
     *
     * Signature:
     *
     * ```js
     * function(selectedValue){}
     * ```
    */
    onSelect: React.PropTypes.func,

    /**
     * The initial value of the component.
    */
    value: React.PropTypes.any
  },

  getDefaultProps: function() {
    return {
      autocomplete: 'both',
      onInput: k,
      onSelect: k,
      value: null
    };
  },

  getInitialState: function() {
    return {
      value: this.props.value,
      inputValue: null,
      isOpen: false,
      focusedIndex: null,
      matchedAutocompleteOption: null,
      // this prevents crazy jumpiness since we focus options on mouseenter
      usingKeyboard: false,
      activedescendant: null,
      listId: 'rf-combobox-list-'+(++guid),
      selectionRange: null
    };
  },

  componentWillMount: function() {
    var props = this.processChildren(this.props);
    this.props.ariaChildren = props.children;
    this.setState({
      isEmpty: props.isEmpty,
      inputValue: props.inputValue
    });
  },

  componentWillReceiveProps: function(newProps) {
    var props = this.processChildren(newProps);
    newProps.ariaChildren = props.children;
    var newState = {
      isEmpty: props.isEmpty,
    };
    if (newProps.value !== this.props.value) {
      newState.inputValue = props.inputValue;
    }
    this.setState(newState);
  },

  componentDidUpdate: function() {
    var input = this.refs.input.getDOMNode();
    if (this.state.selectionRange) {
      input.setSelectionRange(this.state.selectionRange[0], this.state.selectionRange[1]);
    }
  },

  getClassName: function() {
    var className = addClass(this.props.className, 'rf-combobox');
    if (this.state.isOpen)
      className = addClass(className, 'rf-combobox-is-open');
    return className;
  },

  /**
   * When the user begins typing again we need to clear out any state that has
   * to do with an existing or potential selection.
  */
  clearSelectedState: function(cb) {
    this.setState({
      focusedIndex: null,
      inputValue: null,
      value: null,
      matchedAutocompleteOption: null,
      activedescendant: null
    }, cb);
  },

  handleInputChange: function(event) {
    var value = this.refs.input.getDOMNode().value;
    this.clearSelectedState(function() {
      this.props.onInput(value);
      if (!this.state.isOpen)
        this.showList();
    }.bind(this));
  },

  handleInputBlur: function() {
    var focusedAnOption = this.state.focusedIndex != null;
    if (focusedAnOption)
      return;
    this.maybeSelectAutocompletedOption();
    this.hideList();
  },

  handleOptionBlur: function() {
    // don't want to hide the list if we focused another option
    this.blurTimer = setTimeout(this.hideList, 0);
  },

  handleOptionFocus: function() {
    // see `handleOptionBlur`
    clearTimeout(this.blurTimer);
  },

  handleInputKeyUp: function(event) {
    if (
      this.state.isEmpty ||
      event.keyCode === 8 /*backspace*/ ||
      !this.props.autocomplete.match(/both|inline/)
    ) return;
    this.autocompleteInputValue();
  },

  /**
   * Autocompletes the input value with a matching label of the first
   * ComboboxOption in the list and selects only the fragment that has
   * been added, allowing the user to keep typing naturally.
  */
  autocompleteInputValue: function() {
    if (
      this.props.autocomplete == false ||
      this.props.children.length === 0
    ) return;
    var input = this.refs.input.getDOMNode();
    var inputValue = input.value;
    var firstChild = this.props.children.length ?
      this.props.children[0] :
      this.props.children;
    var label = getLabel(firstChild);
    var fragment = matchFragment(inputValue, label);

    if (!fragment) {
      this.setState({
        selectionRange: null
      });
    }
    else {
      this.setState({
        inputValue: label,
        matchedAutocompleteOption: firstChild,
        selectionRange: [inputValue.length, label.length]
      });
    }
  },

  handleButtonClick: function() {
    this.state.isOpen ? this.hideList() : this.showList();
    this.focusInput();
  },

  showList: function() {
    if (this.props.autocomplete.match(/both|list/))
      this.setState({isOpen: true});
  },

  hideList: function() {
    this.setState({isOpen: false});
  },

  hideOnEscape: function() {
    this.hideList();
    this.focusInput();
  },

  focusInput: function() {
    this.refs.input.getDOMNode().focus();
  },

  selectInput: function() {
    var input = this.refs.input.getDOMNode();
    input.select();
  },

  inputKeydownMap: {
    38: 'focusPrevious',
    40: 'focusNext',
    27: 'hideOnEscape',
    13: 'selectOnEnter'
  },

  optionKeydownMap: {
    38: 'focusPrevious',
    40: 'focusNext',
    13: 'selectOption',
    27: 'hideOnEscape'
  },

  handleKeydown: function(event) {
    var handlerName = this.inputKeydownMap[event.keyCode];
    if (!handlerName)
      return
    event.preventDefault();
    this.setState({usingKeyboard: true});
    this[handlerName].call(this);
  },

  handleOptionKeyDown: function(child, event) {
    var handlerName = this.optionKeydownMap[event.keyCode];
    if (!handlerName) {
      // if the user starts typing again while focused on an option, move focus
      // to the input, select so it wipes out any existing value
      this.selectInput();
      return;
    }
    event.preventDefault();
    this.setState({usingKeyboard: true});
    this[handlerName].call(this, child);
  },

  handleOptionMouseEnter: function(index) {
    if (this.state.usingKeyboard)
      this.setState({usingKeyboard: false});
    else
      this.focusOptionAtIndex(index);
  },

  selectOnEnter: function() {
    this.maybeSelectAutocompletedOption();
    this.refs.input.getDOMNode().select();
  },

  maybeSelectAutocompletedOption: function() {
    if (!this.state.matchedAutocompleteOption)
      return;
    this.selectOption(this.state.matchedAutocompleteOption, {focus: false});
  },

  selectOption: function(child, options) {
    options = options || {};
    this.setState({
      value: child.props.value,
      inputValue: getLabel(child),
      matchedAutocompleteOption: null,
      selectionRange: null
    }, function() {
      this.props.onSelect(child.props.value, child);
      this.hideList();
      if (options.focus !== false)
        this.selectInput();
      var input = this.refs.input.getDOMNode();
      input.setSelectionRange(input.value.length, input.value.length);
    }.bind(this));
  },

  focusNext: function() {
    if (this.state.isEmpty) return;
    var index = this.state.focusedIndex == null ?
      0 : this.state.focusedIndex + 1;
    this.focusOptionAtIndex(index);
  },

  focusPrevious: function() {
    if (this.state.isEmpty) return;
    var last = this.props.children.length - 1;
    var index = this.state.focusedIndex == null ?
      last : this.state.focusedIndex - 1;
    this.focusOptionAtIndex(index);
  },

  focusSelectedOption: function() {
    var selectedIndex;
    React.Children.forEach(this.props.children, function(child, index) {
      if (child.props.value === this.state.value)
        selectedIndex = index;
    }.bind(this));
    this.showList();
    this.setState({
      focusedIndex: selectedIndex
    }, this.focusOption);
  },

  focusOptionAtIndex: function(index) {
    if (!this.state.isOpen && this.state.value)
      return this.focusSelectedOption();
    this.showList();
    var length = this.props.children.length;
    if (index === -1)
      index = length - 1;
    else if (index === length)
      index = 0;
    this.setState({
      focusedIndex: index
    }, this.focusOption);
  },

  focusOption: function() {
    var index = this.state.focusedIndex;
    this.refs.list.getDOMNode().childNodes[index].focus();
  },

  processChildren: function (props) {
    var value = props.value;
    var isEmpty = true;
    var inputValue;
    var children = React.Children.map(props.children, function(child, index) {
      if (child.type === ComboboxOption.type) {
        isEmpty = false;
        var selectedItem = (value === child.props.value);
        if (selectedItem) { inputValue = getLabel(child); }
        return cloneWithProps(child, {
          // need an ID for WAI-ARIA
          id: child.props.id || 'rf-combobox-selected-'+(++guid),
          isSelected: selectedItem,
          onBlur: this.handleOptionBlur,
          onClick: this.selectOption.bind(this, child),
          onFocus: this.handleOptionFocus,
          onKeyDown: this.handleOptionKeyDown.bind(this, child),
          onMouseEnter: this.handleOptionMouseEnter.bind(this, index),
        });
      }
      else {
        return child;
      }
    }, this);

    return {
      children: children,
      isEmpty: isEmpty,
      inputValue: inputValue
    };
  },

  render: function() {
    return (
      <div className={this.getClassName()}>
        <input
          ref="input"
          className="rf-combobox-input"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputBlur}
          onKeyDown={this.handleKeydown}
          onKeyUp={this.handleInputKeyUp}
          role="combobox"
          aria-activedescendant={this.state.activedescendant}
          aria-autocomplete={this.props.autocomplete}
          aria-owns={this.state.listId}
        />
        <span
          aria-hidden="true"
          className="rf-combobox-button"
          onClick={this.handleButtonClick}
        >▾</span>
        <div
          id={this.state.listId}
          ref="list"
          className="rf-combobox-list"
          aria-expanded={this.state.isOpen+''}
          role="listbox"
        >{this.props.ariaChildren}</div>
      </div>
    );
  }
});

function getLabel(component) {
  var hasLabel = component.props.label != null;
  return hasLabel ? component.props.label : component.props.children;
}

function matchFragment(userInput, firstChildLabel) {
  userInput = userInput.toLowerCase();
  firstChildLabel = firstChildLabel.toLowerCase();
  var exactMatch = (userInput === firstChildLabel);
  if (userInput === '' || exactMatch)
    return false;
  if (firstChildLabel.toLowerCase().indexOf(userInput.toLowerCase()) === -1)
    return false;
  return true;
}

module.exports = Combobox;
