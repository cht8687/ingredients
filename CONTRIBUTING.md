# Contributing

Contributions are always welcome, no matter how large or small. Before
contributing, please read the
[code of conduct](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md).

## Setup local env

To start developing on ingredients you only need to install its dependencies:

```bash
npm install
```

After this step you can now start and run the tests:

```bash
npm test
```

## Cross repository changes

If you are making changes to ingredients which make it necessary to also change things in babel you will want to link both repositories together. This can be done by doing the following (assuming you have both babel and ingredients already checked out):

```bash
cd ingredients/
npm link
npm run build
cd ../babel/
make bootstrap
npm link ingredients
cd packages/babel-core/
npm link ingredients
cd ../../packages/babel-template/
npm link ingredients
cd ../../packages/babel-traverse/
npm link ingredients
cd ../../packages/babel-generator/
npm link ingredients
make build
make test
```

From now on babel will use your local checkout of ingredients for its tests.
