import Ember from 'ember';

export default Ember.Component.extend({
  repos:[{repo: 'test'}],
  selected: null,
  statusFetching: true,
  setting: null,
  init(){
    this._super(...arguments);
    this.loadRepository();
  },
  loadRepository(){
    var selectedModel = this.get('selectedModel');
    var pipelineStore = this.get('pipelineStore');
    this.set('statusFetching',true);
    pipelineStore.find('setting',null, {forceReload: true}).then((res)=>{
      this.set('setting',res);
      if(res.isAuth){
        return res.doAction('getrepos');
      }else{
        this.set('statusFetching',false);
        return null
      }
    }).then((res)=>{
      if(!res){
        return
      }
      var repos = JSON.parse(res)
      this.set('repos',repos);
      this.syncRepository();
      this.set('statusFetching',false);
    }).catch(()=>{

    });
  },
  syncRepository(){
    var selectedModel = this.get('selectedModel');
    var repos = this.get('repos',repos);
    if(selectedModel.repository){
      var selected = repos.find((ele)=>{
        if(ele.clone_url === selectedModel.repository){
          return true;
        }
        return false;
      })
      selected&&this.set('selected', selected)||this.set('selected',null)
    }
  },
  selectedObserves: function(){
    var selected = this.get('selected');

    if(!selected){
      this.set('selectedModel.repository', '');
      return
    }
    this.set('selectedModel.repository', selected.clone_url);
  }.observes('selected','selectedModel.sourceType'),
  sourceTypeObserves: function(){
    this.syncRepository();
  }.observes('selectedModel.sourceType'),
  actions: {
    changeSCMType: function(type){
      this.set('selectedModel.sourceType',type);
    },
    reload: function(){
      this.loadRepository();
    }
  }
});
