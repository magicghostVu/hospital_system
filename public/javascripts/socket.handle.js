/**
 * Created by magic_000 on 07/12/2016.
 */
// all variable socket

// all event handle here ???? yes or no ??
var socket=io();
var socketPatient=io("/patient");
socketPatient.on('data_build_UI', function(data){

    //console.log(data);

    patientContentScope.$apply(function(){
        //console.log(data);
        patientContentScope.receiveData(data);
    });
});






var socketDoctor=io('/doctor');
var socketLabDoctor= io('/lab_doctor');
var socketStaff= io('/staff');

