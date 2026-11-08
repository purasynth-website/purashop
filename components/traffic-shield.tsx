import { TRAFFIC_SHIELD_CID, TRAFFIC_SHIELD_UID } from "@/lib/traffic-shield";

/**
 * TrafficShield, the ads contractor's traffic filter, campaign tH5Bq3wpDP.
 *
 * Owner, 2026-11-07: "put the code on both the websites", this site and
 * purasynth.com. Two pieces, mounted by app/layout.tsx:
 *
 *   <TrafficShieldGuard /> in <head>: an inline script, see below.
 *   <TrafficShieldTag />   first thing in <body>: the dashboard's "JS CDN" tag
 *     byte for byte, written as raw HTML so React can neither rewrite its
 *     attributes (it renders async as async="") nor hoist it above the
 *     guard. The dashboard's "Verify Installation" looks for that exact tag;
 *     on 2026-11-08 the contractor reported "I dont see it loaded" while a
 *     React-rendered defer version was live. The inline guard executes while
 *     the parser is still in <head>, before the body's script element even
 *     exists, so it is always in place first. proxy.ts answers the vendor's
 *     verify query parameter with the campaign id, as their PHP file does.
 *
 * What shield.js does (read on 2026-11-07; 4 KB, unminified): on every page
 * load it POSTs {userAgent, language, referrer, url} to logicts.ink and obeys
 * the reply: `redirection` sets window.location to the reply's url, `zrc`
 * swaps the document body for the reply's content, `none` does nothing. The
 * campaign server decides who is a bot; a blocked visitor is answered with a
 * redirect to the campaign's safe page (https://www.purasynth.shop/), an
 * allowed one with a redirect to the money page (purasynth.com, per the
 * contractor), and a visitor already on the safe page's root with `none`.
 *
 * The guard exists because of two things in the vendor script:
 *   1. every failure ends in alert("A system error occurred."), a network
 *      error, an ad blocker, a non-JSON reply, and a `status: "error"` reply
 *      alerts the vendor's message to the visitor. The guard turns all of
 *      those into a `none` reply.
 *   2. it follows any redirect it is given, including one to the site it is
 *      already on (a bot on /primers/x is sent to the root; a visitor on the
 *      money site could be sent to the money site). The guard answers `none`
 *      for any redirect that stays on the current host (a leading www.
 *      ignored) and after the third cross-site redirect in one tab session,
 *      so nobody can be reloaded in a loop and a reviewer can browse this
 *      site page by page.
 * The guard only wraps fetch() calls to logicts.ink; every other request
 * passes straight through. While ACTIVE is false, or on SKIP_PATHS, it
 * answers `none` locally without calling the campaign server, so the tag is
 * present for the dashboard's verification but bounces nobody.
 */

/** Master switch: false renders nothing at all (no tag, no guard). */
export const TRAFFIC_SHIELD_ENABLED = true;
/**
 * false = tag present, check answered `none` locally (installed but inert).
 * Paused by the owner on 2026-11-07, switched on 2026-11-08 after the
 * contractor's go-ahead ("im ready when you post it"; owner: "we can push it").
 */
export const TRAFFIC_SHIELD_ACTIVE = true;

const SHIELD_SRC = "https://tscdn.ink/shield.js";
const SHIELD_API = "https://logicts.ink";

/** The dashboard's tag, byte for byte. */
const VENDOR_TAG = `<script async src="${SHIELD_SRC}" data-uid="${TRAFFIC_SHIELD_UID}" data-cid="${TRAFFIC_SHIELD_CID}"></script>`;

/** Path prefixes where the check is answered `none` locally. None on this site. */
const SKIP_PATHS: readonly string[] = [];

const GUARD = `(function(){try{
var API=${JSON.stringify(SHIELD_API)},skip=${JSON.stringify(SKIP_PATHS)},p=location.pathname,inert=${TRAFFIC_SHIELD_ACTIVE ? "false" : "true"};
for(var i=0;i<skip.length;i++){if(p===skip[i]||p.indexOf(skip[i]+"/")===0){inert=true;break;}}
var f=window.fetch;if(typeof f!=="function"||typeof Response!=="function"||typeof URL!=="function")return;
var json=function(o){return new Response(JSON.stringify(o),{status:200,headers:{"Content-Type":"application/json"}});};
var none=function(){return json({status:"none"});};
var host=function(h){return String(h||"").toLowerCase().replace(/^www\./,"");};
var hops=function(){try{var k="ts-hops",n=Number(sessionStorage.getItem(k)||0)+1;sessionStorage.setItem(k,String(n));return n;}catch(e){return 1;}};
window.fetch=function(u){
var url=typeof u==="string"?u:(u&&typeof u.url==="string"?u.url:String(u||""));
if(url.indexOf(API)!==0)return f.apply(window,arguments);
if(inert)return Promise.resolve(none());
return f.apply(window,arguments).then(function(r){return r.json();}).then(function(j){
if(!j||typeof j!=="object"||j.status==="error")return none();
if(j.method==="redirection"){
if(!j.url)return none();
var t=new URL(String(j.url),location.href);
if(host(t.host)===host(location.host)||hops()>3)return none();}
return json(j);}).catch(none);};
}catch(e){}})();`;

/** The inline guard; goes in <head>, ahead of everything. */
export function TrafficShieldGuard() {
  if (!TRAFFIC_SHIELD_ENABLED) return null;
  return <script dangerouslySetInnerHTML={{ __html: GUARD }} />;
}

/** The vendor's tag, exactly as the dashboard prints it; goes first in <body>. */
export function TrafficShieldTag() {
  if (!TRAFFIC_SHIELD_ENABLED) return null;
  return <div hidden dangerouslySetInnerHTML={{ __html: VENDOR_TAG }} />;
}
