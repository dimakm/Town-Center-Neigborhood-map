import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import escapeRegExp from 'escape-string-regexp';
import Map from './Map';
import TheMenuFilter from './TheMenuFilter';
import ErrorCatcher from './ErrorCatcher';


class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      venues: [],
      allVenues: [],
      markers: [],
      hiddenMarkers: [],
      query: ''
  }}

  componentDidMount() {
    this.fetchVenues()
  }
    
  
  //getMap function creates the needed script to load the map
  getMap = () => {
    let index  = window.document.getElementsByTagName("script")[0] 
    let script = window.document.createElement("script") 
    script.src = "https://maps.googleapis.com/maps/api/js?key=[YOUR KEY]&callback=initMap"
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
    script.onerror = function() {
      alert("Error, Map couldn't be loaded!");
    };
    window.initMap = this.initMap;
  }

  
  //Fetching  the venues from foursquare.com 
  fetchVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "YOUR ID",
      client_secret: "YOUR SECRET NUMBER",
      query: "restaurant",
      ll: "30.257158, -81.525561",
      v: "20183009",
      limit: 20
    }

    
    //Axios fetch Api to get the data from Foursquare, dependency https://github.com/axios/axios
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response => {
      this.setState({
        venues: response.data.response.groups[0].items,
        allVenues: response.data.response.groups[0].items
      }, this.getMap())
    })
    .catch(error => {
      alert(`Foursquare venues data couldn't be fetched, try again please!`)
      console.log("fetching data problem " + error)
    })
  }


  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), 
    {
      center: {lat: 30.257191, lng:  -81.525389}, 
      zoom: 16
    })

    const infowindow = new window.google.maps.InfoWindow({maxWidth: 200});
    this.infowindow = infowindow
  
    this.state.venues.forEach(site => {
    //create marker
      const marker = new window.google.maps.Marker({
        position: {lat: site.venue.location.lat , lng: site.venue.location.lng},
        map: map,
        id : site.venue.id,
        animation: window.google.maps.Animation.DROP,
        title: site.venue.name
        })
      
    this.state.markers.push(marker)
    // Click on a marker, animation starts and infowindow opens
      marker.addListener('click', function() {
        infowindow.setContent(`
                                  <h2>${site.venue.name}</h2>
                                  <h3>Type: ${site.venue.categories[0].shortName}</h3>
                                  <p>Address:${site.venue.location.formattedAddress[0]} 
                                              ${site.venue.location.formattedAddress[1]} 
                                  </p>
                                  <p>lat: ${site.venue.location.lat}, long: ${site.venue.location.lng}</p>
                                  <p> ${'<a href="https://foursquare.com/v/' +
                                   site.venue.id + '" target="_blank">Read More on <b>Foursquare</b></a>'} </p>
                                   <br><i>Info provided by Foursquare.</i>
                                  `)
        
        //make the marker bounce for a short time then it stops
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        window.setTimeout(function(){marker.setAnimation(null);},1000);        

        infowindow.open(map, marker)        })

        //stop marker animaion and close infowindow when map is clicked
        map.addListener('click', function(){
                  marker.setAnimation(null);
                  infowindow.close(map, marker) 
      })
        }
        )
  }
  //this function makes the marker visible or invisible depending on the aBoolean parameter (true or false)
  itemVisibility = (anArray, aBoolean) => {
      return anArray.forEach(marker => marker.setVisible(aBoolean))
  }
  
  //Handling the search box changes
  handleSearch = query => {
    this.setState({ query })
    let filterVenues
    let hiddenMarkers
    this.state.markers.map(marker => marker.setVisible(true))
    if (query) {
      const match = new RegExp(escapeRegExp(query), "i")
      filterVenues = this.state.venues.filter(site =>
        match.test(site.venue.name)
      )
      this.setState({ venues: filterVenues })
      hiddenMarkers = this.state.markers.filter(marker =>
        filterVenues.every(site => site.venue.name !== marker.title)
      )
      this.itemVisibility(hiddenMarkers, false)
      this.setState({ hiddenMarkers })
    } else {
      this.setState({ venues: this.state.allVenues })
      this.itemVisibility(this.state.markers, true)
    }
  }

  

  render() {

    if (this.state.hasError) {
      return <div id="Error-alert" aria-label="Error Alert">Oops, Something went wrong!</div>
    } else {
      return (
      <main>
        <ErrorCatcher>
        
        <div id="header" aria-label="Header">
          <div id="Top-Header" aria-label="Header" tabIndex='0'>
             <h1> St.Johns Town Center Eats </h1>
          </div>   
        </div>

        
        <div id="container" aria-label="Menu Container">

          <TheMenuFilter 
            markers={ this.state.markers } 
            filteredVenues={ this.filteredVenues }
            query={this.state.query}
            clearQuery={this.clearQuery}          
            handleSearch={b => this.handleSearch(b)}
            clickLocation={this.clickLocation}
            venues={ this.state.venues }
          />
        </div>

        <Map />

        </ErrorCatcher>
      </main>
    );
  }
  }
}




export default App;
