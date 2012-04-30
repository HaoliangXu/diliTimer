enyo.kind({
  //TODO change the logic to statuChanged method manage all actions
   //all other events trigger statuChanged method
   //this._statu to save the current statu in statuChanged method
  name:  'dili.TimerController',
  kind: "Control",
  published: {
    timerDuration: 30,
    timerPosition: 0,
  },
  events: {
     onSimpleTimerStop: "",
     onSimpleTimerPause: "",
     onSimpleTimerResume: "",
    onSimpleTimerStart: "",
    onSimpleTimerEnd: ""
  },
  components: [
    {name: "animator", kind: enyo.Animator, easingFunc: enyo.easing.linear,
      duration: 30000, tick: 1000, onBegin: "beginAnimation",
     onAnimate: "stepAnimation", onEnd: "endAnimation"
    },
    {name: "progressButton", kind: "ProgressButton", flex:1, minimum: 0,
       position: 0,
       //onclick: "handlePpButtonClick",
       onCancel: "handleCancel",
       components : [
          {kind: "HFlexBox",
             components: [
                {kind: "Control", name: "ppButton", className: "dili-progress-button-play", onclick: "handlePpButtonClick"},
                {name: "title" , content: "Start",width:"54px", onclick:"handlePpButtonClick"},
                {kind: "Spacer", onclick:"handlePpButtonClick",},
                {name: "timeRemaind", content: "00:00:00", onclick:"handlePpButtonClick"},
                {kind: "Spacer", onclick:"handlePpButtonClick",},
                {name: "totalTime", content: "Remainding", width: "59px"},
                //TODO {kind: "Control", name: "stopButton", className: "dili-progress-button-stop", onclick: "handleStopButtonClick",},
             ],}
       ],
    },
  ],

  create: function () {
    this.inherited(arguments);
    this.status = {"stopped":"stopped", "paused":"paused", "timing": "timing"};
    this.statu = this.status.stopped;
    this.buttonStatus = {start:"Start",resume:"Resume",pause:"Pause"};
   this.$.title.setContent(this.buttonStatus.start);
    this.$.totalTime.setContent(timeU.TtoS(this.timerDuration));
    this.$.timeRemaind.setContent(timeU.TtoS(this.timerDuration - this.timerPosition));
    this.$.progressButton.setMaximum(this.timerDuration);
    this.$.animator.setDuration(this.timerDuration * 1000);
  },

  handlePpButtonClick: function() {
     //determin play or pause or resume first
     switch (this.statu) {
        case this.status.timing:
           //to pause)
           this.$.animator.stop();
           this.$.ppButton.addClass("dili-progress-button-play");
           this.$.ppButton.removeClass("dili-progress-button-pause");
           this.statu = this.status.paused;
           this.$.title.setContent(this.buttonStatus.resume);
           this.doSimpleTimerPause();
           break;
        case this.status.stopped:
           //to start
           this.$.animator.setDuration(this.timerDuration * 1000);
           this.$.animator.play(0, this.timerDuration);
           this.$.ppButton.addClass("dili-progress-button-pause");
           this.$.ppButton.removeClass("dili-progress-button-play");
           this.statu = this.status.timing;
           this.$.title.setContent(this.buttonStatus.pause);
           this.doSimpleTimerStart();
           if (this.timerDuration == 0) this.endAnimation();
           break;
        case this.status.paused:
           //to resume
           this.$.animator.setDuration((this.timerDuration - this.timerPosition) * 1000);
           this.$.animator.play(this.timerPosition, this.timerDuration);
           this.$.ppButton.addClass("dili-progress-button-pause");
           this.$.ppButton.removeClass("dili-progress-button-play");
           this.statu = this.status.timing;
           this.$.title.setContent(this.buttonStatus.pause);
           this.doSimpleTimerResume();
           break;
     }
     return false;
  },
   handleCancel: function() {
      //when the cancel of progressbutton clicked
     switch (this.statu) {
        case this.status.timing:
           //to pause)
           this.$.animator.stop();
           this.$.ppButton.addClass("dili-progress-button-play");
           this.$.ppButton.removeClass("dili-progress-button-pause");
           break;
        case this.status.paused:
           //to resume
           break;
        return false;
     }
     this.$.progressButton.setPosition(0);
     this.statu = this.status.stopped;
     this.$.title.setContent(this.buttonStatus.start);
     this.doSimpleTimerStop();
   },
  stepAnimation: function(inSender, inValue) {
    this.$.progressButton.setPosition(inValue);
    this.timerPosition = this.$.progressButton.getPosition();
    this.$.timeRemaind.setContent(timeU.TtoS(this.timerDuration - this.timerPosition));
  },

  beginAnimation: function(inSender, inStart, inEnd) {
    //this.$.progressButton.setPosition(0);
    //this.doSimpleTimerStart();
  },

  endAnimation: function(inSender, inValue) {
    this.statu = this.status.stopped;
           this.$.title.setContent(this.buttonStatus.start);
    this.$.progressButton.setPosition(0);
     this.$.ppButton.addClass("dili-progress-button-play");
     this.$.ppButton.removeClass("dili-progress-button-pause");
    this.doSimpleTimerEnd();
  },

  timerDurationChanged: function() {
    this.$.totalTime.setContent(timeU.TtoS(this.timerDuration));
    this.$.progressButton.setMaximum(this.timerDuration);
    //this.$.animator.setDuration(this.timerDuration * 1000);
    this.timerPosition = this.timerDuration;
    this.$.timeRemaind.setContent(timeU.TtoS(this.timerPosition));
  },
  changeStatu: function(statu, position, duration) {
     if (statu != "stopped") {
      this.setTimerDuration(duration);
      this.setTimerPosition(position);
     }
      if (statu != this.statu) {
         switch (statu) {
            case "timing":
               this.statu = this.status.paused;
               this.handlePpButtonClick();
               break;
            case "paused":
               this.stepAnimation(this, position);
               this.$.title.setContent(this.buttonStatus.resume);
               this.statu = this.status.paused;
               break;
         }
      }
  },
});


