// Standalone API Test Runner (Pure JavaScript / Node.js)
// Executes the complete Restful-Booker CRUD cycle and asserts status codes

const BASE_URL = 'https://restful-booker.herokuapp.com';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  ${colors.green}✔ PASS:${colors.reset} ${testName}`);
  } else {
    failed++;
    console.error(`  ${colors.red}✖ FAIL:${colors.reset} ${testName} ${details ? `(${details})` : ''}`);
  }
}

async function runApiTestSuite() {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  Restful-Booker API Automated Test Suite (CRUD)    ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

  let authToken = '';
  let createdBookingId = null;

  try {
    // 01. Health Check
    console.log(`${colors.bold}[Step 1] Server Health Ping${colors.reset}`);
    const pingRes = await fetch(`${BASE_URL}/ping`);
    assert(pingRes.status === 201, 'GET /ping returns 201 Created');

    // 02. Authentication
    console.log(`\n${colors.bold}[Step 2] User Authentication (Token Generation)${colors.reset}`);
    const authRes = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password123' })
    });
    assert(authRes.status === 200, 'POST /auth returns 200 OK');
    const authData = await authRes.json();
    authToken = authData.token;
    assert(typeof authToken === 'string' && authToken.length > 5, 'Auth token received successfully', `Token: ${authToken}`);

    // 03. Create Booking
    console.log(`\n${colors.bold}[Step 3] Create Hotel Booking (POST /booking)${colors.reset}`);
    const bookingPayload = {
      firstname: 'Anzar',
      lastname: 'Ali',
      totalprice: 250,
      depositpaid: true,
      bookingdates: {
        checkin: '2026-10-15',
        checkout: '2026-10-20'
      },
      additionalneeds: 'Breakfast'
    };

    const createRes = await fetch(`${BASE_URL}/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(bookingPayload)
    });
    assert(createRes.status === 200, 'POST /booking returns 200 OK');
    const createData = await createRes.json();
    createdBookingId = createData.bookingid;
    assert(typeof createdBookingId === 'number', 'Booking ID generated dynamically', `ID: ${createdBookingId}`);
    assert(createData.booking.firstname === 'Anzar', 'Guest first name is Anzar');
    assert(createData.booking.totalprice === 250, 'Total price is 250');

    // 04. Read Booking by ID
    console.log(`\n${colors.bold}[Step 4] Read Booking Details (GET /booking/${createdBookingId})${colors.reset}`);
    const getRes = await fetch(`${BASE_URL}/booking/${createdBookingId}`, {
      headers: { 'Accept': 'application/json' }
    });
    assert(getRes.status === 200, `GET /booking/${createdBookingId} returns 200 OK`);
    const getData = await getRes.json();
    assert(getData.lastname === 'Ali', 'Guest last name matches Ali');
    assert(getData.depositpaid === true, 'Deposit paid status is true');

    // 05. Update Booking (Full Update via PUT)
    console.log(`\n${colors.bold}[Step 5] Update Booking with Auth Token (PUT /booking/${createdBookingId})${colors.reset}`);
    const updatedPayload = {
      ...bookingPayload,
      totalprice: 350,
      bookingdates: { checkin: '2026-10-15', checkout: '2026-10-25' },
      additionalneeds: 'Breakfast and Sea View'
    };
    const updateRes = await fetch(`${BASE_URL}/booking/${createdBookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${authToken}`
      },
      body: JSON.stringify(updatedPayload)
    });
    assert(updateRes.status === 200, `PUT /booking/${createdBookingId} returns 200 OK`);
    const updateData = await updateRes.json();
    assert(updateData.totalprice === 350, 'Updated price is 350');
    assert(updateData.bookingdates.checkout === '2026-10-25', 'Updated checkout date is 2026-10-25');

    // 06. Partial Update (PATCH)
    console.log(`\n${colors.bold}[Step 6] Partial Update (PATCH /booking/${createdBookingId})${colors.reset}`);
    const patchRes = await fetch(`${BASE_URL}/booking/${createdBookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${authToken}`
      },
      body: JSON.stringify({ additionalneeds: 'VIP Lounge & Airport Transfer' })
    });
    assert(patchRes.status === 200, `PATCH /booking/${createdBookingId} returns 200 OK`);
    const patchData = await patchRes.json();
    assert(patchData.additionalneeds === 'VIP Lounge & Airport Transfer', 'Additional needs updated via PATCH');

    // 07. Delete Booking
    console.log(`\n${colors.bold}[Step 7] Delete Booking (DELETE /booking/${createdBookingId})${colors.reset}`);
    const deleteRes = await fetch(`${BASE_URL}/booking/${createdBookingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${authToken}`
      }
    });
    assert(deleteRes.status === 201, `DELETE /booking/${createdBookingId} returns 201 Created`);

    // 08. Negative Test: Verify Resource Deletion
    console.log(`\n${colors.bold}[Step 8] Negative Test: Verify Deleted Resource (GET /booking/${createdBookingId})${colors.reset}`);
    const verifyDeleteRes = await fetch(`${BASE_URL}/booking/${createdBookingId}`);
    assert(verifyDeleteRes.status === 404, `GET /booking/${createdBookingId} returns 404 Not Found as expected`);

    // 09. Negative Test: Unauthorized Deletion
    console.log(`\n${colors.bold}[Step 9] Negative Test: Unauthorized Deletion Blocked${colors.reset}`);
    const unauthDeleteRes = await fetch(`${BASE_URL}/booking/1`, {
      method: 'DELETE',
      headers: { 'Cookie': 'token=fake_invalid_token' }
    });
    assert(unauthDeleteRes.status === 403, 'DELETE with invalid token returns 403 Forbidden');

  } catch (err) {
    console.error(`\n${colors.red}Test Execution Error:${colors.reset}`, err.message);
    failed++;
  }

  console.log(`\n${colors.bold}====================================================${colors.reset}`);
  console.log(`Total Assertions Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`Total Assertions Failed: ${failed > 0 ? colors.red + failed : colors.green + '0'}${colors.reset}`);
  console.log(`${colors.bold}====================================================\n${colors.reset}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runApiTestSuite();
