enyo.kind({
    name: "dili.AlarmController",
    kind: "Component",
    events : {
        onSetupAlarmSuccess: "",
        onSetupAlarmFailure: "",
        onClearAlarmSuccess: "",
        onClearAlarmFailure: "" 
    },
    components: [
        {
            name      : "setAlarm",
            kind      : "PalmService",
            service   : "palm://com.palm.power/timeout/",
            method    : "set",
            onSuccess : "doSetupAlarmSuccess",
            onFailure : "doSetupAlarmFailure"
        },
        {
            name      : "removeAlarm",
            kind      : "PalmService",
            service   : "palm://com.palm.power/timeout/",
            method    : "clear",
            onSuccess : "doClearAlarmSuccess",
            onFailure : "doClearAlarmSuccess"
        }
    ],
    create: function() {
        //some initial jobs. set flags.
        this.inherited(arguments);
    },
    setupAlarm: function (timeoutKey, time, wakeUpDevice, params) {
        var alarmParams = {
            "key"    : timeoutKey,
            "uri"    : "palm://com.palm.applicationManager/launch",
            "wakeup" : wakeUpDevice,
            "params" : params//{"id":"com.wikidili.dilitimer","params":{"action":"alarm"}},
        };
        if (time.length == 8) {
            //setAlarmTime in
            alarmParams["in"] = time;
        } else if (time.length == 19) {
            //setAlarmTime at
            alarmParams["at"] = time;
        } else {
            return false;
        }
        //enyo.log(alarmParams);
        this.$.setAlarm.call(alarmParams);
    },
    clearAlarm: function(timeoutKey) {
        this.$.removeAlarm.call({
            key: timeoutKey,
        });
    },
})
