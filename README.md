# Crisis Info Hub

Crisis Info Hub is a super lightweight content management system, based on Google Docs.

Crisis Info Hub provides a templatized Google Doc, customizable to allow organizations and individuals to disseminate crisis-relevant information in a low-bandwidth way. A published version of this Google Doc is served through a Google App Engine instance, which provides additional functionality including translation and analytics. [Example](mercycorps-dot-refugee-crisis-beta.appspot.com)


## Learning more about Crisis Info Hub

* See the Crisis Info Hub introduction  [deck](https://docs.google.com/presentation/d/1dta7JJ2v5f04-tdL_nRISc13fJw2RE9hXaJt-zF_VgY/edit?usp=sharing) to see design highlights and a more complete overview of the product.

## Creating a Crisis Info Hub Instance

* Follow the [Playbook](https://docs.google.com/document/d/1nlQEG2_1FNM_x7GU9etnktlmKs-AKjJv1ybN_zgfCHs/edit?usp=sharing) to create your own Crisis Info Hub instance.

## Contributing to Crisis Info Hub

* Follow [CONTRIBUTING](https://github.com/google/crisis-info-hub/blob/master/CONTRIBUTING.md) to learn more about the development process.


Note: This is not an official Google product.


## Prerequisites
----
These instructions have been tested with the following software:

* node.js >= 0.8.0
    * 0.8.0 is the minimum required to build with [Grunt](http://gruntjs.com/).
* git
* curl

An alternative to the Grunt build is provided via the `util.sh` shell script.

## Dependency Setup
----
1.  `pushd .`
1.  `mkdir $HOME/bin; cd $HOME/bin`
1.  `npm install grunt-cli`
    * Alternatively, `sudo npm install -g grunt-cli` will install system-wide
      and you may skip the next step.
1.  `export PATH=$HOME/bin/node_modules/grunt-cli/bin:$PATH`
    * It is advisable to add this to login profile scripts (.bashrc, etc.).
1.  Visit <https://developers.google.com/appengine/downloads>, copy URL of
    "Linux/Other Platforms" zip file for current AppEngine SDK.  Do this
    regardless of whether you are on Linux or OS X.
1.  `curl -O <url on clipboard>`
1.  `unzip google_appengine_*.zip`
1.  `mkdir google_closure; cd google_closure`
1.  `curl -O https://dl.google.com/closure-compiler/compiler-latest.zip`
1.  `unzip compiler-latest.zip; cd ..`
1.  `mkdir google_closure_templates; cd google_closure_templates`
1.  `curl -O https://dl.google.com/closure-templates/closure-templates-for-javascript-latest.zip`
1.  `unzip closure-templates-for-javascript-latest.zip`
1.  `popd`

To install dependencies for unit testing:
1. `sudo easy_install pip`
1. `sudo pip install unittest2`

## Configuration Setup
----
You need to provied some required information

* App Engine ID (edit the file `config.json`)
* Google Docs embed links (edit the file `js/app.js`)

## Scaffold Setup
----
These instructions assume a working directory of the repository root.

### Dependencies

All users should run:

1. `git submodule init`
1. `git submodule update`

Grunt users should also run:

`npm install`

### Local Development
To run the development appserver locally:

1. `grunt clean`
1. `grunt`
1. `grunt appengine:run:app`

If you are not using Grunt, simply run:

`util.sh -d`

### Deployment
To deploy to AppEngine:

1. `grunt clean`
1. `grunt --appid=<appid>`
1. `grunt appengine:update:app --appid=<appid>`

Specifying `--appid=` will override any value set in `config.json`.  You may
modify the `config.json` file to avoid having to pass this parameter on
every invocation.

If you are not using Grunt, simply run:

`util.sh -p <appid>`


## Detailed Dependency Information
-------------
* The AppEngine SDK should be present in the directory:

   `$HOME/bin/google_appengine/`

You can find / download this at:
<https://developers.google.com/appengine/downloads>

* (Optional, if using Google Closure): The Google Closure Compiler (and a
  suitable Java runtime), located at:

  `$HOME/bin/google_closure/`

You can find / download this at:
  <https://github.com/google/closure-compiler>

You will need all the files from this archive in the above directory:
  compiler-latest.zip

The compiler is invoked with the default namespace of 'app.'  The compiled
Javascript is written to `out/static/app.js`.

You will also need the Closure Library (in the closure-library submodule of
this repository).

You can find more on the Closure Library here:
  <https://github.com/google/closure-library>

To use it, you will need to check out the code as a submodule by running the
following commands from the base directory of this repository:

  `git submodule add <https://github.com/google/closure-library/> closure-library`

  `git commit -m "Initial import of Closure Library"`

* (Optional, if using Closure Templates): The Closure Template compiler (in
  addition to the Closure Compiler), located at:

   `$HOME/bin/google_closure_templates`

You can find / download Closure Templates at:
  <https://github.com/google/closure-templates>

You will need all the files from this archive in the above directory:
  closure-templates-for-javascript-latest.zip

You can build this using the ant target "zips-for-release", or download a
prebuilt version (the URL is in the Dependency Setup section).

The deployment script checks for the presence of .soy files in templates/soy.
If found, they are compiled to a single Javascript file using the
SoyToJsSrcCompiler.jar in the previously mentioned directory.  The resulting
Javascript file is stored in static/app.soy.js, alongside the `soyutils.js`
library provided with the Closure Templates bundle that is necessary to include
on any page you plan to use Closure Templates.
