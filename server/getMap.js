import request from 'request';

// variable used to store train locations coming from https://rata.digitraffic.fi/api/v1/train-locations/latest/
let markersExt = [
  {
    id: 0,
    speed: 0,
    name: 'Helsinki',
    destination: 'Unknown',
    coordinates: [24.945831, 60.192059],
  },
];

// keep the data from digitraffic up to date
// (gets a copy of the data, and serves it forwards in our format,
// this reduces amount of requests to the digitraffic api)
function fetchTrains() {
  // request data from digitraffic
  request(
    'https://rata.digitraffic.fi/api/v1/train-locations/latest/',
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      // generate our new train locations
      markersExt = body.map(x => ({
        id: x.trainNumber,
        speed: x.speed,
        destination: 'Unknown',
        name: `Juna ${x.trainNumber}`,
        coordinates: x.location.coordinates,
      }));
      return true;
    },
  );
  // return the latest train locations
}

// variable for storing train data coming from our own api ( /api/trains/:id/location )
const markersInt = [];

function isNumber(arg) {
  return typeof arg === 'number';
}
function isString(arg) {
  return typeof arg === 'string';
}

module.exports = {
  // start fetching train data from external source
  startTrainFetch() {
    setInterval(fetchTrains, 2000);
  },
  // return a list of train locations that are from digitraffic
  getMapData() {
    return markersExt;
  },
  // return a list of train locations that are from our own api
  getMapDataFromOwnApi() {
    return markersInt;
  },
  // update train locations in markersInt
  updateTrainFromApi(id, train) {
    // does the wanted train already exist?
    const mod = markersInt.findIndex(e => e.id === id);
    // check that we have all the data we want
    if (
      isNumber(train.id)
      && isNumber(train.speed)
      && isString(train.name)
      && isString(train.destination)
      && Array.isArray(train.coordinates)
    ) {
      // do we have the necessary coordinates?
      if (isNumber(train.coordinates[0]) && isNumber(train.coordinates[1])) {
        // train doesn't exist, create it and remove any extra fields the object might contain
        // also, swap the train coordinates around to make api compatible
        // with the internal structure of the server
        if (mod === -1) {
          markersInt.push({
            id: train.id,
            speed: train.speed,
            name: train.name,
            destination: train.destination,
            coordinates: [train.coordinates[1], train.coordinates[0]],
          });
          // we created something, return 201
          return 201;
        }
        // train exists, update it
        markersInt[mod] = {
          id: train.id,
          speed: train.speed,
          name: train.name,
          destination: train.destination,
          coordinates: [train.coordinates[1], train.coordinates[0]],
        };
        // we updated something, return 200
        return 200;
      }
    }
    // update failed, return 400
    return 400;
  },
};
