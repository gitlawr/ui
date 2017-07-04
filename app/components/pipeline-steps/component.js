import Ember from 'ember';

export default Ember.Component.extend({
  sortFinishText: null,
  model: null,
  stageInfo: null,
  stageIndex: null,
  sortingScope: function() {
    return this.get('stageId')
  }.property('stageId'),
  didInsertElement(){
    var stepMode = this.get('stepMode')
    var editMode= this.get('editMode')
    if(stepMode==="scm"&&editMode==="new"){
      this.triggerAction({
        action: 'addStep',
        target: this
      })
    }
  },
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
        stageInfo: this.get('stageInfo'),
        stageIndex: this.get('stageIndex'),
        stepMode: this.get('stepMode'),
        editMode: this.get('editMode'),
        cb: (step) => {
          this.get('model').pushObject(step);
        }
      });
    },
    editStep: function(index) {
      this.get('modalService').toggleModal('modal-pipeline-new-step', {
        type: 'edit',
        params: this.get('model')[index],
        stageInfo: this.get('stageInfo'),
        stageIndex: this.get('stageIndex'),
        stepMode: this.get('stepMode'),
        editMode: this.get('editMode'),
        cb: (step) => {
          var model = this.get('model');
          var newModel = model.map((ele,i) => {
            if(i===index){
              return step
            }
            return ele
          })
          this.set('model',newModel);
        },
        rmCb: ()=>{
          var model = this.get('model');
          var newModel = model.filter((ele,i) => {
            if(i===index){
              return false
            }
            return true
          })
          this.set('model',newModel);
        }
      });
    }
  }
});
