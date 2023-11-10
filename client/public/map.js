let map
let service
let infowindow

async function initMap() {
  // NOTE: If 'blinking update' bug continues to grow as program is developed, switch to 'navigator.geolocation.getCurrentPosition()'
  const watchId = navigator.geolocation.watchPosition(async position => {
    const { latitude, longitude } = position.coords
    const userGlobalCoordinates = { lat: latitude, lng: longitude }
    console.warn(userGlobalCoordinates)

    // @ts-ignore
    const { Map } = await google.maps.importLibrary('maps')
    const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

    map = new Map(document.getElementById('map'), {
      zoom: 7,
      center: userGlobalCoordinates,
      mapId: 'DEMO_MAP_ID'
    })

    const request = {
      location: userGlobalCoordinates,
      radius: '100000',
      type: ['dentist']
    }

    service = new google.maps.places.PlacesService(map)
    service.nearbySearch(request, callback)

    const userIcon = document.createElement('img')
    userIcon.src = 'https://i.ibb.co/cFB7cMR/User-Marker-Icon.png'

    // The marker that represents user's current global position
    const marker = new AdvancedMarkerElement({
      map: map,
      position: userGlobalCoordinates,
      content: userIcon,
      title: 'Your Position'
    })
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
