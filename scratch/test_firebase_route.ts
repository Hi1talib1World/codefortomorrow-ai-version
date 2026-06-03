async function testRoute() {
  try {
    console.log('Sending request to http://localhost:3000/api/auth/login...');
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'hichamtalibsat@gmail.com', password: 'somepassword' }),
    });

    const status = response.status;
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    console.log(`Status Code: ${status}`);
    console.log(`Content-Type: ${contentType}`);
    console.log(`Response body snippet: ${text.substring(0, 500)}`);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testRoute();
