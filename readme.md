# Overview
This webserver allows for serial communication with the Monoprice 6 Multizone amplifier. Currently the setup allows for only 1 main amplifier, but can be expanded up to 3 amplifiers as they can be daisy chained.

## Additional Information
- In order for the server to work the following is required: \* Usb to Serial Cable 
![Alt text](./images/RS232.PNG?raw=true 'Rs232')

- SBC - Ex Raspberry PI

- **If you plan on using the Android application, HTTPS will be required which will require a self signed SSL certificate.**

- **The web application, and Android applications are seperate, and if you are interested let me know.**

## API
ZONES
GET /zones - Queries all zones for the main amp,

Response JSON

    {
        "zoneId":"",
        "paPower":"",
        "power":"",
        "mute":"",
        "doNotDisturb":"",
        "volume":"",
        "treble":"",
        "bass":"",
        "balance":"",
        "sourceChannelName":"",
        "keypadStatus":"",
        "zoneName":"",
    }


POST /zones/:zoneId/:controlAction

Control actions include:

        - "pr" Zone Power Input 00/01,
        - "mu" Mute Option Input 00/01,
        - "dt" Do not disturb Input 00/01,
        - "vo" Volume Input 00-38,
        - "tr" Treble Input 00-20,
        - "bs" Bass Input 00-20,  
        - "ch" Source Channel Input 00-06,

Body contains the Input value as Text
Response -> Http Status 200 for success, or 400 for Invalid Request

CHANNELS
GET /CHANNELS - Queries all Channels

Response -> Array of Audio Channel Information
JSON

    {
        id: channelId
        name: ChannelName
        active : 1/0
    }

POST /channels/:channelId - Update selected Channel
Body - Channel JSON

    {
        id: channelId
        name: ChannelName
        active : 1/0
    }


## Screenshots from the frontend applications 
### Audio Input Channels and Zones can be given alternate names, with default names set. 

### Landing Page - Show all zones 

![Alt text](./images/App_Landing_Page.png?raw=true 'Landing Page')

### Accordions can be expanded to adjust the zone

![Alt text](./images/app_zone_expanded.png?raw=true 'Drop -down')

### Menu to select either the zones or the Audio Input Channels

![Alt text](./images/menu_selection.png?raw=true 'Menu')

### Manage Audio Input Channel 

![Alt text](./images/audio_inputs.png?raw=true 'Audio Channels')

### Dark Mode

![Alt text](./images/dark_theme.PNG?raw=true 'Dark Mode')
