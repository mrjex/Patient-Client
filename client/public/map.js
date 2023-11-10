let map
let service
let infowindow

async function initMap() {
  const position = { lat: 57.708870, lng: 11.974560 }

  // @ts-ignore
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

  map = new Map(document.getElementById('map'), {
    zoom: 7,
    center: position,
    mapId: 'DEMO_MAP_ID'
  })

  const request = {
    location: position,
    radius: '500',
    type: ['dentist']
  }

  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, callback)

  // The marker that represents user's current global position
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'Angered, Gothenburg' // NOTE: Change to currentPosition
  })
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i])
    }
  }
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  })

  google.maps.event.addListener(marker, 'click', function () {
    alert(place.name)
    window.open(place.photos[0].getUrl(), '_blank') // NOTE: It only works for a couple of photos (most likely because only PNG is supported) - Conduct further research on this issue later
    infowindow.open(map, this)
  })
}

initMap()
