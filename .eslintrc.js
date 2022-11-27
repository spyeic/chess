module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: "standard-with-typescript",
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    rules: {
        quotes: [2, "double"],
        indent: [2, 4],
        semi: [2, "always"],
        "space-before-function-paren": [2, "never"],
        "no-unused-vars": [1, { vars: "all", args: "after-used" }],
        "no-trailing-spaces": [2, { skipBlankLines: true }]
    }
};
