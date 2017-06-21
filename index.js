angular.module('index', ['ui.bootstrap','chart.js'])
    .controller('IndexController', function ($scope) {
        var basetitle = 'electionDay';
        $scope.title = basetitle;
        $scope.$watch('numseggio', function () {
            if ($scope.numseggio > 0)
                $scope.title = basetitle + " - Seggio " + $scope.numseggio;
            else
                $scope.title = basetitle
        });

        oraInizio = 7;
        oraFine = 23;
        labels = [];
        for(var j=oraInizio;j<=oraFine;j++)
        {
            labels.push('ore ' + j);
        }
        $scope.data = {};
        $scope.resetData = function(all){
            if(all===true) {
                if(confirm("Vuoi cancellare tutti i dati salvati?")) {
                    $scope.data = {};
                    $scope.data.settings = {maxdonne: 0, maxuomini: 0, maxtotale: 0};
                }
            }
            $scope.data.dati = [];
        };

        $scope.addOra = function(){
            if($scope.data.dati.length === 0){
                this_ora = oraInizio;
            }
            else{
                this_ora = $scope.data.dati.slice(-1)[0].ora + 1;
            }
            if(this_ora <= oraFine)
                $scope.data.dati.push({'ora': this_ora, 'donne': 0, 'uomini': 0});
        };

        $scope.removeLastOra =  function(){
            if($scope.data.dati.length > 1){
                $scope.data.dati.pop();
            }
        };

        $scope.drawPieDistribuzione = function() {
            pie_uomini = $scope.data.dati.slice(-1)[0].uomini;
            pie_donne = $scope.data.dati.slice(-1)[0].donne;
            pie_tot = pie_donne + pie_uomini;

            $scope.labels_distribuzione = ["Femmine", "Maschi"];
            $scope.data_distribuzione = null;
            $scope.data_distribuzione = [pie_donne, pie_uomini];
            $scope.colors_distribuzione = ['#ff6384', '#2117c0'];
            $scope.options_distribuzione = {
                legend: {display: true}, tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var value = data.datasets[0].data[tooltipItem.index];
                            var label = data.labels[tooltipItem.index];
                            var perc = Math.round(value / pie_tot * 100);
                            return label + ': ' + perc + '%';
                        }
                    }
                }
            };
            $scope.type_distribuzione = 'pie';
        };

        $scope.drawPieAffluenza = function(){
            pie_tot_votanti =  $scope.data.settings.maxtotale;

            pie_votanti = $scope.data.dati.slice(-1)[0].totale;
            pie_non_votanti = pie_tot_votanti - $scope.data.dati.slice(-1)[0].totale;

            $scope.labels_affluenza = ["Votanti", "Non Votanti"];
            $scope.data_affluenza = null;
            $scope.data_affluenza = [pie_votanti, pie_non_votanti];
            $scope.colors_affluenza = ['#00ee00','#cccccc'];
            $scope.options_affluenza ={ legend: { display: true }, tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var value = data.datasets[0].data[tooltipItem.index];
                        var label = data.labels[tooltipItem.index];
                        var perc = Math.round(value / pie_tot_votanti * 100);
                        return label + ': ' + perc + '%';
                    }
                }
            }};
            $scope.type_affluenza = 'pie';
        };

        $scope.drawGraph = function () {
            $scope.glabels = [];
            for (var i = oraInizio; i <= oraFine; i++) {
                $scope.glabels.push('ore ' + i);
            }
            $scope.gseries = ['Maschi', 'Femmine', 'Totale'];
            $scope.gdata = [[],[],[]];
            $scope.data.dati.forEach(function(x){
                $scope.gdata[0].push((x.uomini === 0 && x.ora!==oraInizio) ? null : x.uomini);
                $scope.gdata[1].push((x.donne === 0 && x.ora!==oraInizio) ? null : x.donne);
                $scope.gdata[2].push((x.totale === 0 && x.ora!==oraInizio) ? null : x.totale);
            });
            $scope.gcolors = ['#2117c0','#ff6384','#4bc0c0'];
            $scope.goptions = {
                spanGaps: true,
                scales: {
                    yAxes: [
                        {
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left'
                        }
                    ]
                }
            };
        };

        $scope.reloadGraphs = function(){
            $scope.drawGraph();
            $scope.drawPieDistribuzione();
            $scope.drawPieAffluenza();
        };
        $scope.toggle = function () {
            $scope.type_distribuzione = $scope.type_distribuzione === 'doughnut' ? 'pie' : 'doughnut';
            $scope.type_affluenza = $scope.type_affluenza === 'doughnut' ? 'pie' : 'doughnut';
            $scope.type_line = $scope.type_line === 'bar' ? 'line' : 'bar';
        };

        //getting data from localstorage, or initializing data if not set.
        var data_ls = localStorage.getItem('data');
        if (data_ls === null) {
            console.log('data is null! initializing data');
            $scope.resetData();
            $scope.addOra();
        }
        else {
            $scope.data = JSON.parse(data_ls);
            $scope.reloadGraphs();
        }

        $scope.$watch('data', function(){
            console.log('data changed, saving again');
            if ($scope.data) {
                localStorage.setItem('data', JSON.stringify($scope.data));
                console.log($scope.data);
            }
        }, true);

});