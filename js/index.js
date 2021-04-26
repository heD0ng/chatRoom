// 聊天室的主要功能

var socket = io('http://localhost:5000')
let user,avatar

// 登陆功能
// 1、选择头像
$('#login_avatar li').on('click', function(){
    // 不可以用箭头函数
    // 给点击的加上now，移除兄弟节点的now
    $(this).addClass('now').siblings().removeClass('now')
})

// 点击按钮
$('#loginBtn').on('click', ()=>{

    user = $('#username').val().trim()
    // 拿到class为now的src属性-图片地址
    avatar = $('#login_avatar li.now img').attr('src')

    console.log(avatar);
    // 告诉socketio要登陆
    socket.emit('login', {
        user: user,
        avatar: avatar
    })
})

socket.on('loginError', data=>{
    alert('登陆失败')
})

socket.on('loginSuc', data=>{
    // alert('登陆成功')
    // 登陆成功，隐藏登陆框，显示聊天窗口
    $('.login_box').hide()
    $('.container').show()
    console.log(data);
    $('#avatar-url').attr('src', data.avatar)
    $('#loginUserName').text(data.user) 
})

socket.on('addUser', data=>{
    $('.box-bd').append(`<div class="system">
    <p class="message_system">
      <span class="content">${data.user}加入了群聊</span>
    </p>
  </div>`)
})

socket.on('usersList', data=>{
    $('#user-info').html('')
    data.forEach(e => {
        $('#user-info').append(`<li class="user">
        <div class="avatar"><img src="${e.avatar}" alt=""></div>
        <div class="name">${e.user}</div>
      </li>`)
    });
    $('#userTotal').text(data.length)
})

socket.on('userLeave', data=>{
    console.log(data);
    $('.box-bd').append(`<div class="system">
    <p class="message_system">
      <span class="content">${data}离开了群聊</span>
    </p>
  </div>`)
})

// 聊天功能
$("#btn-send").on('click', ()=>{
    let content = $("#content").val()

    console.log(content);
    // 数据发给服务器
    socket.emit('sendMsg',{
        content:content,
        user:user,
        avatar:avatar
    })
    $("#content").val('')
})

socket.on('showMsg', data=>{
    if(data.user === user){
        // 自己的消息：放在右边
        $('.box-bd').append(`
        <div class="message-box">
        <div class="my message">
          <img src="${data.avatar}" alt="" class="avatar">
          <div class="content">
            <div class="bubble">
              <div class="bubble_cont">${data.content}</div>
            </div>
          </div>
        </div>
      </div>`)
    }else{
        $('.box-bd').append(`
        <div class="message-box">
          <div class="other message">
            <img src="${data.avatar}" alt="" class="avatar">
            <div class="content">
              <div class="nickname">${data.user}</div>
              <div class="bubble">
                <div class="bubble_cont">${data.content}</div>
              </div>
            </div>
          </div>
        </div>`)
    }
    // 让最后一个元素自动滚动到可视区域中
    var LastChild = document.getElementById("box-bd").lastChild;
    LastChild.scrollIntoView(false)
})


$(".sub_btn").click(function () {

    var str = $("#saytext").val();

    $("#show").html(replace_em(str));

});
    
   
    