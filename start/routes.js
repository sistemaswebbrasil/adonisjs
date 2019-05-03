'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => ({ greeting: 'Hello world in JSON' }));

Route.group(() => {
  Route.post('login', 'AuthController.login').middleware('guest');

  Route.post('signup', 'AuthController.signup').middleware('guest');

  Route.get('profile', 'AuthController.profile').middleware('auth');

  Route.resource('users', 'UserController')
    .apiOnly()
    .middleware('auth');
}).prefix('api/');
