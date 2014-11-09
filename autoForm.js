// Paste into browser to auto fill form

(function(capcha){

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

    window.prompt("Copy to clipboard: Ctrl+C, Enter", FormFiller._email);

    return {'username': FormFiller._email + '@outlook.com'};

})();


