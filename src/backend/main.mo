import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState); // Corrected placement of MixinAuthorization
  include MixinStorage();

  module Product {
    public func compareByName(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.name, product2.name);
    };

    public func compareByPrice(product1 : Product, product2 : Product) : Order.Order {
      if (product1.price < product2.price) { #less } else if (product1.price > product2.price) {
        #greater;
      } else { #equal };
    };
  };

  public type Product = {
    id : Text;
    name : Text;
    price : Nat;
    image : Storage.ExternalBlob;
  };

  let products = Map.empty<Text, Product>();
  let userCarts = Map.empty<Principal, List.List<Text>>();

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    if (products.get(product.id) != null) {
      Runtime.trap("Product already exists");
    };
    products.add(product.id, product);
  };

  public query ({ caller }) func listProducts() : async [Product] {
    products.values().toArray().sort(Product.compareByName);
  };

  public query ({ caller }) func listProductsByPrice() : async [Product] {
    products.values().toArray().sort(Product.compareByPrice);
  };

  public shared ({ caller }) func addToCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add to cart");
    };
    let cart = switch (userCarts.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?existingCart) { existingCart };
    };

    cart.add(productId);
    userCarts.add(caller, cart);
  };

  public query ({ caller }) func viewCart() : async [Text] {
    switch (userCarts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove from cart");
    };
    let cart = switch (userCarts.get(caller)) {
      case (null) { List.empty<Text>() };
      case (?existingCart) { existingCart };
    };

    let newCart = cart.filter(func(id) { id != productId });
    userCarts.add(caller, newCart);
  };

  public query ({ caller }) func getProductById(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func checkout() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can checkout");
    };
    switch (userCarts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?_) { userCarts.remove(caller) };
    };
  };
};
