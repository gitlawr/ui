import Ember from 'ember';

const stepOneChoice = [{
  id: 'scm',
}];

const stepsChoices = [{
    id: 'task',
  },{
    id: 'build',
  },{
    id: 'upgradeService'
  },{
    id: 'upgradeStack'
  }
  ,{
    id: 'upgradeCatalog'
  }
];

export default Ember.Component.extend({
  selectedModel: function(){
    return this.get('model')[this.get('type')]
  }.property('model','type'),
  stepsTypeChoices: null,
  type: null,
  model: null,
  init(){
    this._super(...arguments);
    var stepMode = this.get('modalOpts.stepMode');
    if(stepMode === 'scm'){
      this.set('stepsTypeChoices', stepOneChoice);
    }else{
      this.set('stepsTypeChoices', stepsChoices);
    }
  },
  // whenTypeChange: function(){
  //   var type = this.get('type');
  //   var selectedModel = this.get('selectedModel');
  //   this.get('model').set(selectedModel.type, selectedModel);
  //   // Arrange it to next lifecycle.
  //   // setTimeout(()=>{
  //     // this.set('selectedModel', this.get('model')[type]);
  //   // },0)
  // }.observes('type'),
  actions: {
    changeSCMType: function(type){
      this.set('selectedModel.sourceType',type);
    }
  }
});
