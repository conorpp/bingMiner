
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
    pageSettings: {
        userAgent:''
    },
    logLevel: "info"//,              // Only "info" level messages will be logged
    //verbose: true                  // log messages will be printed out to the console
});


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

            this.fill('form[name="f1"]'
                , { 
                    login: un
                , passwd: pw
                }
                , true);

            var self = this;
             self.capture('login.png');

            });

    // go to bing
    var next = 0;
    // join bing rewards if havent. only works for desktop view
    casper.thenOpen('http://www.bing.com/rewards/dashboard',function(){

        next = this.evaluate(function(){
            // console.log($('.header').text());
            if ($('.header').text().indexOf('You are not signed in to Bing Rewards') != -1)
            {
                return 1;
            }
            return 0;
        });
        var self = this;
        self.capture('login.png');


    });
    casper.thenOpen('http://www.bing.com/explore/rewards',function(){
        if (!next){
            console.log('already a member');
            casper.thenBypass(1);
            return;
        }else{ console.log('joining bing rewards..'); }
        var r = this.evaluate(function(){
            if ($('a[href="/rewards/signup/websignup"]').length)
            {
                $('a[href="/rewards/signup/websignup"]').trigger('click');
                $('a[href="/rewards/signup/websignup"]').click();
                return 1;
            }
            return 0;
        });
        console.log('ret ',r);
    });
    casper.thenOpen('http://www.bing.com/rewards/signup/websignup?publ=BING&crea=DashboardSignIn&programName=SE',function(){
    });


    casper.thenOpen('http://www.bing.com/',function(){


    });

    // search stuff
    var que = 'where did the soda go';
    var count = 0;
    casper.then(function(){
        var i = 0;
        var self = this;
        var inter = setInterval(function(){
            self.fill('form[action="/search"]', { q: que }, true);
            // self.capture('login.png');
            console.log('searching for: ', que);
            // return random 4 letter word
            function randWord(){
                var a = 'abtchyplwwah'; 
                var b = 'aeyuioee';
                var c = 'eetleouiynmcc'
                var d = 'mnbceeytplttk';
                var w = [a,b,c,d];
                var str = '';
                for(var i=0; i++; i<4)
                {
                    var n = (w[i][Math.floor(Math.random() * w[i].length)]);
                    n = n || 'e';
                    str += n;
                }

            };
            // Change que after first search
            if (i++ != 0){
                // call cb 
                if (cb) cb(i);
                que = casper.evaluate(function(){
                    var l = $('p').text().replace(/\s{2,}/g, ' ').replace(/\n/g,' ').replace(/[\{\[\(\)\}\];\.\/\+\=\:\-]/g,'').split(' ');
                    var q;
                    var tries = 0;
                    var ret = '';
                    for (var i=0; i<2; i++){
                        do{
                            q = l[ Math.floor(Math.random() * l.length)];
                            if (tries++ > 15)
                            {
                                q = randWord() + ' ' + randWord();
                                break;
                            }
                        }while(!(q.length > 0 && q.length < 15))
                        ret += ' '+ q;
                    }
                    return ret;
                });
            }else{
                que = 'Astro Physics';
            }
        },2000);
    });

    casper.run(function(){
        console.log('casper has run');

    });

}

var desktop = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11';
var mobile = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';

//  requests for mobile
casper.options.pageSettings.userAgent = desktop;
console.log('starting requests for desktop');
var mob = 1;
work(function(num){
    if(num > 60 * 1.5)
    {
       if (mob == 1){
           console.log('starting requests for mobile');
            mob = 0;
            casper.options.pageSettings.userAgent = mobile;
       }
       if (num > 20 * 1.5 + 60 * 1.5)
        {
            console.log('finished'); 
            casper.exit();
        }
    }
});
