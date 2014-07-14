// Captive Portal Test

'use strict';

requireApp('system/test/unit/mock_chrome_event.js');
requireApp('system/test/unit/mock_app.js');
requireApp('system/test/unit/mocks_helper.js');
require('/shared/test/unit/mocks/mock_l10n.js');
requireApp('system/shared/test/unit/mocks/mock_settings_listener.js');
requireApp('system/shared/test/unit/mocks/mock_navigator_moz_settings.js');
requireApp('system/test/unit/mock_wifi_manager.js');
requireApp('system/test/unit/mock_activity.js');
requireApp('system/test/unit/mock_notification_screen.js');
requireApp('system/test/unit/mock_app_window_manager.js');

requireApp('system/js/browser_frame.js');
requireApp('system/js/entry_sheet.js');
requireApp('system/js/captive_portal.js');
requireApp('system/js/ftu_launcher.js');

var mocksForCaptivePortal = new MocksHelper([
  'SettingsListener',
  'NotificationScreen',
  'AppWindowManager'
]).init();

suite('captive portal > ', function() {
  var realWifiManager;
  var realL10n;
  var realSettings;
  var realActivity;
  var mocksHelper;
  var timeout = 10;
  var subject;
  var event;
  var successEvent;
  var abortEvent;
  var fakeScreenNode;

  mocksForCaptivePortal.attachTestHelpers();
  suiteSetup(function() {
    realWifiManager = navigator.mozWifiManager;
    navigator.mozWifiManager = MockWifiManager;
    realSettings = navigator.mozSettings;
    navigator.mozSettings = MockNavigatorSettings;
    realL10n = navigator.mozL10n;
    navigator.mozL10n = MockL10n;
    try {
      realActivity = window.MozActivity;
    } catch (e) {
      console.log('Access MozActivity failed, passed realActivity assignment');
    }
    window.MozActivity = MockMozActivity;

    fakeScreenNode = document.createElement('div');
    fakeScreenNode.id = 'screen';
    document.body.appendChild(fakeScreenNode);
  });

  suiteTeardown(function() {
    navigator.mozWifiManager = realWifiManager;
    try {
      window.MozActivity = realActivity;
    } catch (e) {
      console.log('Access MozActivity failed, passed MozActivity assignment');
    }
    navigator.mozL10n = realL10n;
    navigator.mozSettings = realSettings;
    document.body.appendChild(fakeScreenNode);
  });

  setup(function() {
    event = new MockChromeEvent({
      type: 'captive-portal-login',
      url: 'http://developer.mozilla.org',
      id: 0
    });

    successEvent = new MockChromeEvent({
      type: 'captive-portal-login-success',
      url: 'http://developer.mozilla.org',
      id: 0
    });

    abortEvent = new MockChromeEvent({
      type: 'captive-portal-login-abort',
      url: 'http://developer.mozilla.org',
      id: 0
    });

    CaptivePortal.init();
  });

  test('system/captive portal login', function() {
    CaptivePortal.handleEvent(event);
    assert.ok(MockNotificationScreen.wasMethodCalled['addNotification']);
  });

  test('system/captive portal login success', function() {
    CaptivePortal.handleEvent(successEvent);
    assert.ok(MockNotificationScreen.wasMethodCalled['removeNotification']);
  });

  test('system/captive portal login again', function() {
    CaptivePortal.handleEvent(event);
    assert.ok(MockNotificationScreen.wasMethodCalled['addNotification']);
  });

  test('system/captive portal login abort', function() {
    CaptivePortal.handleEvent(abortEvent);
    assert.ok(MockNotificationScreen.wasMethodCalled['removeNotification']);
  });

  test('system/captive portal while FTU running..', function() {
    FtuLauncher._isRunningFirstTime = true;

    CaptivePortal.handleEvent(event);
    assert.equal(CaptivePortal.hasOwnProperty('entrySheet'), true);
  });

  teardown(function() {
    FtuLauncher._isRunningFirstTime = false;
  });
});
