    (function(angular) {
        /* global Firebase, $, Modernizr, jQuery */
        'use strict';
        var app = angular.module('Musicapp');
        // for mobile device load swipe direction div
        if (Modernizr.touch) {
            jQuery(".swipe").addClass("fadeIn swiped");
        }

        app.directive('musicList', ['viewUrl',
            function(viewUrl) {
                return {
                    restrict: 'E',
                    templateUrl: viewUrl
                };
            }
        ]);
        app.config(['$locationProvider',
            function($locationProvider) {
                $locationProvider.hashPrefix('!');
                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: true
                });
            }
        ]);

        function makeAdder(x){
            return function(y){
                return x+y;
            };
        }
        var add5 = makeAdder(5);
        var add10 = makeAdder(10);
        //console.log(add5(2));

        app.factory('data', ['$firebaseArray', 'FBURL', '$location',
            function($firebaseArray, FBURL, $location) {
                var rootRef = new Firebase(FBURL),
                    childRef = rootRef.child('playlist1'),
                    childRefb = childRef.orderByPriority(),//.orderByPriority()
                    syncObject = $firebaseArray(childRefb),
                    childRef1 = rootRef.child('playlist1'),
                    syncObject1 = $firebaseArray(childRef1),
                    tete = new Firebase('https://jibzapp.firebaseio.com/playlist'),
                    teted = new Firebase('https://jibzapp.firebaseio.com/playlist/godwinPlaylist'),
                    //syncObject = sync.$asArray(),
                    url = decodeURI(($location.path()).replace('/', "")),
                    urlString = url.replace(/_/g, " ");
                return [syncObject, urlString, syncObject1, childRef, tete, teted];
            }
        ]);

        /* add more items on finish */
        app.directive('onFinishRender', ['$timeout',
            function($timeout) {
                return {
                    restrict: 'A',
                    link: function(scope) {
                        if (scope.$last === true) {
                            $timeout(function() {
                                scope.$emit(
                                    'ngRepeatFinished');
                            });
                        }
                    }
                };
            }
        ]);

        app.directive('fullheight', ['$window',
            function($window) {
                return function(scope, element) {
                    element.height($window.innerHeight);
                };
            }
        ]);

        var jplayer = $("#jquery_jplayer_N");
        //************************************/
        app.filter('reverse', function() {
            return function(items) {
                //check if data is not empty//
                if (!items || !items.length) {
                    return;
                }
                return items.slice().reverse();
            };
        });
        // app.run(['$location', '$rootScope', 'data', function($location, $rootScope, data) {
        // $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

        //$rootScope.title =  data[1];
        //});
        //}]);

        /*********************************

        This Controller basically controls most of the Music player functions

        from play, pause, last, next and load the playlist data..
        Its a little big for a controller but...

        ************************************/
        app.controller("PostsCtrl", ['data', '$scope', '$filter', '$location', '$timeout', 'urlImg', '$routeParams',

            function(data, $scope, $filter, $location, $timeout, urlImg, $routeParams) {
                var playin, i, pl, len,
                    //url = decodeURI(($location.path()).replace('/', "")),
                    //orderBy = $filter('orderBy')
                    //  urlString = url.replace(/_/g, " "),
                    aniEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
                $scope.url = urlImg;
                data[0].$loaded().then(function() {
                   // var gg = data[0]

                    $scope.posts = data[0];

                    // once data loaded from Firebase remove .swipe  class from view
                    jQuery(".swipe").removeClass("fadeIn swiped");
                    pl = $scope.posts;
                    len = $scope.posts.length;

                    // $scope.listener = data[0][807].title;
                    var rensentSong = len - 20,
                        indexe = findIndex(data[0], "title", data[1]);
                    //plays song from url if it exits or play latest 50 radom song //
                    if (!(indexe || indexe === 0)) {
                        indexe = (Math.floor((Math.random() * (len - rensentSong) + 1) + rensentSong));
                    }
                    playin = indexe;
                    $scope.player(indexe);
                });
                // set limit to the amout of songs loaded at first and add more on scroll
                $scope.numLimit = 30;
             //   $scope.data = $filter('filter')($scope.posts, $scope.q);
            /*    $scope.$watch('data', function(newValue, oldValue) {
                    $scope.data = $filter('filter')($scope.posts, $scope.q);
                });*/
                var person = [];
                person = {
            "godwinPlaylist": {
                "1": {
                        "title":"Reply Brother",
                        "artist":"Ice Prince ft. Nosa & Milli",
                        "mp3":"\/2014\/11\/Ice-Prince-Reply-Brother-ft.-Nosa-Milli.mp3",
                        "poster":"\/2014\/11\/Ice-Prince-Reply-Brother-pic.png"
                    },
                "2": {
                        "title":"Who ",
                        "artist":"Dialect ft. iLLBliss",
                        "mp3":"\/2014\/11\/Who.mp3",
                        "poster":"\/2014\/11\/dialect-300x180.jpg"
                    },
                "3": {
                        "title":"Bend Down Select",
                        "artist":"Knowledge ",
                        "mp3":"\/2014\/11\/Bend-Down-Select-__-Afromixent.com_.mp3",
                        "poster":"\/2014\/11\/bds-300x300.jpg"
                    },
                "4": {
                        "title":"Owo Ni Koko",
                        "artist":"Davido ",
                        "mp3":"\/2014\/11\/Owo-Ni-Koko-__-Afromixent.com_.mp3",
                        "poster":"\/2014\/11\/Davido-Owo-Ni-Koko-Art-.jpg"
                    },
                "5":  {
                        "title":"A-Q FOR TIWA SAVAGE",
                        "artist":"A-Q",
                        "mp3":"\/2014\/11\/Tiwa-Savage-__-Afromixent.com_.mp3",
                        "poster":"\/2014\/11\/AQ-Tiwa-Savage.jpg"
                    },
                "6":  {
                        "title":"Go Low",
                        "artist":"Tekno ",
                        "mp3":"\/2014\/11\/Go-low-__-Afromixent.com_.mp3",
                        "poster":"\/2014\/11\/go-low-art.jpg5_-300x300.jpg"
                    },
                "7":  {
                        "title":"SUPERU",
                        "artist":"Mr Moni",
                        "mp3":"\/2014\/11\/SUPERU-__-Afromixent.com_.mp3",
                        "poster":"\/2014\/11\/superu.jpg"
                    },
                "8":  {
                        "title":" Real Bad Man",
                        "artist":"Criss Waddle ft. Mugeez & Sarkodie",
                        "mp3":"\/2014\/11\/Criss_Waddle_feat_Mugeez_and_Sarkodie_-_Real_Bad_man__FlipBeatz_.mp3",
                        "poster":"\/2014\/11\/badmen.jpg"
                    },
                "9":   {
                        "title":"Swagu",
                        "artist":"Ajebutter22",
                        "mp3":"\/2014\/11\/Swagu.mp3",
                        "poster":"\/2014\/11\/swagu-ajebutter_1-300x300.jpg"
                    },
                "10":   {
                        "title":"Wiser ",
                        "artist":"Flavour ft. M.I & Phyno",
                        "mp3":"\/2014\/11\/Flavour_ft_MI_Phyno-Wiser.mp3",
                        "poster":"\/2014\/11\/Flavour-Thankful.jpg"
                    },
                "11":     {
                        "title":" Thinking About You",
                        "artist":"Fuse ODG ft. KillBeatz ",
                        "mp3":"\/2014\/11\/Thinking-About-You.mp3",
                        "poster":"\/2014\/11\/fuse-ODG.jpg"
                    },
                "12":{
                        "title":"Jekomo",
                        "artist":"Dynamyt",
                        "mp3":"\/2014\/11\/Dynamyt-Jekomo-Prod.-by-Sossiick.mp3",
                        "poster":"\/2014\/11\/Jekomo-by-Dynamyt-Artwork.jpg"
                    },
                "13":{
                        "title":" Oga Nla",
                        "artist":"Olamide ft. Pasuma, Lil kesh ",
                        "mp3":"\/2014\/11\/Oga-Nla.mp3",
                        "poster":"\/2014\/11\/Olamide_StreetOt-300x300.jpeg"
                    },
                "14":{
                        "title":"Helele ",
                        "artist":"Naeto C ft. Flavour",
                        "mp3":"\/2014\/11\/Helele-Feat.-Flavour-1.mp3",
                        "poster":"\/2014\/11\/Naeto.jpg"
                    },
                "15":{
                        "artist":"May Shua ft. Oriste Femi",
                        "mp3":"\/2014\/11\/May-Shua-Yeghe-ft.-Oriste-Femi.mp3",
                        "poster":"\/2014\/11\/May-Shua-Yeghe-ft.-Oriste-Femi-Art.jpg",
                        "title":"Yeghe "
                    },
                "16":{
                        "artist":"Masterkraft Ft.Olamide & CDQ ",
                        "mp3":"\/2014\/11\/InDomiE-master.mp3",
                        "poster":"\/2014\/11\/INDOMIE-2-755x755.jpg",
                        "title":"Indomie"
                    },
                "17":{
                        "artist":"Konga Ft. Pepenazi ",
                        "mp3":"\/2014\/11\/SISI_EKO_by_KONGA__prod_by_TeeMode_Beatz_.mp3",
                        "poster":"\/2014\/11\/konga.....jpg",
                        "title":" Sisi Eko "
                    },
                "18":{
                        "artist":"Splendid  Ft Oritse Femi",
                        "mp3":"\/2014\/11\/Splendid-Sweet-Sweet-ft-Oritse-Femi.mp3",
                        "poster":"\/2014\/11\/Splendid-Sweet-Sweet-Artwork.jpg",
                        "title":"Sweet Sweet"
                    },
                "19":{
                        "artist":" General Pype ",
                        "mp3":"\/2014\/11\/02-lovers-Rock2-1.mp3",
                        "poster":"\/2014\/11\/obalen.jpeg",
                        "title":" Lovers Rock"
                    },
                "20":{
                        "artist":"Oritse Femi Ft The Mad Jamaicans",
                        "mp3":"\/2014\/11\/Oritse-Femi-_-and-Tha-Mad-Jamaicans-_-Too-Fine-Free-Style.mp3",
                        "poster":"\/2014\/11\/ort.jpg",
                        "title":"Too Fine"
                    },
                "21":{
                        "artist":"DJ Kaywise Ft Ice Prince, Patoranking & Mugeez",
                        "mp3":"\/2014\/11\/DJ_Kaywise-Feel-Alryt-ft-cepricePatoranking-Mugee.mp3",
                        "poster":"\/2014\/11\/dj-kaywise.jpg",
                        "title":"Feel Alryt"
                    },
                "22": {
                        "artist":"JoshBeatz Ft. Olamide",
                        "mp3":"\/2014\/11\/SOKE.mp3",
                        "poster":"\/2014\/11\/soke.jpg",
                        "title":" Soke"
                    }
            }};
                data[5].limitToLast(10).on('child_added', function (snapshot) {


                    // console.log(thing)
                    var title = snapshot.val().thingTitle;
                    var order = snapshot.getPriority();
                    var priority = snapshot.getPriority(),
                    highestPriority = Math.max(priority, highestPriority);
                   // console.log(snapshot.highestPriority);
                    //console.log(snapshot.getPriority());
                    //data[0].setPriority(1000);
                });
                data[0].$watch(function(key) {
                    console.log(key);
                });
                $scope.barConfig = {
                   // group: 'foobar',
                    animation: 150,
                    //ghost:  false,
                    onSort: function (/** ngSortEvent */evt, index){
                        // @see https://github.com/RubaXa/Sortable/blob/master/ng-sortable.js#L18-L24
                       // $scope.posts = evt;
                        //var updata = angular.fromJson(angular.toJson($scope.posts));
                            //key = $scope.contact.$id;
                       // console.log(updata);
                        var tter = evt.oldIndex,
                            linked = "https://jibzapp.firebaseio.com/player/";
                        var ert =  evt.oldIndex;
                        var olderIndex = evt.oldIndex, newerIndex = evt.newIndex;
                        var difference = (data[0].length -evt.oldIndex) - (data[0].length -evt.newIndex);
                        var dataLen = Math.abs( difference);// console.log(dataLen);
                        var dataLength = data[0].length;
                       // console.log(dataLen);
                       // console.log(olderIndex);
                        if (difference >= 1){
                            for (i = 0; i <= dataLen; i++){
                                var tere = data[0].$keyAt(olderIndex+i);
                                //var ter = data[0].$keyAt((dataLen+i)+2);
                                var linkede = "https://jibzapp.firebaseio.com/playlist1/"+tere;
                                var other  =  new Firebase(linkede);
                                other.setPriority((olderIndex+i));

                              //  console.log((dataLen+i)+2);

                                //console.log(((olderIndex+i)));
                               // console.log(data[0].$getRecord(tere));
                               // console.log(data[0].$getRecord(tere));
                               // other.setPriority((dataLen+i))


                            }
                        }
                        if (difference < 1){
                            for (i = dataLen ; i >= 0; i--){
                                //var ter = data[0].$keyAt((dataLen-i)+2);
                                var tere = data[0].$keyAt((newerIndex+i));
                                var linkede = "https://jibzapp.firebaseio.com/playlist1/"+tere;
                                var other  =  new Firebase(linkede);
                                other.setPriority((newerIndex+i));
                                //console.log(data[0].$getRecord(ter));
                               // console.log(((newerIndex+i)));
                               // console.log(data[0].$getRecord(tere));

                             }

                        }
                       // console.log(difference );

                       // console.log(olderIndex);

                       // console.log(data[0].$getRecord(ter));
                       // $indexFor(key)

                        //console.log(linked);

                       // var other  =  new Firebase(linked);
                       // var other  =  new Firebase(linked);
                      // other.setPriority(Firebase.ServerValue.TIMESTAMP);
                        //console.log(data[0][evt.oldIndex]);
                        //console.log(data[0][evt.newIndex]);
                        //data[0].update({ $scope.posts });
                        //ert.set({person}, onComplete);
                       // other.setPriority(ert);

                        //data[3].push($scope.posts);
                       // for (i = data[0].length; i >= 0; i--) {
                            // text += cars[i] + "<br>";
                            // console.log(i);
                            //data[3].push(ert[i]);
                           // var linked = "https://jibzapp.firebaseio.com/playlist/godwinPlaylist/"+i;


                           // data[3].setWithPriority(ert[i], (1000+1));
                       // data[3].update(data[0][evt.oldIndex].$id);
                       // }
                     //   $scope.setMessage();
                    }
                };


                $scope.setMessage = function(){
                    var tt = data[4];
                   // console.log(tt);
                    var newData = $scope.posts;
                    var i;
                    //data[5].set(person);

                    }

                /** standard jplayer initialisation **/
                jplayer.jPlayer({
                    cssSelectorAncestor: "#jp_container_N",
                    autoPlay: true,
                    swfPath: "http://afromixent.com/wp-content/themes/afromixEnt/js",
                    solution: "flash, html",
                    supplied: "mp4,mp3,ogv, m4v",
                    wmode: "window",
                    oggSupport: false,
                    smoothPlayBar: false,
                    remainingDuration: true,
                    volume: 0.8,
                    preload: false,
                    // solution: "html,flash",'metadata'
                    size: {
                        width: "100%"
                    },
                    timeupdate: function(event) {
                        var currentPer = event.jPlayer.status.currentPercentAbsolute;
                        $timeout(function() {
                            $scope.nob = (currentPer - (currentPer / 87));
                        });

                    },
                    ended: function() {
                        $scope.filtedPlayist = $filter('filter')($scope.posts, $scope.q);
                        $scope.indexPlayer =  findIndex($scope.filtedPlayist, "title", $scope.song);
                        ($scope.playerRepeat === false) ? ($scope.indexPlayer -= 1) : ($scope.indexPlayer -= 0);
                       // console.log($scope.data);
                        $scope.player($scope.indexPlayer);
                    }
                });
                // < used to set get clicked element from ng-repeat and play that song  />
                $scope.player = function(index) {
                    //  var current = (index);
                    // use to get index after filter result //
                   // $scope.indexPlayer = findIndex($scope.posts, "title", $scope.song);
                    //$scope.data = $filter('filter')($scope.posts, $scope.q);
                    $scope.filtedPlayist = $filter('filter')($scope.posts, $scope.q);

                    var self = $scope.filtedPlayist[index],
                        img = urlImg + self.poster,
                        artists = self.artist,
                        song = self.title;
                    // < jplay player />
                    //console.log(self);
                    audioPlayer(self);
                    var urlCurrent = song + " By " + artists,
                        str = song.replace(/\s/g, "_");
                    //atr = artists.replace(/\s/g, "_");
                    //  msgi: $routeParams.str;
                    // change tract title//

                    $scope.thumb = img;
                    // checks if repeat is active and loop if true or go to the next track on false//
                    playin = index;
                    // change url location to reflect current track --//
                    //$scope.$apply( $location.path(str) );
                    $timeout(function() {
                        $scope.artist = artists;
                        $scope.song = song;
                        $scope.indexNumber = findIndex($scope.posts, "title", $scope.song);
                        //  $location.path(str);


                    });
                    document.title = urlCurrent.toUpperCase();
                    //$rootScope.title = urlCurrent.toUpperCase();
                    //$scope.linkUrl = str;
                    blurImage(img);
                    return playin;
                };
                $('.jp-next').click(function() {
                    var currentIndexr = findIndex($scope.posts, "title", $scope.song),
                     current;
                    //var tt = jplayer.data("jPlayer").status.media.title;
                    // var cuurentT = findIndex(($scope.filtedPlayist), "title", tt);
                    //console.log(index);
                    if (playin > 0) {
                        ($scope.q) ? (current = (playin - 1)) : (current = (currentIndexr - 1));
                       // current = (playin - 1);
                        $scope.player(current);
                    }
                });
                //console.log(data[0][807]);
               // data[2].$watch(function(event) {
                   // console.log('change');
                   // $scope.player(804);
               // });



                $scope.swiperight = function() {
                    var current;
                    if (playin > 1) {
                        current = (playin - 1);
                        jQuery("#jquery_jplayer_N").addClass(
                            "animated bounceInRight").one(
                            aniEnd,

                            function() {
                                jQuery("#jquery_jplayer_N")
                                    .removeClass(
                                        'animated bounceInRight');
                            });
                        $scope.player(current);
                    }
                };
                $('.jp-previous').click(function() {

                    var currentIndexr = findIndex($scope.posts, "title", $scope.song);
                    //console.log($scope.q);
                    var songNum = (len - 1),
                        current;
                    if (playin < songNum) {
                        if ($scope.q) {
                            current = (playin + 1);
                        } else {
                            current = (currentIndexr + 1);
                        }
                        $scope.player(current);
                    }
                });
                $scope.swipeleft = function() {
                    var songNum = (len - 1),
                        current;
                    if (playin < songNum) {
                        current = (playin + 1);
                        if (Modernizr.touch) {
                            jQuery("#jquery_jplayer_N").addClass(
                                "animated bounceInLeft").one(
                                aniEnd,

                                function() {
                                    jQuery(
                                        "#jquery_jplayer_N").removeClass(
                                        'animated bounceInLeft');
                                });
                        }
                        $scope.player(current);
                    }
                };
                $scope.playBtn = function() {
                    var ifPaused = $(jplayer).data().jPlayer.status.paused,
                        vb = "#jp_poster_0";
                    if (Modernizr.touch) {
                        (!ifPaused) ? (jQuery(jplayer).jPlayer(
                            "pause")) : (jQuery(jplayer).jPlayer(
                            "play"));
                        jQuery(vb).addClass("animated pulse").one(
                            aniEnd,

                            function() {
                                jQuery(vb).removeClass(
                                    'animated pulse');
                            });
                    }
                };

                // SHUFFLE TRACKSS //
                var tempState;
                $scope.order = function(key) {
                    if (!tempState) {
                        tempState = ($scope.posts).slice();
                        sortByKey($scope.posts, key);
                    } else {
                        $scope.posts = tempState;
                        tempState = null;
                    }
                };

                $scope.state = false;
                var temp = false;
                $scope.random = function(post) {

                    if (!($scope.state)) {
                        $scope.state = true;
                        temp = post.slice();
                        post.sort(randOrd);
                    } else {
                        $scope.posts = temp;
                        temp = null;
                        $scope.state = false;
                        return ($scope.posts);
                    }
                };
                $scope.playerRepeat = false;
                $scope.playbackRepeat = function() {
                    if (!($scope.playerRepeat)) {
                        $scope.playerRepeat = true;
                    } else {
                        $scope.playerRepeat = false;
                    }
                };

                // $("#jplayer_inspector").jPlayerInspector({jPlayer:$("#jquery_jplayer_N")});
                $scope.$on('ngRepeatFinished', function() {
                   // $("#litem").scroll(function(e) {
                    $("#litem").on('scroll', function(e) {
                        var b = this;
                        if (($(b).scrollTop() + $(b).innerHeight() >= b.scrollHeight) && e) {

                            //$timeout(function() {
                                $scope.addMoreItems();
                            $("#litem").off('scroll');
                          //  }, 200);
                        }
                    });
                });
                $scope.addMoreItems = function() {
                    if ($scope.numLimit < len) {
                        $scope.numLimit += 30;
                         //console.log($scope.numLimit);
                        return $scope.numLimit;
                    }
                };

            }

        ]);

        var audioPlayer = function(mData) {
            var urlImg = 'http://afromixent.com/wp-content/uploads';
            // < jplay player />
            jplayer.jPlayer("setMedia", {
                title: mData.title,
                artist: mData.artist,
                mp3: (urlImg + mData.mp3),
                poster: (urlImg + mData.poster)
            });
            //  var test = jplayer.data("jPlayer").status.src;

            jplayer.jPlayer("play");
        };
        var image, canvasImage, canvas;
        /// Blur Image Caller and change image to reflect the currect trak//
        function blurImage(img) {
            $(".blur").attr('src', img);
            $(".blur").each(function() {
                canvas = this,
                image = new Image,
                image.onload = function() {
                    canvasImage = new CanvasImage(canvas,
                        this),
                    canvasImage.blur(4)
                },
                image.src = $(this).attr("src")
            });
        }
        // random function

        function randOrd() {
            return (Math.round(Math.random()) - 0.5);
        }

        function sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }

        function findIndex(arraytosearch, key, valuetosearch) {
            var i;
            for (i = 0; i < arraytosearch.length; i++) {
                if (arraytosearch[i][key] === valuetosearch) {
                    return i;
                }
            }
            return null;
        }

        function sortArr(array) {
            var a = null;
            var b = null;
            var length = array.length;
            for (a = 0, b = length - 1; a < b; a += 1, b -= 1) {
                var temporary = array[a];
                array[a] = array[b];
                array[b] = temporary;
            }
            return array;
        }
        //// blur canvas  background ///
        var CanvasImage = function(e, t) {
            this.image = t,
            this.element = e,
            this.element.width = this.image.width,
            this.element.height = this.image.height;
            var n = navigator.userAgent.toLowerCase().indexOf("chrome") > -1,
                r = navigator.appVersion.indexOf("Mac") > -1;
            n && r && (this.element.width = Math.min(this.element.width,
                300), this.element.height = Math.min(this.element.height, 200)),
            this.context = this.element.getContext("2d"),
            this.context.drawImage(this.image, 0, 0);
        };
        //
        CanvasImage.prototype = {
            blur: function(e) {
                this.context.globalAlpha = .5;
                for (var t = -e; t <= e; t += 2)
                    for (var n = -e; n <= e; n += 2) this.context.drawImage(
                        this.element, n, t),
                n >= 0 && t >= 0 && this.context.drawImage(
                    this.element, -(n - 1), -(t - 1));
                this.context.globalAlpha = 1
            }
        };
    })(window.angular);
