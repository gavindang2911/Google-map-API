
var map;
var markers = [];
var infoWindow;

function initMap() {
  var Vancouver = {
      lat: 49.2827, 
      lng: -123.1207
  };
  map = new google.maps.Map(document.getElementById('map'), {
      center: Vancouver,
      zoom: 11,
      mapTypeId: 'roadmap',
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();
}
// function initMap() {
//   var losAngeles = {
//       lat: 34.063380, 
//       lng: -118.358080
//   };
//   map = new google.maps.Map(document.getElementById('map'), {
//       center: losAngeles,
//       zoom: 11,
//       mapTypeId: 'roadmap',
//   });
//   infoWindow = new google.maps.InfoWindow();
//   showStoresMarkers();

// }
function searchStores(){
  var foundStores = [];
  var zipcode = document.getElementById('zip-code-input').value;
  if(zipcode){
    for(var store of stores){
      var postal = store["city"];
      if(postal == zipcode){
        foundStores.push(store);
      }
    }
  }
  else{
    for(var storeVan of stores){
      if(storeVan.city === "Vancouver"){
        foundStores.push(storeVan);
      }
    }
    
  }
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations(){
  infoWindow.close();
  for(var i = 0; i < markers.length;i++){
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener(){
  var storeEle = document.querySelectorAll('.store-container');
  storeEle.forEach(function(elem, index){
    elem.addEventListener('click',function(){
      new google.maps.event.trigger(markers[index], 'click');
    })
  })
}





function displayStores(stores){
  var storesHtml ='';
  var count = 1;
  for(var store of stores){
    var address = store['name'];
    var city = store['city'];
    var country = store['country']
    var id = store['store_id'];
    storesHtml += `
          <div class="store-container">
            <div class="store-container-background">
              <div class="store-info-container">
                <div class="store-address">
                  <span>${address}</span>
                  <span>${city}, ${country}</span>
                </div>
                <div class="store-phone-number">
                    ${id}
                </div>
              </div>
              <div class="store-number-container">
                <div class="store-number">
                  ${count++}
                </div>
              </div>
            </div>  
          </div>
    `

    document.querySelector('.stores-list').innerHTML = storesHtml;
  }
}

function showStoresMarkers(stores){
  var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["latitude"],
            store["longitude"]);
        var name = store["name"];
        var country = store['country']
        //var openStatusText = store["openStatusText"]
        var city = store['city'];
        var id = store["store_id"];
        bounds.extend(latlng);
        createMarker(latlng, name, id, city, country, index+1);
    }
    map.fitBounds(bounds);
}
function createMarker(latlng, name, id, city, country, index){
  var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-city">
                ${city},  ${country} 
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${id}
            </div>
        </div>
    `;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
}