import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  model: null,
  sortingScope: function() {
    return this.get('stageId')
  }.property('stageId'),

  modalService: Ember.inject.service('modal'),
  actions: {
    dragStart: function(object) {
      console.log('Drag Start', object);
    },
    sortEndAction: function() {
      console.log(this.get('stageId'));
      console.log('Sort Ended', this.get('model.pages'));
    },
    addStep: function() {
      this.get('modalService').toggleModal('modal-pipeline-new-step', {
        type: 'add',
        cb: (step) => {
          this.get('model').pushObject(step);
        }
      });
    },
    editStep: function(index) {
      this.get('modalService').toggleModal('modal-pipeline-new-step', {
        type: 'edit',
        params: this.get('model')[index],
        cb: (step) => {
          var model = this.get('model');
          var newModel = model.map((ele,i) => {
            if(i===index){
              return step
            }
            return ele
          })
          this.set('model',newModel);
        }
      });
    }
  }
});
