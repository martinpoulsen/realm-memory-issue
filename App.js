/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {createRealmInstance} from './realm';

const routePointStub = {
  lat: 11.11111,
  lon: 22.22222,
  alt: null,
  accuracy: 5,
  speed: -1,
  course: null,
  battery: -1,
  invalid: null,
  deletedAt: null,
};

const tripStub = {
  route: [],
};

const getRoutePointUUID = id => `AAAAAAAA-AAAA-AAAA-AAAA-${id}`;

const RealmMemoryIssue = () => {
  let i = 0;
  useEffect(() => {
    console.log('App mount');
    const realm = createRealmInstance();

    const tripId = `trip_id_${new Date().getTime()}`;

    realm.write(() => {
      realm.create(
        'Trip',
        {
          ...tripStub,
          id: tripId,
        },
        true,
      );
    });

    const interval = setInterval(() => {
      const trip = realm.objects('Trip').filtered(`id == "${tripId}"`)[0];
      console.log(
        'retrieved trip',
        trip.id, // without any route logging/stringifying // 1300 rp ~ 115 MB native memory usage
        // JSON.stringify(trip.route.map(rp => rp.id)), // 1300 rp ~ 250 MB native memory usage
        JSON.stringify(trip.route), // 1300 rp ~ 800 MB native memory usage (less than 100 MB for realm v. 10.2.0)
      );

      const newRoute = Array.from(trip.route);
      const routePointId = getRoutePointUUID(i++);
      newRoute.push({
        ...routePointStub,
        id: routePointId,
        time: new Date(),
      });

      realm.write(() => {
        realm.create(
          'Trip',
          {
            id: trip.id,
            updatedAt: new Date(),
            route: newRoute,
          },
          true,
        );
      });
      console.log('added route point to realm: ', routePointId);
    }, 500);

    return () => {
      console.log('App unmount');
      clearInterval(interval);
    };
  }, []);
  return <Text>Realm Memory Issue</Text>;
};

const App: () => Node = () => {
  return (
    <SafeAreaView>
      <StatusBar barStyle={'light-content'} />
      <RealmMemoryIssue />
    </SafeAreaView>
  );
};

export default App;
