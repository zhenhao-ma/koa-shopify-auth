'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
// Copied from https://github.com/Shopify/shopify_app
var topLevelInteraction = function (shop, host, prefix) {
  if (prefix === void 0) {
    prefix = '';
  }
  return '(function() {\n      function setUpTopLevelInteraction() {\n        var TopLevelInteraction = new ITPHelper({\n          redirectUrl: "'
    .concat(prefix, '/auth?shop=')
    .concat(encodeURIComponent(shop), '&host=')
    .concat(
      host,
      '",\n        });\n\n        TopLevelInteraction.execute();\n      }\n\n      document.addEventListener("DOMContentLoaded", setUpTopLevelInteraction);\n    })();',
    );
};
exports.default = topLevelInteraction;
