import { Router } from 'express';
import Airport from '../modules/airport/airport.model';
import routes from '../constants/routes';
import { AirportType } from '../modules/airport/airport.types';

const router = Router();

router.route(routes.AIRPORTS).get(async (req, res) => {
  try {
    const airport: AirportType[] = await Airport.find();
    res.status(200).send(airport);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.route(routes.AIRPORTS).post(async (req, res) => {
  const airportData = new Airport(req.body);
  try {
    const airport: AirportType = await airportData.save();
    res.status(200).send(airport);
  } catch (e) {
    console.log(e);    
  }
})

router.route(`${routes.AIRPORTS}/:id`).get(async (req, res) => {
  const _id = req.params.id;
  try {
    const existingAirport = await Airport.findById(_id);
    if (!existingAirport) {
      return res.status(404).send();
    }
    res.status(200).send(existingAirport);
  } catch (e) {
    res.status(400).send(e)
  }
})

router.route(`${routes.AIRPORTS}/:id`).delete(async (req, res) => {
  const _id = req.params.id;
  try {
    const existingAirport = await Airport.findById(_id);
    
    if (!existingAirport) {
      return res.status(404).send();
    }
    await Airport.deleteOne({ _id });
    res.status(204).send();
  } catch (e) {
    res.status(400).send(e);
  }
})

router.route(`${routes.AIRPORTS}/:id`).patch(async (req, res) => {
  const _id = req.params.id;
  const airportData = req.body;
  console.log(airportData);
  
  // const updates = Object.keys(airportData);
  // const alloweUpdates = ['name', 'address'];
  // const isValidOperation = updates.every(update =>alloweUpdates.includes(update));
  // if (!isValidOperation) {
  //   res.status(400).send()
  // }
  try {
    const update = await Airport.updateOne({_id}, {$set: airportData}, {multi: true});
    console.log(update);
    const updatedAirport = await Airport.findById(_id);
    console.log(updatedAirport);
    if (!updatedAirport) {
      return res.status(404).send();
    }
    // updates.forEach((update) => existingAirport[update] = req.body[update]);
    // const updatedAirport = await existingAirport.save();
    res.status(200).send(updatedAirport);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
})

export default router;
