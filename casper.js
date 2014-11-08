
var sys = require("system"),
    fs = require('fs');

var usernames = [];

var stream = fs.open('names', 'r');

while(!stream.atEnd())
{
    usernames.push(stream.readLine());
}

var casper = require('casper').create({
        clientScripts:  [
            'includes/jquery.js',      // These two scripts will be injected in remote
        ],
        pageSettings: {
            loadImages:  true,        // The WebPage instance used by Casper will
            loadPlugins: true         // use these settings
        },
        viewportSize: {width: 1920, height: 1980},
        pageSettings: {
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11"
         },
        logLevel: "info",              // Only "info" level messages will be logged
        verbose: true                  // log messages will be printed out to the console
});

casper.on('remote.message', function(message) {
        this.echo(message);
});

function randInt(num1, num2){
        return Math.floor(Math.random() * num2 + num1);
};

// get captcha
var captcha = '';
/*casper.start('http://whatismyip.com', function() {
    console.log('Captcha: ');
              this.evaluate(function() {
                            });
                  this.capture("google.png");
                    }, function onTimeout() {
                            this.die("URL timed out.");
      this.die();
});*/

casper.start('https://signup.live.com/signup.aspx', function() {
    var self = this;
    setTimeout(function(){
    //casper.evaluate(function(){
    //    $('[title="Get a new challenge"]').click();
    //});
    do{
        self.capture('google.png');
        console.log('file:///home/pp/phantomjs/bingMiner/google.png');
        console.log('Captcha: ');
        captcha = sys.stdin.read(6);
    }while(captcha.indexOf('\n') != -1);
    console.log('read ', captcha);
    },2200);

});

casper.then(function(){

    this.evaluate(function(){
        $("#iliveswitch").click();
    });
});

// fill form and submit
casper.then( function() {
        // search for 'casperjs' from google form
        var str = 'f234fwe89rfynewasyfhoewashfiwaehfg324aehgasdlgheeeeeeeeexzye';
        var email = 'wheredi7';
        for (var i =0; i< randInt(10,15); i++){
            email += str[randInt(0,100) % str.length];
        }
        var alt = '';
        for (var i =0; i< randInt(10,20); i++){
            alt += str[randInt(0,100) % str.length];
        }
        var n = '214' + '555';
        for (var i =0; i<4; i++)
        {
            n += randInt(0,9);
        }

        this.fillSelectors('#SignUpForm'
            , {
                'input[aria-label="Enter the characters you see"]': captcha
                , '#iOptinEmail': false
            }
            , false
            )
        var pw = 'imnotSureWhere7';
        this.fill('#SignUpForm'
            , { 
                iFirstName: 'Rudolf'
            , iLastName: 'Flannigan'
            , imembernamelive: email
            , iAltEmail: alt + '@outlook.com'
            , iPwd: pw
            , iRetypePwd: pw
            , iCountry: 'US'
            , iSMSCountry: 'US'
            , iZipCode: '75201'
            , iBirthMonth: '7'
            , iBirthYear: '1984'
            , iBirthDay: '7'
            , iGender: 'm'
            , iPhone: n
            }
            , true);


        this.evaluate(function(){
            $($('#createbuttons').find('input')).click();
        });
        this.capture('google.png');
        var self = this;
        setInterval(function(){
            self.evaluate(function(){
                $($('#createbuttons').find('input')).click();
                $($('#createbuttons').find('input')).trigger('click');
            });
            self.capture('google.png');

            sys.stdin.flush();
            console.log('username:');
            console.log(email);
            /*console.log('Is the account valid (Y/n) (reload *.png to confirm)? ');
            var v = sys.stdin.read(2);
            if (v.toLowerCase().indexOf('y') != -1)
            {
                usernames.push(email); 
                console.log('added ', email);
                exit();
            }
            else if (v.toLowerCase().indexOf('n') != -1)
                exit();*/

        },5000);

        
});

casper.run(function(){


});

exit = function(){
    fs.write('names', usernames.join('\n'), 'w');
    console.log('saved names');
    casper.exit();
}

console.log('running bing miner');



