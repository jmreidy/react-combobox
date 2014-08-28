var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('Combobox', function () {
  var instance;
  var container = document.createElement('div');

  afterEach(function () {
    if (instance && instance.isMounted()) {
      React.unmountComponentAtNode(instance.getDOMNode().parent);
    }
  });

  describe('aria accessability', function () {
    it('marks the selected option as activedescendant');
    it('marks the autocomplete type on the input');
    it('marks the list toggle as hidden');
    it('marks the input as owning the option list');
    it('marks open lists with expanded=true');
    it('marks closed lists with expanded=false');
    it('marks the option container with role=listbox');
    it('marks the input with role=combobox');
  });


});
