import * as path from 'path'
import pluginTester from 'babel-plugin-tester'
import macrosPlugin from 'babel-plugin-macros'

pluginTester({
  title: 'data-uri.macro',
  plugin: macrosPlugin,
  fixtures: `${__dirname}/fixtures`,
})
