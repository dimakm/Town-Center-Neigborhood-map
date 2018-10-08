import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';


class TheMenuFilter extends Component {

  /* 
   openInfo: is called when a list item is clicked(or marker is clicked) to open the infowindow
   depending on the id so if there are 2 venues with the same name it won't mistake and open
   one instead of the other
  */
  openInfo = locationId => {
    this.props.markers.forEach(marker => {
      if (marker.id === locationId) {
        window.google.maps.event.trigger(marker, "click")
      }
    })
  }
  
  render () {
    return (

     <Menu isOpen noOverlay >
        <p>
          <i>Powered by Foursquare</i>
        </p>
        <div className="searchBar" role="application">
          <input
          type="text"
          autoFocus
          id="theFilter"
          placeholder="Search..."
          aria-label="Search Restaurant"
          value={this.props.query}
          onChange={event => this.props.handleSearch(event.target.value)}
          />
        </div>
        <div className="theList" aria-label="List of Venues"> 
        <ul className="menu-result">
        {this.props.venues.map(site => (
            <li role="menuitem"
              onClick={() => {
                this.openInfo(site.venue.id);
              }}
              aria-label={site.venue.name}
              tabIndex="0"
              id={site.venue.id}
              key={site.venue.id}
            >
              <br/>
              <b>{site.venue.name}</b>
              <br/> 
              <i>{site.venue.location.address}</i>
            </li>
          ))}
        </ul>
         
          </div>
          </Menu>
    );
  }
}

export default TheMenuFilter