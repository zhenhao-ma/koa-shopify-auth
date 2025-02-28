'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var tslib_1 = require('tslib');
var shopify_api_1 = tslib_1.__importDefault(require('@shopify/shopify-api'));
var fs_1 = tslib_1.__importDefault(require('fs'));
var path_1 = tslib_1.__importDefault(require('path'));
var polaris_css_1 = tslib_1.__importDefault(require('./client/polaris-css'));
var itp_helper_1 = tslib_1.__importDefault(require('./client/itp-helper'));
var request_storage_access_1 = tslib_1.__importDefault(
  require('./client/request-storage-access'),
);
var storage_access_helper_1 = tslib_1.__importDefault(
  require('./client/storage-access-helper'),
);
var errors_1 = tslib_1.__importDefault(require('./errors'));
var HEADING = 'This app needs access to your browser data';
var BODY =
  'Your browser is blocking this app from accessing your data. To continue using this app, click Continue, then click Allow if the browser prompts you.';
var ACTION = 'Continue';
var APP_BRIDGE_SCRIPT = fs_1.default.readFileSync(
  path_1.default.resolve(''.concat(__dirname, '/../app-bridge-2.0.12.js')),
);
function createRequestStorageAccess(_a) {
  var prefix = _a.prefix;
  return function requestStorage(ctx) {
    var query = ctx.query;
    var shop = query.shop;
    var host = query.host;
    if (shop == null) {
      ctx.throw(400, errors_1.default.ShopParamMissing);
      return;
    }
    ctx.body =
      '\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="utf-8" />\n  <style>\n    '
        .concat(
          polaris_css_1.default,
          '\n  </style>\n  <base target="_top">\n  <title>Redirecting\u2026</title>\n\n  <script>',
        )
        .concat(
          APP_BRIDGE_SCRIPT,
          '</script>\n  <script>\n    window.apiKey = "',
        )
        .concat(
          shopify_api_1.default.Context.API_KEY,
          '";\n    window.host = "',
        )
        .concat(host, '";\n    window.shopOrigin = "https://')
        .concat(encodeURIComponent(shop), '";\n    ')
        .concat(itp_helper_1.default, '\n    ')
        .concat(storage_access_helper_1.default, '\n    ')
        .concat(
          (0, request_storage_access_1.default)(shop, host, prefix),
          '\n  </script>\n</head>\n<body>\n  <main id="RequestStorageAccess">\n    <div class="Polaris-Page">\n      <div class="Polaris-Page__Content">\n        <div class="Polaris-Layout">\n          <div class="Polaris-Layout__Section">\n            <div class="Polaris-Stack Polaris-Stack--vertical">\n              <div class="Polaris-Stack__Item">\n                <div class="Polaris-Card">\n                  <div class="Polaris-Card__Header">\n                    <h1 class="Polaris-Heading">',
        )
        .concat(
          HEADING,
          '</h1>\n                  </div>\n                  <div class="Polaris-Card__Section">\n                    <p>',
        )
        .concat(
          BODY,
          '</p>\n                  </div>\n                </div>\n              </div>\n              <div class="Polaris-Stack__Item">\n                <div class="Polaris-Stack Polaris-Stack--distributionTrailing">\n                  <div class="Polaris-Stack__Item">\n                    <button type="button" class="Polaris-Button Polaris-Button--primary" id="TriggerAllowCookiesPrompt">\n                      <span class="Polaris-Button__Content"><span>',
        )
        .concat(
          ACTION,
          '</span></span>\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </main>\n</body>\n</html>',
        );
  };
}
exports.default = createRequestStorageAccess;
