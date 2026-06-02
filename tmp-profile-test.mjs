const baseUrl = 'http://localhost:3000';
const email = `test_${Date.now()}@codefortomorrow.com`;
const password = 'Test1234!';

(async () => {
  try {
    const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password, role: 'student' }),
    });

    console.log('REGISTER STATUS', registerRes.status);
    const registerText = await registerRes.text();
    console.log('REGISTER DATA', registerText);
    if (registerRes.status !== 201) return;

    const parsed = JSON.parse(registerText);
    const token = parsed.token;
    const setCookie = registerRes.headers.get('set-cookie');
    console.log('SET-COOKIE', setCookie);
    const cookie = setCookie ? setCookie.split(';')[0] : '';

    const profileRes = await fetch(`${baseUrl}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Cookie: cookie,
      },
      body: JSON.stringify({ profilePictureUrl: 'https://example.com/avatar.png' }),
    });

    console.log('PROFILE STATUS', profileRes.status);
    const profileText = await profileRes.text();
    console.log('PROFILE RESPONSE', profileText);

    const meRes = await fetch(`${baseUrl}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: cookie,
      },
    });

    console.log('ME STATUS', meRes.status);
    const meText = await meRes.text();
    console.log('ME RESPONSE', meText);
  } catch (error) {
    console.error('TEST ERROR', error);
  }
})();