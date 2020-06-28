const jsreportOptions = {
  phantom: {
    defaultPhantomjsVersion: '2.1.1',
    allowLocalFilesAccess: true,
    strategy: 'phantom-server',
  },
}
const path = require('path')
const jsreport = require('jsreport-core')(jsreportOptions)
const fs = require('fs')
const Handlebars = require('handlebars')
const moment = require('moment')

const itemAmount = (item) => {
  return item.rate ? (item.amount * item.rate) : item.amount
}

jsreport.init().then(async () => {
  const data = require(process.argv[2] || './data.json')
  const file = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
  const template = Handlebars.compile(file)
  const date = moment()
  const month = date.format('MM')
  const year = date.format('YY')
  const fullYear = date.format('YYYY')
  for (const person of data) {
    if (person.skip) {
      continue
    }
    console.log(`Rendering template for ${person.name}..`)
    const names = person.name.split(' ')
    const initials = `${names[0].charAt(0).toUpperCase()}${names[1].charAt(0).toUpperCase()}`
    const index = person.invoiceOverride || '001'
    const invoiceNo = `${year}-${month}-${index}`
    const data = {
      ...person,
      invoiceNo,
      items: person.items.map(item => ({
        ...item,
        from: item.fromOverride || `1.${month}.${fullYear}`,
        to: item.toOverride || date.endOf('month').format('DD.MM.YYYY'),
        amount: itemAmount(item).toFixed(2),
      })),
      bankName: person.bankName || person.name,
      total: person.items.reduce((sum, item) => sum + itemAmount(item), 0).toFixed(2),
      date: moment().format('DD.MM.YYYY'),
    }
    const content = template(data)
    const out = await jsreport.render({
      template: {
        content,
        engine: 'jsrender',
        recipe: 'chrome-pdf',
        phantom: {
        },
      },
    })
    const dir = `./invoices/${date.format('MM_YYYY')}`
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(`${dir}/${initials}-${invoiceNo}.pdf`, out.content, 'binary')
    console.log('Saved.')
  }
  process.exit(0)
})
