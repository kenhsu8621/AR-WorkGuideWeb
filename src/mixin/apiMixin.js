import constants from "@/constants";
import axios from "axios";
import Vue from "vue";
import { loaderMixin } from "./loaderMixin";

let win = null;
let noNetworkFlag = false;
export default Vue.util.mergeOptions(loaderMixin, {
  methods: {
    apiPost(path, data, option) {
      return this.doApi("POST", path, data, option);
    },
    apiGet(path, params, option) {
      return this.doApi("GET", path, params, option);
    },
    doApi(method, path, data, option) {
      let retry = 0;
      let func = async () => {
        this.showLoader();
        let headers = { Authorization: this.$cookies.get("token") };
        try {
          if (method === "GET") return await axios.get(`${this.$origin}/api/${path}`, { params: data, headers });
          else return await axios.post(`${this.$origin}/api/${path}`, data, { headers });
        } catch (error) {
          let code = -500;
          if (error.request && error.toString() === "Error: Network Error") {
            noNetworkFlag = true;

            if (!win) {
              win = this.$alert("無法連線", "請確認網路連線正常", () => {
                win = null;
              });
            }

            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            // this.$store.state.noNetworkFlag = true;
            console.log(error.request);
            console.log("沒有網路連線");
            if (++retry >= Number.MAX_VALUE) {
              throw { code, message: this.getMessage(code) };
            } else {
              console.log(`retry: ${retry}`);
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  func()
                    .then(resolve)
                    .catch(reject);
                }, 3000);
              });
            }
          } else {
            console.log(error);
            let message = this.getMessage(code);
            if (!option?.noShowError) this.$alert(message);
            throw { code, message: message };
          }
        } finally {
          this.dismissLoader();
        }
      };
      return func().then((resp) => {
        // this.$store.state.noNetworkFlag = false;
        noNetworkFlag = false;
        if (win) win.destroy();
        let result = resp.data;
        let obj = {
          code: result.Code,
          message: this.getMessage(result.Code) || result.Message,
          data: result.RData,
        };
        if (result.Success) return obj;
        else {
          if (obj.code) {
            if (obj.code == -1000 || obj.code == -1020) {
              let user = this.$cookies.get("user");
              this.$cookies.remove("token");
              this.$cookies.remove("user");
              try {
                if (this.$router.currentRoute.meta.type) {
                  if (this.$router.currentRoute.meta.type == 3 || user.type == 3)
                    this.$router.push({ name: "SILogin" });
                  else this.$router.push({ name: "Login" });
                }
              } catch (e) {
                console.log(e);
                this.$router.push({ name: "Login" });
              }
            } else {
              if (!option?.noShowError) this.$alert(obj.message);
            }
            throw obj;
          } else {
            let code = -500;
            let message = this.getMessage(code);
            if (!option?.noShowError) this.$alert(message);
            throw { code, message: message };
          }
        }
      });
    },
    getMessage(code) {
      let lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;
      let messages = Messages[code];
      if (messages && messages[lang]) return messages[lang];
      else return "";
    },
  },
});
// move somewhere
let LANG = {
  TW: 0,
  EN: 1,
  CN: 2,
};

let Messages = {};
Messages[0] = ["成功", "Success", "成功"];
Messages[-1] = ["輸入參數有誤", "Incorrect input parameters.", "输入参数有误"];
Messages[-10] = ["信件寄送失敗", "Mail delivery failed.", "信件寄送失败"];
Messages[-500] = ["系統錯誤", "System Error.", "系统错误"];
Messages[-998] = ["找不到此錯誤代碼", "Error code not found.", "找不到此错误代码"];
Messages[-999] = ["失敗", "Failed", "失败"];
Messages[-1000] = ["尚未登入", "User has not logged in.", "尚未登入"];
Messages[1001] = ["註冊資料檢查成功", "Registration information checked successfully.", "注册资料检查成功"];
Messages[-1001] = ["帳號已被使用", "That account is taken.", "帐号已被使用"];
Messages[1002] = ["註冊成功", "Registration success.", "注册成功"];
Messages[-1002] = ["註冊失敗", "Registration failes.", "注册失败"];
Messages[-1003] = ["登入失敗", "Login failed.", "登入失败"];
Messages[-1004] = [
  "連續輸入密碼錯誤達5次，請10分鐘後再嘗試登入",
  "You have entered the wrong password 5 times in a row, please try to log in again after 10 minutes.",
  "连续输入密码错误达5次，请10分钟后再尝试登入",
];
Messages[-1005] = ["Email已被註冊", "This Email has been registered.", "Email已被注册"];
Messages[-1006] = ["密碼填寫錯誤，請重新輸入", "Invalid password. Please try again.", "密码填写错误，请重新输入"];
Messages[-1007] = ["Email錯誤，請重新輸入", "Invalid Email. Please try again.", "Email错误，请重新输入"];
Messages[-1008] = [
  "查無此帳號，請重新輸入",
  "Invalid account. Please enter another account.",
  "查无此帐号，请重新输入",
];
Messages[1010] = ["驗證碼驗證成功", "Successfully verified!", "验证码验证成功"];
Messages[-1010] = ["驗證碼錯誤", "Incorrect verification code, verification failed.", "验证码错误"];
Messages[-1011] = [
  "驗證碼已過期，請重新寄送驗證信",
  "The verification code has expired, please send the verification letter again.",
  "验证码已过期，请重新寄送验证信",
];
Messages[1012] = ["成功發送驗證碼", "Successfully sent a verification code.", "成功发送验证码"];
Messages[-1012] = ["發送驗證碼失敗", "Failed to send a verification code.", "发送验证码失败"];
Messages[-1013] = ["驗證碼尚未過期", "The verification code has not expired.", "验证码尚未过期"];
Messages[-1014] = ["無效的驗證碼", "invalid verification code.", "无效的验证码"];
Messages[-1015] = ["驗證碼重試次數達上限", "captcha retries to limit.", "验证码重试次数达上限"];
Messages[-1016] = ["沒有提供推播服務Token", "fcm token not found.", "没有提供推播服务Token"];
Messages[-1017] = ["已有同裝置登入，無法進行登入", "device is already logged in", "已有同装置登入，无法进行登入"];
Messages[-1019] = ["使用者正在通話中", "User is calling", "使用者正在通话中"];
Messages[-1020] = ["權限不足", "Permission denial", "权限不足"];
Messages[-1021] = ["帳號或密碼有誤，請重新輸入", "Account or password incorrect", "帐号或密码有误，请重新输入"];
Messages[-1022] = [
  "登入資訊連續輸入錯誤達5次，請10分鐘後再嘗試登入。",
  "Login information incorrect 5 times, please try again after 10 minutes.",
  "登入资讯连续输入错误达5次，请10分钟后再尝试登入。",
];

Messages[-2001] = ["無效帳號", "Invalid account.", "无效帐号"];
Messages[-2002] = ["已加入聯絡人", "Contact has been added", "已加入联络人"];
Messages[-2003] = ["新增聯絡人失敗", "Failed to add contact.", "新增联络人失败"];
Messages[-2004] = ["新增聯絡人失敗", "Failed to add contact.", "新增联络人失败"];

Messages[-3000] = ["連線失敗", "Connection failed.", "连线失败"];
Messages[-3001] = ["使用者與通話不匹配", "User and call do not match.", "使用者与通话不匹配"];
Messages[-3002] = ["通話/拒絕通話失敗", "Call failed./Failed to reject the call.", "通话"];
Messages[-3003] = ["通話結束", "Call ended.", "通话结束"];
Messages[-3004] = [
  "聯絡人未登入，無法進行通話",
  "Connection failed(this contact is not logged in).",
  "联络人未登入，无法进行通话",
];
Messages[-3005] = ["通話不存在", "Call does not exist.", "通话不存在"];
Messages[-3006] = ["通話內已有眼鏡加入", "Already a glass device in the room.", "通话内已有眼镜加入"];
Messages[-3007] = ["通話評分不存在", "Rating is not found.", "通话评分不存在"];

Messages[-6000] = ["SI不存在", "SI does not exist.", "SI不存在"];
Messages[-6001] = ["SI代碼已存在", "SI code exists.", "SI代码已存在"];
Messages[-6002] = ["SI帳號剩餘數量不足", "SI account remaining is not enough.", "SI帐号剩余数量不足"];
Messages[-6003] = ["SI停用中", "SI is inactive.", "SI停用中"];
Messages[-6004] = ["SI帳號已存在", "SI account exists.", "SI帐号已存在"];
Messages[-6005] = ["SI使用者不存在", "SI user does not exist.", "SI使用者不存在"];

Messages[-7000] = ["企業不存在", "Enterprise does not exist.", "企业不存在"];
Messages[-7001] = ["企業代碼已存在", "Enterprise code exists.", "企业代码已存在"];
Messages[-7002] = ["企業帳號剩餘數量不足", "Enterprise account remaining is not enough.", "企业帐号剩余数量不足"];
Messages[-7003] = ["企業停用中", "Enterprise is inactive.", "企业停用中"];
Messages[-7004] = ["企業帳號已存在", "Enterprise account exists.", "企业帐号已存在"];
Messages[-7005] = ["企業使用者不存在", "Enterprise user does not exist.", "企业使用者不存在"];
Messages[-8000] = ["聯絡我們資料不存在", "Contact us data does not exist.", "联络我们资料不存在"];

Messages[-9000] = ["設備已存在", "Equipment exists", "设备已存在"];
Messages[-9001] = ["設備不存在", "The equipment is not found", "设备不存在"];
Messages[-9002] = ["設備類型已存在", "The equipment type exist", "设备类型已存在"];
Messages[-9003] = ["設備類型不存在", "The equipment type is not found", "设备类型不存在"];
Messages[-9004] = ["此設備類型不能被刪除", "The equipment type can not be deleted", "此设备类型不能被删除"];
Messages[-9005] = ["此設備位置不能被刪除", "The equipment position can not be deleted", "此设备位置不能被删除"];
Messages[-9006] = ["設備位置已存在", "The equipment position can not be deleted", "设备位置已存在"];
Messages[-9007] = ["設備類型不存在", "The equipment position is not found", "设备类型不存在"];
Messages[-9008] = ["此設備檔案不存在", "The equipment file is not found", "此设备档案不存在"];
Messages[-9009] = ["設備檔案名稱重複", "The equipment file name exist", "设备档案名称重复"];
Messages[-9010] = ["設備有執行中任務", "The equipment has running task(s)", "设备有执行中任务"];

Messages[-10001] = ["帳號格式不正確", "account is not allowed", "帐号格式不正确"];
Messages[-10002] = ["密碼格式不正確", "password is not allowed", "密码格式不正确"];
Messages[-10003] = ["驗證碼格式不正確", "captcha is not allowed", "验证码格式不正确"];
Messages[-10004] = ["裝置碼格式不正確", "device_id is not allowed", "装置码格式不正确"];
Messages[-10005] = ["Firebase金鑰格式不正確", "fcm_token is not allowed", "Firebase金钥格式不正确"];
Messages[-10006] = ["APNS金鑰格式不正確", "apns_token is not allowed", "APNS金钥格式不正确"];
Messages[-10007] = ["名稱格式不正確", "name is not allowed", "名称格式不正确"];
Messages[-10008] = ["驗證碼格式不正確", "code is not allowed", "验证码格式不正确"];
Messages[-10009] = ["Email格式不正確", "email is not allowed", "Email格式不正确"];
Messages[-10010] = ["新Email格式不正確", "new_email is not allowed", "新Email格式不正确"];
Messages[-10011] = ["新密碼格式不正確", "new_password is not allowed", "新密码格式不正确"];
Messages[-10012] = ["標題格式不正確", "title is not allowed", "标题格式不正确"];
Messages[-10013] = ["內容格式不正確", "message is not allowed", "内容格式不正确"];
Messages[-10014] = ["嚴重性格式不正確", "severity is not allowed", "严重性格式不正确"];
Messages[-10015] = ["開始時間格式不正確", "begin_time is not allowed", "开始时间格式不正确"];
Messages[-10016] = ["結束時間格式不正確", "end_time is not allowed", "结束时间格式不正确"];
Messages[-10017] = ["開啟時間格式不正確", "opened_at is not allowed", "开启时间格式不正确"];
Messages[-10018] = ["結束時間格式不正確", "closed_at is not allowed", "结束时间格式不正确"];
Messages[-10019] = ["是否強制登入格式不正確", "is_force is not allowed", "是否强制登入格式不正确"];
Messages[-10020] = ["狀態格式不正確", "status is not allowed", "状态格式不正确"];
Messages[-10021] = ["房間代碼格式不正確", "call_room_uuid is not allowed", "房间代码格式不正确"];
Messages[-10022] = ["對象使用者帳號格式不正確", "target_user is not allowed", "对象使用者帐号格式不正确"];
Messages[-10023] = ["原因格式不正確", "reason is not allowed", "原因格式不正确"];
Messages[-10024] = ["是否為發話方格式不正確", "is_host is not allowed", "是否为发话方格式不正确"];
Messages[-10025] = ["分類格式不正確", "sort is not allowed", "分类格式不正确"];
Messages[-10026] = ["頁碼格式不正確", "page is not allowed", "页码格式不正确"];
Messages[-10027] = ["每頁幾筆格式不正確", "per_page is not allowed", "每页几笔格式不正确"];
Messages[-10028] = ["標註數量格式不正確", "tag_count is not allowed", "标注数量格式不正确"];
Messages[-10029] = ["是否為分享端格式不正確", "is_share is not allowed", "是否为分享端格式不正确"];
Messages[-10030] = ["加入時間格式不正確", "joined_at is not allowed", "加入时间格式不正确"];
Messages[-10031] = ["分享時間格式不正確", "shared_at is not allowed", "分享时间格式不正确"];
Messages[-10032] = ["離開時間格式不正確", "leaved_at is not allowed", "离开时间格式不正确"];
Messages[-10033] = ["通話評分格式不正確", "stream_rate is not allowed", "通话评分格式不正确"];
Messages[-10034] = ["標註評分格式不正確", "tag_rate is not allowed", "标注评分格式不正确"];

Messages[-11000] = ["工作流程已存在", "Workflow exists", "工作流程已存在"];
Messages[-11001] = ["工作流程不存在", "The Workflow is not found", "工作流程不存在"];
Messages[-11002] = ["工作流程類型已存在", "The Workflow type exist", "工作流程类型已存在"];
Messages[-11003] = ["工作流程類型不存在", "The Workflow type is not found", "工作流程类型不存在"];
Messages[-11004] = ["工作流程類型不能不刪除", "The Workflow type can not be deleted", "工作流程类型不能不删除"];
Messages[-11005] = ["工作流程版本不存在", "The Workflow version is not found", "工作流程版本不存在"];
Messages[-11006] = ["工作紀錄不存在", "The Workflow record is not found", "工作纪录不存在"];
Messages[-11007] = ["工作紀錄已存在", "The Workflow record is already exist", "工作纪录已存在"];
Messages[-11008] = ["工作流程步驟不存在", "The Workflow step is not found", "工作流程步骤不存在"];
Messages[-11009] = ["工作紀錄檔案不存在", "The Workflow record file is not found", "工作纪录档案不存在"];
Messages[-11010] = ["任務不存在", "The Workflow task is not found", "任务不存在"];
Messages[-11011] = ["工作流程名稱重複", "The Workflow name exist", "工作流程名称重复"];

Messages[-12000] = ["不允許的APP類型", "The App type is not allowed", "不允许的APP类型"];
Messages[-12001] = ["版本規則有誤", "The App version is not valid", "版本规则有误"];
Messages[-12002] = ["不能輸入較舊的版本號", "The App version is not greater than latest one", "不能输入较旧的版本号"];
