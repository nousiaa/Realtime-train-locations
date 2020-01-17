/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import './side.css';

// Component for showing a table acting as a side bar,
// containing data of all trains that are in the system,
// and providing shortcuts to the map (e.g. jump to a selected train on map)
const Side = (props) => {
  const {
    hide,
    markers,
    chosenTrain,
    handleMarkerClick,
  } = props;
  // if table is hidden, return a empty div
  if (hide) return <div />;
  // else return our "sidebar"
  // that consists of a table that contains live train information about speeds,
  // destinations and names of the trains
  return (
    <table className="side-table">
      <tbody
        style={{
          display: 'block',
          height: `${window.innerHeight - 150}px`,
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
      >
        <tr>
          <th>Name</th>
          <th>Speed</th>
          <th>Destination</th>
        </tr>
        {markers.map((element, i) => {
          // set a gray background to the table row if the train listed on the row is selected
          let col = 'white';
          if (chosenTrain.id === element.id) col = 'gray';
          // construct the table one row at a time
          return (
            <tr key={i} style={{ backgroundColor: col }}>
              <td>
                <a
                  href="#a"
                  onClick={() => {
                    handleMarkerClick(element, true);
                  }}
                >
                  {element.name}
                </a>
              </td>
              <td>{element.speed}</td>
              <td>{element.destination}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
Side.propTypes = {
  hide: PropTypes.bool,
  markers: PropTypes.array,
  chosenTrain: PropTypes.object,
  handleMarkerClick: PropTypes.func,
};

Side.defaultProps = {
  hide: false,
  markers: [],
  chosenTrain: {},
  handleMarkerClick: null,
};

export default Side;
