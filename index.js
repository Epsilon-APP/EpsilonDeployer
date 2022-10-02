const core = require('@actions/core');

const fs = require('fs')
const path = require('path')

const https = require('https')
const axios = require('axios')

try {
  const host = core.getInput('host')
  const secret = core.getInput('secret')

  const type = core.getInput('type')
  const jar = core.getInput('jar')
  const destination = core.getInput('destination')

  const rejectTLS = core.getInput('rejectTLS')

  pushFile(host, type, destination, jar, secret, rejectTLS)
} catch (error) {
  core.setFailed(error.message)
}

async function pushFile(host, type, destination, file, secret, rejectTLS) {
  var FormData = require('form-data');

  const formData = new FormData()
  formData.append('upload', fs.readFileSync(file), path.basename(file))

  await axios.post(`https://${host}/${type}/${destination}/plugins/push`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Proxy-Authorization': `Basic ${secret}`
    },
    httpsAgent: new https.Agent({  
      rejectUnauthorized: rejectTLS
    }),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })
}