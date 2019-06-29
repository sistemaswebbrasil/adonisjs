'use strict';

const Hash = use('Hash');
const User = use('App/Models/User');
const { validateAll } = use('Validator');

class UserController {
  async index () {
    const users = User.all();

    return users;
  }

  async store ({ request, response }) {
    const rules = {
      email: 'required|email|unique:users,email',
      username: 'required|unique:users,username',
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

  async show ({ params }) {
    const user = await User.findOrFail(params.id);

    return user;
  }

  async update ({ params, request, response }) {
    const { id } = params;
    const rules = {
      email: `required|email|unique:users,email,id,${id}`,
      username: `required|unique:users,username,id,${id}`
    };
    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }

    const user = await User.findOrFail(id);
    const data = request.only(['username', 'email']);

    user.merge(data);
    await user.save();
    return user;
  }

  async changePassword ({ request, response }) {
    const rules = {
      id: 'required',
      currentPassword: 'required|passwordConfers:users,id',
      password: 'required',
      passwordConfirm: 'required|same:password'
    };
    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(422).json(validation.messages());
    }
    const data = request.only(['id', 'password']);
    data.password = await Hash.make(data.password);
    const user = await User.findOrFail(data.id);
    user.merge(data);
    await user.save();
    return user;
  }

  async destroy ({ params }) {
    const user = await User.findOrFail(params.id);

    await user.delete();
  }
}

module.exports = UserController;
