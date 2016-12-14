/**
 * Created by magic_000 on 07/12/2016.
 */
// all variable socket

// all event handle here ???? yes or no ??
var socket = io();

// patient namespace
var socketPatient = io("/patient");
socketPatient.on('data_build_UI', function (data) {

    // console.log(data);

    patientContentScope.$apply(function () {
        console.log(data.profile);
        patientContentScope.receivePatientData(data);

    });
});

socketPatient.on('send_noti', function (data) {
    console.log(data);
    toastr.success("Có thông báo");
});


// doctor namespace
var socketDoctor = io('/doctor');

//assign socket doctor ////tricky////
ng_socket_doctor = socketDoctor;
socketDoctor.on('data_build_UI', function (data) {

    console.log(data);
    doctorContentScope.$apply(function () {
        doctorContentScope.receiveDoctorData(data);
    });
});
socketDoctor.on('setup_appointment_ss', function (data) {
    console.log('Đặt lịch thành công');
});


var socketStaff = io('/staff');
socketStaff.on('data_build_UI', function (data) {

    console.log(data);
    staffContentScope.$apply(function () {
        staffContentScope.receiveStaffData(data);
    });
});

