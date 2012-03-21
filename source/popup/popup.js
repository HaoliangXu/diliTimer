enyo.kind({
   name: "MyPopup",
   kind: "VFlexBox",
   components:[
      {content: "TIMES UP"},
      {kind:"Button",name: "ButtonOK",caption: "OK", onclick: "buttonClick"},
   ],
   constructor: function() {
      this.inherited(arguments);
      enyo.log("create popup kind")
   },
   buttonClick: function() {
      window.close();
   },
})
