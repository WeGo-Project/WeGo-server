## API说明
### URL 格式
如果未特别说明，所有API均用HTTP/POST方法查询，提交的数据以键值对的方式放在POST content中，如果用户已登录，在POST content中加如以键为open_id，值为用户id的键值对。  
基础URL格式：
```(server.com)/(target)/(action type)?(query string)```
```server.com``` 服务器域名
```target``` 查询的业务实体对象
```action type``` 对对象的查询类型
```query string``` 提交的表单查询字符串
用户登录举例： ```server.com/user/query?username=asd&password=asd```
用户注册举例： ```server.com/user/insert?username=a&password=a```

### 查询返回的格式
如果未特别说明，所有API均返回JSON字符串作为结果。
返回的JSON字符串键值对说明
```request``` 查询类型，类型代码定义见文档后续
```target``` 查询对象，对象代码定义见文档后续
```result``` 查询结果，结果代码定义见文档后续
```data``` 查询得到的数据，以JSON数组方式存储，如果```result```指示失败则可能没有该项
用户登录返回结果示例： ```{"request":"3","target":"1","result":"-1"}```

## 全局状态码定义
|返回码标识|返回区域|返回码|含义|
|--------|-------|-----|---|
|RESULT_SUCCESS|result|200|成功|
|RESULT_SUCCESS|result|400|失败|
|RESULT_PERMISSION_DENY|result|401|没有权限进行这个操作|
|RESULT_SERVER_FAILED|result|501|服务器发生了错误|
|RESULT_USER_LOGIN_REQUESTED|402|200|这个操作需要用户登录|
|RESULT_TIMESTAMP_ERROR|result|8000|请求操作中的时间信息有误|
|ACTION_QUERY|result|1|查询操作|
|ACTION_REMOVE|result|2|删除操作|
|ACTION_INSERT|result|3|插入操作|
|ACTION_UPDATE|result|4|更新操作|

## API列表
### user
|查询操作|url|数据要求|
|-------|-------|------|
|登录|/login|username, password|
|注册|/register|username, password, gender, birthday|
|更改用户名|/chguname|id, username|

### exercise
|查询操作|url|数据要求|
|-------|-------|------|
|新建活动|/add_exercise|latitude, longitude, sponsor_id, start_time, end_time, name|
|更改活动开始时间|/chg_start_time|id, start_time|
|更改活动结束时间|/chg_end_time|id, end_time|
|更改活动名|/chg_name|id, name|
|更改活动位置|/chg_location|latitude, longitude|
|更改活动状态|/chg_status|id, status|
|查询一定范围内的活动|/query_nearby_exercise|latitude_lower_bound, latitude_upper_bound, longitude_lower_bound, longitude_upper_bound|
|查询拥有某个标签的一定范围内的活动|/query_nearby_tag_exercise|latitude_lower_bound, latitude_upper_bound, longitude_lower_bound, longitude_upper_bound, tag|
|查询某用户发起的所有活动|/query_user_exercise|sponsor_id|
|查询某用户在某段时间内的所有活动|/query_user_current_exercise|sponsor_id, time_lower_bound, time_upper_bound|

## exercise状态码定义
|返回码标识|返回区域|返回码|含义|
|--------|-------|-----|---|
|RESULT_NOT_SUCH_STATUS|result|8100|活动状态不正确|

## exercise常量定义
|标识|值|含义|
|--- |-|----|
|EXERCISE_NEW_STATUS|0|新建的活动|
|EXERCISE_FINISHED_ATTEND_STATUS|1|此活动已截止参加|
|EXERCISE_CANCEL_STATUS|2|此活动已取消|
|MAX_TIMESTAMP_FORWARD|24 * 3600 * 1000|活动发到服务器的时间超过一个小时|

### tag
|查询操作|url|数据要求|
|-------|-------|-------|
|查询全部标签|/query_all_tag||


### exercise_tag
|查询操作|url|数据要求|
|-------|-------|------|
|为某个活动添加一个标签|/add_exer_tag|tag_id, exercise_id|
|为某个活动添加一个新的标签|/add_exer_new_tag|name, exercise_id|
|删除活动的一个标签|/del_tag|tag_id, exercise_id|
|查询某个活动的tag|/query_exer_tag|exercise_id|


### user_tag
|查询操作|url|数据要求|
|-------|-------|------|
|为某个用户添加标签|/add_user_tag|tag_id, user_id|
|为某个用户添加一个新的标签|/add_user_new_tag|name, user_id|
|删除用户的一个标签|/del_tag|tag_id, user_id|
|查询某个用户的tag|/query_usr_tag|user_id|

### attendency
|查询操作|url|数据要求|
|-------|-------|------|
|某个用户参加某个活动|/addusrActi|user_id, activity_id, created_day|
|某个用户取消参加某个活动|/delusrActi|user_id, activity_id|
|查询某个活动有什么人参加|/query_usrforActi|activity_id|
|查询某个用户是否参加了某个活动|/query_actiforusr|user_id, activity_id|
|查询某个用户参加过的所有活动|/query_allforusr|user_id, type='all'|
|查询某个用户某个时间内参加过的活动|/query_actibytime|user_id, time_lower_bound, time_upper_bound|
|查询某个用户参加的还未结束的活动|/query_actibeforeend|user_id, type='waiting'|

### activity_comment
|查询操作|url|数据要求|
|-------|-------|------|
|某个用户给某个活动添加评论|/addcomment|user_id, activity_id, comment, grade, time|
|查询某个活动的所有评论|/query_comment|activity_id|

### user_notice
|查询操作|url|数据要求|
|-------|-------|------|
|查询某个用户的通知|/query_notice|user_id|
|用户阅读某个通知|/read_notice|notice_id|

## 数据库表更改建议
添加user_cookie表来存储用户登录状态，表结构为id, user_id, created_datetime, cookie
为acticity表添加status列，用来标记活动状态，如等待中、商议中、已取消等，同时添加created_datetime列来记录活动创建时间
为attendency表添加created_day列，用于记录用户何时报名参加该活动
为notice添加status列，用于记录用户是否看过这个通知
