enyo.kind({
    name: "dili.diliTimer",
    kind: enyo.VFlexBox,
    components: [
        {kind: "PickerGroup", lable: "Alarm in:", onChange: "setTimer", components: [
            {name: "hour", value: 0},
            {name: "minute", value: 0},
            {name: "second", value: 0}
        ]},
        {
            kind: "Button",
            caption: "Start",
            onclick: "buttonClick"
        }
    ],
    duration: 0,
    create: function() {
        this.inherited(arguments);
        this.setupHour();
        this.setupMnS();
        this.setDuration();
    },
	setupMnS: function() {
		var items = [];
		for (var i=0; i<60; i++) {
			items.push(i < 10 ? ("0"+i) : String(i));
		}
        this.$.second.setItems(items);
        this.$.second.setValue(items[0]);
		this.$.minute.setItems(items);
        this.$.minute.setValue(items[0]);
	},
	setupHour: function() {
		var items = [];
		for (var i = 0; i <= 99; i++) {
			items.push(String(i));
		}
		this.$.hour.setItems(items);
        this.$.hour.setValue(items[0]);
	},
    setDuration: function() {
        var h = parseInt(this.$.hour.getValue());
        var m = parseInt(this.$.minute.getValue());
        var s = parseInt(this.$.second.getValue());
        this.$.duration = (h * 60 + m) * 60 + s;
    },
    buttonClick: function() {
        timerController(this.$.duration);
    }
});
