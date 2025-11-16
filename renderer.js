document.addEventListener('DOMContentLoaded', () => {
  const matSelect = document.getElementById('material')
  const parts = document.getElementById('parts')
  const cutLength = document.getElementById('cutLength')
  const areaW = document.getElementById('areaW')
  const areaH = document.getElementById('areaH')
  const machineRate = document.getElementById('machineRate')
  const laborRate = document.getElementById('laborRate')
  const margin = document.getElementById('margin')
  const calcBtn = document.getElementById('calculate')
  const resultBox = document.getElementById('result')

  const mats = window.electronAPI.readMaterials()
  mats.forEach((m,i) => {
    const opt = document.createElement('option')
    opt.value = i
    opt.textContent = m.name
    matSelect.appendChild(opt)
  })

  function parseNumber(el, fallback=0) {
    const v = parseFloat(el.value)
    return isFinite(v) ? v : fallback
  }

  function calc() {
    const m = mats[parseInt(matSelect.value) || 0] || mats[0]
    const pCount = Math.max(1, Math.round(parseNumber(parts,1)))
    const cutInches = parseNumber(cutLength,0)
    const w = parseNumber(areaW,0)
    const h = parseNumber(areaH,0)
    const areaPerPart = Math.max(0.0001, w*h)
    const materialCost = m.price_per_sq_in * areaPerPart * pCount
    const cuttingCost = m.cut_per_inch * cutInches * pCount
    const pierceCost = m.pierce_cost * pCount
    const machine = parseNumber(machineRate,0)
    const labor = parseNumber(laborRate,0)
    const overhead = (machine + labor) * pCount
    const subtotal = materialCost + cuttingCost + pierceCost + overhead
    const marginPct = parseNumber(margin,0)/100
    const total = subtotal * (1 + marginPct)

    resultBox.innerHTML = `
      <h3>Quote</h3>
      <p>Material: <strong>${m.name}</strong></p>
      <p>Parts: <strong>${pCount}</strong></p>
      <p>Area per part: ${areaPerPart.toFixed(2)} in²</p>
      <p>Material cost: $${materialCost.toFixed(2)}</p>
      <p>Cutting cost: $${cuttingCost.toFixed(2)}</p>
      <p>Pierce cost: $${pierceCost.toFixed(2)}</p>
      <p>Machine+Labor overhead: $${overhead.toFixed(2)}</p>
      <hr>
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Margin: ${ (marginPct*100).toFixed(1) }%</p>
      <h2>Total: $${total.toFixed(2)}</h2>
      <button id="copyBtn">Copy quote</button>
    `
    const copyBtn = document.getElementById('copyBtn')
    copyBtn.onclick = () => {
      const text = resultBox.innerText
      navigator.clipboard.writeText(text).then(()=> {
        alert('Copied to clipboard')
      })
    }
  }

  calcBtn.addEventListener('click', calc)
})
