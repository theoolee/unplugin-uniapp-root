# unplugin-uniapp-root

[中文](./README.md) | English

> We can get some modal components globally available without import and register by injecting a root component for [uni-app](https://github.com/dcloudio/uni-app) pages.

## Getting Started

### Vue CLI

#### Install:

```bash
npm i -D unplugin-uniapp-root
```

#### Config:

```javascript
const Root = require('unplugin-uniapp-root')

module.exports = {
  configureWebpack: {
    plugins: [
      Root.webpackPlugin({
        // ...config,
      }),
    ],
  },
}
```

## Configuration

### pagePath

- Type: `string[]`
- Default: `['src/pages']`

Paths to the pages directory.

### exclude

- Type: `string[]`
- Default: `['**/components/**/*.vue']`

An array of glob patterns to exclude matches.

```bash
# folder structure
src/pages/
  ├── Login/
  │  ├── components
  │  │  └── Form.vue
  │  └── index.vue
  └── Home.vue
```

```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      Root.webpackPlugin({
        exclude: ['**/components/**/*.vue'],
      }),
    ],
  },
}
```

### componentName

- Type: `string`
- Default: `Root`

Name of Injected Component.

### componentPath

- Type: `string`
- Default: `./src/components/Root/index.vue`

Path of Injected Component.

## License

[MIT](https://opensource.org/licenses/MIT)
