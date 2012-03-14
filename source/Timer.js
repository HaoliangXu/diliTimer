enyo.kind({
    name: "dili.Timer",
    events : {
        
    },
    components: [
        {
            name: "setAlarm",
            kind: "PalmService",
            service: " palm//com.palm.service.timeout/",
            method: "set",
            onSuccess: "setAlarmSuccess",
            onFailure: "setAlarmFailure"
        },
        {
            name: "removeAlarm",
            kind: "PalmService",
            service: "palm//com.palm.service.timeout/",
            method: "clear",
            onSuccess: "removeAlarmSuccess",
            onFailure: "removeAlarmSuccess"
        }
    ],
    create: function() {
    //some initial jobs. set flags.
    this.inherited(arguments);
    },
    setAlarmSuccess: function() {
    //setup alarm by palmservice
    },
    setAlarmFailure: function() {
    },
    removeAlarmSuccess: function() {
    //remove Alarm
    },
    removeAlarmFailure: function() {
    },
    receiveAlarm: function() {
    //triggers when alarm, via a callback
    },
    showTimer: function() {
    //to show the Timer
    } 
})
