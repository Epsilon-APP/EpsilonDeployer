const core = require('@actions/core');

const fs = require('fs')
const path = require('path')

const axios = require('axios')

try {
  const host = core.getInput('host')
  const secret = core.getInput('secret')

  const type = core.getInput('type')
  const jar = core.getInput('jar')
  const destination = core.getInput('destination')

  pushFile(host, type, destination, jar, secret)
} catch (error) {
  core.setFailed(error.message)
}

async function pushFile(host, type, destination, file, secret) {
  var FormData = require('form-data');

  const formData = new FormData()
  formData.append('upload', fs.readFileSync(file), path.basename(file))

  await axios.post(`${host}/${type}/${destination}/plugins/push`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Proxy-Authorization': `Basic ${secret}`
    }
  })
}