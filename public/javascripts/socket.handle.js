/**
 * Created by magic_000 on 07/12/2016.
 */
// all variable socket

// all event handle here ???? yes or no ??
var socket=io();

// patient namespace
var socketPatient=io("/patient");
socketPatient.on('data_build_UI', function(data){

    // console.log(data);

    patientContentScope.$apply(function(){
        console.log("call apply");
        patientContentScope.receivePatientData(data);
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

var socketStaff= io('/staff');
socketStaff.on('data_build_UI', function (data) {

    console.log(data);
    staffContentScope.$apply(function () {
        staffContentScope.receiveStaffData(data);
    });
});
