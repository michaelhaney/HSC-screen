## HSC Knockouts

Live demo at: [hematopoiesiscrisprscreens.com](http://www.hematopoiesiscrisprscreens.com/)

Citation: Haney et. al. 2022 bioRxiv

### To Run

Download a copy of this repo, either through git or by clicking on the `Code > Download Zip` button at the top of this page.

Navigate to the folder in your terminal window and run:

```sh
python -m SimpleHTTPServer
```

Then open a web browser and paste the following url:

```
http://localhost:8000
```

You should see the webpage load.


### Development

This project is built with `nodejs` and `npm` along with several other development dependencies.

To install the latest version of node and npm follow the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), I'm (on Mac) using nvm to install node and npm.

To test that your node and npm installations worked, go to a terminal and run:

```sh
node --version
npm --version
```

Next, download all dev dependencies for this project.  Navigate to this repo in your terminal and run:

```sh
npm install
```

To build from `src` to `dist`:

```sh
npm run build
```

To start a dev server at `http://localhost:8080`:

```sh
npm run start
```

Open `http://localhost:8080` with a browser and you should see the app running.  If you make changes to the code while the dev server is running, the code will automatically recompile and refresh in the browser.


