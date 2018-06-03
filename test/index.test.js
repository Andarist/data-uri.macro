import * as path from 'path'
import pluginTester from 'babel-plugin-tester'
import macrosPlugin from 'babel-plugin-macros'
import { addAlias } from 'module-alias'

addAlias('data-uri.macro', path.join(__dirname, '..'))

pluginTester({
	title: 'data-uri.macro',
	plugin: macrosPlugin,
	fixtures: `${__dirname}/fixtures`
})
