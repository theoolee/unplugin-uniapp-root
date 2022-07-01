# unplugin-uniapp-root

中文 | [English](./README-en.md)

> 为每个 [uni-app](https://github.com/dcloudio/uni-app) 页面注入一个根组件，让根组件中的内容全局可用，同时免去繁琐的引入和注册。

## 开始使用

### Vue CLI

#### 安装:

```bash
npm i -D unplugin-uniapp-root
```

#### 配置:

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

## 配置项

### pagePath

- Type: `string[]`
- Default: `['src/pages']`

页面文件所在的文件系统目录。

### exclude

- Type: `string[]`
- Default: `['**/components/**/*.vue']`

一个包含 glob pattern 的数组，用来排除匹配路径。

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

注入根组件时使用的组件名称。

### componentPath

- Type: `string`
- Default: `./src/components/Root/index.vue`

根组件所在的文件系统路径。

## License

[MIT](https://opensource.org/licenses/MIT)
