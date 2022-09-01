<template>
  <!-- 黑色底避免還沒建立通話前的白畫面 -->
  <div
    class="call text-center"
    @mouseup="onMouseUp"
    @touchend="onMouseUp"
    @mouseout="onMouseUp"
    @touchcancel="onMouseUp"
    :class="{ black: step != 2 }"
  >
    <!-- 建立通話步驟 -->
    <div class="m-0" v-if="step == 0">
      <div class="ra-main-content">
        <div class="activating text-center" v-if="!localStream && !activatingDevice">
          {{ $t("CALL.CALL.ACTIVATING_DEVICE") }}
        </div>
        <div>
          <!-- 對方簡稱 -->
          <div class="icon-round grey-1 text-center p-0 mx-auto">{{ prefix }}</div>
          <transition name="slide-fade" mode="out-in">
            <div class="my-4">
              <div class="mt-5 mb-4 status">
                <span v-if="callingStep == 0">{{ $t("CALL.CALL.CALLING_STATUS_0") }}</span>
                <span v-if="callingStep == 1">{{ $t("CALL.CALL.CALLING_STATUS_1") }}</span>
                <span v-if="callingStep == 2">{{ $t("CALL.CALL.CALLING_STATUS_2") }}</span>
                <span v-if="callingStep == 3">{{ $t("CALL.CALL.CALLING_STATUS_3") }}</span>
                <span v-if="callingStep == 4">{{ $t("CALL.CALL.CALLING_STATUS_4") }}</span>
                <div class="loading" ref="loading" v-if="callingStep != 2"></div>
              </div>

              <!-- 對方名稱 -->
              <div class="user-name">
                {{ callingStep != 1 ? this.targetName : "" }}
              </div>
              <!-- 視訊圖 -->
              <font-awesome-icon icon="video-slash" size="8x" class="mt-5" v-if="callingStep != 1" />
            </div>
          </transition>
          <!-- 掛掉電話 -->
          <b-button
            class="icon-rect red text-center"
            v-if="callingStep != 2"
            :disabled="callingStep == 4 || !localStream || isCancel"
            @click="cancelCall"
          >
            <font-awesome-icon icon="phone-alt" size="2x" :transform="{ rotate: 135 }" />
          </b-button>
          <!-- 靜音 -->
          <b-button
            class="icon-rect text-center ml-4"
            v-if="callingStep == 1"
            :class="[isMuted ? 'active-btn' : 'grey-2']"
            @click="toggleMute"
          >
            <font-awesome-icon icon="microphone-slash" size="2x" />
          </b-button>
          <!-- 接通電話 -->
          <b-button
            class="icon-rect green text-center ml-4"
            v-if="callingStep == 3 || callingStep == 4"
            :disabled="callingStep == 4 || !localStream"
            @click="acceptCall"
          >
            <font-awesome-icon icon="phone-alt" size="2x" />
          </b-button>
        </div>
      </div>
    </div>

    <!-- 開始通話步驟 (New) -->
    <div class="step-1" v-show="step == 1">
      <!-- 視訊畫面 -->
      <div class="upper-section" @mousemove="onMouseMove" @touchmove="onMouseMove">
        <div class="video-section">
          <video ref="recordVideo" class="d-none"></video>
          <!-- 眼鏡端 -->
          <div v-if="isGlasses">
            <!-- 對方視訊畫面 -->
            <div class="video-container">
              <video
                :class="{ index: isPaused || isAppPaused }"
                autoplay
                playsinline
                id="video"
                ref="video"
                @play="resizeAndSendViewSize"
              ></video>
            </div>
          </div>

          <!-- 非眼鏡端 -->
          <div v-if="!isGlasses">
            <!-- 對方視訊畫面 -->
            <div class="video-container" :class="{ minified: isPaused }">
              <video autoplay playsinline id="video" ref="video" @play="resizeAndSendViewSize"></video>
            </div>
          </div>

          <!-- 標註畫板 -->
          <canvas class="canvas" id="cv" ref="cv"></canvas>
          <canvas
            class="canvas"
            :class="{
              'brush-cursor': (isGlasses && isPaused) || (!isGlasses && changeCursor),
            }"
            @mousedown="onMouseDown"
            @touchstart="onMouseDown"
            id="cvCover"
            ref="cvCover"
          ></canvas>

          <!-- 空白畫板，用來傳空白影片的workaround -->
          <canvas ref="emptyCv" style="display:none"></canvas>
          <canvas ref="backupCv" style="display:none"></canvas>

          <!-- 錄影畫板 -->
          <canvas class="canvas width-unset recordCv" id="recordCv" ref="recordCv"></canvas>

          <!-- 標註在視窗外的箭頭 -->
          <div class="arrow-section" v-show="!isPaused && isPaused" ref="arrow-section">
            <font-awesome-icon
              v-for="item in pointers"
              v-bind:key="item.sn"
              :icon="item.newPosX == 0 ? 'caret-left' : 'caret-right'"
              size="3x"
              class="arrow"
              :style="{ top: item.top, left: item.left }"
              :class="[arrowColorList[item.colorIndex], item.newPosX == 0 ? 'float-left' : 'float-right']"
            />
          </div>
        </div>
      </div>

      <div class="lower-section">
        <!-- 功能列表 -->
        <div class="function">
          <!-- 標註工具 -->
          <div class="draw-tools mr-3" v-show="isPaused">
            <!-- 還原 -->
            <div
              class="draw-function-btn grey-1 p-0 mx-2 text-center undo"
              @click="undo(true)"
              v-b-tooltip.hover.top
              :title="$t('CALL.CALL.TIP_UNDO')"
            >
              <img class="ml-0" src="~@/assets/images/draw-undo.png" />
            </div>

            <!-- 選擇標註顏色 -->
            <div
              class="draw-function-btn color-picker mx-2"
              @click="
                isChoosingColor = !isChoosingColor;
                isChoosingTool = false;
              "
              :class="colorList[selectedColorId].color"
              v-b-tooltip.hover.top
              :title="$t('CALL.CALL.TIP_COLOR_PICKER')"
            >
              <img class="ml-0" src="" />
            </div>

            <!-- 標註顏色選單-->
            <transition name="fade">
              <div class="color-picker-component" v-if="isChoosingColor">
                <div class="color-picker-list row">
                  <div v-for="item in colorList" v-bind:key="item.id" class="col-3 p-0">
                    <div class="colors" :class="item.color" @click="changeColor(item.id)"></div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 分隔線 -->
            <div class="divider mx-2" v-if="drawFunction != -1"></div>

            <!-- 選擇標註工具-->
            <div
              class="draw-function-btn tool-picker mx-2"
              @click="
                isChoosingTool = !isChoosingTool;
                isChoosingColor = false;
              "
              v-if="drawFunction != -1"
              v-b-tooltip.hover.top
              :title="$t('CALL.CALL.TIP_DRAW_TOOL')"
            >
              <font-awesome-icon v-if="drawFunction == 0" icon="paint-brush" size="2x" />
              <img class="ml-0" v-if="drawFunction == 1" src="~@/assets/images/draw-straight-arrow-alt.png" />
              <img class="ml-0" v-if="drawFunction == 2" src="~@/assets/images/draw-freehand-arrow-alt.png" />
              <img class="ml-0" v-if="drawFunction == 3" src="~@/assets/images/draw-circle-alt.png" />
            </div>

            <!-- 標註工具選單 -->
            <transition name="fade" v-if="drawFunction != -1">
              <div class="curve-tools" v-if="isChoosingTool">
                <!-- 橢圓 -->
                <div
                  class="curve-function-btn mx-1"
                  v-b-tooltip.hover.top
                  :title="$t('CALL.CALL.TIP_OVAL')"
                  :class="[drawFunction == 3 ? 'active' : '']"
                  @click="changeDrawFunction(3)"
                >
                  <img class="ml-0" v-if="drawFunction != 3" src="~@/assets/images/draw-circle.png" />
                  <img class="ml-0" v-if="drawFunction == 3" src="~@/assets/images/draw-circle-alt.png" />
                </div>

                <!-- 手繪+箭頭 -->
                <div
                  class="curve-function-btn mx-1"
                  v-b-tooltip.hover.top
                  :title="$t('CALL.CALL.TIP_FREEHAND_ARROW')"
                  :class="[drawFunction == 2 ? 'active' : '']"
                  @click="changeDrawFunction(2)"
                >
                  <img class="ml-0" v-if="drawFunction != 2" src="~@/assets/images/draw-freehand-arrow.png" />
                  <img class="ml-0" v-if="drawFunction == 2" src="~@/assets/images/draw-freehand-arrow-alt.png" />
                </div>

                <!-- 直線+箭頭 -->
                <div
                  class="curve-function-btn mx-1"
                  v-b-tooltip.hover.top
                  :title="$t('CALL.CALL.TIP_STRAIGHT_ARROW')"
                  :class="[drawFunction == 1 ? 'active' : '']"
                  @click="changeDrawFunction(1)"
                >
                  <img class="ml-0" v-if="drawFunction != 1" src="~@/assets/images/draw-straight-arrow.png" />
                  <img class="ml-0" v-if="drawFunction == 1" src="~@/assets/images/draw-straight-arrow-alt.png" />
                </div>

                <!-- 手繪線段 -->
                <div
                  class="curve-function-btn freehand mx-1"
                  v-b-tooltip.hover.top
                  :title="$t('CALL.CALL.TIP_FREEHAND')"
                  :class="[drawFunction == 0 ? 'active' : '']"
                  @click="changeDrawFunction(0)"
                >
                  <font-awesome-icon icon="paint-brush" size="2x" />
                </div>
              </div>
            </transition>
          </div>

          <!-- 是否凍結視窗 (眼鏡端畫面) -->
          <div
            class="function-btn grey-1 p-0 mx-2 text-center"
            :class="[isSharing || isAppPaused ? 'disabled-button' : 'grey-1']"
            v-if="isGlasses && !isPaused"
            @click="pause"
            v-b-tooltip.hover.top
            :title="$t('CALL.CALL.TIP_PAUSE')"
          >
            <font-awesome-icon icon="pause" size="1x" />
          </div>

          <!-- 是否解除凍結 (眼鏡端畫面) -->
          <div
            class="function-btn grey-1 p-0 mx-2 text-center"
            v-if="isPaused"
            @click="resume"
            v-b-tooltip.hover.top
            :title="$t('CALL.CALL.TIP_RESUME')"
          >
            <font-awesome-icon icon="play" size="1x" />
          </div>

          <!-- 靜音 -->
          <div
            class="function-btn grey-1 p-0 mx-2 text-center"
            :class="[isMuted ? 'blue' : 'grey-1']"
            v-b-tooltip.hover.top
            @click="toggleMute(!isMuted)"
            :title="[isMuted ? $t('CALL.CALL.TIP_MIC_OFF') : $t('CALL.CALL.TIP_MIC_ON')]"
          >
            <font-awesome-icon icon="microphone-slash" size="1x" />
          </div>

          <!-- 手電筒 -->
          <div
            class="function-btn p-0 mx-2 text-center"
            :class="[isTurnOn ? 'blue' : 'grey-1', isSharing || isAppPaused ? 'disabled-button' : 'grey-1']"
            @click="toggleLight"
            v-b-tooltip.hover.top
            :title="[isTurnOn ? $t('CALL.CALL.TIP_FLASH_ON') : $t('CALL.CALL.TIP_FLASH_OFF')]"
          >
            <img v-if="!isTurnOn" class="flashlight ml-0" src="~@/assets/images/flashlight.png" />
            <img v-if="isTurnOn" class="flashlight ml-0" src="~@/assets/images/flashlight_alt.png" />
          </div>

          <!-- 傳送檔案 -->
          <div
            class="function-btn grey-1 p-0 mx-2 text-center"
            :class="[isSharing || isAppPaused ? 'disabled-button' : 'grey-1']"
            v-if="!isPaused && isGlasses"
            @click="showFileDialog"
            v-b-tooltip.hover.top
            :title="$t('CALL.CALL.TIP_SEND_FILE')"
          >
            <font-awesome-icon icon="file-export" size="1x" />
            <!-- <span v-if="sendingRate">{{ sendingRate }}%</span> -->
            <input
              type="file"
              id="selectFileToSend"
              name="selectFileToSend"
              accept=".pdf, .png, .jpg, .jpeg"
              ref="selectFile"
              hidden
              @change="selectFileToSend"
            />
          </div>

          <!-- 開始分享畫面 -->
          <div
            class="function-btn grey-1 p-0 mx-2 text-center"
            :class="[isSendingFile || isAppPaused ? 'disabled-button' : 'grey-1']"
            v-if="isGlasses && !isPaused && !isSharing"
            v-b-tooltip.hover.top
            @click="showDesktop"
            :title="$t('CALL.CALL.TIP_START_SHARE_SCREEN')"
          >
            <img class="recording" src="~@/assets/images/arrow-white.png" />
          </div>

          <!-- 停止分享畫面 -->
          <div
            class="function-btn white p-0 mx-2 text-center"
            v-if="isGlasses && !isPaused && isSharing"
            v-b-tooltip.hover.top
            @click="stopShowDesktop"
            :title="$t('CALL.CALL.TIP_STOP_SHARE_SCREEN')"
          >
            <img class="recording" src="~@/assets/images/arrow-blue.png" />
          </div>

          <!-- 開始錄影 -->
          <div
            class="function-btn grey-1 p-0 mx-2 text-center"
            id="btnStartRecording"
            v-if="!isRecording && !isPaused"
            @click="btnStartRecording"
            v-b-tooltip.hover.top
            :title="$t('CALL.CALL.TIP_START_RECORDING')"
          >
            <img class="recording ml-0" src="~@/assets/images/recording.png" />
          </div>

          <!-- 結束錄影 -->
          <div
            class="function-btn white p-0 mx-2 text-center"
            id="btnStopRecording"
            v-if="isRecording && !isPaused"
            @click="btnStopRecording"
            v-b-tooltip.hover.top
            :title="$t('CALL.CALL.TIP_STOP_RECORDING')"
          >
            <img class="recording ml-0" src="~@/assets/images/recording-alt.png" />
          </div>

          <!-- 掛掉電話 -->
          <div
            class="function-btn red p-0 mx-2 text-center"
            @click="hangup"
            v-b-tooltip.hover.top
            :title="$t('CALL.CALL.TIP_END_CALL')"
          >
            <font-awesome-icon icon="phone-alt" size="1x" />
          </div>
        </div>
      </div>
    </div>

    <!-- 通話結束步驟，標註總覽 -->
    <div class="row m-0" v-if="step == 2">
      <RAHeader
        :title="$t('CALL.CALL.MEETING_SUMMARY')"
        showCancelBtn
        :pageUrl="{ name: 'RARating' }"
        :isCalling="isCalling"
        :callName="receiveCallData.callName"
        @accept="acceptCallInCapture"
        @decline="acceptCallInCapture"
      />
      <div class="screen-capture-section mx-auto" :class="{ 'top-210': isCalling }">
        <div class="my-3">
          通話時間 {{ totalMins > 9 ? totalMins : "0" + totalMins }}:{{ totalSecs > 9 ? totalSecs : "0" + totalSecs }}
        </div>
        <div class="mb-4">請先完成截圖儲存後再離開此頁，以免遺失截圖</div>
        <div class="checkbox-list row">
          <div :class="[isGlasses ? 'col-6' : 'col-4']" v-for="(item, index) in captures" v-bind:key="index">
            <input type="checkbox" :checked="item.selected" :id="index" @click="toggleSelect(index)" />
            <img :src="item.dataUrl" />
            <label :for="index"><font-awesome-icon icon="check-circle" size="3x"/></label>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="button-section mx-auto">
          <b-button class="ra-confirm-btn-alt mt-4 float-left" @click="doSelectAll">
            <span v-if="!selectAll">{{ $t("CALL.CALL.SELECT_ALL") }}</span>
            <span v-if="selectAll">{{ $t("CALL.CALL.UNSELECT_ALL") }}</span>
          </b-button>
          <b-button class="ra-confirm-btn mt-4 float-right" @click="downloadZip()" :disabled="emptySelect">{{
            $t("CALL.CALL.DOWNLOAD")
          }}</b-button>
        </div>
      </div>

      <b-modal
        id="downloadZipModal"
        :title="$t('CALL.CALL.DOWNLOAD_CAPTURE')"
        size="md"
        hide-header-close
        hide-footer
        centered
      >
        <div class="ra-form-group my-3 mx-auto text-center">
          {{ $t("CALL.CALL.DOWNLOADING") }}
          <b-progress :value="downloadProgress" animated class="download-progress col-10 p-0"></b-progress>
        </div>
      </b-modal>
    </div>

    <!-- 提示訊息 (3秒消失) -->
    <b-alert
      :show="dismissCountDown"
      variant="dark"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
      class="mt-3 mx-auto auth-alert"
    >
      <div v-if="!dismissCountDownPaused">
        <p v-if="shareState == 1 && torchTip == 0">
          {{ $t("CALL.CALL.SHARE_STATE_1") }}
        </p>
        <p v-if="shareState == 2 && torchTip == 0 && showMessage == ''">
          {{ $t("CALL.CALL.SHARE_STATE_2") }}
        </p>
        <p v-if="torchTip == 4">{{ $t("CALL.CALL.TORCH_TIP_4") }}</p>
        <p v-if="torchTip == 3">{{ $t("CALL.CALL.TORCH_TIP_3") }}</p>
        <p v-if="torchTip == 2">
          {{ $t("CALL.CALL.TORCH_TIP_2") }}
        </p>
        <p v-if="torchTip == 1 && isTurnOn">{{ $t("CALL.CALL.TORCH_TIP_1_ON") }}</p>
        <p v-if="torchTip == 1 && !isTurnOn">{{ $t("CALL.CALL.TORCH_TIP_1_OFF") }}</p>
        <p v-if="showMessage">{{ showMessage }}</p>
      </div>
    </b-alert>

    <!-- 提示訊息 (不會消失) -->
    <b-alert
      :show="dismissCountDownPaused"
      variant="dark"
      @dismissed="dismissCountDownPaused = 0"
      @dismiss-count-down="countDownChanged"
      class="mt-3 mx-auto auth-alert"
    >
      <p v-if="dismissCountDownPaused">{{ targetName }} {{ $t("CALL.CALL.APP_PAUSE") }}</p>
    </b-alert>

    <!-- 錄影中斷 modal -->
    <b-modal
      id="recordCanceledModal"
      :title="$t('CALL.CALL.CALL_END')"
      size="md"
      hide-header-close
      hide-footer
      centered
    >
      <div class="ra-form-group my-3 mx-auto text-center">
        {{ $t("CALL.CALL.DOWNLOADING") }}
        <b-button
          type="submit"
          class="ra-confirm-btn mt-4 mb-3 mx-auto"
          aria-label="Close"
          data-dismiss="modal"
          @click="closeModal('recordCanceledModal')"
          >{{ $t("GENERAL.OK") }}</b-button
        >
      </div>
    </b-modal>

    <!-- 傳送檔案 modal -->
    <div class="send-file-modal" v-if="isGlasses && sendFileModal && step == 1">
      {{ sendFileTitle }}
      <div class="ra-form-group my-3 mx-auto text-center">
        <div class="row" v-if="transferStep == 1 || transferStep == 2">
          <font-awesome-icon icon="file" class="grey col-2 mt-2" size="2x" />
          <div class="col-10">
            <p class="text-left" style="font-size: 12px; margin: 0">{{ sendFileName }}</p>
            <p class="text-left" style="font-size: 12px;color: #b7b7b7; margin: 0">{{ sendFileSize }} bytes</p>
            <div class="row m-0 p-0" v-if="transferStep == 1 || transferStep == 2">
              <b-progress :value="sendingRate" animated class="col-10 m-0 p-0"></b-progress>
              <p class="col-2 m-0 p-0">{{ sendingRate }} %</p>
            </div>
          </div>
        </div>

        <b-button
          type="submit"
          class="ra-confirm-btn mt-4 mb-3 mx-auto"
          aria-label="Close"
          data-dismiss="modal"
          @click="stopSendingFile()"
          v-if="transferStep == 1 || transferStep == 2"
          >{{ $t("CALL.CALL.CANCEL_SEND_FILE") }}</b-button
        >

        <b-button
          type="submit"
          class="ra-confirm-btn mt-4 mb-3 mx-auto"
          aria-label="Close"
          data-dismiss="modal"
          @click="stopSendingFile()"
          v-if="transferStep == 4"
          >{{ $t("GENERAL.OK") }}</b-button
        >
      </div>
    </div>

    <!-- 體驗版結束 modal-->
    <b-modal id="trialEndModal" :title="$t('CALL.CALL.APP_TRIAL_END')" size="md" hide-header-close hide-footer centered>
      <div class="ra-form-group my-3 mx-auto text-center">
        {{ $t("CALL.CALL.APP_TRIAL_END_TEXT") }}
        <b-button
          type="submit"
          class="ra-confirm-btn mt-4 mb-3 mx-auto"
          aria-label="Close"
          data-dismiss="modal"
          @click="closeModal('trialEndModal')"
          >{{ $t("GENERAL.OK") }}</b-button
        >
      </div>
    </b-modal>
    <audio id="welcome" class="d-none" ref="audio" autoplay loop v-if="audioRing">
      <!-- <source src="URL/welcome.ogg" type="audio/ogg"> -->
      <source src="~@/assets/audio/audio.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
  //#region imports
  import { saveAs } from "file-saver";
  import RAHeader from "@/components/RAHeader.vue";
  import JsZip from "jszip";
  import RecordRTC from "recordrtc";
  import constants from "@/constants";
  import { getSeekableBlob } from "@/utils/ebml.util.js";
  //#endregion

  //#region Constants
  let CHUNK_SIZE = 64000;

  let CMD_LINE = 0.0;
  let CMD_UNDO = 1.0;
  let CMD_TORCH = 2.0;
  let CMD_LOCK_RMT_POV = 3.0;
  let CMD_UNLOCK_RMT_POV = 4.0;
  let CMD_STATE = 5.0;
  let CMD_HANGUP = 6.0;
  let CMD_REMOTE_VIEW_SIZE = 7.0;
  let CMD_ARROW = 8.0;
  let CMD_SNAPSHOT = 9.0;
  let CMD_SCREENSHOT_END = 10.0;
  let CMD_PAUSE = 11.0;
  let CMD_RESUME = 12.0;
  let CMD_SCREEN_SHARE = 13.0;
  let CMD_STOP_SCREEN_SHARE = 14.0;
  let CMD_MESSAGE = 15.0;
  let CMD_FILE_TRANSFER_ACCEPT = 16.0;
  let CMD_FILE_TRANSFER_REJECT = 17.0;
  let CMD_SCREEN_RECORD = 18.0;
  let CMD_SCREEN_RECORD_STOP = 19.0;
  let CMD_APP_PAUSE = 20.0;
  let CMD_APP_RESUME = 21.0;
  let CMD_TRIAL_END = 22.0;
  let CMD_FILE_TRANSFER_STOP = 23.0;

  let CMD_GLASS_LINE = 100.0;

  let POINT_BEGIN = 0.0;
  let POINT_BEGIN_FIXED_Z = 0.5;
  let POINT_MOVE = 1.0;
  let POINT_END = 2.0;
  let LINE_OVAL = 3.0;
  let LINE_STRAIGHT_POINTER = 4.0;
  let LINE_CURVE_POINTER = 5.0;

  let ARSTATE_SHARE = 0;
  let ARSTATE_LEARN = 1;
  let ARSTATE_TAG = 2;

  let SCREEN_REMOTE = 1;
  let SCREEN_LOCAL = 2;

  let SNAPSHOT_RESOLUTION = 720;
  let SNAPSHOT_COMPRESS_RATIO = 0.5;

  // MESSAGE_ID 定義
  let MSG_ENV_SAVING = 1.0; // "空間環境儲存中，請稍候再標註！"
  let MSG_NO_FEATURE_POINTS = 2.0; // "此處無特徵點，無法標註"
  let MSG_ANNOTATION_TOO_LONG = 3.0; // "標註線段太長或太複雜了，請重新標註"
  let MSG_NEED_ENV_LEARNING = 4.0; // "此區域需加強環境學習，請先前後移動裝置再繪製
  let MSG_WAIT_ENV_LEARNING = 5.0; // "等待對方將鏡頭轉向先前分享的畫面以恢復標註位置。"
  let MSG_ENV_LEARNING_DONE = 6.0; // "標註已歸位！"
  let MSG_PAUSE_SHARING = 7.0; // "對方已停止分享畫面，請稍候！"
  let MSG_RESUME_SHARING = 8.0; // "對方繼續分享畫面"
  let MSG_ANNOTATION_TOO_SHORT = 9.0; // "標註太短，請重試!"
  let MSG_ANNOTATION_TOO_FAST = 10.0; // "標註速度過快，請再畫一次"

  let tagPaths = [];
  let tagLines = [];
  function TagLine(type, x1, y1, x2, y2, selectedColorId) {
    this.type = type;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.selectedColorId = selectedColorId;
  }
  //#endregion

  let ABToStr = (ab) => new Uint8Array(ab).reduce((p, c) => p + String.fromCharCode(c), "");

  let mousedown = function() {};
  let mousemove = function() {};
  let mouseup = function() {};
  let canvasFunctions = {};

  export default {
    name: "Call",
    components: { RAHeader },
    props: {
      callName: String,
      callAccount: String,
      callRoomUUID: String,
      showCallerScreen: String,
      deviceType: String,
      isFromRating: Boolean,
    },
    data: () => ({
      componentId: "Call",
      isRegistered: false,
      step: 0,
      callingStep: 0, // 0:等待接通 1:等待分享畫面 2:無回應 3:等待確認 4:按下接通
      activatingDevice: true,
      localStream: null,
      displayStream: null,
      remoteStream: null,
      prefix: "",
      pc: null,
      ws: null,
      user: "",
      name: "",
      shareState: 0,
      commandChannel: null,
      // 是否凍結視窗中
      isPaused: false,
      // 是否開手電筒中
      isTurnOn: false,
      // 是否靜音
      isMuted: false,
      // 是否正在挑選標註顏色中
      isChoosingColor: false,
      // 是否正在挑選標註工具中
      isChoosingTool: false,
      // 已選擇的標註顏色對應的ID
      selectedColorId: 2,
      // 標註顏色列表
      colorList: [
        { id: 0, name: "blue", color: "brush-blue", colorCode: "#00b7ff" },
        { id: 1, name: "red", color: "brush-red", colorCode: "#ff0000" },
        { id: 2, name: "magenta", color: "brush-magenta", colorCode: "#ff00cc" },
        { id: 3, name: "orange", color: "brush-orange", colorCode: "#ff6600" },
        { id: 4, name: "black", color: "brush-black", colorCode: "#000" },
        { id: 5, name: "yellow", color: "brush-yellow", colorCode: "#ffff00" },
        { id: 6, name: "white", color: "brush-white", colorCode: "#eee" },
        { id: 7, name: "green", color: "brush-green", colorCode: "#009933" },
      ],
      // 標註顏色列表
      arrowColorList: [
        "arrow-blue",
        "arrow-red",
        "arrow-magenta",
        "arrow-orange",
        "arrow-black",
        "arrow-yellow",
        "arrow-white",
        "arrow-green",
      ],
      messageIdList: [
        { id: 1, name: "MSG_ENV_SAVING", desc: "空間環境儲存中，請稍候再標註！" },
        { id: 2, name: "MSG_NO_FEATURE_POINTS", desc: "此處無特徵點，無法標註" },
        { id: 3, name: "MSG_ANNOTATION_TOO_LONG", desc: "標註線段太長或太複雜了，請重新標註" },
        { id: 4, name: "MSG_NEED_ENV_LEARNING", desc: "此區域需加強環境學習，請先前後移動裝置再繪製" },
        { id: 5, name: "MSG_WAIT_ENV_LEARNING", desc: "等待對方將鏡頭轉向先前分享的畫面以恢復標註位置。" },
        { id: 6, name: "MSG_ENV_LEARNING_DONE", desc: "標註已歸位！" },
        { id: 7, name: "MSG_PAUSE_SHARING", desc: "對方已停止分享畫面，請稍候！" },
        { id: 8, name: "MSG_RESUME_SHARING", desc: "對方繼續分享畫面" },
        { id: 9, name: "MSG_ANNOTATION_TOO_SHORT", desc: "標註太短，請重試" },
        { id: 10, name: "MSG_ANNOTATION_TOO_FAST", desc: "標註速度過快，請再畫一次" },
      ],
      loading: true,
      // 是否全選標註總覽截圖
      selectAll: false,
      // 是否全不選標註總覽截圖
      emptySelect: false,
      // alert消失總秒數
      dismissSecs: 3,
      // alert消失倒數秒數
      dismissCountDown: 0,
      // alert消失倒數秒數(錄影下載)
      dismissCountDownRecord: 0,
      // alert暫停分享秒數
      dismissCountDownPaused: 0,
      // 手電筒提示字
      torchTip: 0,
      // 是否正在標註
      isDrawing: false,
      // 畫圖的筆劃寬度
      lineWidth: 5,
      // 多少距離畫一個點
      minimumLength: 5,
      // 標註截圖
      captures: [],
      // 標註指標列表，用於顯示箭頭
      pointers: [],
      // 是否為眼鏡端畫面
      isGlasses: false,
      //是否變換為標註游標
      changeCursor: false,
      // 是否為遠端來源
      isShowRemote: true,
      localStreamType: 1,
      povLocked: false,
      // 是否正在分享畫面
      isSharing: false,
      hasARCore: true,
      // 是否取消
      isCancel: false,
      // 是否正在錄影畫面
      isRecording: false,
      // 是否正在傳送檔案
      isSendingFile: false,
      // 檔案傳送進度
      sendingRate: 0,
      // 1:等待對方接收檔案 2:傳送檔案中 3:檔案傳送完成 4:被拒絕or格式錯誤
      transferStep: 0,
      // 傳送檔案名稱
      sendFileName: null,
      // 傳送檔案大小
      sendFileSize: null,
      // 傳送檔案modal標題
      sendFileTitle: null,
      // 傳送檔案modal flag
      sendFileModal: false,
      // 分享端暫停分享現場畫面
      isAppPaused: false,
      // 語系預設使用中文0，英文1，簡中2
      lang: 0,
      // for debug
      framerate: 0,
      hasFramerate: false,
      // hasFramerate: $config.env == "development",
      videoTrack: null,
      // 是否可標註下一筆
      canAddLine: true,
      audioRing: false,
      isDownloading: false,
      endTime: null,
      remainSecs: 0,
      remainMins: 0,
      showMessage: "",
      // 是否在標註總攬接到來電
      isCalling: false,
      receiveCallData: {},
      downloadProgress: 0,
      drawFunction: 0,
    }),
    created() {
      window.test = this;
      if (!("WebSocket" in window)) {
        this.$alert("此瀏覽器不支援Web Socket連線");
        this.toContact();
      }
      window.onbeforeunload = (env) => {
        console.log("onbeforeunload");
        this.closeAll();
      };

      this.token = this.$cookies.get("token");
      if (!this.token) this.$router.push({ name: "Login" });
      this.userinfo = this.$cookies.get("user");
      if (!this.userinfo) this.$router.push({ name: "Login" });

      // user leaves the tab
      document.addEventListener("blur", this.blur);
      // user enters the tab (again)
      document.addEventListener("focus", this.focus);

      let query = this.$route.query || {};
      this.user = this.userinfo.account;
      this.name = this.userinfo.name;

      this.initPC();

      this.targetName = this.callName || query.callName;
      this.$changeTitle(this.targetName);
      this.targetAccount = this.callAccount || query.callAccount;
      this.accept = query.accept == "1";

      // 若是推播進來，會有uuid
      this.roomUuid = this.callRoomUUID || query.callRoomUUID;
      //如果caller沒有螢幕則為0，代表是Web端撥打
      this.isShowCallerScreen = (this.showCallerScreen || query.showCallerScreen) == "1";
      this.isGlasses = (this.deviceType || query.deviceType) == "3";

      this.initialCanvasFunctions();
      if (this.isGlasses) this.changeDrawFunction(0);
      else this.changeDrawFunction(-1);

      if (!this.targetName || !this.targetAccount) return this.toContact();
      this.prefix = this.targetName.slice(0, 1);
      // window.onbeforeunload = (env) => {
      //   // if (!this.beforeDestroy) this.leaveRoom();
      //   // return "message here";
      // };
      // window.onbeforeunload = closing;
      // /* other code here */

      // var closing = function() {
      //   console.log("function alrt WORKS !!!!");
      //   window.alert("closing now.....");
      // };
      if (this.roomUuid) {
        // 設定自動拒絕
        this.timer = setTimeout(() => {
          console.log("calling timeout reject");
          this.sendDecline();
          this.toContact();
        }, 30000);
      }
      this.initWS();
    },
    mounted() {
      this.initialReferences();
      this.createResizeObserver();
      this.lang = parseInt(this.$cookies.get("language")) || constants.Lang.CHINESE;
      this.changeTitle();

      // for debug
      this.framerateInterval = setInterval(() => {
        let framerate = (this.videoTrack && this.videoTrack.getSettings().frameRate) || 0;
        this.framerate = parseInt(framerate * 10) / 10 || "--";
      }, 100);
    },
    beforeDestroy() {
      this.closeAll();
    },
    blur() {},
    focus() {},
    destroyed() {
      // user leaves the tab
      document.removeEventListener("blur", this.blur);
      // user enters the tab (again)
      document.removeEventListener("focus", this.focus);
    },
    methods: {
      //#region Initialize
      async initUserMedia() {
        return navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then((stream) => {
            if (!stream) throw "Stream not found";
            this.activatingDevice = false;
            this.localStream = stream;
          })
          .catch((error) => {
            console.error("Error:" + error.name);
            this.$alert(this.$t("CALL.CALL.PERMISSION"));
            // this.$alert("您尚未開啟權限，請先開啟通知與麥克風權限，重新整理頁面後才可接聽來電。可參考以下連結做設定。");
            this.localStream = null;
          });
      },
      async initDisplayMedia(option) {
        return navigator.mediaDevices
          .getDisplayMedia(option)
          .then((stream) => {
            if (!stream) throw "Stream not found";
            this.displayStream = stream;
            stream.getVideoTracks()[0].onended = () => {
              this.stopShowDesktop();
            };
            for (let track of this.remoteStream.getAudioTracks()) {
              this.displayStream.addTrack(track);
            }
          })
          .catch((error) => {
            console.error("Error:" + error.name);
            this.displayStream = null;
          });
      },
      initFileChannel(fileChannel) {
        let that = this;
        this.initDataChannel(fileChannel);
        fileChannel.onmessage = (event) => typeof event.data === "string" && this.handleDataMessage(event.data);
        fileChannel.bufferArray = [];
        fileChannel.bufferedAmountLowThreshold = CHUNK_SIZE / 2;
        fileChannel.sendSnapshot = function(data) {
          if (this.bufferArray.length > 0) {
            this.$alert(this.$t("CALL.CALL.FILE_TRANSFER_NOT_COMPLETED"));
            return;
          }
          if (data.indexOf(",") > 0) data = data.split(",")[1];
          let len = data.length;
          let chunkCount = Math.ceil(len / CHUNK_SIZE);

          this.trySend(`--${chunkCount}`);
          for (let i = 0; i < chunkCount; i++) {
            let end = Math.min((i + 1) * CHUNK_SIZE, len);
            let chunk = data.substring(i * CHUNK_SIZE, end);
            this.trySend(chunk);
          }
        };
        fileChannel.addFileAndWait = function(data, filename) {
          if (this.bufferArray.length > 0) {
            this.stop();
            that.cmdFileTransferStop();
          }
          if (data.indexOf(",") > 0) data = data.split(",")[1];
          let len = data.length;
          this.chunkCount = Math.ceil(len / CHUNK_SIZE);
          // 先送檔名

          this.trySend(`--${this.chunkCount}--${filename}`);
          for (let i = 0; i < this.chunkCount; i++) {
            let end = Math.min((i + 1) * CHUNK_SIZE, len);
            let chunk = data.substring(i * CHUNK_SIZE, end);
            this.bufferArray.push(chunk);
          }
        };

        fileChannel.accept = function() {
          that.sendingRate = 0;
          this.transInterval = setInterval(() => {
            this.appendChunks();
          }, 50);
          that.isSendingFile = true;
        };
        fileChannel.reject = function() {
          this.end();
        };
        fileChannel.stop = function() {
          that.sendFileModal = false;
          this.end();
        };
        fileChannel.success = function() {
          that.transferStep = 3;
          that.sendFileTitle = that.$t("CALL.CALL.SEND_FILE_COMPLETED");
          setTimeout(() => {
            that.sendFileModal = false;
          }, 2000);
          this.end();
        };
        fileChannel.end = function() {
          this.bufferArray = [];
          that.isSendingFile = false;
          that.sendingRate = 0;
          that.sendFileName = null;
          that.sendFileSize = null;
          clearInterval(this.transInterval);
        };

        fileChannel.appendChunks = function() {
          if (!this.bufferArray.length) return this.success();
          this.trySend(this.bufferArray.shift());
          that.sendingRate = ((1 - this.bufferArray.length / this.chunkCount) * 100).toFixed(0);
        };
      },
      initCommandChannel(commandChannel) {
        commandChannel.onmessage = (event) => {
          (event.data instanceof ArrayBuffer && this.handleCommand(new Float64Array(event.data))) ||
            (typeof event.data === "string" && this.handleDataMessage(event.data));
        };
        this.initDataChannel(commandChannel);
      },
      initPC() {
        // for my share
        let pc = new RTCPeerConnection({
          iceServers: this.$config.iceServers,
        });
        this.pc = pc;

        pc.addEventListener("icecandidate", (event) => {
          // setTimeout(() => {
          if (!event || !event.candidate) return;

          let candidate = event.candidate;
          let payload = {
            sdp: candidate.candidate,
            sdpMid: candidate.sdpMid,
            sdpMLineIndex: candidate.sdpMLineIndex,
          };
          this.ws.sendMessage("IceCandidate", payload);
          // }, 10);
        });
        pc.addEventListener("track", this.gotRemoteStream);
        pc.addEventListener("datachannel", (event) => {
          if (!event.channel) return;
          let label = event.channel && event.channel.label;
          if (label == "data") {
            this.fileChannel = event.channel;
            this.initFileChannel(this.fileChannel);
          } else {
            this.commandChannel = event.channel;
            this.initCommandChannel(this.commandChannel);
          }
        });
        this.commandChannel = this.pc.createDataChannel("WebRTCData");
        this.initCommandChannel(this.commandChannel);

        pc.onconnectionstatechange = () => {
          switch (pc.connectionState) {
            case "connected":
              // The connection has become fully connected

              break;
            // One or more transports has terminated unexpectedly or in an error
            case "disconnected":
            case "failed":
            case "closed":
              // The connection has been closed
              console.log(this.$t("CALL.CALL.DISCONNECTED"));
              this.closeCall();
              break;
          }
        };
        pc.oniceconnectionstatechange = function(event) {};
        pc.onicecandidateerror = (e) => {
          console.error(e);
        };

        // 接收分享端指令
        pc.functions = {
          [CMD_STATE]: this.receiveState,
          [CMD_HANGUP]: this.receiveHangup,
          [CMD_ARROW]: this.receiveArrow,
          [CMD_TORCH]: this.receiveTorch,
          [CMD_PAUSE]: this.receivePause,
          [CMD_RESUME]: this.receiveResume,
          [CMD_SCREENSHOT_END]: this.receiveScreenshotEnd,
          [CMD_SCREEN_SHARE]: this.receiveShowDesktop,
          [CMD_STOP_SCREEN_SHARE]: this.receiveStopShowDesktop,
          [CMD_MESSAGE]: this.receiveMessage,
          [CMD_FILE_TRANSFER_STOP]: this.receiveFileTransferStop,
          [CMD_FILE_TRANSFER_ACCEPT]: this.receiveFileTransferAccept,
          [CMD_FILE_TRANSFER_REJECT]: this.receiveFileTransferReject,
          [CMD_APP_PAUSE]: this.receiveAppPause,
          [CMD_APP_RESUME]: this.receiveAppResume,
          [CMD_SNAPSHOT]: this.receiveSnapshot,
          [CMD_TRIAL_END]: this.receiveTrialEnd,
        };
      },
      initWS() {
        let timeout = setTimeout(() => {
          if (!this.isClose) {
            this.$alert("建立連線失敗");
            this.toContact();
          }
        }, 10000);
        let url = `${this.$ws}/signaling`;
        let ws = new WebSocket(url);
        this.ws = ws;

        ws.onopen = () => {
          clearTimeout(timeout);
          console.log(`this.roomUuid = ${this.roomUuid}`);
          // 已有房間號碼代表是對方播打
          if (this.roomUuid) {
            // 聲音響
            this.audioRing = true;
            // 若無房間號則開啟播打通話頁面

            if (!this.isShowCallerScreen) {
              this.sendDecline("3");
              this.$alert(this.$t("CALL.CALL.UNSUPPORTED"));
              return this.toContact();
            } // 顯示待接通畫面
            this.callingStep = 3;

            this.initUserMedia().then(() => {
              if (!this.localStream) {
                this.sendDecline("2");
                return this.toContact();
              }
              if (this.accept) {
                this.acceptCall();
              }
            });
            // 奇怪的錯誤訊息
          } else {
            if (!this.targetAccount) this.toContact();
            else {
              this.initUserMedia().then(() => {
                if (!this.localStream) return this.toContact();
                this.isCall = true;
                ws.sendMessage("Call", { token: this.token, target: this.targetAccount, showCallerScreen: 0 });
              });
            }
          }
        };
        ws.onclose = () => {
          console.log("onclose");
        };
        // ws.onclose = () => console.log("websocket closed");
        ws.sendObj = (obj) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(obj));

        ws.sendMessage = (type, payload) => ws.sendObj({ type, payload });
        ws.onError = (err) => console.log(err.toString());
        ws.onmessage = function(evt) {
          if (evt.data instanceof Blob) {
            let reader = new FileReader();
            reader.onload = () => this.handleMessage(reader.result);
            reader.readAsText(evt.data);
          } else this.handleMessage(evt.data);
        };
        ws.handleMessage = function(result) {
          try {
            let data = JSON.parse(result);
            let type = data.type;
            let payload = data.payload;
            console.log(`receive websocket message type: ${type}`);
            if (this[type]) this[type](payload);
            else console.log(JSON.stringify(data));
          } catch (e) {
            console.log(e);
            console.log(result);
          }
        };
        ws["CallResp"] = ({ Code, RData: { uuid } }) => {
          console.log({ Code, uuid });
          if (Code != 0) {
            this.$alert(this.getMessage(Code));
            return this.toContact();
          }
          this.roomUuid = uuid;
        };
        ws["AcceptResp"] = async ({ Code }) => {
          console.log("AcceptResp");
          if (Code != 0) {
            this.$alert(this.getMessage(Code));
            return this.toContact();
          }
          this.setVideoTrack(this.emptyCv.captureStream());
          this.setAudioTrack(this.localStream);
          let offer = await this.pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });

          await this.pc.setLocalDescription(offer);

          console.log("sendSDP");
          this.sendSDP(offer);
        };
        ws["DeclineResp"] = ({ Code, RData }) => {
          if (Code != 0) {
            this.$alert(this.getMessage(Code));
            return this.toContact();
          }
          if (this.step == 0) this.toContact();
        };
        ws["CancelResp"] = ({ Code, RData }) => {
          if (Code != 0) this.$alert(this.getMessage(Code));
          this.callingStep = 2;
          setTimeout(this.toContact, 3000);
        };
        ws["SessionDescription"] = (payload) => {
          if (payload.type == "offer") this.receiveOffer(payload);
          else this.receiveAnswer(payload);
        };
        ws["IceCandidate"] = (payload) => {
          this.receiveIceCandidate(payload);
        };
      },
      initDataChannel(datachannel) {
        datachannel.onopen = function(event) {};
        datachannel.onclose = function(event) {};
        datachannel.trySend = function(data) {
          this.readyState == "open" && this.send(data);
        };
      },
      //#endregion

      //#region APIs

      // 0: busy, 1: reject, 2: ARCore unsupported, 3: Web unsupported
      sendDecline(reason = "1", roomUuid) {
        console.log(`sendDecline reason ${reason}`);
        // return this.apiPost("call/decline", { call_room_uuid: this.roomUuid, reason }).catch(this.toContact);

        this.ws.sendMessage("Decline", {
          token: this.token,
          roomGuid: roomUuid || this.roomUuid,
          reason,
        });
      },
      //#endregion

      //#region WebRTC Connection
      sendSDP(sdp) {
        this.ws.sendMessage("SessionDescription", { type: sdp.type, sdp: sdp.sdp });
      },
      setVideoSource() {
        //遠端來源
        if (this.isShowRemote) this.video.srcObject = this.remoteStream;
        //本地螢幕分享
        else if (!this.isShowRemote && this.displayStream) this.video.srcObject = this.displayStream;
        //本地來源(不會出現)
        else if (!this.isShowRemote && this.localStream) this.video.srcObject = this.localStream;
        else this.video.srcObject = null;
      },
      gotRemoteStream(event) {
        if (event.streams && event.streams[0]) {
          if (!this.remoteStream) this.remoteStream = event.streams[0];
          else {
            let tracks = event.streams[0].getTracks();
            if (tracks) {
              for (let track of tracks) this.remoteStream.addTrack(track);
            }
          }
        } else {
          if (this.remoteStream) this.remoteStream.addTrack(event.track);
          else this.remoteStream = new MediaStream(event.track);
        }

        this.videoTrack = this.remoteStream && this.remoteStream.getVideoTracks()[0];

        this.setVideoSource();
      },
      gotRemoteDescription(description) {
        this.pc.setRemoteDescription(description);
      },
      // cancel when step 0
      cancelCall() {
        this.resetTitle();
        // 1:等待分享畫面
        if (this.callingStep == 1) return this.hangup(true);

        if (this.isCancel) return;
        this.isCancel = true;
        // 0:等待接通
        if (this.callingStep == 0) {
          if (this.roomUuid) this.ws.sendMessage("Cancel", { token: this.token });
        }
        // 3:等待確認
        else if (this.callingStep == 3) {
          this.sendDecline();
          this.toContact();
        } else this.toContact();
      },
      // every scenario that stop the call
      closeCall() {
        if (this.isClose) return;
        this.isClose = true;
        // 接聽畫面
        if (this.step == 0) {
          this.cancelCall();
        } else if (this.step == 1) {
          this.hangup(true);
          // } else if (this.step == 2) {
        }
        this.resetTitle();
      },

      closeAll() {
        this.closeCall();

        if (this.pc && this.pc.connectionState != "closed") this.pc.close();
        this.stopTrack(this.localStream);
        this.stopTrack(this.displayStream);
        if (this.video) this.video.srcObject = null;
        if (this.commandChannel) this.commandChannel = null;
        if (this.fileChannel) this.fileChannel = null;

        this.resetTitle();
        clearTimeout(this.timer);
        clearInterval(this.recordInterval);
        clearInterval(this.framerateInterval);
        clearInterval(this.transInterval);
      },

      async receiveOffer(payload) {
        await this.pc.setRemoteDescription(new RTCSessionDescription(payload));
        this.setVideoTrack(this.emptyCv.captureStream());
        this.setAudioTrack(this.localStream);
        let answer = await this.pc.createAnswer();
        this.removeVideoTrack();
        await this.pc.setLocalDescription(answer);
        this.sendSDP(answer);
      },
      async receiveAnswer(payload) {
        this.pc.setRemoteDescription(new RTCSessionDescription(payload)).catch(this.onError);
      },
      receiveIceCandidate(payload) {
        this.pc
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: payload.sdp,
              sdpMLineIndex: payload.sdpMLineIndex,
              sdpMid: payload.sdpMid,
            })
          )
          .then(
            () => {},
            (data = {}) => {}
          );
      },

      removeVideoTrack() {
        var sender = this.pc.getSenders().find(function(s) {
          return s && s.track && s.track.kind == "video";
        });
        // this.pc.removeTrack(sender);
      },

      setVideoTrack(stream) {
        if (stream) {
          let videoTrack = stream.getVideoTracks()[0];
          if (!videoTrack) return;

          var sender = this.pc.getSenders().find(function(s) {
            return s && s.track && s.track.kind == videoTrack.kind;
          });
          if (sender) {
            sender.replaceTrack(videoTrack);
          } else {
            this.pc.addTrack(videoTrack);
          }
        }
      },

      setAudioTrack(stream) {
        if (stream) {
          let audioTrack = stream.getAudioTracks()[0];
          if (!audioTrack) return;

          var sender = this.pc.getSenders().find(function(s) {
            return s && s.track && s.track.kind == audioTrack.kind;
          });
          if (sender) sender.replaceTrack(audioTrack);
          else this.pc.addTrack(audioTrack);
        }
      },

      stopTrack(stream) {
        if (stream && stream.active) {
          stream.getTracks().forEach((track) => track.stop());
        }
        stream = null;
      },

      onError(error, data) {
        // if (error) console.log(`Error: ${error.toString()}`);
        // if (data) console.log(JSON.stringify(data));
      },

      async acceptCall() {
        console.log(`acceptCall`);
        // 接聽後聲音就消失
        this.audioRing = false;
        if (this.loading) this.loading.style.display = "none";
        this.callingStep = 4;

        this.ws.sendMessage("Accept", { token: this.token, roomGuid: this.roomUuid });
      },

      async hangup(isSend) {
        if (this.isHangup) return;
        this.isHangup = true;
        if (this.isPaused) {
          this.saveAndClearCanvas();
          this.isPaused = false;
        }
        if (isSend) this.sendCommand(CMD_HANGUP);
        if (this.isRecording) {
          this.btnStopRecording();
        }
        this.ws.sendMessage("Leave", {
          tagCount: this.captures.length,
        });
        this.finishCall();
      },

      async showDesktop() {
        // 非眼鏡不能用
        if (this.isPaused || this.isSendingFile || this.isAppPaused) return;

        // get display screen
        await this.initDisplayMedia();

        // if don't get stream or stream is not available then return
        if (!this.displayStream) return;
        // send command
        this.cmdScreenShare();
        // set flag to show local
        this.isShowRemote = false;
        // set local video showing stream
        this.setVideoSource();
        // set peerconnection track
        this.setVideoTrack(this.displayStream);
        // set flag to toggle sharing status
        this.isSharing = true;
      },

      async stopShowDesktop() {
        if (!this.isSharing) return;
        // set flag to toggle sharing status
        this.isSharing = false;
        // 非眼鏡不能用
        if (!this.isGlasses) return;
        // send command

        this.cmdScreenStopShare();
        // stop display stream's tracks
        if (this.displayStream) this.stopTrack(this.displayStream);
        this.isShowRemote = true;
        // set local video showing stream
        this.setVideoSource();
        // set peerconnection track to local stream
        // this.setVideoTrack(this.localStream);
        this.setVideoTrack(this.emptyCv.captureStream());
      },

      showFileDialog(e) {
        if (this.isAppPaused) return;
        if (this.$refs.selectFile.value.length == 0) {
          this.transferStep = 1;
          this.selectFile.click();
          this.isSendingFile = true;
          this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_WAITING");
          this.sendFileModal = true;
        }
      },

      selectFileToSend(e) {
        let validExts = new Array(".pdf", ".jpg", ".jpeg", ".png");

        let file = e.target && e.target.files[0];
        if (file) {
          // 檢查檔案格式是否合法
          let fileExt = file.name;
          fileExt = fileExt.substring(fileExt.lastIndexOf("."));
          if (validExts.indexOf(fileExt) < 0) {
            this.isSendingFile = false;
            this.transferStep = 4;
            return (this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_INVALID"));
          } else if (file.size > 25 * 1024 * 1024) {
            this.isSendingFile = false;
            this.transferStep = 4;
            return (this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_EXCEEDED"));
          } else {
            this.readFileContent(this.selectFile)
              .then((result) => {
                this.sendFile(result, file.name);
                e.target.value = "";
              })
              .catch((err) => {});
          }
        }
      },

      stopSendingFile() {
        if (this.fileChannel) {
          this.fileChannel.stop();
          this.cmdFileTransferStop();
          this.isSendingFile = false;
          this.sendingRate = 0;
          this.sendFileName = null;
          this.sendFileSize = null;
          this.transferStep = 0;
          this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_CANCELLED");
        }
        this.sendFileModal = false;
        this.$refs.selectFile.value = null;
      },

      async readFileContent(ref) {
        return new Promise((resolve, reject) => {
          if (ref && ref.files && ref.files[0]) {
            let reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            reader.readAsDataURL(ref.files[0]);
          } else reject();
        });
      },

      receiveDecline(data) {
        this.toContact();
        if (this.isCalling) this.isCalling = false;
      },

      receiveCall(data) {
        if (this.step !== 2) {
          this.sendDecline("0");
          return this.toContact();
        }
        // show dialog
        else {
          this.isCalling = true;
          this.receiveCallData = data;
        }
      },

      acceptCallInCapture(accept) {
        if (accept) {
          this.receiveCallData.accept = "1";
          window.location.href =
            location.href.split("?")[0] +
            "?" +
            Object.keys(this.receiveCallData)
              .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(this.receiveCallData[key])}`)
              .join("&");
          this.isCalling = false;
        } else {
          this.isCalling = false;
          return this.sendDecline("0", this.receiveCallData.callRoomUUID);
        }
      },
      //#endregion

      //#region Commands
      sendCommand() {
        /* if (arguments[0] != 0) */
        let ab = new Float64Array(arguments).buffer;
        if (this.commandChannel) this.commandChannel.trySend(ab);
      },

      sendSnapshot() {
        this.handlingData = true;

        var canvas = document.createElement("canvas");
        let ratio = SNAPSHOT_RESOLUTION / this.video.videoHeight;
        canvas.width = this.video.videoWidth * ratio;
        canvas.height = this.video.videoHeight * ratio;
        canvas.getContext("2d").drawImage(this.video, 0, 0, canvas.width, canvas.height);

        let data = canvas.toDataURL("image/jpeg", SNAPSHOT_COMPRESS_RATIO);

        if (this.fileChannel) this.fileChannel.sendSnapshot(data);
      },

      sendFile(data, filename) {
        this.sendFileName = filename;
        this.sendFileSize = new Blob([data]).size;
        if (this.fileChannel) {
          this.fileChannel.addFileAndWait(data, filename);
        } else {
          return;
        }
      },

      handleCommand(command) {
        console.log(`receive command`, command);
        let func = this.pc.functions[command[0]];
        if (func) {
          func(...command.slice(1));
        } else console.log(command[0]);
      },

      handleDataMessage(msg) {
        // if timeout, data receive will stop
        if (this.dataMessageTimer) clearTimeout(this.dataMessageTimer);
        this.dataMessageTimer = setTimeout(() => {
          this.handlingData = false;
        }, 3000);

        if (msg.indexOf("--") == 0) {
          this.handlingData = true;
          this.dataChunkBuffer = [];
          this.dataChunksize = +msg.split("--")[1];
        } else if (this.handlingData) {
          this.dataChunkBuffer.push(msg);
          if (this.dataChunkBuffer.length == this.dataChunksize) {
            let image = new Image();
            image.onload = () => {
              this.resizeCanvas();
              this.ctx.drawImage(image, 0, 0, this.cv.width, this.cv.height);
              this.backupCanvas();

              // this.cmdRemoteViewSize(cv.width, cv.height);
            };
            let data = this.dataChunkBuffer.join("");

            image.src = "data:image/jpg;base64," + data;

            this.handlingData = false;
            if (this.dataMessageTimer) clearTimeout(this.dataMessageTimer);
            this.cmdScreenshotEnd();
            this.isPaused = true;
          }
        } else return;
      },

      receiveState(shareState) {
        this.shareState = shareState;

        // 已學習完畢
        if (this.shareState == ARSTATE_TAG) {
          if (this.isGlasses) {
            if (this.isPaused) {
              this.changeCursor = true;
            } else {
              this.changeCursor = false;
            }
          } else {
            this.changeCursor = true;
          }
          this.dismissCountDown = this.dismissSecs;
          // 體驗版時間為30分鐘
          this.endTime = Math.floor(new Date() / 1000 + 1800);
          let t = setInterval(() => {
            let remainTime = Math.floor(this.endTime - new Date() / 1000);
            this.remainMins = Math.floor(remainTime / 60);
            this.remainSecs = remainTime - this.remainMins * 60;
            if (remainTime == 0) {
              return clearInterval(t);
            }
          }, 1000);
        } // 學習中
        else if (this.shareState == ARSTATE_LEARN) {
          if (this.step == 0) {
            this.dismissCountDown = this.dismissSecs;
            this.step = 1;
          }
        } // 等待分享
        else if (this.shareState == ARSTATE_SHARE) {
          clearTimeout(this.timer);
          this.callingStep = 1;
          this.resetTitle();
        }
      },

      receiveHangup() {
        this.hangup(false);
      },

      receiveArrow(isRemote, serial, visible, colorIndex, oldPosX, oldPosY, newPosX, newPosY) {
        let sn = (isRemote ? "r" : "l") + serial;
        let existItem = null;
        let existIndex = -1;
        for (let i = 0; i < this.pointers.length; i++) {
          if (this.pointers[i].sn == sn) existIndex = i;
        }
        if (!visible) {
          if (existIndex > -1) this.pointers.splice(existIndex, 1);
        } else {
          let data = { sn, isRemote, serial, visible, colorIndex, oldPosX, oldPosY, newPosX, newPosY };
          let that = this;
          data.setPosition = function() {
            if (this.newPosX === 0) this.left = 0;
            // else this.left = this.$refs["arrow-section"].offsetWidth - 18;
            else this.left = that.video.offsetWidth - 18;
            if (this.newPosY === 0) this.top = 0;
            // else this.top = (this.$refs["arrow-section"].offsetHeight - 48) * this.newPosY;
            else this.top = (that.video.offsetHeight - 48) * this.newPosY;
          };
          data.setPosition();
          if (existIndex > -1) this.pointers[existIndex] = data;
          else this.pointers.push(data);
        }
      },

      receiveTorch(isTurnOn, torchTip) {
        this.isTurnOn = isTurnOn;
        this.torchTip = torchTip;
        if (torchTip != 0) this.dismissCountDown = this.dismissSecs;
      },

      receivePause() {
        // this.isPaused = true;
      },

      receiveResume() {
        console.log("CMD_RESUME");
        if (this.isDrawing) {
          this.isDrawing = false;
        }
        if (this.isGlasses) {
          tagPaths.push(tagLines);
          tagLines = [];
        }
        this.saveAndClearCanvas();
        this.isPaused = false;
      },

      receiveScreenshotEnd() {
        this.handlingData = false;
        // can do tag
      },

      receiveShowDesktop() {
        this.showDesktop();
      },

      receiveStopShowDesktop() {
        this.stopShowDesktop();
      },

      receiveMessage(message_id, duration) {
        let undoList = [1, 2, 3, 4, 9, 10];
        let receivedMsg = this.messageIdList.find((item) => item.id == message_id);
        console.log(message_id);
        if (undoList.includes(receivedMsg.id)) {
          this.showMessage = receivedMsg.desc;
          this.dismissCountDown = this.dismissSecs;

          this.undo(false);
          this.canAddLine = true;
        } else if (receivedMsg.id == 5) {
          // 等待環境學習
          this.canAddLine = true;
        } else if (receivedMsg.id == 7) {
          // 暫停分享畫面 (此alert不會消失直到繼續分享畫面)
          this.dismissCountDownPaused = 1800;
          this.canAddLine = false;
        } else if (receivedMsg.id == 8) {
          // 繼續分享畫面
          this.dismissCountDownPaused = 0;
          this.canAddLine = true;
        } else console.log(`not found message id ${message_id}`);
      },

      receiveFileTransferStop() {
        this.fileChannel && this.fileChannel.stop();
      },

      receiveFileTransferAccept() {
        this.transferStep = 2;
        this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_PROCESSING");
        this.fileChannel.accept();
      },

      receiveFileTransferReject() {
        this.transferStep = 4;
        this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_DECLINE");
        this.fileChannel.reject();
      },

      receiveAppPause() {
        this.isAppPaused = true;
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "24px Arial";
        this.ctx.fillText(this.targetName + this.$t("CALL.CALL.APP_PAUSE"), this.cv.width / 2, this.cv.height / 2);
      },

      receiveAppResume() {
        this.isAppPaused = false;
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
      },

      receiveSnapshot() {
        if (!this.isGlasses && !this.isPaused) {
          console.log("receiveSnapshot");
          this.saveAndClearCanvas();
        }
        this.canAddLine = true;
      },

      receiveTrialEnd() {
        this.hangup(true);
        this.$bvModal.show("trialEndModal");
      },
      //#region draw line

      cmdLockPov() {
        this.povLocked = true;
        this.shareState == ARSTATE_TAG && this.sendCommand(CMD_LOCK_RMT_POV);
      },

      cmdUnlockPov() {
        this.povLocked = false;
        this.shareState == ARSTATE_TAG && this.sendCommand(CMD_UNLOCK_RMT_POV);
      },

      cmdScreenshotEnd() {
        this.shareState == ARSTATE_TAG && this.sendCommand(CMD_SCREENSHOT_END);
      },

      cmdPause() {
        this.shareState == ARSTATE_TAG && this.sendCommand(CMD_PAUSE);
      },

      cmdResume() {
        this.shareState == ARSTATE_TAG && this.sendCommand(CMD_RESUME);
      },

      cmdScreenShare() {
        this.sendCommand(CMD_SCREEN_SHARE);
      },

      cmdScreenStopShare() {
        this.sendCommand(CMD_STOP_SCREEN_SHARE);
      },

      cmdFileTransferStop() {
        this.sendCommand(CMD_FILE_TRANSFER_STOP);
      },

      cmdScreenRecord() {
        this.sendCommand(CMD_SCREEN_RECORD);
      },

      cmdScreenRecordStop() {
        this.sendCommand(CMD_SCREEN_RECORD_STOP);
      },

      cmdAddLine(type, x, y, color) {
        if (this.shareState == ARSTATE_TAG) this.sendCommand(CMD_LINE, 1, color, x, y, type);
      },
      cmdAddGlassLine(type, x1, y1, x2, y2, color) {
        let w = this.cv.width,
          h = this.cv.height;
        (x1 /= w), (x2 /= w), (y1 /= h), (y2 /= h);

        if (this.shareState == ARSTATE_TAG) this.sendCommand(CMD_GLASS_LINE, color, x1, y1, x2, y2, type);
      },

      cmdRemoteViewSize(width, height) {
        console.log(`cmdRemoteViewSize ${width} ${height}`);
        this.sendCommand(CMD_REMOTE_VIEW_SIZE, width, height);
      },

      cmdShareReady() {
        // 作為iOS判斷依據
        this.sendCommand(ARSTATE_SHARE);
      },
      onMouseDown(e) {
        e.preventDefault();
        //關閉標註選擇盤
        this.isChoosing = false;
        // if still not allow tag
        if (this.shareState != ARSTATE_TAG) return;
        // if (!this.canAddLine) return this.$alert("請稍後再標註!!");
        if (!this.canAddLine) return console.log(this.$t("CALL.CALL.APP_ADDLINE_ALERT"));

        if (this.isGlasses && !this.isPaused) return;

        this.isDrawing = true;

        if (e.type == "touchstart") {
          const rect = e.target.getBoundingClientRect();
          const offsetX = e.touches[0].clientX /* - window.pageXOffset*/ - rect.left;
          const offsetY = e.touches[0].clientY /* - window.pageYOffset*/ - rect.top;
          var x = /*e.target.offsetLeft +*/ offsetX;
          var y = /*e.target.offsetTop +*/ offsetY;
        } else {
          x = e.target.offsetLeft + e.offsetX - this.cv.offsetLeft;
          y = e.target.offsetTop + e.offsetY - this.cv.offsetTop;
        }

        mousedown(x, y);
      },
      onMouseMove(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        if (e.target == this.cvCover) {
          if (e.type == "touchmove") {
            const rect = e.target.getBoundingClientRect();
            const offsetX = e.touches[0].clientX /*- window.pageXOffset */ - rect.left;
            const offsetY = e.touches[0].clientY /*- window.pageYOffset */ - rect.top;
            var x = /*e.target.offsetLeft +*/ offsetX;
            var y = /*e.target.offsetTop +*/ offsetY;
          } else {
            x = e.target.offsetLeft + e.offsetX - this.cv.offsetLeft;
            y = e.target.offsetTop + e.offsetY - this.cv.offsetTop;
          }

          if (x >= 0 && y >= 0 && x <= this.cv.offsetWidth && y <= this.cv.offsetHeight) return mousemove(x, y);
        }
        this.isDrawing = false;
        mouseup();
      },
      onMouseUp(e) {
        e.preventDefault();
        if (!this.isDrawing) return;
        if (e.type == "touchend") {
          mouseup();
        } else {
          let x = e.target.offsetLeft + e.offsetX - this.cv.offsetLeft;
          let y = e.target.offsetTop + e.offsetY - this.cv.offsetTop;
          this.isDrawing = false;
          // this.canAddLine = false;
          if (x >= 0 && y >= 0 && x <= this.cv.width && y <= this.cv.height) {
            mouseup(x, y);
          } else mouseup();
        }
      },

      getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      },

      drawVideoToCanvas() {
        console.log("drawVideoToCanvas");
        this.resizeCanvas();
        this.ctx.drawImage(this.video, 0, 0, this.cv.width, this.cv.height);
        // save current cv for recovering
        this.backupCanvas();
      },

      redrawCanvas() {
        this.recoverCanvas();
        for (let tagLines of tagPaths) {
          for (let tagLine of tagLines) this.drawTagLineToCanvas(this.ctx, tagLine);
        }
      },
      drawTagLineToCanvas(context, tagLine) {
        context.strokeStyle = this.colorList[tagLine.selectedColorId].colorCode;
        context.lineWidth = this.lineWidth;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();
        if (tagLine.type == LINE_OVAL) {
          context.ellipse(
            (tagLine.x1 + tagLine.x2) / 2,
            (tagLine.y1 + tagLine.y2) / 2,
            Math.abs(tagLine.x1 - tagLine.x2) / 2,
            Math.abs(tagLine.y1 - tagLine.y2) / 2,
            0,
            0,
            Math.PI * 2
          );
        } else {
          context.moveTo(tagLine.x1, tagLine.y1);
          context.lineTo(tagLine.x2, tagLine.y2);
        }

        context.stroke();
        context.closePath();
      },

      recoverCanvas() {
        if (!this.backupCv) return;

        this.cv.width = this.backupCv.width;
        this.cv.height = this.backupCv.height;
        this.ctx.drawImage(this.backupCv, 0, 0);
      },

      backupCanvas() {
        tagPaths = [];
        tagLines = [];
        if (!this.backupCv) this.backupCv = document.createElement("canvas");
        this.backupCv.width = this.cv.width;
        this.backupCv.height = this.cv.height;
        this.backupCtx.drawImage(this.cv, 0, 0);
      },
      drawToCtx(type, x1, y1, x2, y2, colorId = this.selectedColorId) {
        // 如果還沒有該使用者畫圖的資料
        // 開始的點，建立圖點陣列
        if (type == POINT_BEGIN || type == LINE_OVAL) {
          if (this.isPaused) {
            tagLines = [];
            tagPaths.push(tagLines);
          } else {
            this.drawVideoToCanvas();
          }
        }
        let tagLine = new TagLine(type, x1, y1, x2, y2, colorId);
        this.drawTagLineToCanvas(this.ctx, tagLine);
        tagLines.push(tagLine);

        if (this.drawFunction === -1 || this.drawFunction === 0) this.cmdAddLine(type, x2, y2, colorId);
        else this.cmdAddGlassLine(type, x1, y1, x2, y2, colorId);

        if (type == POINT_END && !this.isGlasses && !this.isPaused) this.cmdUnlockPov();
      },

      saveCanvas() {
        let dataUrl = this.cv.toDataURL("image/jpg");
        // let width = (this.videoTrack && this.videoTrack.getSettings().width) || 720;
        this.captures.push({ selected: true, dataUrl: dataUrl });
      },

      clearCanvas() {
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
      },
      clearCanvasCover() {
        this.ctxCover.clearRect(0, 0, this.cvCover.width, this.cvCover.height);
      },

      pause() {
        if (this.isPaused || !this.isGlasses || this.handlingData || !this.isShowRemote || this.isAppPaused) return;
        tagPaths = [];
        tagLines = [];
        this.isPaused = true;
        this.changeCursor = true;
        this.cmdPause();
        this.drawVideoToCanvas();
        this.sendSnapshot();
      },
      //#endregion

      resume() {
        console.log("resume");
        if (!this.isPaused) return;
        this.changeCursor = false;
        this.saveAndClearCanvas();
        if (this.isGlasses) this.cmdResume();
        else this.cmdUnlockPov();
      },

      saveAndClearCanvas() {
        console.log("saveAndClearCanvas");
        if (this.mouseDownTimer) clearTimeout(this.mouseDownTimer);
        // save result and clear canvas and remove temp lines
        if (!this.isGlasses || tagPaths.length) {
          this.saveCanvas();
        }
        this.isPaused = false;
        this.clearCanvas();
        tagPaths = [];
        tagLines = [];
      },

      toggleLight() {
        // this.isTurnOn = !this.isTurnOn;
        //正在分享畫面或傳送檔案時不可開啟手電筒
        if (this.isSharing || this.isSendingFile || this.isAppPaused) return;
        this.sendCommand(CMD_TORCH, this.isTurnOn ? 0 : 1);
      },

      undo(send) {
        if (this.isPaused) {
          if (tagPaths.length > 0) {
            tagPaths.pop();
            this.redrawCanvas();
          }
        } else if (!this.isGlasses) {
          this.clearCanvas();
        }
        if (send) this.sendCommand(CMD_UNDO);
      },

      toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.localStream) {
          this.localStream.getAudioTracks().forEach((track) => (track.enabled = !this.isMuted));
        }
        // let senderList = this.pc.getSenders();

        // senderList.forEach((sender) => {
        //   if (sender.track) {
        //     console.log(sender.track);
        //     sender.track.enabled = !this.isMuted;
        //   }
        // });
      },

      changeColor(id) {
        this.selectedColorId = id;
        this.isChoosingColor = false;
      },
      //#endregion

      //#region gallery

      toggleSelect(index) {
        this.captures[index].selected = !this.captures[index].selected;
        this.checkSelectAll();
      },

      doSelectAll() {
        this.selectAll = !this.selectAll;
        this.emptySelect = !this.selectAll;
        for (let i = 0; i < this.captures.length; i++) {
          this.captures[i].selected = this.selectAll;
        }
      },

      checkSelectAll() {
        let isSelectAll = true;
        let isEmptySelect = true;
        for (let i = 0; i < this.captures.length; i++) {
          if (!this.captures[i].selected) {
            isSelectAll = false;
          }
          if (this.captures[i].selected) {
            isEmptySelect = false;
          }
        }
        this.selectAll = isSelectAll;
        this.emptySelect = isEmptySelect;
      },

      downloadZip() {
        // show download alert (start)
        this.isDownloading = true;

        let zip = new JsZip();
        let flag = false;
        for (let i = 0; i < this.captures.length; i++) {
          let capture = this.captures[i];
          if (!capture.selected) continue;
          zip.file(`MeetingSummary${("00" + (i + 1)).slice(-3)}.jpg`, capture.dataUrl.split(",")[1], {
            base64: true,
          });
          flag = true;
        }
        if (!flag) return;
        let that = this;

        let now = new Date();
        let dateStr =
          ("0" + (now.getMonth() + 1)).slice(-2) +
          ("0" + now.getDate()).slice(-2) +
          ("0" + now.getHours()).slice(-2) +
          ("0" + now.getMinutes()).slice(-2);
        zip
          .generateAsync({ type: "blob", streamFiles: true }, function updateCallback(metadata) {
            if (metadata.percent == 0) {
              that.$bvModal.show("downloadZipModal");
            }
            if (metadata.percent == 100) {
              that.$bvModal.hide("downloadZipModal");
            }
            that.downloadProgress = metadata.percent;
          })
          .then(
            (blob) => {
              saveAs(blob, `ARRemoteAssistance_${dateStr}.zip`);
              // show download alert (success)
              this.isDownloading = false;
            }
            // (err) => console.log(err)
          );
      },

      btnStartRecording() {
        if (!this.recordInterval) {
          this.recordInterval = setInterval(() => {
            try {
              if (this.isPaused || this.isAppPaused)
                this.recordCtx.drawImage(this.cv, 0, 0, this.recordCv.width, this.recordCv.height);
              else {
                this.recordCtx.drawImage(this.video, 0, 0, this.recordCv.width, this.recordCv.height);

                this.recordCtx.drawImage(this.cv, 0, 0, this.recordCv.width, this.recordCv.height);
                this.recordCtx.drawImage(this.cvCover, 0, 0, this.recordCv.width, this.recordCv.height);
              }
            } catch (e) {
              clearInterval(this.recordInterval);
            }
          }, 1000 / 30);
        }
        this.cvStream = this.recordCv.captureStream();
        const audioContext = new AudioContext();
        let audioIn_01 = audioContext.createMediaStreamSource(this.localStream);
        let audioIn_02 = audioContext.createMediaStreamSource(this.remoteStream);

        let dest = audioContext.createMediaStreamDestination();
        audioIn_01.connect(dest);
        audioIn_02.connect(dest);

        let combined = new MediaStream([...this.cvStream.getTracks(), ...dest.stream.getTracks()]);

        RecordRTC(combined);
        // if (this.remoteStream) for (let audio of this.remoteStream.getAudioTracks()) this.cvStream.addTrack(audio);
        // if (this.localStream) for (let audio of this.localStream.getAudioTracks()) this.cvStream.addTrack(audio);

        this.recorder = RecordRTC(combined, {
          type: "video",
          showMousePointer: false,
          // mimeType: "video/webm;codecs=h264",
          mimeType: "video/webm;codecs=vp9",
        });
        this.recorder.startRecording();
        this.isRecording = true;
        this.cmdScreenRecord();
      },

      btnStopRecording() {
        if (this.recordInterval) {
          clearInterval(this.recordInterval);
          this.recordInterval = null;
        }
        if (this.recorder) {
          this.recorder.stopRecording((url) => {
            this.dismissCountDownRecord = this.dismissSecs;
            let blob = this.recorder.getBlob();

            this.getVideoDuration(blob).then((duration) => {
              console.log(`duration=${duration}`);
              getSeekableBlob(blob, duration, (seekableBlob) => {
                RecordRTC.invokeSaveAsDialog(seekableBlob, this.getRecordFileName());
              });
            });

            this.recorder.destroy();
            this.recorder = null;
          });
          this.isRecording = false;
          this.cmdScreenRecordStop();
        }
      },
      getVideoDuration(blob) {
        return new Promise((resolve, reject) => {
          let recordVideo = this.$refs.recordVideo;
          recordVideo.src = URL.createObjectURL(blob);

          recordVideo.onloadedmetadata = function() {
            // handle chrome's bug
            if (recordVideo.duration !== Infinity) resolve(recordVideo.duration * 1000);
            else {
              // set it to bigger than the actual duration
              recordVideo.currentTime = 1e101;
              recordVideo.ontimeupdate = function() {
                this.ontimeupdate = () => {};

                recordVideo.currentTime = 0;
                resolve(recordVideo.duration * 1000);
              };
            }
          };
        });
      },
      getRecordFileName() {
        let nowDate = new Date().toString().split(" ")[0];
        let downloadCount = this.$cookies.get("downloadCount") || 0;
        let downloadDate = this.$cookies.get("downloadDate");
        // 如果不是同一天就歸零
        if (!downloadDate || downloadDate != nowDate) downloadCount = 0;
        let currentTime = new Date()
          .toISOString()
          .replace(/[^0-9]/g, "")
          .slice(0, -9);

        this.$cookies.set("downloadCount", ++downloadCount);
        this.$cookies.set("downloadDate", nowDate);
        return "AR_" + currentTime + "_" + ("00" + downloadCount).slice(-3);
      },
      //#endregion

      //#region general
      toContact() {
        // 在標註總覽時必不會回到contact
        if (this.step == 2) return;
        if (this.redirectFlag) return;
        this.redirectFlag = true;
        if (sessionStorage.getItem("roomUuid") && this.isFromRating) this.$router.push({ name: "RARating" });
        else this.$router.push({ name: "RAContact" });
      },

      finishCall() {
        sessionStorage.setItem("tagCount", this.captures.length);
        sessionStorage.setItem("roomUuid", this.roomUuid);
        // if(this.isClose) return;
        if (!this.captures.length) {
          // 如果正在錄影時被中斷，需要帶參數至評分頁
          if (this.isRecording) {
            this.$router.push({
              name: "RARating",
              params: {
                recordStatus: "canceled",
              },
            });
          } else {
            this.$router.push({
              name: "RARating",
            });
          }
        } else {
          // 如果正在錄影時被中斷，需要開啟"通話已結束"modal
          if (this.isRecording) {
            this.$bvModal.show("recordCanceledModal");
          }
          this.checkSelectAll();

          this.$changeTitle(this.$t("APP.TITLE.CallScreenshots"));
          this.step = 2;
          let totalTime = 1800 - (this.endTime - Math.floor(new Date() / 1000));
          this.totalMins = Math.floor(totalTime / 60);
          this.totalSecs = totalTime - this.totalMins * 60;
        }
      },

      createResizeObserver() {
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            if (entry.target === this.video) this.resizeAndSendViewSize();
          }
        });
        resizeObserver.observe(this.video);
      },

      resizeAndSendViewSize() {
        if (this.isPaused) return;
        let { width, height } = this.getVideoDimensions();
        this.resizeCanvas();
        this.cmdRemoteViewSize(width, height);
      },

      resizeCanvas() {
        console.log("resizeCanvas");
        let { width, height } = this.getVideoDimensions();
        if (this.video && this.cv) {
          this.cv.width = width;
          this.cv.height = height;
          this.cvCover.width = width;
          this.cvCover.height = height;
          if (this.recordCv) {
            this.recordCv.width = width;
            this.recordCv.height = height;
          }
        }
        // for (let pointer of this.pointers) {
        //   pointer.setPosition();
        // }

        // this.pointers.__ob__.dep.notify();
        this.pointers.push({});
        this.pointers.pop();
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown;
      },
      getVideoDimensions() {
        // Ratio of the video's intrisic dimensions
        var videoRatio = this.video.videoWidth / this.video.videoHeight;
        // The width and height of the video element
        var width = this.video.offsetWidth,
          height = this.video.offsetHeight;
        // The ratio of the element's width to its height
        var elementRatio = width / height;
        // If the video element is short and wide
        if (elementRatio > videoRatio) width = height * videoRatio;
        // It must be tall and thin, or exactly equal to the original ratio
        else height = width / videoRatio;
        return {
          width: Math.floor(width),
          height: Math.floor(height),
        };
      },
      closeModal(type) {
        this.$bvModal.hide(type);
      },
      changeTitle() {
        // 已有房間號碼代表是對方播打
        let time = 0;
        if (this.roomUuid) {
          this.titleTimer = setInterval(() => {
            this.$changeTitle(this.$t("CALL.CALL.CALLING_IN") + ".".repeat((time++ % 3) + 1));
          }, 500);
        } else {
          this.titleTimer = setInterval(() => {
            this.$changeTitle(this.$t("CALL.CALL.CALLING_OUT") + ".".repeat((time++ % 3) + 1));
          }, 500);
        }
      },
      resetTitle() {
        clearInterval(this.titleTimer);
        if (this.$cookies.get("deploy_type") == "digiwin") {
          this.$store.state.deployType = 2;
          // document.title = "AR遠程協同";
          this.$changeTitle();
        } else {
          this.$store.state.deployType = 1;
          // document.title = "AR遠程協作";
          this.$changeTitle();
        }
      },
      //#endregion
      toggleFramerate() {
        console.log("toggleFramerate");
        this.hasFramerate = !this.hasFramerate;
      },

      //#region canvas methods

      initialReferences() {
        console.log("initialReferences");
        this.cv = this.$refs.cv;
        this.cvCover = this.$refs.cvCover;
        this.video = this.$refs.video;
        this.emptyCv = this.$refs.emptyCv;
        this.recordCv = this.$refs.recordCv;
        this.backupCv = this.$refs.backupCv;
        this.loading = this.$refs.loading;
        this.selectFile = this.$refs.selectFile;
        this.ctx = this.cv.getContext("2d");
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.save();
        this.ctxCover = this.cvCover.getContext("2d");
        this.ctxCover.lineCap = "round";
        this.ctxCover.lineJoin = "round";
        this.ctxCover.save();
        this.backupCtx = this.backupCv.getContext("2d");
        this.recordCtx = this.recordCv.getContext("2d");
        this.mouseDownFuncs = [];
      },

      initialCanvasFunctions() {
        // 3D線
        canvasFunctions[-1] = () => {
          var lastX, lastY;
          mousedown = (x, y) => {
            let type = POINT_BEGIN;
            // set current paint color
            if (!this.isPaused) {
              this.cmdLockPov();
              if (this.mouseDownTimer) clearTimeout(this.mouseDownTimer);
              this.mouseDownTimer = setTimeout(() => {
                this.isPaused = true;
              }, 3000);
            } else type = POINT_BEGIN_FIXED_Z;

            this.drawToCtx(type, x, y, x, y);
            lastX = x;
            lastY = y;
          };
          mousemove = (x, y) => {
            let distance = this.getDistance(x, y, lastX, lastY);
            if (distance > this.minimumLength) {
              this.drawToCtx(POINT_MOVE, lastX, lastY, x, y);
              lastX = x;
              lastY = y;
            }
          };
          mouseup = (x, y) => {
            clearTimeout(this.mouseDownTimer);

            this.drawToCtx(POINT_END, lastX, lastY, x || lastX, y || lastY);

            if (!this.isPaused) this.cmdUnlockPov();
          };
        };
        // 線
        canvasFunctions[0] = () => {
          var x1, y1;
          mousedown = (x, y) => {
            x1 = x;
            y1 = y;
            // set current paint color
            this.drawToCtx(POINT_BEGIN, x, y, x, y);
          };
          mousemove = (x, y) => {
            this.drawToCtx(POINT_MOVE, x1, y1, x, y);
            x1 = x;
            y1 = y;
          };
          mouseup = (x = x1, y = y1) => {
            this.drawToCtx(POINT_END, x1, y1, x, y);
          };
        };
        // 箭頭
        canvasFunctions[1] = () => {
          var x0, y0, x1, y1;
          this.ctxCover.restore();
          this.ctxCover.lineWidth = this.lineWidth;
          mousedown = (x, y) => {
            x0 = x1 = x;
            y0 = y1 = y;
          };
          mousemove = (x, y) => {
            this.clearCanvasCover();
            x1 = x;
            y1 = y;

            this.drawTagLineToCanvas(this.ctxCover, new TagLine(POINT_MOVE, x0, y0, x, y, this.selectedColorId));
          };
          mouseup = (x = x1, y = y1) => {
            if (x0 == x && y0 == y) return;
            this.drawToCtx(POINT_BEGIN, x0, y0, x0, y0);
            this.drawToCtx(POINT_MOVE, x0, y0, x, y);
            this.drawHat(x0, y0, x, y);
            this.drawToCtx(POINT_END, x, y, x, y);
            this.clearCanvasCover();
          };
        };
        // 任意箭頭
        canvasFunctions[2] = () => {
          this.ctxCover.restore();
          this.ctxCover.lineWidth = this.lineWidth;
          let hasDraw = false;
          var x0, y0, x1, y1;
          let lastArr = [];
          let lastSize = 10;
          mousedown = (x, y) => {
            hasDraw = false;
            x0 = x1 = x;
            y0 = y1 = y;
            lastArr = [];
            for (let i = 0; i < lastSize; i++) lastArr.push({ x1, y1 });

            this.drawToCtx(POINT_BEGIN, x, y, x, y);
          };
          mousemove = (x, y) => {
            hasDraw = true;
            x0 = x1;
            y0 = y1;
            x1 = x;
            y1 = y;
            this.drawToCtx(POINT_MOVE, x0, y0, x1, y1);
            lastArr.splice(0, 1);
            lastArr.push({ x1, y1 });
          };
          mouseup = (x = x1, y = y1) => {
            if (!hasDraw) return;

            this.drawHat(lastArr[0].x1, lastArr[0].y1, x1, y1);
            hasDraw = false;
            this.drawToCtx(POINT_END, x, y, x, y);
          };
        };
        // 橢圓
        canvasFunctions[3] = () => {
          this.ctxCover.restore();
          this.ctxCover.lineWidth = this.lineWidth;
          var x0, y0, x1, y1;
          mousedown = (x, y) => {
            x0 = x1 = x;
            y0 = y1 = y;
          };
          mousemove = (x, y) => {
            x1 = x;
            y1 = y;
            this.clearCanvasCover();
            this.drawTagLineToCanvas(this.ctxCover, new TagLine(LINE_OVAL, x0, y0, x, y, this.selectedColorId));
          };
          mouseup = (x = x1, y = y1) => {
            this.drawToCtx(LINE_OVAL, x0, y0, x, y);
            this.ctx.drawImage(this.cvCover, 0, 0);
            this.clearCanvasCover();
          };
        };
        canvasFunctions[4] = () => {
          mousedown = (x, y) => {
            this.ctxCover.save();
            this.ctxCover.textAlign = "center";
            this.ctxCover.fillStyle = this.colorList[this.selectedColorId].colorCode;
            this.ctxCover.font = this.fontsize + "px Arial";
            let text = prompt("enter text");

            this.ctxCover.fillText(text, x, y);
            this.ctxCover.restore();
          };
          mousemove = (x, y) => {};
          mouseup = (x, y) => {};
        };
      },

      drawHat(x0, y0, x1, y1) {
        let hatSize = 30;
        console.log(`this.drawHat ${x0} ${y0} ${x1} ${y1}`);
        let tx = 0,
          ty = 0;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let m = dy / dx;
        if (m != Infinity && m != -Infinity) {
          let deltax = Math.sqrt(Math.pow(hatSize, 2) / (1 + Math.pow(m, 2))) * (dx / Math.abs(dx));
          let deltay = deltax * m;
          tx = x1 - deltax / 2;
          ty = y1 - deltay / 2;
        } else {
          tx = x1;
          // point up
          if (dy > 0) ty = y1 - hatSize / 2;
          // point down
          else ty = y1 + hatSize / 2;
        }
        this.drawToCtx(POINT_MOVE, x1, y1, tx + (y1 - ty), ty - (x1 - tx));
        this.drawToCtx(POINT_MOVE, x1, y1, tx - (y1 - ty), ty + (x1 - tx));
      },

      changeDrawFunction(val = this.drawFunction) {
        this.drawFunction = val;
        canvasFunctions[this.drawFunction]();
        this.isChoosingTool = false;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .left-section,
  .right-section {
    height: 100vh;
    background-color: #313131;
    z-index: 99;
    @media (max-width: 1200px) {
      padding: 0;
    }
  }

  .left-section {
    .trial-count {
      position: absolute;
      top: 45px;
      right: 34px;
      width: 210px;
      height: 97px;
      background-color: #bc2727b3;
      border-radius: 48.5px;
      @media (max-width: 1200px) {
        width: 140px;
        height: 60px;
        right: 4px;
        border-radius: 30px;
      }

      .hangup {
        position: absolute;
        top: -37px;
        right: 11px;
        @media (max-width: 1200px) {
          top: -43px;
          right: -4px;
        }
      }

      .trial-count-text {
        position: absolute;
        top: 0;
        left: 45px;
        color: #fff;
        font-size: 24px;
        line-height: 97px;
        @media (max-width: 1200px) {
          left: 30px;
          line-height: 60px;
          font-size: 16px;
        }
      }
    }
    .not-ready {
      background-color: transparent;
    }
  }

  .left-section-glasses {
    position: fixed;
    background-color: transparent;
    width: 0;
    top: 5vh;
    left: 125px;
    @media (max-width: 768px) {
      top: 0;
    }

    .icon-left {
      top: 0;
      position: relative !important;
    }

    .trial-count-glasses {
      position: relative;
      width: 210px;
      height: 97px;
      background-color: #bc2727b3;
      border-radius: 48.5px;
      margin-left: -56px;
      @media (max-width: 1200px) {
        width: 170px;
        height: 72px;
        border-radius: 36px;
        margin-left: -11px;
      }

      .hangup {
        position: absolute;
        top: 11px;
        left: 11px;
      }

      .trial-count-text {
        position: absolute;
        top: 0;
        right: 40px;
        color: #fff;
        font-size: 24px;
        line-height: 97px;
        @media (max-width: 1200px) {
          line-height: 72px;
        }
      }
    }

    .not-ready {
      background-color: transparent;
    }
  }

  .right-section-glasses {
    position: fixed;
    background-color: transparent;
    width: 0;
    top: 5vh;
    right: 180px;
    @media (max-width: 768px) {
      top: 0;
    }
  }

  .index {
    z-index: -999;
  }

  .icon-left {
    right: 45px;
    position: absolute;
    height: 75px;
    line-height: 75px;
    width: 75px;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    @media (max-width: 576px) {
      right: 0;
      margin-right: 10px;
      height: 50px;
      line-height: 50px;
      width: 50px;
      padding: 0;
      svg {
        font-size: 1rem !important;
      }
    }
  }

  .icon-right {
    margin-left: 30px;
    height: 75px;
    line-height: 75px;
    width: 75px;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    @media (max-width: 576px) {
      margin-left: 10px;
      height: 50px;
      line-height: 50px;
      width: 50px;
      padding: 0;
      svg {
        font-size: 1rem !important;
      }
    }

    .recording {
      margin-top: -15px;
      width: 30px !important;
      @media (max-width: 576px) {
        margin-top: -5px;
        width: 20px !important;
      }
    }

    .flashlight {
      width: 20px !important;
      @media (max-width: 576px) {
        width: 12px !important;
      }
    }
  }

  .recording-tip {
    position: fixed;
    top: 20px;
    left: 47vw;
    width: 120px;
    height: 50px;
    line-height: 50px;
    color: #fff;
    background-color: #bc2727b3;
    border-radius: 25px;
    img {
      margin: -5px 5px 0 0 !important;
      width: 20px !important;
    }
    @media (max-width: 1200px) {
      font-size: 12px;
      height: 30px;
      line-height: 30px;
      width: 80px;
      img {
        margin: -5px 5px 0 0 !important;
        width: 14px !important;
      }
    }
  }

  .red {
    color: #fff;
    background-color: $red !important;

    &:hover {
      background-color: $redHover !important;
    }

    a {
      color: #fff;
    }
  }

  .rotate {
    transform: rotate(135deg);
  }

  .grey-1 {
    top: 100px;
    color: #fff;
    background-color: #b7b7b7;
    font-size: 27px;
    @media (max-width: 1200px) {
      top: 75px;
    }
  }

  .grey-2 {
    color: #fff;
    background-color: $grey;
    &:hover {
      background-color: #606060;
    }
  }

  .framerate {
    top: 225px;
  }

  .disabled-button {
    color: #fff;
    background-color: #b7b7b7;
    cursor: not-allowed;
    &:hover {
      background-color: #b7b7b7;
    }
  }

  .small-screen {
    height: 188px;
    width: 150px;
    position: absolute;
    bottom: 30px;
    right: 45px;
    overflow: hidden;
    border: 1px solid #fff;
    border-radius: 15px;
    img {
      width: 100%;
    }
  }
  // .play-button {
  //   // position: fixed;
  //   // bottom: 30px;
  //   // left: 47px;
  //   padding-left: 12px;
  //   z-index: 10;
  //   @media (max-width: 1200px) {
  //     padding: 0;
  //   }
  // }

  .active-btn {
    color: $blue;
    background-color: #fff !important;
    &:hover {
      background-color: #eee;
    }
  }

  .lights-on {
    background-color: #fff !important;
    &:hover {
      background-color: #eee !important;
    }
  }

  .color-picker-component {
    margin-top: -46px;
    margin-left: -16px;
    .upper {
      margin-top: 30px;
      padding-top: 10px;
      padding-left: 10px;
      width: 95px;
      height: 95px;
      background-color: #222222;
      border-radius: 35px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      position: relative;
      z-index: 2;
      .upper-icon {
        height: 75px;
        line-height: 75px;
        width: 75px;
        padding: 6px;
        border-radius: 50%;
      }
    }

    .color-picker {
      width: 150px;
      height: 300px;
      margin-top: -10px !important;
      background-color: #222222;
      border-radius: 30px;
      border-top-left-radius: 0;
      position: relative;
      z-index: 1;
      .col-6 {
        .colors {
          line-height: 50px;
          margin: 12.5px;
          border-radius: 25px;
        }
      }
    }

    .color-picker-glasses {
      margin-left: -55px !important;
      border-top-left-radius: 30px;
      border-top-right-radius: 0;
    }
  }

  .brush-blue {
    color: #00b7ff;
    background-color: #00b7ff !important;
    border: 1px solid #00b7ff;
  }

  .brush-red {
    color: #ff0000;
    background-color: #ff0000 !important;
    border: 1px solid #ff0000;
  }

  .brush-magenta {
    color: #ff00cc;
    background-color: #ff00cc !important;
    border: 1px solid #ff00cc;
  }

  .brush-orange {
    color: #ff6600;
    background-color: #ff6600 !important;
    border: 1px solid #ff6600;
  }

  .brush-black {
    color: #000;
    background-color: #000 !important;
    border: 1px solid #fff;
  }

  .brush-yellow {
    color: #ffff00;
    background-color: #ffff00 !important;
    border: 1px solid #ffff00;
  }

  .brush-white {
    color: #eee;
    background-color: #eee !important;
    border: 1px solid #eee;
  }

  .brush-green {
    color: #009933;
    background-color: #009933 !important;
    border: 1px solid #009933;
  }

  .arrow-section {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .arrow {
    position: absolute !important;
    z-index: 100;
    transition: top 500ms linear;
  }

  .arrow-blue {
    color: #00b7ff;
  }

  .arrow-red {
    color: #ff0000;
  }

  .arrow-magenta {
    color: #ff00cc;
  }

  .arrow-orange {
    color: #ff6600;
  }

  .arrow-black {
    color: #000;
    border: 1px solid #fff;
  }

  .arrow-yellow {
    color: #ffff00;
  }

  .arrow-white {
    color: #eee;
  }

  .arrow-green {
    color: #009933;
  }

  .step-1 {
    .upper-section {
      .video-section {
        background-color: #313131;

        .video-container {
          width: 100%;
          height: 85vh;
          overflow: hidden;

          video {
            object-position: top;
            height: 100%;
            width: 100%;
            position: relative;
          }
        }

        .app-pause-section {
          color: #fff;
          font-size: 24px;
        }

        .vh-80 {
          height: 80vh;
        }

        .minified {
          // miso temp comment for qa
          width: 150px;
          // height: 210px;
          // border-radius: 15px;
          overflow: hidden;
          // margin-left: -195px !important;
          // margin-top: 73vh;
          z-index: 999;
          video {
            width: 148px;
          }
        }

        img {
          margin-left: 45px;
          width: 100%;
        }

        .brush-cursor {
          cursor: url("~@/assets/images/brush.png") 0 40, pointer !important;
        }

        .width-unset {
          width: unset !important;
        }

        // .canvas {
        //   width: 100%;
        // }

        .recordCv {
          position: absolute;
          z-index: -100;
        }

        // .cv-glasses {
        //   top: 0;
        //   bottom: 0;
        //   left: 0;
        //   right: 0;
        //   margin: auto !important;
        // }
      }
    }
    .lower-section {
      height: 15vh;
      line-height: 15vh;

      .function {
        z-index: 99;

        .function-btn {
          height: 67px;
          line-height: 67px;
          width: 67px;
          display: inline-block;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          @media (max-width: 576px) {
            height: 40px;
            line-height: 40px;
            width: 40px;
            font-size: 16px !important;
          }
        }

        .grey-1 {
          color: #fff;
          background-color: #606060;
          font-size: 24px;
        }

        .white {
          background-color: #fff;
          font-size: 24px;
        }

        .red {
          color: #fff;
          border: 1px solid $red;
          background-color: $red;
          font-size: 24px;
          &:hover {
            border: 1px solid $redHover;
            background-color: $redHover;
          }
        }

        .blue {
          color: $blue;
          background-color: #fff !important;
          &:hover {
            background-color: #eee;
          }
        }

        .disabled-button {
          color: #fff;
          background-color: #b7b7b7;
          cursor: not-allowed;
          &:hover {
            background-color: #b7b7b7;
          }
        }

        .undo {
          img {
            width: 30px;

            @media (max-width: 576px) {
              width: 20px;
            }
          }
        }

        .flashlight {
          width: 20px !important;
          @media (max-width: 576px) {
            width: 12px !important;
          }
        }

        .recording {
          margin-top: -5px;
          width: 30px !important;
          @media (max-width: 576px) {
            margin-top: -5px;
            width: 20px !important;
          }
        }

        .draw-tools {
          position: relative;
          display: inline-block;
          background-color: #444;
          border-radius: 15px;
          height: 105px;
          line-height: 110px;
          padding: 0 15px;

          @media (max-width: 576px) {
            height: 80px;
            line-height: 80px;
          }

          .draw-function-btn {
            display: inline-block;
            height: 67px;
            line-height: 77px;
            width: 67px;
            border-radius: 50%;
            cursor: pointer;
            background-color: #666;

            &:hover {
              background-color: #555;
            }

            @media (max-width: 576px) {
              height: 40px;
              line-height: 43px;
              width: 40px;
              font-size: 12px !important;

              svg {
                font-size: 20px;
              }
            }

            img {
              margin-top: -15px;
              width: 30px;

              @media (max-width: 576px) {
                margin-top: -7px;
                width: 20px;
              }
            }
          }

          .color-picker {
            margin-top: 20px;
          }

          .color-picker-component {
            position: absolute;
            bottom: 100%;
            left: 0;
            .color-picker-list {
              background-color: rgba(255, 255, 255, 0.6);
              border-radius: 15px;
              padding: 6px 12px;
              margin: 0 0 0 16px;

              .col-3 {
                .colors {
                  width: 50px;
                  height: 50px;
                  line-height: 50px;
                  margin: 4px 12px;
                  border-radius: 25px;
                  cursor: pointer;
                  @media (max-width: 576px) {
                    width: 40px;
                    height: 40px;
                    margin: 3px;
                  }
                }
              }
            }
          }

          .tool-picker {
            color: #666;
            background-color: #fff;
            &:hover {
              background-color: #eee;
            }
          }

          .divider {
            display: inline-block;
            height: 50px;
            vertical-align: middle;
            border-left: 1px solid #666;
            margin-top: -10px;
          }

          .curve-tools {
            margin-left: -15px;
            position: absolute;
            bottom: 100%;
            height: 66px;
            line-height: 60px;
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 15px;
            padding: 0 15px;

            .curve-function-btn {
              display: inline-block;
              height: 58px;
              width: 58px;
              border-radius: 50%;
              cursor: pointer;
              color: #fff;
              background-color: #666;
              vertical-align: middle;

              &:hover {
                background-color: #555;
                transition: all 0.5s ease;
              }

              &.active {
                background-color: #fff;
                color: #666;
                &:hover {
                  background-color: #eee;
                }
              }

              img {
                margin-top: -8px;
                width: 30px;

                @media (max-width: 576px) {
                  margin-top: -24px;
                  width: 20px;
                }
              }

              @media (max-width: 576px) {
                width: 40px;
                height: 40px;
              }
            }

            .freehand {
              svg {
                font-size: 25px;
                top: 18px;
                right: 30px;

                @media (max-width: 576px) {
                  position: absolute;
                  font-size: 20px;
                  top: 24px;
                  right: 26px;
                }
              }

              &.active {
                background-color: #fff;
                color: #666;
                &:hover {
                  background-color: #eee;
                }
              }
            }

            @media (max-width: 576px) {
              padding: 0 11px;
            }
          }
        }
      }
    }
  }

  .loader {
    margin-top: 300px;
  }

  .cancel-capture {
    width: 600px;
    position: absolute;
    color: #fff;
    top: 50px;
    z-index: 999;
  }

  .screen-capture-section {
    margin: 100px 0;
    width: 40vw;
    .checkbox-list {
      input[type="checkbox"] {
        display: none;
        &:checked ~ label {
          background-color: #fff;
          color: $blue;
        }
      }

      img {
        width: 100%;
        border-radius: 15px;
        margin-bottom: 30px;
      }

      label {
        color: #fff;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        position: absolute;
        margin-left: -60px;
        bottom: 30px;
        cursor: pointer;
        svg {
          margin-top: 1px;
        }
      }
    }
  }

  .top-210 {
    margin-top: 210px;
  }

  .footer {
    height: 100px;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: rgba(200, 200, 200, 0.3);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    .button-section {
      width: 600px;
      padding: 0 15px;
      .ra-confirm-btn-alt {
        width: 125px !important;
      }
    }
  }

  .auth-alert {
    width: 20vw;
    height: 120px;
    padding: 35px 50px;
    color: #fff;
    background-color: #00000099;
    border-radius: 10px;
    border: none;
    position: fixed;
    top: 10vh;
    left: 40vw;
    letter-spacing: 2px;
    @media (max-width: 1440px) {
      width: 28vw;
      padding: 40px 20px;
      left: 36vw;
    }
  }

  .no-bg {
    background-color: transparent;
  }

  .download-alert {
    width: 12vw;
    height: 50px;
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 25px;
    position: fixed;
    top: 50vh;
    left: 44vw;
    @media (max-width: 1440px) {
      width: 20vw;
      left: 40vw;
    }

    .green-icon {
      color: $green;
    }
  }

  .download-alert-alt {
    width: 20vw;
    height: 50px;
    color: #fff;
    background-color: #000000b3;
    border: 1px solid #000000b3;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 25px;
    position: fixed;
    top: 5vh;
    left: 40vw;
    @media (max-width: 1440px) {
      width: 30vw;
      left: 40vw;
    }

    .green-icon {
      color: $green;
    }
  }

  .call {
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    &.black {
      background-color: #313131;
    }
  }

  .ra-main-content {
    height: 100vh;
    color: #fff;
    background-color: #313131;

    .activating {
      color: #fff;
      font-size: 24px;
      margin-top: 40vh;
    }

    .icon-round {
      margin-top: 100px;
      height: 75px;
      line-height: 75px;
      width: 75px;
      padding: 6px;
      border-radius: 50%;
      @media screen and (max-height: 800px) {
        margin-top: 0;
      }
    }

    .icon-rect {
      margin-top: 10vh;
      height: 70px;
      line-height: 70px;
      width: 160px;
      padding: 6px;
      border-radius: 35px;

      svg {
        height: 32px;
      }
      @media screen and (max-height: 800px) {
        margin-top: 0;
      }
    }

    .red {
      border: 1px solid $red;
      background-color: $red;
      &:hover {
        border: 1px solid $redHover;
        background-color: $redHover;
      }
    }

    .grey-1 {
      top: 100px;
      background-color: #b7b7b7;
      font-size: 27px;
    }

    .grey-2 {
      background-color: $grey;
      &:hover {
        background-color: $greyHover;
      }
    }

    .green {
      color: #fff;
      background-color: $green;
      &:hover {
        background-color: $greenHover;
      }
    }

    .status {
      // margin-left: 30px;
      font-size: 24px;
    }

    .user-name {
      font-size: 36px;
    }

    svg {
      @media screen and (max-height: 720px) {
        margin-top: 10px !important;
        font-size: 80px;
      }
    }
    // Loading CSS animation
    .loading {
      display: inline-block;
      position: relative;
      width: 40px;
      height: 38px;
      div {
        position: absolute;
        top: 33px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fff;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
        &:nth-child(1) {
          left: 8px;
          animation: loading1 0.6s infinite;
        }
        &:nth-child(2) {
          left: 8px;
          animation: loading2 0.6s infinite;
        }
        &:nth-child(3) {
          left: 32px;
          animation: loading2 0.6s infinite;
        }
        &:nth-child(4) {
          left: 56px;
          animation: loading3 0.6s infinite;
        }
      }
    }

    @keyframes loading1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes loading3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes loading2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(21px, 0);
      }
    }
  }

  .send-file-modal {
    z-index: 99999;
    position: fixed;
    bottom: 100px;
    left: 40vw;
    padding: 30px;
    background-color: #fff;
    border-radius: 20px;
  }

  /deep/ .modal-header {
    margin: auto;
  }

  /deep/ .download-progress {
    margin: 30px auto;
  }

  // miso
  #cv {
    position: absolute;
    top: 0;
    left: 0;
    // z-index: 10;
    margin: 0 auto;
    right: 0;
  }
  #cvCover {
    position: absolute;
    top: 0;
    left: 0;
    // z-index: 10;
    margin: 0 auto;
    right: 0;
  }
</style>
