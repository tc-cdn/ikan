var comm = {
	

	'sq': {
		'vers': '1703534661',
	},	
	
}
layui.use(['form','element', 'jquery', 'layer'], function() {
  var layer = layui.layer;
	jquery = layui.jquery;
	element = layui.element;
	form = layui.form;	
	
	sq = layui.sq;
	
});
layui.use(['element', 'form', 'upload', 'layer', 'code'], function() {
	var $ = layui.jquery,
		element = layui.element,
		form = layui.form,
		layer = layui.layer,
		upload = layui.upload;

	form.on('submit', function(data) {
		$.post($('.layui-form-pane').attr('action'), data.field, function(res) {
			layer.msg(res.msg, {
				time: 1000
			}, function() {
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval = document.cookie.match(new RegExp('(^| )far_color=([^;]*)(;|$)'));
				if(cval != null) document.cookie = 'far_color=' + escape(cval) + ';path=/;expires=' + exp.toUTCString();
				location.reload();
			});
		});
		return false;
	});

	upload.render({
		elem: '.layui-upload',
		url: $('.j-ajax', parent.document).attr('href').replace('/index/clear.html', '') + '/upload/upload.html?flag=site',
		method: 'post',
		before: function(input) {
			layer.msg('文件上传中...', {
				time: 3000000
			});
		},
		done: function(res, index, upload) {
			var obj = this.item;
			if(res.code == 0) {
				layer.msg(res.msg);
				return false;
			}
			layer.closeAll();
			var input = $(obj).parent().parent().find('.upload-input');
			if($(obj).attr('lay-type') == 'image')
				input.siblings('img').attr('src', res.data.file).show();
			input.val(res.data.file);
		}
	});

	$('.upload-input').hover(function(imgstr) {
		var imgstr = window.event || imgstr;
		var imgsrc = $(this).val();
		if(imgsrc.trim() == '') return;
		$('.far-admin-picture').css({
			left: imgstr.clientX + document.body.scrollLeft + 20,
			top: imgstr.clientY + document.body.scrollTop + 20,
			display: ''
		});
		if(imgsrc.indexOf('://') < 0) imgsrc = far.path + imgsrc;
		else imgsrc = imgsrc.replace('mac:', 'http:');
		$('.far-admin-images').attr('src', imgsrc);
	}, function() {
		$('.far-admin-picture').css('display', 'none');
	});

	$(document).on('click', '.far-admin-renews', function() {
		layer.confirm('确定恢复默认设置吗', {
			title: '提示'
		}, function() {
			$.post($('.layui-form-pane').attr('action') + '&name=' + far.name, 'type=renews', function(data) {
				layer.msg(data.msg.replace('1', ''), {
					time: 1000
				}, function() {
					location.reload();
				});
			}).error(function(data) {
				layer.msg('请求失败：' + data.status);
			}, 'json');
		});
	});

	$(document).on('click', '.far-admin-player', function() {
		var that = $(this);
		layer.confirm('更新前请备份' + $(this).attr('data-href'), {
			title: $(this).text()
		}, function() {
			$.post(far.tpls + 'asset/far/create.php?id=cop&name=' + far.name, 'urls=&news=' + encodeURIComponent(that.attr('data-copy')) + '&nows=' + encodeURIComponent('../../../../' + that.attr('data-href')), function(data) {
				layer.alert(data.msg + '！如未生效请手动清理缓存');
			}).error(function(data) {
				layer.msg('请求失败：' + data.status);
			}, 'json');
		});
	});
});