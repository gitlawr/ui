import Ember from 'ember';

const DEFAULT_REGISTRY = 'index.docker.io';
export default Ember.Component.extend({
  detectingPush: false,
  registries: null,
  matchedRegistry: null,
  pushDisabled: true,
  resolvedRegistry: function(){
    var images = this.get('selectedModel.targetImage');
    // this.set('pushDisabled', false);
    if(!images){
      // this.set('pushDisabled', true);
      return '';
    }
    var splited = images.split('/');
    if(splited.length < 2){
      return DEFAULT_REGISTRY;
    }
    if(splited[0].indexOf('.')!==-1){
      return splited[0]
    }
    return '';
  }.property('selectedModel.targetImage'),
  imageObserves: function(){
    this.set('selectedModel.push',false);
  }.observes('selectedModel.targetImage'),
  pushObserves:function(){
    Ember.run.once(()=>{
      console.log('observes')
      var selectedModel = this.get('selectedModel');
      var push = selectedModel.push;
      var resolvedRegistry = this.get('resolvedRegistry');
      if(push&&resolvedRegistry){
        this.set('detectingPush', true);
        this.set('matchedRegistry',null);
        this.get('store').findAll('registrycredential').then(() => {
          return this.get('store').findAll('registry');
        }).then((res)=>{
          var registries = res;
          var matchedRegistry = registries.find(ele=>ele.serverAddress===resolvedRegistry);
          debugger
          this.set('matchedRegistry',matchedRegistry);
          this.set('detectingPush', false);
          this.set('registries',registries);
          
        }).catch(()=>{
          this.set('detectingPush', false);
        });
      }
    });
  }.observes('selectedModel.push'),
  // matchedRegistryObserves: function(){
  //   debugger
  //   var matchedRegistry = this.get('matchedRegistry');
  //   if(!matchedRegistry){
  //     this.set('selectedModel.push', false);
  //   }
  // }.observes('matchedRegistry')
});
