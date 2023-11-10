// Initialize and add the map
let map

async function initMap() {
  // The location of Uluru
  const position = { lat: 57.708870, lng: 11.974560 }
  // Request needed libraries.
  // @ts-ignore
  const { Map } = await google.maps.importLibrary('maps')
  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

  // The map, centered at Uluru
  map = new Map(document.getElementById('map'), {
    zoom: 7,
    center: position,
    mapId: 'DEMO_MAP_ID'
  })

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: 'Angered, Gothenburg' // NOTE: Change to currentPosition
  })
}

initMap()
