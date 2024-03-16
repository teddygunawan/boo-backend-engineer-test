const { expect } = require('chai');
const mongoose = require('mongoose');
const sinon = require('sinon').createSandbox();

const Comment = require('@/models/Comment');
const User = require('@/models/User');
const { getDbInstance, dbCleanup } = require('@/db');

const CommentController = require('../comment');

const { ObjectId } = mongoose.Types;

describe('Comment Controller Integration Tests', () => {
  before(async () => {
    await getDbInstance();
  });

  after(async () => {
    await dbCleanup();
  });

  describe('create method', () => {
    let mockBody;
    let req;
    let res;

    beforeEach(() => {
      mockBody = {
        commenter_id: new ObjectId(),
        user_id: new ObjectId(),
        content: 'I love this guy',
        personality: {
          mbti: 'INFP',
          enneagram: '1w2',
        },
      };
      req = {
        body: mockBody,
      };
      res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    });

    afterEach(async () => {
      await Comment.deleteMany({});
      sinon.restore();
    });

    it('should create a new comment', async () => {
      sinon.stub(User, 'find').returns({
        lean: sinon
          .stub()
          .resolves([{ _id: mockBody.commenterId }, { _id: mockBody.userId }]),
      });

      await CommentController.create(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWithMatch(mockBody)).to.be.true;
    });

    it('should forbid creating comment with non-existing user ids', async () => {
      sinon.stub(User, 'find').returns({
        lean: sinon.stub().resolves([{ _id: mockBody.userId }]),
      });

      await CommentController.create(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should forbid creating comment with invalid personality mbti', async () => {
      mockBody.personality.mbti = 'WRONG MBTI';
      sinon.stub(User, 'find').returns({
        lean: sinon
          .stub()
          .resolves([{ _id: mockBody.commenterId }, { _id: mockBody.userId }]),
      });

      await CommentController.create(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ error: 'ValidationError' })).to.be.true;
    });
  });

  describe('findByUserId method', () => {
    let req;
    let res;
    let userId;
    let firstCommentMock;
    let secondCommentMock;
    before(async () => {
      sinon.stub(User, 'find').returns({
        lean: sinon
          .stub()
          .resolves([{ _id: new ObjectId() }, { _id: new ObjectId() }]),
      });

      userId = new ObjectId();
      firstCommentMock = {
        commenter_id: new ObjectId(),
        user_id: userId,
        content: 'I love this guy',
        personality: {
          mbti: 'INFP',
          enneagram: '1w2',
        },
      };
      const firstJsonStub = sinon.stub();
      secondCommentMock = {
        commenter_id: new ObjectId(),
        user_id: userId,
        content: 'I love this guy',
        personality: {
          mbti: 'ENTJ',
          enneagram: '1w2',
        },
      };

      await CommentController.create(
        { body: firstCommentMock },
        { status: sinon.stub().returnsThis(), json: firstJsonStub }
      );
      await CommentController.create(
        { body: secondCommentMock },
        { status: sinon.stub().returnsThis(), json: sinon.stub() }
      );

      await CommentController.likeComment(
        {
          body: {
            userId: secondCommentMock.commenter_id,
          },
          params: {
            commentId: firstJsonStub.firstCall.args[0].id,
          },
        },
        { status: sinon.stub().returnsThis(), json: sinon.stub() }
      );
    });

    after(async () => {
      await Comment.deleteMany({});
      sinon.restore();
    });

    beforeEach(() => {
      req = {
        params: {
          userId,
        },
        query: {
          sortBy: '',
          filterBy: '',
        },
      };
      res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    });
    it('should retrieve list of comments for a user', async () => {
      await CommentController.findByUserId(req, res);

      const firstCallArg = res.json.firstCall.args[0];
      console.log(firstCallArg);
      expect(firstCallArg).to.be.an('array').with.lengthOf(2);
      expect(firstCallArg[0]).to.deep.includes(secondCommentMock);
      expect(firstCallArg[1]).to.deep.includes(firstCommentMock);
    });

    it('should retrieve list of comments for a user sorted by best', async () => {
      req.query.sortBy = 'best';
      await CommentController.findByUserId(req, res);
      const firstCallArg = res.json.firstCall.args[0];
      console.log(firstCallArg);
      expect(firstCallArg).to.be.an('array').with.lengthOf(2);
      expect(firstCallArg[0]).to.deep.includes(firstCommentMock);
      expect(firstCallArg[1]).to.deep.includes(secondCommentMock);
    });

    it('should filter comment correctly', async () => {
      req.query.filterBy = {
        mbti: 'INFP',
      };
      await CommentController.findByUserId(req, res);
      const firstCallArg = res.json.firstCall.args[0];

      expect(firstCallArg).to.be.an('array').with.lengthOf(1);
      expect(firstCallArg[0]).to.deep.includes(firstCommentMock);
    });
  });
});
