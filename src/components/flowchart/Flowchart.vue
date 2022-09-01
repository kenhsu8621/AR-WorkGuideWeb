<!-- https://github.com/joyceworks/flowchart-vue -->
<template>
  <div
    class="chart"
    tabindex="0"
    :style="{
      width: isNaN(width) ? width : width + 'px',
      height: isNaN(height) ? height : height + 'px',
      cursor: cursor,
    }"
    @mousemove="handleChartMouseMove"
    @mouseup="handleChartMouseUp"
    @mousewheel="handleChartMouseWheel"
    @mousedown="handleChartMouseDown($event)"
  >
    <!-- <span id="position" class="unselectable">
      {{ cursorToChartOffset.x + ", " + cursorToChartOffset.y }}
    </span> -->
    <svg id="svg" :style="{ zoom: zoom }">
      <rect class="selection" height="0" width="0"></rect>
    </svg>
    <div class="zoom-ratio">
      <span>{{ zoom * 100 }}%</span>
    </div>
  </div>
</template>
<style src="./index.css"></style>
<script>
  import { connect, lineTo } from "@/utils/svg";
  import * as d3 from "d3";
  import { between, distanceOfPointToLine, getEdgeOfPoints, pointRectangleIntersection } from "@/utils/math";
  import render from "./render";

  let unitPx = 200;
  let index = 0;
  class Node {
    constructor(step = {}) {
      this.serial = step.serial;
      this.id = ++index;
      this.type = step.type;
      this.title = step.name || ``;
      this.text = step.description;
      if (typeof step.x !== "undefined") this.x = step.x;
      else this.x = 100;
      if (typeof step.y !== "undefined") this.y = step.y;
      else this.y = 100;

      this.pic = step.pic_uuid;
      if (step.pic_path) {
        this.picName = step.pic_name;
        this.picSize = step.pic_size;
        this.picPath = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${step.pic_path}`;
      }
      this.vid = step.vid_uuid;
      if (step.vid_path) {
        this.vidName = step.vid_name;
        this.vidSize = step.vid_size;
        this.vidPath = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${step.vid_path}`;
      }

      this.pass_text = step.pass_text;
      this.fail_text = step.fail_text;
      this.model = step.model_uuid;
      this.animationControlList = [{ start: 0, end: 0 }];
      this.animationEnable = true;
      if (step.model_path) {
        this.modelName = step.model_name;
        this.modelSize = step.model_size;
        this.modelPath = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${step.model_path}`;

        try {
          let data = JSON.parse(step.model_desc);
          this.animationEnable = data.animationEnable;
          if (data.animations && data.animations.length) this.animationControlList = data.animations;
        } catch (e) {
          console.log(e);
        }
      }
      this.modelSnapshot = step.model_snapshot_uuid;
      if (step.model_snapshot_path) {
        this.modelSnapshotPath = `https://${process.env.VUE_APP_STORAGE_URL}/uuid?uuid=${step.model_snapshot_path}`;
      }
      this.isCheck = typeof step.is_check === "undefined" ? false : Boolean(step.is_check);
      this.isStepSkippable = typeof step.can_skip === "undefined" ? false : Boolean(step.can_skip);

      this.nextStep = step.next_step;
      this.nextConnection = step.next_connection || "";
      this.recordCheck = typeof step.is_record === "undefined" ? false : Boolean(step.is_record);
      this.isRecordRequired = typeof step.must_record === "undefined" ? false : Boolean(step.must_record);
      this.recordType = step.record_type || 1;
      this.recordDesc = step.record_desc;
      this.error = {};
      this.from = null;
      this.to = null;
      this.toStep = function() {
        let data = {
          serial: this.serial,
          type: this.type,
          name: this.title,
          description: this.text,
          x: this.x,
          y: this.y,
          pic: this.pic,
          vid: this.vid,
          model: this.model,
          pass_text: this.pass_text,
          fail_text: this.fail_text,
          model_snapshot: this.modelSnapshot,
          model_desc: JSON.stringify({
            animations: this.animationControlList,
            animationEnable: this.animationEnable,
          }),
          is_check: this.isCheck ? 1 : 0,
          can_skip: this.isStepSkippable ? 1 : 0,
          next_step: this.to && this.to.serial,
          next_connection: this.nextConnection && this.nextConnection.toString(),
          is_record: this.recordCheck ? 1 : 0,
          must_record: this.isRecordRequired ? 1 : 0,
          record_type: this.recordType,
          record_desc: this.recordDesc,
        };
        return data;
      };
    }
  }

  class Connection {
    constructor(sourceNode, sourcePosition, destinationNode, destinationPosition) {
      this.source = sourceNode;
      this.destination = destinationNode;
      this.sourcePosition = sourcePosition || "right";
      this.destinationPosition = destinationPosition || "left";
      this.id = Date.now();
      this.type = "pass";
      this.toString = function() {
        return this.sourcePosition + "," + this.destinationPosition;
      };
    }
  }
  export default {
    name: "flowchart",
    props: {
      steps: {
        type: Array,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      render: {
        type: Function,
        default: render,
      },
    },
    data() {
      return {
        width: 1600,
        height: 1200,
        originalWidth: 1600,
        originalHeight: 1200,
        internalNodes: [],
        internalConnections: [],
        connectingInfo: {
          source: null,
          sourcePosition: null,
        },
        // selectionInfo: null,
        currentNodes: [],
        currentConnections: [],
        /**
         * Mouse position(relative to chart div)
         */
        cursorToChartOffset: { x: 0, y: 0 },
        /**
         * lines of all internalConnections
         */
        lines: [],
        zoom: 1,
      };
    },
    methods: {
      init() {
        let that = this;
        that.internalNodes.splice(0, that.internalNodes.length);
        that.internalConnections.splice(0, that.internalConnections.length);

        for (let step of this.steps) this.add(step);

        let start = this.internalNodes.find((node) => node.serial == 0);
        if (!start) this.add({ id: 0, serial: 0, x: 150, y: 130, type: -1, title: this.$t("WF.START") });
        let end = this.internalNodes.find((node) => node.serial == -1);
        if (!end) this.add({ id: -1, serial: -1, x: 730, y: 130, type: -1, title: this.$t("WF.END") });

        for (let node of this.internalNodes) {
          if (node.nextStep) {
            let destination = this.internalNodes.find((t) => t.serial == node.nextStep);
            if (destination) {
              let arr = node.nextConnection.split(",");
              let sourcePosition = arr[0];
              let destinationPosition = arr[1];
              let conn = new Connection(node, sourcePosition || "right", destination, destinationPosition || "left");
              this.internalConnections.push(conn);
              node.to = destination;
              node.nextConnection = conn;
              destination.from = node;
              this.$emit("connectionChange");
            }
          }
        }
      },
      add(data) {
        if (this.readonly) {
          return;
        }
        if (!data.x) data.x = this.$el.parentNode.scrollLeft + 100;
        if (!data.y) data.y = this.$el.parentNode.scrollTop + 100;
        if (data.serial == 0) data.name = this.$t("WF.START");
        if (data.serial == -1) data.name = this.$t("WF.END");
        let node = new Node(data);
        this.internalNodes.push(node);
        this.$emit("nodeChange");
      },
      handleChartMouseWheel(event) {
        if (event.ctrlKey) {
          event.stopPropagation();
          event.preventDefault();
          if (event.deltaY > 0 && this.zoom === 0.1) return;

          this.zoom = Math.round(this.zoom * 10 - event.deltaY / 100) / 10;
        }
      },
      async handleChartMouseUp(event) {
        this.handleConnect(
          this.connectingInfo && this.connectingInfo.source,
          this.hoveredConnector && this.hoveredConnector.node,
          this.connectingInfo && this.connectingInfo.sourcePosition,
          this.hoveredConnector && this.hoveredConnector.position
        );
        // if (this.selectionInfo) {
        //   this.selectionInfo = null;
        // }
        if (event.which == 2) {
          let el = this.$el.parentNode;
          el.style.cursor = "default";
        }
      },
      async handleChartMouseMove(event) {
        if (event.which == 2) {
          event.preventDefault();
          let el = this.$el.parentNode;
          if (this.clientX && this.clientY) {
            el.scrollBy((this.clientX - event.x) * this.zoom, (this.clientY - event.y) * this.zoom);
            this.clientX = event.x;
            this.clientY = event.y;
            el.style.cursor = "move";
          }
          return;
        }
        // calc offset of cursor to chart
        let boundingClientRect = event.currentTarget.getBoundingClientRect();
        let actualX = event.pageX - boundingClientRect.left - window.scrollX;
        this.cursorToChartOffset.x = Math.trunc(actualX) / this.zoom;
        let actualY = event.pageY - boundingClientRect.top - window.scrollY;
        this.cursorToChartOffset.y = Math.trunc(actualY) / this.zoom;

        if (this.connectingInfo.source) {
          await this.renderConnections();

          d3.selectAll("#svg .connector").classed("active", true);

          let sourceOffset = this.getNodeConnectorOffset(
            this.connectingInfo.source.id,
            this.connectingInfo.sourcePosition
          );
          let destinationPosition = this.hoveredConnector ? this.hoveredConnector.position : null;
          let line = this.arrowTo(
            sourceOffset.x,
            sourceOffset.y,
            this.cursorToChartOffset.x,
            this.cursorToChartOffset.y,
            this.connectingInfo.sourcePosition,
            destinationPosition
          );
        }
      },
      handleChartMouseDown(event) {
        // 右鍵only
        if (event.which == 1) {
          // this.selectionInfo = { x: event.offsetX, y: event.offsetY };
          // miso 21/11/16 blur
          this.currentNodes.splice(0, this.currentNodes.length);
          this.currentConnections.splice(0, this.currentConnections.length);
          return;
        }
        if (event.which == 2) {
          event.preventDefault();
          this.clientX = event.x;
          this.clientY = event.y;
        }
      },
      renderConnections() {
        let that = this;
        return new Promise(function(resolve) {
          that.$nextTick(function() {
            d3.selectAll("#svg > g.connection").remove();
            // render lines
            that.lines = [];
            that.internalConnections.forEach((conn) => {
              let sourcePosition = that.getNodeConnectorOffset(conn.source.id, conn.sourcePosition);
              let destinationPosition = that.getNodeConnectorOffset(conn.destination.id, conn.destinationPosition);
              // 線段顏色
              let colors = {
                pass: "#449e76",
                reject: "red",
              };
              if (that.currentConnections.filter((item) => item === conn).length > 0) {
                colors = {
                  pass: "#12640a",
                  reject: "darkred",
                };
              }
              let result = that.arrowTo(
                sourcePosition.x,
                sourcePosition.y,
                destinationPosition.x,
                destinationPosition.y,
                conn.sourcePosition,
                conn.destinationPosition,
                colors[conn.type]
              );
              for (const path of result.paths) {
                path.on("mousedown", function() {
                  d3.event.stopPropagation();
                  that.currentNodes.splice(0, that.currentNodes.length);
                  that.currentConnections.splice(0, that.currentConnections.length);
                  that.currentConnections.push(conn);
                });
              }
              for (const line of result.lines) {
                that.lines.push({
                  sourceX: line.sourceX,
                  sourceY: line.sourceY,
                  destinationX: line.destinationX,
                  destinationY: line.destinationY,
                  id: conn.id,
                });
              }
            });
            resolve();
          });
        });
      },
      renderNodes() {
        let that = this;
        return new Promise(function(resolve) {
          d3.selectAll("#svg > g.node").remove();

          // render nodes
          that.internalNodes.forEach((node) => {
            that.renderNode(node, that.currentNodes.filter((item) => item === node).length > 0);
          });

          resolve();
        });
      },
      renderNode(node, isSelected) {
        let that = this;
        let g = that
          .append("g")
          .attr("cursor", "move")
          .classed("node", true);

        node.render = that.render;
        node.render(g, node, isSelected);

        let drag = d3
          .drag()
          .on("start", function() {
            // handle mousedown
            that.selectNode(node);

            for (let currentNode of that.currentNodes) {
              currentNode.tempx = currentNode.x;
              currentNode.tempy = currentNode.y;
            }
          })
          .on("drag", async function() {
            if (that.readonly) {
              return;
            }

            for (let currentNode of that.currentNodes) {
              let x = d3.event.dx;
              currentNode.tempx += x;
              let y = d3.event.dy;
              currentNode.tempy += y;
              currentNode.x = Math.round(Math.round(currentNode.tempx) / 10) * 10;
              currentNode.y = Math.round(Math.round(currentNode.tempy) / 10) * 10;
              that.checkRangeUpdate(currentNode.x, currentNode.y, currentNode.width, currentNode.height);
              let { scrollTop, scrollLeft, offsetHeight, offsetWidth } = that.$el.parentNode;
              offsetWidth /= that.zoom;
              offsetHeight /= that.zoom;
              scrollLeft /= that.zoom;
              scrollTop /= that.zoom;

              if (currentNode.y < scrollTop) {
                that.$el.parentNode.scrollBy(0, -20);
              }
              if (currentNode.x < scrollLeft) {
                that.$el.parentNode.scrollBy(-20, 0);
              }
              if (currentNode.y + currentNode.height > scrollTop + offsetHeight) {
                that.$el.parentNode.scrollBy(0, 20);
              }
              if (currentNode.x + currentNode.width > scrollLeft + offsetWidth) {
                that.$el.parentNode.scrollBy(20, 0);
              }
            }

            d3.selectAll("#svg > g.guideline").remove();
            let edge = that.getCurrentNodesEdge();
            let expectX = Math.round(Math.round(edge.start.x) / 10) * 10;
            let expectY = Math.round(Math.round(edge.start.y) / 10) * 10;
            that.internalNodes.forEach((item) => {
              if (that.currentNodes.filter((currentNode) => currentNode === item).length === 0) {
                if (item.x === expectX) {
                  // vertical guideline
                  if (item.y < expectY) {
                    that.guideLineTo(item.x, item.y + item.height, expectX, expectY);
                  } else {
                    that.guideLineTo(expectX, expectY + item.height, item.x, item.y);
                  }
                }
                if (item.y === expectY) {
                  // horizontal guideline
                  if (item.x < expectX) {
                    that.guideLineTo(item.x + item.width, item.y, expectX, expectY);
                  } else {
                    that.guideLineTo(expectX + item.width, expectY, item.x, item.y);
                  }
                }
              }
            });
          })
          .on("end", function() {
            d3.selectAll("#svg > g.guideline").remove();
            var maxX = 0,
              maxY = 0,
              minX = that.width,
              minY = that.height;
            for (let node of that.internalNodes) {
              maxX = Math.max(node.x, maxX);
              maxY = Math.max(node.y, maxY);
              minX = Math.min(node.x, minX);
              minY = Math.min(node.y, minY);
            }
            let rangeX = maxX - minX;
            let rangeY = maxY - minY;
            let width = Math.ceil(rangeX / unitPx) * unitPx;
            let height = Math.ceil(rangeY / unitPx) * unitPx;
            that.$el.parentNode.scrollBy(-minX + unitPx, -minY + unitPx);
            for (let node of that.internalNodes) {
              that.moveNode(node, -minX + unitPx, -minY + unitPx);
            }
            that.originalWidth = width + 2 * unitPx;
            that.originalHeight = height + 2 * unitPx;
            that.width = Math.max(that.originalWidth * that.zoom, that.$el.parentNode.offsetWidth);
            that.height = Math.max(that.originalHeight * that.zoom, that.$el.parentNode.offsetHeight);
          });
        g.call(drag);
        g.on("mousedown", function() {
          // handle ctrl+mousedown
          // if (!d3.event.ctrlKey) {
          //   return;
          // }
          // miso 21/11/16 拿掉多選功能
          //   let isNotCurrentNode = that.currentNodes.filter((item) => item === node).length === 0;
          //   if (isNotCurrentNode) {
          //     that.currentNodes.push(node);
          //   } else {
          //     that.currentNodes.splice(that.currentNodes.indexOf(node), 1);
          //   }
        });

        let connectors = [];
        let connectorPosition = this.getConnectorPosition(node);
        for (let position in connectorPosition) {
          let positionElement = connectorPosition[position];
          let connector = g
            .append("circle")
            .attr("cx", positionElement.x)
            .attr("cy", positionElement.y)
            .attr("r", 8)
            .attr("class", "connector");
          connector
            .on("mousedown", function() {
              d3.event.stopPropagation();
              if (/*node.type === -1 ||*/ that.readonly) {
                return;
              }
              // Miso 2021/11/30 只能接出一個且不能為結束點
              if (node.to || node.serial === -1) return;
              that.connectingInfo.source = node;
              that.connectingInfo.sourcePosition = position;
            })
            .on("mouseup", function() {
              d3.event.stopPropagation();
              // Miso 2021/11/26 只能接入一個
              that.handleConnect(
                that.connectingInfo && that.connectingInfo.source,
                node,
                that.connectingInfo && that.connectingInfo.sourcePosition,
                position
              );
            })
            .on("mouseover", function() {
              connector.classed("active", true);
            })
            .on("mouseout", function() {
              connector.classed("active", false);
            });
          connectors.push(connector);
        }
        g.on("mouseover", function() {
          connectors.forEach((conn) => conn.classed("active", true));
        }).on("mouseout", function() {
          connectors.forEach((conn) => conn.classed("active", false));
        });
      },
      append(element) {
        let svg = d3.select("#svg");
        return svg.insert(element, ".selection");
      },
      guideLineTo(x1, y1, x2, y2) {
        let g = this.append("g");
        g.classed("guideline", true);
        lineTo(g, x1, y1, x2, y2, 1, "#a3a3a3", [5, 3]);
      },
      arrowTo(x1, y1, x2, y2, startPosition, endPosition, color) {
        let g = this.append("g");
        g.classed("connection", true);
        connect(g, x1, y1, x2, y2, startPosition, endPosition, 2, color || "#a3a3a3", true);
        // a 5px cover to make mouse operation conveniently
        return connect(g, x1, y1, x2, y2, startPosition, endPosition, 5, "transparent", false);
      },
      checkRangeUpdate(x, y, width, height) {
        let el = this.$el;

        let dx = unitPx;
        let dy = unitPx;
        if (x < 0) {
          this.width += dx / this.zoom;
          el.parentNode.scrollBy(dx, 0);
          for (let node of this.internalNodes) {
            this.moveNode(node, dx, 0);
          }
        } else if (x + width > this.width) {
          this.width += dx / this.zoom;
        } else dx = 0;

        if (y < 0) {
          this.height += dy / this.zoom;
          el.parentNode.scrollBy(0, dy);
          for (let node of this.internalNodes) {
            this.moveNode(node, 0, dy);
          }
        } else if (y + height > this.height) {
          this.height += dy / this.zoom;
        } else dy = 0;
      },
      selectNode(node) {
        let isNotCurrentNode = this.currentNodes.filter((item) => item === node).length === 0;
        if (isNotCurrentNode) {
          this.currentConnections.splice(0, this.currentConnections.length);
          this.currentNodes.splice(0, this.currentNodes.length);
          this.currentNodes.push(node);
        }
      },
      async remove() {
        if (this.readonly) {
          return;
        }
        if (this.currentConnections.length > 0) {
          for (let conn of this.currentConnections) {
            this.removeConnection(conn);
          }
          this.currentConnections.splice(0, this.currentConnections.length);
        }
        if (this.currentNodes.length > 0) {
          for (let node of this.currentNodes) {
            this.removeNode(node);
          }
          this.currentNodes.splice(0, this.currentNodes.length);
        }
      },
      removeNode(node) {
        let connections = this.internalConnections.filter(
          (item) => item.source.id === node.id || item.destination.id === node.id
        );
        for (let connection of connections) {
          this.removeConnection(connection);
        }
        this.internalNodes.splice(this.internalNodes.indexOf(node), 1);

        this.$emit("nodeChange");
      },
      removeConnection(conn) {
        conn.source.nextConnection = null;
        conn.source.to = null;
        conn.destination.from = null;
        let index = this.internalConnections.indexOf(conn);
        this.internalConnections.splice(index, 1);

        this.serializeNodes();
        this.$emit("connectionChange");
      },
      moveCurrentNode(x, y) {
        if (this.currentNodes.length > 0 && !this.readonly) {
          for (let node of this.currentNodes) {
            this.moveNode(node, x, y);
          }
        }
      },
      moveNode(node, x, y) {
        if (node.x + x < 0) {
          x = -node.x;
        }
        node.x += x;
        if (node.y + y < 0) {
          y = -node.y;
        }
        node.y += y;
      },
      // Miso 2021/11/26
      handleConnect(source, destination, sourcePosition = "right", destinationPosition = "left") {
        if (
          source &&
          destination &&
          source.id !== destination.id &&
          !source.to &&
          !destination.from &&
          source.serial !== -1 &&
          destination.serial !== 0 &&
          !(source.serial === 0 && destination.serial === -1) // 不能開始連結束
        ) {
          let conn = new Connection(source, sourcePosition, destination, destinationPosition);

          this.internalConnections.push(conn);
          source.to = destination;
          destination.from = source;
          source.nextConnection = conn;
          this.serializeNodes();
          this.$emit("connectionChange");
        }
        this.connectingInfo.source = null;
        this.connectingInfo.sourcePosition = null;
      },
      checkConnection() {
        let node = this.internalNodes.find((t) => t.serial === 0);
        while (node.to) node = node.to;
        return node.serial === -1;
      },
      serializeNodes() {
        let node = this.internalNodes.find((t) => t.serial === 0);
        for (let internalNode of this.internalNodes) {
          if (internalNode.type !== -1) internalNode.serial = null;
        }

        let serial = 0;
        while (node.to) {
          node = node.to;
          if (node.type === -1) {
            node.serial = -1;
            break;
          } else node.serial = ++serial;
        }
      },
      getConnectorPosition(node) {
        const halfWidth = node.width / 2;
        const halfHeight = node.height / 2;
        let top = { x: node.x + halfWidth, y: node.y };
        let left = { x: node.x, y: node.type == -1 ? node.y + halfHeight - 10 : node.y + halfHeight + 10 };
        let bottom = {
          x: node.x + halfWidth,
          y: node.type == -1 ? node.y + node.height - 25 : node.y + node.height + 20,
        };
        let right = {
          x: node.x + node.width,
          y: node.type == -1 ? node.y + halfHeight - 10 : node.y + halfHeight + 10,
        };

        return { left, right, top, bottom };
      },
      getNodeConnectorOffset(nodeId, connectorPosition) {
        let node = this.internalNodes.filter((item) => item.id === nodeId)[0];
        return this.getConnectorPosition(node)[connectorPosition];
      },
      getCurrentNodesEdge() {
        let points = this.currentNodes.map((node) => ({
          x: node.x,
          y: node.y,
        }));
        points.push(
          ...this.currentNodes.map((node) => ({
            x: node.x + node.width,
            y: node.y + node.height,
          }))
        );
        return getEdgeOfPoints(points);
      },
    },
    // 鍵盤指令
    mounted() {
      let that = this;
      // that.init();
      document.onkeydown = function(event) {
        let tagName = event.target.tagName.toLowerCase();
        // 解決在編輯步驟內容的時候，按下按鍵會觸發的Bug
        if (tagName === "input" || tagName === "textarea") return;
        switch (event.keyCode) {
          case 8:
            if (event.ctrlKey) {
              if (that.currentNodes.length > 0 && that.currentNodes[0].id <= 0) {
                return;
              } else if (that.currentConnections.length > 0 && that.currentConnections[0].id <= 0) {
                return;
              } else that.remove();
            }
            break;
          case 27:
            that.currentNodes.splice(0, that.currentNodes.length);
            that.currentConnections.splice(0, that.currentConnections.length);
            break;
          case 37:
            // that.moveCurrentNode(-10, 0);
            break;
          case 38:
            // that.moveCurrentNode(0, -10);
            break;
          case 39:
            // that.moveCurrentNode(10, 0);
            break;
          case 40:
            // that.moveCurrentNode(0, 10);
            break;
          case 46:
            if (that.currentNodes.length > 0 && that.currentNodes[0].type == -1) {
              return;
            } else if (that.currentConnections.length > 0 && that.currentConnections[0].type == -1) {
              return;
            } else that.remove();
            break;
          case 48: // 0
            if (event.ctrlKey) {
              event.preventDefault();
              that.zoom = 1;
            }
            break;
          case 109: // -
          case 189: // -
            if (event.ctrlKey) {
              event.preventDefault();
              that.zoom = Math.round(that.zoom * 10 - 1) / 10;
            }
            break;
          case 107: // +
          case 187: // +
            if (event.ctrlKey) {
              event.preventDefault();
              that.zoom = Math.round(that.zoom * 10 + 1) / 10;
            }
            break;

          // case 65:
          //   if (document.activeElement === document.getElementById("chart")) {
          //     that.currentNodes.splice(0, that.currentNodes.length);
          //     that.currentConnections.splice(0, that.currentConnections.length);
          //     that.currentNodes.push(...that.internalNodes);
          //     that.currentConnections.push(...that.internalConnections);
          //     event.preventDefault();
          //   }
          //   break;
          // case 46:
          //   if (that.currentNodes.length > 0 && that.currentNodes[0].id <= 0) {
          //     return;
          //   } else if (that.currentConnections.length > 0 && that.currentConnections[0].id <= 0) {
          //     return;
          //   } else that.remove();
          //   break;
          default:
            break;
        }
      };
    },
    computed: {
      hoveredConnector() {
        for (const node of this.internalNodes) {
          let connectorPosition = this.getConnectorPosition(node);
          for (let prop in connectorPosition) {
            let entry = connectorPosition[prop];
            if (Math.hypot(entry.x - this.cursorToChartOffset.x, entry.y - this.cursorToChartOffset.y) < 10) {
              return { position: prop, node: node };
            }
          }
        }
        return null;
      },
      hoveredConnection() {
        for (const line of this.lines) {
          let distance = distanceOfPointToLine(
            line.sourceX,
            line.sourceY,
            line.destinationX,
            line.destinationY,
            this.cursorToChartOffset.x,
            this.cursorToChartOffset.y
          );
          if (
            distance < 5 &&
            between(line.sourceX - 2, line.destinationX + 2, this.cursorToChartOffset.x) &&
            between(line.sourceY - 2, line.destinationY + 2, this.cursorToChartOffset.y)
          ) {
            let connections = this.internalConnections.filter((item) => item.id === line.id);
            return connections.length > 0 ? connections[0] : null;
          }
        }
        return null;
      },
      cursor() {
        if (this.connectingInfo.source || this.hoveredConnector) {
          return "crosshair";
        }
        if (this.hoveredConnection != null) {
          return "pointer";
        }
        return null;
      },
    },
    watch: {
      internalNodes: {
        immediate: true,
        deep: true,
        handler() {
          this.renderNodes();
          this.renderConnections();
        },
      },
      internalConnections: {
        immediate: true,
        deep: true,
        handler() {
          this.renderConnections();
        },
      },
      // selectionInfo: {
      //   immediate: true,
      //   deep: true,
      //   handler() {
      //     this.renderSelection();
      //   },
      // },
      currentNodes: {
        immediate: true,
        deep: true,
        handler() {
          setTimeout(() => {
            this.$emit("select", this.currentNodes);
            this.renderNodes();
          }, 1);
        },
      },
      currentConnections: {
        immediate: true,
        deep: true,
        handler() {
          this.renderConnections();
        },
      },
      zoom: {
        immediate: true,
        deep: true,
        handler() {
          if (this.$el) {
            this.width = Math.max(this.originalWidth * this.zoom, this.$el.parentNode.offsetWidth);
            this.height = Math.max(this.originalHeight * this.zoom, this.$el.parentNode.offsetHeight);
          }
        },
      },
      // cursorToChartOffset: {
      //   immediate: true,
      //   deep: true,
      //   handler() {
      //     if (this.selectionInfo) {
      //       this.renderSelection();
      //     }
      //   },
      // },
      connectingInfo: {
        immediate: true,
        deep: true,
        handler() {
          this.renderConnections();
        },
      },
      steps: {
        immediate: true,
        deep: true,
        handler() {
          this.init();
        },
      },
      // nodes: {
      //   immediate: true,
      //   deep: true,
      //   handler() {
      //     this.init();
      //   },
      // },
      // connections: {
      //   immediate: true,
      //   deep: true,
      //   handler() {
      //     this.init();
      //   },
      // },
    },
  };
</script>

<style scoped lang="scss">
  @import "~@/assets/scss/_variables.scss";

  .chart {
    .zoom-ratio {
      position: absolute;
      top: 80px;
      right: 45px;
      font-family: consolas;
    }
  }
</style>
