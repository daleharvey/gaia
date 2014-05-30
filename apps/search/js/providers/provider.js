'use strict';
/* global UrlHelper */

var grid = document.getElementById('icons');
var globalIndex = 0;

/**
 * Base Provider class
 */
function Provider() {
}

Provider.prototype = {

  /**
   * Name of the provider
   * Overridden at the child provider level
   */
  name: 'Provider',

  /**
   * Whether or not this provider dedupes results.
   */
  dedupes: false,

  /**
   * Initializes the provider container and adds listeners
   */
  init: function(searchObj) {
    this.searchObj = searchObj;
    this.container = document.getElementById(this.name.toLowerCase());
    this.container.addEventListener('click', this.click.bind(this));
  },

  /**
   * Clears the rendered results of this provider from the app grid
   */
  clear: function() {
    grid.clear();
    this.container.innerHTML = '';
  },

  /**
   * Handler when a result is clicked
   */
  click: function() {},

  /**
   * Aborts any in-progress request.
   */
  abort: function() {
    if (this.request && this.request.abort) {
      this.request.abort();
    }
  },

  /**
   * Renders a set of results.
   * Each result may contain the following attributes:
   * - title: The title of the app.
   * - meta: Secondary content to show for the result.
   * - icon: The icon of the result.
   * - dataset: Data attributes to apply to the result.
   * - label: Aria-label for the result.
   * - description: Additional description for the result.
   */
  buildResultsDom: function(results) {
    grid.clear();

    window.dispatchEvent(new CustomEvent('appzoom', {
      'detail': {
        cols: 4
      }
    }));

    results.forEach(function(config, index) {

      var bookmark = {
        id: ++globalIndex,
        name: config.title,
        url: config.dataset.url
      };

      if (config.icon) {
        bookmark.icon = config.icon;
      }

      grid.add(new Bookmark(bookmark));

    });

    grid.render();

    // Remove
    return document.createDocumentFragment();
  },

  render: function(results) {
    var dom = this.buildResultsDom(results);
    this.container.appendChild(dom);
  }
};
