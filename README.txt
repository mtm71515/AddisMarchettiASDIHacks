Instructions to run SchoolAssist: 

Clone the github repo to your machine. After this, you must first run the CORS Proxy server used to call
 our public API's. Do this by running navigating to the "cors-anywhere" directory located in the demo_app
 folder ("$cd/demo_app/cors-anywhere from the demoFramework directory) and in the "cors-anywhere" folder 
 run "$node server.js"

 **NOTE: cors-anywhere should run on 0.0.0.0:8080 - if it runs on something else, then you must
  change the URL in the "demo_app.src/apiControlloer/apiControllor.tsx" file; modify the fetch statements 
  in the "getSchoolFromCoordinates" and "getGeoIdFromZip" methods from "fetch(http://localhost:8080/{rest of url})" 
  to  "fetch(http://localhost:{ur-cors-anywhere-port}/{rest of url})"

 After this, navigate to demo_app ("$cd demo_app" from the demoFramework directory), in a new 
 terminal window and run "$npm start". 
   
 PUBLIC API's USED: 
  GreatSchools API (https://www.greatschools.org/api/): I sent a request for a 90 day free trial 
  and recieved permission to use the API for free for 90 days starting August 11th. 

  Geo FCC Area API: Public, free to use
