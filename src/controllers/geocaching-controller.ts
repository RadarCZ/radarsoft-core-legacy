import axios from 'axios'
import { parse } from 'node-html-parser'

export const getGcData = async (req, res, next) => {
  const { u } = req.query
  const gcData = await axios.get(`https://www.geocaching.com/p/default.aspx?u=${u}`)

  const gcHtml:any = parse(gcData.data)
  const stat1Text = gcHtml.querySelectorAll('.profile-stats')[0].querySelectorAll('li')[0].text.trim()
  const stat2Text = gcHtml.querySelectorAll('.profile-stats')[0].querySelectorAll('li')[2].text.trim()
  const resultData = {
    icon: gcHtml.querySelectorAll('.profile-image')[0].attributes.src,
    name: gcHtml.querySelectorAll('h1')[0].text,
    site: 'geocaching',
    stat1: stat1Text.substr(0, stat1Text.indexOf(' ')),
    stat2: stat2Text.substr(0, stat1Text.indexOf(' '))
  }

  res.send(resultData)
}
