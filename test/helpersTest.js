const { assert } = require('chai');

const { findUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUser', function() {
  // Testing an existence of an email in a database of users
  it('should return a user with valid email', function() {
    const user = findUser("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal( user.id, expectedUserID );
  });
  // Testing an non-existent email in a database of users
  it('should return undefined if email is not found', function() {
    const user = findUser("invalid@example.com", testUsers);
    const expectedUserID = undefined;
    assert.isUndefined( user, expectedUserID );
  });

});