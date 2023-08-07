import { defineNuxtPlugin, useRequestURL } from "#app";
import { useRouter } from "#imports";
import options from "#build/yandex-metrika.options.mjs";
export default defineNuxtPlugin(async (nuxtApp) => {
  const { id, hostToId, isDev, consoleLog, metrikaUrl, partytown, ...metrikaOptions } = await options();
  let metrikaId = id;
  console.log(hostToId);
  if (Object.entries(hostToId).length !== 0) {
    const host = useRequestURL().hostname;
    if (hostToId[host] !== void 0) {
      metrikaId = hostToId[host];
    }
  }
  let ready = false;
  useRouter().isReady().then(() => {
    ready = true;
  });
  function create() {
    if (!ready) {
      if (!isDev) {
        (function(m, e, t, r, i, k, a) {
          m[i] = m[i] || function() {
            (m[i].a = m[i].a || []).push(arguments);
          };
          m[i].l = 1 * /* @__PURE__ */ new Date();
          k = e.createElement(t);
          a = e.getElementsByTagName(t)[0];
          k.async = 1;
          k.src = r;
          a.parentNode.insertBefore(k, a);
        })(window, document, "script", metrikaUrl, "ym");
        ym(metrikaId, "init", metrikaOptions);
      }
      if (consoleLog) {
        console.log(`Yandex Metrika initialized in ${isDev ? "development" : "production"} mode. ID=${metrikaId}. Options: ${JSON.stringify(metrikaOptions)}`);
      }
      if (partytown && window) {
        window.dispatchEvent(new CustomEvent("ptupdate"));
      }
    }
    useRouter().afterEach((to, from) => {
      if (to.fullPath === from.fullPath) {
        return;
      }
      if (consoleLog) {
        console.log(`Yandex Metrika page hit: "${to.fullPath}" (referer="${from.fullPath}")`);
      }
      if (!isDev) {
        ym(metrikaId, "hit", to.fullPath, {
          referer: (
            /* basePath + */
            from.fullPath
          )
        });
      }
    });
  }
  if (window.ym === void 0) {
    create();
  }
  return {
    provide: {
      ym: (method, ...args) => {
        if (window.ym) {
          ym.apply(null, [metrikaId, method, ...args]);
          if (consoleLog) {
            if (args.length === 0) {
              console.log(`Yandex Metrika call: ym("${metrikaId}", "${method}")`);
            } else {
              const argumentsText = args.map((a) => JSON.stringify(a)).join(", ");
              console.log(`Yandex Metrika call: ym("${metrikaId}", "${method}", ${argumentsText})`);
            }
          }
        } else if (consoleLog) {
          if (args.length === 0) {
            console.log(`Yandex Metrika is not initialized! Failed to execute: ym("${metrikaId}", "${method}")`);
          } else {
            const argumentsText = args.map((a) => JSON.stringify(a)).join(", ");
            console.log(`Yandex Metrika is not initialized! Failed to execute: ym("${metrikaId}", "${method}", ${argumentsText})`);
          }
        }
      }
    }
  };
});
