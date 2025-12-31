'use strict';
'require view';
'require fs';
'require ui';

return view.extend({
	// --- Base64 图片数据 (绝对能显示) ---
	// 重启图标 (橙色)
	iconReboot: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNlNjdlMjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMyA0IDIzIDEwIDE3IDEwIj48L3BvbHlsaW5lPjxwYXRoIGQ9Ik0yMC40OSAxNWE5IDkgMCAxIDEtMi4xMi05LjM2TDIzIDEwIj48L3BhdGg+PC9zdmc+',
	
	// 关机图标 (红色)
	iconShutdown: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjMDM5MmIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTguMzYgNi42NGE5IDkgMCAxIDEtMTIuNzMgMCI+PC9wYXRoPjxsaW5lIHgxPSIxMiIgeTE9IjIiIHgyPSIxMiIgeTI9IjEyIj48L2xpbmU+PC9zdmc+',

	css: `
		.power-container {
			display: flex;
			justify-content: center;
			gap: 2rem;
			margin-top: 5rem;
			flex-wrap: wrap;
		}
		.power-card {
			background-color: #fcfcfc;
			border: 1px solid #e0e0e0;
			border-radius: 12px;
			padding: 40px;
			text-align: center;
			width: 220px;
			cursor: pointer;
			transition: all 0.3s ease;
			box-shadow: 0 4px 6px rgba(0,0,0,0.05);
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.power-card:hover {
			transform: translateY(-5px);
			box-shadow: 0 12px 20px rgba(0,0,0,0.1);
			border-color: #bbb;
		}
		/* 图片样式 */
		.icon-img {
			width: 64px;
			height: 64px;
			margin-bottom: 20px;
			display: block;
		}
		.card-title { font-size: 1.2rem; font-weight: bold; color: #444; }
		
		.owq-footer {
			margin-top: 60px;
			text-align: center;
			font-size: 0.85rem;
			color: #999;
		}
		.owq-footer a {
			color: #999;
			text-decoration: none;
			font-weight: bold;
			transition: color 0.2s;
		}
		.owq-footer a:hover { color: #0079D3; }

		:host-context([data-theme="dark"]) .power-card {
			background-color: #2a2a2a;
			border-color: #444;
		}
		:host-context([data-theme="dark"]) .card-title { color: #eee; }
	`,

	handleAction: function(action) {
		var title, desc, cmd;
		if (action === 'reboot') {
			title = _('Confirm Reboot?');
			desc = _('Rebooting may take a few minutes. Network will be interrupted.');
			cmd = '/sbin/reboot';
		} else {
			title = _('Confirm Shutdown?');
			desc = _('You will need to manually press the power button to turn it back on.');
			cmd = '/sbin/poweroff';
		}

		ui.showModal(title, [
			E('p', {}, desc),
			E('div', { 'class': 'right' }, [
				E('button', { 'class': 'btn', 'click': ui.hideModal }, _('Cancel')),
				' ',
				E('button', {
					'class': 'btn cbi-button-' + (action === 'reboot' ? 'action' : 'negative'),
					'click': function() {
						ui.showModal(_('Processing...'), [
							E('p', { 'class': 'spinning' }, _('Sending command, please wait...'))
						]);
						fs.exec(cmd).then(function() {
							window.setTimeout(function() {
								ui.addNotification(null, E('p', _('Command sent. Check device status.')));
								ui.hideModal();
							}, 3000);
						}).catch(function(e) {
							ui.addNotification(null, E('p', _('Failed: ') + e.message));
							ui.hideModal();
						});
					}
				}, _('Confirm'))
			])
		]);
	},

	render: function() {
		return E('div', {}, [
			E('style', {}, this.css),
			E('h2', {}, _('OWQ Power Control')),
			E('div', { 'class': 'cbi-map-descr' }, _('Quickly manage your device power state.')),
			E('div', { 'class': 'power-container' }, [
				// 重启卡片
				E('div', {
					'class': 'power-card',
					'click': ui.createHandlerFn(this, 'handleAction', 'reboot')
				}, [ 
					// 使用 img 标签直接显示 Base64 图片
					E('img', { 'class': 'icon-img', 'src': this.iconReboot }), 
					E('div', { 'class': 'card-title' }, _('Reboot System')) 
				]),
				
				// 关机卡片
				E('div', {
					'class': 'power-card',
					'click': ui.createHandlerFn(this, 'handleAction', 'shutdown')
				}, [ 
					E('img', { 'class': 'icon-img', 'src': this.iconShutdown }), 
					E('div', { 'class': 'card-title' }, _('Power Off')) 
				])
			]),
			E('div', { 'class': 'owq-footer' }, [
				E('span', {}, 'Developed by '),
				E('a', { 'href': 'https://github.com/isalikai', 'target': '_blank' }, '@github-isalikai')
			])
		]);
	}
});