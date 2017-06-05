import Ember from 'ember';
// import C from 'ui/utils/constants';
import {tagsToArray} from 'ui/models/stack';

export default Ember.Controller.extend({
  projects: Ember.inject.service(),
  projectController: Ember.inject.controller('authenticated.project'),
  prefs: Ember.inject.service(),
  tags: Ember.computed.alias('projectController.tags'),

  // queryParams: ['sortBy','mode'],
  sortBy: 'name',
  mode: 'list',

  _allStacks: null,
  init() {
    this.set('_allStacks', this.get('store').all('stack'));
  },

  filtered: function() {
    let out = this.get('model');
    return out;
  }.property('model.@each.system','prefs.showSystemResources','tags'),


  groupBy: function() {
    if ( !this.get('simpleMode') && this.get('mode') === 'grouped' ) {
      return 'stack.id';
    } else {
      return null; 
    }
  }.property('simpleMode', 'mode'),
});
