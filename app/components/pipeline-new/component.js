import Ember from 'ember';

export default Ember.Component.extend({
  userList: null,
  pageModel: Ember.Object.create({
    selectedApprovers: []
  }),
  init() {
    this._super(...arguments);
  },
  selectedApprovers: function() {
    return this.get('userList').filter(ele=>!!ele.selected)
  }.property('userList.@each.selected'),
  actions: {
    save: function(success) {
      success(true)
      return false
    },
    cancel: function() {
      // TODO: set default done() go back to pipelines.index.active
      this.done();
    },
    approverSelect: function(index) {
      debugger
      let selected = this.get('userList')[index].selected;
      this.get('userList')[index].set('selected', !selected);
    }
  }
});
