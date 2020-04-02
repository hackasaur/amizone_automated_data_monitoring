window.addEventListener("load", async () => {
  await main()
})

const main = async () => {

  const res = await fetch("http://localhost:3000/api/timetable")
  const data = await res.json()
  console.dir(data)

  const el = document.getElementById("el")
  const renderTable = Table(data.days, data.slots, "day/slot")

  renderTable(el, sanitize(data.data))
}

const _arrayToList = (arr) => {
  return `<ul>${arr.map(item => `<li>${item}</li>`).join("")}</ul>`
}

const sanitize = (data) => {
  const clone = {...data}
  for (const day of Object.keys(data)) {
    for (const slot of Object.keys(data[day])) {
      const html = _arrayToList([
        data[day][slot].courseName, 
        data[day][slot].teacher, 
        data[day][slot].attendanceStatus])

      clone[day][slot] = html
    }
  }
  return clone
}

const Table = (vLabels, hLabels, pivot) => {
  const _arrayToRowItems = items => {
    const html = `${items.map(item => `<td>${item}</td>`).join("\n")}`
    return html
  }

  const _arrayToTableRow = items => {
    return `<tr>${_arrayToRowItems(items)}</tr>`
  }

  const _arrayToTableHead = items => {
    return `<thead>${_arrayToRowItems(items)}</thead>`
  }

  const _dataAsRows = (data, vLabels, hLabels) => {
    const rows = []
    vLabels.forEach(vLabel => {
      const row = [vLabel]
      hLabels.forEach(hLabel => {
        row.push(
          data[vLabel] ? (data[vLabel][hLabel] ? data[vLabel][hLabel] : "") : ""
        )
      })
      rows.push(row)
    })
    return rows
  }

  const _dataToHtmlTable = (data, vLabels, hLabels, pivot) => {
    const dataInRows = _dataAsRows(data, vLabels, hLabels)
    let tableContentHtml = ""
    tableContentHtml += _arrayToTableHead([pivot, ...hLabels])

    const rowsHtml = dataInRows.map(row => _arrayToTableRow(row)).join("\n")
    tableContentHtml += rowsHtml
    return `<table>${tableContentHtml}</table>`
  }

  const _renderHtml = (el, html) => {
    el.innerHTML = html
    return el
  }

  const renderTable = (el, data) => {
    return _renderHtml(el, _dataToHtmlTable(data, vLabels, hLabels, pivot))
  }

  return renderTable
}
