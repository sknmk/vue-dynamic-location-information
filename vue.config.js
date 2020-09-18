module.exports = {
    runtimeCompiler: true,
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'public/sw.js'
        },
        themeColor: '#df081a'
    },
}