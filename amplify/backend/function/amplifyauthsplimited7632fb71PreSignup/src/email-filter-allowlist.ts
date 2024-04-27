import { PreSignUpTriggerEvent } from 'aws-lambda'
import AWS from 'aws-sdk'

const ssm = new AWS.SSM()

const getSecret = async (secretName: string): Promise<string | null> => {
  const secretPath = process.env[secretName]
  if (secretPath == null) return null
  const { Parameter } = await ssm.getParameter({
    Name: secretPath,
    WithDecryption: true
  }).promise()
  return Parameter?.Value ?? null
}

exports.handler = async (event: PreSignUpTriggerEvent) => {
  const { email } = event.request.userAttributes

  const ALLOWED_EMAIL_REGEX_LIST = (await getSecret('ALLOWED_EMAIL_REGEX_LIST'))?.split(',').map((a) => a.trim()) ?? []

  const isAllowed = ALLOWED_EMAIL_REGEX_LIST.some((regex) => new RegExp(regex).test(email))

  if (!isAllowed) {
    throw new Error(`\nallowed email regex list: ${ALLOWED_EMAIL_REGEX_LIST.map((a) => `'${a}'`).join(', ')}`)
  }

  return event
}
