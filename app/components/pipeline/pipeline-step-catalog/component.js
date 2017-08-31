import Ember from 'ember';
import C from 'ui/utils/constants';
import Util from 'ui/utils/util';

export default Ember.Component.extend({
  catalog: Ember.inject.service(),
  projects: Ember.inject.service(),

  project: function() {
    return this.get('projects.current');
  }.property('projects'),
  catalogs: null,
  selectedCatalog: function(){
    var ary = this.get('ary');
    if(!ary){
      return null;
    }
    var catalogId = this.get('catalogId');
    var selectedCatalog = ary.find(ele=>ele.id===catalogId);
    this.set('selectedModel.repository',selectedCatalog.url);
    this.set('selectedModel.branch',selectedCatalog.branch);
    return selectedCatalog;
  }.property('catalogId'),
  catalogId: null,
  templates: null,
  selectedTemplate: null,
  previewTab: '',
  selectedTemplateVersions: function(){
    var versions = [];
    var template = this.get('selectedTemplate');
    if(!template){
      return versions
    }
    var links = template.versionLinks;
    versions = Object.keys(links).filter((key) => {
        // Filter out empty values for rancher/rancher#5494
        return !!links[key];
      }).map((key) => {
        return {version: key, sortVersion: key, link: links[key]};
      });
    return versions;
  }.property('selectedTemplate'),
  selectedVersion: null,
  templatesObserver: function() {
    var catalogId = this.get('catalogId');
    if(!catalogId){
      return
    }
    var params = {
      catalogId: this.get('catalogId'),
      category: "all",
      plusInfra: true,
      templateBase: ""
    };
    this.get('catalog').fetchTemplates(params).then((res) => {
      debugger
      this.set('selectedTemplate', res.catalog[0]);
      this.set('templates', res.catalog);
      var initCatalogTemplateId = this.get('selectedModel.externalId');
      if(initCatalogTemplateId){
        var catalogInfo = initCatalogTemplateId.split(':');
        var templateFolderPath = catalogInfo[1].split('*');
        var templateFolderName = templateFolderPath[templateFolderPath.length-1];
        var selectedTemplate = res.catalog.find(ele=>ele.folderName===templateFolderName);
        selectedTemplate&&this.set('selectedTemplate',selectedTemplate);
      }
      return res;
    });
  }.observes('catalogId'),
  ary: null,
  global: null,
  editCatalog: false,
  toRemove: null,
  old: null,

  kindChoices: [
    { translationKey: 'catalogSettings.more.kind.native', value: 'native' },
    { translationKey: 'catalogSettings.more.kind.helm', value: 'helm' },
  ],

  init() {
    this._super(...arguments);
    this.set('toRemove', []);

    this.get('projects').updateOrchestrationState().then(() => {
      return Ember.RSVP.hash({
        catalogs: this.get('catalog').fetchCatalogs({
          headers: {
            [C.HEADER.PROJECT_ID]: this.get('projects.current.id')
          },
        }),
      });
    }).then((hash) => {
      this.set('catalogs', hash.catalogs);
      let old = this.get('catalogs').filterBy('environmentId', this.get('project.id')).map((x) => {
        let y = x.clone();
        y.uiId = Util.randomStr();
        return y;
      });
      this.set('old', old);
      this.setProperties({
        ary: old.map((x) => x.clone()),
      });
      var initCatalogTemplateId = this.get('selectedModel.externalId');
      if(initCatalogTemplateId){
        var catalogInfo = initCatalogTemplateId.split(':');
        this.set('catalogId',catalogInfo[0]);
      }
    });
  },

  actions: {
    editCatalog() {
      this.set('editCatalog', true);
    },
    cancel() {
      this.set('editCatalog', false);
    },
    add() {
      let obj = Ember.Object.create({
        name: '',
        branch: C.CATALOG.DEFAULT_BRANCH,
        url: '',
        kind: 'native',
        isNew: true,
      });

      this.get('ary').pushObject(obj);

      Ember.run.next(() => {
        if (this.isDestroyed || this.isDestroying) {
          return;
        }

        this.$('INPUT.name').last()[0].focus();
      });
    },

    remove(obj) {
      this.get('ary').removeObject(obj);
      if (!obj.get('isNew')) {
        this.get('toRemove').addObject(obj);
      }
    },

    save(cb) {
      if (this.validate()) {
        this.set('errors', []);
        let remove = this.get('toRemove');
        let cur = this.get('ary');

        let changes = [];

        // Remove
        remove.forEach((cat) => {
          changes.push(this.removeCatalogs(cat));
        });

        // Add/update
        cur.forEach((cat) => {
          cat.set('name', (cat.get('name') || '').trim());
          cat.set('url', (cat.get('url') || '').trim());
          cat.set('branch', (cat.get('branch') || '').trim() || C.CATALOG.DEFAULT_BRANCH);

          if (cat.uiId) {
            // Update maybe
            let orig = this.get('old').findBy('uiId', cat.uiId);
            if (orig) {
              if (JSON.stringify(orig) === JSON.stringify(cat)) {
                // Do nothing, nothing changed
              } else {
                // Update
                changes.push(cat.save());
              }
            } else {
              // This shouldn't happen, but add anyway
              changes.push(this.addCatalogs(cat));
            }
          } else {
            // Add
            changes.push(this.addCatalogs(cat));
          }
        });
        Ember.RSVP.allSettled(changes).then((settled) => {
          let errors = settled.filterBy('state', 'rejected');
          if (errors.length) {
            let errOut = [];
            errors.forEach((err) => {
              errOut.push(JSON.parse(err.reason.message).message);
            });
            this.set('errors', errOut.uniq());
            cb(false);

          } else {
            return new Ember.RSVP.Promise((resolve) => { setTimeout(resolve, 1); }).then(() => {

              return this.get('catalog').refresh().finally(() => {

                Ember.run.later(() => {
                  // @TODO ugh...
                  this.send('cancel');
                }, 500);

              });

            });
          }

        }).catch((err) => {
          this.set('errors', err);
          cb(false);
        });

      } else {

        cb(false);

      }
    }
  },

  validate() {
    var errors = [];
    var global = this.get('global');
    var ary = this.get('ary');

    ary.forEach((cat) => {

      if (trimAndCheck(cat.name)) {
        errors.push('Name is required on each catalog');
      }

      if (trimAndCheck(cat.url)) {
        errors.push('URL is required on each catalog');
      }

      if (trimAndCheck(cat.branch)) {
        errors.push('A Branch is required on each catalog');
      }

      if (global && global.filter((x) => (x.name || '').trim().toLowerCase() === cat.name.toLowerCase()).length > 1 ||
        ary.filter((x) => (x.name || '').trim().toLowerCase() === cat.name.toLowerCase()).length > 1) {
        errors.push('Each catalog must have a unique name');
      }
    });

    if (errors.length) {
      this.set('errors', errors.uniq());
      return false;
    } else {
      this.set('errors', null);
    }

    function trimAndCheck(str) {
      return (str || '').trim().length === 0 ? true : false;
    }

    return true;
  },

  addCatalogs(catalogs) {
    return this.get('store').request({
      url: `${this.get('app.catalogEndpoint')}/catalogs`,
      method: 'POST',
      headers: {
        [C.HEADER.PROJECT_ID]: this.get('project.id')
      },
      body: JSON.stringify(catalogs)
    });
  },

  removeCatalogs(catalogs) {
    return this.get('store').request({
      url: `${this.get('app.catalogEndpoint')}/catalogs/${catalogs.name}`,
      method: 'DELETE',
      headers: {
        [C.HEADER.PROJECT_ID]: this.get('project.id')
      },
      body: JSON.stringify(catalogs)
    });
  },
});
