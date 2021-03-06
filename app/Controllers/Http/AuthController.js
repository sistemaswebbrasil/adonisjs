'use strict';

const User = use('App/Models/User');
const { validateAll } = use('Validator');

class AuthController {
  async login ({ request, auth, response }) {
    const rules = {
      email: 'required|email',
      password: 'required'
    };
    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const { email, password } = request.all();
    const tokenObject = await auth.attempt(email, password);
    const user = await User.findBy('email', email);
    const { token } = tokenObject;
    const resp = { user: { username: user.username, email: user.email }, token };

    return resp;
  }

  async profile ({ auth }) {
    // eslint-disable-next-line camelcase
    const { id, username, email, created_at, updated_at } = auth.user;

    return { id, username, email, created_at, updated_at };
  }

  async signup ({ request, response }) {
    const rules = {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    };
    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const data = request.only(['username', 'email', 'password']);
    const user = await User.create(data);

    return user;
  }

  async findByUsername ({ params }) {
    const { username } = params;
    const user = await User.findByOrFail('username', username);
    return user;
  }

  async findByEmail ({ params }) {
    const { email } = params;
    const user = await User.findByOrFail('email', email);
    return user;
  }
}

module.exports = AuthController;
