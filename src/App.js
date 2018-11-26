import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"

const key=null;
const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={props.zoom}
    onClick={props.onClickMap }
    defaultCenter={{lat: props.latitude, lng: props.longitude }}>

    {props.isMarkerShown &&
      <Marker position={{ lat: props.latitude, lng: props.longitude }}
       onClick={() => props.onToggleOpen()}
    >
            {props.isOpen && (
              <InfoWindow>
                <div>Current Location is {props.latitude},{props.longitude} Weather is {props.weather}</div>
              </InfoWindow>
            )}
      </Marker>}

  <p> You are at {props.latitude} {props.longitude} </p>
  </GoogleMap>
);

class App extends Component {
  state = {
    isMarkerShown: true,
    userLocation: { lat: 0, lng: 0 },
    loading: true,
    isOpen: false,
    weather: "None"
  }

  componentDidMount() {
    this.delayedShowMarker()
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log(typeof longitude);
        this.setState({
          userLocation: { lat: latitude, lng: longitude },
          loading: false
        });
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    alert("Marker Clicked");
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  handleClickedMap = (e) => {
   let latitude = parseFloat(e.latLng.lat());
   let longtitude  = parseFloat(e.latLng.lng());
   var url = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longtitude+"&APPID=c0a9768b01afd4f929001709ab7ac0c4";
    fetch(url, {
                method: 'GET'
              })
          .then(result=>result.json())
          .then(response=> {
            console.log(response.weather[0].main);
            this.setState({
                      userLocation: { lat: latitude, lng: longtitude },
                      loading: false,
                      isOpen: true,
                      weather: response.weather[0].main
                });
          })
          .catch(error => {console.log(error)});
  }

  onToggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <div className="App">
        <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        isOpen={this.state.isOpen}
        onClickMap = {this.handleClickedMap}
        onToggleOpen={this.onToggleOpen} zoom={12} latitude={this.state.userLocation.lat} longitude={this.state.userLocation.lng}   weather={this.state.weather}/>
      </div>
    );
  }
}

export default App;
