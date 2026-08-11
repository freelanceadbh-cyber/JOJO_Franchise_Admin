(async () => {
  try {
    const url = 'http://localhost:3000/portal/orders/3cbe03d9-12a0-4256-b926-9fbf9655d38f/invoice/pdf';
    console.log('Requesting', url);
    const res = await fetch(url, { method: 'GET' });
    console.log('Status:', res.status);
    console.log('Headers:');
    for (const [k,v] of res.headers) {
      console.log(k+':', v);
    }
    const buf = await res.arrayBuffer();
    console.log('Body length:', buf.byteLength);
    const text = new TextDecoder().decode(buf.slice(0, 2000));
    console.log('\n--- Body snippet (first 2000 chars) ---\n');
    console.log(text);
  } catch (err) {
    console.error('Request failed:', err);
    process.exitCode = 1;
  }
})();
