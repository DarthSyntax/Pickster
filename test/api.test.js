const mocha = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const userRoutes = require("../routes/userRoutes");
const app = require("../app");
const server = require("../server");
const userController = require("../controllers/userController");
const assert = chai.assert;

chai.should();
chai.use(chaiHttp);

describe("API tests", () => {
  it("should return all users", (done) => {
    chai
      .request(app) // must request where app = express() is
      .get("/api/v1/users")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.results.should.be.a("array");
        res.body.results[0].should.have.property("_id");
        res.body.results[0].should.not.have.property("passwordConfirm");
        done();
      });
  });

  it("should return all pictures", (done) => {
    chai
      .request(app)
      .get("/api/v1/pics")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.equal("success");
        res.body.data[0].should.have.property("image");
        done();
      });
  });
});
