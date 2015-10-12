/**
 * @fileoverview Entry point for GAE Scaffold application.
 */

goog.provide('app');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.net.XhrIo');


/** @type {string} */
app.DEFAULT_LINK =
    'https://docs.google.com/document/d/1EZfMuIj4yMNlc3Y6ctgmKjY26Vw1-sEwK5OpbuGRXSg/pub?embedded=true';

/** @enum {string} */
app.DOC_LINKS = {
  gr:
  'https://docs.google.com/document/d/1U572JBotajsc7cruRg7ZGijsN7opipBA2fw459DPMsc/pub?embedded=true',
  ar:
  'https://docs.google.com/document/d/1L8Y9dBL61bPt8ClYSO5yeScdy_fygR_34cS0Nya-Fs4/pub?embedded=true',
  pe:
  'https://docs.google.com/document/d/1LSDKoVmk6VarB1EMxf83KXHvtYBh4SmPpkkQ4XWpY5M/pub?embedded=true'
};

/** Entry point for GAE scaffold application.*/
app.main = function() {
  app.detectLanguage();
  app.getPage(app.getLink());
};

/**
 * Get the google doc.
 * @param {string} the Docs link
 */
app.getPage = function(link) {
  var container_ = goog.dom.getElement('container');

  goog.net.XhrIo.send(link, function(e) {
    var xhr = e.target;
    var obj = xhr.getResponseText();
    obj = goog.dom.htmlToDocumentFragment(obj);
    container_.appendChild(obj);

    app.loadInverseImage();
  });
};

/**
 * Get the language-dependent link.
 * @return {string}
 */
app.getLink = function() {
  var code = window.location.hash.replace('#', '');
  if (code === '') {
    return app.DEFAULT_LINK;
  }

  switch (code) {
    case 'pe':
      return app.DOC_LINKS.pe;
    case 'ar':
      return app.DOC_LINKS.ar;
    case 'gr':
      return app.DOC_LINKS.gr;
    default:
      return app.DEFAULT_LINK;
  }
};

/** Check the navigator language and changed the hash */
app.detectLanguage = function() {
  if (window.location.hash !== '') {
    return;
  }

  var navLanguage = navigator.language.toLocaleLowerCase();

  switch (navLanguage) {
    case 'el':
    case 'el-gr':
      location.hash = '#gr';
      break;
    case 'fa':
    case 'fa-ir':
      location.hash = '#pe';
      break;
    case 'ar':
    case 'ar-ae':
    case 'ar-bh':
    case 'ar-dz':
    case 'ar-eg':
    case 'ar-iq':
    case 'ar-jo':
    case 'ar-kw':
    case 'ar-lb':
    case 'ar-ly':
    case 'ar-ma':
    case 'ar-om':
    case 'ar-qa':
    case 'ar-sa':
    case 'ar-sy':
    case 'ar-tn':
    case 'ar-ye':
      location.hash = '#ar';
      break;
  }
};


/** Load the images we need to invert the color.*/
app.loadInverseImage = function() {
  var images = goog.dom.getElementsByTagNameAndClass('img');

  goog.array.forEach(images, function(el) {
    var imageObj = new Image();
    imageObj.onload = function() {
      app.drawImage(this, el);
    };
    imageObj.src = el.src;
    imageObj.crossOrigin = 'Anonymous';
  });
};

/**
 * Draw an image into a canvas
 * @param  {Object} imageObj The image object
 * @param  {Element} el The element image to copy into a canvas
 */
app.drawImage = function(imageObj, el) {
  var canvas = goog.dom.createDom('canvas');
  var context = canvas.getContext('2d');
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;
  var x = 0;
  var y = 0;

  canvas.width = el.width;
  canvas.height = el.height;

  if (devicePixelRatio !== backingStoreRatio) {
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;

    canvas.width = oldWidth * ratio;
    canvas.height = oldHeight * ratio;
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    context.scale(ratio, ratio);
  }

  context.drawImage(imageObj, x, y, el.width, el.height);

  var imageData = context.getImageData(x, y, imageObj.width, imageObj.height);
  var data = imageData.data;

  for (var i = 0; i < data.length; i += 4) {
    // red
    data[i] = 255 - data[i];
    // green
    data[i + 1] = 255 - data[i + 1];
    // blue
    data[i + 2] = 255 - data[i + 2];
  }

  context.putImageData(imageData, x, y);

  goog.dom.insertSiblingAfter(canvas, el);
};

goog.exportSymbol('app.main', app.main);

goog.events.listen(window, goog.events.EventType.LOAD, app.main);
