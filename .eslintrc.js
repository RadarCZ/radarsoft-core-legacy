module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript"
    ],
    "ignorePatterns": [],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
		"@typescript-eslint/tslint",
		"prefer-arrow"
    ],
    "rules": {
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "import/no-unresolved": [
            2,
            {
                "commonjs": true,
                "amd": true,
                "caseSensitive": true
            }
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single"
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/unified-signatures": "error",
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "comma-dangle": "off",
        "complexity": "off",
        "constructor-super": "error",
        "dot-notation": "off",
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": [
            "error",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined",
            "undefined"
        ],
        "id-match": "error",
        "import/order": [
			"error",
			{
				"alphabetize": {
					"order": "asc",
					"caseInsensitive": true
				},
				"newlines-between": "always"
			}
		],
        "max-classes-per-file": [
            "error",
            1
        ],
        "new-parens": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": "off",
        "no-debugger": "error",
        "no-empty": "error",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "error",
        "no-unsafe-finally": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "object-shorthand": "error",
        "one-var": [
            "error",
            "never"
        ],
        "padding-line-between-statements": [
            "error",
            {
                "blankLine": "always",
                "prev": "*",
                "next": "return"
            }
        ],
        "prefer-arrow/prefer-arrow-functions": "error",
        "quote-props": [
            "error",
            "always"
        ],
        "radix": "error",
        "spaced-comment": "error",
        "use-isnan": "error",
        "valid-typeof": "off",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "jsdoc-format": true,
                    "no-reference-import": true,
                    "one-line": true,
                    "whitespace": true
                }
            }
        ],
        "import/no-named-as-default": [
            1
        ],
        "import/no-named-as-default-member": [
            1
        ],
        "import/no-duplicates": [
            1
        ],
        "import/named": [
            2
        ],
        "import/namespace": [
            2
        ],
        "import/default": [
            2
        ],
        "import/export": [
            2
        ],
        "@typescript-eslint/await-thenable": [
            "error"
        ],
        "@typescript-eslint/no-for-in-array": [
            "error"
        ],
        "@typescript-eslint/no-misused-promises": [
            "error"
        ],
        "@typescript-eslint/no-unnecessary-type-assertion": [
            "error"
        ],
        "@typescript-eslint/prefer-includes": [
            "error"
        ],
        "@typescript-eslint/prefer-regexp-exec": [
            "error"
        ],
        "@typescript-eslint/prefer-string-starts-ends-with": [
            "error"
        ],
        "require-await": [
            "off"
        ],
        "@typescript-eslint/require-await": [
            "error"
        ],
        "@typescript-eslint/unbound-method": [
            "error"
        ],
        "no-var": [
            "error"
        ],
        "prefer-const": [
            "error"
        ],
        "prefer-rest-params": [
            "error"
        ],
        "prefer-spread": [
            "error"
        ],
        "@typescript-eslint/adjacent-overload-signatures": [
            "error"
        ],
        "@typescript-eslint/ban-ts-ignore": [
            "error"
        ],
        "@typescript-eslint/ban-types": [
            "error"
        ],
        "@typescript-eslint/class-name-casing": [
            "error"
        ],
        "@typescript-eslint/consistent-type-assertions": [
            "error"
        ],
        "@typescript-eslint/explicit-function-return-type": [
            "warn"
        ],
        "@typescript-eslint/interface-name-prefix": [
            "error"
        ],
        "no-array-constructor": [
            "off"
        ],
        "@typescript-eslint/no-array-constructor": [
            "error"
        ],
        "no-empty-function": [
            "off"
        ],
        "@typescript-eslint/no-empty-function": [
            "error"
        ],
        "@typescript-eslint/no-empty-interface": [
            "error"
        ],
        "@typescript-eslint/no-inferrable-types": [
            "error"
        ],
        "@typescript-eslint/no-misused-new": [
            "error"
        ],
        "@typescript-eslint/no-namespace": [
            "error"
        ],
        "@typescript-eslint/no-non-null-assertion": [
            "warn"
        ],
        "@typescript-eslint/no-this-alias": [
            "error"
        ],
        "no-unused-vars": [
            "off"
        ],
        "@typescript-eslint/no-unused-vars": [
            "warn"
        ],
        "no-use-before-define": [
            "off"
        ],
        "@typescript-eslint/no-var-requires": [
            "error"
        ],
        "@typescript-eslint/prefer-namespace-keyword": [
            "error"
        ],
        "@typescript-eslint/triple-slash-reference": [
            "error"
        ],
        "@typescript-eslint/type-annotation-spacing": [
            "error"
        ],
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "explicit"
            }
        ],
        "indent": [
            "off"
        ],
        "@typescript-eslint/indent": [
            "error",
            "tab"
        ]
    },
    "settings": {
        "import/extensions": [
            ".ts",
            ".tsx",
            ".d.ts",
            ".js",
            ".jsx"
        ],
        "import/external-module-folders": [
            "node_modules",
            "node_modules/@types"
        ],
        "import/parsers": {
            "@typescript-eslint/parser": [
                ".ts",
                ".tsx",
                ".d.ts"
            ]
        },
        "import/resolver": {
            "node": {
                "extensions": [
                    ".ts",
                    ".tsx",
                    ".d.ts",
                    ".js",
                    ".jsx"
                ]
            }
        }
    }
};
