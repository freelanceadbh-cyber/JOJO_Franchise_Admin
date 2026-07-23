async function testJsonSignin(email: string, pass: string) {
  console.log(`\nTesting JSON signin for ${email}...`);
  
  // 1. Fetch CSRF
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json() as { csrfToken: string };
  const csrfCookie = csrfRes.headers.getSetCookie()
    .map(c => c.split(';')[0])
    .join('; ');

  // 2. Post JSON signin
  const body = {
    email,
    password: pass,
    csrfToken: csrfData.csrfToken,
    callbackUrl: 'http://localhost:3000',
    json: 'true'
  };

  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', pass);
  params.append('csrfToken', csrfData.csrfToken);
  params.append('callbackUrl', 'http://localhost:3000');

  const signinRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': csrfCookie,
    },
    body: params.toString(),
  });

  console.log('Status:', signinRes.status);
  console.log('Set-Cookie:', signinRes.headers.getSetCookie());
  console.log('Body:', await signinRes.text());
}

async function run() {
  await testJsonSignin('admin@jojo.com', 'AdminPassword123');
  await testJsonSignin('franchise1@jojo.com', 'FranchisePassword123');
}

run();
