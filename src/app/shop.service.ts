import { Injectable } from "@angular/core";
import { StoreState, Product, Mods } from "./data/meta";
import { Observable, of } from "rxjs";
import { ObservableStore } from "@codewithdan/observable-store";

@Injectable({
  providedIn: "root",
})
export class ShopService extends ObservableStore<any> {
  constructor() {
    const initialState = {
      product: null,
      mods: [],
      totalPrice: 0,
    };
    super({ trackStateHistory: false });
    this.setState(initialState, "INITIALIZE_STATE");
  }

  addModification(mod: any) {
    let state = this.getState();
    state.mods.push(mod);
    this.setState({ mods: state.mods }, "ADD_MODIFICATIONS");
  }

  removeModification(type: any) {
    let state = this.getState();
    let mods = state.mods;
    mods.splice(
      mods.findIndex((item) => {
        return item.type === type;
      }),
      1
    );
    this.setState({ mods: mods }, "REMOVE_MODIFICATIONS");
  }

  cleanModification() {
    this.setState({ mods: [] }, "CLEAN_MODIFICATIONS");
  }

  reinit() {
    const initialState = {
      product: null,
      mods: [],
      totalPrice: 0,
    };
    this.setState(initialState, "INITIALIZE_STATE");
  }

  getProduct() {
    const product = this.getState().product;
    if (product) {
      return of(product);
    } else {
      return of(null);
    }
  }

  selectProduct(product: any) {
    let state = this.getState();
    state.product = product;
    this.setState({ product: state.product }, "SET_PRODUCT");
  }

  getTotalPrice() {
    let price = 0;
    const state = this.getState();
    if (state && state.product) {
      price = price + state.product.price;
    }
    const mods = state.mods;
    if (mods) {
      mods.forEach((mod) => {
        if (mod.price) price = price + mod.price;
      });
    }
    return price;
  }
}
