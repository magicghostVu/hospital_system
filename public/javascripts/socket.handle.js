/**
 * Created by magic_000 on 07/12/2016.
 */
// all variable socket

// all event handle here ???? yes or no ??
var socket=io();

// patient namespace
var socketPatient=io("/patient");
socketPatient.on('data_build_UI', function(data){

    console.log(data.notifications);

    patientContentScope.$apply(function(){
        patientContentScope.receiveData(data);
    });
});

// doctor namespace
var socketDoctor=io('/doctor');

socketDoctor.on('data_build_UI', function (data) {

    console.log(data);
    doctorContentScope.$apply(function () {
        doctorContentScope.receiveDoctorData(data);
    });
});

var socketLabDoctor= io('/lab_doctor');
var socketStaff= io('/staff');

