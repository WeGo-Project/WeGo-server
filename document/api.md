## API说明
### URL 格式
如果未特别说明，所有API均用HTTP/POST方法查询，提交的数据以键值对的方式放在POST content中，如果用户已登录，在POST content中加如以键为open_id，值为用户id的键值对。
基础URL格式：
```(server.com)/(target)/(action type)?(query string)```
```server.com``` 服务器域名
```target``` 查询的业务实体对象
```action type``` 对象的查询类型
```query string``` 提交的表单查询字符串
用户登录举例： ```server.com/user/login```
用户注册举例： ```server.com/user/register```

### 查询返回的格式
如果未特别说明，所有API均返回JSON字符串作为结果。
#### 返回的JSON字符串键值对说明
```request``` 查询类型，类型代码定义见文档后续
```target``` 查询对象，对象代码定义见文档后续
```result``` 查询结果，结果代码定义见文档后续
```data``` 查询得到的数据，以JSON数组方式存储，如果```result```指示失败则可能没有该项
用户登录返回结果示例： ```{"request":"3","target":"1","result":"-1"}```

## 全局状态码定义
|返回码标识|返回区域|返回码|含义|
|--------|-------|-----|---|
|RESULT_SUCCESS|result|200|成功|
|RESULT_FAILED|result|400|失败|
|RESULT_PERMISSION_DENY|result|401|没有权限进行这个操作|
|RESULT_SERVER_FAILED|result|501|服务器发生了错误|
|RESULT_USER_LOGIN_REQUESTED|result|402|这个操作需要用户登录|
|RESULT_TIMESTAMP_ERROR|result|8000|请求操作中的时间信息有误|
|ACTION_QUERY|request|1|查询操作|
|ACTION_REMOVE|request|2|删除操作|
|ACTION_INSERT|request|3|插入操作|
|ACTION_UPDATE|request|4|更新操作|

## API列表
### user
|查询操作|url|数据要求|返回数据结构|错误类型|
|-------|-------|------|------|-------|
|登录|/login|id|```"data":[{"id":"qwe","name":"asd","password":null,"birthday":"2060-00-00","gender":0,"credit":100}]```|RESULT_FAILED|
|注册|/register|id, name, gender, birthday|RESULT_SUCCESS|RESULT_FAILED, RESULT_TIMESTAMP_TOO_EARLY|
|更改用户名|/chguname|id, name|RESULT_SUCCESS|RESULT_FAILED, RESULT_PERMISSION_DENY|

#### user常量定义
|标识|值|含义|
|-----|-----|-----|
|LARGEST_AGE|```100 * 365 * 24 * 3600 * 1000```|用户的生日最早为100年前|

### exercise
|查询操作|url|数据要求|返回数据结构|错误类型|
|-------|-------|------|------|-------|
|新建活动|/add_exercise|latitude, longitude, sponsor_id, start_time, end_time, query.description， query.name， name, min_num, max_num, deadline, avg_cost, pic_store, tag(数组)|RESULT_SUCCESS|RESULT_FAILED, RESULT_TIMESTAMP_ERROR(当加入tag失败时，exercise创建成功后仍会返回RESULT_SUCCESS)|
|更改活动开始时间|/chg_start_time|id, start_time|RESULT_SUCCESS|RESULT_FAILED, RESULT_TIMESTAMP_ERROR|
|更改活动结束时间|/chg_end_time|id, end_time|RESULT_SUCCESS|RESULT_FAILED, RESULT_TIMESTAMP_ERROR|
|更改活动名|/chg_name|id, name|RESULT_SUCCESS|RESULT_FAILED|
|更改活动位置|/chg_location|latitude, longitude|RESULT_SUCCESS|RESULT_FAILED|
|更改活动状态|/chg_status|id, status|RESULT_SUCCESS|RESULT_FAILED, RESULT_NOT_SUCH_STATUS|
|查询一定范围内的活动|/query_nearby_exercise|latitude, longitude|```"data":[{"id":5,"latitude":1,"sponsor_id":"1","start_time":"2016-07-11T00:00:00.000Z","end_time":"2016-07-12T00:00:00.000Z","name":"1","longitude":1,"description":"1","created_datetime":"2016-07-11T06:10:39.000Z","status":0,"min_num":1,"max_num":12,"deadline":"2016-07-11T04:00:00.000Z","avg_cost":2,"pic_store":"1","tag":[{"tag_id":1,"name":"tag"}]}]```|RESULT_FAILED|
|查询拥有某个标签的一定范围内的活动|/query_nearby_tag_exercise|latitude, longitude, tag|```"data":[{"id":5,"latitude":1,"sponsor_id":"1","start_time":"2016-07-11T00:00:00.000Z","end_time":"2016-07-12T00:00:00.000Z","name":"1","longitude":1,"description":"1","created_datetime":"2016-07-11T06:10:39.000Z","status":0,"min_num":1,"max_num":12,"deadline":"2016-07-11T04:00:00.000Z","avg_cost":2,"pic_store":"1","tag":[{"tag_id":1,"name":"tag"}]}]```|RESULT_FAILED|
|查询某用户发起的所有活动|/query_user_exercise|sponsor_id|```"data":[{"id":5,"latitude":1,"sponsor_id":"1","start_time":"2016-07-11T00:00:00.000Z","end_time":"2016-07-12T00:00:00.000Z","name":"1","longitude":1,"description":"1","created_datetime":"2016-07-11T06:10:39.000Z","status":0,"min_num":1,"max_num":12,"deadline":"2016-07-11T04:00:00.000Z","avg_cost":2,"pic_store":"1","tag":[{"tag_id":1,"name":"tag"}]}]```|RESULT_FAILED|
|查询某用户在某段时间内的所有活动|/query_user_current_exercise|sponsor_id, time_lower_bound, time_upper_bound|```"data":[{"id":5,"latitude":1,"sponsor_id":"1","start_time":"2016-07-11T00:00:00.000Z","end_time":"2016-07-12T00:00:00.000Z","name":"1","longitude":1,"description":"1","created_datetime":"2016-07-11T06:10:39.000Z","status":0,"min_num":1,"max_num":12,"deadline":"2016-07-11T04:00:00.000Z","avg_cost":2,"pic_store":"1","tag":[{"tag_id":1,"name":"tag"}]}]```|RESULT_FAILED|

#### exercise状态码定义
|返回码标识|返回区域|返回码|含义|
|--------|-------|-----|---|
|RESULT_NOT_SUCH_STATUS|result|8100|活动状态不正确|
|RESULT_LOGIC_NUMBER_ERROR|result|8200|最少人数大于最大人数|

#### exercise常量定义
|标识|值|含义|
|-----|-----|-----|
|EXERCISE_NEW_STATUS|0|新建的活动|
|EXERCISE_FINISHED_ATTEND_STATUS|1|此活动已截止参加|
|EXERCISE_CANCEL_STATUS|2|此活动已取消|
|MAX_TIMESTAMP_FORWARD|24 \* 3600 \* 1000|活动发到服务器的时间超过一天|

### tag
|查询操作|url|数据要求|返回数据结构|
|-------|-------|-------|-------|
|查询全部标签|/query_all_tag||data:[{"id":1,"name":"tag1"},{"id":2,"name":"tag2"},{"id":3,"name":"tag3"}]|


### exercise_tag
|查询操作|url|数据要求|返回数据结构|
|-------|-------|------|------|
|为某个活动添加一个标签|/add_exer_tag|tag_id, exercise_id|result: 200|
|为某个活动添加一个新的标签|/add_exer_new_tag|name, exercise_id|未实现|
|删除活动的一个标签|/del_tag|tag_id, exercise_id|result: 200|
|查询某个活动的tag|/query_exer_tag|exercise_id|data:[{"tag_id":1,"name":"tag1"},{"tag_id":2,"name":"tag2"},{"tag_id":3,"name":"tag3"}]|


### user_tag
|查询操作|url|数据要求|返回数据结构|
|-------|-------|------|-----|
|为某个用户添加标签|/add_user_tag|tag_id, user_id|result: 200|
|为某个用户添加一个新的标签|/add_user_new_tag|name, user_id|未实现|
|删除用户的一个标签|/del_tag|tag_id, user_id|result: 200|
|查询某个用户的tag|/query_usr_tag|user_id|data:[{"tag_id":3,"name":"tag3"},{"tag_id":1,"name":"tag1"},{"tag_id":2,"name":"tag2"}]}|

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
|查询操作|url|数据要求|返回数据结构|
|-------|-------|------|------|
|查询某个用户的通知|/query_notice|user_id|data:[{"id":9,"user_id":"1","exercise_id":3,"notice_content":"200","time":"2016-07-11T05:14:14.000Z","status":1},{"id":10,"user_id":"1","exercise_id":3,"notice_content":"100","time":"2016-07-11T07:10:01.000Z","status":1}]}|
|用户阅读某个通知|/read_notice|notice_id|result: 200|

#### notice状态码
|作用区域|状态码|含义|
|notice_content|100|用户(user_id)发起/参与的活动(exercise_id)将于1小时内开始|
|notice_content|200|未定义|
|status|1|未读|
|status|2|已读|

## 数据库表更改建议
添加user_cookie表来存储用户登录状态，表结构为id, user_id, created_datetime, cookie
为acticity表添加status列，用来标记活动状态，如等待中、商议中、已取消等，同时添加created_datetime列来记录活动创建时间
为attendency表添加created_day列，用于记录用户何时报名参加该活动
为notice添加status列，用于记录用户是否看过这个通知
