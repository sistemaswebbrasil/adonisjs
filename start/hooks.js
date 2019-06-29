'use strict';

const { hooks } = require('@adonisjs/ignitor');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const Database = use('Database');
  const Hash = use('Hash');

  const passwordConfersFn = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return;
    }
    const [table, column] = args;
    const row = await Database.table(table)
      .where(column, data.id)
      .first();
    const isvalid = await Hash.verify(value, row.password);

    if (!isvalid) {
      throw Error('Invalid password');
    }
  };

  Validator.extend('passwordConfers', passwordConfersFn);
});
