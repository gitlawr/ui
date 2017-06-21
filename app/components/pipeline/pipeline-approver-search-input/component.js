import Ember from 'ember';

export default Ember.Component.extend({
  state: Ember.Object.create({
    selecting: false,
    inputVal: ''
  }),
  selectedEle: Ember.Object.create({}),
  model: null,
  filteredModel: function() {
    var model = this.get('model');
    return model.filter(el => {
      var val = this.get('state.inputVal');
      return el.name.indexOf(val) !== -1;
    })
  }.property('state.inputVal'),
  actions: {
    select: function(item, index) {
      this.sendAction('approverSelect',index);
    },
    showSelectList: function() {
      this.get('state').set('selecting', true);
    },
    hideSelectList: function() {
      setTimeout(() => {
        this.get('state').set('selecting', false);
      }, 0)
    },
  }
});
