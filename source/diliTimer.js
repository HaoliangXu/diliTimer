enyo.kind({
  name:  'SimpleTimer',
  kind: "RowGroup",
  caption: "Simple Timer",
  published: {
    timerDuration: 30
  },
  events: {
    onSimpleTimerStart: "",
    onSimpleTimerEnd: ""
  },
  components: [
    {name: "animator", kind: enyo.Animator, easingFunc: enyo.easing.linear,
      duration: 30000, tick: 1000, onBegin: "beginAnimation",
     onAnimate: "stepAnimation", onEnd: "endAnimation"
    },
    {kind: "Control", layoutKind: "HFlexLayout", pack: "start", align: "center",
       components: [
        {name: 'timerProgress', kind: "ProgressBar", flex:1, minimum: 0,
           maximum: 30, position: 0
         }
    ]}
  ],

  create: function () {
    this.inherited(arguments);
    this.setCaption("Simple Timer (" + this.timerDuration + " seconds)");
    this.$.timerProgress.setMaximum(this.timerDuration);
    this.$.animator.setDuration(this.timerDuration * 1000);
  },

  start: function () {
    this.$.animator.play(0, this.timerDuration);
  },

  stepAnimation: function(inSender, inValue) {
    this.$.timerProgress.setPosition(inValue);
  },

  beginAnimation: function(inSender, inStart, inEnd) {
    this.$.timerProgress.setPosition(0);
    this.doSimpleTimerStart();
  },

  endAnimation: function(inSender, inValue) {
    this.$.timerProgress.setPosition(0);
    this.doSimpleTimerEnd();
  },

  timerDurationChanged: function() {
    this.setCaption("Simple Timer (" + this.timerDuration + " seconds)");
    this.$.timerProgress.setMaximum(this.timerDuration);
    this.$.animator.setDuration(this.timerDuration * 1000);
  }
});

enyo.kind({
  name:  'dili.diliTimer',
  kind: "Scroller",
  components: [
    {kind: enyo.ApplicationEvents, onApplicationRelaunch: "relaunchHandler"},
    {name: "timeU", kind: "dili.dateUtils"},
    {name: "makeSysSound", kind : "PalmService",
        service : "palm://com.palm.audio/systemsounds",
        method : "playFeedback",
        onSuccess : "makeSoundSuccess",
        onFailure : "makeSoundFailure"
    },

    {name: "simpleTimer", kind: "SimpleTimer",
       onSimpleTimerStart: 'simpleTimerStarted',
       onSimpleTimerEnd: 'simpleTimerEnded'
    },
    {name: "timerHandler", kind: "dili.timerHandler",
        onSetupAlarmSuccess: "setupAlarmSuccess",
        onClearAlarmSuccess: "clearAlarmSuccess",
        onSetupAlarmFailure: "setupAlarmFailure",
        onClearAlarmFailure: "clearAlarmFailure"
    },
    {name:"timeSetter", kind:"dili.TimePickerGroup", onTimeChange: "handleTimeChange"},
    {kind: "Control", layoutKind: "HFlexLayout", pack: "center", align: "center",
      components: [
        {name: 'startTimer', kind:'Button', caption:'Start Timer',
           width: '60%', onclick:'timerStart'
        }
    ]}
  ],

  create: function () {
    var initialDuration = 0;
    this.inherited(arguments);
    this.$.simpleTimer.setTimerDuration(initialDuration);
  },

  timerStart: function () {
    this.$.simpleTimer.start();
  },

  simpleTimerStarted: function () {
    var td = this.$.simpleTimer.getTimerDuration();
    var startTime = new Date();
    var endTime = new Date(startTime.getTime() + td * 1000);
    var endTimeString = this.$.timeU.DOtoS(endTime);
    this.log(td + " and " + endTimeString);
    this.$.timerHandler.setupAlarm("wiki1", endTimeString,
        {"id":"com.wikidili.dilitimer","params":{"action":"alarmWakeup"}}
    );
    this.$.startTimer.setDisabled(true);
    this.$.timeSetter.disableAll();
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

  simpleTimerEnded: function () {
    this.$.startTimer.setDisabled(false);
    this.$.timeSetter.enableAll();
  },
    relaunchHandler: function(inSender, inEvent) {
        this.log("relaunchHandler");
        if (enyo.windowParams.action == "alarmWakeup") {
            this.$.makeSysSound.call({"name": "dtmf_2"});
             enyo.windows.openPopup("source/popup/popup.html", "MyPopup", {}, {}, "158px", true);
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
    	var sec = seconds % 60;
	    var min = (seconds - sec) / 60;
	
    	var string = min + ":";
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
});
