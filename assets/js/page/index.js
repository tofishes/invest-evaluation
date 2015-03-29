// @tofishes 评论搜索功能
!function(window, kws){
	var $doms = kws.$doms
	,	templates = kws.templates

	,	urlMap = kws.uri({
		'weibo': 'weibo/getContent',
		'search': 'weibo/getCommentList'
	});

	kws.$win.scrollTop(0);

	$doms.getWeibo.on('click', function (e) {
		var url = $.trim($doms.urlInput.val());

		if (!url) {
			$doms.urlErrorTip.html('请输入URL地址').show();
			return;
		};
		$doms.urlErrorTip.hide();
		$doms.tweetBox.hide();
		$doms.resultList.empty();
		$doms.resultPager.empty();

		sys.loading();
		$.get(urlMap.weibo || '/phony-data/weibo.json', {
			'weiboUrl': url
		}, function (data) {
			sys.loaded();

			data = data.rst;

			if ($.isEmptyObject(data)) {
				sys.alert('未找到微博内容，请检查微博URL。')
				return;
			};

			$doms.filterForm.find('.weibo-url-input').val(url);

			$doms.mainWeibo.html($.tmpl(templates.feedlist, data));
			$doms.tweetBox.show();
		});
	});

	$doms.filterForm.on('submit', function (e) {
		var params = {
			// "keyWord": "",   //评论搜索关键词
			"pageNum": 20//每页消息数量
		}
		,	$this = $(this)
		,	$keyword = $this.find('.keyword')
		,	$condition = $this.find('.condition')
		,	$retweet = $this.find('.retweet-check')
		,	$comment = $this.find('.comment-check')
		,	keywordArray;

		function getResult(pageNum) {
			params.pageID = pageNum || 1;

			$retweet[0].checked && (params.hasRetweet = 1); //是否有转发
			$comment[0].checked && (params.hasComment = 1); //是否有评论

			if (!params.hasRetweet && !params.hasComment) {

				$doms.resultList.empty();
				$doms.resultPager.empty();

				return false;
			};

			params.weiboUrl = $doms.filterForm.find('.weibo-url-input').val();

			keywordArray = [];
			$keyword.each(function (i, element) {
				var val = $.trim($(this).val())
				,	condition = $condition.eq(i).val();

				if (val) {
					condition && keywordArray.push(condition);
					keywordArray.push(val);
				};
			});

			params.keyWord = $.trim(keywordArray.join(','));

			sys.loading();
			$.get(urlMap.search || '/phony-data/weibo.json', params, function (data) {
				sys.loaded();

				data = data.rst;
				var pageInfo = data.pageInfo;

				$doms.resultList.html($.tmpl(templates.retweetCommentList, data.list));

				// @tofishes 2014年07月24日 应上海要求嫌截图难看 去掉高亮
				// keywordArray.length && module.use(['util/HighLight'], function (highlighter) {
				// 	var hl = new highlighter();
				// 	hl.highlight($doms.resultList[0], keywordArray.join(' '));
				// });

				$doms.resultTotal.html('共计' + pageInfo.totalNum + '条');

				module.use(['plugins/pager'], function () {
					$doms.resultPager.show().pageBar(pageInfo, function (pageNum) {
						getResult(pageNum);
					});
				});
			});
		};

		getResult();

		return false;
	});
}(this, kws);