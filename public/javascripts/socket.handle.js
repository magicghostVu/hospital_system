/**
 * Created by magic_000 on 07/12/2016.
 */
// all variable socket

// all event handle here ???? yes or no ??
var socket = io();

// patient namespace
var socketPatient = io("/patient");
ng_socket_patient=socketPatient
socketPatient.on('data_build_UI', function (data) {

    // console.log(data);

    patientContentScope.$apply(function () {
        // console.log(data.profile);
        patientContentScope.receivePatientData(data);

    });
});

socketPatient.on('send_noti', function (data) {
    console.log(data);
    toastr.success(data.msg);
});


// doctor namespace
var socketDoctor = io('/doctor');

//assign socket doctor ////tricky////
ng_socket_doctor = socketDoctor;
socketDoctor.on('data_build_UI', function (data) {

    console.log(data);
    doctorContentScope.$apply(function () {
        console.log(data.profile);
        doctorContentScope.receiveDoctorData(data);
    });
});
socketDoctor.on('setup_appointment_ss', function (data) {
    console.log('Đặt lịch thành công');
});


var socketStaff = io('/staff');
ng_socket_staff=socketStaff
socketStaff.on('data_build_UI', function (data) {

    console.log(data);
    staffContentScope.$apply(function () {
        staffContentScope.receiveStaffData(data);
    });
});

