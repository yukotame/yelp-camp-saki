  maptilersdk.config.apiKey = mapToken;

    // 初期中心（東京駅あたり）とズーム
    const initialCenter = [139.767125, 35.681236];

  const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: campground.geometry.coordinates,
    //center: initialCenter,
    zoom: 10
  });

  new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new maptilersdk.Popup().setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`))
    .addTo(map);


        // デフォルトのマーカー（新宿駅）
    // const defaultMarker = new maptilersdk.Marker({ color: '#D00' })
    //   .setLngLat([139.700556, 35.690833])
    //   .setPopup(new maptilersdk.Popup().setHTML('<strong>新宿駅</strong><br>サンプルマーカー'))
    //   .addTo(map);