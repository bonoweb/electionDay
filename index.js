angular.module('index', [])
    .controller('IndexController', function ($scope) {
        $scope.aaa = 'abbabab';
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

        chart_element = document.getElementById('chart');
        myChart = null;

        $scope.graph_options = {
            maintainAspectRatio: true,
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                spanGaps: true,
                scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
            }
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

        $scope.drawGraph = function () {
            $scope.graph_options.data.labels = labels;
            graph_uomini = {
                label: 'UOMINI',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            };
            graph_donne = {
                label: 'DONNE',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            };
            graph_tot = {
                label: 'TOTALE',
                data: [],
                backgroundColor: 'rgba(33, 23, 192, 0.2)',
                borderColor: 'rgba(44, 23, 192, 1)',
                borderWidth: 1

            };
            angular.forEach($scope.data.dati, function (ora) {
                //se il valore è zero, viene settato a null, così non viene disegnato
                graph_uomini.data.push((ora.uomini === 0 && ora.ora!==oraInizio) ? null : ora.uomini);
                graph_donne.data.push((ora.donne === 0 && ora.ora!==oraInizio) ? null : ora.donne);
                graph_tot.data.push((ora.totale === 0 && ora.ora!==oraInizio) ? null : ora.totale);
            });
            $scope.graph_options.data.datasets = [];
            $scope.graph_options.data.datasets.push(graph_uomini, graph_donne, graph_tot);

            if(myChart === null) {
                myChart = new Chart(chart_element, $scope.graph_options);
            }
            else {
                myChart.update();
            }
        };

        //getting data from localstorage, or initializing data if not set.
        var data_ls = localStorage.getItem('data');
        //console.log(ore_ls);
        if (data_ls === null) {
            console.log('data is null! initializing data');
            $scope.resetData();
            $scope.addOra();
        }
        else {
            $scope.data = JSON.parse(data_ls);
            $scope.drawGraph();
        }

        $scope.$watch('data', function(){
            console.log('data changed, saving again');
            if ($scope.data) {
                localStorage.setItem('data', JSON.stringify($scope.data));
                console.log($scope.data);
            }
        }, true);
    });