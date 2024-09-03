import dts from 'bun-plugin-dts'

Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    plugins: [
        dts()
    ],
})