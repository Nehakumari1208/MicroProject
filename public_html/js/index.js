
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var studentDBName = "SCHOOL-DB";
var studentRelationName = "STUDENT-TABLE";
var connToken = "90934498|-31949222974521200|90962813";
$("#rollNo").focus();

function validateData() {
    var rollNoVar = $("#rollNo").val();
    if (rollNoVar === "") {
        alert("Roll No is a required value");
        $("#rollNo").focus();
        return "";
    }

    var fullNameVar = $("#fullName").val();
    if (fullNameVar === "") {
        alert("Full Name is a required value");
        $("#fullName").focus();
        return "";
    }

    var classVar = $("#class").val();
    if (classVar === "") {
        alert("Class is a required value");
        $("#class").focus();
        return "";
    }

    var birthDateVar = $("#birthDate").val();
    if (birthDateVar === "") {
        alert("Birth Date is a required value");
        $("#birthDate").focus();
        return "";
    }

    var addressVar = $("#address").val();
    if (addressVar === "") {
        alert("Address is a required value");
        $("#address").focus();
        return "";
    }

    var enrollmentDateVar = $("#enrollmentDate").val();
    if (enrollmentDateVar === "") {
        alert("Enrollment Date is a required value");
        $("#enrollmentDate").focus();
        return "";
    }

    var jsonStrObj = {
        rollNo: rollNoVar,
        fullName: fullNameVar,
        class: classVar,
        birthDate: birthDateVar,
        address: addressVar,
        enrollmentDate: enrollmentDateVar
    };
    return JSON.stringify(jsonStrObj);
}

function resetForm() {
    $("#rollNo").val("");
    $("#fullName").val("");
    $("#class").val("");
    $("#birthDate").val("");
    $("#address").val("");
    $("#enrollmentDate").val("");
    $("#rollNo").prop("disabled", false);
    $("#Save").prop("disabled", true);
    $("#Change").prop("disabled", true);
    $("#Reset").prop("disabled", true);
    $("#rollNo").focus();
}

function saveData() {
    var jsonStr = validateData();
    if (jsonStr === "") {
        return;
    }

    var putReqStr = createPUTRequest(connToken, jsonStr, studentDBName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollNo").focus();
}

function changeData() {
    $("#Change").prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollNo").focus();
}

function getStudentIdAsJsonObj() {
    var rollNoVar = $("#rollNo").val();
    var jsonStr = {
        rollNo: rollNoVar
    };
    return JSON.stringify(jsonStr);
}

function getStudent() {
    var studentIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, studentIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $("#Save").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#rollNo").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollNo").prop("disabled", true);
        fillData(resJsonObj);
        $("#Change").prop("disabled", false);
        $("#Reset").prop("disabled", false);
        $("#fullName").focus();
    }
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullName").val(record.fullName);
    $("#class").val(record.class);
    $("#birthDate").val(record.birthDate);
    $("#address").val(record.address);
    $("#enrollmentDate").val(record.enrollmentDate);
}

function saveRecNo2LS(jsonObj) { 
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}
