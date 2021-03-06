"use strict";

var setup = require("./setup-base")
  , env = require('../../helpers/env')
  , exec = require('child_process').exec
  , fs = require('fs')
  , osType = require('os').type();


module.exports = function () {
  var tmp = osType === 'Windows_NT' ? 'C:\\Windows\\Temp' : '/tmp';
  var keystorePath = tmp + '/appiumtest.keystore';
  var keyAlias = 'appiumtest';
  var desired = {
    app: "sample-code/apps/selendroid-test-app.apk",
    appPackage: 'io.selendroid.testapp',
    appActivity: '.HomeScreenActivity',
    useKeystore: true,
    keystorePath: keystorePath,
    keyAlias: keyAlias
  };
  this.timeout(env.MOCHA_INIT_TIMEOUT);

  var driver;
  setup(this, desired).then(function (d) { driver = d; });

  it('should be able to launch an app with custom keystore', function (done) {
    fs.unlink(keystorePath, function (err) {
      if (err) return done(err);
      var cmd = 'keytool -genkey -v -keystore ' + keystorePath + ' -alias ' + keyAlias + ' -storepass android -keypass android -keyalg RSA -validity 14000';
      var child = exec(cmd, function (err) {
        if (err) return done(err);

        driver
          .getCurrentActivity()
            .should.eventually.include(desired.appActivity)
          .nodeify(done);
      });
      // answer the questions that `keytool` asks
      child.stdin.write('Appium Testsuite\nAppium\nTest\nSan Francisco\nCalifornia\nUS\nyes\n');
    });
  });
};
