<template>
  <!-- 黑色底避免還沒建立通話前的白畫面 -->
  <div
    class="call"
    @mouseup="onMouseUp"
    @touchend="onMouseUp"
    @mouseout="onMouseUp"
    @touchcancel="onMouseUp"
    :class="{ black: step != 4 }"
  >
    <div ref="audioBlock"></div>
    <!-- 加入會議 -->
    <div class="m-0" v-if="step == 1">
      <RAHeader :title="$t('CONFERENCE.JOIN_TITLE')" />
      <div class="ra-main-content">
        <div class="otp-section mx-auto">
          <div class="ra-title ext-left mb-4">{{ $t("CONFERENCE.CODE_DESC") }}</div>
          <v-otp-input
            class="mb-4"
            ref="otpInput"
            inputClasses="otp-input"
            :numInputs="4"
            :shouldAutoFocus="true"
            separator=""
            @on-complete="getRoomSn"
          />
          <div class="alert-msg mb-4" v-if="alertMsg">{{ alertMsg }}</div>
          <div class="row">
            <div class="col-9">
              <b-button class="ra-confirm-btn" @click="join">{{ $t("GENERAL.CONFIRM") }}</b-button>
            </div>
            <div class="col-3 pl-0">
              <b-button class="ra-confirm-btn-alt" @click="toContact">{{ $t("CONFERENCE.CANCEL_CALL") }}</b-button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

    <!-- 會議首頁 -->
    <div class="m-0" v-if="step == 2">
      <RAHeader :title="isHost ? $t('CONFERENCE.START_TITLE') : $t('CONFERENCE.JOIN_TITLE')" />
      <div class="ra-main-content">
        <div class="join-section mx-auto text-left">
          <div class="ra-title my-3">
            {{ $t("CONFERENCE.CODE") }}<font-awesome-icon icon="copy" class="ml-2 copy" @click="copyRoomSn" />
          </div>
          <input class="hidden-input" type="number" :value="roomSn" ref="roomSnInput" />
          <b-alert
            :show="dismissCountDown"
            dismissible
            variant="dark"
            @dismissed="dismissCountDown = 0"
            @dismiss-count-down="countDownChanged"
            class="mx-auto"
          >
            <p>{{ $t("CONFERENCE.CODE") }} ( {{ roomSn }} ) {{ $t("CONFERENCE.COPIED") }}</p>
          </b-alert>
          <div class="room-sn">{{ roomSn }}</div>
          <div class="ra-title my-3">
            {{ $t("CONFERENCE.HOST") }}
            <span v-if="isHost">({{ $t("CONFERENCE.YOU") }})</span>
          </div>
          <div class="card-component" v-if="roomHost" v-bind:key="'info1-' + roomHost.id">
            <div class="card mx-auto row">
              <div class="col-2 left">
                <div class="icon">{{ roomHost.name.slice(0, 1) }}</div>
              </div>
              <div class="col-8 middle text-left pl-3 pt-4">
                <div class="user-name">{{ roomHost.name }}</div>
                <div class="source">{{ deviceType[roomHost.deviceType] }}</div>
              </div>
              <div
                class="col-2 right text-center"
                v-if="isHost && roomHost.canShare"
                @click="
                  roomHost.isShare = !roomHost.isShare;
                  SetSharer(roomHost.id);
                "
              >
                <img v-if="roomHost.isShare" src="~@/assets/images/arrow-blue.png" />
                <img v-if="!roomHost.isShare" src="~@/assets/images/arrow-grey.png" />
              </div>
              <div class="col-2 right text-center" v-if="!isHost">
                <img v-if="roomHost.isShare" src="~@/assets/images/arrow-blue.png" />
                <br />
              </div>
            </div>
          </div>
          <div class="ra-title my-3">
            {{ $t("CONFERENCE.MEMBER") }}
            <span>({{ Object.keys(participants).length - 1 }}/4)</span>
          </div>
          <div class="card-component members" v-for="item in participants" v-bind:key="item.id">
            <div class="card mx-auto row" v-if="!item.isHost">
              <div class="col-2 left">
                <div class="icon">{{ item.name.slice(0, 1) }}</div>
              </div>
              <div class="col-8 middle text-left pl-3 pt-4">
                <div class="user-name">{{ item.name }}</div>
                <div class="source">{{ deviceType[item.deviceType] }}</div>
              </div>
              <div class="col-2 right text-center" v-if="isHost" @click="SetSharer(item.id)">
                <img v-if="item.canShare && item.isShare" src="~@/assets/images/arrow-blue.png" />
                <img v-if="item.canShare && !item.isShare" src="~@/assets/images/arrow-grey.png" />
              </div>
              <div class="col-2 right text-center" v-if="!isHost">
                <img v-if="item.isShare" src="~@/assets/images/arrow-blue.png" />
                <br v-if="!item.isShare" />
              </div>
            </div>
          </div>

          <!-- 邀請成員功能未串接 -->
          <!-- <div class="invite mx-auto row">
            <div class="col-2">
              <div class="icon"><font-awesome-icon icon="user-plus" class="ml-2" /></div>
            </div>
            <div class="col-10 text text-left pl-3">{{ $t("CONFERENCE.INVITE_MEMBER") }}</div>
          </div> -->

          <div class="desc text-center my-3">
            <div v-if="isHost && Object.keys(participants).length <= 1">{{ $t("CONFERENCE.WAITING_MEMBER") }}</div>
            <div v-if="isHost && Object.keys(participants).length > 1">{{ $t("CONFERENCE.CAN_START_CALL") }}</div>
            <div v-if="!isHost">{{ $t("CONFERENCE.WAITING_HOST") }}</div>
          </div>
          <div class="row start-call">
            <div class="col-9" v-if="isHost">
              <b-button class="ra-confirm-btn" @click="start" :disabled="!sharer">{{
                $t("CONFERENCE.START_CALL")
              }}</b-button>
            </div>
            <div :class="[isHost ? 'col-3 pl-0' : 'col-12']">
              <b-button class="ra-confirm-btn-alt" @click="leaveRoom">{{ $t("CONFERENCE.LEAVE_CALL") }}</b-button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

    <!-- 正式進入會議 -->
    <div class="m-0" v-show="step == 3">
      <div class="conf-all-section" @mousemove="onMouseMove" @touchmove="onMouseMove">
        <div class="conf-upper-section row m-0">
          <div class="conf-header col-9 row m-0 p-0 text-left">
            <div :class="isOpenMemberDialog ? 'col-3' : 'col-9'">
              <div class="recording-tip text-center" v-if="userMember && userMember.isRecording">
                <img src="~@/assets/images/recording.png" />
                {{ $t("CALL.CALL.RECORDING") }}
              </div>
              <transition name="fade" mode="out-in">
                <div class="status-tip ml-3 px-3" v-if="desktopSharer && !isOpenMemberDialog">
                  {{ desktopSharer.name }} {{ $t("CONFERENCE.IS_SHARING") }}
                </div>
              </transition>
            </div>

            <div class="col-6 text-center" v-if="desktopSharer && isOpenMemberDialog">
              {{ desktopSharer.name }} {{ $t("CONFERENCE.IS_SHARING") }}
            </div>
            <div class="col-3"></div>
            <div class="video-section text-center">
              <!-- 對方視訊畫面 -->
              <div class="video-container" id="video-container">
                <video ref="recordVideo" class="d-none"></video>
                <video
                  :class="{ 'd-none': isPaused || isAppPaused }"
                  autoplay
                  playsinline
                  id="video"
                  ref="video"
                  @play="resizeAndSendViewSize"
                ></video>
                <audio
                  class="waytofind d-none"
                  :ref="participant.id"
                  autoplay
                  controls
                  v-for="participant in participants"
                  v-bind:key="participant.id"
                ></audio>
                <div v-if="isAppPaused" class="text-center app-pause-section">
                  {{ targetName }} {{ $t("CONFERENCE.APP_PAUSE") }}
                </div>
                <!-- 標註畫板 -->
                <canvas class="canvas cv-glasses" id="cv" ref="cv"></canvas>
                <canvas
                  class="canvas cv-glasses"
                  :class="{
                    'brush-cursor': isPaused,
                  }"
                  @mousedown="onMouseDown"
                  @touchstart="onMouseDown"
                  id="cvCover"
                  ref="cvCover"
                ></canvas>
                <!-- 空白畫板，用來傳空白影片的workaround -->
                <canvas ref="emptyCv" style="display: none"></canvas>
                <canvas ref="backupCv" style="display: none"></canvas>
                <!-- 錄影畫板 -->
                <canvas class="canvas cv-glasses recordCv" id="recordCv" ref="recordCv"></canvas>
              </div>
            </div>
          </div>

          <!-- 完整通話資訊(白色底) -->
          <transition name="fade" mode="out-in">
            <div class="conf-info-all text-left col-3" v-if="isOpenMemberDialog">
              <div class="ra-title b-5">{{ $t("CONFERENCE.CONFERENCE_INFO") }}</div>
              <div class="code my-3">
                {{ $t("CONFERENCE.CODE") }}<font-awesome-icon icon="copy" class="ml-2 copy" @click="copyRoomSn" />
              </div>
              <input class="hidden-input" type="text" :value="roomSn" ref="roomSnInput" />
              <b-alert
                :show="dismissCountDown"
                dismissible
                variant="dark"
                @dismissed="dismissCountDown = 0"
                @dismiss-count-down="countDownChanged"
                class="mx-auto"
              >
                <p>{{ $t("CONFERENCE.CODE") }} ( {{ roomSn }} ) {{ $t("CONFERENCE.COPIED") }}</p>
              </b-alert>
              <div class="room-sn">{{ roomSn }}</div>
              <div class="ra-title my-3">
                {{ $t("CONFERENCE.HOST") }}
                <span v-if="isHost">({{ $t("CONFERENCE.YOU") }})</span>
              </div>
              <div class="card-component" v-if="roomHost" v-bind:key="'info1-' + roomHost.id">
                <div class="card-item mx-auto row">
                  <div class="col-3 left">
                    <div class="dynamic">
                      <div class="circle-container">
                        <div class="circle"></div>
                      </div>
                      <div class="outer" :class="'scale-' + (roomHost.isMuted ? 0 : roomHost.volume || 0)"></div>
                      <div class="inner text-center" :class="colorList[roomHost.selectedColorId].color">
                        {{ roomHost.name.slice(0, 1) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-5 middle text-left pt-3">
                    <div class="user-name">
                      <span>{{ roomHost.name }}</span>
                      <span
                        class="ml-1"
                        @click="
                          roomHost.isShare = !roomHost.isShare;
                          SetSharer(roomHost.id);
                        "
                        v-if="isHost && roomHost.canShare"
                      >
                        <img v-if="roomHost.isShare" src="~@/assets/images/arrow-blue.png" />
                        <img v-if="!roomHost.isShare" src="~@/assets/images/arrow-grey.png" />
                      </span>
                      <span
                        class="ml-1"
                        @click="
                          roomHost.isShare = !roomHost.isShare;
                          SetSharer(roomHost.id);
                        "
                        v-if="!isHost && roomHost.isShare"
                      >
                        <img v-if="roomHost.isShare" src="~@/assets/images/arrow-blue.png" />
                      </span>
                    </div>
                    <div class="source">{{ deviceType[roomHost.deviceType] }}</div>
                  </div>
                  <div class="col-4 right text-right">
                    <img
                      v-if="roomHost && roomHost.isRecording"
                      class="recording mr-2"
                      src="~@/assets/images/recording-alt.png"
                    />
                    <font-awesome-icon icon="microphone" class="microphone-on" v-if="roomHost && !roomHost.isMuted" />
                    <font-awesome-icon
                      icon="microphone-slash"
                      class="microphone-off"
                      v-if="roomHost && roomHost.isMuted"
                    />
                  </div>
                </div>
              </div>
              <div class="ra-title my-3">
                {{ $t("CONFERENCE.MEMBER") }}
                <span>({{ Object.keys(participants).length - 1 }}/4)</span>
              </div>
              <div class="card-component" v-for="item in participants" v-bind:key="item.id">
                <div class="card-item mx-auto row" v-if="!item.isHost">
                  <div class="col-3 left">
                    <div class="dynamic">
                      <div class="circle-container">
                        <div class="circle"></div>
                      </div>
                      <div class="outer" :class="'scale-' + (item.isMuted ? 0 : item.volume || 0)"></div>
                      <div class="inner text-center" :class="colorList[item.selectedColorId].color">
                        {{ item.name.slice(0, 1) }}
                      </div>
                    </div>
                  </div>

                  <div class="col-5 middle text-left pt-3">
                    <div class="user-name">
                      <span>{{ item.name }}</span>
                      <span
                        class="ml-1"
                        @click="
                          item.isShare = !item.isShare;
                          SetSharer(item.id);
                        "
                        v-if="isHost && item.canShare"
                      >
                        <img v-if="item.isShare" src="~@/assets/images/arrow-blue.png" />
                        <img v-if="!item.isShare" src="~@/assets/images/arrow-grey.png" />
                      </span>
                      <span
                        class="ml-1"
                        @click="
                          item.isShare = !item.isShare;
                          SetSharer(item.id);
                        "
                        v-if="!isHost && item.isShare"
                      >
                        <img v-if="item.isShare" src="~@/assets/images/arrow-blue.png" />
                      </span>
                    </div>

                    <div class="source">{{ deviceType[item.deviceType] }}</div>
                  </div>

                  <div
                    class="col-4 right text-right"
                    @click="
                      item.isShare = !item.isShare;
                      SetSharer(item.id);
                    "
                  >
                    <img v-if="item.isRecording" class="recording mr-2" src="~@/assets/images/recording-alt.png" />
                    <font-awesome-icon icon="microphone" class="microphone-on" v-if="!item.isMuted" />
                    <font-awesome-icon icon="microphone-slash" class="microphone-off" v-if="item.isMuted" />
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- 部分通話資訊(黑色底) -->
          <transition name="fade">
            <div class="conf-info-partial col-3" v-if="!isOpenMemberDialog && !isOpenFileDialog">
              <div class="card-component" v-for="item in participants" v-bind:key="item.id">
                <div class="card-item mx-auto row">
                  <div class="col-3 left">
                    <div class="dynamic">
                      <div class="outer" :class="'scale-' + (item.isMuted ? 0 : item.volume || 0)"></div>
                      <div class="inner text-center" :class="colorList[item.selectedColorId].color">
                        {{ item.name.slice(0, 1) }}
                      </div>
                    </div>
                  </div>

                  <div class="col-5 middle text-left">
                    <div class="user-name">
                      <span>{{ item.name }}</span>
                      <span
                        class="ml-1"
                        @click="
                          item.isShare = !item.isShare;
                          SetSharer(item.id);
                        "
                        v-if="isHost && item.canShare"
                      >
                        <img v-if="item.isShare" src="~@/assets/images/arrow-blue.png" />
                        <img v-if="!item.isShare" src="~@/assets/images/arrow-grey.png" />
                      </span>
                      <span
                        class="ml-1"
                        @click="
                          item.isShare = !item.isShare;
                          SetSharer(item.id);
                        "
                        v-if="!isHost && item.isShare"
                      >
                        <img v-if="item.isShare" src="~@/assets/images/arrow-blue.png" />
                      </span>
                    </div>
                  </div>

                  <div class="col-4 right text-right" @click="SetSharer(item.id)">
                    <img v-if="item.isRecording" class="recording mr-2" src="~@/assets/images/recording-alt.png" />
                    <font-awesome-icon icon="microphone" class="microphone-on" v-if="!item.isMuted" />
                    <font-awesome-icon icon="microphone-slash" class="microphone-off" v-if="item.isMuted" />
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- 檔案傳送接收 -->
          <transition name="fade" mode="out-in">
            <div class="file-info text-left col-3" v-if="isOpenFileDialog">
              <div class="ra-title t-5 mb-3">{{ $t("CONFERENCE.FILE_INFO") }}</div>

              <div class="desc my-3">
                {{ $t("CONFERENCE.FILE_DESC") }}
                <div class="mt-2" v-if="files.length">
                  {{ $t("CONFERENCE.FILE_LENGTH_1") }}{{ files.length }}{{ $t("CONFERENCE.FILE_LENGTH_2") }}
                </div>
                <div class="mt-5 empty-file" v-if="!files.length">{{ $t("CONFERENCE.EMPTY_FILE_LENGTH") }}</div>
              </div>
              <div class="file-component mb-3" v-for="item in files" v-bind:key="item.id">
                <div class="file-preview text-center" @mouseover="checkText(item.id)" @mouseleave="showText = 0">
                  <img class="pdf-icon" v-if="item.path.slice(-3) == 'pdf'" src="~@/assets/images/pdf-icon.png" />
                  <img class="img-thumbnail" v-if="item.path.slice(-3) != 'pdf'" :src="item.path" />
                  <div class="cover-text text-center" v-if="showText == item.id">
                    <div class="mb-4" @click="openFile(item.path)">{{ $t("CONFERENCE.PREVIEW") }}</div>
                    <div @click="downloadFile(item.path, item.name)">{{ $t("CONFERENCE.DOWNLOAD") }}</div>
                  </div>
                </div>
                <div class="file-info-text">
                  <div class="uploader-name my-2">{{ item.memberName }}</div>
                  <div class="file-name my-2">{{ item.name }}</div>
                  <div class="upload-time my-2">{{ GetDatetimeString(item.createdTime).slice(-8, -3) }}</div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <!-- 下方功能列 -->
        <div class="conf-lower-section row m-0">
          <div class="left col-2">
            <template v-if="userinfo && userinfo.type == 1">
              {{ $t("CONFERENCE.TRIAL_END_1") }} {{ remainMins > 9 ? remainMins : "0" + remainMins }}:{{
                remainSecs > 9 ? remainSecs : "0" + remainSecs
              }}
              {{ $t("CONFERENCE.TRIAL_END_2") }}
            </template>
          </div>
          <div class="function col-8 text-center">
            <!-- 標註工具 (眼鏡端畫面) -->
            <div class="draw-tools mr-3" v-if="isPaused">
              <!-- 還原 -->
              <div
                class="draw-function-btn mx-2"
                @click="undo(userMemberId)"
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
                  <div class="color-picker-list row m-0">
                    <div v-for="item in colorList" v-bind:key="item.id" class="col-3 p-0">
                      <div class="colors" :class="item.color" @click="changeColor(item.id)"></div>
                    </div>
                  </div>
                </div>
              </transition>
              <!-- 分隔線 -->
              <div class="divider mx-2"></div>
              <!-- 選擇標註工具-->
              <div
                class="draw-function-btn tool-picker mx-2"
                @click="
                  isChoosingTool = !isChoosingTool;
                  isChoosingColor = false;
                "
                v-b-tooltip.hover.top
                :title="$t('CALL.CALL.TIP_DRAW_TOOL')"
              >
                <font-awesome-icon v-if="drawFunction == 0" icon="paint-brush" size="2x" />
                <img class="ml-0" v-if="drawFunction == 1" src="~@/assets/images/draw-straight-arrow-alt.png" />
                <img class="ml-0" v-if="drawFunction == 2" src="~@/assets/images/draw-freehand-arrow-alt.png" />
                <img class="ml-0" v-if="drawFunction == 3" src="~@/assets/images/draw-circle-alt.png" />
              </div>
              <!-- 標註工具選單 -->
              <transition name="fade">
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
              v-if="!isPaused"
              @click="pause(userMemberId)"
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
              v-if="hasMic"
              @click="toggleMute(!isMuted)"
              :title="[isMuted ? $t('CALL.CALL.TIP_MIC_ON') : $t('CALL.CALL.TIP_MIC_OFF')]"
            >
              <font-awesome-icon icon="microphone-slash" size="1x" />
            </div>
            <!-- 沒有麥克風 -->
            <div
              class="function-btn red p-0 mx-2 text-center"
              v-b-tooltip.hover.top
              v-if="!hasMic"
              :title="$t('CALL.CALL.TIP_MIC_NONE')"
            >
              <font-awesome-icon icon="microphone-slash" size="1x" />
            </div>

            <!-- 手電筒 -->
            <div
              class="function-btn grey-1 p-0 mx-2 text-center"
              :class="[isTurnOn ? 'blue' : 'grey-1', isSharing || isAppPaused ? 'disabled-button' : 'grey-1']"
              @click="toggleLight"
              v-b-tooltip.hover.top
              :title="[isTurnOn ? $t('CALL.CALL.TIP_FLASH_OFF') : $t('CALL.CALL.TIP_FLASH_ON')]"
            >
              <img v-if="!isTurnOn" class="flashlight ml-0" src="~@/assets/images/flashlight.png" />
              <img v-if="isTurnOn" class="flashlight ml-0" src="~@/assets/images/flashlight_alt.png" />
            </div>

            <!-- 開始分享畫面 -->
            <div
              class="function-btn grey-1 p-0 mx-2 text-center"
              :class="[isAppPaused ? 'disabled-button' : 'grey-1']"
              v-if="!isPaused && !desktopSharer"
              v-b-tooltip.hover.top
              @click="showDesktop"
              :title="$t('CALL.CALL.TIP_START_SHARE_SCREEN')"
            >
              <img class="recording" src="~@/assets/images/arrow-white.png" />
            </div>

            <!-- 停止分享畫面 -->
            <div
              class="function-btn white p-0 mx-2 text-center"
              v-if="!isPaused && desktopSharer"
              v-b-tooltip.hover.top
              @click="stopShowDesktop"
              :title="
                isSharer ? $t('CALL.CALL.TIP_STOP_SHARE_SCREEN') : desktopSharer.name + $t('CONFERENCE.IS_SHARING')
              "
            >
              <img class="recording" src="~@/assets/images/arrow-blue.png" />
            </div>

            <!-- 開始錄影 -->
            <div
              class="function-btn grey-1 p-0 mx-2 text-center"
              id="btnStartRecording"
              v-if="!isPaused && userMember && !userMember.isRecording"
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
              v-if="!isPaused && userMember && userMember.isRecording"
              @click="btnStopRecording"
              v-b-tooltip.hover.top
              :title="$t('CALL.CALL.TIP_STOP_RECORDING')"
            >
              <img class="recording ml-0" src="~@/assets/images/recording-alt.png" />
            </div>

            <!-- 傳送檔案 -->
            <div
              class="function-btn grey-1 p-0 mx-2 text-center"
              v-if="!isPaused"
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
                accept=".pdf, .jpg, .png, .jpeg"
                ref="selectFile"
                hidden
                @change="selectFileToSend"
              />
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
          <div class="right col-2 text-left">
            <!-- 開啟通話資訊 -->
            <span
              class="mx-3 conf-info-switch"
              :class="isOpenMemberDialog ? '' : 'placeholderHover'"
              @click="toggleMemberDialog"
              v-b-tooltip.hover.top
              :title="$t('CONFERENCE.CONFERENCE_INFO')"
              ><font-awesome-icon icon="user-friends" size="2x"
            /></span>

            <!-- 可下載檔案清單 -->
            <span
              class="mx-3 file-upload"
              :class="isOpenFileDialog ? '' : 'placeholderHover'"
              @click="toggleFileDialog"
              v-b-tooltip.hover.top
              :title="$t('CONFERENCE.FILE_LIST')"
              ><font-awesome-icon icon="file" size="2x" />
            </span>
            <!-- <div class="new-file-tip"></div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 通話結束步驟，標註總覽 -->
    <div class="row m-0" v-if="step == 4">
      <RAHeader :title="$t('CALL.CALL.MEETING_SUMMARY')" showCancelBtn :pageUrl="{ name: 'RARating' }" />
      <div class="screen-capture-section mx-auto">
        <div class="checkbox-list row">
          <div class="col-6" v-for="(item, index) in captures" v-bind:key="index">
            <input type="checkbox" :checked="item.selected" :id="index" @click="toggleSelect(index)" />
            <img :src="item.dataUrl" />
            <label :for="index"><font-awesome-icon icon="check-circle" size="3x"/></label>
          </div>
        </div>
      </div>

      <div class="ra-footer">
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

      <b-alert
        :show="dismissCountDownCapture"
        variant="dark"
        @dismissed="dismissCountDownCapture = 0"
        @dismiss-count-down="countDownChanged"
        class="mx-auto download-alert"
      >
        <p><font-awesome-icon icon="check-circle" class="green-icon mr-2" />{{ $t("CALL.CALL.DOWNLOAD_SUCCESS") }}</p>
      </b-alert>
    </div>

    <div class="send-file-modal" v-if="sendFileModal">
      {{ sendFileTitle }}
      <div class="ra-form-group my-3 mx-auto text-center">
        <div class="row" v-if="transferStep == 1 || transferStep == 2">
          <font-awesome-icon icon="file" class="grey col-2 mt-2" size="2x" />
          <div class="col-10">
            <p class="text-left" style="font-size: 12px; margin: 0">{{ sendFileName }}</p>
            <p class="text-left" style="font-size: 12px; color: #b7b7b7; margin: 0">{{ sendFileSize }} bytes</p>
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
        <!-- <b-button
          type="submit"
          class="ra-confirm-btn mt-4 mb-3 mx-auto"
          aria-label="Close"
          data-dismiss="modal"
          @click="stopSendingFile()"
          v-if="transferStep == 3 || transferStep == 4"
          >{{ $t("GENERAL.OK") }}</b-button
        > -->
      </div>
    </div>
  </div>
</template>

<script>
  //#region imports
  import Footer from "@/components/Footer.vue";
  import RAHeader from "@/components/RAHeader.vue";
  import { GetDatetimeString } from "@/utils/date";
  import axios from "axios";
  import { saveAs } from "file-saver";
  import JsZip from "jszip";
  import kurentoUtils from "kurento-utils";
  import RecordRTC from "recordrtc";
  import { getSeekableBlob } from "@/utils/ebml.util.js";
  // import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
  // const ffmpeg = createFFmpeg({
  //   corePath: "/ffmpeg-core.js",
  //   log: true,
  // });
  //#endregion

  //#region Constants

  let CHUNK_SIZE = 64000;

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

  let SNAPSHOT_RESOLUTION = 720;
  let SNAPSHOT_COMPRESS_RATIO = 0.5;

  function TagLine(type, x1, y1, x2, y2, selectedColorId) {
    this.type = type;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.selectedColorId = selectedColorId;
  }

  let mousedown = function() {};
  let mousemove = function() {};
  let mouseup = function() {};
  let canvasFunctions = {};

  //#endregion

  // const show = true
  export default {
    name: "Conference",
    components: {
      RAHeader,
      Footer,
    },
    props: {
      isCreate: Boolean,
    },
    data: () => ({
      componentId: "Conference",
      pc: null,
      ws: null,
      roomUuid: "",
      roomSn: null,
      step: 0,
      isChoosingColor: false,
      isChoosingTool: false,
      isPaused: false,
      isAppPaused: false,
      changeCursor: false,
      hasARCore: false,
      isSharing: false,
      isTurnOn: false,
      isMuted: false,
      isShowRemote: true,
      // 畫圖的筆劃寬度
      lineWidth: 5,
      fontsize: 24,
      drawFunction: 0,
      // 標註截圖
      captures: [],
      // 標註指標列表，用於顯示箭頭
      pointers: [],
      // 會議參與者
      participants: {},
      // 會議發起人
      roomHost: null,
      // 分享端
      sharer: null,
      // 分享畫面的人
      desktopSharer: null,
      // 分享畫面的文字
      shareText: null,
      audios: {},
      files: [],
      userMember: null,
      dismissSecs: 3,
      dismissCountDown: 0,
      dismissCountDownShare: 0,
      // alert消失倒數秒數(標註截圖)
      dismissCountDownCapture: 0,
      // alert消失倒數秒數(錄影下載)
      dismissCountDownRecord: 0,
      selectAll: false,
      deviceType: { 1: "App", 2: "Web", 3: "Glasses" },
      isOpenMemberDialog: false,
      isOpenFileDialog: false,
      alertMsg: "",
      // 已選擇的畫筆顏色對應的ID
      selectedColorId: 0,
      // 畫筆顏色列表
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
      drawingFlag: false,
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
      sendFileTitle: "",
      // 傳送檔案modal flag
      sendFileModal: false,
      showText: 0,
      sender: null,
      startTime: null,
      endTime: null,
      progressSecs: 0,
      progressMins: 0,
      remainSecs: 0,
      remainMins: 0,
      userinfo: null,
      isServerRecording: false,
      hasMic: false,
    }),
    created() {
      window.test = this;
      if (!("WebSocket" in window)) {
        this.$alert("此瀏覽器不支援Web Socket連線");
        this.toContact();
      }

      this.userinfo = this.$cookies.get("user");
      if (!this.userinfo) this.$router.push({ name: "Login" });

      this.initWS(() => {
        if (this.isCreate) this.sendMessage("Create", { token: this.$cookies.get("token") });
        else this.changeStep(1);
      });
      this.$store.state.contact = true;
      this.$store.state.callHistory = false;
      this.$store.state.settings = false;
      window.addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
          if (this.step == 1) this.join();
        }
      });
      window.onbeforeunload = (env) => {
        console.log("onbeforeunload");
        console.log(this.didBeforeDestroy);
        if (!this.didBeforeDestroy) {
          if (!this.isLeaved) {
            this.isLeaved = true;
            this.sendMessage("Leave");
          }
        }
        this.stopAllResources();
        // return "message here";
      };
    },
    mounted() {
      this.initialReferences();
      this.createResizeObserver();
      window.onblur = () => {
        if (this.recorder) {
          this.btnStopRecording();
          // alert("離開頁面所以停止錄影");
        }
      };
    },
    beforeDestroy() {
      console.log("beforeDestroy");
      this.didBeforeDestroy = true;
      this.stopAllResources();
    },
    Destroyed() {
      console.log("Destroyed");
      this.stopAllResources();
    },
    methods: {
      GetDatetimeString,
      // includeJs(path) {
      //   let script = document.createElement("script");
      //   script.setAttribute("src", path);
      //   document.head.appendChild(script);
      // },

      stopAllResources() {
        if (!this.closeFlag) {
          this.closeFlag = true;
          if (this.ws) this.ws.close();
          if (this.webRtcPeer) this.webRtcPeer.dispose();
          if (this.displayStream) this.stopTrack(this.displayStream);
          this.closePC();
          this.btnStopRecording();
        }
      },
      closePC() {
        if (this.pc) {
          this.pc.getSenders().forEach((sender) => {
            if (sender.track) {
              console.log(sender.track);
              sender.track.stop();
            }
          });
          this.pc.close();
        }
        this.pc = null;
      },
      initWS(callback) {
        let url = `${this.$ws}/mcu`;
        let ws = new WebSocket(url);
        this.ws = ws;
        if (callback) ws.onopen = callback;
        let handleMessage = async (message) => {
          try {
            let { type, payload } = JSON.parse(message);
            if (type != "Line" && type != "Participants")
              console.log(`receive websocket message type ${type}`, payload);
            if (ws.func[type]) ws.func[type](payload);
            else console.log(`function not found`);
          } catch (e) {
            console.log(e);
          }
        };
        ws.sendObj = (obj) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(obj));

        ws.sendMessage = (type, payload) => ws.sendObj({ type, payload });
        ws.onmessage = function(evt) {
          if (evt.data instanceof Blob) {
            let reader = new FileReader();
            reader.onload = () => handleMessage(reader.result);
            reader.readAsText(evt.data);
          } else handleMessage(evt.data);
        };
        ws.func = {};
        ws.func["CreateResp"] = ({ Code, RData: { uuid, sn, memberId, isMuted, selectedColorId } }) => {
          if (Code != 0) {
            console.log(`建立多人通話失敗: ${Code}`);
            this.$alert("建立多人通話失敗");
            this.toContact();
            return;
          }

          this.roomUuid = uuid;
          this.roomSn = sn;
          this.userMemberId = memberId;
          this.isHost = true;
          this.selectedColorId = selectedColorId;
          this.initPC();
        };
        ws.func["JoinResp"] = ({
          Code,
          RData: { uuid, isStart, memberId, selectedColorId, isMuted, endTime, startTime },
        }) => {
          if (Code == 0) {
            console.log(`memberId=${memberId} uuid=${uuid}`);
            this.roomUuid = uuid;
            this.isStart = isStart;
            this.userMemberId = memberId;
            this.selectedColorId = selectedColorId;
            if (isStart) {
              console.log(startTime);
              this.startTime = new Date(startTime + " UTC");
              console.log(this.startTime);
              this.endTime = new Date(endTime + " UTC");
            }
            console.log(isMuted);
            this.initPC();
          } else {
            // 之後要改成別的CODE
            // 連接碼錯誤，請重新輸入 & 通話人數已滿，暫時無法加入
            this.alertMsg = this.getMessage(Code);
          }
        };
        ws.func["LeaveResp"] = ({ Code, RData }) => {
          this.hangup();
        };

        ws.func["StartResp"] = ({ Code, RData: { startTime, endTime } }) => {
          if (Code != 0) return this.$alert(this.getMessage(Code));
          this.isStart = true;
          console.log(startTime);
          this.startTime = new Date(startTime + " UTC");
          console.log(this.startTime);
          this.endTime = new Date(endTime + " UTC");
          this.changeStep(3);
        };
        ws.func["OfferResp"] = ({ Code, RData: { sdpAnswer } }) => {
          if (Code != 0) return alert(this.getMessage(Code));
          this.webRtcPeer.processAnswer(sdpAnswer);
        };
        ws.func["IceCandidate"] = ({ Code, RData: { candidate } }) => {
          this.webRtcPeer.addIceCandidate(candidate);
        };
        ws.func["Participants"] = async ({ Code, RData: { participants, host, sharer, screenSharer } }) => {
          let flag = false;
          for (let participant of participants) {
            let currentParticipant = this.participants[participant.id];
            // current user
            if (!currentParticipant) {
              this.participants[participant.id] = participant;
              flag = true;
              if (participant.account == this.userinfo.account) {
                this.userMember = participant;
                this.userMemberId = this.userMember.id;
              }
            } else {
              for (let key in currentParticipant) {
                if (currentParticipant[key] != participant[key]) {
                  currentParticipant[key] = participant[key];
                  flag = true;
                }
              }
            }
          }

          for (let id in this.participants) {
            if (participants.find((p) => p.id == id)) continue;
            delete this.participants[id];
            flag = true;
          }
          if (flag) {
            console.log("update participants");
            this.participants.__ob__.dep.notify();
          }

          this.roomHost = host;
          this.sharer = sharer;
          this.desktopSharer = screenSharer;
        };
        ws.func["TorchResp"] = ({ Code, RData: { turnOn, tip } }) => {
          this.isTurnOn = turnOn;
          if (this.userMember && this.userMember.isSharer) {
            this.sendMessage("Torch", { turnOn });
          } else {
            this.torchTip = tip;
          }
        };
        ws.func["PauseResp"] = ({ Code, RData: { snapshot, senderId }, Success }) => {
          if (this.userMember && this.userMemberId == senderId) {
            if (!Success) console.log(`PauseResp failed Code=${Code}`);
          } else {
            let image = new Image();
            image.onload = () => {
              console.log(`image width: ${image.width}, height: ${image.height}`);
              this.ctx.drawImage(image, 0, 0, this.cv.width, this.cv.height);
              this.pause(senderId);
            };

            image.src = "data:image/jpg;base64," + snapshot;
          }
        };
        ws.func["LineResp"] = ({ Code, RData: { type, senderId, x1, y1, x2, y2, color } }) => {
          let w = this.cv.width,
            h = this.cv.height;
          if (this.isPaused) this.drawToCtx(type, x1 * w, y1 * h, x2 * w, y2 * h, senderId, color);
        };
        ws.func["UndoResp"] = ({ Code, RData: { senderId } }) => {
          this.undo(senderId);
        };
        ws.func["ResumeResp"] = ({ Code, RData: { senderId }, Success }) => {
          if (this.userMember && this.userMemberId == senderId && !Success) {
            console.log(`ResumeResp failed Code=${Code}`);
          } else {
            this.saveAndClearCanvas();
            this.isPaused = false;
            this.showToast(this.$t("CONFERENCE.RESUMED"), senderId);
          }
        };
        ws.func["ScreenShareResp"] = ({ Code, RData: { senderId } }) => {
          if (Code == 0) {
            this.isSharing = true;
            if (senderId == this.userMemberId) {
              this.setVideoTrack(this.displayStream);
            }
            this.showShareAlert("you");
          }
          if (Code < 0 && senderId == this.userMemberId) {
            if (this.displayStream) this.stopTrack(this.displayStream);
            this.alertMsg = "其他人正在分享";
            this.showShareAlert("other");
          }
        };
        ws.func["StopScreenShareResp"] = ({ Code, RData: { senderId } }) => {
          if (Code == 0) {
            this.isSharing = false;
            this.showShareAlert("stop");
            this.showToast(this.$t("CONFERENCE.CANCELLED_SHARING"), senderId);
          }
        };
        ws.func["StartRecordResp"] = ({ Code, RData: { isServerRecording } }) => {
          if (Code == 0) {
            this.isServerRecording = isServerRecording;
          }
        };
        ws.func["StopRecordResp"] = ({ Code, RData: { isServerRecording } }) => {
          if (Code == 0) {
            this.isServerRecording = isServerRecording;
          }
        };
        ws.func["Files"] = ({ Code, RData: { files } }) => {
          this.files = files.slice().reverse();
          console.log(this.files);
          this.showToast(this.$t("CONFERENCE.UPLOADED_FILE"), files[0].memberId);
        };
      },
      initPC() {
        let that = this;
        let env = this.$config.env;
        let showLocalCamera = false; //env == "local";
        let self = true; //memberId === this.userMemberId;
        if (this.webRtcPeer) return console.log(`peer exist`);

        this.pc = new RTCPeerConnection({ iceServers: this.$config.iceServers });

        this.pc.onconnectionstatechange = function() {
          if (that.pc != this) {
            return this.close();
          }
          // setInterval(() => {
          //   console.log(that.volume);
          // }, 100);
          console.log(`pc.connectionState = ${this.connectionState}`);
          switch (this.connectionState) {
            case "connected": {
              let audioTrack = this.getLocalStreams()[0] && this.getLocalStreams()[0].getAudioTracks()[0];
              if (audioTrack) {
                console.log(audioTrack);
                // volume meter
                let speechEvent = kurentoUtils.WebRtcPeer.hark(this.getLocalStreams()[0], { threshold: -50 });
                speechEvent.on("volume_change", (v) => {
                  if (!that.userMember) return;
                  /* do something on the UI */
                  if (speechEvent.speaking) {
                    let val = Math.ceil((100 + v) / 20); // v=> 0~-100
                    if (val != that.userMember.volume) that.sendMessage("Volume", { volume: val });
                  } else if (that.userMember.volume != 0) that.sendMessage("Volume", { volume: 0 });
                });
              } else console.log("no audio track to be hark");

              break;
            }
            case "disconnected":
            case "failed":
            case "closed":
              console.log(`${that.userMemberId}斷線`);
              that.webRtcPeer && that.webRtcPeer.dispose();
              that.webRtcPeer = null;
              that.initPC();
              break;
          }
        };

        var options = {
          localVideo: undefined,
          remoteVideo: this.video,
          peerConnection: this.pc,
          onicecandidate: (candidate) => {
            this.sendMessage("IceCandidate", { candidate });
          },
          // configuration: { iceServers: this.$config.iceServers },
          mediaConstraints: {
            audio: true,
            video: {
              mandatory: {
                maxWidth: 1920,
                maxHeight: 1080,
                minWidth: 1280,
                minHeight: 720,
              },
            },
          },
        };

        if (!showLocalCamera) this.setVideoTrack(this.emptyCv.captureStream());

        let interval = setInterval(() => {
          if (this.userMember) {
            if (this.isStart) this.changeStep(3);
            else this.changeStep(2);
            clearInterval(interval);
            this.toggleMute(true);
          }
        }, 100);
        let callback = function(error) {
          if (error) return that.onError(error);
          this.generateOffer((error, sdpOffer) => {
            if (error) return that.onError(error);
            that.sendMessage("Offer", { sdpOffer });
          });
        };
        if (navigator && navigator.getUserMedia) {
          // 處理沒有音訊的問題
          navigator.getUserMedia(
            { audio: true },
            () => {
              this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, callback);
              this.hasMic = true;
            },
            () => {
              this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, callback);
              this.hasMic = false;
            }
          );
        } else {
          this.webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, callback);
          this.hasMic = false;
        }
      },
      changeStep(step) {
        this.step = step;

        if (step == 1) this.$changeTitle(this.$t("APP.TITLE.JoinConference"));
        else if (step == 2) this.$changeTitle(this.$t("APP.TITLE.CreateConference"));
        else if (step == 4) this.$changeTitle(this.$t("APP.TITLE.ConferenceScreenshots"));
        else if (step == 3) {
          this.$changeTitle(this.$t("APP.TITLE.RAConference"));
          setInterval(() => {
            let progressTime = Math.floor((new Date() - this.startTime) / 1000);
            this.progressMins = Math.floor(progressTime / 60);
            this.progressSecs = progressTime - this.progressMins * 60;
            let remainTime = Math.floor((this.endTime - new Date()) / 1000);
            this.remainMins = Math.floor(remainTime / 60);
            this.remainSecs = remainTime - this.remainMins * 60;
            //倒數時間需要format，目前十位數沒有0
          }, 1000);
        }
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
          })
          .catch((error) => {
            console.error("Error:" + error.name);
            this.displayStream = null;
          });
      },
      sendMessage(type, payload) {
        if (type != "Line" && type != "Volume") console.log(`send type ${type}`);
        this.ws.sendMessage(type, payload);
      },
      onError(error) {
        console.log(error);
      },
      join() {
        this.sendMessage("Join", { token: this.$cookies.get("token"), roomSn: this.roomSn });
      },
      start() {
        this.sendMessage("Start");
      },
      hangup() {
        if (this.isLeaved) return;
        this.isLeaved = true;
        this.sendMessage("Leave");

        sessionStorage.setItem("tagCount", this.captures.length);
        sessionStorage.setItem("roomUuid", this.roomUuid);
        if (!this.captures.length) {
          // 如果正在錄影時被中斷，需要帶參數至評分頁
          // if (this.userMember.isRecording) {
          //   this.$router.push({
          //     name: "Rating",
          //     params: {
          //       recordStatus: "canceled",
          //     },
          //   });
          // } else {
          //   this.$router.push({
          //     name: "Rating",
          //   });
          // }
          this.toContact();
        } else {
          // 如果正在錄影時被中斷，需要開啟"通話已結束"modal
          if (this.userMember && this.userMember.isRecording) {
            this.$bvModal.show("recordCanceledModal");
          }
          this.stopAllResources();
          this.checkSelectAll();
          this.changeStep(4);
        }
      },
      leaveRoom() {
        console.log(`leaveRoom ${this.isLeaved}`);
        if (this.isLeaved) return;
        this.isLeaved = true;
        this.sendMessage("Leave");
        this.toContact();
      },
      SetSharer(id) {
        this.sendMessage("SetSharer", { id });
      },
      pause(senderId) {
        if (this.isPaused || !this.isShowRemote || this.isAppPaused || this.isSharing) return;
        this.isPaused = true;
        this.userDraws = {};
        if (senderId == this.userMemberId) {
          this.drawVideoToCanvas();
          this.sendSnapshot();
        }
        this.backupCanvas();
        // initial
        this.changeDrawFunction();
      },
      sendSnapshot() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let ratio = SNAPSHOT_RESOLUTION / this.video.videoHeight;
        canvas.width = this.video.videoWidth * ratio;
        canvas.height = this.video.videoHeight * ratio;
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        let data = canvas.toDataURL("image/jpeg", SNAPSHOT_COMPRESS_RATIO);
        if (data.indexOf(",") > 0) data = data.split(",")[1];
        let a = Date.now();
        this.sendMessage("Pause", { snapshot: data });
      },
      //#endregion
      resume() {
        if (!this.isPaused) return;
        this.sendMessage("Resume");
      },
      undo(senderId) {
        if (this.isPaused) {
          let userDraw = this.userDraws[senderId];
          if (userDraw && userDraw.tagPaths.length > 0) {
            userDraw.tagPaths.pop();
            this.redrawCanvas();
            if (senderId == this.userMemberId) {
              this.sendMessage("Undo");
            }
          }
        }
      },
      toggleLight() {
        //正在分享畫面或傳送檔案時不可開啟手電筒
        if (this.isSharing || this.isSendingFile || this.isAppPaused) return;
        this.sendMessage("Torch", { turnOn: this.isTurnOn ? 0 : 1 });
      },
      toggleMute(muted) {
        this.isMuted = muted;

        this.sendMessage("Mute", { isMuted: this.isMuted });
        // if (this.isMuted) this.sendMessage("Volume", { volume: 0 });

        // if (this.localStream) {
        //   this.localStream.getAudioTracks().forEach((track) => (track.enabled = !this.isMuted));
        // }

        var sender =
          this.pc &&
          this.pc.getSenders().find(function(s) {
            return s && s.track && s.track.kind == "audio";
          });
        if (sender) sender.track.enabled = !this.isMuted;
      },
      changeColor(id) {
        this.selectedColorId = id;
        this.isChoosingColor = !this.isChoosingColor;
        this.sendMessage("Color", { selectedColorId: id });
      },
      async showDesktop() {
        console.log("showDesktop");
        if (this.isPaused) return;

        if (this.desktopSharer) return (this.alertMsg = this.$t("CONFERENCE.ALERT_OTHER_IS_SHARING"));
        else {
          // get display screen
          await this.initDisplayMedia();
          // if don't get stream or stream is not available then return
          if (!this.displayStream) return;

          this.sendMessage("ScreenShare");
        }
      },
      async stopShowDesktop() {
        console.log("stopShowDesktop");
        if (!this.isSharing) return;

        if (this.displayStream) {
          this.stopTrack(this.displayStream);
          // this.setVideoTrack(this.emptyCv.captureStream());
        }

        this.sendMessage("StopScreenShare");
      },
      showFileDialog(e) {
        if (this.isAppPaused) return;
        // if (!this.isSendingFile) {
        if (this.$refs.selectFile.value.length == 0) {
          this.transferStep = 1;
          this.$refs.selectFile.click();
          this.isSendingFile = true;
        } else this.stopSendingFile();
      },
      selectFileToSend(e) {
        let validExts = new Array(".pdf", ".jpg", ".jpeg", ".png");
        let file = e.target && e.target.files[0];
        if (file) {
          console.log(file);
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
            this.cancelTokenSource = axios.CancelToken.source();
            const config = {
              onUploadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                this.sendingRate = percentCompleted;
              },
              cancelToken: this.cancelTokenSource.token,
              headers: { "Content-Type": "multipart/form-data" },
            };
            this.sendFileName = file.name;
            this.sendFileSize = file.size;
            this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_SELECTING");
            this.sendFileModal = true;

            let form = new FormData();
            form.append("file", file);
            form.append("roomSn", this.roomSn);
            form.append("memberId", this.userMemberId);
            axios
              .post(`${this.$origin}/conference-file`, form, config)
              .then((res) => {
                // alert("success");
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              })
              .finally(() => {
                this.transferStep = 3;
                this.stopSendingFile();
                // this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_COMPLETED");
                this.cancelTokenSource = null;
              });
          }
        }
      },
      stopSendingFile() {
        if (this.cancelTokenSource) this.cancelTokenSource.cancel();
        this.isSendingFile = false;
        this.sendingRate = 0;
        this.sendFileModal = false;
        this.$refs.selectFile.value = null;
        if (this.transferStep == 3) {
          this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_COMPLETED");
        } else this.sendFileTitle = this.$t("CALL.CALL.SEND_FILE_CANCELLED");
      },

      toggleMemberDialog() {
        if (!this.isOpenMemberDialog) {
          this.isOpenFileDialog = false;
        }
        this.isOpenMemberDialog = !this.isOpenMemberDialog;
      },
      toggleFileDialog() {
        if (!this.isOpenFileDialog) {
          this.isOpenMemberDialog = false;
        }
        this.isOpenFileDialog = !this.isOpenFileDialog;
      },
      downloadFile(url, name) {
        axios({
          url: url,
          method: "GET",
          responseType: "blob", // important
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", name);
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
      },
      openFile(url) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      bytesToSize(bytes) {
        var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes == 0) return "0 Byte";
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
      },
      //#region general
      toContact() {
        if (this.redirectFlag) return;
        this.redirectFlag = true;
        this.$router.push({ name: "RAContact" });
      },
      createResizeObserver() {
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            if (entry.target === this.video) this.resizeAndSendViewSize();
          }
        });
        resizeObserver.observe(this.video);
      },
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown;
      },
      getRoomSn(value) {
        this.roomSn = value;
      },
      copyRoomSn() {
        let copyText = this.roomSnInput;
        // copyText.select();
        // copyText.setSelectionRange(0, 99999); /* For mobile devices */
        // document.execCommand("copy"); /* Copy the text inside the text field */
        navigator.clipboard
          .writeText(copyText)
          .then(() => {
            this.showCopyAlert();
          })
          .catch((error) => {
            console.log(`Copy failed! ${error}`);
          });
      },
      showCopyAlert() {
        this.dismissCountDown = this.dismissSecs;
      },
      showShareAlert(type) {
        this.dismissCountDownShare = this.dismissSecs;
        if (type == "you") {
          this.shareText = this.$t("CONFERENCE.ALERT_YOU_ARE_SHARING");
        } else if (type == "other") {
          this.shareText = this.$t("CONFERENCE.ALERT_OTHER_IS_SHARING");
        } else this.shareText = this.$t("CONFERENCE.ALERT_STOP_SHARING");
      },
      stopTrack(stream) {
        console.log(`stopTrack`);
        if (stream /* && stream.active*/) {
          for (let track of stream.getTracks() || []) {
            console.log(track);
            track.stop();
          }
        }
        stream = null;
      },
      setVideoTrack(stream) {
        if (stream) {
          let videoTrack = stream.getVideoTracks()[0];
          console.log(`videoTrack`, videoTrack);
          if (!videoTrack) return;
          var sender =
            this.pc &&
            this.pc.getSenders().find(function(s) {
              return s && s.track && s.track.kind == videoTrack.kind;
            });
          if (sender) {
            sender.replaceTrack(videoTrack);
            console.log(`replaceTrack`);
          } else {
            this.pc && this.pc.addTrack(videoTrack);
            console.log(`addTrack`);
          }
        }
      },
      //#endregion

      //#region canvas methods

      initialReferences() {
        console.log("initialReferences");
        console.log(this.$refs);
        this.cv = this.$refs.cv;
        this.cvCover = this.$refs.cvCover;
        this.video = this.$refs.video;
        this.emptyCv = this.$refs.emptyCv;
        this.recordCv = this.$refs.recordCv;
        this.backupCv = this.$refs.backupCv;
        this.roomSnInput = this.$refs.roomSnInput;
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
        this.initialCanvasFunctions();
      },

      initialCanvasFunctions() {
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
            if (x < 0 || y < 0 || x > this.cv.offsetWidth || y > this.cv.offsetHeight) return;
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
            console.log("mouseup");
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
            console.log("mousedown");
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
            console.log("mouseup");
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

      //#region resize
      resizeAndSendViewSize() {
        if (this.isPaused) return;
        let rect = this.video.getBoundingClientRect();
        this.resizeCanvas();
        // this.cmdRemoteViewSize(Math.floor(rect.width), Math.floor(rect.height));
      },
      resizeCanvas() {
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
        } else
          setTimeout(() => {
            this.resizeCanvas();
          }, 100);
      },
      //#endregion
      //#region event handler
      onMouseDown(e) {
        // glass must stop first
        if (!this.isPaused) return;
        e.preventDefault();
        this.drawingFlag = true;

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
        if (!this.drawingFlag) return;
        e.preventDefault();
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
        this.drawingFlag = false;
        mouseup();
      },
      onMouseUp(e) {
        if (!this.drawingFlag) return;
        e.preventDefault();
        if (e.type == "touchend") {
          mouseup();
        } else {
          let x = e.target.offsetLeft + e.offsetX - this.cv.offsetLeft;
          let y = e.target.offsetTop + e.offsetY - this.cv.offsetTop;
          this.drawingFlag = false;
          if (x >= 0 && y >= 0 && x <= this.cv.offsetWidth && y <= this.cv.offsetHeight) {
            mouseup(x, y);
          } else mouseup();
        }
      },
      //#endregion

      //#region Command

      cmdAddLine(type, x1, y1, x2, y2, color) {
        let w = this.cv.width,
          h = this.cv.height;
        (x1 /= w), (x2 /= w), (y1 /= h), (y2 /= h);
        this.sendMessage("Line", { type, x1, y1, x2, y2, color });
      },

      //#endregion

      drawVideoToCanvas() {
        this.resizeCanvas();
        this.ctx.drawImage(this.video, 0, 0, this.cv.width, this.cv.height);
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
      saveAndClearCanvas() {
        // save result and clear canvas and remove temp lines
        for (let id in this.userDraws) {
          if (this.userDraws[id].tagPaths.length) {
            this.saveCanvas();
            break;
          }
        }
        this.clearCanvas();
        this.userDraws = {};
      },
      saveCanvas() {
        let dataUrl = this.cv.toDataURL("image/jpg");
        this.captures.push({ selected: true, dataUrl: dataUrl });
      },
      clearCanvas() {
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
      },
      clearCanvasCover() {
        this.ctxCover.clearRect(0, 0, this.cvCover.width, this.cvCover.height);
      },
      redrawCanvas() {
        this.recoverCanvas();
        for (let id in this.userDraws) {
          for (let tagLines of this.userDraws[id].tagPaths) {
            for (let tagLine of tagLines) this.drawTagLineToCanvas(this.ctx, tagLine);
          }
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
        this.cv.width = this.backupCv.width;
        this.cv.height = this.backupCv.height;
        this.ctx.drawImage(this.backupCv, 0, 0);
      },
      backupCanvas() {
        this.backupCv.width = this.cv.width;
        this.backupCv.height = this.cv.height;
        this.backupCtx.drawImage(this.cv, 0, 0);
      },
      drawToCtx(type, x1, y1, x2, y2, senderId = this.userMemberId, colorId = this.selectedColorId) {
        // 如果還沒有該使用者畫圖的資料
        if (!this.userDraws[senderId]) this.userDraws[senderId] = { tagPaths: [], tagLines: [] };
        let userDraw = this.userDraws[senderId];
        // 開始的點，建立圖點陣列
        if (type == POINT_BEGIN || type == LINE_OVAL) {
          userDraw.tagLines = [];
          userDraw.tagPaths.push(userDraw.tagLines);
        }
        let tagLine = new TagLine(type, x1, y1, x2, y2, colorId);
        this.drawTagLineToCanvas(this.ctx, tagLine);
        if (!userDraw.tagLines) {
          userDraw.tagLines = [];
          userDraw.tagPaths.push(userDraw.tagLines);
        }
        userDraw.tagLines.push(tagLine);

        if (senderId == this.userMemberId) this.cmdAddLine(type, x1, y1, x2, y2, colorId);
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
        let now = new Date();
        let dateStr =
          ("0" + (now.getMonth() + 1)).slice(-2) +
          ("0" + now.getDate()).slice(-2) +
          ("0" + now.getHours()).slice(-2) +
          ("0" + now.getMinutes()).slice(-2);
        zip.generateAsync({ type: "blob" }).then(
          (blob) => {
            saveAs(blob, `ARRemoteAssistance_${dateStr}.zip`);
            // show download alert
            this.dismissCountDownCapture = this.dismissSecs;
          }
          // (err) => console.log(err)
        );
      },
      btnStartRecording() {
        if (!this.recordInterval) {
          this.recordInterval = setInterval(() => {
            try {
              this.recordCtx.drawImage(this.video, 0, 0, this.recordCv.width, this.recordCv.height);
              this.recordCtx.drawImage(this.cv, 0, 0, this.recordCv.width, this.recordCv.height);
              this.recordCtx.drawImage(this.cvCover, 0, 0, this.recordCv.width, this.recordCv.height);
            } catch (e) {
              clearInterval(this.recordInterval);
            }
          }, 1000 / 30);
        }
        let cvStream = this.recordCv.captureStream();

        const audioContext = new AudioContext();
        let dest = audioContext.createMediaStreamDestination();

        let sender = this.pc && this.pc.getSenders().find((s) => s && s.track && s.track.kind == "audio");
        if (sender && sender.track) {
          let audio = audioContext.createMediaStreamSource(new MediaStream([sender.track]));

          audio && audio.connect(dest);
        }

        let tracks = this.video.srcObject.getAudioTracks().filter((track) => track.enabled && !track.muted);
        if (tracks.length) {
          let audio = audioContext.createMediaStreamSource(new MediaStream([...tracks]));

          audio && audio.connect(dest);
        }

        let combined = new MediaStream([...cvStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);

        this.recorder = RecordRTC(combined, {
          type: "video",
          showMousePointer: false,
          // mimeType: "video/webm;codecs=h264",
          mimeType: "video/webm;codecs=vp9",
        });
        this.recorder.startRecording();
        this.sendMessage("Record", { isRecording: true });
        // this.cmdScreenRecord();
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
          this.sendMessage("Record", { isRecording: false });
          // this.cmdScreenRecordStop();
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
        if (!downloadDate || downloadDate != nowDate) downloadCount = 0;
        let currentTime = new Date()
          .toISOString()
          .replace(/[^0-9]/g, "")
          .slice(0, -9);

        this.$cookies.set("downloadCount", ++downloadCount);
        this.$cookies.set("downloadDate", nowDate);
        return "AR_" + currentTime + "_" + ("00" + downloadCount).slice(-3);
      },
      checkText(id) {
        this.showText = id;
      },
      // changeStatusTitle(status, senderId) {
      //   this.sender = this.participants.filter((i) => i.id == senderId);
      //   if (this.userMember.id == senderId) {
      //     target = this.$t("CONFERENCE.YOU");
      //   } else {
      //     target = this.sender[0].account;
      //   }
      // },
      showToast(msg, senderId) {
        this.sender = this.participants[senderId];
        this.toastCount++;
        let target;
        const h = this.$createElement;
        let arr = [];
        if (this.userMember.id == senderId) {
          target = this.$t("CONFERENCE.YOU");
        } else {
          target = this.sender.account;
          arr.push(
            h("div", { class: ["prefix-style", this.colorList[this.sender.selectedColorId].color] }, [
              target.slice(0, 1),
            ])
          );
        }
        arr.push(target, msg);

        const vNodesMsg = h("div", { class: ["text-center", "toast-style", "mb-0"] }, arr);
        this.$bvToast.toast([vNodesMsg], {
          autoHideDelay: 3000,
          toaster: "b-toaster-bottom-left",
          toastClass: "my-toast-class",
          solid: true,
          noCloseButton: true,
        });
      },
      //#endregion
    },
    computed: {
      isSharer() {
        if (!this.userMember) return false;
        else return this.userMember.isShare;
      },

      isHost() {
        if (!this.userMember) return false;
        else return this.userMember.isHost;
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .conf-all-section {
    background-color: #313131;
    .conf-upper-section {
      background-color: #333333;
      .conf-header {
        height: 9vh;
        line-height: 9vh;
        color: #fff;
        background-color: #333333;
        .recording-tip {
          margin-top: 1.5vh;
          width: 120px;
          display: inline-block;
          height: 6vh;
          line-height: 5.5vh;
          color: #fff;
          border: 1px solid #bc2727b3;
          background-color: #bc2727b3;
          border-radius: 3vh;
          img {
            margin: -5px 5px 0 0 !important;
            width: 20px !important;
          }
        }
        .status-tip {
          margin-top: 1.5vh;
          display: inline-block;
          height: 6vh;
          line-height: 5.5vh;
          color: #fff;
          border: 1px solid #fff;
          border-radius: 3vh;
        }
        .video-section {
          background-color: #333;
          margin: auto;

          .video-container {
            width: 100%;
            height: 76vh;
            overflow: hidden;

            video {
              object-position: top;
              height: 100%;
              width: 100%;
            }
          }
          .app-pause-section {
            color: #fff;
            font-size: 24px;
            margin-top: 50vh;
          }
          .recordCv {
            position: absolute;
            z-index: -100;
          }
          .brush-cursor {
            cursor: url("~@/assets/images/brush.png") 0 40, pointer !important;
          }
          .cv-glasses {
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
      }
      .conf-info-all,
      .conf-info-partial,
      .file-info {
        background-color: #fafafa;
        padding: 25px;
        height: 85vh;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1200px) {
          padding: 0 10px;
        }
        .code {
          font-size: 16px;
        }
        .copy {
          cursor: pointer;
        }
        .hidden-input {
          position: absolute;
          top: -999px;
        }
        .room-sn {
          font-size: 48px;
          font-weight: bolder;
          color: $grey;
        }
        .card-component {
          .card-item {
            height: 80px;
            background-color: #fff;
            border: 1px solid $lightgrey;
            border-radius: 6px;
            .left,
            .right {
              line-height: 80px;
              @media (max-width: 1200px) {
                padding: 0 5px;
              }
            }
            .left {
              .dynamic {
                top: 0;
                position: relative;
                .outer {
                  position: absolute;
                  top: 12px;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  background-color: rgba(192, 192, 192, 0.3);
                  border-radius: 50%;
                }
                .inner {
                  position: absolute;
                  top: 12px;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  width: 55px;
                  height: 55px;
                  line-height: 55px;
                  font-weight: bold;
                  color: #fff;
                  background-color: #b7b7b7;
                  border-radius: 50%;
                }
                .scale-0 {
                  top: 12px !important;
                  left: 0px !important;
                  width: 55px;
                  height: 55px;
                  line-height: 55px;
                  transition: all 0.2s;
                }
                .scale-1 {
                  top: 9.5px !important;
                  left: -3px !important;
                  width: 60px;
                  height: 60px;
                  line-height: 60px;
                  transition: all 0.2s;
                }
                .scale-2 {
                  top: 7px !important;
                  left: -5.5px !important;
                  width: 65px;
                  height: 65px;
                  line-height: 65px;
                  transition: all 0.2s;
                }
                .scale-3 {
                  top: 4.5px !important;
                  left: -8px !important;
                  width: 70px;
                  height: 70px;
                  line-height: 70px;
                  transition: all 0.2s;
                }
                .scale-4 {
                  top: 2px !important;
                  left: -10.5px !important;
                  width: 75px;
                  height: 75px;
                  line-height: 75px;
                  transition: all 0.2s;
                }
                .scale-5 {
                  top: -0.5px !important;
                  left: -13px !important;
                  width: 80px;
                  height: 80px;
                  line-height: 80px;
                  transition: all 0.2s;
                }
              }
            }
            .middle {
              @media (max-width: 1200px) {
                padding: 0 5px;
              }
              .user-name {
                font-size: 20px;
                font-weight: bold;
                color: #5f5f5f;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                @media (max-width: 1200px) {
                  font-size: 16px;
                }
                img {
                  width: 20px;
                  margin-top: -4px;
                  cursor: pointer;
                }
              }
              .source {
                font-size: 16px;
                color: $placeholder;
                @media (max-width: 1200px) {
                  font-size: 14px;
                }
              }
            }
            .right {
              font-size: 20px;
              color: $grey;
              .recording {
                margin-top: -5px;
                width: 20px !important;
              }
              .microphone-on {
                margin: 0 6px;
                color: $lightgrey;
              }
              .microphone-off {
                color: #606060;
              }
            }
          }
        }
      }
      .conf-info-partial {
        height: 85vh;
        background-color: #333333;
        .card-component {
          .card-item {
            margin-bottom: 15px;
            height: 110px;
            color: #fff;
            background-color: #484848;
            border: none;
            border-radius: 5px;
            @media (max-width: 1200px) {
              height: 80px;
            }
            .left,
            .right {
              line-height: 110px;
              @media (max-width: 1200px) {
                padding: 0 5px;
                height: 80px;
              }
            }
            .left {
              .dynamic {
                position: relative;
                @media (max-width: 1200px) {
                  top: -15px;
                }
                // .circle-container {
                //   position: absolute;
                //   top: 18px;
                //   left: -13px;
                //   bottom: 0;
                //   right: 0;
                //   width: 80px;
                //   height: 80px;
                //   display: block;
                //   @keyframes ripple {
                //     from {
                //       width: 50%;
                //       height: 50%;
                //       opacity: 1;
                //     }
                //     to {
                //       width: 100%;
                //       height: 100%;
                //       opacity: 0;
                //     }
                //   }
                //   .circle {
                //     position: absolute;
                //     top: 50%;
                //     left: 50%;
                //     width: 20px;
                //     height: 20px;
                //     display: block;
                //     border-radius: 50%;
                //     border: 1px solid #ccc;
                //     transform: translate(-50%, -50%);
                //     background-color: rgb(150, 150, 150);
                //     opacity: 0.1;
                //     animation: ripple 1.5s ease infinite;
                //   }
                // }
                .outer {
                  position: absolute;
                  top: 30px;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  background-color: rgba(192, 192, 192, 0.3);
                  border-radius: 50%;
                }
                .inner {
                  position: absolute;
                  top: 30px;
                  left: 0;
                  bottom: 0;
                  right: 0;
                  width: 55px;
                  height: 55px;
                  line-height: 55px;
                  font-weight: bold;
                  color: #fff;
                  background-color: #b7b7b7;
                  border-radius: 50%;
                }
                .scale-0 {
                  top: 30px !important;
                  left: 0px !important;
                  width: 55px;
                  height: 55px;
                  line-height: 55px;
                  transition: all 0.2s;
                }
                .scale-1 {
                  top: 27.5px !important;
                  left: -2.5px !important;
                  width: 60px;
                  height: 60px;
                  line-height: 60px;
                  transition: all 0.2s;
                }
                .scale-2 {
                  top: 25px !important;
                  left: -5px !important;
                  width: 65px;
                  height: 65px;
                  line-height: 65px;
                  transition: all 0.2s;
                }
                .scale-3 {
                  top: 22.5px !important;
                  left: -7.5px !important;
                  width: 70px;
                  height: 70px;
                  line-height: 70px;
                  transition: all 0.2s;
                }
                .scale-4 {
                  top: 20px !important;
                  left: -10px !important;
                  width: 75px;
                  height: 75px;
                  line-height: 75px;
                  transition: all 0.2s;
                }
                .scale-5 {
                  top: 17.5px !important;
                  left: -12.5px !important;
                  width: 80px;
                  height: 80px;
                  line-height: 80px;
                  transition: all 0.2s;
                }
              }
              .icon {
                margin-top: 30px;
                @media (max-width: 1200px) {
                  margin-top: 13px;
                }
              }
            }
            .middle {
              @media (max-width: 1200px) {
                padding: 0 5px;
              }
              .user-name {
                margin-top: 40px;
                font-size: 20px;
                font-weight: bold;
                color: #fff;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                img {
                  width: 20px;
                  margin-top: -2px;
                  @media (max-width: 1200px) {
                    width: 14px;
                  }
                }
                @media (max-width: 1200px) {
                  margin-top: 30px;
                  font-size: 14px;
                }
              }
            }
            .right {
              font-size: 20px;
              @media (max-width: 1200px) {
                font-size: 14px;
                line-height: 80px;
              }
              .recording {
                margin-top: -5px;
                width: 20px !important;
                cursor: pointer;
              }
              .microphone-on {
                margin: 0 6px;
                cursor: pointer;
              }
              .microphone-off {
                cursor: pointer;
              }
            }
          }
        }
      }
      .file-info {
        .desc {
          color: $grey;
          .empty-file {
            color: $red;
          }
        }
        .file-component {
          height: 260px;
          border-radius: 5px;
          box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.15);
          .file-preview {
            position: relative;
            height: 160px;
            padding-top: 45px;
            background-color: #fff;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
            box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            .pdf-icon {
              width: 45px;
            }
            .img-thumbnail {
              margin-top: -45px;
              width: 100%;
            }
            .cover-text {
              position: absolute;
              background-color: rgba(0, 0, 0, 0.7);
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              padding-top: 38px;
              color: #fff;
              border-top-right-radius: 5px;
              border-top-left-radius: 5px;
              div {
                &:hover {
                  color: #ccc;
                  cursor: pointer;
                }
              }
            }
          }
          .file-info-text {
            padding: 5px 20px;
            font-size: 14px;
            height: 100px;
            background-color: #fff;
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
            box-shadow: 0px -1px 3px 1px rgba(0, 0, 0, 0.1);
            .uploader-name {
              color: $grey;
            }
            .file-name {
              color: #313131;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .upload-time {
              color: $grey;
            }
          }
        }
      }
    }
    .conf-lower-section {
      position: fixed;
      bottom: 0;
      height: 15vh;
      line-height: 15vh;
      width: 100%;
      color: #fff;
      background-color: #333333;
      .left {
        font-size: 24px;
        @media (max-width: 1200px) {
          font-size: 16px !important;
        }
      }
      .function {
        .function-btn {
          height: 67px;
          line-height: 67px;
          width: 67px;
          display: inline-block;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          @media (max-width: 1200px) {
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
        .flashlight {
          width: 20px !important;
          @media (max-width: 1200px) {
            width: 12px !important;
          }
        }
        .recording {
          margin-top: -5px;
          width: 30px !important;
          @media (max-width: 1200px) {
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
          @media (max-width: 1200px) {
            height: 80px;
            line-height: 80px;
          }
          .draw-function-btn {
            display: inline-block;
            height: 67px;
            width: 67px;
            line-height: 77px;
            border-radius: 50%;
            cursor: pointer;
            background-color: #666;
            &:hover {
              background-color: #555;
            }
            @media (max-width: 1200px) {
              height: 40px;
              line-height: 43px;
              width: 40px;
              font-size: 12px !important;
            }
            img {
              margin-top: -15px;
              width: 30px;
              @media (max-width: 1200px) {
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
              .col-3 {
                .colors {
                  width: 50px;
                  height: 50px;
                  line-height: 50px;
                  margin: 4px 12px;
                  border-radius: 25px;
                  cursor: pointer;
                  @media (max-width: 1200px) {
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
            height: 64px;
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 15px;
            padding: 0 15px;
            .curve-function-btn {
              display: inline-block;
              margin-top: -50px;
              height: 58px;
              width: 58px;
              border-radius: 50%;
              cursor: pointer;
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
                margin-top: -57px;
                width: 30px;
              }

              @media (max-width: 1200px) {
                margin-top: -22px;
                height: 38px;
                width: 38px;

                img {
                  margin-top: -46px;
                  width: 20px;
                }
              }
            }
            .freehand {
              svg {
                position: absolute;
                top: 18px;
                right: 30px;
              }
              &.active {
                background-color: #fff;
                color: #666;
                &:hover {
                  background-color: #eee;
                }
              }

              @media (max-width: 1200px) {
                font-size: 10px;
                svg {
                  top: 22px;
                }
              }
            }
          }
        }
      }
      .right {
        display: inline-block;
        .conf-info-switch,
        .file-upload {
          cursor: pointer;
          @media (max-width: 1200px) {
            margin: 0 5px !important;
            font-size: 12px !important;
          }
        }
        .new-file-tip {
          position: absolute;
          top: 43px;
          left: 122px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: $red;
          @media (max-width: 1200px) {
            top: 50px;
            left: 75px;
            width: 8px;
            height: 8px;
          }
        }
      }
    }
  }
  .screen-capture-section {
    margin: 120px 0;
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
  .ra-footer {
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
  .download-alert {
    width: 12vw;
    height: 50px;
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 25px;
    position: fixed;
    top: 50vh;
    left: 44vw;
    @media (max-width: 1200px) {
      width: 20vw;
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
    background-color: #fafafa;

    .otp-section {
      width: 40vw;
      /deep/ .otp-input {
        $width: 100%;
        width: 100%;
        height: $width;
        margin: 10px;
        padding: 5px 5px 20px 5px;
        font-size: 80px;
        font-weight: bolder;
        color: $grey;
        border-radius: 4px;
        border: 1px solid #fff;
        box-shadow: 0px 3px 6px #00000029;
        text-align: center;
        &.error {
          border: 1px solid red !important;
        }
        &:focus {
          background-color: #ffffff;
          border-color: $blue;
          outline: 0;
        }
      }
      .row {
        margin: 0 -5px;
        .ra-confirm-btn,
        .ra-confirm-btn-alt {
          width: 100% !important;
        }
      }
    }
  }
  .join-section,
  .member-list {
    width: 40vw;
    @media (max-width: 1200px) {
      width: 80vw;
    }
    .copy {
      cursor: pointer;
    }
    .hidden-input {
      position: absolute;
      top: -999px;
    }
    .room-sn {
      font-size: 48px;
      font-weight: bolder;
      color: $grey;
    }
    .card-component {
      .card {
        width: 40vw;
        height: 100px;
        background-color: #fff;
        border: 1px solid #fff;
        border-bottom: 1px solid $lightgrey;
        border-radius: 0;
        @media (max-width: 1200px) {
          width: 80vw;
        }
        .left,
        .right {
          line-height: 100px;
        }
        .left {
          .icon {
            padding: 0 22px;
            margin: 22px 0 0 15px;
            height: 55px;
            line-height: 55px;
            width: 55px;
            color: #fff;
            background-color: $lightgrey;
            font-size: 20px;
            border-radius: 50%;
          }
        }
        .middle {
          .user-name {
            font-size: 20px;
            font-weight: bold;
            color: #5f5f5f;
          }
          .source {
            font-size: 16px;
            color: $placeholder;
          }
        }
        .right {
          font-size: 20px;
          color: $grey;
          cursor: pointer;
          img {
            width: 25px;
          }
        }
      }
    }
    .card-wrapper {
      overflow-y: scroll;
      overflow-x: hidden;
      max-height: 33vh;
      min-height: 15vh;
    }
    .card-wrapper::-webkit-scrollbar {
      display: none;
    }
    .invite {
      .icon {
        padding: 0 9px;
        margin: 22px 0 0 15px;
        height: 55px;
        line-height: 55px;
        width: 55px;
        color: #fff;
        background-color: $blue;
        font-size: 20px;
        border-radius: 50%;
        cursor: pointer;
        &:hover {
          background-color: $blueHover;
        }
      }
      .text {
        padding-top: 32px;
        font-size: 20px;
        font-weight: bold;
        color: #5f5f5f;
      }
    }
    .desc {
      font-size: 18px;
      color: $placeholder;
    }
    .row {
      margin: 0 -15px;
      .ra-confirm-btn,
      .ra-confirm-btn-alt {
        width: 100% !important;
      }
    }
    .start-call {
      padding-bottom: 130px;
    }
  }
  .send-file-modal {
    z-index: 99999;
    position: fixed;
    bottom: 40vh;
    left: 40vw;
    padding: 30px;
    background-color: #fff;
    border-radius: 20px;
  }
  /deep/ .modal-header {
    margin: auto;
  }
  .brush-blue {
    color: #00b7ff;
    background-color: #00b7ff !important;
  }
  .brush-red {
    color: #ff0000;
    background-color: #ff0000 !important;
  }
  .brush-magenta {
    color: #ff00cc;
    background-color: #ff00cc !important;
  }
  .brush-orange {
    color: #ff6600;
    background-color: #ff6600 !important;
  }
  .brush-black {
    color: #fff !important;
    background-color: #000 !important;
  }
  .brush-yellow {
    color: #000 !important;
    background-color: #ffff00 !important;
  }
  .brush-white {
    color: #000 !important;
    background-color: #eee !important;
  }
  .brush-green {
    color: #009933;
    background-color: #009933 !important;
  }
  // customize toast UI
  .toast-style {
    height: 76px;
    line-height: 76px;
    font-size: 16px;
    margin-left: -15px;
  }
  .prefix-style {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: #fff;
    display: inline-block;
    line-height: 50px;
    margin-right: 10px;
  }
  // miso
  #cv {
    // width: 100%;
    // height: 100%;
    position: absolute;
    top: 9vh;
    left: 0;
    margin: 0 auto;
    // z-index: 10;
  }
  #cvCover {
    // width: 100%;
    // height: 100%;
    position: absolute;
    top: 9vh;
    left: 0;
    margin: 0 auto;
    // z-index: 100;
  }
</style>
