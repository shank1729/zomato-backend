const RestaurantModel = require("../models/RestaurantModel");
const restaurantList = require("../resources/restaurant.json");
let RestaurantController = {
  getRestaurantList: async (req, res) => {
    try {
      let result = await RestaurantModel.find();
      res.status(200).send({
        status: true,
        restaurant: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }

  },
  addRestaurantList: async (req, res) => {
    try {
      let result = await RestaurantModel.insertMany(restaurantList);
      res.status(200).send({
        status: true,
        message: "added successfully",
        result: result,
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  filterRestaurant: async (request, response) => {

    let { mealtype, location, cuisine, lcost, hcost, page, sort } = request.body;
    sort = sort ? sort : 1;
    page = page ? page : 1;
    let itemsPerPage = 2;

    let startingIndex = page * itemsPerPage - itemsPerPage;
    let lastIndex = page * itemsPerPage;

    let filterObject = {};

    if (mealtype) filterObject["mealtype_id"] = mealtype;
    if (location) filterObject["location_id"] = location;
    if (lcost && hcost) filterObject["min_price"] = { $lte: hcost, $gte: lcost };
    cuisine && (filterObject["cuisine_id"] = { $in: cuisine });

    try {
      let result = await RestaurantModel.find(filterObject,{
        aggregate_rating:1,
        city:1,
        image:1,
        locality:1,
        name:1,
        min_price:1,
        cuisine:1,
      }).sort({
        min_price: sort,
      });
      const filterResult = result.slice(startingIndex, lastIndex)
      response.status(200).send({
        status: true,
        result:filterResult,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  getRestaurantDetailsById: async function (request, response) {
    try {
      let { id } = request.params;
      let data = await RestaurantModel.findById(id);
      response.status(200).send({
        status: true,
        result: data,
      });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  },
  getRestaurantLocationId: async function (request, response) {
    let { lid, rest } = request.query;

    try {
      let data = await RestaurantModel.find(
        {
          name: { $regex: rest + ".*", $options: "i" },
          location_id: Number(lid),
        },
        { name: 1, image: 1, locality: 1, _id: 1, city: 1 }
      );
      response.status(200).send({ status: true, result: data });
    } catch (error) {
      response.status(500).send({
        status: false,
        message: "server error",
        error,
      });
    }
  }
};



module.exports = RestaurantController;