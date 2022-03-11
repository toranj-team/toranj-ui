import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import fs from 'fs-extra';
import path from 'path';

let entries = [];

let core = {};

// alias entries
const ALIAS_COMPONENT_ENTRIES = [
    { find: '../utils/utils', replacement: 'toranj-ui/utils' },
];

// dependencies
const GLOBAL_DEPENDENCIES = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-transition-group': 'ReactTransitionGroup'
};

const GLOBAL_COMPONENT_DEPENDENCIES = {
    ...GLOBAL_DEPENDENCIES, ...(ALIAS_COMPONENT_ENTRIES.reduce((acc, cur) => ({ ...acc, [cur.replacement]: cur.replacement.replace('\/', '.') }), {}))
};

// externals
const EXTERNAL = ['react', 'react-dom', 'react-transition-group'];

const EXTERNAL_COMPONENT = [...EXTERNAL, ...(ALIAS_COMPONENT_ENTRIES.map(entries => entries.replacement))];

const ALIAS_PLUGIN_OPTIONS_FOR_COMPONENT = {
    entries: ALIAS_COMPONENT_ENTRIES
};

const REPLACE_PLUGIN_OPTIONS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true
};

const RESOLVE_PLUGIN_OPTIONS = {
    extensions: ['.js']
};

const COMMONJS_PLUGIN_OPTIONS = {
    exclude: 'src/components/lib/' + '**',
    sourceMap: false
};

const POSTCSS_PLUGIN_OPTIONS = {
    sourceMap: false
};

const TERSER_PLUGIN_OPTIONS = {
    compress: {
        keep_infinity: true,
        pure_getters: true,
        reduce_funcs: false
    }
}

const PLUGINS = [
    replace(REPLACE_PLUGIN_OPTIONS),
    resolve(RESOLVE_PLUGIN_OPTIONS),
    commonjs(COMMONJS_PLUGIN_OPTIONS),
    typescript({
        tsconfig: './tsconfig.lib.json',
        sourceMap: false
    }),
    postcss(POSTCSS_PLUGIN_OPTIONS)
];

const PLUGINS_COMPONENT = [
    alias(ALIAS_PLUGIN_OPTIONS_FOR_COMPONENT),
    ...PLUGINS
];

function addEntry(name, input, output, isComponent = true) {
    const exports = name === 'tui.api' || name === 'tui' ? 'named' : 'auto';
    const useCorePlugin = ALIAS_COMPONENT_ENTRIES.some(entry => entry.replacement.replace('toranj-ui/', '') === name.replace('tui.', ''));
    const plugins = isComponent ? PLUGINS_COMPONENT : PLUGINS;
    const external = isComponent ? EXTERNAL_COMPONENT : EXTERNAL;
    const inlineDynamicImports = true;

    const getEntry = (isMinify) => {
        return {
            input,
            plugins: [...plugins, isMinify && terser(TERSER_PLUGIN_OPTIONS), useCorePlugin && corePlugin()],
            external,
            inlineDynamicImports
        }
    };

    const get_CJS_ESM = (isMinify) => {
        return {
            ...getEntry(isMinify),
            output: [
                {
                    format: 'cjs',
                    file: `${output}.cjs${isMinify ? '.min' : ''}.js`,
                    exports
                },
                {
                    format: 'esm',
                    file: `${output}.esm${isMinify ? '.min' : ''}.js`,
                    exports
                }
            ]
        }
    };

    const get_IIFE = (isMinify) => {
        return {
            ...getEntry(isMinify),
            output: [
                {
                    format: 'iife',
                    name,
                    file: `${output}${isMinify ? '.min' : ''}.js`,
                    globals: isComponent ? GLOBAL_COMPONENT_DEPENDENCIES : GLOBAL_DEPENDENCIES,
                    exports
                }
            ]
        }
    };

    entries.push(get_CJS_ESM());
    entries.push(get_IIFE());

    // Minify
    entries.push(get_CJS_ESM(true));
    entries.push(get_IIFE(true));
}

function corePlugin() {
    return {
        name: 'corePlugin',
        generateBundle(outputOptions, bundle) {
            if (outputOptions.format === 'iife') {
                Object.keys(bundle).forEach(id => {
                    const chunk = bundle[id];
                    const name = id.replace('.min.js', '').replace('.js', '');
                    const filePath = `./dist/core/core${id.indexOf('.min.js') > 0 ? '.min.js' : '.js'}`;

                    core[filePath] ? (core[filePath][name] = chunk.code) : (core[filePath] = { [`${name}`]: chunk.code });
                });
            }
        }
    };
}

function addCore() {
    const lastEntry = entries[entries.length - 1];

    lastEntry.plugins = [
        ...lastEntry.plugins,
        {
            name: 'coreMergePlugin',
            generateBundle() {
                Object.entries(core).forEach(([filePath, value]) => {
                    const code = ALIAS_COMPONENT_ENTRIES.reduce((val, entry) => {
                        const name = entry.replacement.replace('toranj-ui/', '');
                        val += value[name] + '\n';

                        return val;
                    }, '');

                    fs.outputFile(path.resolve(__dirname, filePath), code, {}, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                });
            }
        }
    ]
}

function addComponent() {
    fs.readdirSync(path.resolve(__dirname, 'src/components/lib/'), { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .forEach(({ name: folderName }) => {
            fs.readdirSync(path.resolve(__dirname, 'src/components/lib/' + folderName)).forEach(file => {
                let name = file.split(/.(ts|tsx)$/)[0].toLowerCase();
                if (name === folderName) {
                    const input = 'src/components/lib/' + folderName + '/' + file;
                    const output = 'dist/' + folderName + '/' + name;

                    addEntry('tui.' + folderName, input, output, true);
                }
            });
        });
}

function addToranjUI() {
    const input = 'src/components/lib/' + 'index.ts';
    const output = 'dist/' + 'tui.all';

    addEntry('tui', input, output, false);
}

addComponent();
addToranjUI();
addCore();

entries.push(    {
    input: 'dist/types/components/lib/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()]
})

export default entries;
