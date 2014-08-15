var proxyquire = require('proxyquireify')(require);
describe('Combobox', function () {
  var instance, stubOption;
  beforeEach(function () {
    stubOption = sinon.stub();
    // instance = require('../lib/combobox', {
    //   substitutions: {
    //     './Option': stubOption
    //   }
    // });
    instance=proxyquire('../lib/combobox', {
      './option': stubOption
    });
  });

  it('works', function () {
    expect(instance.Option).to.equal(stubOption);
  });
});
