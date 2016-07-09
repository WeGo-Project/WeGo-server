define = function() {
    this.USER_INIT_CREDIT = 100;
    this.ACTION_QUERY = '1';
    this.ACTION_REMOVE = '2';
    this.ACTION_INSERT = '3';
    this.ACTION_UPDATE = '4';
    this.RESULT_FAILED = '-1';
    this.RESULT_SUCCESS = '1';
    this.RESULT_PERMISSION_DENY = '-2';
    this.RESULT_SERVER_FAILED = '-3';
    this.RESULT_USER_LOGIN_REQUESTED = '-4';
}

module.exports = define;
