import { Resend } from 'resend';
import * as core from '@actions/core'

try {
    const resendApiKey = parseString(core.getInput('api-key'), false);
    const fromDomain = parseString(core.getInput('from-domain'), false);
    const sender = parseString(core.getInput('sender'), false);
    const subject = parseString(core.getInput('subject'), false);
    const to = parseArrayString(core.getInput('to-array'), false);
    const replyTo = parseArrayString(core.getInput('reply-to-array'), true);
    const bcc = parseArrayString(core.getInput('bcc-array'), true);
    const cc = parseArrayString(core.getInput('cc-array'), true);
    const text = parseString(core.getInput('text', true));
    const html = parseString(core.getInput('html'), true);
    const sendToSeparately = (core.getInput('send-to-separately').trim.toLowerCase() === 'true');
    const resend = new Resend(resendApiKey);

    if (text && html) {
        throw new Error("Only text or html can be set but both are set.");
    }

    if (sendToSeparately) {
      for (const email in to) {
        console.log(`Emailing ${email}`);
        await resend.emails.send({
          from: `${sender}@${fromDomain}`,
          to: to,
          replyTo: replyTo,
          subject: subject,
          text: text,
          html: html
       });  
      }
    } else {
      await resend.emails.send({
        from: `${sender}@${fromDomain}`,
        to: to,
        cc: cc,
        bcc: bcc,
        replyTo: replyTo,
        subject: subject,
        text: text,
        html: html
      });
    }
} catch (error) {
  core.setFailed(error.message);
}

function parseString(str, optional) {
  if (!str || str.trim() === '') {
    if (!optional) {
        throw new Error("Required value was not included");
    }
    return undefined;
  }

  return str.trim();
}

function parseArrayString(str, optional) {
  // Handle empty string
  if (!str || str.trim() === '') {
    if (!optional) {
        throw new Error("Required value was not included");
    }
    return undefined;
  }
  
  // Split by comma and trim whitespace from each element
  const elements = str.split(',').map(element => element.trim());
  
  // Filter out empty elements (in case of extra commas)
  const validElements = elements.filter(element => element !== '');
  
  // Return based on number of valid elements
  if (validElements.length === 0) {
    if (!optional) {
        throw new Error("Required value was not included");
    }
    return undefined;
  } else if (validElements.length === 1) {
    return validElements[0];
  } else {
    return validElements;
  }
}