<template>
  <div class="workflow">
    <Header :title="$t('WF.TITLE')" />
    <div class="workflow-container row mx-auto">
      <div class="left-section library show-transition" :class="isSidebarMinified ? 'col-1 p-0' : 'col-2'">
        <!-- 步驟模板(最小化) -->
        <div class="text-center" v-if="isContentMinified">
          <div class="menu"><font-awesome-icon class="menu-icon fa-rotate-90" icon="grip-vertical" size="2x" /></div>
          <div v-for="temp in templateList" :key="temp.type">
            <div class="minified" @click="createNode(temp.type)">
              <img
                class="my-3"
                role="button"
                :src="setImgSrc(temp.type)"
                v-b-tooltip.hover.right
                :title="$t(temp.text)"
              />
            </div>
          </div>

          <div class="edit-link" @click="showEditTips">
            <img
              class="edit-link-icon"
              role="button"
              src="~@/assets/images/list-alt.svg"
              v-b-tooltip.hover.right
              :title="$t('WF.TIPS') + ' ( ' + errorList.length + ' )'"
            />
            <div class="tip-dot" v-if="errorList.length > 0"></div>
          </div>
        </div>

        <!-- 步驟模板 -->
        <div v-if="!isContentMinified">
          <div class="tab-group row">
            <div class="col pl-3 pr-2">
              <div
                class="show-transition text-center"
                :class="isEditing ? 'inactive-tab' : 'active-tab'"
                role="button"
                @click="isEditing = false"
              >
                {{ $t("WF.TEMPLATE") }}
              </div>
            </div>

            <div class="col pr-3 pl-0">
              <div
                class="show-transition text-center"
                :class="isEditing ? 'active-tab' : 'inactive-tab'"
                role="button"
                @click="isEditing = true"
              >
                {{ $t("WF.TIPS") }}
                <b-badge variant="danger" v-if="errorList.length > 0">{{ errorList.length }}</b-badge>
              </div>
            </div>
          </div>
          <div class="row show-transition" v-if="!isEditing">
            <div
              class="col-6 template-component text-center px-3 mb-3"
              role="button"
              @click="createNode(temp.type)"
              v-for="temp in templateList"
              :key="temp.type"
            >
              <div class="template-outline py-2">
                <img class="template-img my-2" :src="setImgSrc(temp.type)" />
                <div class="template-title">{{ $t(temp.text) }}</div>
              </div>
            </div>
          </div>
          <div class="error-edit-section" v-if="isEditing">
            <div class="error-sub-title text-center mb-3" v-if="errorList.length > 0">
              {{ $t("WF.TIPS_ERR") }}
            </div>
            <div class="error-sub-title text-center mb-3" v-if="errorList.length == 0">
              {{ $t("WF.TIPS_EMPTY") }}
            </div>
            <div v-for="(err, index) in errorList" :key="index">
              <div class="error-card show-transition mb-3" role="button" @click="onErrorClick(err)">
                <div class="decor-line float-left mr-2" :class="{ 'warning-bg': !err.title }"></div>
                <div class="py-3">
                  <span class="error-card-title mr-2">{{ err.title }}</span>
                  <span class="error-card-msg" :class="{ 'warning-msg': !err.title }">{{ err.msg }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 流程圖 -->
      <div class="middle-section flowchart show-transition text-left" :class="isSidebarMinified ? 'col-9' : 'col-8'">
        <h5 class="title">
          <font-awesome-icon class="title-icon h-18 mr-2" icon="project-diagram" />
          {{ queryTitle ? queryTitle : $t("WF.FLOWCHART") }}
        </h5>
        <div class="flowchart-container mx-3">
          <flowchart
            class="flowchart"
            :steps="steps"
            :readonly="false"
            @select="handleSelect"
            @nodeChange="handleNodeChange"
            @connectionChange="handleConnectionChange"
            ref="chart"
            :render="renderChart"
          >
          </flowchart>

          <!-- 預覽區 -->
          <div
            class="previewer"
            :class="{ 'minified-previewer': isPreviewerMinified }"
            v-if="selectedNode && selectedNode.type != -1"
          >
            <div class="previewer-header" v-if="!isPreviewerMinified">
              <div class="header-step text-center float-left" v-if="selectedNode.serial">
                {{ (selectedNode.serial > 9 ? "" : "0") + selectedNode.serial }} /
                {{ ($refs.chart.internalNodes.length > 9 ? "" : "0") + ($refs.chart.internalNodes.length - 2) }}
              </div>
              <div class="header-step null text-center float-left" v-if="!selectedNode.serial">
                {{ $t("WF.UNCONNECTED") }}
              </div>
              <div class="header-title float-left ml-3">
                <div class="header-title-text">
                  {{ selectedNode.title }}
                </div>
              </div>
              <div
                class="minify-btn float-right text-center"
                :class="{ 'en-fontsize': currentLang == 2 }"
                role="button"
                @click="togglePreviewMinified(true)"
              >
                <font-awesome-icon icon="compress-arrows-alt" />
                {{ $t("WF.MINIMIZE") }}
              </div>
            </div>

            <div class="previewer-body" v-if="!isPreviewerMinified">
              <div class="previewer-body-inner">
                <div class="text-only text-center mx-auto" v-if="selectedNode.text && selectedNode.type == 0">
                  {{ selectedNode.text }}
                </div>

                <div
                  class="previewer-desc float-left"
                  :class="{ 'full-w': selectedNode.type == 3 && selectedNode.type == 4 && selectedNode.type == 6 }"
                  v-if="selectedNode.text && selectedNode.type != 0"
                >
                  <strong>{{ selectedNode.text }}</strong>
                </div>
                <div
                  class="previewer-content text-center float-right"
                  :class="{ 'full-w': !selectedNode.text }"
                  v-if="selectedNode.type != 0"
                >
                  <!-- 圖片預覽 -->
                  <img class="img" v-if="selectedNode.picPath" :src="selectedNode.picPath" />

                  <!-- 影片預覽 -->
                  <video class="vid" v-if="selectedNode.vidPath" :src="selectedNode.vidPath" controls autoplay="true" />

                  <!-- 3d model預覽 -->
                  <div v-if="selectedNode.modelPath">
                    <div class="model-canvas" ref="modelCanvas" v-show="progress == 100"></div>
                    <div class="progress-section mx-auto" v-if="progress < 100">
                      <div class="progress-text mx-auto" v-if="progress >= 0 && progress < 100">
                        {{ $t("WF.LOADING_PROGRESS") }}{{ progress }}%
                      </div>
                    </div>
                  </div>

                  <div class="empty-text mx-auto" v-if="selectedNode.type == 1 || selectedNode.type == 3">
                    {{ $t("WF.NO_PIC") }}
                  </div>
                  <div class="empty-text mx-auto" v-if="selectedNode.type == 2 || selectedNode.type == 4">
                    {{ $t("WF.NO_VID") }}
                  </div>
                  <div
                    class="empty-text mx-auto"
                    v-if="(selectedNode.type == 5 || selectedNode.type == 6) && progress == -1"
                  >
                    {{ $t("WF.NO_MODEL") }}
                  </div>
                </div>
              </div>
            </div>

            <div class="previewer-footer" :class="{ 'minified-footer': isPreviewerMinified }">
              <div
                class="expand-btn text-center"
                v-if="isPreviewerMinified"
                role="button"
                @click="togglePreviewMinified(false)"
              >
                <font-awesome-icon icon="expand-arrows-alt" />
                {{ $t("WF.EXPAND") }}
              </div>

              <div class="glasses-btn-group" v-if="!isPreviewerMinified">
                <button class="btn dark py-0 mr-2">
                  <font-awesome-icon icon="angle-double-up" />
                  <span class="ml-1">{{ $t("GENERAL.OPERATION") }}</span>
                </button>
                <button class="btn light py-0 mr-2" v-if="selectedNode.serial != 1">{{ $t("GENERAL.PREV") }}</button>
                <button class="btn active py-0 mr-2" v-if="selectedNode.recordCheck">
                  <font-awesome-icon icon="check" />
                  {{ selectedNode.recordType == 1 ? $t("WF.IMAGE_RECORD") : $t("WF.VIDEO_RECORD") }}
                </button>

                <button
                  class="btn light py-0 float-right mr-2"
                  v-if="selectedNode.isStepSkippable && selectedNode.isCheck"
                >
                  {{ $t("WF.SKIP") }}
                </button>
                <button class="btn active py-0 float-right mr-2" v-if="selectedNode.isCheck">
                  {{ selectedNode.pass_text }}
                </button>
                <button class="btn active py-0 float-right mr-2" v-if="selectedNode.isCheck">
                  {{ selectedNode.fail_text }}
                </button>
                <button
                  class="btn active py-0 float-right mr-2"
                  v-if="
                    !selectedNode.isCheck &&
                      !selectedNode.isStepSkippable &&
                      !(selectedNode.recordCheck && selectedNode.isRecordRequired)
                  "
                >
                  {{ $t("GENERAL.NEXT") }}
                </button>
              </div>
            </div>
          </div>

          <div
            class="toggle-sidebar show-transition"
            :class="{ 'minified-sidebar': isSidebarMinified }"
            @click="toggleSidebar"
            role="button"
          >
            <font-awesome-icon icon="chevron-left" v-if="!isSidebarMinified" />
            <font-awesome-icon icon="chevron-right" class="arrow-right" v-if="isSidebarMinified" />
          </div>
        </div>
      </div>

      <!-- 編輯步驟內容 -->
      <div class="col-2 right-section edit-node text-left">
        <h5 class="title"><font-awesome-icon class="title-icon h-18 mr-2" icon="th-list" />{{ $t("WF.STEP_EDIT") }}</h5>
        <div class="edit-section">
          <div class="card-component mb-3 mr-2" v-if="selectedNode && selectedNode.type != -1">
            <div class="card-title m-0 pl-3">{{ $t("WF.STEP_INFO") }}</div>
            <div class="card-body p-3">
              <div class="node-title mb-3">
                <label for="nodeTitle">{{ $t("WF.STEP_TITLE") }}</label>
                <input
                  type="text"
                  v-model="selectedNode.title"
                  id="nodeTitle"
                  :placeholder="$t('WF.STEP_TITLE_PH')"
                  class="form-control"
                  :class="{ 'err-input': selectedNode.error.title }"
                  maxlength="50"
                  @input="onValueCheck('title')"
                  @blur="onValueCheck('title')"
                />
                <small class="err-msg" v-if="selectedNode.error.title">{{ $t("WF.STEP_TITLE_ERR") }}</small>
              </div>

              <!-- 圖片上傳 -->
              <div class="node-pic mb-3" v-if="selectedNode.type == 1 || selectedNode.type == 3">
                <label for="nodeDesc">{{ $t("WF.IMAGE_FILE") }}</label>
                <div class="m-text mb-2" :class="{ 'err-input': selectedNode.error.pic }" v-if="!selectedNode.pic">
                  <div class="sub-title mb-2">{{ $t("WF.IMAGE_DESC") }}</div>
                  <button type="button" class="btn upload-btn" @click="chooseFiles">
                    <font-awesome-icon icon="cloud-upload-alt" class="mr-2" />{{ $t("WF.UPLOAD_FILE") }}
                  </button>
                  <input
                    type="file"
                    id="file"
                    ref="file"
                    accept=".jpg, .png, .jpeg"
                    @change="onChangeFileUpload('pic')"
                    hidden
                  />
                </div>

                <div class="m-text" v-if="selectedNode.pic">
                  <div>
                    {{ $t("WF.NAME") }}
                    <a v-if="selectedNode.picPath" :href="selectedNode.picPath" target="_blank">{{
                      selectedNode.picName
                    }}</a>
                  </div>
                  <div>{{ $t("WF.SIZE") }}{{ (selectedNode.picSize / 1024 / 1024).toFixed(2) }} mb</div>
                  <button type="button" class="btn delete-btn mt-2" @click="deleteFile('pic')">
                    <font-awesome-icon icon="times" class="mr-2" />{{ $t("GENERAL.DELETE") }}
                  </button>
                </div>
                <small class="err-msg" v-if="selectedNode.error.pic">{{ $t("WF.UPLOAD_FILE_ERR") }}</small>
              </div>

              <!-- 影片上傳 -->
              <div class="node-vid mb-3" v-if="selectedNode.type == 2 || selectedNode.type == 4">
                <label for="nodeDesc">{{ $t("WF.VIDEO_FILE") }}</label>
                <div class="m-text mb-2" :class="{ 'err-input': selectedNode.error.vid }" v-if="!selectedNode.vid">
                  <div class="sub-title mb-2">{{ $t("WF.VIDEO_DESC") }}</div>
                  <button type="button" class="btn upload-btn" @click="chooseFiles">
                    <font-awesome-icon icon="cloud-upload-alt" class="mr-2" />{{ $t("WF.UPLOAD_FILE") }}
                  </button>
                  <input type="file" id="file" ref="file" accept=".mp4" @change="onChangeFileUpload('vid')" hidden />
                </div>

                <div class="m-text" v-if="selectedNode.vid">
                  <div>
                    {{ $t("WF.NAME") }}
                    <a v-if="selectedNode.vidPath" :href="selectedNode.vidPath" target="_blank">{{
                      selectedNode.vidName
                    }}</a>
                  </div>
                  <div>{{ $t("WF.SIZE") }}{{ (selectedNode.vidSize / 1024 / 1024).toFixed(2) }} mb</div>
                  <button type="button" class="btn delete-btn mt-2" @click="deleteFile('vid')">
                    <font-awesome-icon icon="times" class="mr-2" />{{ $t("GENERAL.DELETE") }}
                  </button>
                </div>
                <small class="err-msg" v-if="selectedNode.error.vid">{{ $t("WF.UPLOAD_FILE_ERR") }}</small>
              </div>

              <!-- 包含文字的模板 -->
              <div
                class="node-text"
                v-if="
                  selectedNode.type == 0 || selectedNode.type == 3 || selectedNode.type == 4 || selectedNode.type == 6
                "
              >
                <label for="nodeDesc">{{ $t("WF.STEP_DESC") }}</label>
                <textarea
                  type="text"
                  v-model="selectedNode.text"
                  id="nodeDesc"
                  :placeholder="$t('WF.STEP_DESC_PH')"
                  class="form-control mb-1"
                  :class="{ 'err-input': selectedNode.error.text }"
                  rows="5"
                  :maxlength="selectedNode.type == 0 ? 1000 : 500"
                  @input="onValueCheck('text')"
                  @blur="onValueCheck('text')"
                />
                <div class="desc-count text-right">
                  <small class="err-msg float-left" v-if="selectedNode.error.text">{{ $t("WF.STEP_DESC_ERR") }}</small>
                  {{ selectedNode.text ? selectedNode.text.length : 0 }}/{{ selectedNode.type == 0 ? "1000" : "500" }}
                </div>
              </div>
            </div>
            <div class="card-body p-3" v-if="!selectedNode">{{ $t("WF.STEP_ERR") }}</div>
          </div>
          <!-- 動畫設定 -->
          <div
            class="card-component mb-3 mr-2"
            v-if="selectedNode && (selectedNode.type == 5 || selectedNode.type == 6)"
          >
            <div class="card-title m-0 pl-3">{{ $t("WF.MODEL_INFO") }}</div>
            <div class="card-body p-3">
              <!-- <div class="m-text mb-2" :class="{ 'err-input': selectedNode.error.model }" v-if="!selectedNode.model"> -->

              <div class="m-text mb-2" v-if="!selectedNode.model">
                <button type="button" class="btn upload-btn" @click="chooseFiles">
                  <font-awesome-icon icon="cloud-upload-alt" class="mr-2" />{{ $t("WF.UPLOAD_FILE") }}
                </button>
                <input type="file" id="file" ref="file" accept=".glb" @change="onChangeFileUpload('model')" hidden />
              </div>

              <div class="m-text" v-if="selectedNode.model">
                <div>
                  {{ $t("WF.NAME") }}
                  <a v-if="selectedNode.modelPath" :href="selectedNode.modelPath" target="_blank">{{
                    selectedNode.modelName
                  }}</a>
                </div>
                <div>{{ $t("WF.SIZE") }}{{ (selectedNode.modelSize / 1024 / 1024).toFixed(2) }} mb</div>

                <button
                  class="btn upload-btn mt-2 mr-2"
                  v-if="!selectedNode.modelSnapshot"
                  @click="captureModelSnapshot()"
                >
                  <font-awesome-icon icon="camera" class="mr-2" />{{ $t("WF.TAKE_SNAPSHOT") }}
                </button>

                <button
                  class="btn delete-btn mt-2 mr-2"
                  @click="deleteModelSnapshot()"
                  v-if="selectedNode.modelSnapshot"
                >
                  <font-awesome-icon icon="times" class="mr-2" />{{ $t("WF.DELETE_SNAPSHOT") }}
                </button>

                <button class="btn delete-btn mt-2" @click="deleteFile('model')">
                  <font-awesome-icon icon="times" class="mr-2" />{{ $t("WF.DELETE_FILE") }}
                </button>

                <div v-if="selectedNode.modelSnapshot">
                  <img
                    class="snapshot mt-3"
                    v-if="selectedNode.modelSnapshotPath"
                    :src="selectedNode.modelSnapshotPath"
                  />
                </div>
              </div>

              <div>
                <small class="err-msg" v-if="selectedNode.error.model">{{ $t("WF.UPLOAD_FILE_ERR") }}</small>
              </div>
              <div>
                <small class="err-msg" v-if="selectedNode.error.modelSnapshot">{{ $t("WF.ERR_MODEL_SNAPSHOT") }}</small>
              </div>
            </div>
          </div>

          <div
            class="card-component mb-3 mr-2"
            v-if="selectedNode && (selectedNode.type == 5 || selectedNode.type == 6)"
          >
            <div class="card-title m-0 pl-3" v-b-tooltip.hover.top :title="isStaticModel ? '無動畫可編輯' : ''">
              {{ $t("WF.ANIMATION_SETTINGS") }}
              <toggle-button
                class="toggle-btn m-0"
                :value="selectedNode.animationEnable"
                :sync="true"
                @change="onChangeAnimationEnable"
                :color="{ checked: '#2173c9', unchecked: '#7b7b7b' }"
                :disabled="isStaticModel"
              />
            </div>
            <b-collapse :visible="selectedNode.animationEnable">
              <div class="card-body p-3" v-if="model && model.animations.length > 0">
                <div class="model-length my-2">
                  動畫總長 <strong class="model-length-text">{{ model.animations[0].duration }}</strong> 秒
                </div>
                <button class="btn upload-btn mb-2" @click="addAnimationControl()">
                  <font-awesome-icon icon="cut" class="mr-2" />{{ $t("WF.ADD_ANIMATION") }}
                </button>

                <draggable
                  class="animation-list"
                  v-model="selectedNode.animationControlList"
                  @start="drag = true"
                  @end="
                    drag = false;
                    updateAnimationControlList();
                  "
                  @change="dragColumn"
                  animation="300"
                >
                  <div
                    class="animation-track my-2 p-2"
                    v-for="(item, index) in selectedNode.animationControlList"
                    :key="index"
                  >
                    {{ $t("WF.ANIMATION") }}{{ index + 1 }}<br />
                    <input
                      class="animation-input form-control text-center"
                      type="number"
                      v-model="item.start"
                      @change="durationLimit(item, 'start')"
                    />
                    ~
                    <input
                      class="animation-input form-control text-center"
                      type="number"
                      v-model="item.end"
                      @change="durationLimit(item, 'end')"
                    />
                    <button class="btn animation-btn p-2 ml-2" @click="setAnimationTime(item.start, item.end)">
                      <font-awesome-icon icon="play" />
                    </button>
                    <button class="btn animation-btn p-2" @click="deleteAnimationTime(index)">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </draggable>
              </div>
            </b-collapse>
          </div>

          <!-- 步驟紀錄 -->
          <div class="card-component mb-3 mr-2" v-if="selectedNode && selectedNode.type != -1">
            <div class="card-title m-0 pl-3">
              {{ $t("WF.STEP_RECORD") }}
              <toggle-button
                class="toggle-btn m-0"
                :value="selectedNode.recordCheck"
                :sync="true"
                @change="onChangeRecordCheck"
                :color="{ checked: '#2173c9', unchecked: '#7b7b7b' }"
              />
            </div>
            <b-collapse :visible="selectedNode.recordCheck">
              <div class="card-body p-3">
                <label for="recordType">{{ $t("WF.RECORD_TYPE") }}</label>
                <b-form-select v-model="selectedNode.recordType" id="recordType" class="type-select mb-1">
                  <b-form-select-option :key="item.value" v-for="item of recordTypeList" :value="item.value">{{
                    $t(item.text)
                  }}</b-form-select-option>
                </b-form-select>
                <b-form-checkbox v-model="selectedNode.isRecordRequired" name="check-button" class="mb-3">
                  {{ $t("WF.STEP_TITLE_REQUIRED") }}
                </b-form-checkbox>
                <label for="recordDesc">{{ $t("WF.RECORD_DESC") }}</label>
                <textarea
                  type="text"
                  id="recordDesc"
                  v-model="selectedNode.recordDesc"
                  :placeholder="$t('WF.RECORD_DESC_PH')"
                  class="form-control mb-1"
                  :class="{ 'err-input': selectedNode.error.recordDesc }"
                  rows="5"
                  maxlength="500"
                  @input="onValueCheck('recordDesc')"
                  @blur="onValueCheck('recordDesc')"
                />
                <small class="err-msg float-left" v-if="selectedNode.error.recordDesc">{{
                  $t("WF.ERR_RECORD_DESC")
                }}</small>
                <div class="desc-count text-right">
                  {{ selectedNode.recordDesc ? selectedNode.recordDesc.length : 0 }}/500
                </div>
              </div>
            </b-collapse>
          </div>

          <!-- 步驟確認 -->
          <div class="card-component mb-3 mr-2" v-if="selectedNode && selectedNode.type != -1">
            <div class="card-title m-0 pl-3">
              {{ $t("WF.STEP_CHECK") }}
              <toggle-button
                class="toggle-btn m-0"
                :value="selectedNode.isCheck"
                :sync="true"
                @change="selectedNode.isCheck = !selectedNode.isCheck"
                :color="{ checked: '#2173c9', unchecked: '#7b7b7b' }"
              />
            </div>
            <b-collapse :visible="selectedNode.isCheck">
              <div class="card-body p-3">
                <small class="err-msg float-left" v-if="selectedNode.error.pass_text || selectedNode.error.fail_text">{{
                  $t("WF.ERR_VALIDATION_TEXT")
                }}</small>
                <b-form-select class="type-select mb-1" v-model="validationType" @change="setCustomizedValidation">
                  <b-form-select-option :key="item.value" v-for="(item, index) of validationTypeList" :value="index">{{
                    item.text
                  }}</b-form-select-option>
                </b-form-select>

                <!-- <label class="mt-2 mb-0">自訂確認項</label> -->
                <b-form-checkbox v-model="selectedNode.isCustomizedValidation" role="button" name="check-button">
                  {{ $t("WF.CUSTOMIZED_PASS_FAIL_TEXT") }}
                </b-form-checkbox>
                <div v-if="selectedNode.isCustomizedValidation">
                  <div class="pass my-2">
                    <input
                      type="text"
                      class="form-control pass-text text-center"
                      v-model="selectedNode.pass_text"
                      :placeholder="selectedNode.pass_text"
                      @change="selectedNode.__ob__.dep.notify()"
                      @input="onValueCheck('pass_text')"
                      @blur="onValueCheck('pass_text')"
                      maxlength="20"
                    />
                    <b-icon icon="check-circle-fill" class="pass-icon"></b-icon>
                  </div>
                  <div class="fail my-2">
                    <input
                      type="text"
                      class="form-control fail-text text-center"
                      v-model="selectedNode.fail_text"
                      :placeholder="selectedNode.fail_text"
                      @change="selectedNode.__ob__.dep.notify()"
                      @input="onValueCheck('fail_text')"
                      @blur="onValueCheck('fail_text')"
                      maxlength="20"
                    />
                    <b-icon icon="x-circle-fill" class="fail-icon"></b-icon>
                  </div>
                </div>
                <b-form-checkbox v-model="selectedNode.isStepSkippable" role="button" name="check-button">
                  {{ $t("WF.SKIPPABLE") }}
                </b-form-checkbox>
              </div>
            </b-collapse>
          </div>
        </div>

        <div class="save-and-publish text-center row">
          <div class="col-4 exit p-2" role="button" v-b-tooltip.hover.top :title="$t('WF.LEAVE')" @click="leave">
            <font-awesome-icon icon="door-open" />
          </div>
          <div class="col-4 save p-2" role="button" v-b-tooltip.hover.top :title="$t('WF.SAVE')" @click="save">
            <font-awesome-icon icon="save" />
          </div>
          <div
            class="col-4 publish p-2"
            role="button"
            v-b-tooltip.hover.top
            :title="$t('WF.PUBLISH')"
            @click="showPublish"
          >
            <font-awesome-icon icon="cloud-upload-alt" />
          </div>
        </div>
      </div>
    </div>

    <Publish v-if="modalType.publish" :doPublish="doPublish" @cancel="closeModal('publish', false)"></Publish>
  </div>
</template>
<script>
  import Header from "@/components/Header";
  import Flowchart from "@/components/flowchart/Flowchart";
  import { roundTo20 } from "@/utils/math";
  import Publish from "@/components/modal/Publish";
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import draggable from "vuedraggable";

  function createBlob(dataURL) {
    let BASE64_MARKER = ";base64,";
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      let parts = dataURL.split(",");
      let contentType = parts[0].split(":")[1];
      let raw = decodeURIComponent(parts[1]);
      return { blob: new Blob([raw], { type: contentType }), contentType };
    } else {
      let parts = dataURL.split(BASE64_MARKER);
      let contentType = parts[0].split(":")[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;

      let uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return { blob: new Blob([uInt8Array], { type: contentType }), contentType };
    }
  }

  export default {
    components: {
      Header,
      Flowchart,
      Publish,
      draggable,
    },
    data: () => ({
      currentLang: 0,
      serial: 0,
      publishDescription: "",
      modalType: {
        publish: false,
      },
      nodes: [],
      connections: [],
      validationType: 0,
      validationTypeList: [],
      recordTypeList: [
        { value: 2, text: "WF.RECORD_TYPE_VIDEO" },
        { value: 1, text: "WF.RECORD_TYPE_IMAGE" },
      ],
      templateList: [
        { type: 0, name: "text", text: "WF.TEXT" },
        { type: 1, name: "image", text: "WF.IMAGE" },
        { type: 2, name: "video", text: "WF.VIDEO" },
        { type: 3, name: "text+image", text: "WF.TEXT_IMAGE" },
        { type: 4, name: "text+video", text: "WF.TEXT_VIDEO" },
        { type: 5, name: "model", text: "WF.MODEL" },
        { type: 6, name: "text+model", text: "WF.TEXT_MODEL" },
      ],
      connectionForm: { target: null, operation: null },
      isSidebarMinified: false,
      isMenuMinified: false,
      isContentMinified: false,
      isPreviewerMinified: false,
      selectedNode: null,
      photos: [],
      queryTitle: null,
      selectedData: null,
      isEditing: false,
      steps: [],
      errorList: [],
      //以下為model相關變數
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      directLight: null,
      ambientLught: null,
      clock: null,
      mesh: null,
      model: null,
      mixer: null,
      gridSize: 40,
      divisions: 8,
      progress: 0,
      filePath: null,
      changeFlag: false,
      isStaticModel: false,
    }),

    created() {
      window.onunload = () => {
        window.onbeforeunload = null;
      };
      window.onbeforeunload = (env) => {
        if (this.changeFlag) return this.$t("WF.LEAVE_ALERT");
      };
      document.addEventListener("input", (event) => {
        this.changeFlag = true;
      });
    },

    beforeRouteLeave(to, from, next) {
      if (!this.changeFlag) {
        window.onbeforeunload = null;
        this.clearScene();
        next();
      } else {
        this.$confirm(
          this.$t("WF.LEAVE_CONFIRM"),
          this.$t("WF.LEAVE_ALERT"),
          () => {
            window.onbeforeunload = null;
            this.clearScene();
            next();
          },
          () => {
            next(false);
          }
        );
      }
    },
    mounted() {
      let uuid = this.$route.params.uuid;
      let version = this.$route.params.version;
      if (uuid) this.getDetail(uuid, version);
      else this.$router.push({ name: "WorkflowManagement" });
      this.getCurrentLang();
      this.GetStepTextCollection();
    },

    methods: {
      // 從步驟模板新增一個步驟
      createNode(type) {
        if (this.$refs.chart.internalNodes.length >= 99 + 2) return this.$alert(this.$t("WF.STEP_ALERT"));

        this.changeFlag = true;
        this.$refs.chart.add({ type });
      },
      GetStepTextCollection() {
        this.apiGet("workflow/get_step_text_collection").then(({ data }) => {
          this.validationTypeList = [
            { text: this.$t("WF.PLEASE_SELECT_TEXT_COLLECTION") },
            ...data.map((c) => {
              return { text: `${c.pass_text} / ${c.fail_text}`, pass_text: c.pass_text, fail_text: c.fail_text };
            }),
          ];
        });
      },

      getDetail(uuid, version) {
        let data = { uuid, version };
        this.apiGet("workflow/detail", data).then(({ data }) => {
          this.queryTitle = data.name;
          this.steps = data.steps;
          // 清掉node、connection change的flag
          this.$nextTick(() => {
            this.changeFlag = false;
          });
        });
      },

      getCurrentLang() {
        this.currentLang = this.$cookies.get("language");
      },

      setImgSrc(type) {
        return require(`@/assets/images/${this.templateList[type].name}.svg`);
      },

      leave() {
        this.$router.push({ name: "WorkflowManagement" });
      },

      save() {
        let steps = this.$refs.chart.internalNodes.map((node) => node.toStep());

        let data = {
          uuid: this.$route.params.uuid,
          steps,
        };

        this.apiPost("workflow/save", data).then(({ data }) => {
          this.changeFlag = false;
          this.$emit("ok");
        });
      },

      showPublish() {
        if (!this.$refs.chart.checkConnection()) return this.$alert(this.$t("WF.ERR_OTHER"));
        let nodes = this.$refs.chart.internalNodes
          .filter((node) => node.serial != null)
          .sort((a, b) => {
            return a.serial - b.serial;
          });
        for (let node of nodes) {
          if (node.type == 1 || node.type == 3) this.onValueCheck("pic", node);
          if (node.type == 2 || node.type == 4) this.onValueCheck("vid", node);
          this.onValueCheck("title", node);
          if (node.type == 0 || node.type == 3 || node.type == 4 || node.type == 6) this.onValueCheck("text", node);
          if (node.type == 5 || node.type == 6) this.onValueCheck("model", node);
          if (node.type == 5 || node.type == 6) this.onValueCheck("modelSnapshot", node);
          if (node.recordCheck) this.onValueCheck("recordDesc", node);
          if (node.isCheck) {
            this.onValueCheck("pass_text", node);
            this.onValueCheck("fail_text", node);
          }
        }
        if (this.errorList.length > 0) {
          this.isEditing = true;
          return;
        }
        this.showModal("publish");
      },

      doPublish(description) {
        let steps = this.$refs.chart.internalNodes
          .filter((node) => node.serial != null)
          .sort((a, b) => {
            return a.serial - b.serial;
          })
          .map((node) => node.toStep());
        let data = {
          uuid: this.$route.params.uuid,
          description,
          steps,
        };
        this.apiPost("workflow/publish", data).then(({ data }) => {
          this.changeFlag = false;
          this.$emit("ok");
          this.$router.push({ name: "WorkflowManagement" });
        });
      },

      // checkStep() {},

      handleNodeChange() {
        this.changeFlag = true;
        this.updateErrorList();
      },

      handleConnectionChange() {
        this.changeFlag = true;
        this.updateErrorList();
      },

      handleSelect(node) {
        if (node && node.length > 0) {
          if (this.selectedNode !== node[0]) {
            this.clearScene();
            this.$nextTick(() => {
              this.selectedNode = node[0];
              let type = this.selectedNode.type;
              if (type == 5 || type == 6) {
                this.progress = -1;
                if (this.selectedNode.modelPath) {
                  this.initModel();
                }
              }
              let index = this.validationTypeList.findIndex(
                (v) => v.pass_text == this.selectedNode.pass_text && v.fail_text == this.selectedNode.fail_text
              );
              console.log(this.selectedNode, this.validationTypeList);
              if (index != -1) this.validationType = index;
              else this.validationType = 0;
            });
          }
        } else {
          this.clearScene();
          this.selectedNode = null;
        }
      },
      clearScene() {
        if (this.scene) {
          while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
          }
        }
        this.progress = -1;
      },

      renderChart: function(g, node, isSelected) {
        node.width = node.width || 120;
        node.height = node.height || 80;
        // 選中時的外框顏色
        let borderColor;
        let isDashed = "0";
        let strokeWidth = "2px";

        if (node.type == -1) {
          borderColor = "#367057";
        } else if (isSelected) {
          borderColor = "#e27e1a";
          isDashed = "10,5";
          strokeWidth = "3px";
        } else {
          borderColor = "#2173c9";
        }

        //svg物件是後面疊在前面之上，需注意順序

        //body外框
        if (node.type == -1) {
          // 開始與結束
          //// 裝飾用陰影
          g.append("rect")
            .style("width", node.width + "px")
            .style("height", roundTo20(node.height) - 20 + "px")
            .attr("x", node.x + 5)
            .attr("y", node.y + 5)
            .attr("rx", 30)
            .style("opacity", "0.7")
            .style("stroke-width", "2px")
            .style("fill", "#7b7b7b");
          //// 本體
          g.append("rect")
            .attr("x", node.x)
            .attr("y", node.y)
            .attr("rx", 30)
            .style("width", node.width + "px")
            .style("height", roundTo20(node.height) - 20 + "px")
            .style("opacity", "0.9")
            .style("stroke-width", "2px")
            .classed(node.type, true)
            .style("fill", "#3fb182")
            .attr("stroke", borderColor);
        } else {
          // 所有其他模板
          //// 裝飾用陰影
          g.append("rect")
            .style("width", node.width + "px")
            .style("height", "100px")
            .attr("x", node.x + 5)
            .attr("y", node.y + 5)
            .attr("rx", 8)
            .style("opacity", "0.7")
            .style("stroke-width", "2px")
            .style("fill", "#7b7b7b");
          //// 本體
          g.append("rect")
            .attr("x", node.x)
            .attr("y", node.y + 20)
            .attr("rx", 8)
            .style("width", node.width + "px")
            .style("height", "80px")
            .style("opacity", "0.9")
            .style("stroke-width", strokeWidth)
            .style("fill", "#2173c9")
            .attr("stroke", borderColor)
            .style("stroke-dasharray", isDashed);
        }

        //body文字
        let text = node.title;
        let bodyX;
        let bodyY;
        let fontWeight;
        let fontSize;
        if (node.type == -1) {
          bodyX = node.x + 12;
          bodyY = node.y + 18;
          fontWeight = "bold";
          fontSize = "18px";
        } else {
          bodyX = node.x + 10;
          bodyY = node.y + 37;
          fontWeight = "normal";
          fontSize = "14px";
        }

        g.append("foreignObject")
          .attr("x", bodyX)
          .attr("y", bodyY)
          .style("width", node.width - 20 + "px")
          .style("height", node.height + "px")
          .attr("text-anchor", "middle")
          .append("xhtml:p")
          .style("font-size", fontSize)
          .style("font-weight", fontWeight)
          .style("text-align", "center")
          .style("color", "#fff")
          .style("border", borderColor)
          .style("word-break", "break-word")
          .style("text-overflow", "ellipsis")
          .style("-webkit-line-clamp", "3")
          .style("-webkit-box-orient", "vertical")
          .style("display", "-webkit-box")
          .style("overflow", "hidden")
          .attr("title", text)
          .text(function() {
            return text;
          });

        if (node.type != -1) {
          //icon外框
          g.append("rect")
            .attr("x", node.x)
            .attr("y", node.y)
            .style("height", "31px")
            .style("width", node.width + "px")
            .attr("rx", 8)
            .style("stroke-width", strokeWidth)
            .style("fill", "#fff")
            .attr("stroke", borderColor)
            .style("stroke-dasharray", isDashed);

          //遮罩外框
          g.append("rect")
            .attr("x", node.x + 2)
            .attr("y", node.y + 2)
            .style("height", "31px")
            .style("width", node.width - 4 + "px")
            .attr("rx", 8)
            .style("stroke-width", "2px")
            .style("fill", "#fff")
            .attr("stroke", "#fff");

          //icon圖片
          g.append("image")
            .attr("href", require(`@/assets/images/${this.templateList[node.type].name}-alt.svg`))
            .attr("x", node.x + 45)
            .attr("y", node.y + 2)
            .style("height", "30px")
            .style("width", "30px");
        }

        // 錯誤提示
        if (
          (node.error.title || node.error.pic || node.error.vid || node.error.text || node.error.recordDesc) &&
          node.type != -1
        ) {
          g.append("rect")
            .style("width", "24px")
            .style("height", "24px")
            .attr("x", node.x + 100)
            .attr("y", node.y - 5)
            .attr("rx", 12)
            .style("opacity", "1")
            // .style("stroke-width", "2px")
            .style("fill", "#d44e4e");
          g.append("text")
            .attr("x", node.x + 110)
            .attr("y", node.y + 12)
            .attr("fill", "#fff")
            .attr("font-weight", "bold")
            .text(() => "!");
        }
      },

      toggleSidebar() {
        if (this.isSidebarMinified) {
          this.isSidebarMinified = false;
          setTimeout(() => {
            this.isContentMinified = false;
            this.isMenuMinified = false;
          }, 500);
        } else {
          this.isSidebarMinified = true;
          this.isContentMinified = true;
          setTimeout(() => {
            this.isMenuMinified = true;
          }, 300);
        }
      },

      showEditTips() {
        this.isSidebarMinified = false;
        this.isMenuMinified = false;
        this.isContentMinified = false;
        this.isEditing = true;
      },

      togglePreviewMinified(val) {
        this.isPreviewerMinified = val;
        console.log(!val, this.selectedNode, this.selectedNode.modelPath);
        if (!val && this.selectedNode && this.selectedNode.modelPath) this.initModel();
      },

      // title text recordDesc
      onValueCheck(type, node) {
        if (!node) node = this.selectedNode;
        if (!node || !type) return;
        let value = node[type];
        console.log(`onValueCheck ${type} ${node.id}, ${value}`);

        node.error[type] = !value;
        node.__ob__.dep.notify();
        this.updateErrorList();
      },

      onChangeRecordCheck() {
        this.selectedNode.recordCheck = !this.selectedNode.recordCheck;
        if (!this.selectedNode.recordCheck) {
          delete this.selectedNode.error.recordDesc;

          this.updateErrorList();
        }
      },

      onChangeAnimationEnable() {
        this.selectedNode.animationEnable = !this.selectedNode.animationEnable;
        // 檢核以後再加Orz Miso
        // if (!this.selectedNode.animationEnable) {
        //   delete this.selectedNode.error.recordDesc;

        //   this.updateErrorList();
        // }
      },

      onChangeFileUpload(type) {
        let node = this.selectedNode;
        let isVid = type == "vid";
        let isPic = type == "pic";
        let isModel = type == "model";
        let validExts = new Array(".jpg", ".jpeg", ".png");
        if (isVid) validExts = new Array(".mp4");
        if (isModel) validExts = new Array(".glb");

        let file = this.$refs.file.files[0];
        if (!file) {
          node[type] = null;
          node[type + "Path"] = null;
          node[type + "Name"] = null;
          node[type + "Size"] = null;
          node.error[type] = true;
          this.updateErrorList();
          return;
        }
        let fileExt = file.name;
        console.log(file);
        fileExt = fileExt.substring(fileExt.lastIndexOf("."));
        if (validExts.indexOf(fileExt) < 0) {
          if (isPic) return this.$alert(this.$t("WF.IMAGE_ERR"));
          if (isVid) return this.$alert(this.$t("WF.VIDEO_ERR"));
          if (isModel) return this.$alert(this.$t("WF.MODEL_ERR"));
        } else if (isPic && file.size > 25 * 1024 * 1024) {
          return this.$alert(this.$t("WF.SIZE_ERR") + "25M");
        } else if (isVid && file.size > 150 * 1024 * 1024) {
          return alert(this.$t("WF.SIZE_ERR") + "150M");
        } else if (isModel && file.size > 10 * 1024 * 1024) {
          return this.$alert(this.$t("WF.SIZE_ERR") + "10M");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("uuid", this.$route.params.uuid);

        this.apiPost("workflow/upload_step_file", formData)
          .then(({ data }) => {
            node[type] = data.file_uuid;
            node[type + "Path"] = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${data.file_path}`;
            node[type + "Name"] = data.file_name;
            node[type + "Size"] = data.file_size;
            node.error[type] = false;
            node.__ob__.dep.notify();
            this.updateErrorList();

            this.$nextTick(() => {
              this.initModel();
            });
          })
          .catch(({ message }) => {
            console.log(`upload_step_file error with ${message}`);
          });

        // let reader = new FileReader();
        // reader.onload = (event) => {
        //   this.photos.push({
        //     file: file,
        //     src: event.target.result,
        //   });
        // };
        // reader.readAsDataURL(file);
      },

      onErrorClick(err) {
        if (err.node) this.$refs.chart.selectNode(err.node);
      },

      deleteFile(type) {
        let node = this.selectedNode;
        if (node) {
          node[type] = null;
          node[type + "Path"] = null;
          node[type + "Name"] = null;
          node[type + "Size"] = null;
          node.error[type] = true;
          if (type == "model") {
            node.modelSnapshot = null;
            node.modelSnapshotPath = null;
            node.animationEnable = true;
            node.animationControlList = [{ start: 0, end: 0 }];
            this.clearScene();
          }
          this.updateErrorList();
        }
      },

      showModal(type, data) {
        if (data) this.selectedData = data;
        this.modalType[type] = true;
      },

      closeModal(type) {
        this.modalType[type] = false;
        this.selectedData = null;
      },

      chooseFiles() {
        this.$refs.file.click();
      },

      updateErrorList() {
        let errors = [];
        if (!this.$refs.chart || !this.$refs.chart.internalNodes) return [];
        let node = this.$refs.chart.internalNodes.find((t) => t.serial === 0);
        if (!node) return [];
        while (node.to) {
          node = node.to;
          if (node.serial === -1) break;
          let title = this.$t("WF.STEP") + " " + node.serial;
          if (node.error.title) errors.push({ node, title, msg: this.$t("WF.ERR_TITLE") });
          if (node.error.pic) errors.push({ node, title, msg: this.$t("WF.ERR_IMAGE") });
          if (node.error.vid) errors.push({ node, title, msg: this.$t("WF.ERR_VIDEO") });
          if (node.error.text) errors.push({ node, title, msg: this.$t("WF.ERR_STEP_DESC") });
          if (node.error.recordDesc) errors.push({ node, title, msg: this.$t("WF.ERR_RECORD_DESC") });
          if (node.error.model) errors.push({ node, title, msg: this.$t("WF.ERR_MODEL") });
          if (node.error.modelSnapshot) errors.push({ node, title, msg: this.$t("WF.ERR_MODEL_SNAPSHOT") });
          if (node.error.pass_text || node.error.fail_text)
            errors.push({ node, title, msg: this.$t("WF.ERR_VALIDATION_TEXT") });
        }
        if (node.serial === 0) {
          errors.push({ node, title: null, msg: this.$t("WF.ERR_START") });
        } else if (node.serial !== -1) {
          let last = this.$refs.chart.internalNodes.find((t) => t.serial === -1);
          if (!last.from) errors.push({ node, title: null, msg: this.$t("WF.ERR_END") });
          else errors.push({ node, title: null, msg: this.$t("WF.ERR_OTHER") });
        }

        this.errorList = errors;
      },

      //// 3d model functions
      initModel() {
        console.log("initModel");
        this.$nextTick(() => {
          //清除當前場景
          // const oldScene = this.$refs.modelCanvas;
          // if (oldScene && oldScene.length > 0) {
          //   oldScene[0].remove();
          // }
          if (!this.$refs.modelCanvas) return;

          // 建立渲染器
          this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            autoClear: true,
            physicallyCorrectLights: true,
            preserveDrawingBuffer: true,
          });
          // this.renderer.setSize(this.$refs.modelCanvas.clientWidth, this.$refs.modelCanvas.clientHeight);
          this.renderer.setSize(520, 320);
          this.renderer.setClearColor(0xeeeeee, 1);
          this.$refs.modelCanvas.innerHTML = "";
          this.$refs.modelCanvas.appendChild(this.renderer.domElement);

          // 建立場景
          this.scene = new THREE.Scene();

          // 建立格線
          const colorCenterLine = 0x444444;
          const colorGrid = 0x444444;
          const gridHelper = new THREE.GridHelper(this.gridSize, this.divisions, colorCenterLine, colorGrid);
          this.scene.add(gridHelper);

          // 建立座標線
          const geometry1 = new THREE.PlaneGeometry(40, 0.15);
          const geometry2 = new THREE.PlaneGeometry(0.15, 40);
          const material1 = new THREE.MeshBasicMaterial({ color: 0xbf2222, side: THREE.DoubleSide });
          const material2 = new THREE.MeshBasicMaterial({ color: 0x228c57, side: THREE.DoubleSide });
          const axisX = new THREE.Mesh(geometry1, material1);
          const axisY = new THREE.Mesh(geometry2, material2);
          axisX.position.set(0, 0.012, 0);
          axisX.rotation.set(1.57, 0, 0);
          axisY.position.set(0, 0.01, 0);
          axisY.rotation.set(1.57, 0, 0);

          this.scene.add(axisX, axisY);

          //選擇要用哪種格式載入模型
          this.loadGLTF();
          // this.loadFBX();

          // 建立相機
          this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          this.camera.position.x = 15;
          this.camera.position.y = 15;
          this.camera.position.z = 15;

          // 縮放、平移、旋轉等控制
          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
          this.controls.minZoom = 1;
          this.controls.maxZoom = 1.5;
          //   controls.enablePan = false;

          // 建立光源
          this.dLight = new THREE.DirectionalLight("#fff", 1);
          this.dLight.position.set(0, 0, 100).normalize();
          this.dLight.castShadow = true;
          this.scene.add(this.dLight);

          this.aLight = new THREE.AmbientLight("#ccc");
          this.scene.add(this.aLight);

          // create clock
          this.clock = new THREE.Clock();

          this.render();
        });
      },

      animate() {
        this.id = requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
      },

      stopAnimation() {
        console.log("STOP");
        this.mixer.stopAllAction();
      },

      setAnimationTime(startTime, endTime) {
        this.stopAnimation();

        console.log("開始秒數: " + startTime);
        console.log("幾秒後結束: " + endTime);

        const animations = this.model.animations;
        animations.forEach((animation) => {
          let action = this.mixer.clipAction(animation);
          action.clampWhenFinished = true;
          action.setLoop(THREE.LoopOnce);
          action.play();

          setTimeout(() => {
            action.paused = true;
          }, (endTime - startTime) * 1000);
        });
        this.mixer.setTime(startTime);

        this.animate();
        this.render();
      },

      deleteAnimationTime(index) {
        let node = this.selectedNode;
        if (node.animationControlList <= 1) return;
        if (node && node.animationControlList) node.animationControlList.splice(index, 1);
      },

      addAnimationControl() {
        let node = this.selectedNode;
        if (node && node.animationControlList) node.animationControlList.push({ start: 0, end: 0 });
      },

      updateAnimationControlList() {
        for (let i = 0; i < this.selectedNode.animationControlList.length; i++) {
          this.selectedNode.animationControlList[i].id = i;
        }
      },

      durationLimit(item, type) {
        this.updateAnimationControlList();
        if (item[type] > this.model.animations[0].duration) {
          alert("不可超過動畫總秒數");
          this.selectedNode.animationControlList[item.id][type] = this.model.animations[0].duration;
        }
      },

      captureModelSnapshot() {
        try {
          let dataUrl = this.renderer.domElement.toDataURL();

          const formData = new FormData();
          let file = createBlob(dataUrl);
          formData.append("file", file.blob, "snapshot.png");
          formData.append("uuid", this.$route.params.uuid);

          this.apiPost("workflow/upload_step_file", formData)
            .then(({ data }) => {
              let node = this.selectedNode;
              if (node) {
                node.modelSnapshot = data.file_uuid;
                node.modelSnapshotPath = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${data.file_path}`;
                node.error["modelSnapshot"] = false;
                node.__ob__.dep.notify();
                this.updateErrorList();
              }
            })
            .catch(({ message }) => {
              console.log(`upload_step_file error with ${message}`);
            });
        } catch (e) {
          console.log(e);
        }
      },

      dragColumn(evt) {
        console.log({ evt });
        console.log(this.selectedNode.animationControlList);
      },

      deleteModelSnapshot() {
        let node = this.selectedNode;
        if (node) {
          node.modelSnapshot = null;
          node.error["modelSnapshot"] = true;
          node.__ob__.dep.notify();
          this.updateErrorList();
        }
      },

      render() {
        if (this.model) {
          // setTimeout(() => {
          requestAnimationFrame(this.render);
          let delta = this.clock.getDelta();
          if (this.mixer) this.mixer.update(delta); // update animation mixer
          this.renderer.render(this.scene, this.camera);
          // }, 10);
        }
      },

      loadGLTF() {
        this.isStaticModel = false;
        this.selectedNode.animationEnable = true;
        this.progress = 0;
        let node = this.selectedNode;
        console.log("loadGLTF", node.modelPath);
        // 載入gltf模型
        this.loader = new GLTFLoader();
        // let src = "../static/models/gltf/sb.glb";
        this.loader.load(
          // resource URL
          node.modelPath,
          // called when the resource is loaded
          (gltf) => {
            this.model = gltf;
            console.log(this.model.animations[0]);
            if (!this.model.animations.length) {
              this.isStaticModel = true;
              this.selectedNode.animationEnable = false;
            }
            this.mesh = this.model.scene;
            this.model.scene.scale.setScalar(5);
            this.mixer = new THREE.AnimationMixer(this.mesh);
            this.render();
            this.scene.add(this.mesh);
          },
          (xhr) => {
            this.progress = ((xhr.loaded / xhr.total) * 100).toFixed(0);
          },
          (error) => {
            console.error("An error happened", error);
          }
        );
      },

      updateGrid(reset) {
        // 清除舊格線
        for (let item of this.scene.children) {
          if (item.type == "GridHelper") {
            let index = this.scene.children.indexOf(item);
            if (index !== -1) {
              this.scene.children.splice(index, 1);
            }
          }
        }
        for (let i = 0; i < this.scene.children.length; i++) {
          if (this.scene.children[i].type == "Mesh") {
            this.scene.children.splice(i, 2);
          }
        }

        // 重置格線
        if (reset == 1) {
          this.gridSize = 40;
          this.divisions = 8;
        }

        const colorCenterLine = 0x444444;
        const colorGrid = 0x444444;
        const gridHelper = new THREE.GridHelper(this.gridSize, this.divisions, colorCenterLine, colorGrid);
        this.scene.add(gridHelper);

        // 建立XY座標軸
        const geometry1 = new THREE.PlaneGeometry(this.gridSize, 0.15);
        const geometry2 = new THREE.PlaneGeometry(0.15, this.gridSize);
        const material1 = new THREE.MeshBasicMaterial({ color: 0xbf2222, side: THREE.DoubleSide });
        const material2 = new THREE.MeshBasicMaterial({ color: 0x228c57, side: THREE.DoubleSide });
        const axisX = new THREE.Mesh(geometry1, material1);
        const axisY = new THREE.Mesh(geometry2, material2);
        axisX.position.set(0, 0.012, 0);
        axisX.rotation.set(1.57, 0, 0);
        axisY.position.set(0, 0.01, 0);
        axisY.rotation.set(1.57, 0, 0);

        this.scene.add(axisX, axisY);
      },

      resetCamera() {
        this.camera.position.x = 15;
        this.camera.position.y = 15;
        this.camera.position.z = 15;
        this.render();
        this.animate();
      },

      resetGrid() {
        this.camera.position.x = 15;
        this.camera.position.y = 15;
        this.camera.position.z = 15;
        this.render();
        this.animate();
      },

      setCustomizedValidation() {
        this.selectedNode.pass_text = this.validationTypeList[this.validationType].pass_text;
        this.selectedNode.fail_text = this.validationTypeList[this.validationType].fail_text;
        this.selectedNode.__ob__.dep.notify();
        this.onValueCheck("pass_text");
      },
      // TODO
      resizeCanvas() {
        // 當ResizeObserver偵測到變化，呼叫resize canvas，exception是當通話還未建立時就改變視窗大小的話會報錯
      },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .workflow {
    background-color: #fefefe;
    font-family: "微軟正黑體";

    .workflow-container {
      padding-top: 62px;
      height: 100vh;

      .col-1 {
        width: 3.666667%;
        flex: 0 0 3.666667%;
        max-width: 3.666667%;
        background-color: #b3d5f4 !important;
      }

      .col-9 {
        width: 79%;
        flex: 0 0 79%;
        max-width: 79%;
      }

      .left-section {
        background-color: #f9f9f9;
        box-shadow: rgba(17, 17, 26, 0.05) 0px 4px 16px inset, rgba(17, 17, 26, 0.05) 0px 8px 32px inset;

        .menu {
          margin: 13px 10px 8px 10px;
          border-bottom: 2px solid $grey;
          padding-bottom: 2px;

          .menu-icon {
            width: 14px;
            color: $blue;
          }
        }

        .minified {
          img {
            width: 25px;
            &:hover {
              color: $blue;
            }
          }
        }

        .edit-link {
          position: relative;
          margin: 13px 10px 8px 10px;
          border-top: 2px solid $grey;

          .edit-link-icon {
            margin-top: 25px;
            color: $blue;
            width: 25px;
          }

          .tip-dot {
            position: absolute;
            width: 10px;
            height: 10px;
            top: 21px;
            right: 0px;
            border-radius: 50%;
            background-color: $red;
          }
        }

        .template-component {
          transition: all 0.2s ease;

          &:hover {
            transform: translate(0, -5px);
          }

          .template-outline {
            border-radius: 8px;
            background-color: #fff;
            border: 1px solid #fff;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 5px;

            svg {
              color: $grey;
            }
          }

          .template-img {
            width: 60px;
            @media (max-width: 1200px) {
              width: 40px;
            }
          }

          .template-title {
            color: $grey;
            font-size: 14px;
          }
        }

        .functions {
          width: 150px;
          cursor: pointer;
        }

        .error-edit-section {
          .error-sub-title {
            font-size: 14px;
          }
          .error-card {
            background-color: #fff;
            border-radius: 10px;
            height: 56px;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 5px;

            &:hover {
              transform: translate(-5px, 0);
            }

            .decor-line {
              width: 6px;
              height: 100%;
              background-color: $red;
              border-top-left-radius: 10px;
              border-bottom-left-radius: 10px;
            }

            .error-card-title {
              color: $red;
            }

            .error-card-msg {
              font-size: 14px;
            }

            .warning-bg {
              background-color: #f7a63d;
            }

            .warning-msg {
              color: #e09635;
            }
          }
        }
      }

      .middle-section {
        z-index: 9;

        .flowchart-container {
          height: calc(100vh - 150px);
          overflow: scroll;

          .previewer {
            aspect-ratio: 16 / 9;
            position: absolute;
            bottom: 3vh;
            height: 43vh;
            transition: all 0.2s ease-in-out;
            // 虛線外框
            // background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='lightgrey' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");

            .previewer-header {
              height: 15%;
              color: #fff;
              background-color: #9b9b9b;
              border-top-right-radius: 8px;

              .header-step {
                margin-top: 8px;
                width: 110px;
                height: 40px;
                font-size: 24px;
                background-color: #5b5b5b;
                border-top-right-radius: 20px;
                border-bottom-right-radius: 20px;
              }

              .null {
                width: 100px;
                line-height: 40px;
                font-size: 14px;
                font-weight: bold;
              }

              .header-title {
                margin-top: 8px;
                font-weight: bold;
                max-width: 520px;

                .header-title-text {
                  overflow: hidden;
                  font-size: 24px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }

              .minify-btn {
                margin-top: 8px;
                width: 110px;
                height: 40px;
                line-height: 40px;
                font-size: 18px;
                font-weight: bold;
                background-color: $blue;
                border-top-left-radius: 20px;
                border-bottom-left-radius: 20px;
              }

              .en-fontsize {
                width: 100px;
                font-size: 14px;
              }
            }

            .previewer-body {
              padding-top: 6px;
              height: 70%;
              background-color: #9b9b9b;

              .previewer-body-inner {
                height: 100%;

                .text-only {
                  font-size: 24px;
                  font-weight: bold;
                  color: #fff;
                  word-break: break-all;
                }

                .previewer-desc {
                  padding: 0 12px;
                  width: 33%;
                  font-size: 18px;
                  font-weight: bold;
                  color: #fff;
                  word-break: break-all;
                  overflow: hidden;

                  strong {
                    white-space: pre-wrap;
                  }
                }

                .previewer-content {
                  margin-right: 12px;
                  width: calc(67% - 12px);
                  height: 100%;
                  overflow: hidden;
                  background-color: #eee;

                  .img {
                    height: 100%;
                  }

                  .vid {
                    height: inherit;
                  }

                  .empty-text {
                    margin-top: 100px;
                    font-size: 30px;
                  }

                  .progress-section {
                    height: 100px;
                    width: 80%;

                    .progress-text {
                      margin-top: 100px;
                      font-size: 30px;
                    }
                  }
                }

                .full-w {
                  width: 70%;
                  margin: 0 15%;
                }
              }
            }

            .previewer-footer {
              height: 15%;
              line-height: 15%;
              color: #fff;
              font-weight: bold;
              background-color: #9b9b9b;
              border-top-right-radius: 0;
              transition: all 0.2s ease-in-out;

              .expand-btn {
                width: 100px;
                height: 40px;
                line-height: 40px;
              }

              .glasses-btn-group {
                padding: 10px;

                .btn {
                  font-weight: bold;
                  min-width: 90px;
                  height: 30px;
                  line-height: 28px;
                  border-radius: 15px;
                  cursor: default;
                }

                .dark {
                  color: #fff;
                  background-color: #5b5b5b;
                  border: 2px solid #9b9b9b;
                }

                .light {
                  background-color: #fff;
                  border: 2px solid #9b9b9b;
                }

                .active {
                  color: $blue;
                  background-color: #fff;
                  border: 2px solid $blue;
                }
              }
            }

            .minified-footer {
              height: 100%;
              line-height: 100%;
              background-color: $blue;
              border-top-right-radius: 8px;
            }
          }

          .minified-previewer {
            height: 40px;
            border: none;
            transition: all 0.2s ease-in-out;
          }

          .toggle-sidebar {
            position: absolute;
            background-color: #f2f2f2;
            top: 45%;
            left: -10px;
            width: 25px;
            height: 40px;
            border-bottom-right-radius: 5px;
            border-top-right-radius: 5px;
            padding-top: 8px;

            svg {
              color: $grey;
              width: 20px;
              height: 24px;
              transition: all 1s ease-in-out;
            }

            .arrow-right {
              color: #fff;
              transition: all 1s ease-in-out;
            }
          }

          .minified-sidebar {
            background-color: #b1d0ef;
          }
        }
      }

      .right-section {
        background-color: #f9f9f9;
        box-shadow: rgba(17, 17, 26, 0.05) 0px 4px 16px inset, rgba(17, 17, 26, 0.05) 0px 8px 32px inset;
        z-index: 999;

        .edit-section {
          height: calc(100vh - 198px);
          overflow-y: scroll;

          .card-component {
            border-radius: 8px;
            background-color: #fff;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 5px;

            .card-title {
              line-height: 44px;
              // color: $blue;
              font-weight: bold;
              font-size: 18px;

              .toggle-btn {
                float: right;
                top: 12px;
                right: 10px;
              }
            }

            .card-body {
              border-top: 1px solid #eee;

              .form-control {
                background-color: #f5f5f5;
                font-size: 14px;
                border: none;
                transition: all 0.3s ease-in-out;

                &:focus {
                  border: 2px solid #4b8bcf;
                  box-shadow: none;
                }
              }

              .pass {
                position: relative;
                .pass-text {
                  border: 2px solid $green !important;
                }
                .pass-icon {
                  position: absolute;
                  top: -7px;
                  right: -7px;
                  background-color: #fff;
                  color: $green;
                }
              }

              .fail {
                position: relative;
                .fail-text {
                  border: 2px solid $red !important;
                }
                .fail-icon {
                  position: absolute;
                  top: -7px;
                  right: -7px;
                  background-color: #fff;
                  color: $red;
                }
              }

              .node-pic,
              .node-vid {
                .m-text {
                  font-size: 14px;
                  padding: 12px;
                  background-color: #f5f5f5;
                  border-radius: 8px;
                }
              }

              .err-input {
                border: 2px solid $red !important;

                &:focus {
                  border: 2px solid $red;
                  box-shadow: none;
                }
              }

              .err-msg {
                color: $red;
              }

              .desc-count {
                font-size: 12px;
              }

              .type-select {
                background-color: #f5f5f5;
                border: 1px solid #f5f5f5;
                font-size: 14px;
                //更改select icon樣式
                background-image: linear-gradient(45deg, transparent 50%, $grey 60%),
                  linear-gradient(135deg, $grey 40%, transparent 50%) !important;
                background-position: calc(100% - 17px) 14px, calc(100% - 10px) 14px, 100% 0;
                background-size: 7px 7px, 7px 7px;
                background-repeat: no-repeat;
                -webkit-appearance: none;
                -moz-appearance: none;
                cursor: pointer;
                option {
                  background-color: #fff;
                  border: 1px solid #fff;
                }
              }

              .animation-track {
                border-radius: 8px;
                cursor: grab;
                box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

                .animation-input {
                  width: 40px;
                  display: inline-block;
                  padding: 6px;

                  &::-webkit-outer-spin-button,
                  &::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                  }
                }

                .animation-btn {
                  color: $blue;

                  &:hover {
                    color: $blueHover;
                  }
                }
              }
            }
          }
        }

        .save-and-publish {
          margin-top: 27px;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: -25px;
          border-radius: 8px;
          box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
          position: fixed;
          width: 13.3vw;

          .exit,
          .save,
          .publish {
            background-color: #fff;
            color: $blue;
            transition: all 0.2s ease;

            &:hover {
              transform: translate(0, -3px);
            }
          }

          .exit {
            border-top-left-radius: 8px;
            border-right: 1px solid #eee;
          }

          .publish {
            border-top-right-radius: 8px;
            border-left: 1px solid #eee;
          }
        }
      }

      .tab-group {
        padding-top: 9px;
        margin-bottom: 24px;
        border-bottom: 2px solid $blue;
        font-weight: bold;

        .active-tab,
        .inactive-tab {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .active-tab {
          color: #fff;
          background-color: $blue;
          border: 2px solid $blue;
          border-bottom: none;
          box-shadow: rgba(0, 0, 0, 0.15) 0px -3px 3px 0px;
        }

        .inactive-tab {
          border: 2px solid #ccc;
          border-bottom: none;
          background-color: #d9d9d9;

          &:hover {
            color: #fff;
            background-color: $blue;
            border: 2px solid $blue;
            border-bottom: none;
          }
        }
      }
    }
  }

  .title {
    margin-top: 15px;
    margin-bottom: 24px;
    border-bottom: 2px solid $grey;
    padding-bottom: 10px;
    font-weight: bold;

    .title-icon {
      width: 14px;
      color: $blue;
    }

    .h-18 {
      width: unset;
      height: 18px;
    }
  }

  .model-length {
    font-size: 14px;

    .model-length-text {
      color: $blue;
    }
  }

  .upload-btn {
    color: #fff;
    background-color: $blue;
  }

  .delete-btn {
    color: #fff;
    background-color: $red;
  }

  .snapshot {
    width: 100%;
  }

  .subtitle {
    font-size: 14px;
    margin: 10px;
    margin-bottom: 10px;
  }

  .show-transition {
    transition: all 0.2s ease-in-out;
  }

  /deep/ .custom-control-input:checked {
    ~ .custom-control-label {
      &::before {
        border-color: #2173c9;
        background-color: #2173c9;
        cursor: pointer;
      }
    }
  }

  /deep/ .custom-switch {
    .custom-control-label {
      &::before {
        border-color: $grey;
        background-color: $grey;
        cursor: pointer;
      }

      &::after {
        border-color: #fff;
        background-color: #fff;
        cursor: pointer;
      }
    }
  }
</style>
