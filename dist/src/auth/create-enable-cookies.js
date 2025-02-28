'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var tslib_1 = require('tslib');
var shopify_api_1 = tslib_1.__importDefault(require('@shopify/shopify-api'));
var polaris_css_1 = tslib_1.__importDefault(require('./client/polaris-css'));
var itp_helper_1 = tslib_1.__importDefault(require('./client/itp-helper'));
var top_level_interaction_1 = tslib_1.__importDefault(
  require('./client/top-level-interaction'),
);
var errors_1 = tslib_1.__importDefault(require('./errors'));
var HEADING = 'Enable cookies';
var BODY =
  'You must manually enable cookies in this browser in order to use this app within Shopify.';
var FOOTER =
  'Cookies let the app authenticate you by temporarily storing your preferences and personal\ninformation. They expire after 30 days.';
var ACTION = 'Enable cookies';
function createEnableCookies(_a) {
  var prefix = _a.prefix;
  return function enableCookies(ctx) {
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
          '\n  </style>\n  <base target="_top">\n  <title>Redirecting\u2026</title>\n\n  <script>\n    window.apiKey = "',
        )
        .concat(
          shopify_api_1.default.Context.API_KEY,
          '";\n    window.host = "',
        )
        .concat(host, '";\n    window.shopOrigin = "https://')
        .concat(encodeURIComponent(shop), '";\n\n    ')
        .concat(itp_helper_1.default, '\n    ')
        .concat(
          (0, top_level_interaction_1.default)(shop, host, prefix),
          '\n  </script>\n</head>\n<body>\n  <main id="TopLevelInteractionContent">\n    <div class="Polaris-Page">\n      <div class="Polaris-Page__Content">\n        <div class="Polaris-Layout">\n          <div class="Polaris-Layout__Section">\n            <div class="Polaris-Stack Polaris-Stack--vertical">\n              <div class="Polaris-Stack__Item">\n                <div class="Polaris-Card">\n                  <div class="Polaris-Card__Header">\n                    <h1 class="Polaris-Heading">',
        )
        .concat(
          HEADING,
          '</h1>\n                  </div>\n                  <div class="Polaris-Card__Section">\n                    <p>',
        )
        .concat(
          BODY,
          '</p>\n                  </div>\n                  <div class="Polaris-Card__Section Polaris-Card__Section--subdued">\n                    <p>',
        )
        .concat(
          FOOTER,
          '</p>\n                  </div>\n                </div>\n              </div>\n              <div class="Polaris-Stack__Item">\n                <div class="Polaris-Stack Polaris-Stack--distributionTrailing">\n                  <div class="Polaris-Stack__Item">\n                    <button type="button" class="Polaris-Button Polaris-Button--primary" id="TopLevelInteractionButton">\n                      <span class="Polaris-Button__Content"><span>',
        )
        .concat(
          ACTION,
          '</span></span>\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </main>\n</body>\n</html>',
        );
  };
}
exports.default = createEnableCookies;
