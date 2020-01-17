/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Markers,
  Marker,
} from 'react-simple-maps';
import './map.css';
import Side from './side';
import Info from './info';

export default class Map extends Component {
  // bind our functions and set our initial state variables
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
    this.toggleSide = this.toggleSide.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.changeDataSource = this.changeDataSource.bind(this);
    this.MOVE = this.MOVE.bind(this);
    this.state = {
      row: 0,
      dataSource: false,
      center: [24.945831, 60.192059],
      dataText: 'PUT API',
      listText: 'Hide list',
      sideHide: false,
      chosenTrain: {},
      key: props.cookies.get('key'),
      markers: [],
      zoom: 0.3,
      intId: 0,
      scale: 10000,
      mapAddr: '/2gadm36_FIN.json',
      dop: false,
    };
  }

  // attach listeners and set api polling interval on load
  componentDidMount() {
    const { cookies } = this.props;
    // resize listener
    window.addEventListener('resize', this.updateDimensions);
    // if user is logged in set api polling interval
    if (cookies.get('user') && cookies.get('key')) {
      // save the interval id for later
      this.setState({
        intId: setInterval(this.MOVE, 2000),
      });
    }
  }

  // user moved away from this page, clear any listeners and intervals we have set
  componentWillUnmount() {
    const { intId } = this.state;
    window.removeEventListener('resize', this.updateDimensions);
    clearInterval(intId);
  }

  // handle issues caused by window resizing (for example, the map and markers getting out of sync)
  updateDimensions() {
    // small workaround for situations where the window size is
    // so small that text gets wordwrapped too much
    let row = 0;
    if (window.innerWidth < 660) row = 40;

    // workaround on map getting out of sync with markers on reload
    // (force map to update its geometry)
    this.setState({
      row,
      dop: true,
    });
    this.setState({
      dop: false,
    });
  }

  // handle hiding and showing the side panel
  toggleSide() {
    const { sideHide } = this.state;
    // toggle the text shown on the side panel button
    let text = 'Show list';
    if (sideHide) text = 'Hide list';
    // hide the panel
    this.setState({
      sideHide: !sideHide,
      listText: text,
    });
  }

  // handle toggling the source for the incoming train information
  // (EXT = digitraffic, PUT = PUT API from own server)
  changeDataSource() {
    const { dataSource } = this.state;
    // toggle text on button
    let text = 'EXT API';
    if (dataSource) text = 'PUT API';
    // clear all train related variables before changing source
    this.setState({
      chosenTrain: {},
      markers: [],
      dataText: text,
      dataSource: !dataSource,
    });
  }

  // get the latest train location data from the server,
  // this function in bound to the setInterval mentioned earlier
  MOVE() {
    const { apiAddress, signOut } = this.props;
    const {
      key,
      dataSource,
      markers,
      chosenTrain,
    } = this.state;
    // get the latest train location data
    fetch(`${apiAddress}/api/mapData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // authenticate with key, also tell server, which source we want to use for our incoming data
      body: JSON.stringify({ key, dataSource }),
    })
      .then(result => result.json())
      .then((res2) => {
        if (res2.success) {
          // if query succeeds, update the train location data that we have in memory
          this.setState({
            markers: res2.result,
          });
        } else {
          signOut();
        }
        return true;
      });
    // update values used by other components to force them to update
    this.setState({
      markers,
      chosenTrain,
    });
  }

  // handle zooming on the map with the scroll wheel with a more
  // fitting multiplier than when zooming with buttons
  handleScroll(e) {
    const { zoom } = this.state;
    if (e.deltaY < 0) {
      this.setState({
        zoom: zoom * 1.1,
      });
    } else if (e.deltaY > 0) {
      this.setState({
        zoom: zoom / 1.1,
      });
    }
  }

  // handle zooming in with the zoom in button
  handleZoomIn() {
    const { zoom } = this.state;
    this.setState({
      zoom: zoom * 2,
    });
  }

  // handle zooming out with the zoom out button
  handleZoomOut() {
    const { zoom } = this.state;
    if (zoom > 0) {
      this.setState({
        zoom: zoom / 2,
      });
    }
  }

  // handle clicking on a train location on the map
  handleMarkerClick(train, move) {
    const { chosenTrain } = this.state;
    // if the clicked train was already selected, deselect it
    if (chosenTrain.id === train.id) {
      this.setState({
        chosenTrain: {},
      });
    } else {
      // else set train as selected

      // if train was clicked from the side panel, zoom in on the
      // train on the map (is move set to true?)
      if (move) {
        this.setState({
          zoom: 1.2,
          center: train.coordinates,
        });
      }
      this.setState({
        chosenTrain: train,
      });
    }
  }

  // render the map page
  render() {
    const {
      listText,
      dataText,
      chosenTrain,
      markers,
      sideHide,
      row,
      scale,
      zoom,
      center,
      mapAddr,
      dop,
    } = this.state;
    const { cookies, signOut } = this.props;
    // if user is not logged in, redirect them to the login page
    if (!cookies.get('user') || !cookies.get('key')) {
      signOut();
      return <Redirect to="/login" />;
    }
    // render the map and related components
    return (
      <div>
        <button type="button" className="map-button link-button" onClick={this.toggleSide}>
          {listText}
        </button>
        <button type="button" className="map-button link-button" onClick={this.handleZoomOut}>
          {'Zoom out'}
        </button>
        <button type="button" className="map-button link-button" onClick={this.handleZoomIn}>
          {'Zoom in'}
        </button>
        <button type="button" className="link-button" onClick={this.changeDataSource}>
          {`Data source: ${dataText}`}
        </button>
        <span style={{ fontSize: '10px' }}>
          &lt;- CLICK HERE TO TOGGLE TRAINS DISPLAYED BETWEEN PUT API AND DIGITRAFFIC
        </span>
        <Info chosenTrain={chosenTrain} markers={markers} />

        <Side
          markers={markers}
          chosenTrain={chosenTrain}
          hide={sideHide}
          handleMarkerClick={this.handleMarkerClick}
        />
        <div onWheel={this.handleScroll}>
          <ComposableMap
            style={{ float: 'right', backgroundColor: 'gray' }}
            width={window.innerWidth}
            height={window.innerHeight - 100 - row}
            projectionConfig={{ scale }}
          >
            <ZoomableGroup zoom={zoom} center={center}>
              <Geographies geography={mapAddr} disableOptimization={dop}>
                {(geographies, projection) => geographies.map((geography, i) => (
                  // load the map data from map file (TopoJSON format)
                  <Geography
                    key={i}
                    geography={geography}
                    projection={projection}
                    className="map1"
                  />
                ))
                }
              </Geographies>
              <Markers>
                {markers.map((marker, i) => {
                  // load train locations on the map

                  // set the color of the selected train marker to differ from other markers
                  let stro = '#FF5722';
                  if (chosenTrain.id === marker.id) stro = '#2194FF';
                  // return the generated markers one at a time
                  return (
                    <Marker
                      key={i}
                      marker={marker}
                      onClick={() => {
                        this.handleMarkerClick(marker, false);
                      }}
                    >
                      <circle
                        cx={0}
                        cy={0}
                        r={5}
                        style={{ stroke: stro, strokeWidth: 3, opacity: 0.9 }}
                      />
                    </Marker>
                  );
                })}
              </Markers>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    );
  }
}
Map.propTypes = {
  signOut: PropTypes.func,
  apiAddress: PropTypes.string,
  cookies: PropTypes.object,
};

Map.defaultProps = {
  signOut: null,
  apiAddress: '',
  cookies: null,
};
