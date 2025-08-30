
maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: 'cluster-map',
  zoom: 3,
  center: [138, 39],
  style:maptilersdk.MapStyle.STREETS,
});

console.log(campgrounds);
map.on('load', function () {
  map.addSource('campgrounds', {
    type: 'geojson',
    // data: 'https://docs.maptiler.com/sdk-js/assets/earthquakes.geojson',
    data:{
        features:campgrounds
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  });

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#7986CB',
                20,
                '#2196F3',
                40,
                '#00BCD4'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                20,
                20,
                40,
                25
            ]
        }
  });

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-size': 12
    }
  });

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  map.on('click', 'clusters', function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });
    const clusterId = features[0].properties.cluster_id;
    const source = map.getSource('campgrounds');
    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom
      });
    });
  });

  map.on('click', 'unclustered-point', function (e) {
    console.log(e.features[0].properties.popupMarkup);
    const popup = e.features[0].properties.popupMarkup;
    const coordinates = e.features[0].geometry.coordinates.slice();
    const mag = e.features[0].properties.mag;
    const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
    new maptilersdk.Popup()
      .setLngLat(coordinates)
      .setHTML(popup)
      .addTo(map);
  });

  map.on('mouseenter', 'clusters', () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', 'clusters', () => map.getCanvas().style.cursor = '');
  map.on('mouseenter', 'unclustered-point', () => map.getCanvas().style.cursor = 'pointer');
  map.on('mouseleave', 'unclustered-point', () => map.getCanvas().style.cursor = '');
});
