const { expect } = require('chai');
const sinon = require('sinon').createSandbox();

const User = require('@/models/User');
const { getDbInstance, dbCleanup } = require('@/db');

const UserController = require('../user');

describe('User Controller Integration Tests', () => {
  before(async () => {
    await getDbInstance();
  });

  after(async () => {
    await dbCleanup();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('create method', () => {
    it('should create a new user', async () => {
      const mockBody = { name: 'New User', description: 'A new user' };
      const req = { body: mockBody };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      await UserController.create(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch(mockBody)).to.be.true;
    });
  });

  describe('get method', () => {
    it('should retrieve list of users', async () => {
      const mockBody = { name: 'New User', description: 'A new user' };
      const req = { body: mockBody };
      const createRes = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await UserController.create(req, createRes);
      await UserController.create(req, createRes);

      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      await UserController.get(req, res);

      const firstCallArg = res.json.firstCall.args[0];
      expect(firstCallArg).to.be.an('array').with.lengthOf(2);
      expect(firstCallArg[0]).to.be.an('object').that.includes(mockBody);
    });
  });

  describe('findById method', () => {
    it('should find user', async () => {
      const mockBody = { name: 'New User', description: 'A new user' };
      const createReq = { body: mockBody };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      await UserController.create(createReq, res);
      const newUser = res.json.firstCall.args[0];

      const findReq = {
        params: {
          id: newUser.id,
        },
      };
      await UserController.findById(findReq, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch(mockBody)).to.be.true;
    });

    it('should return 404 on not found user', async () => {
      const mockBody = { name: 'New User', description: 'A new user' };
      const req = {
        body: mockBody,
        params: {
          id: 1,
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      await UserController.findById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});
