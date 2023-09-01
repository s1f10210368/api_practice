import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const token = "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";

const file = '/Users/iniad/Downloads/001-sibutomo.mp3'
const model = 'whisper-1'

const form = new FormData()
form.append('file', fs.createReadStream(file))
form.append('model', model)

axios({
  method: 'post',
  url: 'https://api.openai.com/v1/audio/transcriptions',
  data: form,
  headers: {
    'Content-Type': `audio/wav`,
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error)
  })
