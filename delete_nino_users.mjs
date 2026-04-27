import admin from 'firebase-admin'

admin.initializeApp({ projectId: 'ninofaz-fb2b4' })
const auth = admin.auth()
const db = admin.firestore()

const emails = ['fabricio.fazer@gmail.com', 'fabricio.tradepixel@gmail.com']

for (const email of emails) {
  console.log(`\n=== ${email} ===`)
  try {
    const u = await auth.getUserByEmail(email)
    console.log(`  uid=${u.uid} providers=${u.providerData.map(p => p.providerId).join(',')}`)

    try {
      await db.collection('users').doc(u.uid).delete()
      console.log(`  ✓ firestore users/${u.uid} deletado`)
    } catch (e) {
      console.log(`  ! firestore delete err: ${e.message}`)
    }

    await auth.deleteUser(u.uid)
    console.log(`  ✓ auth user deletado`)
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.log(`  (não existe no Firebase Auth)`)
    } else {
      console.log(`  ERRO: ${err.code || err.message}`)
    }
  }
}

console.log('\nOK')
