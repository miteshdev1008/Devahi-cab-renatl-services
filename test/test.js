const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Customer Enquiry API Batch Tests', () => {
  before(async () => {
    // Clear the database or set up any necessary test data if needed before running the tests.
    // For example, you can use a test database or a test fixture.
    // Make sure you handle this part based on your application's database configuration.
  });

  after(async () => {
    // After running the tests, you can clean up any test data or resources if needed.
    // For example, you can drop the test database or delete test files.
  });

  describe('GET /api/v1/customer/getallinquiries', () => {
    it('should get all customer enquiries', async () => {
      // You may need to add some test enquiries to the database before testing this.
      // For example, you can use a test fixture to insert sample data.

      const res = await chai.request(app).get('/api/v1/customer/getallinquiries');
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success').to.equal(true);
      expect(res.body).to.have.property('data').to.be.an('array');
    });
  });
});

// ==>get allEnquiries test pass Result (Batch testing)
//   Customer Enquiry API Batch Tests
//     GET /api/v1/customer/getallinquiries
// app is connected with db successfully
//       ✔ should get all customer enquiries (358ms)
//   1 passing (444ms)
