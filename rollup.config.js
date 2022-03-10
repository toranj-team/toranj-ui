import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const packageJson = require('./package.json');

export default [
    {
        input: 'src/components/lib/' + 'index.ts',
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true
            }),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.lib.json',
                sourceMap: false
            }),
            terser()
        ],
        external: ['react', 'react-dom'],
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: false,
                name: 'toranj-ui'
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: false
            }
        ]
    },
    {
        input: 'dist/esm/types//components/lib/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: "esm" }],
        external: [/\.css$/],
        plugins: [dts()],
    }
]
