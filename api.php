<?php
function convertUrlQuery($query)
{
  $queryParts = explode('&', $query);
  $params = array();
  foreach ($queryParts as $param) {
    $item = explode('=', $param);
    $params[$item[0]] = $item[1];
  }
  return $params;
}

$url = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
$arr = parse_url($url);
$arr_query = convertUrlQuery($arr['query']);
if(!$arr_query['p']){
    $arr_query['p'] = 1;
}
if(!$arr_query['ispage']){
    $arr_query['ispage'] = 0;
}
$ispage = $arr_query['ispage'];
$page = (int)$arr_query['p'];
$cid = $arr_query['cid'];
$sec = $arr_query['apisec'];
if(strcmp($sec,"XXXXXX") != 0) {
    exit("微信小程序通信秘钥错误！");
}
//定义推荐文章id和关于页面id
$topcid = 5;
$pagecid = 9;
/**
*利用typecho 自带的数据库方法操作
*/
require_once 'config.inc.php';
/** 载入API支持 */
require_once 'var/Typecho/Common.php';
/** 初始化组件 */
Typecho_Widget::widget('Widget_Init');
/** 程序初始化 */
Typecho_Common::init();
$db = Typecho_Db::get();
if(empty($cid)){
    if($ispage == 1){
        //关于页面
        $results = $db->fetchRow($db->select('cid', 'title', 'created', 'type', 'slug','text','commentsNum','views','likes')->from('table.contents')->where('cid = ?', $pagecid));
    	//时间戳处理
    	$results['created'] = date('Y-m-d h:i:s',$results['created']);
    	//调取封面图片
    	$post = $db->fetchRow($db->select('str_value')->from('table.fields')->where('cid = ?', $pagecid)->where('name = ?', "img"));
    	$results['str_value'] = $post[0]['str_value'];
    	//更新点击量数据库
        $row = $db->fetchRow($db->select('views')->from('table.contents')->where('cid = ?', $pagecid));
        $db->query($db->update('table.contents')->rows(array('views' => (int)$row['views']+1))->where('cid = ?', $pagecid));
        echo '{"detail": ' . json_encode($results) . '}';
    }else{
        //顶部推荐文章
        $topresults = $db->fetchRow($db->select('table.contents.cid,title,views,likes,commentsNum,created')->from('table.contents')->where('cid = ?', $topcid));
        $topresults['created'] = date('Y-m-d h:i:s',$topresults['created']);
        $img = $db->fetchRow($db->select('str_value')->from('table.fields')->where('cid = ?', $topcid)->where('name = ?', "img"));
    	$topresults['str_value'] = $img['str_value'];
    
        //获取最新文章
        $posts = $db->fetchAll($db->select('table.contents.cid,title,text,views,likes,str_value,created')->from('table.contents')->join('table.fields', 'table.fields.cid = table.contents.cid', Typecho_Db::LEFT_JOIN)->where('table.fields.name = "img"')->where('table.contents.type = ?', 'post')->where('status = ?', 'publish')->where('created < ?', time())->order('table.contents.created', Typecho_Db::SORT_DESC)->offset(($page - 1)*10)->limit(10));
        foreach ($posts as $result) {
            $result['created'] = date('Y-m-d',$result['created']);
            $result['text'] = mb_substr($result['text'],15,20,'utf-8')."...";
            $results[]    = $result;
        }
        echo '{"newlists": ' . json_encode($results) . ',"toplists":'.json_encode($topresults).'}';
    }
}else{
    //文章详情页面
    $results = $db->fetchRow($db->select('cid', 'title', 'created', 'type', 'slug','text','commentsNum','views','likes')->from('table.contents')->where('cid = ?', $cid));
	//时间戳处理
	$results['created'] = date('Y-m-d h:i:s',$results['created']);
	//调取封面图片
	$post = $db->fetchRow($db->select('str_value')->from('table.fields')->where('cid = ?', $cid)->where('name = ?', "img"));
	$results['str_value'] = $post[0]['str_value'];
	//更新点击量数据库
    $row = $db->fetchRow($db->select('views')->from('table.contents')->where('cid = ?', $cid));
    $db->query($db->update('table.contents')->rows(array('views' => (int)$row['views']+1))->where('cid = ?', $cid));
    echo '{"detail": ' . json_encode($results) . '}';
}
?>