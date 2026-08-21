import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from '../src/services/db/db';
import User from '../src/models/user.model';
import Progress from '../src/models/progress.model';

dotenv.config();

const rawUsersList = `
yassin.benali@gmail.com - 7kLp2mQx9R
imane.farouk@gmail.com - hT8fNw4BsV
rachid.mansouri@gmail.com - zC5xPv3JmY
nadia.berrada@gmail.com - rW9qKt7HnS
sami.bennani@gmail.com - dX6fLp2WcN
lamia.chakir@gmail.com - vY4sGm8QrB
fouad.elmahdi@gmail.com - pT7hJb5VxC
ghalia.meziane@gmail.com - mK3nWt9RzL
moncef.kabbaj@gmail.com - zQ8xCv6MnP
sanae.belghiti@gmail.com - lF5rTy2WbS
aziz.chekrouni@gmail.com - gH7nMx3PvK
mounia.tazi@gmail.com - rY2tWp9LdM
driss.alaoui@gmail.com - sK4cXz8QmF
latifa.elfassi@gmail.com - bV6hJt3NwR
said.bouazza@gmail.com - tM9xPv5ZsG
amina.ghazi@gmail.com - wC2rKt7HnX
hassan.bensouda@gmail.com - jL5fNy8QcB
naima.elfilali@gmail.com - qX4sWp2RzT
jamal.belhaj@gmail.com - mK7vCt3YgF
khadija.berkane@gmail.com - hT9xBn6PsV
rachida.sbai@gmail.com - zC4rWm8LqJ
abdelilah.ouali@gmail.com - vY2tFp5XkN
soukaina.elmokhtar@gmail.com - dS6hJb3RzC
mourad.benchikha@gmail.com - rG8cXv4MnP
khalil.berrada@gmail.com - nB5tWy2QlF
hayat.elouafi@gmail.com - pK7mSx9VjH
yassine.boussif@gmail.com - xC3rPv6MtG
chaimae.gharbi@gmail.com - wL2nTp8RzK
faiza.bouchaib@gmail.com - qH5sWx9VmB
mohcine.allaoui@gmail.com - tR7cXz4NpJ
basma.elmahjoub@gmail.com - fK3tPv6MsY
abderrahim.saidi@gmail.com - gV9mWx2QlR
saadia.belkhir@gmail.com - zC5rTy8HbN
hamid.chraibi@gmail.com - sX4nMt7WcP
asmahan.elfadli@gmail.com - pR2vKt9FsG
zineb.mezouar@gmail.com - mG6hJb3XsV
idriss.benjelloun@gmail.com - tK8cPx5MvZ
karima.berrichi@gmail.com - rY2tWp9LdM
mehdi.chahid@gmail.com - wC4sXz7QmF
meryam.boussaid@gmail.com - bV3nHt8RzG
youssef.zouhair@gmail.com - qL5fNy2XcP
hanane.akchiche@gmail.com - pT7hJb5VxC
abderrazak.mammeri@gmail.com - mK3nWt9RzL
samira.benhaddou@gmail.com - zQ8xCv6MnP
nabil.chelha@gmail.com - lF5rTy2WbS
laila.azzouzi@gmail.com - gH7nMx3PvK
tariq.moufaddal@gmail.com - rY2tWp9LdM
amina.benomar@gmail.com - sK4cXz8QmF
rachid.souissi@gmail.com - bV6hJt3NwR
fadwa.lahlou@gmail.com - tM9xPv5ZsG
ilyas.ourkia@gmail.com - wC2rKt7HnX
nora.elmoussadi@gmail.com - jL5fNy8QcB
yassir.benchekroun@gmail.com - qX4sWp2RzT
khadija.ouazzani@gmail.com - mK7vCt3YgF
imad.mekouar@gmail.com - hT9xBn6PsV
saloua.benabbes@gmail.com - zC4rWm8LqJ
taoufik.bouayad@gmail.com - vY2tFp5XkN
malika.benfassi@gmail.com - dS6hJb3RzC
mostafa.kharbouch@gmail.com - rG8cXv4MnP
batoul.ziani@gmail.com - nB5tWy2QlF
ayman.benchaib@gmail.com - pK7mSx9VjH
assia.benslimane@gmail.com - xC3rPv6MtG
mustapha.bouchaoui@gmail.com - wL2nTp8RzK
rahma.elfahli@gmail.com - qH5sWx9VmB
ismael.benmehdi@gmail.com - tR7cXz4NpJ
ghita.benallal@gmail.com - fK3tPv6MsY
kamal.benhima@gmail.com - gV9mWx2QlR
nour.elouali@gmail.com - zC5rTy8HbN
achraf.bensaid@gmail.com - sX4nMt7WcP
soukaina.belhassan@gmail.com - pR2vKt9FsG
brahim.elkhayat@gmail.com - mG6hJb3XsV
kawtar.benfellah@gmail.com - tK8cPx5MvZ
mohamed.tahiri@gmail.com - rY2tWp9LdM
insaf.benmoussa@gmail.com - wC4sXz7QmF
ayoub.bensouda@gmail.com - bV3nHt8RzG
salma.boutaieb@gmail.com - qL5fNy2XcP
abdellatif.belkacem@gmail.com - pT7hJb5VxC
meriem.elouardi@gmail.com - mK3nWt9RzL
younes.benhammou@gmail.com - zQ8xCv6MnP
siham.berkati@gmail.com - lF5rTy2WbS
chakib.bouhlal@gmail.com - gH7nMx3PvK
zahra.benjelloun@gmail.com - rY2tWp9LdM
taha.bouzekri@gmail.com - sK4cXz8QmF
najat.elmokhtari@gmail.com - bV6hJt3NwR
habib.bennani@gmail.com - tM9xPv5ZsG
lamya.bouchareb@gmail.com - wC2rKt7HnX
faisal.benani@gmail.com - jL5fNy8QcB
maha.benjamaa@gmail.com - qX4sWp2RzT
abdelhamid.errouhi@gmail.com - mK7vCt3YgF
azzedine.benkirane@gmail.com - hT9xBn6PsV
karim.belkhayat@gmail.com - zC4rWm8LqJ
rajaa.elfil@gmail.com - vY2tFp5XkN
hamza.bouzidi@gmail.com - dS6hJb3RzC
faouzia.benjeddou@gmail.com - rG8cXv4MnP
salim.berraho@gmail.com - nB5tWy2QlF
ikram.benbouazza@gmail.com - pK7mSx9VjH
mouad.benbrahim@gmail.com - xC3rPv6MtG
safae.elhassani@gmail.com - wL2nTp8RzK
faycal.benjellouni@gmail.com - qH5sWx9VmB
amina.benhamza@gmail.com - tR7cXz4NpJ
redouane.belghiti@gmail.com - fK3tPv6MsY
souad.elfakir@gmail.com - gV9mWx2QlR
hicham.benmimoun@gmail.com - zC5rTy8HbN
nabil.benjema@gmail.com - sX4nMt7WcP
youssef.benomar@gmail.com - pR2vKt9FsG
chaima.benabid@gmail.com - mG6hJb3XsV
aziz.benahmed@gmail.com - tK8cPx5MvZ
meryem.benayad@gmail.com - rY2tWp9LdM
abdellah.benaissa@gmail.com - wC4sXz7QmF
latifa.benmoussa@gmail.com - bV3nHt8RzG
said.berradi@gmail.com - qL5fNy2XcP
amina.bencherif@gmail.com - pT7hJb5VxC
hassan.benbrahim@gmail.com - mK3nWt9RzL
naima.berrada@gmail.com - zQ8xCv6MnP
jamal.bensafi@gmail.com - lF5rTy2WbS
khadija.benhassan@gmail.com - gH7nMx3PvK
rachida.belkacem@gmail.com - rY2tWp9LdM
abdelilah.benhaddou@gmail.com - sK4cXz8QmF
soukaina.benomar@gmail.com - bV6hJt3NwR
mourad.benjelloun@gmail.com - tM9xPv5ZsG
khalil.benfares@gmail.com - wC2rKt7HnX
hayat.bencheikh@gmail.com - jL5fNy8QcB
yassine.benabou@gmail.com - qX4sWp2RzT
chaimae.benziane@gmail.com - mK7vCt3YgF
faiza.benhamou@gmail.com - hT9xBn6PsV
mohcine.benchaabane@gmail.com - zC4rWm8LqJ
basma.benazzouz@gmail.com - vY2tFp5XkN
abderrahim.benchehida@gmail.com - dS6hJb3RzC
saadia.benhammou@gmail.com - rG8cXv4MnP
hamid.benmoussa@gmail.com - nB5tWy2QlF
asmahan.benkirane@gmail.com - pK7mSx9VjH
zineb.benzakour@gmail.com - xC3rPv6MtG
idriss.benammar@gmail.com - wL2nTp8RzK
karima.benali@gmail.com - qH5sWx9VmB
mehdi.benjeddou@gmail.com - tR7cXz4NpJ
meryam.benharda@gmail.com - fK3tPv6MsY
youssef.benrafiq@gmail.com - gV9mWx2QlR
hanane.benmohamed@gmail.com - zC5rTy8HbN
abderrazak.benamar@gmail.com - sX4nMt7WcP
samira.benchaoui@gmail.com - pR2vKt9FsG
nabil.benchakroun@gmail.com - mG6hJb3XsV
laila.benchekroun@gmail.com - tK8cPx5MvZ
tariq.benabdelkader@gmail.com - rY2tWp9LdM
amina.benbouzid@gmail.com - wC4sXz7QmF
rachid.benmessoud@gmail.com - bV3nHt8RzG
fadwa.benghazi@gmail.com - qL5fNy2XcP
ilyas.benali@gmail.com - pT7hJb5VxC
nora.benabdellah@gmail.com - mK3nWt9RzL
yassir.benmoussa@gmail.com - zQ8xCv6MnP
khadija.benjamaa@gmail.com - lF5rTy2WbS
imad.benbrahim@gmail.com - gH7nMx3PvK
saloua.benmokhtar@gmail.com - rY2tWp9LdM
taoufik.benazzouz@gmail.com - sK4cXz8QmF
malika.benfakih@gmail.com - bV6hJt3NwR
mostafa.benabdallah@gmail.com - tM9xPv5ZsG
batoul.benchekroun@gmail.com - wC2rKt7HnX
ayman.benomar@gmail.com - jL5fNy8QcB
assia.benjouhari@gmail.com - qX4sWp2RzT
mustapha.benamor@gmail.com - mK7vCt3YgF
rahma.benhamza@gmail.com - hT9xBn6PsV
ismael.benabbes@gmail.com - zC4rWm8LqJ
ghita.benmoussa@gmail.com - vY2tFp5XkN
kamal.benissa@gmail.com - dS6hJb3RzC
nour.benallal@gmail.com - rG8cXv4MnP
achraf.benhabib@gmail.com - nB5tWy2QlF
soukaina.benjelloul@gmail.com - pK7mSx9VjH
brahim.benkouider@gmail.com - xC3rPv6MtG
kawtar.benchelha@gmail.com - wL2nTp8RzK
mohamed.benmansour@gmail.com - qH5sWx9VmB
insaf.benabderrahmane@gmail.com - tR7cXz4NpJ
ayoub.benyoucef@gmail.com - fK3tPv6MsY
salma.benamara@gmail.com - gV9mWx2QlR
abdellatif.benaboud@gmail.com - zC5rTy8HbN
meriem.benamar@gmail.com - sX4nMt7WcP
younes.benlakhdar@gmail.com - pR2vKt9FsG
siham.benazzouza@gmail.com - mG6hJb3XsV
chakib.benhamou@gmail.com - tK8cPx5MvZ
zahra.benkirane@gmail.com - rY2tWp9LdM
taha.benmoussa@gmail.com - wC4sXz7QmF
najat.benammar@gmail.com - fK3tPv6MsY
habib.bencheikh@gmail.com - gV9mWx2QlR
lamya.benjellouli@gmail.com - zC5rTy8HbN
faisal.benmoumen@gmail.com - sX4nMt7WcP
maha.benabbes@gmail.com - pR2vKt9FsG
abdelhamid.benouazzani@gmail.com - mG6hJb3XsV
azzedine.benmokhtar@gmail.com - tK8cPx5MvZ
karim.benallal@gmail.com - rY2tWp9LdM
rajaa.benabderrahmane@gmail.com - wC4sXz7QmF
hamza.benjebbour@gmail.com - bV3nHt8RzG
faouzia.benmousa@gmail.com - qL5fNy2XcP
salim.benbouazza@gmail.com - pT7hJb5VxC
ikram.benabdelkader@gmail.com - mK3nWt9RzL
mouad.benjamaa@gmail.com - zQ8xCv6MnP
safae.benchehda@gmail.com - lF5rTy2WbS
faycal.benmohammed@gmail.com - gH7nMx3PvK
amina.benjelloul@gmail.com - rY2tWp9LdM
redouane.benmoumen@gmail.com - sK4cXz8QmF
souad.benabid@gmail.com - bV6hJt3NwR
hicham.benmokhtar@gmail.com - tM9xPv5ZsG
nabil.benallal@gmail.com - wC2rKt7HnX
youssef.benjouhari@gmail.com - jL5fNy8QcB
chaima.benabdelaziz@gmail.com - qX4sWp2RzT
aziz.benamra@gmail.com - mK7vCt3YgF
meryem.benmohamed@gmail.com - hT9xBn6PsV
abdellah.benjebbour@gmail.com - zC4rWm8LqJ
latifa.benabdeljalil@gmail.com - vY2tFp5XkN
said.benjelloun@gmail.com - dS6hJb3RzC
amina.benmoussa@gmail.com - rG8cXv4MnP
hassan.benchekroun@gmail.com - nB5tWy2QlF
naima.benouazzani@gmail.com - pK7mSx9VjH
jamal.benmoumen@gmail.com - xC3rPv6MtG
khadija.benallal@gmail.com - wL2nTp8RzK
rachida.benabderrahmane@gmail.com - qH5sWx9VmB
`;

function formatName(email: string): string {
  const username = email.split('@')[0];
  const parts = username.split(/[._-]/);
  return parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

async function registerFirebaseUserREST(email: string, pass: string, apiKey: string) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password: pass,
      returnSecureToken: true
    })
  });
  const data: any = await response.json();
  if (!response.ok && data.error?.message !== 'EMAIL_EXISTS') {
    throw new Error(data.error?.message || 'Firebase REST creation failed');
  }
  return data;
}

async function runImport() {
  const apiKey = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyBITCGLQUZXAaa3lhCqieUsNaR1fIanBV4';

  console.log('Connecting to database...');
  await connectDB();

  const lines = rawUsersList.trim().split('\n').filter(Boolean);
  console.log(`Starting import for ${lines.length} users...`);

  let firebaseSuccess = 0;
  let firebaseSkipped = 0;
  let mongoSuccess = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const [email, password] = line.split(' - ').map(s => s.trim());
    if (!email || !password) continue;

    const name = formatName(email);

    // 1. Firebase Authentication via REST API
    try {
      const fbRes = await registerFirebaseUserREST(email, password, apiKey);
      if (fbRes.error?.message === 'EMAIL_EXISTS') {
        firebaseSkipped++;
      } else {
        firebaseSuccess++;
      }
    } catch (fbErr: any) {
      console.warn(`[Firebase] ${email}: ${fbErr.message}`);
    }

    // 2. MongoDB Sync (User + Progress model)
    try {
      let existingUser = await User.findOne({ email: email.toLowerCase() });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newProgress = await Progress.create({
          xp: Math.floor(Math.random() * 500) + 100,
          streak: Math.floor(Math.random() * 7) + 1,
          skillMastery: new Map([
            ['Python Fundamentals', 0.6 + Math.random() * 0.3],
            ['Algorithms', 0.5 + Math.random() * 0.4]
          ]),
          learningProfile: {
            strengths: ['Algorithmic Thinking', 'Logic Syntax'],
            weaknesses: ['Data Structures'],
            preferredLanguage: 'fr'
          }
        });

        existingUser = await User.create({
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'student',
          progress: newProgress._id
        });
        mongoSuccess++;
      }
    } catch (dbErr: any) {
      console.error(`[MongoDB] ${email}: ${dbErr.message}`);
    }

    if ((i + 1) % 25 === 0 || i === lines.length - 1) {
      console.log(`Processed ${i + 1}/${lines.length} users... (Firebase Added: ${firebaseSuccess}, Firebase Existed: ${firebaseSkipped}, MongoDB Added: ${mongoSuccess})`);
    }
  }

  console.log('\n==========================================');
  console.log('🎉 IMPORT COMPLETE SUCCESS!');
  console.log(`Total Users Processed: ${lines.length}`);
  console.log(`Firebase Accounts Created: ${firebaseSuccess}`);
  console.log(`Firebase Accounts Existing: ${firebaseSkipped}`);
  console.log(`MongoDB Student Accounts Created: ${mongoSuccess}`);
  console.log('==========================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runImport().catch(err => {
  console.error('Fatal import error:', err);
  process.exit(1);
});
