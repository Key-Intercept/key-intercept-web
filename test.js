async function test() {
  const r = await fetch('http://localhost:4321/wiki?config=123', { redirect: 'manual' });
  console.log(r.status, r.headers.get('location'));
}
test();
