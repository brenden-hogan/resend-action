# Resend-Action

This is a Github action to send a Resend email.

See the full API spec at: https://resend.com/docs/api-reference/emails/send-email

## Unsupported options at this time

- react
- headers
- attachments
- tags

## Example usage

```yaml
uses: actions/resend-action@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  api-key: '${{ secrets.API_KEY }}'
  from-domain: 'github.com'
  sender: 'no-reply'
  subject: 'Hello'
  to: 'test-user@github.com'
  text: 'Hello World'
```
