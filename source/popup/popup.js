enyo.kind({
   name: "MyPopup",
   kind: "VFlexBox",
   components:[
      {name: "msg", content: "TIME'S UP", align: "center", style: "margin: 10px"},
      {kind:"Button",name: "ButtonOK",caption: "OK", onclick: "buttonClick", style: "margin:10px"},
   ],
   constructor: function() {
      this.inherited(arguments);
      enyo.log("create popup kind")
   },
   create: function() {
      this.inherited(arguments);
      this.log(enyo.windowParams.alarmMsg);
      this.$.msg.setContent(enyo.windowParams.alarmMsg);
   },
   buttonClick: function() {
      window.close();
   },
})
