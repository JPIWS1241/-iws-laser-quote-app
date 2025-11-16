const { contextBridge } = require('electron')
const fs = require('fs')
const path = require('path')

contextBridge.exposeInMainWorld('electronAPI', {
  readMaterials: () => {
    try {
      const p = path.join(__dirname, 'materials.json')
      return JSON.parse(fs.readFileSync(p, 'utf8'))
    } catch (e) {
      return []
    }
  }
})
