'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
exports.Error =
  exports.GRANTED_STORAGE_ACCESS_COOKIE_NAME =
  exports.TEST_COOKIE_NAME =
  exports.TOP_LEVEL_OAUTH_COOKIE_NAME =
  exports.DEFAULT_ACCESS_MODE =
    void 0;
var tslib_1 = require('tslib');
var cookie_options_1 = tslib_1.__importDefault(require('./cookie-options'));
var create_enable_cookies_1 = tslib_1.__importDefault(
  require('./create-enable-cookies'),
);
var create_top_level_oauth_redirect_1 = tslib_1.__importDefault(
  require('./create-top-level-oauth-redirect'),
);
var create_request_storage_access_1 = tslib_1.__importDefault(
  require('./create-request-storage-access'),
);
var set_user_agent_1 = tslib_1.__importDefault(require('./set-user-agent'));
var shopify_api_1 = tslib_1.__importDefault(require('@shopify/shopify-api'));
var DEFAULT_MYSHOPIFY_DOMAIN = 'myshopify.com';
exports.DEFAULT_ACCESS_MODE = 'online';
exports.TOP_LEVEL_OAUTH_COOKIE_NAME = 'shopifyTopLevelOAuth';
exports.TEST_COOKIE_NAME = 'shopifyTestCookie';
exports.GRANTED_STORAGE_ACCESS_COOKIE_NAME = 'shopify.granted_storage_access';
function hasCookieAccess(_a) {
  var cookies = _a.cookies;
  return Boolean(cookies.get(exports.TEST_COOKIE_NAME));
}
function grantedStorageAccess(_a) {
  var cookies = _a.cookies;
  return Boolean(cookies.get(exports.GRANTED_STORAGE_ACCESS_COOKIE_NAME));
}
function shouldPerformInlineOAuth(_a) {
  var cookies = _a.cookies;
  return Boolean(cookies.get(exports.TOP_LEVEL_OAUTH_COOKIE_NAME));
}
function createShopifyAuth(options) {
  var config = tslib_1.__assign(
    {
      prefix: '',
      myShopifyDomain: DEFAULT_MYSHOPIFY_DOMAIN,
      accessMode: exports.DEFAULT_ACCESS_MODE,
    },
    options,
  );
  var prefix = config.prefix;
  var oAuthStartPath = ''.concat(prefix, '/auth');
  var oAuthCallbackPath = ''.concat(oAuthStartPath, '/callback');
  var inlineOAuthPath = ''.concat(prefix, '/auth/inline');
  var topLevelOAuthRedirect = (0, create_top_level_oauth_redirect_1.default)(
    shopify_api_1.default.Context.API_KEY,
    inlineOAuthPath,
  );
  var enableCookiesPath = ''.concat(oAuthStartPath, '/enable_cookies');
  var enableCookies = (0, create_enable_cookies_1.default)(config);
  var requestStorageAccess = (0, create_request_storage_access_1.default)(
    config,
  );
  (0, set_user_agent_1.default)();
  return function shopifyAuth(ctx, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var shop, redirectUrl, authQuery, _a, e_1;
      return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            ctx.cookies.secure = true;
            if (
              !(
                ctx.path === oAuthStartPath &&
                !hasCookieAccess(ctx) &&
                !grantedStorageAccess(ctx)
              )
            )
              return [3 /*break*/, 2];
            return [4 /*yield*/, requestStorageAccess(ctx)];
          case 1:
            _b.sent();
            return [2 /*return*/];
          case 2:
            if (
              !(
                ctx.path === inlineOAuthPath ||
                (ctx.path === oAuthStartPath && shouldPerformInlineOAuth(ctx))
              )
            )
              return [3 /*break*/, 4];
            shop = ctx.query.shop;
            if (shop == null) {
              ctx.throw(400);
            }
            ctx.cookies.set(
              exports.TOP_LEVEL_OAUTH_COOKIE_NAME,
              '',
              (0, cookie_options_1.default)(ctx),
            );
            return [
              4 /*yield*/,
              shopify_api_1.default.Auth.beginAuth(
                ctx.req,
                ctx.res,
                shop,
                oAuthCallbackPath,
                config.accessMode === 'online',
              ),
            ];
          case 3:
            redirectUrl = _b.sent();
            ctx.redirect(redirectUrl);
            return [2 /*return*/];
          case 4:
            if (!(ctx.path === oAuthStartPath)) return [3 /*break*/, 6];
            return [4 /*yield*/, topLevelOAuthRedirect(ctx)];
          case 5:
            _b.sent();
            return [2 /*return*/];
          case 6:
            if (!(ctx.path === oAuthCallbackPath)) return [3 /*break*/, 13];
            _b.label = 7;
          case 7:
            _b.trys.push([7, 11, , 12]);
            authQuery = {
              code: ctx.query.code,
              shop: ctx.query.shop,
              host: ctx.query.host,
              state: ctx.query.state,
              timestamp: ctx.query.timestamp,
              hmac: ctx.query.hmac,
            };
            _a = ctx.state;
            return [
              4 /*yield*/,
              shopify_api_1.default.Auth.validateAuthCallback(
                ctx.req,
                ctx.res,
                authQuery,
              ),
            ];
          case 8:
            _a.shopify = _b.sent();
            if (!config.afterAuth) return [3 /*break*/, 10];
            return [4 /*yield*/, config.afterAuth(ctx)];
          case 9:
            _b.sent();
            _b.label = 10;
          case 10:
            return [3 /*break*/, 12];
          case 11:
            e_1 = _b.sent();
            switch (true) {
              case e_1 instanceof
                shopify_api_1.default.Errors.InvalidOAuthError:
                ctx.throw(400, e_1.message);
                break;
              case e_1 instanceof shopify_api_1.default.Errors.CookieNotFound:
              case e_1 instanceof shopify_api_1.default.Errors.SessionNotFound:
                // This is likely because the OAuth session cookie expired before the merchant approved the request
                ctx.redirect(
                  ''.concat(oAuthStartPath, '?shop=').concat(ctx.query.shop),
                );
                break;
              default:
                ctx.throw(500, e_1.message);
                break;
            }
            return [3 /*break*/, 12];
          case 12:
            return [2 /*return*/];
          case 13:
            if (!(ctx.path === enableCookiesPath)) return [3 /*break*/, 15];
            return [4 /*yield*/, enableCookies(ctx)];
          case 14:
            _b.sent();
            return [2 /*return*/];
          case 15:
            return [4 /*yield*/, next()];
          case 16:
            _b.sent();
            return [2 /*return*/];
        }
      });
    });
  };
}
exports.default = createShopifyAuth;
var errors_1 = require('./errors');
Object.defineProperty(exports, 'Error', {
  enumerable: true,
  get: function () {
    return tslib_1.__importDefault(errors_1).default;
  },
});
