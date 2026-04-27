import admin from 'firebase-admin'

admin.initializeApp({ projectId: 'ninofaz-fb2b4' })
const db = admin.firestore()

const teacherUids = [
  'oGgzk0IrYSPFKs71UwoyJ1VV4mx2',
  '9S7ZMDAtn8Pg8P9k6X15qTOPmxT2',
  'tDhE6gYk1XMJ2nREko0cHWUBmqu1',
]

async function deleteCollection(ref) {
  const snap = await ref.get()
  for (const doc of snap.docs) {
    await doc.ref.delete()
  }
  return snap.size
}

for (const uid of teacherUids) {
  console.log(`\n=== teacherUid=${uid} ===`)
  const classrooms = await db.collection('classrooms').where('teacherUid', '==', uid).get()
  console.log(`  ${classrooms.size} turmas encontradas`)
  for (const c of classrooms.docs) {
    const cid = c.id
    const members = await deleteCollection(c.ref.collection('members'))
    const expected = await deleteCollection(c.ref.collection('expectedStudents'))
    const assignments = await deleteCollection(c.ref.collection('assignments'))
    const analytics = await deleteCollection(c.ref.collection('analytics'))
    const alerts = await deleteCollection(c.ref.collection('alerts'))
    const conversations = await deleteCollection(c.ref.collection('conversations'))
    await c.ref.delete()
    console.log(`  ✓ ${cid} (members=${members} expected=${expected} assignments=${assignments} analytics=${analytics} alerts=${alerts} conv=${conversations})`)
  }
}

console.log('\nOK')
