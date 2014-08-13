/** @jsx React.DOM */

var Option = require('../lib/option');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('Option', function () {
  var optionDiv;

  beforeEach(function () {
    optionDiv = TestUtils.renderIntoDocument(
      Option({
        value: 'Value'
      }))
      .getDOMNode();
  });

  it('renders a div', function () {
    expect(optionDiv.tagName).to.equal('DIV');
  });

  it('sets a role of "option"', function () {
    expect(optionDiv.getAttribute('role')).to.equal('option');
  });

  it('sets a tabIndex of -1', function () {
    expect(optionDiv.tabIndex).to.equal(-1);
  });
});
