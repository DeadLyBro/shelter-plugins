const {
    flux: { dispatcher, awaitStore },
    observeDom
} = shelter;

var head = document.getElementsByTagName('HEAD')[0]; 
	var myStyle = document.createElement('style');
		myStyle.innerHTML = `.DeadLyBro-BBCode { overflow: auto!important; } th, td { padding: 5px 10px!important; border: 1px solid black!important; } tr:first-child { background: #5865f2!important; } tr:not(:first-child):nth-child(odd) { background: #2b2d31!important; } table { border-radius: 5px!important; } table { border-collapse: collapse!important; margin: 10px!important; } tr:first-child th { text-align: center!important; font-weight: 600!important; } tr:not(:first-child) th { color: red!important; font-weight: 600!important; text-align: center; } `;
	head.appendChild(myStyle);

const USERNAME_QUERY = 'div[class^=scrollerContent] div[class^=markup][class*=messageContent]';
/* const USERNAME_QUERY = 'div[class^=markup][class*=messageContent]'; */
/* To enable other pages. */

export function force() {
    for (const e of document.querySelectorAll(USERNAME_QUERY)) {
        add(e, true);
    }
}

async function add(e, overwrite = false) {
    if (e.querySelector(".DeadLyBro-BBCode") && !overwrite) return;
	if (!e.textContent.startsWith('[')) return;
	console.log(`%cDEBUG:%c ${e.textContent}`, "-webkit-text-stroke: 1px black; border-radius: 5px; padding: 5px; background: -moz-linear-gradient(112deg, #1301FE 0, #F4F60C 100%); background: -webkit-gradient(linear, 112deg, color-stop(0, 1301FE), color-stop(100%, F4F60C)); background: -webkit-linear-gradient(112deg, #1301FE 0, #F4F60C 100%); background: -o-linear-gradient(112deg, #1301FE 0, #F4F60C 100%); background: -ms-linear-gradient(112deg, #1301FE 0, #F4F60C 100%); filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#1301FE', endColorstr='#F4F60C', GradientType='1'); background: linear-gradient(112deg, #1301FE 0, #F4F60C 100%);", '');

		let css = e.textContent;
		let spaceReplacer = "\u00a0";
		
		css.replace(/<span>(.*?)<\/span>/gs, '$1');

		// [code]
		css = css.replace(/\[code\](.*?)\[\/code\]/gs, (match, codeContent) => {
			return `<pre style="padding: 10px; overflow: auto;"><code style="font-family: 'Courier New', Courier, monospace; font-size: 14px;padding: 5px; border-radius: 5px;">${codeContent}</code></pre>`;
		});

		// [code={language}]
		css = css.replace(/\[code=([^\]]+)\](.*?)\[\/code\]/gs, (match, language, codeContent) => {
			return `<pre style="padding: 10px; overflow: auto;"><code style="font-family: 'Courier New', Courier, monospace; font-size: 14px;padding: 5px; border-radius: 5px;" class="${language}">${codeContent}</code></pre>`;
		});

		// [pre]
		css = css.replace(/\[pre\](.*?)\[\/pre\]/gs, (match, preContent) => {
			return `<pre>${preContent}</pre>`;
		});

		// [table]
		css = css.replace(/\[table\](.*?)\[\/table\]/gs, (match, tableContent) => {
			return `<table>${tableContent}</table>`;
		});

		// [tr]
		css = css.replace(/\[tr\](.*?)\[\/tr\]/gs, (match, cellsContent) => {
			return `<tr>${cellsContent}</tr>`;
		});

		// [th]
		css = css.replace(/\[th\](.*?)\[\/th\]/gs, (match, content) => {
			return `<th>${content}</th>`;
		});

		// [td]
		css = css.replace(/\[td\](.*?)\[\/td\]/gs, (match, content) => {
			return `<td>${content}</td>`;
		});

		// [youtube]
		css = css.replace(/\[youtube\](.*?)\[\/youtube\]/gs, (match, videoId) => {
			return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
		});

		// [spoiler] with name
		css = css.replace(/\[spoiler=([^\]]+)\](.*?)\[\/spoiler\]/g, (match, name, content) => {
			return `<div style="border: 2px solid #d17f19; border-radius: 4px;"><div onclick="toggleSpoiler(this)" style="cursor: pointer; background-color: var(--background-tertiary); padding: 5px; font-weight: bold;">${name}</div><div style="padding: 5px; display: none;">${content}</div></div>`;
		});

		// [spoiler] without name
		css = css.replace(/\[spoiler\](.*?)\[\/spoiler\]/g, (match, content) => {
			return `<div style="border: 2px solid #d17f19; border-radius: 4px;"><div onclick="toggleSpoiler(this)" style="cursor: pointer; background-color: var(--background-tertiary); padding: 5px; font-weight: bold;">Spoiler</div><div style="padding: 5px; display: none;">${content}</div></div>`;
		});

		// [br] Line Break
		css = css.replace(/\[br\]/g, '<br />');

		// [quote] Quote
		css = css.replace(/\[quote\](.*?)\[\/quote\]/g, (match, content) => {
			return `<span style="border-left: 2px solid #ccc; border-radius: 4px; display: block; padding: 0px 8px 0px 12px;">${content}</span>`;
		});

		// [quote] with name
		css = css.replace(/\[quote=([^\]]+)\](.*?)\[\/quote\]/g, (match, name, content) => {
			return `<span style="border-left: 2px solid #ccc; border-radius: 4px; padding: 0px 8px 0px 12px; display: block;"><strong>${name}:</strong> ${content}</span>`;
		});

		// [left] Left Align
		css = css.replace(/\[left\](.*?)\[\/left\]/g, '<span style="float: left;">$1</span>');

		// [right] Right Align
		css = css.replace(/\[right\](.*?)\[\/right\]/g, '<span style="float: right;">$1</span>');

		// [color] Color
		css = css.replace(/\[color=([^\]]+)\](.*?)\[\/color\]/g, (match, color, content) => {
			const validColor = /^(#?[0-9A-Fa-f]{6}|[a-zA-Z]+)$/i.test(color) ? color : '#000';
			return `<span style="color: ${validColor}">${content}</span>`;
		});

		// [font] Font
		css = css.replace(/\[font="([^"]+)"\](.*?)\[\/font\]/g, (match, font, content) => {
			return `<span style="font-family: ${font}">${content}</span>`;
		});

		// [size] Font Size
		css = css.replace(/\[size=(\d+)\](.*?)\[\/size\]/g, (match, size, content) => {
			return `<span style="font-size: ${size}px">${content}</span>`;
		});

		// [style size] Font Size
		css = css.replace(/\[style size="?(\d+)px"?\](.*?)\[\/style\]/g, (match, size, content) => {
			return `<span style="font-size: ${size}px">${content}</span>`;
		});

		// [b] Bold
		css = css.replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');

		// [i] Italic
		css = css.replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>');

		// [u] Underline
		css = css.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');

		// [s] Strikethrough
		css = css.replace(/\[s\](.*?)\[\/s\]/g, '<s>$1</s>');

		// [url] Link with name
		css = css.replace(/\[url=([^\]]+)\](.*?)\[\/url\]/g, (match, url, text) => {
			return `<a href="${url}" target="_blank">${text}</a>`;
		});

		// [url] Link
		css = css.replace(/\[url\](.*?)\[\/url\]/g, (match, url) => `<a href="${url}" target="_blank">${url}</a>`);

		// [img] with width and height attributes
		css = css.replace(/\[img width=(\d+) height=(\d+)(.*?)\](.*?)\[\/img\]/g, (match, width, height, attributes, url) => {
			return `<img src="${url}" style="max-width:${width}px; max-height:${height}px;" ${attributes} alt="Image">`;
		});

		// [img] shorthand with width and height
		css = css.replace(/\[img=(\d+)x(\d+)\](.*?)\[\/img\]/g, (match, width, height, url) => {
			return `<img src="${url}" style="max-width:${width}px; max-height:${height}px;" alt="Image">`;
		});

		// [img] Image
		css = css.replace(/\[img\](.*?)\[\/img\]/g, (match, src) => `<img src="${src}" alt="Image">`);

		// [center] Center
		css = css.replace(/\[center\](.*?)\[\/center\]/g, '<div style="text-align: center;">$1</div>');

		e.innerHTML = `<div class='DeadLyBro-BBCode'>${css}</div>`;
}

async function onDispatch(payload) {
    // ignore MESSAGE_CREATEs from other channels
    const selectedChannelStore = await awaitStore("SelectedChannelStore");
    if (
        payload.type === "MESSAGE_CREATE" &&
        payload.channelId !== selectedChannelStore.getChannelId()
    ) {
        return;
    }

    const unObserve = observeDom(USERNAME_QUERY, (e) => {
        unObserve();
        add(e);
    });

    // don't leave this forever, just in case!
    setTimeout(unObserve, 500);
}

// MESSAGE_CREATE: new message somewhere
// CHANNEL_SELECT: the user switches servers
// LOAD_MESSAGES_SUCCESS: new messages in viewport
// UPDATE_CHANNEL_DIMENSIONS: the user scrolls back down perhaps
// GUILD_MEMBER_UPDATE: nickname change
const TRIGGERS = [
    "MESSAGE_CREATE",
    "CHANNEL_SELECT",
    "LOAD_MESSAGES_SUCCESS",
    "UPDATE_CHANNEL_DIMENSIONS",
    "GUILD_MEMBER_UPDATE",
    "USER_NOTE_LOADED",
    "GUILD_MEMBER_PROFILE_UPDATE",
    "USER_UPDATE"
];

export function onLoad() {
    // apply on usernames that are already in the DOM
    force();
    for (const t of TRIGGERS) dispatcher.subscribe(t, onDispatch);
}

export function onUnload() {
    for (const t of TRIGGERS) dispatcher.unsubscribe(t, onDispatch);
}
