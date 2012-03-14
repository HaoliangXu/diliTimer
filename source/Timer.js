enyo.kind({
    name: "dili.Timer",
    events: {
        onAlarm: "",
    },
    components: [
        {
            name: "setAlarm",
            kind: "PalmService",
            service: " palm//com.palm.service.timeout/",
            method: "",
            onSuccess: "",
            onFailure: ""
        }
    ],
    create: function() {
    //some initial jobs. set flags.
    },
    setAlarm: function() {
    //setup alarm by palmservice
    },
    removeAlarm: function() {
    //remove Alarm
    },
    receiveAlarm: function() {
    //triggers when alarm, via a callback
    },
    showTimer: function() {
    //to show the Timer
    } 
})
