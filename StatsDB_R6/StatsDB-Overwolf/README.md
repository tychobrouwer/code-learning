# StatsDB Overlay

1. [Information](#information)
  * [Getting started](#getting-started)
  * [development tools](#development-tools)
    * [Remote debugger](#remote-debugger)
2. [Changelog](#changelog)
  * [Upcoming](#upcoming)
    * [V.1.4.2.0](#V1420)
  * [Realeased](#realeased)

### Information
##### Getting started
1. Install overwolf on your computer.
2. Make sure that you are whitelisted as developer.
3. Go to Settings->About->Development options->Load unpacked extension and select the path to the overlay folder.
4. Now you are done.

##### Development tools
###### Remote debugger
1. Close Overwolf
2. Go to the following page and follow the instructions on how to install a [registry key](https://overwolf.github.io/docs/topics/enable-dev-tools#windows-registry).
3. Once that is installed launch Overwolf
4. Now you can use http://localhost:54284.

### Changelog

##### Upcoming
* ###### V.1.4.2.0
  * Added
    * Game history (Unlimited)
    * Themes (Dark, Light)
    * New API request to load in prev seasons
    * Prev seasons are now MAX
    * Improved API speed on first load
  * Removed
    * Negative distance in detailed stats
    * Prev seasons from API

##### Realeased
* ###### V.1.3.2.0
  * Added
    * Previous seasons now in detailed stats
    * Integration with StatsDB website
  * Removed
    * Mouse click sometimes didn't work
* ###### V.1.3.1.0
  * Added
    * Odds of winning also calculates previous season stats
    * New API
    * Headshots works
    * Headshots/Kill works
    * Max MMR works
  * Removed
   * R6Lookup
* ###### V.1.3.1.0
  * Added
    * Odds of winning more accurate
  * Removed
    * Wrong values in odds of winning
* ###### V.1.2.0.0
  * Added
    * Detailed stats per player in lobby
    * Performence improvements  
