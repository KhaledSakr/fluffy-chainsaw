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
const data = require('./data.json')

jsreport.init().then(async () => {
  const file = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8')
  const template = Handlebars.compile(file)
  const date = moment()
  const month = date.format('M')
  const year = date.format('YY')
  const fullYear = date.format('YYYY')
  for (const person of data) {
    console.log(`Rendering template for ${person.name}..`)
    const names = person.name.split(' ')
    const initials = `${names[0].charAt(0).toUpperCase()}${names[1].charAt(0).toUpperCase()}`
    const invoiceNo = `${year}${month}_${initials}_001`
    const data = {
      ...person,
      invoiceNo,
      from: `1.${month}.${fullYear}`,
      to: date.endOf('month').format('DD.MM.YYYY'),
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
    fs.writeFileSync(`${dir}/${invoiceNo}.pdf`, out.content,'binary')
    console.log('Saved.')
  }
  process.exit(0)
})
