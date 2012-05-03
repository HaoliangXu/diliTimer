
enyo.kind({
   name: "dili.timer",
   kind: "Component",
   published: {
      starting: 0,
      ending: 100,
      step: 1000,
   },
   events: {
      onHit: "",
      onStopped: "",
      onStarted: "",
   },
   create: function() {
      this.inherited(arguments);
      this.point = 0;
      this.intervalKey = 0;
   },
   destroy: function(){
      clearInterval(this.intervalKey);
   },
   start: function(inStarting,inEnding,inStep){
      this.starting = inStarting;
      this.point = this.starting;
      this.ending = inEnding;
      if (inStep) this.step = inStep;
      this.intervalKey = setInterval(enyo.bind(this,this.hit),this.step);
      this.doStarted();
   },
   stop: function(){
      clearInterval(this.intervalKey);
      this.doStopped();
   },
   hit: function(){
      this.point ++;
      this.doHit();
      if (this.point == this.ending) {
         this.stop();
      }
   },
});


