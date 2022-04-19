const fs = require('fs')
const zlib = require('zlib')

function compress(fw) {
  const index = fw === 'angular' ? 'main' : 'index'
  const component = fs.readFileSync(`./${fw}-todomvc/dist/${index}.js`)
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

compress('vue')
compress('svelte')
compress('react')
compress('angular')