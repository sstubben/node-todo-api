const request = require('supertest')
const {MongoClient, ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text'

    request(app)
      .post('/todos')
      .send({
        text: text
      })
      .expect(200)
      .expect((res) =>{
        expect(res.body.text).toBe(text)
      })
      .end((err,res) => {
        if (err) {
          return done(err);
        }
        Todo.find({text: 'Test todo text'}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((e) => done(e))
      })
  })

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end(done)
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      }).end(done)
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(todos[0].text)
      })
      .end(done)
  });

  it('should return 404 if todo not found', (done) => {
    var nonExistingId = new ObjectID()
    request(app)
      .get(`/todos/${nonExistingId.toHexString()}`)
      .expect(404, done)
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/1234`)
      .expect(404, done)
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString()

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeNull()
          done()
        }).catch((e) => done(e))
      })
  });

  it('should return 404 if todo not found', (done) => {
    var nonExistingId = new ObjectID()
    request(app)
      .delete(`/todos/${nonExistingId.toHexString()}`)
      .expect(404, done)
  });

  it('should return 404 if objectID is invalid', (done) => {
    request(app)
      .delete(`/todos/1234`)
      .expect(404, done)
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString()
    var text = 'Updated todo text'

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text)
        expect(res.body.todo.completed).toBeTruthy()
        expect(typeof res.body.todo.completedAt).toBe('number')
      })
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(text)
          expect(todo.completed).toBeTruthy()
          expect(typeof todo.completedAt).toBe('number')
          done()
        }).catch((e) => done(e))
      })
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString()
    var text = 'New updated text'

    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        text: text,
        completed: false
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(text)
          expect(todo.completed).toBeFalsy()
          expect(todo.completedAt).toBeNull()
          done()
        }).catch((e) => done(e))
      })
  });
})


describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'testUser@stubben.com'
    var password = '1234abcd'
    request(app)
      .post('/users')
      .send({
        email: email,
        password: password
      })
      .expect(200)
      .expect((res) =>{
        expect(res.headers['x-auth']).toBeDefined()
        expect(res.body._id).toBeDefined()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(done)
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeDefined();
          expect(user.password).not.toBe(password)
          done()
        })
      })
  })

  it('should return validation errors if request invalid', (done) => {
    var email = 'wrongEmail'
    var password = '123'
    request(app)
      .post('/users')
      .send({
        email: email,
        password: password
      })
      .expect(400)
      .end(done)
  })

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(400)
      .end(done)
  })
})

describe("POST /users/login", () => {
  it("should login user and return auth token", (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeDefined()
      })
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens[0]).toMatchObject({
            access: 'auth',
            token: expect.any(String)
          })
          done()
        }).catch((e) => done(e))
      })
  });

  it("should reject invalid login", (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'veryBadAndInvalidPassword'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeUndefined()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0)
        })
        done()
      }).catch((e) => done(e))
  });
});
