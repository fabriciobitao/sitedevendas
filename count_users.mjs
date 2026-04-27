import admin from 'firebase-admin'
admin.initializeApp({ projectId: 'ninofaz-fb2b4' })
const auth = admin.auth()
let count = 0
let pageToken
const emails = []
do {
  const res = await auth.listUsers(1000, pageToken)
  for (const u of res.users) {
    count++
    if (u.email) emails.push(u.email)
  }
  pageToken = res.pageToken
} while (pageToken)
console.log(`total_users=${count}`)
console.log(`com_email=${emails.length}`)
console.log('---')
emails.forEach(e => console.log(e))
