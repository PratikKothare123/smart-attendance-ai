require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Subject = require('./models/Subject');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  if(!await User.findOne({ email:'admin@sbjain.edu' })){
    await User.create({ name:'Super Admin',email:'admin@sbjain.edu',password:'Admin@123',role:'admin' });
    console.log('✅ Admin: admin@sbjain.edu / Admin@123');
  } else { console.log('ℹ️  Admin exists'); }

  const subs=[
    { name:'Data Structures',code:'CS301',department:'CSE',semester:'Sem 5',year:'3rd Year' },
    { name:'DBMS',code:'CS302',department:'CSE',semester:'Sem 5',year:'3rd Year' },
    { name:'Operating Systems',code:'CS303',department:'CSE',semester:'Sem 5',year:'3rd Year' },
    { name:'Machine Learning',code:'CS401',department:'CSE',semester:'Sem 6',year:'3rd Year' },
    { name:'Computer Networks',code:'CS402',department:'CSE',semester:'Sem 6',year:'3rd Year' },
    { name:'Web Technologies',code:'CS403',department:'CSE',semester:'Sem 6',year:'3rd Year' },
    { name:'Software Engineering',code:'CS404',department:'CSE',semester:'Sem 6',year:'3rd Year' },
    { name:'Digital Electronics',code:'EC301',department:'ECE',semester:'Sem 5',year:'3rd Year' },
    { name:'Engineering Maths',code:'MA101',department:'CSE',semester:'Sem 1',year:'1st Year' },
  ];
  let added=0;
  for(const s of subs){ if(!await Subject.findOne({ code:s.code })){ await Subject.create(s); added++; } }
  console.log(`✅ ${added} subjects added`);
  await mongoose.disconnect();
  console.log('\n🎉 Done! Run: npm run dev');
}
seed().catch(e=>{ console.error(e); process.exit(1); });
