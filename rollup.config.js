import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: './src/MQ.js',
    dest: './dist/MQ.js',
    format: 'umd',
    plugins: [
        babel(),
        nodeResolve({
            jsnext:true,
            main:true
        })
    ]
};
