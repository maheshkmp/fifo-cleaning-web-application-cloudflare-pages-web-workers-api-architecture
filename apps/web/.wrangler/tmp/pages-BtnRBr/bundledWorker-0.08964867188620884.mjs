var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../../../node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
if (!("__unenv__" in performance)) {
  const proto = Performance.prototype;
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (key !== "constructor" && !(key in performance)) {
      const desc = Object.getOwnPropertyDescriptor(proto, key);
      if (desc) {
        Object.defineProperty(performance, key, desc);
      }
    }
  }
}
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../../../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../../../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../../../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x2, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../../../node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// _worker.js/index.js
import("node:buffer").then(({ Buffer: Buffer2 }) => {
  globalThis.Buffer = Buffer2;
}).catch(() => null);
var __ALSes_PROMISE__ = import("node:async_hooks").then(({ AsyncLocalStorage }) => {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(envAsyncLocalStorage.getStore()), "ownKeys"),
        getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(envAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
        get: /* @__PURE__ */ __name((_2, property) => Reflect.get(envAsyncLocalStorage.getStore(), property), "get"),
        set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(envAsyncLocalStorage.getStore(), property, value), "set")
      }
    )
  };
  globalThis[/* @__PURE__ */ Symbol.for("__cloudflare-request-context__")] = new Proxy(
    {},
    {
      ownKeys: /* @__PURE__ */ __name(() => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()), "ownKeys"),
      getOwnPropertyDescriptor: /* @__PURE__ */ __name((_2, ...args) => Reflect.getOwnPropertyDescriptor(requestContextAsyncLocalStorage.getStore(), ...args), "getOwnPropertyDescriptor"),
      get: /* @__PURE__ */ __name((_2, property) => Reflect.get(requestContextAsyncLocalStorage.getStore(), property), "get"),
      set: /* @__PURE__ */ __name((_2, property, value) => Reflect.set(requestContextAsyncLocalStorage.getStore(), property, value), "set")
    }
  );
  return { envAsyncLocalStorage, requestContextAsyncLocalStorage };
}).catch(() => null);
var ae = Object.create;
var U = Object.defineProperty;
var ne = Object.getOwnPropertyDescriptor;
var re = Object.getOwnPropertyNames;
var ie = Object.getPrototypeOf;
var oe = Object.prototype.hasOwnProperty;
var N = /* @__PURE__ */ __name((e, t) => () => (e && (t = e(e = 0)), t), "N");
var V = /* @__PURE__ */ __name((e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), "V");
var ce = /* @__PURE__ */ __name((e, t, a, s) => {
  if (t && typeof t == "object" || typeof t == "function") for (let r of re(t)) !oe.call(e, r) && r !== a && U(e, r, { get: /* @__PURE__ */ __name(() => t[r], "get"), enumerable: !(s = ne(t, r)) || s.enumerable });
  return e;
}, "ce");
var q = /* @__PURE__ */ __name((e, t, a) => (a = e != null ? ae(ie(e)) : {}, ce(t || !e || !e.__esModule ? U(a, "default", { value: e, enumerable: true }) : a, e)), "q");
var m;
var l = N(() => {
  m = { collectedLocales: [] };
});
var f;
var u = N(() => {
  f = { version: 3, routes: { none: [{ src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308, continue: true }, { src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true, missing: [{ type: "header", key: "x-prerender-revalidate" }] }, { src: "^/500$", status: 500, continue: true }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(.*).json$", dest: "/$1", override: true, continue: true, has: [{ type: "header", key: "x-nextjs-data" }] }, { src: "^/index(?:/)?$", has: [{ type: "header", key: "x-nextjs-data" }], dest: "/", override: true, continue: true }, { continue: true, src: "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*))(\\.json)?[\\/#\\?]?$", missing: [{ type: "header", key: "x-prerender-revalidate", value: "4d7960f020d69291f737f03c28b1162f" }], middlewarePath: "src/middleware", middlewareRawSrc: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"], override: true }, { src: "^/$", has: [{ type: "header", key: "x-nextjs-data" }], dest: "/_next/data/nIN8lgR8Z8moTQ-J6EYKm/index.json", continue: true, override: true }, { src: "^/((?!_next/)(?:.*[^/]|.*))/?$", has: [{ type: "header", key: "x-nextjs-data" }], dest: "/_next/data/nIN8lgR8Z8moTQ-J6EYKm/$1.json", continue: true, override: true }, { src: "^/?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/index.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }, { src: "^/((?!.+\\.rsc).+?)(?:/)?$", has: [{ type: "header", key: "rsc", value: "1" }], dest: "/$1.rsc", headers: { vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" }, continue: true, override: true }], filesystem: [{ src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(.*).json$", dest: "/$1", continue: true, has: [{ type: "header", key: "x-nextjs-data" }] }, { src: "^/index(?:/)?$", has: [{ type: "header", key: "x-nextjs-data" }], dest: "/", continue: true }, { src: "^/index(\\.action|\\.rsc)$", dest: "/", continue: true }, { src: "^/\\.prefetch\\.rsc$", dest: "/__index.prefetch.rsc", check: true }, { src: "^/(.+)/\\.prefetch\\.rsc$", dest: "/$1.prefetch.rsc", check: true }, { src: "^/\\.rsc$", dest: "/index.rsc", check: true }, { src: "^/(.+)/\\.rsc$", dest: "/$1.rsc", check: true }], miss: [{ src: "^/_next/static/.+$", status: 404, check: true, dest: "/_next/static/not-found.txt", headers: { "content-type": "text/plain; charset=utf-8" } }], rewrite: [{ src: "^/$", has: [{ type: "header", key: "x-nextjs-data" }], dest: "/_next/data/nIN8lgR8Z8moTQ-J6EYKm/index.json", continue: true }, { src: "^/((?!_next/)(?:.*[^/]|.*))/?$", has: [{ type: "header", key: "x-nextjs-data" }], dest: "/_next/data/nIN8lgR8Z8moTQ-J6EYKm/$1.json", continue: true }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/api(?:/(?<nxtPpath>.+?))?(?:/)?.json$", dest: "/api/[[...path]]?nxtPpath=$nxtPpath" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)(?:/)?.json$", dest: "/_next/data/nIN8lgR8Z8moTQ-J6EYKm/[locale].json?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/about(?:/)?.json$", dest: "/[locale]/about?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/admin(?:/)?.json$", dest: "/[locale]/admin?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/admin/quote\\-requests/(?<nxtPid>[^/]+?)(?:/)?.json$", dest: "/[locale]/admin/quote-requests/[id]?nxtPlocale=$nxtPlocale&nxtPid=$nxtPid" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/contact(?:/)?.json$", dest: "/[locale]/contact?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/dashboard(?:/)?.json$", dest: "/[locale]/dashboard?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/dashboard/settings(?:/)?.json$", dest: "/[locale]/dashboard/settings?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/forgot\\-password(?:/)?.json$", dest: "/[locale]/forgot-password?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/privacy(?:/)?.json$", dest: "/[locale]/privacy?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/reset\\-password(?:/)?.json$", dest: "/[locale]/reset-password?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/services(?:/)?.json$", dest: "/[locale]/services?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/signin(?:/)?.json$", dest: "/[locale]/signin?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/signup(?:/)?.json$", dest: "/[locale]/signup?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/terms(?:/)?.json$", dest: "/[locale]/terms?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(?<nxtPlocale>[^/]+?)/verify\\-email(?:/)?.json$", dest: "/[locale]/verify-email?nxtPlocale=$nxtPlocale" }, { src: "^/api(?:/(?<nxtPpath>.+?))?(?:\\.rsc)(?:/)?$", dest: "/api/[[...path]].rsc?nxtPpath=$nxtPpath" }, { src: "^/api(?:/(?<nxtPpath>.+?))?(?:/)?$", dest: "/api/[[...path]]?nxtPpath=$nxtPpath" }, { src: "^/(?<nxtPlocale>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/[locale].rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)(?:/)?$", dest: "/[locale]?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/about(?:\\.rsc)(?:/)?$", dest: "/[locale]/about.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/about(?:/)?$", dest: "/[locale]/about?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/admin(?:\\.rsc)(?:/)?$", dest: "/[locale]/admin.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/admin(?:/)?$", dest: "/[locale]/admin?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/admin/quote\\-requests/(?<nxtPid>[^/]+?)(?:\\.rsc)(?:/)?$", dest: "/[locale]/admin/quote-requests/[id].rsc?nxtPlocale=$nxtPlocale&nxtPid=$nxtPid" }, { src: "^/(?<nxtPlocale>[^/]+?)/admin/quote\\-requests/(?<nxtPid>[^/]+?)(?:/)?$", dest: "/[locale]/admin/quote-requests/[id]?nxtPlocale=$nxtPlocale&nxtPid=$nxtPid" }, { src: "^/(?<nxtPlocale>[^/]+?)/contact(?:\\.rsc)(?:/)?$", dest: "/[locale]/contact.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/contact(?:/)?$", dest: "/[locale]/contact?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/dashboard(?:\\.rsc)(?:/)?$", dest: "/[locale]/dashboard.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/dashboard(?:/)?$", dest: "/[locale]/dashboard?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/dashboard/settings(?:\\.rsc)(?:/)?$", dest: "/[locale]/dashboard/settings.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/dashboard/settings(?:/)?$", dest: "/[locale]/dashboard/settings?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/forgot\\-password(?:\\.rsc)(?:/)?$", dest: "/[locale]/forgot-password.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/forgot\\-password(?:/)?$", dest: "/[locale]/forgot-password?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/privacy(?:\\.rsc)(?:/)?$", dest: "/[locale]/privacy.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/privacy(?:/)?$", dest: "/[locale]/privacy?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/reset\\-password(?:\\.rsc)(?:/)?$", dest: "/[locale]/reset-password.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/reset\\-password(?:/)?$", dest: "/[locale]/reset-password?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/services(?:\\.rsc)(?:/)?$", dest: "/[locale]/services.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/services(?:/)?$", dest: "/[locale]/services?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/signin(?:\\.rsc)(?:/)?$", dest: "/[locale]/signin.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/signin(?:/)?$", dest: "/[locale]/signin?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/signup(?:\\.rsc)(?:/)?$", dest: "/[locale]/signup.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/signup(?:/)?$", dest: "/[locale]/signup?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/terms(?:\\.rsc)(?:/)?$", dest: "/[locale]/terms.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/terms(?:/)?$", dest: "/[locale]/terms?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/verify\\-email(?:\\.rsc)(?:/)?$", dest: "/[locale]/verify-email.rsc?nxtPlocale=$nxtPlocale" }, { src: "^/(?<nxtPlocale>[^/]+?)/verify\\-email(?:/)?$", dest: "/[locale]/verify-email?nxtPlocale=$nxtPlocale" }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(.*).json$", headers: { "x-nextjs-matched-path": "/$1" }, continue: true, override: true }, { src: "^/_next/data/nIN8lgR8Z8moTQ\\-J6EYKm/(.*).json$", dest: "__next_data_catchall" }], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|nIN8lgR8Z8moTQ\\-J6EYKm)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }, { src: "^/index(?:/)?$", headers: { "x-matched-path": "/" }, continue: true, important: true }, { src: "^/((?!index$).*?)(?:/)?$", headers: { "x-matched-path": "/$1" }, continue: true, important: true }], error: [{ src: "^/.*$", dest: "/404", status: 404 }, { src: "^/.*$", dest: "/500", status: 500 }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 32, 48, 64, 96, 128, 256, 384], qualities: [75], remotePatterns: [], localPatterns: [{ pathname: "^(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/?)$", search: "" }], minimumCacheTTL: 14400, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "attachment" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "500.html": { path: "500", contentType: "text/html; charset=utf-8" }, "404.rsc.json": { path: "404.rsc", contentType: "application/json" }, "500.rsc.json": { path: "500.rsc", contentType: "application/json" }, "__next_data_catchall.json": { path: "__next_data_catchall", contentType: "application/json" }, "_next/static/not-found.txt": { contentType: "text/plain" } }, framework: { version: "16.0.8" }, crons: [] };
});
var _;
var p = N(() => {
  _ = { "/404.html": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc.json": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.html": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500.rsc.json": { type: "override", path: "/500.rsc.json", headers: { "content-type": "application/json" } }, "/__next_data_catchall.json": { type: "override", path: "/__next_data_catchall.json", headers: { "content-type": "application/json" } }, "/_next/static/chunks/165-9fdc2c22ca526019.js": { type: "static" }, "/_next/static/chunks/206-ea962a9c70e71dbb.js": { type: "static" }, "/_next/static/chunks/275-5cf2c5cbcb721fd9.js": { type: "static" }, "/_next/static/chunks/29-eeac41c4d1b0d3ce.js": { type: "static" }, "/_next/static/chunks/290-d9fceb5b6dcb2a98.js": { type: "static" }, "/_next/static/chunks/517-0ed0bfb65008389d.js": { type: "static" }, "/_next/static/chunks/612-16198980f0736e12.js": { type: "static" }, "/_next/static/chunks/729-0e24bb4b3025ad5d.js": { type: "static" }, "/_next/static/chunks/825-4b078d40491f63e7.js": { type: "static" }, "/_next/static/chunks/876-060b165a98fe203a.js": { type: "static" }, "/_next/static/chunks/87c73c54-1c02a77c185d523a.js": { type: "static" }, "/_next/static/chunks/971-3d83feaefb6b3452.js": { type: "static" }, "/_next/static/chunks/app/[locale]/(auth)/forgot-password/page-b98afffdd1d8ce7a.js": { type: "static" }, "/_next/static/chunks/app/[locale]/(auth)/layout-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/app/[locale]/(auth)/reset-password/page-9e242bce995ec8b7.js": { type: "static" }, "/_next/static/chunks/app/[locale]/(auth)/signin/page-3db633b42e684f4c.js": { type: "static" }, "/_next/static/chunks/app/[locale]/(auth)/signup/page-bc7db9b0ebaacb73.js": { type: "static" }, "/_next/static/chunks/app/[locale]/(auth)/verify-email/page-a1bb32252a6660ef.js": { type: "static" }, "/_next/static/chunks/app/[locale]/about/page-16c1c57a83563952.js": { type: "static" }, "/_next/static/chunks/app/[locale]/admin/page-07df9bff331e48bd.js": { type: "static" }, "/_next/static/chunks/app/[locale]/admin/quote-requests/[id]/page-fbb5fc77e6defa56.js": { type: "static" }, "/_next/static/chunks/app/[locale]/contact/page-b8da0868a2994603.js": { type: "static" }, "/_next/static/chunks/app/[locale]/dashboard/page-16c1c57a83563952.js": { type: "static" }, "/_next/static/chunks/app/[locale]/dashboard/settings/page-d2c9825c7697707d.js": { type: "static" }, "/_next/static/chunks/app/[locale]/layout-57948a99eab1fae9.js": { type: "static" }, "/_next/static/chunks/app/[locale]/page-b1214398d375021a.js": { type: "static" }, "/_next/static/chunks/app/[locale]/privacy/page-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/app/[locale]/services/page-16c1c57a83563952.js": { type: "static" }, "/_next/static/chunks/app/[locale]/terms/page-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/app/_global-error/page-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-f6dea6c8075d27e2.js": { type: "static" }, "/_next/static/chunks/app/api/[[...path]]/route-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/app/layout-5a328d0925495626.js": { type: "static" }, "/_next/static/chunks/framework-599d067b62625b4f.js": { type: "static" }, "/_next/static/chunks/main-app-657d0733b35291d6.js": { type: "static" }, "/_next/static/chunks/main-db607b914d0b720c.js": { type: "static" }, "/_next/static/chunks/next/dist/client/components/builtin/app-error-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/next/dist/client/components/builtin/forbidden-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/next/dist/client/components/builtin/global-error-bc47423c326f8f9c.js": { type: "static" }, "/_next/static/chunks/next/dist/client/components/builtin/not-found-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-5df007e7af7710d7.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-1feb86cb3cc7171d.js": { type: "static" }, "/_next/static/css/10d1ea4442c393ea.css": { type: "static" }, "/_next/static/css/6e6a7489b08e19c8.css": { type: "static" }, "/_next/static/media/07fccecd6728972a-s.woff2": { type: "static" }, "/_next/static/media/0b0e51bc7f468158-s.p.woff2": { type: "static" }, "/_next/static/media/0e9d289c6eb42bf7-s.p.woff2": { type: "static" }, "/_next/static/media/13971731025ec697-s.p.woff2": { type: "static" }, "/_next/static/media/162bae04ee86dd69-s.woff2": { type: "static" }, "/_next/static/media/19cfc7226ec3afaa-s.woff2": { type: "static" }, "/_next/static/media/1ef03937eeee17bd-s.woff2": { type: "static" }, "/_next/static/media/21350d82a1f187e9-s.woff2": { type: "static" }, "/_next/static/media/325259dae461ae2a-s.woff2": { type: "static" }, "/_next/static/media/35f3de0ebb1cfc70-s.woff2": { type: "static" }, "/_next/static/media/36966cca54120369-s.p.woff2": { type: "static" }, "/_next/static/media/424a6f0e872a6c22-s.woff2": { type: "static" }, "/_next/static/media/46bdd75a3ff56824-s.p.woff2": { type: "static" }, "/_next/static/media/486fce9f36bc8f45-s.woff2": { type: "static" }, "/_next/static/media/4de9aebd5c5f8029-s.woff2": { type: "static" }, "/_next/static/media/4e063e4da012536e-s.woff2": { type: "static" }, "/_next/static/media/536d9d896eaf4f3f-s.woff2": { type: "static" }, "/_next/static/media/5cde346dea4ae80b-s.woff2": { type: "static" }, "/_next/static/media/5ece437c7024c161-s.woff2": { type: "static" }, "/_next/static/media/67d172d8d0152ee1-s.woff2": { type: "static" }, "/_next/static/media/6c32053678f0295c-s.p.woff2": { type: "static" }, "/_next/static/media/6d895190e5187dff-s.woff2": { type: "static" }, "/_next/static/media/759592d40bc87463-s.woff2": { type: "static" }, "/_next/static/media/7ab938503e4547a1-s.woff2": { type: "static" }, "/_next/static/media/87069f06a4f1ee13-s.p.woff2": { type: "static" }, "/_next/static/media/870840a80857d4d7-s.woff2": { type: "static" }, "/_next/static/media/8e9860b6e62d6359-s.woff2": { type: "static" }, "/_next/static/media/9940be41d763cd40-s.woff2": { type: "static" }, "/_next/static/media/9cc5b37ab1350db7-s.p.woff2": { type: "static" }, "/_next/static/media/a736042c9ebfac04-s.p.woff2": { type: "static" }, "/_next/static/media/aa9a30d6c0ad190a-s.woff2": { type: "static" }, "/_next/static/media/b7387a63dd068245-s.woff2": { type: "static" }, "/_next/static/media/ba9851c3c22cd980-s.woff2": { type: "static" }, "/_next/static/media/be955174636e5369-s.p.woff2": { type: "static" }, "/_next/static/media/c5fe6dc8356a8c31-s.woff2": { type: "static" }, "/_next/static/media/d0204c37d9a66afa-s.woff2": { type: "static" }, "/_next/static/media/d121c670c7edb705-s.p.woff2": { type: "static" }, "/_next/static/media/d8f3713f2c4f699b-s.woff2": { type: "static" }, "/_next/static/media/dad5af6a451969b9-s.woff2": { type: "static" }, "/_next/static/media/dd053ec84d009e81-s.p.woff2": { type: "static" }, "/_next/static/media/df0a9ae256c0569c-s.woff2": { type: "static" }, "/_next/static/media/e1aab0933260df4d-s.woff2": { type: "static" }, "/_next/static/media/e44cdba7d0878bc5-s.woff2": { type: "static" }, "/_next/static/media/e4af272ccee01ff0-s.p.woff2": { type: "static" }, "/_next/static/media/e6099e249fd938cc-s.p.woff2": { type: "static" }, "/_next/static/media/f751862dd005bbab-s.woff2": { type: "static" }, "/_next/static/nIN8lgR8Z8moTQ-J6EYKm/_buildManifest.js": { type: "static" }, "/_next/static/nIN8lgR8Z8moTQ-J6EYKm/_ssgManifest.js": { type: "static" }, "/_next/static/not-found.txt": { type: "static" }, "/file.svg": { type: "static" }, "/globe.svg": { type: "static" }, "/icon.svg": { type: "static" }, "/next.svg": { type: "static" }, "/og.jpg": { type: "static" }, "/pdf.worker.min.mjs": { type: "static" }, "/site.webmanifest": { type: "static" }, "/vercel.svg": { type: "static" }, "/window.svg": { type: "static" }, "/[locale]/about": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/about.func.js" }, "/[locale]/about.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/about.func.js" }, "/[locale]/admin/quote-requests/[id]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/admin/quote-requests/[id].func.js" }, "/[locale]/admin/quote-requests/[id].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/admin/quote-requests/[id].func.js" }, "/[locale]/admin": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/admin.func.js" }, "/[locale]/admin.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/admin.func.js" }, "/[locale]/contact": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/contact.func.js" }, "/[locale]/contact.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/contact.func.js" }, "/[locale]/dashboard/settings": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/dashboard/settings.func.js" }, "/[locale]/dashboard/settings.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/dashboard/settings.func.js" }, "/[locale]/dashboard": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/dashboard.func.js" }, "/[locale]/dashboard.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/dashboard.func.js" }, "/[locale]/forgot-password": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/forgot-password.func.js" }, "/[locale]/forgot-password.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/forgot-password.func.js" }, "/[locale]/privacy": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/privacy.func.js" }, "/[locale]/privacy.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/privacy.func.js" }, "/[locale]/reset-password": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/reset-password.func.js" }, "/[locale]/reset-password.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/reset-password.func.js" }, "/[locale]/services": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/services.func.js" }, "/[locale]/services.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/services.func.js" }, "/[locale]/signin": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/signin.func.js" }, "/[locale]/signin.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/signin.func.js" }, "/[locale]/signup": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/signup.func.js" }, "/[locale]/signup.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/signup.func.js" }, "/[locale]/terms": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/terms.func.js" }, "/[locale]/terms.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/terms.func.js" }, "/[locale]/verify-email": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/verify-email.func.js" }, "/[locale]/verify-email.rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/[locale]/verify-email.func.js" }, "/api/[[...path]]": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/[[...path]].func.js" }, "/api/[[...path]].rsc": { type: "function", entrypoint: "__next-on-pages-dist__/functions/api/[[...path]].func.js" }, "/404": { type: "override", path: "/404.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/500": { type: "override", path: "/500.html", headers: { "content-type": "text/html; charset=utf-8" } }, "/404.rsc": { type: "override", path: "/404.rsc.json", headers: { "content-type": "application/json" } }, "/500.rsc": { type: "override", path: "/500.rsc.json", headers: { "content-type": "application/json" } }, "/__next_data_catchall": { type: "override", path: "/__next_data_catchall.json", headers: { "content-type": "application/json" } }, "/_global-error.html": { type: "override", path: "/_global-error.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_global-error": { type: "override", path: "/_global-error.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_global-error.rsc": { type: "override", path: "/_global-error.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_global-error/layout,_N_T_/_global-error/page,_N_T_/_global-error", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/_not-found.html": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found": { type: "override", path: "/_not-found.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/_not-found.rsc": { type: "override", path: "/_not-found.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/en.html": { type: "override", path: "/en.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/en", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/en": { type: "override", path: "/en.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/en", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/en.rsc": { type: "override", path: "/en.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/en", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "/favicon.ico": { type: "override", path: "/favicon.ico", headers: { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/sv.html": { type: "override", path: "/sv.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/sv", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/sv": { type: "override", path: "/sv.html", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/sv", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch" } }, "/sv.rsc": { type: "override", path: "/sv.rsc", headers: { "x-nextjs-stale-time": "300", "x-nextjs-prerender": "1", "x-next-cache-tags": "_N_T_/layout,_N_T_/[locale]/layout,_N_T_/[locale]/page,_N_T_/sv", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch", "content-type": "text/x-component" } }, "src/middleware": { type: "middleware", entrypoint: "__next-on-pages-dist__/functions/src/middleware.func.js" } };
});
var F = V((ze, $) => {
  "use strict";
  l();
  u();
  p();
  function w(e, t) {
    e = String(e || "").trim();
    let a = e, s, r = "";
    if (/^[^a-zA-Z\\\s]/.test(e)) {
      s = e[0];
      let o = e.lastIndexOf(s);
      r += e.substring(o + 1), e = e.substring(1, o);
    }
    let n = 0;
    return e = pe(e, (o) => {
      if (/^\(\?[P<']/.test(o)) {
        let c = /^\(\?P?[<']([^>']+)[>']/.exec(o);
        if (!c) throw new Error(`Failed to extract named captures from ${JSON.stringify(o)}`);
        let d = o.substring(c[0].length, o.length - 1);
        return t && (t[n] = c[1]), n++, `(${d})`;
      }
      return o.substring(0, 3) === "(?:" || n++, o;
    }), e = e.replace(/\[:([^:]+):\]/g, (o, c) => w.characterClasses[c] || o), new w.PCRE(e, r, a, r, s);
  }
  __name(w, "w");
  function pe(e, t) {
    let a = 0, s = 0, r = false;
    for (let i = 0; i < e.length; i++) {
      let n = e[i];
      if (r) {
        r = false;
        continue;
      }
      switch (n) {
        case "(":
          s === 0 && (a = i), s++;
          break;
        case ")":
          if (s > 0 && (s--, s === 0)) {
            let o = i + 1, c = a === 0 ? "" : e.substring(0, a), d = e.substring(o), h = String(t(e.substring(a, o)));
            e = c + h + d, i = a;
          }
          break;
        case "\\":
          r = true;
          break;
        default:
          break;
      }
    }
    return e;
  }
  __name(pe, "pe");
  (function(e) {
    class t extends RegExp {
      static {
        __name(this, "t");
      }
      constructor(s, r, i, n, o) {
        super(s, r), this.pcrePattern = i, this.pcreFlags = n, this.delimiter = o;
      }
    }
    e.PCRE = t, e.characterClasses = { alnum: "[A-Za-z0-9]", word: "[A-Za-z0-9_]", alpha: "[A-Za-z]", blank: "[ \\t]", cntrl: "[\\x00-\\x1F\\x7F]", digit: "\\d", graph: "[\\x21-\\x7E]", lower: "[a-z]", print: "[\\x20-\\x7E]", punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]", space: "\\s", upper: "[A-Z]", xdigit: "[A-Fa-f0-9]" };
  })(w || (w = {}));
  w.prototype = w.PCRE.prototype;
  $.exports = w;
});
var Q = V((H) => {
  "use strict";
  l();
  u();
  p();
  H.parse = ve;
  H.serialize = Pe;
  var Re = Object.prototype.toString, C = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
  function ve(e, t) {
    if (typeof e != "string") throw new TypeError("argument str must be a string");
    for (var a = {}, s = t || {}, r = s.decode || Se, i = 0; i < e.length; ) {
      var n = e.indexOf("=", i);
      if (n === -1) break;
      var o = e.indexOf(";", i);
      if (o === -1) o = e.length;
      else if (o < n) {
        i = e.lastIndexOf(";", n - 1) + 1;
        continue;
      }
      var c = e.slice(i, n).trim();
      if (a[c] === void 0) {
        var d = e.slice(n + 1, o).trim();
        d.charCodeAt(0) === 34 && (d = d.slice(1, -1)), a[c] = je(d, r);
      }
      i = o + 1;
    }
    return a;
  }
  __name(ve, "ve");
  function Pe(e, t, a) {
    var s = a || {}, r = s.encode || ke;
    if (typeof r != "function") throw new TypeError("option encode is invalid");
    if (!C.test(e)) throw new TypeError("argument name is invalid");
    var i = r(t);
    if (i && !C.test(i)) throw new TypeError("argument val is invalid");
    var n = e + "=" + i;
    if (s.maxAge != null) {
      var o = s.maxAge - 0;
      if (isNaN(o) || !isFinite(o)) throw new TypeError("option maxAge is invalid");
      n += "; Max-Age=" + Math.floor(o);
    }
    if (s.domain) {
      if (!C.test(s.domain)) throw new TypeError("option domain is invalid");
      n += "; Domain=" + s.domain;
    }
    if (s.path) {
      if (!C.test(s.path)) throw new TypeError("option path is invalid");
      n += "; Path=" + s.path;
    }
    if (s.expires) {
      var c = s.expires;
      if (!Te(c) || isNaN(c.valueOf())) throw new TypeError("option expires is invalid");
      n += "; Expires=" + c.toUTCString();
    }
    if (s.httpOnly && (n += "; HttpOnly"), s.secure && (n += "; Secure"), s.priority) {
      var d = typeof s.priority == "string" ? s.priority.toLowerCase() : s.priority;
      switch (d) {
        case "low":
          n += "; Priority=Low";
          break;
        case "medium":
          n += "; Priority=Medium";
          break;
        case "high":
          n += "; Priority=High";
          break;
        default:
          throw new TypeError("option priority is invalid");
      }
    }
    if (s.sameSite) {
      var h = typeof s.sameSite == "string" ? s.sameSite.toLowerCase() : s.sameSite;
      switch (h) {
        case true:
          n += "; SameSite=Strict";
          break;
        case "lax":
          n += "; SameSite=Lax";
          break;
        case "strict":
          n += "; SameSite=Strict";
          break;
        case "none":
          n += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return n;
  }
  __name(Pe, "Pe");
  function Se(e) {
    return e.indexOf("%") !== -1 ? decodeURIComponent(e) : e;
  }
  __name(Se, "Se");
  function ke(e) {
    return encodeURIComponent(e);
  }
  __name(ke, "ke");
  function Te(e) {
    return Re.call(e) === "[object Date]" || e instanceof Date;
  }
  __name(Te, "Te");
  function je(e, t) {
    try {
      return t(e);
    } catch {
      return e;
    }
  }
  __name(je, "je");
});
l();
u();
p();
l();
u();
p();
l();
u();
p();
var R = "INTERNAL_SUSPENSE_CACHE_HOSTNAME.local";
l();
u();
p();
l();
u();
p();
l();
u();
p();
l();
u();
p();
var D = q(F());
function k(e, t, a) {
  if (t == null) return { match: null, captureGroupKeys: [] };
  let s = a ? "" : "i", r = [];
  return { match: (0, D.default)(`%${e}%${s}`, r).exec(t), captureGroupKeys: r };
}
__name(k, "k");
function v(e, t, a, { namedOnly: s } = {}) {
  return e.replace(/\$([a-zA-Z0-9_]+)/g, (r, i) => {
    let n = a.indexOf(i);
    return s && n === -1 ? r : (n === -1 ? t[parseInt(i, 10)] : t[n + 1]) || "";
  });
}
__name(v, "v");
function I(e, { url: t, cookies: a, headers: s, routeDest: r }) {
  switch (e.type) {
    case "host":
      return { valid: t.hostname === e.value };
    case "header":
      return e.value !== void 0 ? M(e.value, s.get(e.key), r) : { valid: s.has(e.key) };
    case "cookie": {
      let i = a[e.key];
      return i && e.value !== void 0 ? M(e.value, i, r) : { valid: i !== void 0 };
    }
    case "query":
      return e.value !== void 0 ? M(e.value, t.searchParams.get(e.key), r) : { valid: t.searchParams.has(e.key) };
  }
}
__name(I, "I");
function M(e, t, a) {
  let { match: s, captureGroupKeys: r } = k(e, t);
  return a && s && r.length ? { valid: !!s, newRouteDest: v(a, s, r, { namedOnly: true }) } : { valid: !!s };
}
__name(M, "M");
l();
u();
p();
function B(e) {
  let t = new Headers(e.headers);
  return e.cf && (t.set("x-vercel-ip-city", encodeURIComponent(e.cf.city)), t.set("x-vercel-ip-country", e.cf.country), t.set("x-vercel-ip-country-region", e.cf.regionCode), t.set("x-vercel-ip-latitude", e.cf.latitude), t.set("x-vercel-ip-longitude", e.cf.longitude)), t.set("x-vercel-sc-host", R), new Request(e, { headers: t });
}
__name(B, "B");
l();
u();
p();
function g(e, t, a) {
  let s = t instanceof Headers ? t.entries() : Object.entries(t);
  for (let [r, i] of s) {
    let n = r.toLowerCase(), o = a?.match ? v(i, a.match, a.captureGroupKeys) : i;
    n === "set-cookie" ? e.append(n, o) : e.set(n, o);
  }
}
__name(g, "g");
function P(e) {
  return /^https?:\/\//.test(e);
}
__name(P, "P");
function x(e, t) {
  for (let [a, s] of t.entries()) {
    let r = /^nxtP(.+)$/.exec(a), i = /^nxtI(.+)$/.exec(a);
    r?.[1] ? (e.set(a, s), e.set(r[1], s)) : i?.[1] ? e.set(i[1], s.replace(/(\(\.+\))+/, "")) : (!e.has(a) || !!s && !e.getAll(a).includes(s)) && e.append(a, s);
  }
}
__name(x, "x");
function A(e, t) {
  let a = new URL(t, e.url);
  return x(a.searchParams, new URL(e.url).searchParams), a.pathname = a.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, ""), new Request(a, e);
}
__name(A, "A");
function S(e) {
  return new Response(e.body, e);
}
__name(S, "S");
function L(e) {
  return e.split(",").map((t) => {
    let [a, s] = t.split(";"), r = parseFloat((s ?? "q=1").replace(/q *= */gi, ""));
    return [a.trim(), isNaN(r) ? 1 : r];
  }).sort((t, a) => a[1] - t[1]).map(([t]) => t === "*" || t === "" ? [] : t).flat();
}
__name(L, "L");
l();
u();
p();
function O(e) {
  switch (e) {
    case "none":
      return "filesystem";
    case "filesystem":
      return "rewrite";
    case "rewrite":
      return "resource";
    case "resource":
      return "miss";
    default:
      return "miss";
  }
}
__name(O, "O");
async function T(e, { request: t, assetsFetcher: a, ctx: s }, { path: r, searchParams: i }) {
  let n, o = new URL(t.url);
  x(o.searchParams, i);
  let c = new Request(o, t);
  try {
    switch (e?.type) {
      case "function":
      case "middleware": {
        let d = await import(e.entrypoint);
        try {
          n = await d.default(c, s);
        } catch (h) {
          let y = h;
          throw y.name === "TypeError" && y.message.endsWith("default is not a function") ? new Error(`An error occurred while evaluating the target edge function (${e.entrypoint})`) : h;
        }
        break;
      }
      case "override": {
        n = S(await a.fetch(A(c, e.path ?? r))), e.headers && g(n.headers, e.headers);
        break;
      }
      case "static": {
        n = await a.fetch(A(c, r));
        break;
      }
      default:
        n = new Response("Not Found", { status: 404 });
    }
  } catch (d) {
    return console.error(d), new Response("Internal Server Error", { status: 500 });
  }
  return S(n);
}
__name(T, "T");
function G(e, t) {
  let a = "^//?(?:", s = ")/(.*)$";
  return !e.startsWith(a) || !e.endsWith(s) ? false : e.slice(a.length, -s.length).split("|").every((i) => t.has(i));
}
__name(G, "G");
l();
u();
p();
function de(e, { protocol: t, hostname: a, port: s, pathname: r }) {
  return !(t && e.protocol.replace(/:$/, "") !== t || !new RegExp(a).test(e.hostname) || s && !new RegExp(s).test(e.port) || r && !new RegExp(r).test(e.pathname));
}
__name(de, "de");
function he(e, t) {
  if (e.method !== "GET") return;
  let { origin: a, searchParams: s } = new URL(e.url), r = s.get("url"), i = Number.parseInt(s.get("w") ?? "", 10), n = Number.parseInt(s.get("q") ?? "75", 10);
  if (!r || Number.isNaN(i) || Number.isNaN(n) || !t?.sizes?.includes(i) || n < 0 || n > 100) return;
  let o = new URL(r, a);
  if (o.pathname.endsWith(".svg") && !t?.dangerouslyAllowSVG) return;
  let c = r.startsWith("//"), d = r.startsWith("/") && !c;
  if (!d && !t?.domains?.includes(o.hostname) && !t?.remotePatterns?.find((b) => de(o, b))) return;
  let h = e.headers.get("Accept") ?? "", y = t?.formats?.find((b) => h.includes(b))?.replace("image/", "");
  return { isRelative: d, imageUrl: o, options: { width: i, quality: n, format: y } };
}
__name(he, "he");
function fe(e, t, a) {
  let s = new Headers();
  if (a?.contentSecurityPolicy && s.set("Content-Security-Policy", a.contentSecurityPolicy), a?.contentDispositionType) {
    let i = t.pathname.split("/").pop(), n = i ? `${a.contentDispositionType}; filename="${i}"` : a.contentDispositionType;
    s.set("Content-Disposition", n);
  }
  e.headers.has("Cache-Control") || s.set("Cache-Control", `public, max-age=${a?.minimumCacheTTL ?? 60}`);
  let r = S(e);
  return g(r.headers, s), r;
}
__name(fe, "fe");
async function K(e, { buildOutput: t, assetsFetcher: a, imagesConfig: s }) {
  let r = he(e, s);
  if (!r) return new Response("Invalid image resizing request", { status: 400 });
  let { isRelative: i, imageUrl: n } = r, c = await (i && n.pathname in t ? a.fetch.bind(a) : fetch)(n);
  return fe(c, n, s);
}
__name(K, "K");
l();
u();
p();
l();
u();
p();
l();
u();
p();
async function j(e) {
  return import(e);
}
__name(j, "j");
var _e = "x-vercel-cache-tags";
var me = "x-next-cache-soft-tags";
var ye = /* @__PURE__ */ Symbol.for("__cloudflare-request-context__");
async function J(e) {
  let t = `https://${R}/v1/suspense-cache/`;
  if (!e.url.startsWith(t)) return null;
  try {
    let a = new URL(e.url), s = await ge();
    if (a.pathname === "/v1/suspense-cache/revalidate") {
      let i = a.searchParams.get("tags")?.split(",") ?? [];
      for (let n of i) await s.revalidateTag(n);
      return new Response(null, { status: 200 });
    }
    let r = a.pathname.replace("/v1/suspense-cache/", "");
    if (!r.length) return new Response("Invalid cache key", { status: 400 });
    switch (e.method) {
      case "GET": {
        let i = z(e, me), n = await s.get(r, { softTags: i });
        return n ? new Response(JSON.stringify(n.value), { status: 200, headers: { "Content-Type": "application/json", "x-vercel-cache-state": "fresh", age: `${(Date.now() - (n.lastModified ?? Date.now())) / 1e3}` } }) : new Response(null, { status: 404 });
      }
      case "POST": {
        let i = globalThis[ye], n = /* @__PURE__ */ __name(async () => {
          let o = await e.json();
          o.data.tags === void 0 && (o.tags ??= z(e, _e) ?? []), await s.set(r, o);
        }, "n");
        return i ? i.ctx.waitUntil(n()) : await n(), new Response(null, { status: 200 });
      }
      default:
        return new Response(null, { status: 405 });
    }
  } catch (a) {
    return console.error(a), new Response("Error handling cache request", { status: 500 });
  }
}
__name(J, "J");
async function ge() {
  return process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE ? W("kv") : W("cache-api");
}
__name(ge, "ge");
async function W(e) {
  let t = `./__next-on-pages-dist__/cache/${e}.js`, a = await j(t);
  return new a.default();
}
__name(W, "W");
function z(e, t) {
  return e.headers.get(t)?.split(",")?.filter(Boolean);
}
__name(z, "z");
function X() {
  globalThis[Z] || (xe(), globalThis[Z] = true);
}
__name(X, "X");
function xe() {
  let e = globalThis.fetch;
  globalThis.fetch = async (...t) => {
    let a = new Request(...t), s = await we(a);
    return s || (s = await J(a), s) ? s : (be(a), e(a));
  };
}
__name(xe, "xe");
async function we(e) {
  if (e.url.startsWith("blob:")) try {
    let a = `./__next-on-pages-dist__/assets/${new URL(e.url).pathname}.bin`, s = (await j(a)).default, r = { async arrayBuffer() {
      return s;
    }, get body() {
      return new ReadableStream({ start(i) {
        let n = Buffer.from(s);
        i.enqueue(n), i.close();
      } });
    }, async text() {
      return Buffer.from(s).toString();
    }, async json() {
      let i = Buffer.from(s);
      return JSON.stringify(i.toString());
    }, async blob() {
      return new Blob(s);
    } };
    return r.clone = () => ({ ...r }), r;
  } catch {
  }
  return null;
}
__name(we, "we");
function be(e) {
  e.headers.has("user-agent") || e.headers.set("user-agent", "Next.js Middleware");
}
__name(be, "be");
var Z = /* @__PURE__ */ Symbol.for("next-on-pages fetch patch");
l();
u();
p();
var Y = q(Q());
var E = class {
  static {
    __name(this, "E");
  }
  constructor(t, a, s, r, i) {
    this.routes = t;
    this.output = a;
    this.reqCtx = s;
    this.url = new URL(s.request.url), this.cookies = (0, Y.parse)(s.request.headers.get("cookie") || ""), this.path = this.url.pathname || "/", this.headers = { normal: new Headers(), important: new Headers() }, this.searchParams = new URLSearchParams(), x(this.searchParams, this.url.searchParams), this.checkPhaseCounter = 0, this.middlewareInvoked = [], this.wildcardMatch = i?.find((n) => n.domain === this.url.hostname), this.locales = new Set(r.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(t, { checkStatus: a, checkIntercept: s }) {
    let r = k(t.src, this.path, t.caseSensitive);
    if (!r.match || t.methods && !t.methods.map((n) => n.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) return;
    let i = { url: this.url, cookies: this.cookies, headers: this.reqCtx.request.headers, routeDest: t.dest };
    if (!t.has?.find((n) => {
      let o = I(n, i);
      return o.newRouteDest && (i.routeDest = o.newRouteDest), !o.valid;
    }) && !t.missing?.find((n) => I(n, i).valid) && !(a && t.status !== this.status)) {
      if (s && t.dest) {
        let n = /\/(\(\.+\))+/, o = n.test(t.dest), c = n.test(this.path);
        if (o && !c) return;
      }
      return { routeMatch: r, routeDest: i.routeDest };
    }
  }
  processMiddlewareResp(t) {
    let a = "x-middleware-override-headers", s = t.headers.get(a);
    if (s) {
      let c = new Set(s.split(",").map((d) => d.trim()));
      for (let d of c.keys()) {
        let h = `x-middleware-request-${d}`, y = t.headers.get(h);
        this.reqCtx.request.headers.get(d) !== y && (y ? this.reqCtx.request.headers.set(d, y) : this.reqCtx.request.headers.delete(d)), t.headers.delete(h);
      }
      t.headers.delete(a);
    }
    let r = "x-middleware-rewrite", i = t.headers.get(r);
    if (i) {
      let c = new URL(i, this.url), d = this.url.hostname !== c.hostname;
      this.path = d ? `${c}` : c.pathname, x(this.searchParams, c.searchParams), t.headers.delete(r);
    }
    let n = "x-middleware-next";
    t.headers.get(n) ? t.headers.delete(n) : !i && !t.headers.has("location") ? (this.body = t.body, this.status = t.status) : t.headers.has("location") && t.status >= 300 && t.status < 400 && (this.status = t.status), g(this.reqCtx.request.headers, t.headers), g(this.headers.normal, t.headers), this.headers.middlewareLocation = t.headers.get("location");
  }
  async runRouteMiddleware(t) {
    if (!t) return true;
    let a = t && this.output[t];
    if (!a || a.type !== "middleware") return this.status = 500, false;
    let s = await T(a, this.reqCtx, { path: this.path, searchParams: this.searchParams, headers: this.headers, status: this.status });
    return this.middlewareInvoked.push(t), s.status === 500 ? (this.status = s.status, false) : (this.processMiddlewareResp(s), true);
  }
  applyRouteOverrides(t) {
    !t.override || (this.status = void 0, this.headers.normal = new Headers(), this.headers.important = new Headers());
  }
  applyRouteHeaders(t, a, s) {
    !t.headers || (g(this.headers.normal, t.headers, { match: a, captureGroupKeys: s }), t.important && g(this.headers.important, t.headers, { match: a, captureGroupKeys: s }));
  }
  applyRouteStatus(t) {
    !t.status || (this.status = t.status);
  }
  applyRouteDest(t, a, s) {
    if (!t.dest) return this.path;
    let r = this.path, i = t.dest;
    this.wildcardMatch && /\$wildcard/.test(i) && (i = i.replace(/\$wildcard/g, this.wildcardMatch.value)), this.path = v(i, a, s);
    let n = /\/index\.rsc$/i.test(this.path), o = /^\/(?:index)?$/i.test(r), c = /^\/__index\.prefetch\.rsc$/i.test(r);
    n && !o && !c && (this.path = r);
    let d = /\.rsc$/i.test(this.path), h = /\.prefetch\.rsc$/i.test(this.path), y = this.path in this.output;
    d && !h && !y && (this.path = this.path.replace(/\.rsc/i, ""));
    let b = new URL(this.path, this.url);
    return x(this.searchParams, b.searchParams), P(this.path) || (this.path = b.pathname), r;
  }
  applyLocaleRedirects(t) {
    if (!t.locale?.redirect || !/^\^(.)*$/.test(t.src) && t.src !== this.path || this.headers.normal.has("location")) return;
    let { locale: { redirect: s, cookie: r } } = t, i = r && this.cookies[r], n = L(i ?? ""), o = L(this.reqCtx.request.headers.get("accept-language") ?? ""), h = [...n, ...o].map((y) => s[y]).filter(Boolean)[0];
    if (h) {
      !this.path.startsWith(h) && (this.headers.normal.set("location", h), this.status = 307);
      return;
    }
  }
  getLocaleFriendlyRoute(t, a) {
    return !this.locales || a !== "miss" ? t : G(t.src, this.locales) ? { ...t, src: t.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$") } : t;
  }
  async checkRoute(t, a) {
    let s = this.getLocaleFriendlyRoute(a, t), { routeMatch: r, routeDest: i } = this.checkRouteMatch(s, { checkStatus: t === "error", checkIntercept: t === "rewrite" }) ?? {}, n = { ...s, dest: i };
    if (!r?.match || n.middlewarePath && this.middlewareInvoked.includes(n.middlewarePath)) return "skip";
    let { match: o, captureGroupKeys: c } = r;
    if (this.applyRouteOverrides(n), this.applyLocaleRedirects(n), !await this.runRouteMiddleware(n.middlewarePath)) return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) return "done";
    this.applyRouteHeaders(n, o, c), this.applyRouteStatus(n);
    let h = this.applyRouteDest(n, o, c);
    if (n.check && !P(this.path)) if (h === this.path) {
      if (t !== "miss") return this.checkPhase(O(t));
      this.status = 404;
    } else if (t === "miss") {
      if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) return this.checkPhase("filesystem");
      this.status === 404 && (this.status = void 0);
    } else return this.checkPhase("none");
    return !n.continue || n.status && n.status >= 300 && n.status <= 399 ? "done" : "next";
  }
  async checkPhase(t) {
    if (this.checkPhaseCounter++ >= 50) return console.error(`Routing encountered an infinite loop while checking ${this.url.pathname}`), this.status = 500, "error";
    this.middlewareInvoked = [];
    let a = true;
    for (let i of this.routes[t]) {
      let n = await this.checkRoute(t, i);
      if (n === "error") return "error";
      if (n === "done") {
        a = false;
        break;
      }
    }
    if (t === "hit" || P(this.path) || this.headers.normal.has("location") || !!this.body) return "done";
    if (t === "none") for (let i of this.locales) {
      let n = new RegExp(`/${i}(/.*)`), c = this.path.match(n)?.[1];
      if (c && c in this.output) {
        this.path = c;
        break;
      }
    }
    let s = this.path in this.output;
    if (!s && this.path.endsWith("/")) {
      let i = this.path.replace(/\/$/, "");
      s = i in this.output, s && (this.path = i);
    }
    if (t === "miss" && !s) {
      let i = !this.status || this.status < 400;
      this.status = i ? 404 : this.status;
    }
    let r = "miss";
    return s || t === "miss" || t === "error" ? r = "hit" : a && (r = O(t)), this.checkPhase(r);
  }
  async run(t = "none") {
    this.checkPhaseCounter = 0;
    let a = await this.checkPhase(t);
    return this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400) && (this.status = 307), a;
  }
};
async function ee(e, t, a, s) {
  let r = new E(t.routes, a, e, s, t.wildcard), i = await te(r);
  return Ce(e, i, a);
}
__name(ee, "ee");
async function te(e, t = "none", a = false) {
  return await e.run(t) === "error" || !a && e.status && e.status >= 400 ? te(e, "error", true) : { path: e.path, status: e.status, headers: e.headers, searchParams: e.searchParams, body: e.body };
}
__name(te, "te");
async function Ce(e, { path: t = "/404", status: a, headers: s, searchParams: r, body: i }, n) {
  let o = s.normal.get("location");
  if (o) {
    if (o !== s.middlewareLocation) {
      let h = [...r.keys()].length ? `?${r.toString()}` : "";
      s.normal.set("location", `${o ?? "/"}${h}`);
    }
    return new Response(null, { status: a, headers: s.normal });
  }
  let c;
  if (i !== void 0) c = new Response(i, { status: a });
  else if (P(t)) {
    let h = new URL(t);
    x(h.searchParams, r), c = await fetch(h, e.request);
  } else c = await T(n[t], e, { path: t, status: a, headers: s, searchParams: r });
  let d = s.normal;
  return g(d, c.headers), g(d, s.important), c = new Response(c.body, { ...c, status: a || c.status, headers: d }), c;
}
__name(Ce, "Ce");
l();
u();
p();
function se() {
  globalThis.__nextOnPagesRoutesIsolation ??= { _map: /* @__PURE__ */ new Map(), getProxyFor: Ee };
}
__name(se, "se");
function Ee(e) {
  let t = globalThis.__nextOnPagesRoutesIsolation._map.get(e);
  if (t) return t;
  let a = Ne();
  return globalThis.__nextOnPagesRoutesIsolation._map.set(e, a), a;
}
__name(Ee, "Ee");
function Ne() {
  let e = /* @__PURE__ */ new Map();
  return new Proxy(globalThis, { get: /* @__PURE__ */ __name((t, a) => e.has(a) ? e.get(a) : Reflect.get(globalThis, a), "get"), set: /* @__PURE__ */ __name((t, a, s) => Me.has(a) ? Reflect.set(globalThis, a, s) : (e.set(a, s), true), "set") });
}
__name(Ne, "Ne");
var Me = /* @__PURE__ */ new Set(["_nextOriginalFetch", "fetch", "__incrementalCache"]);
var Ie = Object.defineProperty;
var Ae = /* @__PURE__ */ __name((...e) => {
  let t = e[0], a = e[1], s = "__import_unsupported";
  if (!(a === s && typeof t == "object" && t !== null && s in t)) return Ie(...e);
}, "Ae");
globalThis.Object.defineProperty = Ae;
globalThis.AbortController = class extends AbortController {
  constructor() {
    try {
      super();
    } catch (t) {
      if (t instanceof Error && t.message.includes("Disallowed operation called within global scope")) return { signal: { aborted: false, reason: null, onabort: /* @__PURE__ */ __name(() => {
      }, "onabort"), throwIfAborted: /* @__PURE__ */ __name(() => {
      }, "throwIfAborted") }, abort() {
      } };
      throw t;
    }
  }
};
var Ss = { async fetch(e, t, a) {
  se(), X();
  let s = await __ALSes_PROMISE__;
  if (!s) {
    let n = new URL(e.url), o = await t.ASSETS.fetch(`${n.protocol}//${n.host}/cdn-cgi/errors/no-nodejs_compat.html`), c = o.ok ? o.body : "Error: Could not access built-in Node.js modules. Please make sure that your Cloudflare Pages project has the 'nodejs_compat' compatibility flag set.";
    return new Response(c, { status: 503 });
  }
  let { envAsyncLocalStorage: r, requestContextAsyncLocalStorage: i } = s;
  return r.run({ ...t, NODE_ENV: "production", SUSPENSE_CACHE_URL: R }, async () => i.run({ env: t, ctx: a, cf: e.cf }, async () => {
    if (new URL(e.url).pathname.startsWith("/_next/image")) return K(e, { buildOutput: _, assetsFetcher: t.ASSETS, imagesConfig: f.images });
    let o = B(e);
    return ee({ request: o, ctx: a, assetsFetcher: t.ASSETS }, f, _, m);
  }));
} };
export {
  Ss as default
};
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=bundledWorker-0.08964867188620884.mjs.map
