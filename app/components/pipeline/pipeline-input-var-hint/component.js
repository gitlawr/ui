import Ember from 'ember';

export default Ember.Component.extend({
  hintAry: [
    'GIT_COMMIT'
    ,'GIT_PREVIOUS_COMMIT'
    ,'GIT_PREVIOUS_SUCCESSFUL_COMMIT'
    , 'GIT_BRANCH'
    , 'GIT_LOCAL_BRANCH'
    ,'GIT_URL'
    ,'GIT_COMMITTER_NAME'
    ,'GIT_AUTHOR_NAME'
    ,'GIT_COMMITTER_EMAIL'
    ,'GIT_AUTHOR_EMAIL'
    ,'SVN_REVISION'
    ,'SVN_URL'
    ,'BUILD_NUMBER/ID'
    ,'PIPELINE_NAME'
    ,'TRIGGER_TYPE'
    ,'NODE_NAME'
    ,'ACTIVITY_ID'
    ,'ACTIVITY_SEQUENCE'
    ,'ACTIVITY_NODENAME'
  ].map(ele=>{
    return '${'+ele+'}';
  }),
  positionX: 0,
  positionY: 0,
  positionStyle: function(){
    var positionX = this.get('positionX'), positionY=this.get('positionY');
    return [
      'position: fixed',
      `top: ${positionX}px`, 
      `left: ${positionY}px`,
      `z-index: 9999`
    ].join(';')
  }.property('positionX','positionY'),
  startStr: '$',
  triggerInputEle: null,
  hidden: true,
  triggerClickHint: null,
  matchedIndex: -1,
  hiddenClass:function(){
    var hd = this.get('hidden');
    return hd?'hide':'';
  }.property('hidden'),
  showHint(x,y){
    debugger
    this.set('positionX',x);
    this.set('positionY',y);
    this.set('hidden',false);
  },
  setTriggerInputEle(ele){
    this.set('triggerInputEle',ele)
  },
  startHint(ele,cb){
    this.set('triggerInputEle',ele)
    var el = this.get('triggerInputEle');
    if(!el){
      this.setTriggerInputEle(null)
      this.set('triggerClickHint',null);
      this.set('hidden',true);
      return false;
    }
    var $el = this.$(el);
    var value = $el.val();
    var matched = false;
    var hintAry = this.get('hintAry');
    var _$value = value.lastIndexOf('$');
    this.set('matchedIndex', _$value);
    _$value = value.slice(_$value,value.length);
    if(_$value){
      for (var i = 0; i < hintAry.length; i++) {
        var item = hintAry[i];
        //if matched on end
        if((item.indexOf(_$value) === 0)){
          matched = true;
          break;
        }
      }
      if (matched) {
        var offset = $el.offset();
        this.showHint(offset.top+$el.height(),offset.left);
        this.set('triggerClickHint',cb);
        return true;
      }
    }
    this.setTriggerInputEle(null)
    this.set('triggerClickHint',null);
    this.set('hidden',true);
    return false;
    
  },
  actions: {
    clickHint(val){
      var triggerClickHint = this.get('triggerClickHint');
      triggerClickHint&&triggerClickHint(val)
      var triggerInputEle = this.get('triggerInputEle');
      var matchedIndex = this.get('matchedIndex');
      var value = $(triggerInputEle).val();
      if(matchedIndex !==-1 && triggerInputEle){
        $(triggerInputEle).val(value.slice(0,matchedIndex).concat(val));
      }
    }
  },
  didRender(){
    // extend Jquery
    if(window.jQuery||window.$){
      jQuery.fn.E_INPUT_HINT = this;

      jQuery.fn.getCursorPosition = function(){
        if(this.lengh == 0) return -1;
        return $(this).getSelectionStart();
      }
    }
    this.$(document).on('click',()=>{
      this.set('hidden',true);
    })
  },
});
