enyo.kind({
  name:  'SimpleTimer',
  kind: "Control",
  published: {
    timerDuration: 30,
    status: "stopped",
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
       onCancel: "handleCancel",
       components : [
          {kind: "HFlexBox",
             components: [
                {kind: "Control", name: "ppButton", className: "dili-progress-button-play", onclick: "handlePpButtonClick"},
                {name: "title" , content: "diliTimer"},
                {kind: "Spacer",},
                {name: "totalTime", content: "00:00:00"},
                {kind: "Spacer",},
                {name: "timeRemaind", content: "Remainding", width: "68px"},
                //TODO {kind: "Control", name: "stopButton", className: "dili-progress-button-stop", onclick: "handleStopButtonClick",},
             ],
         }
       ],
    },
  ],

  create: function () {
    this.inherited(arguments);
    this.$.totalTime.setContent(timeU.TtoS(this.timerDuration));
    this.$.timeRemaind.setContent(timeU.TtoS(this.$.progressButton.getPosition()))
    this.$.progressButton.setMaximum(this.timerDuration);
    this.$.animator.setDuration(this.timerDuration * 1000);
  },

  handlePpButtonClick: function() {
     //determin play or pause or resume first
     switch (this.status) {
        case "timing":
           //to pause)
           this.$.animator.stop();
           this.$.ppButton.addClass("dili-progress-button-play");
           this.$.ppButton.removeClass("dili-progress-button-pause");
           this.status = "paused";
           this.doSimpleTimerPause();
           break;
        case "stopped":
           //to start
           this.$.animator.play(0, this.timerDuration);
           this.$.ppButton.addClass("dili-progress-button-pause");
           this.$.ppButton.removeClass("dili-progress-button-play");
           this.status = "timing";
           this.doSimpleTimerStart();
           if (this.timerDuration == 0) this.endAnimation();
           break;
        case "paused":
           //to resume
           this.$.animator.play(this.$.progressButton.getPosition(), this.timerDuration);
           this.$.ppButton.addClass("dili-progress-button-pause");
           this.$.ppButton.removeClass("dili-progress-button-play");
           this.status = "timing";
           this.doSimpleTimerResume();
           break;
     }
  },
   handleCancel: function() {
      //when the cancel of progressbutton clicked
     switch (this.status) {
        case "timing":
           //to pause)
           this.$.animator.stop();
           this.$.ppButton.addClass("dili-progress-button-play");
           this.$.ppButton.removeClass("dili-progress-button-pause");
           break;
        case "paused":
           //to resume
           break;
     }
     this.$.progressButton.setPosition(0);
     this.status = "stopped";
     this.doSimpleTimerStop();
   },
  stepAnimation: function(inSender, inValue) {
    this.$.progressButton.setPosition(inValue);
    this.$.timeRemaind.setContent(timeU.TtoS(this.timerDuration - this.$.progressButton.getPosition()));
  },

  beginAnimation: function(inSender, inStart, inEnd) {
    //this.$.progressButton.setPosition(0);
    //this.doSimpleTimerStart();
  },

  endAnimation: function(inSender, inValue) {
    this.status = "stopped";
    this.$.progressButton.setPosition(0);
     this.$.ppButton.addClass("dili-progress-button-play");
     this.$.ppButton.removeClass("dili-progress-button-pause");
    this.doSimpleTimerEnd();
  },

  timerDurationChanged: function() {
    this.$.totalTime.setContent(timeU.TtoS(this.timerDuration));
    this.$.progressButton.setMaximum(this.timerDuration);
    this.$.animator.setDuration(this.timerDuration * 1000);
    this.$.timeRemaind.setContent(timeU.TtoS(this.timerDuration));
  }
});

enyo.kind({
  name:  'dili.diliTimer',
  kind: "Control",
  components: [
    {kind: enyo.ApplicationEvents, onApplicationRelaunch: "relaunchHandler"},
    {name: "makeSysSound", kind : "PalmService",
        service : "palm://com.palm.audio/systemsounds",
        method : "playFeedback",
        onSuccess : "makeSoundSuccess",
        onFailure : "makeSoundFailure"
    },

    {name: "simpleTimer", kind: "SimpleTimer",
     onSimpleTimerStop: "simpleTimerStopped",
     onSimpleTimerPause: "simpleTimerPaused",
     onSimpleTimerResume: "simpleTimerResumed",
       onSimpleTimerStart: 'simpleTimerStarted',
       onSimpleTimerEnd: 'simpleTimerEnded'
    },
    {name: "timerHandler", kind: "dili.timerHandler",
        onSetupAlarmSuccess: "setupAlarmSuccess",
        onClearAlarmSuccess: "clearAlarmSuccess",
        onSetupAlarmFailure: "setupAlarmFailure",
        onClearAlarmFailure: "clearAlarmFailure"
    },
    //TODO wrap in a scroller
      {name:"timeSetter", kind:"dili.TimePickerGroup",
         onTimeChange: "handleTimeChange"
      },
  ],

  create: function () {
    var initialDuration = 0;
    this.inherited(arguments);
    this.$.simpleTimer.setTimerDuration(initialDuration);
  },
     simpleTimerStopped: function () {
        this.simpleTimerEnded();
        this.$.timerHandler.clearAlarm("dili");
     },
     simpleTimerPaused: function() {
        this.$.timerHandler.clearAlarm("dili");
     },
     simpleTimerResumed: function() {
       var td = this.$.simpleTimer.getTimerDuration();
       var startTime = new Date();
       var endTime = new Date(startTime.getTime() + td * 1000);
       var endTimeString = timeU.DOtoS(endTime);
       this.log(td + " and " + endTimeString);
       this.$.timerHandler.setupAlarm("dili", endTimeString,
           {"id":"com.wikidili.dilitimer","params":{"action":"alarmWakeup"}}
       );
     },

  simpleTimerStarted: function () {
     this.simpleTimerResumed();
    this.$.timeSetter.disableAll();
  },
  simpleTimerEnded: function () {
    this.$.timeSetter.enableAll();
  },
    setupAlarmSuccess: function() {
        this.log("Alarm set");
    },
    clearAlarmSuccess: function() {
        this.log("Alarm clear");
    },
    setupAlarmFailure: function(inSender, inError, inRequest) {
        this.log(enyo.json.stringify(inError));
    },
    clearAlarmFailure: function() {
        this.log("Alarm clear failed");
    },

    relaunchHandler: function(inSender, inEvent) {
        this.log("relaunchHandler");
        if (enyo.windowParams.action == "alarmWakeup") {
            this.$.makeSysSound.call({"name": "dtmf_2"});
             enyo.windows.openPopup("source/popup/popup.html", "MyPopup", {}, {}, "100px", true);
        }
    },
    makeSoundSuccess: function(inSender, inResponse) {
        this.log("Make sound success, results=" + enyo.json.stringify(inResponse));
    },          
    // Log errors to the console for debugging
    makeSoundFailure: function(inSender, inError, inRequest) {
        this.log(enyo.json.stringify(inError));
    },

///////////////////////////timePickerGroup
   handleTimeChange: function(inSender, inArray){
      //check if the values for timeGroupPicker are valid , or return false
      this.log(inArray);
      var a = [];
      for (var i = 0; i < 3; i++) {
            a[i] = parseInt(inArray[i].join(""));
            if (a[i] > inSender.max[i] && a[i] <  inSender.min[i]){
               this.warn("TimeChange to invalid value");
               return false;
            };
      }
      
      this.$.timeSetter.setValue(inArray);
      var newDuration = (a[0] * 60 + a[1]) * 60 + a[2];
      this.$.simpleTimer.setTimerDuration(newDuration);
   },



});

/*
enyo.kind({
    name: "appHandler",
    kind: "Component",
    components: {
        {kind: "ApplicationEvents",
            onUnload: "cleanup",
            onLoad: "startup"
        }
    },
    launch: function(params) {
    },
    cleanup: function() {
    },
    startup: function() }
    },
});*/

enyo.kind({
    name: "dili.dateUtils",
    kind: "Component",
    DOtoS: function(DO) {
        //DateObject to String
    	var Y = DO.getUTCFullYear();
	    var M = DO.getUTCMonth() + 1;
    	var D = DO.getUTCDate();
    	var h = DO.getUTCHours();
    	var m = DO.getUTCMinutes();
    	var s = DO.getUTCSeconds();
    	var Y = "" + Y;
    	if (M < 10) M = "0" + M;
    	if (D < 10) D = "0" + D;
    	if (h < 10) h = "0" + h;
    	if (m < 10) m = "0" + m;
    	if (s < 10) s = "0" + s;
    	//   "mm/dd/yyyy hh:mm:ss"
    	return M + "/" + D + "/" + Y + " " + h + ":" + m + ":" +s;

    },
    TtoS: function(seconds) {
        //time to string
       var string = "";
    	var sec = seconds % 60;
	    var min = (seconds - sec) / 60;
	var hour = parseInt(min / 60);
	min -= hour * 60;
         if (hour < 10) string = "0";
            string += hour + ":";
         if (min < 10) string += "0";
    	string += min + ":";
	    if (sec < 10)
		    string += "0";
    	string += sec;
	    return string;
    },
    TtoTS: function() {
        //time to timeStamp
    },
    TStoT: function() {
        //timeStamp to time
    },
    typeOfTime: function() {
        //detect time type
    },
    timePlus: function() {
        //add time to time
    },
    OtoD: function(inArray) {
       //Array[[0,0],[0,0],[0,0]] to duration seconds
       var a = [];
         for (var i = 0; i < 3; i ++) {
            a[i] = this.AtoD(inArray[i]);
         }
         return (a[0] * 60 + a[1]) * 60 + a[2];
    },
    AtoD: function(inArray) {
       var a = 0;
       for (var i = 0; i < inArray.length; i ++) {
            a = a * 10 + inArray[i];
      }
      return a;
    },
});
