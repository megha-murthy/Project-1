// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================
// ranks threats based on severity
let crime_list = document.querySelector("#crime_list");
let input = document.querySelector("#input");
let inputBtn = document.querySelector("#btn");
let prev = document.querySelector("#prev");
let pageBtn = document.querySelector("#page");
let next = document.querySelector("#next");

// markers array
var markers = [];

// ranking variables
let crimes = ['shooting', 'assault', 'robbery', 'arson', 'burglary', 'theft', 'arrest', 'vandalism', 'other'];
let crimeCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let listLimit = input.value;
let page = 0;
let dataCashe = [];
let sortedData = [];

pageBtn.value = page + 1;

inputBtn.addEventListener('click', function() {
  removeMarkers();
  listLimit = input.value;
  crime_list.innerHTML = '';
  rankOffences(dataCashe);
});

// previous page button
prev.addEventListener('click', function() {
    removeMarkers();
    if(page > 0) {
      page--;
      pageBtn.value = page + 1;
      crime_list.innerHTML = '';
      CreateTable(sortedData);
    }
    
})

// next page button
next.addEventListener('click', function() {
    removeMarkers();
    if (((page + 1) * listLimit) < dataCashe.length) {
        page++;
        pageBtn.value = page + 1;
        crime_list.innerHTML = '';
        CreateTable(sortedData);
    }
    
})

function rankOffences(data) {
  crimeCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  crime_list.innerHTML = "";
  dataCashe = data;
  for (var i = 0; i < crimes.length; i++) {
    for (var j = 0; j < data.length; j++) {
      if (data[j].type.toLowerCase() === crimes[i]) {
        sortedData.push(data[j]);
        crimeCount[i]++;
      }
    }
  }
  // updates the crime summary stats at the bottom of the page
  crimeStats();
  CreateTable(sortedData);
}



function CreateTable(data) {
  let count = 0;
  for (var j = page * listLimit; j < data.length; j++) {
    if (listLimit == -1 || listLimit > count) {
      count++;
      createRow(count, data, j);
    }
  }
}



function createRow(count, data, j) {
    let newRow = document.createElement("tr");
    let number = document.createElement("td");
    let type = document.createElement("td");
    let code = document.createElement("td");
    let city = document.createElement("td");
    let link = document.createElement("td");
    let ref = document.createElement("a");
    ref.setAttribute('href', data[j].link);
    ref.setAttribute('target', '_blank');
    ref.textContent = "link";
    ref.setAttribute("class", 'link');
    let streetLink=document.createElement("a");
    streetLink.setAttribute("href","https://maps.googleapis.com/maps/api/streetview?size=600x300&location="+data[j].lat+","+data[j].lon+"&heading=151.78&pitch=-0.76&key=AIzaSyCll1M9CtGGw4nJ6ryIvd18emOJUyf5EWc");
    streetLink.setAttribute("target","_blank")
    streetLink.textContent=" <<street view>>";

    number.textContent = count + (page * listLimit);
    type.textContent = data[j].type;
    code.textContent = data[j].date;
    city.textContent = data[j].address;
    link.appendChild(ref);
    link.appendChild(streetLink);

    newRow.appendChild(number);
    newRow.appendChild(type);
    newRow.appendChild(code);
    newRow.appendChild(city);
    newRow.appendChild(link);
    crime_list.appendChild(newRow);
    addMarker(data[j].lat, data[j].lon, data[j].type, data[j].link);
}



// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================
//updates the stats at the bottom of the page
function crimeStats() {
  let list = document.getElementById("crimeStats");
  let elements = list.children;

  for (let i = 0; i < crimeCount.length; i++) {
    let stat = crimeCount[i];
    elements[i].children[0].textContent = stat;
    let charList = elements[i].children[1].textContent.split('');
    if(stat != 1 && charList[charList.length - 1] != 's') {
      elements[i].children[1].textContent = elements[i].children[1].textContent + "s";
    }
    if(stat == 1 && charList[charList.length - 1] == 's') {
      let word = '';
      for (var j = 0; j < charList.length - 1; j++) {
        word += charList[j];
      }
      elements[i].children[1].textContent = word;
    }
  }
}
// ==========================================================================================================================================
// ==========================================================================================================================================
// ==========================================================================================================================================
// adds a marker of each crime to the map
function addMarker(lat, lon, type, link) {
  let marker = new google.maps.Marker({
    position: {
        lat: lat,
        lng: lon,
        url: link
    },
    map: map,
    draggable: false,
    title: type
  });
  
  google.maps.event.addListener(marker, 'click', function() {
   window.open(link);
  });

  markers.push(marker);
}

function removeMarkers() {
  markers.forEach(element => {
    element.setMap(null);
  });
}



