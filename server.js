const express = require("express");
const app = express();
const posts = [];
const Axios = require("axios");
//const firebase = require("firebase-admin");
const path = require("path");
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

var firebaseConfig = {
  apiKey: "AIzaSyBThzaqvVtiOabpHHKc0PXE6lFKYNgS070",
  authDomain: "autocats-shopee-booster.firebaseapp.com",
  databaseURL: "https://autocats-shopee-booster.firebaseio.com",
  projectId: "autocats-shopee-booster",
  storageBucket: "autocats-shopee-booster.appspot.com",
  messagingSenderId: "615830750004",
  appId: "1:615830750004:web:d643b07337565f8bfd1b61",
  measurementId: "G-LQDK1ZHCER",
};

// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

//SIMPLEST
//SPEEDEST
//SINCEREST

function fetchVIPkey(userId) {
  return new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref("users/" + userId)
        .once("value")
        .then(function (snapshot) {
          var vip_key =
            (snapshot.val() && snapshot.val().vip_key) || "Anonymous";
          console.log("snapshot.val()=", snapshot.val());
          console.log("snapshot.val().vip_key=", snapshot.val().vip_key);
          console.log(vip_key);
          resolve("5964F4CB-CA4E4923-91664C27-1FD60082");
        });
    } catch (error) {
      reject(error);
    }
  });
}

// Verify VIP KEY
function verifykey(email, somekey) {
  return new Promise((resolve, reject) => {
    if (typeof somekey === "undefined") {
      //unActivatedContainer.style.display = "block";
      //buttonActive(false);
      console.log("res.lkey showed undefined");
    } else {
      Axios({
        method: "POST",
        url: "https://api.gumroad.com/v2/licenses/verify",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          product_permalink: "nNahx",
          license_key: somekey,
          increment_uses_count: false,
        }),
      })
        .then(function (data) {
          if (
            data.data.success &&
            data.data.purchase.subscription_failed_at === null &&
            data.data.purchase.email === email
          ) {
            //activatedContainer.style.display = "block";
            //getInfo(); //Execute your extension logic
            //buttonActive(true);
            //document.querySelector("#keytext").value =
            data.data.purchase.license_key;
            console.log("Success License");
          } else {
            //unActivatedContainer.style.display = "block";
            //buttonActive(false);
            console.log("Else License");
          }
          console.log("|===");
          //console.log("|Success: " + data.data.success.toString());
          //console.log("|Uses: " + data.data.uses.toString());
          //console.log("|ID: " + data.data.purchase.id);
          //console.log("|Product name: " + data.data.purchase.product_name);
          //console.log("|Created at: " + data.data.purchase.created_at);
          console.log("|Email: " + data.data.purchase.email);
          console.log("|License Key: " + data.data.purchase.license_key);
          console.log("|===");
          //console.log(data);
        })
        .catch(function (err) {
          //buttonActive(false);
          console.log(err);
        });
    }
  });
}

// Check VIP
function checkVIP(userId, email) {
  return new Promise((resolve, reject) => {
    fetchVIPkey(userId).then((result) => {
      console.log("This is key", result);
      verifykey(email, result);
    });
  });
}

//checkVIP("21730081", "klinscgo@gmail.com");

const crypto = require("crypto");
class shopeeShop {
  constructor(shop_id) {
    this.shop_id = parseInt(shop_id);
    this.successReturnUrl = "https://autocats-shopee-booster.web.app";
  }

  addParameters(add = {}) {
    const partner_id = 846805;
    const secretKey =
      "38d63cea6249e558090775ac8cde135205546c09064f6eb13fe0526c541d6d56";
    return Object.assign(
      {
        shopid: this.shop_id,
        partner_id: partner_id,
        secretKey: secretKey,
        timestamp: parseInt(Date.now() / 1000),
      },
      add
    );
  }

  sendRequest(parameters) {
    return new Promise((resolve, reject) => {
      const baseUrl = "https://partner.shopeemobile.com/api/v1/";
      const apiUrl = baseUrl + parameters.action;
      const baseCombination = apiUrl + "|" + JSON.stringify(parameters);
      const encryptedCombination = crypto
        .createHmac("sha256", parameters.secretKey)
        .update(baseCombination)
        .digest("hex");

      Axios({
        method: "post",
        url: "https://partner.shopeemobile.com/api/v1/" + parameters.action,
        headers: {
          "Content-Type": "application/json",
          Authorization: encryptedCombination,
        },
        data: JSON.stringify(parameters),
      })
        .then((data) => {
          resolve(data.data);
        })
        .catch((err) => reject(err));
    });
  }

  createAuthenLink(partnerid, secret, res) {
    return new Promise((resolve, reject) => {
      try {
        const token = crypto
          .createHash("sha256")
          .update(secret + this.successReturnUrl)
          .digest("hex");
        const url =
          "https://partner.shopeemobile.com/api/v1/shop/auth_partner" +
          "?id=" +
          partnerid +
          "&token=" +
          token +
          "&redirect=" +
          this.successReturnUrl;
        resolve(res.json(url));
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  getShopname() {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        shopid: parseInt(this.shop_id),
        action: "shop/get",
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result.shop_name);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getListofNameofItems() {
    const body = addParameters({
      shopid: parseInt(this.shop_id),
      action: "items/get",
    });

    const item_data = await sendRequest(body);
    const id_list = await getItemsIDList(items);
    var name_list = [];

    await getItemsNameList(body, id_list, name_list)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getItemDetails(item_id) {
    return new Promise((resolve, reject) => {
      var body = this.addParameters({
        shopid: parseInt(this.shop_id),
        item_id: item_id,
        action: "item/get",
      });

      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getItemName(body, item_id) {
    return new Promise((resolve, reject) => {
      body.action = "item/get";

      sendRequest(
        Object.assign(body, {
          item_id: item_id,
        })
      )
        .then((result) => {
          result.item.stock != 0 ? resolve(result.item.name) : resolve(null);
          return;
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getItemsNameList(body, id_list, name_box) {
    for (const id of id_list) {
      const value = await getItemName(body, id);
      value ? name_box.push({ id: id, name: value }) : null;
    }
    return name_box;
  }

  getItemsIDList(items) {
    return new Promise((resolve, reject) => {
      try {
        const itemsList = items;
        var id_list = [];
        for (const iterator of itemsList) {
          if (iterator.status == "NORMAL") {
            id_list.push(iterator.item_id);
          }
        }
        resolve(id_list);
      } catch (err) {
        reject(err);
      }
    });
  }

  getItemsData() {
    return new Promise(async (resolve, reject) => {
      var itemsData = [];
      var page = 0;
      var more = true;

      while (more) {
        var body = this.addParameters({
          shopid: parseInt(this.shop_id),
          action: "items/get",
          pagination_offset: page,
          pagination_entries_per_page: 100,
        });

        await this.sendRequest(body)
          .then((result) => {
            more = result.more;
            itemsData.push(result.items);
            if (more) {
              page += 1;
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
      resolve(itemsData[0]);
    });
  }

  getShopDetails() {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        shopid: parseInt(this.shop_id),
        action: "shop/get",
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getBoostedTime() {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        shopid: parseInt(this.shop_id),
        action: "items/get_boosted",
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getOrdersList(days = 15) {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "orders/basics",
        update_time_from: parseInt(Date.now() / 1000 - 60 * 60 * 24 * days),
        update_time_to: parseInt(Date.now() / 1000),
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getOrdersByStatus(status = "ALL", days = 15) {
    return new Promise((resolve, reject) => {
      //ALL/UNPAID/READY_TO_SHIP/COMPLETED/IN_CANCEL/CANCELLED/TO_RETURN
      const body = this.addParameters({
        action: "orders/get",
        create_time_from: parseInt(Date.now() / 1000 - 60 * 60 * 24 * days),
        create_time_to: parseInt(Date.now() / 1000),
        order_status: status,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getOrderDetails(ordersn_list = []) {
    return new Promise((resolve, reject) => {
      //ALL/UNPAID/READY_TO_SHIP/COMPLETED/IN_CANCEL/CANCELLED/TO_RETURN
      const body = this.addParameters({
        action: "orders/detail",
        ordersn_list: ordersn_list,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getEscrowDetails(ordersn = "") {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "orders/my_income",
        ordersn: ordersn,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getParameterForInit(ordersn = "") {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "logistics/init_parameter/get",
        ordersn: ordersn,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getAddress() {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "logistics/address/get",
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getTimeSlot(ordersn = "", address_id = 0) {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "logistics/timeslot/get",
        ordersn: ordersn,
        address_id: address_id,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getLogisticInfo(ordersn = "") {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "logistics/init_info/get",
        ordersn: ordersn,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  initPickupLogistic(ordersn = "", pickup = {}) {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "logistics/init",
        ordersn: ordersn,
        pickup: pickup,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  initDropoffLogistic(ordersn = "", dropoff = {}) {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "logistics/init",
        ordersn: ordersn,
        dropoff: dropoff,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getAirwayBill(ordersn_list = []) {
    return new Promise((resolve, reject) => {
      const body = this.addParameters({
        action: "logistics/airway_bill/get_mass",
        ordersn_list: ordersn_list,
      });
      this.sendRequest(body)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

class shopeeOrder {
  constructor(ordersn) {
    this.ordersn = ordersn;
  }
}

const PDFMerger = require("pdf-merger-js");

async function run() {
  var merger = new PDFMerger();
  const shop = new shopeeShop("115199369");
  console.log(shop);

  const orders = await shop.getOrdersByStatus("READY_TO_SHIP", 3);
  console.log(orders);

  const ordersn_list = await orders.orders.map((order) => order.ordersn);
  console.log(ordersn_list);

  // const order_detail = await shop.getOrderDetails(ordersn_list);
  // console.log(order_detail);

  // const ungenerated_orders = await order_detail.orders.filter(
  //   (order) => order.tracking_no === ""
  // );

  // console.log(ungenerated_orders);

  // const address_list = await shop.getAddress();
  // //console.log(address_list.address_list);

  // const pickup_address = await address_list.address_list.filter((address) =>
  //   address.address_flag.includes("pickup_address")
  // )[0];
  // //console.log(pickup_address);

  // const pickup_times = await shop.getTimeSlot(
  //   ungenerated_orders[0].ordersn,
  //   pickup_address.address_id
  // );
  // console.log(pickup_times);

  // const selected_pickup_time = await pickup_times.pickup_time.filter(
  //   (pickup_time) =>
  //     new Date(pickup_time.date * 1000).getDate() - new Date().getDate() >= 1
  // )[0];
  // console.log(selected_pickup_time);
  // console.log(
  //   selected_pickup_time,
  //   "as",
  //   new Date(selected_pickup_time.date * 1000).toLocaleDateString()
  // );

  // const initDetails = await shop.initPickupLogistic(
  //   ungenerated_orders[0].ordersn,
  //   {
  //     address_id: pickup_address.address_id,
  //     pickup_time_id: selected_pickup_time.pickup_time_id,
  //   }
  // );
  // console.log(initDetails);

  const airwayBills = await shop.getAirwayBill(ordersn_list);
  console.log(airwayBills.result.airway_bills);

  // (async () => {
  //   merger.add(airwayBills.result.airway_bills[0].airway_bill + ".pdf"); //merge all pages. parameter is the path to file and filename.
  //   merger.add(airwayBills.result.airway_bills[1].airway_bill + ".pdf"); // merge only page 2

  //   await merger.save("merged.pdf"); //save under given name
  // })();
}

run();

app.listen(3000);
