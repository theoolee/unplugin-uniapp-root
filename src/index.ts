import { createUnplugin } from 'unplugin'
import { WebpackPluginInstance } from 'webpack'
import path from 'path'
import minimatch from 'minimatch'
import transform from './transform'
import { Options } from './types'

const defaultOptions: Required<Options> = {
  pagePath: ['src/pages'],
  exclude: ['**/components/**/*.vue'],
  componentName: 'Root',
  componentPath: './src/components/Root/index.vue',
}

const unplugin = createUnplugin<Options>((options) => {
  const opts: Required<Options> = {
    ...defaultOptions,
    ...options,
  }
  if (/^\.\//.test(opts.componentPath)) {
    opts.componentPath = path.resolve(process.cwd(), opts.componentPath)
  }
  const filter = (id: string) => {
    const isExclude = opts.exclude.some((p) => minimatch(id, p))
    const isPagePath = opts.pagePath.some((p) =>
      new RegExp(`${p}.*\.vue\??.*`).test(id)
    )
    return !isExclude && isPagePath
  }
  return {
    name: 'unplugin-root-component',
    transform(code, id) {
      if (filter(id)) {
        return transform(code, opts)
      }
      return code
    },
  }
})

export const vitePlugin = unplugin.vite
export const webpackPlugin = unplugin.webpack
