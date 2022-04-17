'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
// Copied from https://github.com/Shopify/shopify_app
var requestStorageAccess = function (shop, host, prefix) {
  if (prefix === void 0) {
    prefix = '';
  }
  return '(function() {\n      function redirect() {\n        var targetInfo = {\n          myshopifyUrl: "https://'
    .concat(encodeURIComponent(shop), '",\n          hasStorageAccessUrl: "')
    .concat(prefix, '/auth/inline?shop=')
    .concat(encodeURIComponent(shop), '&host=')
    .concat(host, '",\n          doesNotHaveStorageAccessUrl: "')
    .concat(prefix, '/auth/enable_cookies?shop=')
    .concat(encodeURIComponent(shop), '&host=')
    .concat(host, '",\n          appTargetUrl: "')
    .concat(prefix, '/?shop=')
    .concat(encodeURIComponent(shop), '&host=')
    .concat(
      host,
      '"\n        }\n\n        if (window.top == window.self) {\n          // If the current window is the \'parent\', change the URL by setting location.href\n          window.top.location.href = targetInfo.hasStorageAccessUrl;\n        } else {\n          var storageAccessHelper = new StorageAccessHelper(targetInfo);\n          storageAccessHelper.execute();\n        }\n      }\n\n      document.addEventListener("DOMContentLoaded", redirect);\n    })();',
    );
};
exports.default = requestStorageAccess;
