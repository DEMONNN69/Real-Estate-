document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch the user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Fetch the pincode using the Nominatim API
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        const pincode = data.address.postcode || "Pincode not found";
                        const city = data.address.city || data.address.town || data.address.village || "City not found";

                        // Send the pincode to the backend via AJAX
                        sendPincodeToBackend(pincode, city);
                    })
                    .catch(error => {
                       
                        document.getElementById("Nearby-city-name").innerText = `Switch On Location Of Better Results`;
                    });
            }, function (error) {
                console.error("Error getting location:", error);
                document.getElementById("Nearby-city-name").innerText = `Switch On Location For Better Results`;
            });
        } else {
            document.getElementById("Nearby-city-name").innerText = `Switch On Location For Better Results`;
        }
    }

    // Function to send pincode to the backend
    function sendPincodeToBackend(pincode,city) {
        fetch("/fetch_nearby_properties/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken(), // Add CSRF token for security
            },
            body: JSON.stringify({ pincode: pincode , city: city}),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateNearbyProperties(data.properties,city);
                } else {
                    alert("No nearby properties found.");
                }
            })
            .catch(error => {
                console.error("Error sending pincode to backend:", error);
            });
    }

    // Function to update the page with nearby properties
    function updateNearbyProperties(properties, nearby_city) {
        const container = document.getElementById("properties-container");
        container.innerHTML = ""; // Clear existing content
        document.getElementById("Nearby-city-name").innerText = `Near ${nearby_city}`; // Update city name
    
        properties.forEach(property => {
            const propertyDiv = document.createElement("div");
            propertyDiv.className = "property-card flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-md w-72 sm:w-[280px] lg:w-[300px]";
    
            // Create the anchor tag wrapping the entire property div content
            const anchorTag = document.createElement("a");
            anchorTag.href = "/prop_view/" + property.id; // Link to the specific property page
            anchorTag.className = "block"; // Make anchor tag a block element
    
            // Set the innerHTML of the anchor tag (wrap all content in it)
            anchorTag.innerHTML = `
                <div class="relative h-48 overflow-hidden">
                    <img src="/media/${property.main_img}" alt="${property.title}" class="property-image w-full h-full object-cover">
                    <div class="absolute top-0 right-0 bg-orange-600 text-white text-xs font-medium px-2 py-1 m-2 rounded">
                        ${property.property_status || "For Sale"}
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg text-gray-800">₹ ${property.price2}</h3>
                    <div class="flex items-center text-gray-700 text-sm mb-1">
                        <p>${property.title}</p>
                        <span class="mx-1">•</span>
                        <p>${property.bedrooms} BHK</p>
                    </div>
                    <div class="flex items-center text-gray-600 text-sm mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <p>${property.city} - ${property.zip_code}</p>
                    </div>
                    
                    <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span class="text-xs text-orange-600 font-medium">More details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-600 transform transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </div>
                </div>
            `;
    
            // Append the anchor tag to the property div
            propertyDiv.appendChild(anchorTag);
    
            // Append the property div to the container
            container.appendChild(propertyDiv);
        });
        container.style.overflowX = 'auto';  // Ensure overflow-x is enabled
    }
    
    

    // Function to get CSRF token from cookies
    function getCSRFToken() {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith("csrftoken=")) {
                return cookie.substring("csrftoken=".length, cookie.length);
            }
        }
        return "";
    }

    // Automatically fetch location on page load
    getLocation();
});
