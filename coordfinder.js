var map, geocoder, marker;
var coord_lat, coord_lng, coord_latlng, coordPlaces = {};


function setMarker(coord) {
    map.panTo(coord);
    map.setZoom(9);
    marker.setPosition(coord);
    marker.growUp(map);
    coord_lat = coord.lat();
    coord_lng = coord.lng();
    $("#coord_latlng").val(coord_lat + "\t" + coord_lng);
}

function codeAddress(place) {
    geocoder.geocode( { 'address': place}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                coordPlaces[place] = results[0].geometry.location;
                $("select#places").prepend('<option value="'+place+'">'+place+'</option>');
                $("select#places").val(place);
                setMarker(results[0].geometry.location);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
    });
}

function initialize() {

    var radius = parseInt($("#radius").val())*1000,
        canvas = "map_canvas",
        center_coord_lat = 42.347796180163584,
        center_coord_lon = 15.27074967642476;

    map = new google.maps.Map(document.getElementById(canvas), {
        center: new google.maps.LatLng(center_coord_lat, center_coord_lon),
        zoom: 5,
        disableDoubleClickZoom: true,
        mapTypeId: google.maps.MapTypeId.HYBRID //the map style
    });

    geocoder = new google.maps.Geocoder();

    marker = new google.maps.Marker({draggable: true});

    marker.bindCircle({
            radius: radius,
            strokeColor: "red",
            strokeWeight: 1,
            fillColor: "red",
            fillOpacity: 0.1
    });

    marker.setVisible(true);

    google.maps.event.addListenerOnce(map, "click", function(e) {
            if(e.latLng) {
                //console.log(e.latLng.toUrlValue());
                coord_lat = e.latLng.lat();
                coord_lng = e.latLng.lng();
                $("#coord_latlng").val(coord_lat + "\t" + coord_lng);
                marker.setPosition(e.latLng);
                marker.growUp(map);
            }
    });

    google.maps.event.addListener(marker, "dragend", function(e) {
            if(e.latLng) {
                coord_lat = e.latLng.lat();
                coord_lng = e.latLng.lng();
                $("#coord_latlng").val(coord_lat + "\t" + coord_lng);
                marker.setPosition(e.latLng);
                marker.growUp(map);
            }
    });

    $("#radius, select#is").change(function(e) {
            var factor = ($("select#is").val() === "km" ? 1000 : 1609);
            radius = parseInt($("#radius").val())*factor;
            marker.circle.setRadius(radius);
    });

    $("#coord_latlng").change(function(e) { $(this).val(coord_lat + "\t" + coord_lng); });

    //$("#search").click(function(e) {
    $("#place").change(function(e) {
            var place = $("#place").val();
            if (coordPlaces.hasOwnProperty(place)) {
                $("select#places").val(place);
                setMarker(coordPlaces[place]);
            } else {
                codeAddress(place);
            }
    });

    $("select#places").change(function() {
            var place = $(this).val();
            $("#place").val(place);
            setMarker(coordPlaces[place]);
    });

}


