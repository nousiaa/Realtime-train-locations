/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

// Component for showing information about the selected train
const Info = (props) => {
  const { markers, chosenTrain } = props;
  // get the latest data for the chosen train
  const train = markers.find(a => a.id === chosenTrain.id);

  // only display info if we have selected a train
  if (train != null) {
    // return data
    return (
      <div style={{ float: 'right', marginRight: '2em' }}>
        Train info:
        <strong> Name:</strong>
        {train.name}
        <strong> Destination: </strong>
        {train.destination}
        <strong> Speed: </strong>
        {train.speed}
      </div>
    );
  }
  // no train selected, return empty div
  return <div />;
};
Info.propTypes = {
  chosenTrain: PropTypes.bool,
  markers: PropTypes.array,
};

Info.defaultProps = {
  markers: [],
  chosenTrain: {},
};
export default Info;
