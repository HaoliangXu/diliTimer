//TODO:
//
//
enyo.kind({
   name: "dili.TimePickerGroup",
   kind: "HFlexBox",
   pack: "center",
   align: "center",
   events: {
      onTimeChange:"",
   },
   published: {
      timeArray: [[0, 0], [0, 0], [0, 0]],
      max:[99,59,59],
      min:[0,0,0],
      tt: ["hr","min","sec"],//title token
   },
   create: function() {
      this.inherited(arguments);
      var a = [];
      for (var i = 0; i < 3; i ++) {
         var o = {name: "group" + i, kind: "dili.NumGroup", maxNum: this.max[i], caption: this.tt[i], onNumChange: "handleNumChange", num: this.timeArray[i], order: i};
         a.push(o);
      }
      this.createComponents(a);
   },
   handleNumChange: function(inSender, inArray){
      //when any thing within changed
      //v ex: [[1,2],[3,4],[5,6]]
      //inArray ex: [5,6]
      var v = [];
      for (var i = 0; i < 3; i ++) {//deep copy this.timeArray
         v[i] = this.timeArray[i].slice(0);
      }
      v[inSender.order] = inArray;
      this.doTimeChange(v);
   },
   setValue: function(inArray){
      //inArray ex: [[1,2],[3,4],[5,6]]
      for (var i = 0; i < 3; i ++) {
         if (inArray[i] != 0) {
            //compare inArray[i] to this.timeArray[i]
            var b = false;
            for (var j = 0; j < inArray[i].length; j++){
               if (inArray[i][j] != this.timeArray[i][j]) {
                  b = true; 
                  break;
               }
            }
            
            if (b) {
               this.$["group" + i].setValue(inArray[i]);
               this.timeArray[i] = inArray[i].slice(0);
            }
         }
      }
   },
   enableAll: function(){
      for (var i = 0; i < 3; i ++) {
         this.$["group" + i].enableAll();
      }
   },   
   disableAll: function(){
      for (var i = 0; i < 3; i ++) {
         this.$["group" + i].disableAll();
      }
   },



});

enyo.kind({
   name: "dili.NumGroup",
   kind: "Group",
   layoutKind: "HFlexLayout",
   events: {
      onNumChange:""
   },
   published: {
      num: [0,0],
      minNum: 0,
      maxNum: 59,
      title: "",
      len: 2,
      order: 0,
   },
   create: function() {
      this.inherited(arguments);
      //determin length 
      //TODO when this.len doesn't equal to this.num.length
      this.len = this.num.length;

      /*TODO determin which numbers are shown in each NumGroup as minimun is set
      var max = this.maxNum;
      var min = this.minNum;
      var dMax = [];
      var dMix = [];
      for (var i = this.len - 1; i >= 0; i--) {
         if (max - min > 10){
            dMax[i] = 9;
            dMin[i] = 0;
            max = Math.floor(max / 10);
            min = Math.floor(min / 10);
         } else {
            dMax[i] = max;
            dMin[i] = min;
         }
      }*/

      //create digitGroups
      var hNum = Math.floor(this.maxNum / Math.pow(10, this.len -1));
      var a = [];
      for (var i = 0; i < this.len; i ++) {
         //[1,2,...,len-1,len]
         var o = {name: "digit" + i, kind: "dili.DigitGroup", onDigitChange: "handleDigitChange", maxDigit: (i == 0? hNum : 9), digit: this.num[i], order: i,} 
         a.push(o);
      }
      this.createComponents(a);
   },

   handleDigitChange: function(inSender,inValue) {
      //v ex: [1,2]
      var v = this.num.slice(0);//copy the array
      v[inSender.order] = inValue;
      this.doNumChange(v);
   },

   setValue: function(inArray){
      //inArray ex: [5,6]
      for (var i = 0; i < this.len; i ++) {
         if (this.num[i] != inArray[i]) {
            this.$["digit" + i].setValue(inArray[i]);
         }
      }
      this.num = inArray.slice(0);
   },
   enableAll: function(){
      for (var i = 0; i < this.len; i ++) {
         this.$["digit" + i].enableAll();
      }
   },   
   disableAll: function(){
      for (var i = 0; i < this.len; i ++) {
         this.$["digit" + i].disableAll();
      }
   },
});

enyo.kind({
   //TODO add settings.js include consts(like class of buttons) and preference
   name:"dili.DigitGroup",
   kind:"VFlexBox",
   defaultKind: "Button",
   events: {
      onDigitChange: "",
   },
   published: {
      minDigit: 0,
      maxDigit: 9,
      digit: 0,
      step: 1, 
      order: 0,
   },

   create: function () {
      this.inherited(arguments);
      var a = [];
      var deviceInfo = (enyo.fetchDeviceInfo().screenHeight) > 500;
      var s = "margin: 0;" + (deviceInfo ? "line-height:40px;font-size: 25px;height:40px; width: 46px" : "");
      for (var i = this.minDigit; i <= this.maxDigit; i += this.step) {
         var o = {name: "button"+ i, kind: "Button", caption: "" + i, onclick: "handleButtonClick", style: s};
         a.push(o);
      };
      this.createComponents(a);
      this.$["button" + this.digit].addClass("enyo-button-affirmative");
   },

   handleButtonClick: function(inSender){
      this.doDigitChange(parseInt(inSender.getCaption()))
   },

   setValue: function(inValue) {
      if (inValue < this.minDigit || inValue > this.maxDigt) return false;
      this.$["button" + this.digit].removeClass("enyo-button-affirmative");
      this.digit = inValue;
      this.$["button" + this.digit].addClass("enyo-button-affirmative");
   },
   enableAll: function(){
      for (var i = this.minDigit; i <= this.maxDigit; i += this.step) {
         this.$["button" + i].setDisabled(false);
      }
   },   
   disableAll: function(){
      for (var i = this.minDigit; i <= this.maxDigit; i += this.step) {
         this.$["button" + i].setDisabled(true);
      }
   },
});
