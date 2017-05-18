import { AngularPluginPage } from './app.po';

describe('angular-plugin App', function() {
  let page: AngularPluginPage;

  beforeEach(() => {
    page = new AngularPluginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
