import Realm from 'realm';

const tripSchema = {
  name: 'Trip',
  primaryKey: 'id',
  properties: {
    id: 'string',
    updatedAt: {type: 'date', optional: true, default: new Date()},
    route: {
      type: 'list',
      objectType: 'RoutePoint',
    },
  },
};

const routePointSchema = {
  name: 'RoutePoint',
  primaryKey: 'id',
  properties: {
    id: 'string',
    lat: 'double',
    lon: 'double',
    time: {type: 'date', optional: true},
    alt: {type: 'int', optional: true},
    accuracy: {type: 'int', optional: true},
    speed: {type: 'int', optional: true},
    course: {type: 'int', optional: true},
    battery: {type: 'double', optional: true},
    invalid: {type: 'int', optional: true},
    deletedAt: {type: 'date', optional: true},
  },
};

const schema = [tripSchema, routePointSchema];
const schemaVersion = 1;
const migration = (oldRealm, newRealm) => {};

export const createRealmInstance = () => {
  const config = {
    schema,
    schemaVersion,
    path: 'realmfile',
    migration,
  };
  return new Realm(config);
};
