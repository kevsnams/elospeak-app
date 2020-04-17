import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

import replace from '@rollup/plugin-replace';
import alias from 'rollup-plugin-alias';

const production = !process.env.ROLLUP_WATCH;

const dotenv = require('dotenv');
const envres = dotenv.config({
	path: '../.env'
});

let pusherEnv = {};

for (let key in envres.parsed) {
	let value = envres.parsed[key];
	if (/^PUSHER\_/.test(key)) {
		let newKey = key.replace('PUSHER_', '');
		pusherEnv[newKey] = value;
	}
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: '../public/spa/dist/bundle.js'
	},
	plugins: [
		replace({
			exclude: 'node_modules/**',
			__PUSHER_ENV__: JSON.stringify(pusherEnv),
			__APP_URL__: envres.parsed.APP_URL
		}),

		alias({
			entries: [
				{
					find: 'elo/stores',
					replacement: 'src/stores.js'
				},

				{
					find: 'elo/util',
					replacement: 'src/util.js'
				},

				{
					find: 'elo/routes',
					replacement: 'src/routes.js'
				},

				{
					find: /^elo\/components\/(.*)$/,
					replacement: 'src/components/$1'
				}
			]
		}),

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('../public/spa/dist/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		// !production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}
