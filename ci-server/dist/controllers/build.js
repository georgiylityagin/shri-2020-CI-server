"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axiosInstance_1 = __importDefault(require("../utils/axiosInstance"));
var axios_retry_1 = __importDefault(require("axios-retry"));
var node_cache_1 = __importDefault(require("node-cache"));
var github_api_1 = require("../handlers/github-api");
axios_retry_1.default(axiosInstance_1.default, {
    retries: 4,
    retryDelay: function (retryCount) {
        return 100 + (retryCount * 100);
    }
});
var logCach = new node_cache_1.default({
    stdTTL: 5,
    checkperiod: 60 * 60,
    maxKeys: 1000
});
// Получение списка сборок
exports.getBuilds = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, offset, limit, buildList, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query;
                offset = query.offset || '0';
                limit = query.limit || '25';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axiosInstance_1.default.get("/build/list?offset=" + offset + "&limit=" + limit)];
            case 2:
                buildList = (_a.sent()).data.data;
                res.status(200).json({
                    result: 'success',
                    data: buildList
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1.message);
                res.status(504).json({
                    result: 'fail',
                    message: error_1.message,
                    reason: 'Не удалось получить список сборок'
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Добавление сборки в очередь
exports.postCommitHash = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lookingHash, settings, allCommits, searchedCommit, response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lookingHash = req.params.commitHash;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, axiosInstance_1.default.get('/conf')];
            case 2:
                settings = (_a.sent()).data.data;
                return [4 /*yield*/, github_api_1.getAllCommits(settings.repoName)];
            case 3:
                allCommits = _a.sent();
                searchedCommit = allCommits.find(function (_a) {
                    var commitHash = _a.commitHash;
                    return commitHash === lookingHash;
                });
                if (!searchedCommit) return [3 /*break*/, 5];
                return [4 /*yield*/, axiosInstance_1.default.post('/build/request', {
                        commitHash: req.params.commitHash,
                        commitMessage: searchedCommit.commitMessage,
                        branchName: settings.mainBranch,
                        authorName: searchedCommit.authorName
                    })];
            case 4:
                response = (_a.sent()).data.data;
                res.status(200).json({
                    result: 'success',
                    data: response
                });
                return [3 /*break*/, 6];
            case 5:
                res.status(404).json({
                    result: 'fail',
                    message: 'Не найден коммит с таким хэшем'
                });
                return [2 /*return*/];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_1 = _a.sent();
                console.error(err_1.message);
                res.status(504).json({
                    result: 'fail',
                    message: err_1.message,
                    reason: 'Не удалось добавить данный коммит в очередь на сборку',
                });
                return [2 /*return*/];
            case 8: return [2 /*return*/];
        }
    });
}); };
// Получение информации о конкретной сборке
exports.getBuildId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var buildDetails, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axiosInstance_1.default.get("/build/details?buildId=" + req.params.buildId)];
            case 1:
                buildDetails = (_a.sent()).data.data;
                res.status(200).json({
                    result: 'success',
                    data: buildDetails
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error(error_2.message);
                return [2 /*return*/, res.status(404).json({
                        result: 'fail',
                        message: error_2.message,
                        reason: 'Не удалось получить информацию о данной сборке',
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Получение логов билда
exports.getLogs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var log, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                log = void 0;
                if (!logCach.has(req.params.buildId)) return [3 /*break*/, 1];
                log = {};
                log.data = logCach.get(req.params.buildId);
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, axiosInstance_1.default.get("/build/log?buildId=" + req.params.buildId)];
            case 2:
                log = _a.sent();
                try {
                    logCach.set(req.params.buildId, log.data);
                    // console.info('Записали данные в кеш');
                }
                catch (error) {
                    if (error.errorcode === 'ECACHEFULL') {
                        // console.info('Кэш переполнен');
                        logCach.flushAll();
                        // console.info('Очистили кэш');
                        logCach.set(req.params.buildId, log.data);
                        // console.info('Записали данные в кеш');
                    }
                    else {
                        console.error('Unknown error:', error);
                    }
                }
                _a.label = 3;
            case 3:
                res.status(200).json({
                    result: 'success',
                    data: log.data
                });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error(error_3.message);
                res.status(404).json({
                    result: 'fail',
                    message: error_3.message,
                    reason: 'Не удалось получить лог',
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
