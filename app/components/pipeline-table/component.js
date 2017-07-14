import Ember from 'ember';

export const headersAll =  [
  {
    name: 'name',
    sort: ['name'],
    searchField: 'name',
    // translationKey: 'generic.pipelineName',
    label: 'Pipeline'
  },
  {
    name: 'repository',
    sort: ['repository'],
    width: 500,
    searchField: 'repository',
    translationKey: 'generic.repository',
  },
  {
    name: 'start_ts',
    sort: ['start_ts'],
    searchField: 'start_ts',
    // translationKey: 'generic.time',
    label: 'Time'
  },
  {
    name: 'status',
    sort: ['status'],
    width: 100,
    searchField: 'status',
    translationKey: 'pipelinesPage.table.status',
  },
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),

  filtered: function() {
    let out = this.get('body')||[];
    return out;
  }.property('body'),
});
