import Ember from 'ember';
import { isAlternate } from 'ui/utils/platform';
import C from 'ui/utils/constants';
import { getCatalogSubtree } from 'ui/utils/parse-catalog-setting';

export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  catalog: Ember.inject.service(),
  settings: Ember.inject.service(),
  projectId: Ember.computed.alias(`tab-session.${C.TABSESSION.PROJECT}`),

  catalogController: Ember.inject.controller('catalog-tab'),
  category: Ember.computed.alias('catalogController.category'),
  categories: Ember.computed.alias('model.categories'),
  catalogId: Ember.computed.alias('catalogController.catalogId'),

  parentRoute: 'catalog-tab',
  launchRoute: 'catalog-tab.launch',

  search: '',

  updating: 'no',

  actions: {
    clearSearch() {
      this.set('search', '');
    },
    launch(id, onlyAlternate) {
      if ( onlyAlternate && !isAlternate(event) ) {
        return false;
      }

      this.transitionToRoute(this.get('launchRoute'), id);
    },

    update() {
      this.set('updating', 'yes');
      this.get('catalog').refresh().then(() => {
        this.set('updating', 'no');
        this.send('refresh');
      }).catch(() => {
        this.set('updating', 'error');
      });
    }
  },

  categoryWithCounts: Ember.computed('category', 'categories', 'search', function() {
    var categories = [];
    var catalogs = this.get('arrangedContent');

    catalogs.forEach((cat) => {
      if (cat.categories) {
        cat.categories.forEach((category) => {
          if (categories.findBy('name', category)) {
            categories.findBy('name', category).count++;
          } else {
            categories.pushObject({name: category, count: 1});
          }
        });
      }
    });

    return categories.sortBy('name');
  }),

  filters: Ember.computed(`settings.${C.SETTING.CATALOG_URL}`, function() {
    return getCatalogSubtree(this.get(`settings.${C.SETTING.CATALOG_URL}`), this.get('projectId'));
  }),

  arrangedContent: Ember.computed('model.catalog', 'search', function() {
    var search = this.get('search').toUpperCase();
    var result = [];

    if (!search) {
      return this.get('model.catalog');
    }

    this.get('model.catalog').forEach((item) => {
      if (item.name.toUpperCase().indexOf(search) >= 0 || item.description.toUpperCase().indexOf(search) >= 0) {
        result.push(item);
      }
    });
    return result;
  }),
});
