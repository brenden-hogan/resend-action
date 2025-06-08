import { Resend } from 'resend'
import * as core from '@actions/core'

try {
  const resendApiKey = parseString(core.getInput('api-key'), false)
  const fromDomain = parseString(core.getInput('from-domain'), false)
  const sender = parseString(core.getInput('sender'), false)
  const subject = parseString(core.getInput('subject'), false)
  const to = parseArrayString(core.getInput('to-array'), false)
  const replyTo = parseArrayString(core.getInput('reply-to-array'), true)
  const bcc = parseArrayString(core.getInput('bcc-array'), true)
  const cc = parseArrayString(core.getInput('cc-array'), true)
  const text = parseString(core.getInput('text', true))
  const html = parseString(core.getInput('html'), true)
  const sendToSeparately = core.getInput('send-to-separately').trim().toLowerCase() === 'true'
  const scheduledAt = parseString(core.getInput('scheduled-at'), true)
  const dryRun = core.getInput('dry-run').trim().toLowerCase() === 'true'
  const resend = new Resend(resendApiKey)

  if (text && html) {
    throw new Error('Only text or html can be set but both are set.')
  }

  if (dryRun) {
    console.log('Dry run flag set! No email will actually be sent.')
  }

  console.log(`Emails will be sent by: ${sender}@${fromDomain} with replyTo: ${prettyPrint(replyTo)}`)
  console.log(`Subject will be: ${subject}`)

  if (scheduledAt) {
    console.log(`Email will be delayed and sent using value: ${scheduledAt}`)
  }

  if (sendToSeparately) {
    for (const email of to) {
      console.log(`Sending email to: ${email}`)
      if (!dryRun) {
        await resend.emails.send({
          from: `${sender}@${fromDomain}`,
          to: email,
          replyTo: replyTo,
          subject: subject,
          scheduledAt: scheduledAt,
          text: text,
          html: html,
        })
      }
    }
  } else {
    console.log(`Sending email to: ${prettyPrint(to)}`)
    console.log(`Sending email cc: ${prettyPrint(cc)}`)
    console.log(`Sending email bcc: ${prettyPrint(bcc)}`)
    if (!dryRun) {
      await resend.emails.send({
        from: `${sender}@${fromDomain}`,
        to: to,
        cc: cc,
        bcc: bcc,
        replyTo: replyTo,
        subject: subject,
        scheduledAt: scheduledAt,
        text: text,
        html: html,
      })
    }
  }
} catch (error) {
  core.setFailed(error.message)
}

function prettyPrint(value) {
  if (!value) {
    return 'N/A'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return value
}

function parseString(str, optional) {
  if (!str || str.trim() === '') {
    if (!optional) {
      throw new Error('Required value was not included')
    }
    return undefined
  }

  return str.trim()
}

function parseArrayString(str, optional) {
  // Handle empty string
  if (!str || str.trim() === '') {
    if (!optional) {
      throw new Error('Required value was not included')
    }
    return undefined
  }

  // Split by comma and trim whitespace from each element
  const elements = str.split(',').map((element) => element.trim())

  // Filter out empty elements (in case of extra commas)
  const validElements = elements.filter((element) => element !== '')

  // Return based on number of valid elements
  if (validElements.length === 0) {
    if (!optional) {
      throw new Error('Required value was not included')
    }
    return undefined
  } else if (validElements.length === 1) {
    return validElements[0]
  } else {
    return validElements
  }
}
