import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { ShopService } from "../../shop.service";
import domtoimage from "dom-to-image"; //library
import { Observable, Subscription } from "rxjs";

// import { fabric } from 'fabric';

// import 'fabric';

declare const fabric: any; //deklarasifabricjs

@Component({
  selector: "app-custom",
  templateUrl: "./custom.component.html",
  styleUrls: ["./custom.component.css", "./custom.component.scss"],
})
export class CustomComponent implements OnInit {
  params: any;
  itemType: any;
  mySubscription: any;
  canvasClassArea: any;
  totalItem: number = 0;
  itemPrice: number = 0;
  defaultShirtColor: any = "#ffffff";

  product: null;
  totalPrice: number = 0;
  subs = new Subscription();

  itemsData = { price: 0 };

  gradientArray: any[] = [
    { color: "red" },
    { color: "blue" },
    { color: "green" },
    { color: "yellow" },
    { color: "black" },
  ];

  public canvas: any;
  public props: any = {
    canvasFill: "#ffffff",
    canvasImage: "",
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: "",
  };

  public textString: string;
  public url: string = "";
  public size: any = {
    width: 200,
    height: 250,
  };

  public json: any;
  public globalEditor: boolean = false;
  public textEditor: boolean = false;
  public imageEditor: boolean = false;
  public figureEditor: boolean = false;
  public selected: any;

  @Input() heading: string;
  @Input() color: string;
  @Output() event: EventEmitter<string> = new EventEmitter<string>();

  public show = false;
  public defaultColors: string[] = [
    "#0A0B0B",
    "#082467",
    "#800000",
    "#E7A218",
    "#444444",
    "#283812",
    "#332815",
    "#151E33",
    "#E0B1C2",
  ];

  constructor(
    private shopService: ShopService,
    public _orderService: OrderService,
    private _router: Router,
    private _activeRoute: ActivatedRoute
  ) {
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._router.navigated = false;
      }
    });
  }

  ngOnInit() {
    this._activeRoute.queryParams.subscribe((params) => {
      this.params = params;
    });

    this.subs.add(
      this.shopService.stateChanged.subscribe((state) => {
        if (state) {
          this.product = state.product;
          this.totalPrice = this.toRupiah(this.shopService.getTotalPrice());
        }
      })
    );

    let product = null;
    if (this.params.itemType == "t-shirt") {
      this.itemType = "assets/kaosBg.png";
      this.canvasClassArea = "canvas-tShirt-area";
      product = this.katalogItem.SHIRT;
    } else if (this.params.itemType == "hoodie") {
      this.itemType = "assets/hoodieBg.png";
      this.canvasClassArea = "canvas-hoodie-area";
      product = this.katalogItem.SWEATER;
    } else if (this.params.itemType == "tank") {
      this.itemType = "assets/tankBg.png";
      this.canvasClassArea = "canvas-tank-area";
      product = this.katalogItem.TANK_TOP;
    }

    this.shopService.selectProduct(product);

    // console.log(this._activeRoute.component.name);
    //setup front side canvas
    // fabric declaration
    // create new object
    this.canvas = new fabric.Canvas("canvas", {
      //memasukkan objek kanvas dari fabric kedalam variabel kanvas
      hoverCursor: "pointer",
      selection: true,
      selectionBorderColor: "blue",
    });

    this.canvas.on({
      "object:moving": (e) => {
        // this.canvas.border = "5px";
        // // set({strokeWidth: 5, stroke: 'red'});
        //  // this.css('border', 'dashed');
        //  // this.set.selectionBorderColor();
        //  // this.canvasBorderstyle = "2px solid blue";
        //  // console.log(this.canvasBorderstyle);
        //  // this.canvas.wrapperEl.style.borderColor="blue";
        //  // this.canvas.wrapperEl.style.border = "100px";
        //  // console.log(this.canvas.wrapperEl.style.width);
        //  // this.canvas.backgroundColor="red";
        //  // this.canvas.backgroundColor="red";
        //  // this.canvas.contextContainer.canvas.className="canvas-style";
        //  var style = {};
        //  style["border"] = "2px";
        //  this.canvas.style({border:5, borderColor:"red"});
        //  this.canvas.renderAll();
        //  console.log(this.canvas.contextContainer.canvas.className);
      },
      "object:modified": (e) => {},
      "object:selected": (e) => {
        // e.target.set('canvasBorderstyle', ' 2px dashed #d0d0d0');

        let selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== "group" && selectedObject) {
          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case "rect":
            case "circle":
            case "triangle":
              this.figureEditor = true;
              this.getFill();
              break;
            case "i-text":
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case "image":
              break;
          }
        }
      },
      "selection:cleared": (e) => {
        this.selected = null;
        this.resetPanels();
      },
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // get references to the html canvas element & its context
    // this.canvas.on('mouse:down', (e) => {
    // let canvasElement: any = document.getElementById('canvas');
    // console.log(canvasElement)
    // });
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  /*------------------------Shirt Color ------------------------*/
  /**
   * Change color from default colors
   * @param {string} color
   */

  public changeColor(color: string): void {
    this.color = color;
    this.event.emit(this.color);
    this.show = false;
  }

  // *
  //  * Change color from input
  //  * @param {string} colorInputs

  // public changeColorManual(colorInputs: string): void {
  //   const isValid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorInputs);

  //   if (isValid) {
  //     this.color = colorInputs;
  //     this.event.emit(this.color);
  //   }
  // }

  /**
   * Change status of visibility to color picker
   */
  public toggleColors(): void {
    this.show = !this.show;
  }

  /*------------------------Block elements------------------------*/

  //Block "Size"

  changeSize(event: any) {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  //Block "Add text"

  addText() {
    //method
    let textString = this.textString; //pendeklarasian variabel
    let text = new fabric.IText(textString, {
      //pendeklarasian objek text
      left: 10,
      top: 10,
      fontFamily: "helvetica",
      angle: 0,
      fill: "#000000",
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: "",
      hasRotatingPoint: true,
      objectType: "TEXT",
    });
    this.extend(text, this.randomId());
    this.canvas.add(text);
    this.selectItemAfterAdded(text);
    this.textString = "";
  }

  //Block "Add images"

  getImgPolaroid(event: any) {
    let el = event.target;
    fabric.Image.fromURL(el.src, (stiker) => {
      stiker.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
        scaleY: 0.5,
        scaleX: 0.5,
        peloas: 100,
        // width: canvas.getWidth(),
        //    height: canvas.getHeight(),
        originX: "left",
        // scaleX : this.canvas.getWidth()/image.width,   //new update
        // scaleY: this.canvas.getHeight()/image.height,   //new update
        originY: "top",
        objectType: "IMAGE",
      });
      stiker.scaleToWidth(150);
      stiker.scaleToHeight(150);
      this.extend(stiker, this.randomId());
      this.canvas.add(stiker);
      this.selectItemAfterAdded(stiker);
    });
  }

  //Block "Upload Image"

  addImageOnCanvas(url) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true,
          objectType: "CUSTOM_IMAGE",
        });
        image.scaleToWidth(150);
        image.scaleToHeight(150);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target["result"];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = "";
  }

  //Block "Add figure"

  addFigure(figure) {
    let add: any;
    switch (figure) {
      case "rectangle":
        add = new fabric.Rect({
          width: 150,
          height: 50,
          left: 10,
          top: 10,
          angle: 0,
          fill: "#3f51b5",
          objectType: "FIGURE",
        });
        break;
      case "square":
        add = new fabric.Rect({
          width: 100,
          height: 100,
          left: 10,
          top: 10,
          angle: 0,
          fill: "#4caf50",
          objectType: "FIGURE",
        });
        break;
      case "triangle":
        add = new fabric.Triangle({
          width: 100,
          height: 100,
          left: 10,
          top: 10,
          fill: "#2196f3",
          objectType: "FIGURE",
        });
        break;
      case "circle":
        add = new fabric.Circle({
          radius: 50,
          left: 10,
          top: 10,
          fill: "#ff5722",
          objectType: "FIGURE",
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  /*Canvas*/

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id,
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    let self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(
        { source: this.props.canvasImage, repeat: "repeat" },
        function () {
          // self.props.canvasFill = '';
          self.canvas.renderAll();
        }
      );
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  katalogItem: any = {
    SHIRT: {
      type: "SHIRT",
      price: 30000,
    },
    TANK_TOP: {
      type: "TANK_TOP",
      price: 30000,
    },
    SWEATER: {
      type: "SWEATER",
      price: 30000,
    },
    IMAGE: {
      type: "IMAGE",
      price: 30000,
    },
    CUSTOM_IMAGE: {
      type: "CUSTOM_IMAGE",
      price: 30000,
    },
    FIGURE: {
      type: "FIGURE",
      price: 10000,
    },
    TEXT: {
      type: "TEXT",
      price: 10000,
    },
  };

  toRupiah(bilangan: any) {
    var number_string = bilangan.toString(),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{1,3}/gi);

    if (ribuan) {
      var separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
    rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
  }

  addModification(mod) {
    this.shopService.addModification(mod);
  }

  countPrice(item) {
    let hargaBaju = 30000;
    let hargaImage = 30000;
    let hargaCustomImage = 30000;
    let hargaFigure = 10000;
    let hargaText = 10000;
    this.totalItem = this.totalItem + 1;

    if (item == "baju") {
      if (this.itemPrice == 0) {
        this.itemPrice = this.totalItem * hargaBaju;
      } else {
        this.itemPrice = this.itemPrice + hargaBaju;
      }
    } else if (item == "image") {
      if (this.itemPrice == 0) {
        this.itemPrice = this.totalItem * hargaImage;
      } else {
        this.itemPrice = this.itemPrice + hargaImage;
      }
    } else if (item == "text") {
      if (this.itemPrice == 0) {
        this.itemPrice = this.totalItem * hargaText;
      } else {
        this.itemPrice = this.itemPrice + hargaText;
      }
    } else if (item == "customImage") {
      if (this.itemPrice == 0) {
        this.itemPrice = this.totalItem * hargaCustomImage;
      } else {
        this.itemPrice = this.itemPrice + hargaCustomImage;
      }
    } else if (item == "figure") {
      if (this.itemPrice == 0) {
        this.itemPrice = this.totalItem * hargaFigure;
      } else {
        this.itemPrice = this.itemPrice + hargaFigure;
      }
    }

    this.itemsData.price = this.itemPrice;
  }

  addToChart() {
    console.log(this.itemsData);
    this._orderService.addItem(this.itemsData).subscribe(
      (res) => {
        console.log("sukses");
      },
      (err) => console.log(err)
    );
  }

  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return "";

    return object.getSelectionStyles && object.isEditing
      ? object.getSelectionStyles()[styleName] || ""
      : object[styleName] || "";
  }

  setActiveStyle(styleName, value, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    } else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }

  getActiveProp(name) {
    var object = this.canvas.getActiveObject();
    if (!object) return "";

    return object[name] || "";
  }

  setActiveProp(name, value) {
    var object = this.canvas.getActiveObject();
    if (!object) return;
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  clone() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case "rect":
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case "circle":
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case "triangle":
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case "i-text":
          clone = new fabric.IText("", activeObject.toObject());
          break;
        case "image":
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  /*Do rotate*/
  rotate(r) {
    let activeObject = this.canvas.getActiveObject();

    if (activeObject) {
      let rotate;
      let curAngle = activeObject.getAngle();
      rotate = activeObject.setAngle(curAngle + r);

      if (rotate) {
        this.selectItemAfterAdded(rotate);
      }
    }
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    let val = this.props.id;
    let complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle("opacity", null) * 100;
  }

  setOpacity() {
    this.setActiveStyle("opacity", parseInt(this.props.opacity) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle("fill", null);
  }

  setFill() {
    this.setActiveStyle("fill", this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle("lineHeight", null);
  }

  setLineHeight() {
    this.setActiveStyle("lineHeight", parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle("charSpacing", null);
  }

  setCharSpacing() {
    this.setActiveStyle("charSpacing", this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle("fontSize", null);
  }

  setFontSize() {
    this.setActiveStyle("fontSize", parseInt(this.props.fontSize), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle("fontWeight", null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle(
      "fontWeight",
      this.props.fontWeight ? "bold" : "",
      null
    );
  }

  getFontStyle() {
    this.props.fontStyle = this.getActiveStyle("fontStyle", null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    this.setActiveStyle(
      "fontStyle",
      this.props.fontStyle ? "italic" : "",
      null
    );
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle("textDecoration", null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, "g"), "");
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle("textDecoration", this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp("textAlign");
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp("textAlign", this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp("fontFamily");
  }

  setFontFamily() {
    this.setActiveProp("fontFamily", this.props.fontFamily);
  }

  /*System*/

  removeSelected() {
    let activeObject = this.canvas.getActiveObject();

    let activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      this.canvas.remove(activeObject);
      let objectType = activeObject.objectType;
      if (objectType) {
        this.shopService.removeModification(objectType);
      }
    } else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      let self = this;
      objectsInGroup.forEach(function (object) {
        let objectType = object.objectType;
        self.canvas.remove(object);
        if (objectType) {
          this.shopService.removeModification(objectType);
        }
      });
    }
  }

  bringToFront() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      activeObject.bringToFront();
      // activeObject.opacity = 1;
    } else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    let activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      activeObject.sendToBack();
      // activeObject.opacity = 1;
    } else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    if (confirm("Are you sure?")) {
      this.canvas.clear();
      this.itemsData.price = 0;
      this.itemPrice = 0;
      this.totalItem = 0;
    }
  }

  rasterize() {
    /*original code*/
    // if (!fabric.Canvas.supports('toDataURL')) {
    //   alert('This browser doesn\'t provide means to serialize canvas to an image');
    // }
    // else {
    //   console.log(this.canvas.toDataURL('png'))
    //   //window.open(this.canvas.toDataURL('png'));
    //   var image = new Image();
    //   image.src = this.canvas.toDataURL('png')
    //   var w = window.open("");
    //   w.document.write(image.outerHTML);
    // }

    let node = document.getElementById("tshirt-div");
    let border = node.querySelector(".canvas-style");
    border.classList.remove("canvas-style");
    domtoimage
      .toPng(node, { quality: 1.0 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "exportedFile";
        link.href = dataUrl;

        var img = new Image();
        img.src = dataUrl;
        var w = window.open("");
        w.document.body.appendChild(img);

        link.click();
        border.classList.add("canvas-style");
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }

  rasterizeSVG() {
    /*original code*/
    // var w = window.open("");
    // w.document.write(this.canvas.toSVG());

    let node = document.getElementById("tshirt-div");
    let filters = node.tagName !== "i";
    let border = node.querySelector(".canvas-style");
    border.classList.remove("canvas-style");
    domtoimage
      .toSvg(node, { quality: 1.0 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "exportedFile";
        link.href = dataUrl;

        var img = new Image();
        img.src = dataUrl;
        var w = window.open("");
        w.document.body.appendChild(img);

        link.click();
        border.classList.add("canvas-style");
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }

  saveCanvasToJSON() {
    let json = JSON.stringify(this.canvas);
    localStorage.setItem("Kanvas", json);
    console.log("json");
    console.log(json);
  }

  loadCanvasFromJSON() {
    let CANVAS = localStorage.getItem("Kanvas");
    console.log("CANVAS");
    console.log(CANVAS);

    // and load everything from the same json
    this.canvas.loadFromJSON(CANVAS, () => {
      console.log("CANVAS untar");
      console.log(CANVAS);

      // making sure to render canvas at the end
      this.canvas.renderAll();

      // and checking if object's "name" is preserved
      console.log("this.canvas.item(0).name");
      console.log(this.canvas);
    });
  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }
}
