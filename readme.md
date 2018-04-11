# Survey Prototype
**_Imagine you're a front end web developer working on a one page survey composed of two sections, a "Main" page and a "Form" page._**

**_The goal is for users to select 1 option and submit their choice along with their email address via a form to a backend server. The 2 screens presented and any interactions between them should occur without any page refreshes._**

**_On hitting "submit", the email address and survey choice should be serialized and POSTed to an endpoint, but for simplicity, this can be mocked and there is no need to build a specific success or “Thank You” state for your application. We will be interested in how the data is handled and organized on the submit event, but nothing further._**

**_Consider this the "first release" of a product that may scale in the future as additional features are needed. Part of your objective is that the code be scalable and maintainable by other developers. To that end, use wellstructured, organized code and add comments where you see fit._**

## Solution
1. Developed in: Chrome
    - tested on Firefox and Safari
    - tested on iPad, iPhone and Android (landscape and portrait)
    - Landscape (and desktop default) places options horizontally in a row across the screen
    - Portrait stacks options in a vertical column
* Some strange behaviors were noted with the modal backdrops on mobile/tablet when viewed through wifi (but only by one third party tester). This behavior went away when switched to mobile data. This behavior didn't happen with other third party testers on wifi.

2. Survey data stored in an external JSON file, which allows adding more data to the file as necessary, including unique identifiers. Each survey question can also take settings which can be passed into the script/template, such as "required" (true/false), "type" (radio, multi-select), etc. 

2. Survey results formatted into JSON data and POSTed through `axios` (a promise-based npm library for node.js servers). Success behavior is currently sent in error block for testing purposes.

4. `Handlebars.js` used for creating templates for the layout of the survey option choice. For this particular survey, this option template contains an image and text.

5. UX and error conditions taken into account:
	- Basic email address verification with regex
	- Popover to indicate email address error and example
	- Email address entry allows button click on next or enter keypress to continue
	- Disabled submit button to prevent user from submitting a survey with no option selected
	- Selected option is highlighted with color and glow to indicate which survey option has been chosen
	- Form submit had to be custom handled (line 28) due to initially overriding it (line 21)

6. Libraries/APIs/technologies used and demonstrated:
	- `Bootstrap` modals for popups
	- `Bootstrap` popover for directed hint/error message
	- `Axios` npm library for promise-based HTTP GET/POST requests to node.js servers
	- `LESS` for CSS pre-processing
	- `Browserify` for bundling Javascript dependencies
	- `Handlebars.js` for templating the survey options
	- Promises to allow proper async calls without blocking other events or to allow elements to populate the DOM before attempting manipulations
	- Closures (no global variables are present, other than the the declared const at the top, which is a dependency)