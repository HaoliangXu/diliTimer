enyo.kind({
   name: "MyPopup",
   kind: "VFlexBox",
   components:[
      {content: "TIME'S UP", align: "center", style: "margin: 10px"},
      {kind:"Button",name: "ButtonOK",caption: "OK", onclick: "buttonClick", style: "margin:10px"},
   ],
   constructor: function() {
      this.inherited(arguments);
      enyo.log("create popup kind")
   },
   buttonClick: function() {
      window.close();
   },
})
