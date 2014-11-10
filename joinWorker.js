
//var desktop = 'Mozilla/5.0(Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11';
var desktop = 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36';
var sys = require("system"),
    fs = require('fs'),
    _casper = require('casper');

var casper = _casper.create({
    clientScripts:  [
    'includes/jquery.js',      // These two scripts will be injected in remote
    ],
    pageSettings: {
        loadImages:  true,        // The WebPage instance used by Casper will
    loadPlugins: true         // use these settings
    },
    viewportSize: {width: 1920, height: 1980},
    onError: function(err){  console.log('Err: ',err); },
    pageSettings: {
        userAgent: desktop
    },
    logLevel: "info"//,              // Only "info" level messages will be logged
    //verbose: true                  // log messages will be printed out to the console
});


var logoutLink = '';
var work = function(cb){

//    var casper = _casper.create({
    casper.on('remote.message', function(message) {
        this.echo(message);
    });
    if (casper.cli.args.length < 1)
        throw "Need username";
    var un = casper.cli.args[0]+'@outlook.com';
    console.log('starting ',un);
    var pw = 'imnotSureWhere7';

    // login
    casper.start('https://login.live.com/login.srf', function(){
            console.log('filling out login form');
            this.fill('form[name="f1"]'
                , { 
                    login: un
                , passwd: pw
                }
                , true);

            var self = this;

            console.log('filled out login form');
            });

    // go to bing
    var next = 0;
    // join bing rewards if havent. only works for desktop view
    casper.thenOpen('http://www.bing.com/rewards/dashboard',function(){

        logoutLink = this.evaluate(function(){
            // console.log($('.header').text());
            if ($('.header').text().indexOf('You are not signed in to Bing Rewards') != -1)
            {
//                return '';
            }
            var links = $('#top-level-navigation a');
            var ret = '';
            console.log('links found: ', links.length);
            links.each(function(){
                console.log('sign out link is ', ret);
                if ($(this).attr('href').indexOf('/fd/auth/signout') != -1){
                    ret= $(this).attr('href');
                    console.log('sign out link is ', ret);
                }
            });
        });

        console.log('logout link = ', logoutLink);
 
        var self = this;


    });
    casper.thenOpen('http://www.bing.com/explore/rewards',function(){
            var r = this.evaluate(function(){
            if ($('a[href="/rewards/signup/websignup"]').length)
            {
                $('a[href="/rewards/signup/websignup"]').trigger('click');
                $('a[href="/rewards/signup/websignup"]').click();
                $('a[href="/rewards/signup/websignup"]').click();
                $('a[href="/rewards/signup/websignup"]').click();
                $('a[href="/rewards/signup/websignup"]').click();
                $('a[href="/rewards/signup/websignup"]').click();
                $('a[href="/rewards/signup/websignup"]').click();
                console.log('clicked the sign up button');
                return 1;
            }
            else
            {
                console.log("no sign up button exists!");
            }
            return 0;
        });
        console.log('ret ',r);
    });         


    casper.then(function(){
        setInterval(function(){
            var indx = casper.evaluate(function(){
                return $('body').text().indexOf('Earn credits searching the web with Bing');
            });
            if (indx == -1){
                console.log('joined!');
                casper.exit();
            }
        }, 1000);
    });

    casper.run(function(){
        console.log('casper has run');
    });

}

var mobile = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';

//  requests for mobile
casper.options.pageSettings.userAgent = desktop;
var rounds = 0;
if (casper.cli.args.length < 2){
    throw "Usage: ./worker <username> <m|d>";    
}
console.log('args ', casper.cli.args);
if (casper.cli.args[1] == 'm'){
    console.log('starting requests for mobile');
    casper.options.pageSettings.userAgent = mobile;
    rounds = 20 * 1.15;
}
else if (casper.cli.args[1] == 'd'){
    console.log('starting requests for desktop');
    casper.options.pageSettings.userAgent = desktop;
    rounds = 60 * 1.15;
}
else throw "Must specify d for desktop or m for mobile";

var exit = function(){
    casper.open(logoutLink); 
    setTimeout(function(){
        casper.exit();
    },2000);
}


work(function(num){
    if(num > rounds)
    {
        console.log('finished'); 
        casper.exit();
    }
});

