// happening as follows:
//
//      1. Load URL
//      2. Load same URL, but adding an internal FRAGMENT to it
//      3. Click on an internal Link, that points to another internal FRAGMENT
//      4. Click on an external Link, that will send the page somewhere else
//      5. Close page
//
// Take particular care when going through the output, to understand when
// things happen (and in which order). Particularly, notice what DOESN'T
// happen during step 3.
//
// If invoked with "-v" it will print out the Page Resources as they are
// Requested and Received.
//
// NOTE.1: The "onConsoleMessage/onAlert/onPrompt/onConfirm" events are
// registered but not used here. This is left for you to have fun with.
// NOTE.2: This script is not here to teach you ANY JavaScript. It's aweful!
// NOTE.3: Main audience for this are people new to PhantomJS.

var sys = require("system"),
    page = require("webpage").create(),
    step1url = "https://signup.live.com/signup.aspx";
    console.log("");

logResources = true;

function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
}

var script = function(capcha){
var FormFiller = {

    _email: 'whered', // @outlook.com
    _password: 'imnotSureWhere7',

    setById: function(id, value){
        if (!id || !value)
        {
            throw "Need both parameters for setById";
        }
        document.getElementById(id).value = value;
    },

    checkBox: function(id, value){
        document.getElementById(id).checked = value;
    },

    randInt: function(num1, num2){
        return Math.floor(Math.random() * num2 + num1);
    },

    username: function(){
        this.setById('iFirstName', 'Ronald');
        this.setById('iLastName', 'McLaughlen');
    },

    email: function(){
        var str = 'f234fwe89rfynewasyfhoewashfiwaehfg324aehgasdlgheeeeeeeeexzye';
        for (var i =0; i< this.randInt(10,15); i++){
            this._email += str[this.randInt(0,100) % str.length];
        }
        this.setById('imembernamelive', this._email);
        var alt = '';
        for (var i =0; i< this.randInt(10,20); i++){
            alt += str[this.randInt(0,100) % str.length];
        }

        this.setById('iAltEmail', alt + '@gmail.com');
    },

    password: function(){
         
        this.setById('iPwd', this._password);
        this.setById('iRetypePwd', this._password);
    },

    country: function(){
        this.setById('iCountry','US');
        this.setById('iSMSCountry','US');
    },

    zipcode: function(){
        this.setById('iZipCode','75201');
    },

    birthdate: function(){
        
        this.setById('iBirthMonth','7');
        this.setById('iBirthDay','7');
        this.setById('iBirthYear','1984');
    },

    gender: function(){
        this.setById('iGender','m');
    },

    phone: function(){
        var n = '214' + '555';
        for (var i =0; i<4; i++)
        {
            n += this.randInt(0,9); 
        }
        this.setById('iPhone', n);
    },

    capcha: function(){
     /*   var inputs = $('input').each(function(){
            if ($(this).attr('aria-label') == 'Enter the characters you see')
            {
                this.value = capcha;
                console.log('set capcha to ', capcha);
            }
        
        });*/
        
    },

    init: function(){
        var funcs = ['username','email','password','country','zipcode',
                    'birthdate','gender','phone', 'capcha'];
        for ( var i = 0; i<funcs.length; i++)
        {   
            console.log(funcs[i],i);
            this[funcs[i]]();
        }
        this.checkBox('iOptinEmail',false);
    }

};

    FormFiller.init();


    return {'username': FormFiller._email + '@outlook.com', 'pw': FormFiller._password};

};

page.onInitialized = function() {
    console.log("page.onInitialized");
    printArgs.apply(this, arguments);
};

page.onUrlChanged = function() {
    console.log("page.onUrlChanged");
    printArgs.apply(this, arguments);
};

page.onConsoleMessage = function(msg) {
      console.log(msg);
};
 
page.onLoadStarted = function() {
      loadInProgress = true;
        console.log("load started");
};

page.onNavigationRequested = function() {
    console.log("page.onNavigationRequested");
    printArgs.apply(this, arguments);
};

page.onClosing = function() {
    console.log("page.onClosing");
    printArgs.apply(this, arguments);
};
////////////////////////////////////////////////////////////////////////////////

setTimeout(function() {
    page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.6 Safari/537.11";
    console.log("");
    console.log("### STEP 1: Load '" + step1url + "'");
    page.open(step1url);
}, 0);

var fs = require('fs');

page.onLoadFinished = function() {
    page.includeJs('//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',function() {
    console.log("Clicking something");
       var images = page.evaluate(function() {
            var canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 400;
            canvas.id = 'canVas';
            document.body.appendChild(canvas);
            var images = [];
            console.log('canvas', $('#canVas'));

            var ctx = document.getElementById('canVas').getContext('2d');
            $('#iHipHolder').find('img').each(function() {
               ctx.drawImage((this),0,0);
                if (this.src.toLowerCase().indexOf('gethipdata') != -1){
                    images.push(canvas.toDataURL('image/png'));
                }
           });

           return images;
       });
        console.log('got images', images.length);

       images.forEach(function(imageObj, index, array){
            fs.write('images/im'+index+'.png', imageObj.split(',')[1], 'w');
       });

       console.log("Enter captcha: ");
       var capcha = sys.stdin.read(6);
        var newuser = page.evaluate(script, capcha);
        console.log("new user: ", JSON.stringify(newuser));
        var getTitle = function(){
            page.evaluate(function(){
                    console.log('title: ', document.title);
                    var ret = '';
                    ret += document.title;
                    return ret;
            });
        };

        setTimeout(function() {
            getTitle();
            page.render("page.png");
            // phantom.exit();
        }, 5000);
        // phantom.exit();
    });
};

