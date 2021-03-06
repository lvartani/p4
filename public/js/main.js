//namespace
var boston = {};

//map
var map;

//drawingManager
var drawingManager;

var infowindow;

var lat;

var long;

//geocoder
var geocodemarker;

var geocoder = new google.maps.Geocoder();

function trace(message)
{
    if (typeof console != 'undefined')
    {
        console.log(message);
    }
}

//Function that gets run when the document loads
boston.initialize = function()
{
    var latlng = new google.maps.LatLng(42.361061082707735, -71.06494315669636);
    var myOptions = {
        zoom: 13,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

    //allow pressing "enter"
    $('#address').keypress(function(e) {
        if(e.which == 13) {
            e.preventDefault();
            up206b.geocode();
        }
    });
    var datatest = $('.hidden_').val();
    console.log(datatest);

    boston.mapMarkers(lattest, longtest);
    //add the drawing tool that allows users to draw points on the map
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.MARKER]
        },
        markerOptions: {
            draggable: true
        }
    });

    //add the tools to the map
    // drawingManager.setMap(map);


    //event listener that does the following after user draws point on the map
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (point)
    {
        //change the draw mode to allow user to drag the marker to desired location
        drawingManager.setDrawingMode(null);

        //"clone" the save-form to put in the infowindow
        var form =    $(".save-form").clone().show();
        var infowindow_content = form[0];
        infowindow = new google.maps.InfoWindow({
            content: infowindow_content
        });



        //make each marker clickable
        google.maps.event.addListener(point.overlay, 'click', function() {
            infowindow.open(map,point.overlay);
            console.log(lat);
        });

        // google.maps.event.addListener(map, 'click', function(event) {
        //    console.log( 'Lat: ' + event.latLng.lat() + ' and Longitude is: ' + event.latLng.lng() );
        // });

        //open infowindow by default
        infowindow.open(map,point.overlay);

        lat = point.overlay.getPosition().lat();
        long = point.overlay.getPosition().lng();

        $('#lat_form').val(lat);
        $('#long_form').val(long);
        console.log(lat_form);
        console.log(long_form);

        // $.post('/create', {lat:lat, long:long}, function(data) {
        //     console.log(data);
        // });


        // $('.sForm').on('click', function () {
        //
        //         $.ajax({
        //                 type: "POST",
        //
        //                 url: "/create",
        //                 data: {
        //                     lat:34
        //                 },
        //                     cache: false,
        //                 success: function(data) {
        //                      alert(data);
        //                  }
        //          });
        //           event.preventDefault();
        //          return false;
        //      });

    });


}

//map markers
boston.mapMarkers = function(lat, long){
    var incident_markers =[]
    var image = {
    url: '/images/cyclist_marker.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(30, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  };



    var    marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat,long),
            map: map,
            icon: '/images/cyclist_marker.png'

    });

    //add the marker to the incident_markers array
        //incident_markers[i] = marker;

    //add an infowindow
    //    google.maps.event.addListener(incident_markers[i], "mouseover", function () {
    //        infowindow_public.setContent("<div class='infowindow'><strong>" + lat+ "</strong> " + long + "<p class='infowindow-paragraph'><strong>" + lat + "</strong><br>" + long+ "</p></div>");
    //        infowindow_public.open(map, incident_markers[i]);
    //    });


}



//geocode function
boston.geocode = function()
{
    var address = $('#address').val();

    //erase previous markers
    if(geocodemarker)
    {
        geocodemarker.setMap(null);
    }

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
        {
            map.setZoom(9);
            map.panTo(results[0].geometry.location);
            geocodemarker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

        }
        else
        {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

//function to toggle edit mode
boston.toggleEditMode = function()
{
    if (drawingManager.getMap() == null)
    {
        $('#edit-button').html('<i class="icon-pencil"></i> I am done drawing');
        drawingManager.setMap(map);
    }
    else
    {
        $('#edit-button').html('<i class="icon-pencil"></i> Let me draw on this map');
        drawingManager.setMap(null);
    }
    $('#edit-button').toggleClass('btn-danger');
}
