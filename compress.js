const fs = require('fs')
const zlib = require('zlib')

function compress(fw) {
  const component = fs.readFileSync(`./${fw}-todomvc/dist/index.js`)
  const vendor = fs.readFileSync(`./${fw}-todomvc/dist/vendor.js`)
  const fileComponent = `./brotli/${fw}.component.brotli`
  const fileVendor = `./brotli/${fw}.vendor.brotli`
  fs.writeFileSync(fileComponent, zlib.brotliCompressSync(component))
  fs.writeFileSync(fileVendor, zlib.brotliCompressSync(vendor))
  var statsComponent = fs.statSync(fileComponent)
  var statsVendor = fs.statSync(fileVendor)
  var kbComponent = statsComponent.size / 1024;
  var kbVendor = statsVendor.size / 1024;
  console.log(`${fw}:
    component: ${kbComponent.toFixed(2)}kB
    vendor: ${kbVendor.toFixed(2)}kB
  `)
}

function compressAngular() {
  const component = fs.readFileSync(`./angular-todomvc/dist/angular-todomvc/browser/chunk-NGBUTW5B.js`)
  const vendor1 = fs.readFileSync(`./angular-todomvc/dist/angular-todomvc/browser/chunk-IA7WTFUI.js`)
  const vendor2 = fs.readFileSync(`./angular-todomvc/dist/angular-todomvc/browser/main.js`)
  const vendor3 = fs.readFileSync(`./angular-todomvc/dist/angular-todomvc/browser/polyfills.js`)
  const fileComponent = `./brotli/angular.component.brotli`
  const fileVendor1 = `./brotli/angular.vendor1.brotli`
  const fileVendor2 = `./brotli/angular.vendor2.brotli`
  const fileVendor3 = `./brotli/angular.vendor3.brotli`
  fs.writeFileSync(fileComponent, zlib.brotliCompressSync(component))
  fs.writeFileSync(fileVendor1, zlib.brotliCompressSync(vendor1))
  fs.writeFileSync(fileVendor2, zlib.brotliCompressSync(vendor2))
  fs.writeFileSync(fileVendor3, zlib.brotliCompressSync(vendor3))
  var statsComponent = fs.statSync(fileComponent)
  var statsVendor1 = fs.statSync(fileVendor1)
  var statsVendor2 = fs.statSync(fileVendor2)
  var statsVendor3 = fs.statSync(fileVendor3)
  var kbComponent = statsComponent.size / 1024;
  var kbVendor = (statsVendor1.size + statsVendor2.size + statsVendor3.size) / 1024;
  console.log(`angular:
    component: ${kbComponent.toFixed(2)}kB
    vendor: ${kbVendor.toFixed(2)}kB
  `)
}

compress('vue')
compress('svelte')
compress('svelte-5')
compress('react')
compressAngular()
compress('solid')
compress('preact')