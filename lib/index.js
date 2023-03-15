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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsePin = void 0;
var tall_1 = require("tall");
function ParsePin(pin) {
    return __awaiter(this, void 0, void 0, function () {
        var splitByComma;
        return __generator(this, function (_a) {
            if (pin == null)
                return [2 /*return*/, { success: false }];
            splitByComma = pin.replace(/\s/g, '').split(',').map(function (a) { return a.replace('(', '').replace(')', ''); });
            if (!Number.isNaN(+(splitByComma === null || splitByComma === void 0 ? void 0 : splitByComma[0])) &&
                !Number.isNaN(+(splitByComma === null || splitByComma === void 0 ? void 0 : splitByComma[1])) &&
                (splitByComma === null || splitByComma === void 0 ? void 0 : splitByComma[0]) != null &&
                (splitByComma === null || splitByComma === void 0 ? void 0 : splitByComma[1]) != null) {
                return [2 /*return*/, {
                        success: true,
                        lat: splitByComma[0],
                        lng: splitByComma[1],
                    }];
            }
            // handle google maps link: https://maps.app.goo.gl/c3rjbowSs23hQnhR8?g_st=ic
            // handle apple maps link: https://maps.apple.com/?ll=54.745391,-110.146062&q=Dropped%20Pin&t=m
            if (pin.slice(0, 4) === 'http') {
                return [2 /*return*/, (0, tall_1.tall)(pin)
                        .then(function (unshortenedUrl) {
                        var _a;
                        var latLng = (_a = unshortenedUrl.match(/-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?/g)) === null || _a === void 0 ? void 0 : _a[0];
                        var split = latLng === null || latLng === void 0 ? void 0 : latLng.split(',');
                        var lat = split === null || split === void 0 ? void 0 : split[0];
                        var lng = split === null || split === void 0 ? void 0 : split[1];
                        if (!!lat && !!lng) {
                            return {
                                success: true,
                                lat: lat,
                                lng: lng,
                            };
                        }
                        return {
                            success: false,
                        };
                    })
                        .catch(function () {
                        return { success: false };
                    })];
            }
            // handle various formats here
            return [2 /*return*/, { success: false }];
        });
    });
}
exports.ParsePin = ParsePin;
