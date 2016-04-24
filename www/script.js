var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
	$scope.gamma = 1.4;

	$scope.shape = [];
	$scope.shape[0] = 'isentropic_flow';
	$scope.shape[1] = 'normal_shock';
	$scope.shape[2] = 'oblique_shock';
	$scope.shape[3] = 'expansion_fan';

	$scope.name = [];
	$scope.name[0] = 'Isentropic Flow';
	$scope.name[1] = 'Normal Shock';
	$scope.name[2] = 'Oblique Shock';
	$scope.name[3] = 'Expansion Fan';

	$scope.input = [];
	$scope.input[0] = ['m'];
	$scope.input[1] = ['m'];
	$scope.input[2] = ['m','theta'];
	$scope.input[3] = ['m','theta'];

	$scope.input_fa = [];
	$scope.input_fa[0] = ['Mach Number (M)'];
	$scope.input_fa[1] = ['Mach Number (M)'];
	$scope.input_fa[2] = ['Mach Number (M)','Angle (Theta-deg)'];
	$scope.input_fa[3] = ['Mach Number (M)','Angle (Theta-deg)'];


	$scope.output = [];
	$scope.output[0] = ['pt','tt','rot','as'];
	$scope.output[1] = ['p2p1','ro2ro1','t2t1','m2'];
	$scope.output[2] = ['beta','p2p1','ro2ro1','t2t1','m2'];
	$scope.output[3] = ['nu1','nu2','m2'];

	$scope.output_fa = [];
	$scope.output_fa['pt'] = 'Total Pressure / Static Pressure';
	$scope.output_fa['tt'] = 'Total Temprature / Static Temprature';
	$scope.output_fa['rot'] = 'Total Density / Static Density';
	$scope.output_fa['as'] = 'a/as';
	$scope.output_fa['p2p1'] = 'Downstream Pressure / Upstream Pressure';
	$scope.output_fa['ro2ro1'] = 'Downstream Density / Upstream Density';
	$scope.output_fa['t2t1'] = 'Downstream Temprature / Upstream Temprature';
	$scope.output_fa['m2'] = 'Downstream Mach Number';
	$scope.output_fa['beta'] = 'Shock Angle (Beta-deg)';
	$scope.output_fa['nu1'] = 'Upstream Prandtl-Meyer function (deg)';
	$scope.output_fa['nu2'] = 'Downstream Prandtl-Meyer function (deg)';

	$scope.output_en = [];
	$scope.output_en['pt'] = 'P0/P';
	$scope.output_en['tt'] = 'T0/T';
	$scope.output_en['rot'] = 'ρ0/ρ';
	$scope.output_en['as'] = 'A/A*';
	$scope.output_en['p2p1'] = 'P2/P1';
	$scope.output_en['ro2ro1'] = 'ρ2/ρ1';
	$scope.output_en['t2t1'] = 'T2/T1';
	$scope.output_en['m2'] = 'M2';
	$scope.output_en['beta'] = 'β (deg)';
	$scope.output_en['nu1'] = 'ϑ1 (deg)';
	$scope.output_en['nu2'] = 'ϑ2 (deg)';

	$scope.value = [];

	$scope.select = function(number) {
		$scope.shape_id=number;
		$scope.value = [];
		$scope.value['m']=0;
		$scope.value['theta']=0;
		$scope.result = [];
	}
	
	$scope.calculate = function() {
		$scope.result = [];
		if($scope.shape_id==0) {
			$scope.result['pt'] = Math.pow(Math.pow($scope.value['m'],2)*($scope.gamma-1)/2+1,$scope.gamma/($scope.gamma-1));
			$scope.result['tt'] = Math.pow($scope.value['m'],2)*($scope.gamma-1)/2+1;
			$scope.result['rot'] = Math.pow(Math.pow($scope.value['m'],2)*($scope.gamma-1)/2+1,1/($scope.gamma-1));
			$scope.result['as'] = Math.pow(Math.pow($scope.value['m'],2)*($scope.gamma-1)/($scope.gamma+1)+2/($scope.gamma+1),($scope.gamma+1)/(2*($scope.gamma-1)))/$scope.value['m'];
		} else if($scope.shape_id==1) {
			$scope.result['p2p1'] = 1+2*$scope.gamma*(Math.pow($scope.value['m'],2)-1)/($scope.gamma+1);
			$scope.result['ro2ro1'] = ($scope.gamma+1)*(Math.pow($scope.value['m'],2))/(2+($scope.gamma-1)*(Math.pow($scope.value['m'],2)));
			$scope.result['t2t1'] = $scope.result['p2p1']/$scope.result['ro2ro1'];
			$scope.result['m2'] = Math.sqrt((1+($scope.gamma-1)*(Math.pow($scope.value['m'],2))/2)/($scope.gamma*(Math.pow($scope.value['m'],2))-($scope.gamma-1)/2));
		} else if($scope.shape_id==2) {
			$scope.theta_rad=$scope.value['theta']*Math.PI/180;
			$scope.lambda=Math.sqrt(Math.pow(Math.pow($scope.value['m'],2)-1,2)-3*(1+($scope.gamma-1)*Math.pow($scope.value['m'],2)/2)*(1+($scope.gamma+1)*Math.pow($scope.value['m'],2)/2)*Math.pow(Math.tan($scope.theta_rad),2));
			$scope.x=(Math.pow(Math.pow($scope.value['m'],2)-1,3)-9*(1+($scope.gamma-1)*Math.pow($scope.value['m'],2)/2)*(1+($scope.gamma-1)*Math.pow($scope.value['m'],2)/2+($scope.gamma+1)*Math.pow($scope.value['m'],4)/4)*Math.pow(Math.tan($scope.theta_rad),2))/(Math.pow($scope.lambda,3));
			$scope.result['beta']=Math.atan((Math.pow($scope.value['m'],2)-1+2*$scope.lambda*Math.cos((4*Math.PI+Math.acos($scope.x))/3))/(3*(1+($scope.gamma-1)*Math.pow($scope.value['m'],2)/2)*Math.tan($scope.theta_rad)))*180/Math.PI;
			$scope.mn1=$scope.value['m']*Math.sin($scope.result['beta']*Math.PI/180);
			$scope.result['p2p1'] = 1+2*$scope.gamma*(Math.pow($scope.mn1,2)-1)/($scope.gamma+1);
			$scope.result['ro2ro1'] = ($scope.gamma+1)*(Math.pow($scope.mn1,2))/(2+($scope.gamma-1)*(Math.pow($scope.mn1,2)));
			$scope.result['t2t1'] = $scope.result['p2p1']/$scope.result['ro2ro1'];
			$scope.result['m2'] = Math.sqrt((1+($scope.gamma-1)*(Math.pow($scope.mn1,2))/2)/($scope.gamma*(Math.pow($scope.mn1,2))-($scope.gamma-1)/2))/Math.sin(($scope.result['beta']-$scope.value['theta'])*Math.PI/180);
		} else if($scope.shape_id==3) {
			$scope.result['nu1'] = (Math.sqrt(($scope.gamma+1)/($scope.gamma-1))*Math.atan(Math.sqrt(($scope.gamma-1)*(Math.pow($scope.value['m'],2)-1)/($scope.gamma+1)))-Math.atan(Math.sqrt(Math.pow($scope.value['m'],2)-1)))*180/Math.PI;
			$scope.result['nu2'] = $scope.result['nu1'] + $scope.value['theta'];
			$scope.error=10;
			for($scope.i=1;$scope.i<=100;$scope.i++) {
				$scope.m_temp = 1 + $scope.i / 10;
				$scope.nu_temp = (Math.sqrt(($scope.gamma + 1) / ($scope.gamma - 1)) * Math.atan(Math.sqrt(($scope.gamma - 1) * (Math.pow($scope.m_temp,2) - 1) / ($scope.gamma + 1))) - Math.atan(Math.sqrt(Math.pow($scope.m_temp,2) - 1))) * 180 / Math.PI;
				if (Math.abs($scope.nu_temp - $scope.result['nu2']) < $scope.error) {
					$scope.m2 = $scope.m_temp;
					$scope.error = Math.abs($scope.nu_temp - $scope.result['nu2']);
				}
			}
			$scope.result['m2'] = $scope.m2;

		}
	}
 
});

function gotopage(page_number) {
	for(i=1;i<=3;i++) {
		if(i===page_number) {
			document.getElementById('page'+i).style.display='block';
		} else {
			document.getElementById('page'+i).style.display='none';
		}
	}
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}