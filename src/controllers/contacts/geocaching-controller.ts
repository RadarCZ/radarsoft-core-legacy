import axios from 'axios'

export const getGcData = async (req, res, next) => {
  const { u } = req.query
  const url = `https://www.geocaching.com/p/default.aspx?u=${u}`
  const gcResponse = await axios.get(url)

  if (gcResponse.status === 200 || gcResponse.status === 300) {
    const resultData = {
      'icon': 'https://img.geocaching.com/user/square250/6632b799-e189-4ea1-9072-a2d48c03452f.png',
      'name': u,
      'site': 'geocaching',
      'stat1': 75,
      'stat2': 5,
      'targetUrl': url
    }

    res.send(resultData)
  } else {
    res.send(new Error(gcResponse.statusText))
  }
}
