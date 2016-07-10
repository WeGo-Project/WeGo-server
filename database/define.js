define = function() {
    this.USER_INIT_CREDIT = 100;
    this.ACTION_QUERY = '1';
    this.ACTION_REMOVE = '2';
    this.ACTION_INSERT = '3';
    this.ACTION_UPDATE = '4';
    this.RESULT_FAILED = '400';
    this.RESULT_SUCCESS = '200';
    this.RESULT_PERMISSION_DENY = '401';
    this.RESULT_SERVER_FAILED = '501';
    this.RESULT_USER_LOGIN_REQUESTED = '402';
    this.RESULT_TIMESTAMP_ERROR = '8000';
    this.USER_LONGIN = true;
    this.USER_NOT_LONGIN = false;
}

module.exports = define;
