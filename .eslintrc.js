// Credit to TheJaredWilcurt for his ESLint RC suggestions
module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "comma-dangle":                ["error", "never"],
        "comma-spacing":               ["error", { "before": false, "after": true }],
        "comma-style":                 ["error", "last"],
        "curly":                       ["error"],
        "indent":                      ["error", 4, { "SwitchCase": 1 }],
        "linebreak-style":             ["error", "unix"],
        "no-multi-spaces":             ["error"],
        "one-var":                     ["error", "never"],
        "quotes":                      ["error", "single"],
        "semi":                        ["error", "always"],
        "space-before-function-paren": ["error", "always"],
        "space-in-parens":             ["error", "never"],
        "space-infix-ops":             ["error"],
        "spaced-comment":              ["error", "always"]
    }
};